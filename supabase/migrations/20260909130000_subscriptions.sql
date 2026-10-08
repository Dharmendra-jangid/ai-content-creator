-- Subscription catalog and Razorpay-ready billing tables.
-- Apply after 20260909120000_credits.sql.
-- Clients cannot write subscriptions, checkout intents, or webhook events.

alter table public.plans
  add column if not exists amount_paise integer not null default 0,
  add column if not exists currency text not null default 'INR',
  add column if not exists billing_interval text not null default 'month',
  add column if not exists razorpay_plan_id text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_public boolean not null default true;

alter table public.plans drop column if exists stripe_price_id;

insert into public.plans (
  id,
  display_name,
  monthly_credits,
  amount_paise,
  currency,
  billing_interval,
  sort_order,
  is_public
)
values
  ('free', 'Free', 10, 0, 'INR', 'month', 0, true),
  ('pro', 'Pro', 500, 149900, 'INR', 'month', 1, true),
  ('business', 'Business', 2500, 499900, 'INR', 'month', 2, true)
on conflict (id) do update
set
  display_name = excluded.display_name,
  monthly_credits = excluded.monthly_credits,
  amount_paise = excluded.amount_paise,
  currency = excluded.currency,
  billing_interval = excluded.billing_interval,
  sort_order = excluded.sort_order,
  is_public = excluded.is_public;

alter table public.subscriptions
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists amount_paise integer,
  add column if not exists currency text not null default 'INR';

alter table public.subscriptions drop constraint if exists subscriptions_status_check;
alter table public.subscriptions
  add constraint subscriptions_status_check
  check (status in (
    'inactive',
    'incomplete',
    'active',
    'past_due',
    'canceled',
    'expired'
  ));

update public.subscriptions
set provider = 'razorpay'
where provider is null or provider = '';

create unique index if not exists subscriptions_one_active_per_user
  on public.subscriptions (user_id)
  where status = 'active';

create table if not exists public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  provider text not null default 'razorpay',
  provider_customer_id text,
  email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (provider, provider_customer_id)
);

create table if not exists public.checkout_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null references public.plans (id),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'paid', 'failed', 'expired', 'aborted')),
  provider text not null default 'razorpay',
  amount_paise integer not null check (amount_paise >= 0),
  currency text not null default 'INR',
  provider_order_id text,
  provider_payment_id text,
  provider_subscription_id text,
  expires_at timestamptz not null default timezone('utc', now()) + interval '30 minutes',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists checkout_intents_user_id_idx
  on public.checkout_intents (user_id, created_at desc);

create table if not exists public.billing_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  provider_event_id text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed boolean not null default false,
  processed_at timestamptz,
  error text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (provider, provider_event_id)
);

create or replace function public.plan_rank(p_plan_id text)
returns integer
language sql
immutable
as $$
  select case p_plan_id
    when 'free' then 0
    when 'pro' then 1
    when 'business' then 2
    else -1
  end;
$$;

