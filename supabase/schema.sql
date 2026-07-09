-- Wafra — database schema
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run

-- 1. Accounts (multi-currency balances per user)
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  currency text not null,
  balance numeric not null default 0,
  created_at timestamptz default now()
);

-- 2. Transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text not null check (category in ('food','shopping','transport','bills','other')),
  amount numeric not null,
  direction text not null check (direction in ('in','out')),
  occurred_at date not null default current_date,
  created_at timestamptz default now()
);

-- 3. Savings goals
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  target numeric not null,
  saved numeric not null default 0,
  currency text not null default 'SAR',
  created_at timestamptz default now()
);

-- Row Level Security: every user can only ever see/modify their own rows
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;

drop policy if exists "Users manage own accounts" on public.accounts;
create policy "Users manage own accounts" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own transactions" on public.transactions;
create policy "Users manage own transactions" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own goals" on public.goals;
create policy "Users manage own goals" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-seed a new user with starter accounts + a welcome transaction + a sample goal
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
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_wafra on auth.users;
create trigger on_auth_user_created_wafra
  after insert on auth.users
  for each row execute procedure public.handle_new_wafra_user();

-- Transfer function: debit SAR balance + log the outgoing transaction atomically
create or replace function public.make_transfer(p_amount numeric, p_recipient text, p_note text default null)
returns void as $$
declare
  current_balance numeric;
begin
  if p_amount <= 0 then
    raise exception 'Transfer amount must be greater than zero';
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

  insert into public.transactions (user_id, name, category, amount, direction, occurred_at)
    values (auth.uid(), p_recipient, 'other', p_amount, 'out', current_date);
end;
$$ language plpgsql;
