-- Production grant hardening.
-- Apply after 20260909120000_credits.sql and 20260909130000_subscriptions.sql.
-- Does not weaken RLS. Clients still cannot write credits, plans, or entitlements.

revoke all on table public.plans from public;
revoke all on table public.profiles from public;
revoke all on table public.credit_usage from public;
revoke all on table public.subscriptions from public;
revoke all on table public.billing_customers from public;
revoke all on table public.checkout_intents from public;
revoke all on table public.billing_webhook_events from public;

grant select on table public.plans to anon, authenticated;
grant select on table public.profiles to authenticated;
grant select on table public.subscriptions to authenticated;
grant select on table public.billing_customers to authenticated;
grant select on table public.checkout_intents to authenticated;

drop policy if exists "plans are readable" on public.plans;
create policy "plans are readable"
  on public.plans
  for select
  to authenticated, anon
  using (is_public = true);

revoke all on function public.apply_paid_entitlement(
  uuid, text, text, text, text, timestamptz, timestamptz, integer, text
) from public, anon, authenticated;

revoke all on function public.entitled_plan_id(uuid) from public, anon, authenticated;
revoke all on function public.credit_snapshot_for(uuid) from public, anon, authenticated;
revoke all on function public.ensure_profile(uuid) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