create or replace function public.entitled_plan_id(p_user_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan text;
begin
  select s.plan_id
    into v_plan
  from public.subscriptions s
  where s.user_id = p_user_id
    and s.status = 'active'
    and (s.current_period_end is null or s.current_period_end > timezone('utc', now()))
  order by s.current_period_end desc nulls last, s.updated_at desc
  limit 1;

  if v_plan is not null then
    return v_plan;
  end if;

  select p.plan_id into v_plan
  from public.profiles p
  where p.id = p_user_id;

  return coalesce(v_plan, 'free');
end;
$$;

create or replace function public.credit_snapshot_for(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_limit integer;
  v_used integer;
  v_period date := public.current_credit_period_start();
begin
  v_plan := public.entitled_plan_id(p_user_id);

  select pl.monthly_credits
    into v_limit
  from public.plans pl
  where pl.id = v_plan;

  if v_limit is null then
    return null;
  end if;

  select coalesce(sum(u.credits), 0)::integer
    into v_used
  from public.credit_usage u
  where u.user_id = p_user_id
    and u.period_start = v_period;

  return jsonb_build_object(
    'credits_remaining', greatest(v_limit - v_used, 0),
    'credits_limit', v_limit,
    'credits_used', v_used,
    'plan_id', v_plan,
    'period_start', v_period,
    'usage_id', null
  );
end;
$$;

create or replace function public.consume_generation_credit()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_plan text;
  v_limit integer;
  v_used integer;
  v_cost integer := 1;
  v_period date := public.current_credit_period_start();
  v_usage_id uuid;
begin
  if v_user_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  perform public.ensure_profile(v_user_id);

  perform 1
  from public.profiles p
  where p.id = v_user_id
  for update;

  v_plan := public.entitled_plan_id(v_user_id);

  select pl.monthly_credits
    into v_limit
  from public.plans pl
  where pl.id = v_plan;

  if v_limit is null then
    raise exception 'PROFILE_MISSING' using errcode = 'P0001';
  end if;

  select coalesce(sum(u.credits), 0)::integer
    into v_used
  from public.credit_usage u
  where u.user_id = v_user_id
    and u.period_start = v_period;

  if v_used + v_cost > v_limit then
    raise exception 'INSUFFICIENT_CREDITS' using errcode = 'P0001';
  end if;

  insert into public.credit_usage (user_id, credits, reason, period_start)
  values (v_user_id, v_cost, 'generation', v_period)
  returning id into v_usage_id;

  return jsonb_build_object(
    'credits_remaining', v_limit - v_used - v_cost,
    'credits_limit', v_limit,
    'credits_used', v_used + v_cost,
    'plan_id', v_plan,
    'period_start', v_period,
    'usage_id', v_usage_id
  );
end;
$$;

create or replace function public.get_my_subscription()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_plan text;
  v_limit integer;
  v_status text := 'none';
  v_provider text;
  v_period_start timestamptz;
  v_period_end timestamptz;
  v_cancel boolean := false;
begin
  if v_user_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  perform public.ensure_profile(v_user_id);
  v_plan := public.entitled_plan_id(v_user_id);

  select pl.monthly_credits into v_limit
  from public.plans pl
  where pl.id = v_plan;

  select
    s.status,
    s.provider,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end
    into v_status, v_provider, v_period_start, v_period_end, v_cancel
  from public.subscriptions s
  where s.user_id = v_user_id
    and s.status in ('incomplete', 'active', 'past_due', 'canceled', 'expired')
  order by
    case s.status
      when 'active' then 0
      when 'past_due' then 1
      when 'incomplete' then 2
      else 3
    end,
    s.updated_at desc
  limit 1;

  if v_status is null then
    v_status := 'none';
  end if;

  return jsonb_build_object(
    'plan_id', v_plan,
    'credits_limit', v_limit,
    'status', v_status,
    'provider', v_provider,
    'current_period_start', v_period_start,
    'current_period_end', v_period_end,
    'cancel_at_period_end', coalesce(v_cancel, false)
  );
end;
$$;

create or replace function public.create_checkout_intent(p_plan_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_current text;
  v_amount integer;
  v_currency text;
  v_intent_id uuid;
begin
  if v_user_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  if public.plan_rank(p_plan_id) < 1 then
    raise exception 'CHECKOUT_FREE_FORBIDDEN' using errcode = 'P0001';
  end if;

  perform public.ensure_profile(v_user_id);
  v_current := public.entitled_plan_id(v_user_id);

  if public.plan_rank(p_plan_id) = public.plan_rank(v_current) then
    raise exception 'ALREADY_ON_PLAN' using errcode = 'P0001';
  end if;

  if public.plan_rank(p_plan_id) < public.plan_rank(v_current) then
    raise exception 'DOWNGRADE_NOT_ALLOWED' using errcode = 'P0001';
  end if;

  select pl.amount_paise, pl.currency
    into v_amount, v_currency
  from public.plans pl
  where pl.id = p_plan_id
    and pl.is_public = true;

  if v_amount is null then
    raise exception 'INVALID_PLAN' using errcode = 'P0001';
  end if;

  update public.checkout_intents
  set
    status = 'aborted',
    updated_at = timezone('utc', now())
  where user_id = v_user_id
    and status = 'pending';

  insert into public.checkout_intents (
    user_id,
    plan_id,
    status,
    provider,
    amount_paise,
    currency
  )
  values (
    v_user_id,
    p_plan_id,
    'pending',
    'razorpay',
    v_amount,
    coalesce(v_currency, 'INR')
  )
  returning id into v_intent_id;

  return jsonb_build_object(
    'id', v_intent_id,
    'plan_id', p_plan_id,
    'status', 'pending',
    'provider', 'razorpay',
    'amount_paise', v_amount,
    'currency', coalesce(v_currency, 'INR')
  );
end;
$$;

-- Entitlements are applied later by a verified Razorpay webhook using a
-- server-only service role. Authenticated clients must not call this.
create or replace function public.apply_paid_entitlement(
  p_user_id uuid,
  p_plan_id text,
  p_status text,
  p_provider_subscription_id text,
  p_provider_customer_id text,
  p_period_start timestamptz,
  p_period_end timestamptz,
  p_amount_paise integer,
  p_currency text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.plan_rank(p_plan_id) < 1 then
    raise exception 'INVALID_PLAN' using errcode = 'P0001';
  end if;

  perform public.ensure_profile(p_user_id);

  insert into public.profiles (id, plan_id)
  values (p_user_id, p_plan_id)
  on conflict (id) do update
  set
    plan_id = excluded.plan_id,
    updated_at = timezone('utc', now());

  update public.subscriptions
  set status = 'canceled',
      updated_at = timezone('utc', now())
  where user_id = p_user_id
    and status = 'active'
    and (p_provider_subscription_id is null
      or provider_subscription_id is distinct from p_provider_subscription_id);

  insert into public.subscriptions (
    user_id,
    plan_id,
    status,
    provider,
    provider_customer_id,
    provider_subscription_id,
    current_period_start,
    current_period_end,
    amount_paise,
    currency
  )
  values (
    p_user_id,
    p_plan_id,
    p_status,
    'razorpay',
    p_provider_customer_id,
    p_provider_subscription_id,
    p_period_start,
    p_period_end,
    p_amount_paise,
    coalesce(p_currency, 'INR')
  )
  on conflict (provider_subscription_id) do update
  set
    plan_id = excluded.plan_id,
    status = excluded.status,
    current_period_start = excluded.current_period_start,
    current_period_end = excluded.current_period_end,
    amount_paise = excluded.amount_paise,
    currency = excluded.currency,
    updated_at = timezone('utc', now());
end;
$$;

alter table public.billing_customers enable row level security;
alter table public.checkout_intents enable row level security;
alter table public.billing_webhook_events enable row level security;

drop policy if exists "users read own billing customer" on public.billing_customers;
create policy "users read own billing customer"
  on public.billing_customers
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "users read own checkout intents" on public.checkout_intents;
create policy "users read own checkout intents"
  on public.checkout_intents
  for select
  to authenticated
  using (user_id = auth.uid());

revoke all on table public.billing_customers from anon, authenticated;
revoke all on table public.checkout_intents from anon, authenticated;
revoke all on table public.billing_webhook_events from public, anon, authenticated;

grant select on table public.billing_customers to authenticated;
grant select on table public.checkout_intents to authenticated;

revoke all on function public.plan_rank(text) from public, anon, authenticated;
revoke all on function public.entitled_plan_id(uuid) from public, anon, authenticated;
revoke all on function public.apply_paid_entitlement(uuid, text, text, text, text, timestamptz, timestamptz, integer, text) from public, anon, authenticated;
revoke all on function public.get_my_subscription() from public, anon;
revoke all on function public.create_checkout_intent(text) from public, anon;

grant execute on function public.get_my_subscription() to authenticated;
grant execute on function public.create_checkout_intent(text) to authenticated;
