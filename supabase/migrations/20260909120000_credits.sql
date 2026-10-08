-- Credits and plan catalog for Aurateria.
-- Apply in the Supabase SQL editor (or via CLI migration).
-- Clients can read their own snapshot; they cannot insert, update, or delete credits.

create table if not exists public.plans (
  id text primary key,
  display_name text not null,
  monthly_credits integer not null check (monthly_credits >= 0),
  stripe_price_id text,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.plans (id, display_name, monthly_credits)
values
  ('free', 'Free', 10),
  ('pro', 'Pro', 500)
on conflict (id) do update
set
  display_name = excluded.display_name,
  monthly_credits = excluded.monthly_credits;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  plan_id text not null default 'free' references public.plans (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.credit_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  credits integer not null default 1 check (credits > 0),
  reason text not null default 'generation',
  period_start date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists credit_usage_user_period_idx
  on public.credit_usage (user_id, period_start);

-- Future Stripe / Lemon Squeezy webhooks can write this table with a service role.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null references public.plans (id),
  status text not null default 'inactive'
    check (status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (provider_subscription_id)
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

create or replace function public.current_credit_period_start()
returns date
language sql
stable
as $$
  select date_trunc('month', timezone('utc', now()))::date;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, plan_id)
  values (new.id, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.ensure_profile(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, plan_id)
  values (p_user_id, 'free')
  on conflict (id) do nothing;
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
  select p.plan_id, pl.monthly_credits
    into v_plan, v_limit
  from public.profiles p
  join public.plans pl on pl.id = p.plan_id
  where p.id = p_user_id;

  if not found then
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

create or replace function public.get_my_credits()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_snapshot jsonb;
begin
  if v_user_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  perform public.ensure_profile(v_user_id);
  v_snapshot := public.credit_snapshot_for(v_user_id);

  if v_snapshot is null then
    raise exception 'PROFILE_MISSING' using errcode = 'P0001';
  end if;

  return v_snapshot;
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

  select p.plan_id, pl.monthly_credits
    into v_plan, v_limit
  from public.profiles p
  join public.plans pl on pl.id = p.plan_id
  where p.id = v_user_id
  for update of p;

  if not found then
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

create or replace function public.refund_generation_credit(p_usage_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_deleted uuid;
begin
  if v_user_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  delete from public.credit_usage
  where id = p_usage_id
    and user_id = v_user_id
    and reason = 'generation'
    and created_at > timezone('utc', now()) - interval '15 minutes'
  returning id into v_deleted;

  if v_deleted is null then
    raise exception 'CREDIT_REFUND_FAILED' using errcode = 'P0001';
  end if;

  return public.credit_snapshot_for(v_user_id);
end;
$$;

alter table public.plans enable row level security;
alter table public.profiles enable row level security;
alter table public.credit_usage enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "plans are readable" on public.plans;
create policy "plans are readable"
  on public.plans
  for select
  to authenticated, anon
  using (true);

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "users read own subscriptions" on public.subscriptions;
create policy "users read own subscriptions"
  on public.subscriptions
  for select
  to authenticated
  using (user_id = auth.uid());

-- No insert/update/delete policies on profiles, credit_usage, or subscriptions.
-- Writes go through security definer functions (or a future billing webhook).

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.credit_usage from anon, authenticated;
revoke all on table public.subscriptions from anon, authenticated;
revoke all on table public.plans from anon, authenticated;

grant select on table public.plans to anon, authenticated;
grant select on table public.profiles to authenticated;
grant select on table public.subscriptions to authenticated;
-- credit_usage is intentionally not selectable by the client.

revoke all on function public.current_credit_period_start() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.ensure_profile(uuid) from public, anon, authenticated;
revoke all on function public.credit_snapshot_for(uuid) from public, anon, authenticated;
revoke all on function public.get_my_credits() from public, anon;
revoke all on function public.consume_generation_credit() from public, anon;
revoke all on function public.refund_generation_credit(uuid) from public, anon;

grant execute on function public.get_my_credits() to authenticated;
grant execute on function public.consume_generation_credit() to authenticated;
grant execute on function public.refund_generation_credit(uuid) to authenticated;

-- Existing auth users created before this migration.
insert into public.profiles (id, plan_id)
select id, 'free'
from auth.users
on conflict (id) do nothing;
