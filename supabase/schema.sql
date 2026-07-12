-- Wafra — database schema (hardened)
-- Run this in your Supabase project: SQL Editor → New query → paste → Run
--
-- SECURITY MODEL
-- The browser can only ever READ its own rows (accounts, transactions, goals).
-- It can NEVER write to them directly — every mutation (transfer, add a goal,
-- account seeding on signup) goes through a SECURITY DEFINER Postgres
-- function that validates the request server-side before touching data.
-- This is the same principle real banking systems use: never trust the
-- client to write financial data — only trusted, audited server-side code
-- may do so, no matter what a user's browser sends.

-- 1. Accounts (multi-currency balances per user)
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  currency text not null,
  balance numeric not null default 0 check (balance >= 0),
  created_at timestamptz default now(),
  unique (user_id, currency)
);

-- 2. Transactions — append-only ledger, never updated or deleted, so it
-- always reflects a true audit trail of what actually happened.
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text not null check (category in ('food','shopping','transport','bills','other')),
  amount numeric not null check (amount > 0),
  direction text not null check (direction in ('in','out')),
  occurred_at date not null default current_date,
  created_at timestamptz default now(),
  -- Prevents the same transfer being double-processed if a request is
  -- retried (flaky network, accidental double-click, etc.)
  idempotency_key text
);

create unique index if not exists transactions_user_idempotency_key
  on public.transactions (user_id, idempotency_key)
  where idempotency_key is not null;

-- 3. Savings goals
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  target numeric not null check (target > 0),
  saved numeric not null default 0 check (saved >= 0),
  currency text not null default 'SAR',
  created_at timestamptz default now()
);

-- Row Level Security: read-only from the client, scoped to the owner.
-- No insert/update/delete policy exists for any role but the table owner —
-- meaning the browser cannot write to these tables under any circumstances,
-- even with a valid session, even via devtools. Only the SECURITY DEFINER
-- functions below (which run as the table owner) can write.
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;

drop policy if exists "Users manage own accounts" on public.accounts;
drop policy if exists "Users read own accounts" on public.accounts;
create policy "Users read own accounts" on public.accounts
  for select using (auth.uid() = user_id);

drop policy if exists "Users manage own transactions" on public.transactions;
drop policy if exists "Users read own transactions" on public.transactions;
create policy "Users read own transactions" on public.transactions
  for select using (auth.uid() = user_id);

drop policy if exists "Users manage own goals" on public.goals;
drop policy if exists "Users read own goals" on public.goals;
create policy "Users read own goals" on public.goals
  for select using (auth.uid() = user_id);

-- Auto-seed a new user with starter accounts + a welcome transaction + a
-- sample goal. SECURITY DEFINER: runs with the privileges of the function's
-- owner, which is how it's allowed to insert despite the read-only policies
-- above — this is the standard, safe Postgres pattern for controlled writes.
create or replace function public.handle_new_wafra_user()
returns trigger as $$
begin
  insert into public.accounts (user_id, currency, balance) values
    (new.id, 'SAR', 5000),
    (new.id, 'AED', 0),
    (new.id, 'USD', 0);

  insert into public.transactions (user_id, name, category, amount, direction, occurred_at) values
    (new.id, 'Wafra Welcome Bonus', 'other', 5000, 'in', current_date);

  insert into public.goals (user_id, name, target, saved, currency) values
    (new.id, 'Emergency fund', 10000, 0, 'SAR');

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created_wafra on auth.users;
create trigger on_auth_user_created_wafra
  after insert on auth.users
  for each row execute procedure public.handle_new_wafra_user();

-- Transfer function: validates the request, then atomically debits the SAR
-- balance and logs the outgoing transaction. Idempotent when called with
-- the same idempotency key twice (e.g. a retried request after a dropped
-- connection) — the second call is a safe no-op instead of a double charge.
create or replace function public.make_transfer(
  p_amount numeric,
  p_recipient text,
  p_note text default null,
  p_idempotency_key text default null
)
returns void as $$
declare
  current_balance numeric;
begin
  if p_idempotency_key is not null and exists (
    select 1 from public.transactions
    where user_id = auth.uid() and idempotency_key = p_idempotency_key
  ) then
    return; -- already processed, nothing more to do
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Transfer amount must be greater than zero';
  end if;

  if p_recipient is null or length(trim(p_recipient)) = 0 then
    raise exception 'Recipient is required';
  end if;

  select balance into current_balance
    from public.accounts
    where user_id = auth.uid() and currency = 'SAR'
    for update;

  if current_balance is null then
    raise exception 'No SAR account found for this user';
  end if;

  if current_balance < p_amount then
    raise exception 'Insufficient balance: available %, requested %', current_balance, p_amount;
  end if;

  update public.accounts
    set balance = balance - p_amount
    where user_id = auth.uid() and currency = 'SAR';

  insert into public.transactions (user_id, name, category, amount, direction, occurred_at, idempotency_key)
    values (auth.uid(), p_recipient, 'other', p_amount, 'out', current_date, p_idempotency_key);
end;
$$ language plpgsql security definer set search_path = public;

-- Add a savings goal — moved server-side so the same validation always
-- applies no matter what the client sends.
create or replace function public.add_savings_goal(
  p_name text,
  p_target numeric,
  p_currency text default 'SAR'
)
returns uuid as $$
declare
  new_id uuid;
begin
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Goal name is required';
  end if;

  if p_target is null or p_target <= 0 then
    raise exception 'Target amount must be greater than zero';
  end if;

  insert into public.goals (user_id, name, target, saved, currency)
    values (auth.uid(), trim(p_name), p_target, 0, coalesce(p_currency, 'SAR'))
    returning id into new_id;

  return new_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Only ever grant EXECUTE on these functions to authenticated users — never
-- broaden table privileges directly.
revoke all on public.accounts, public.transactions, public.goals from anon, authenticated;
grant select on public.accounts, public.transactions, public.goals to authenticated;
grant execute on function public.make_transfer to authenticated;
grant execute on function public.add_savings_goal to authenticated;
