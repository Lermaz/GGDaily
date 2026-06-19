-- Categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  kind text not null check (kind in ('income', 'expense')),
  color text not null default '#64748B',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_user_id_kind_idx on public.categories (user_id, kind);

-- Transactions table
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null default '',
  occurred_on date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_user_id_occurred_on_idx on public.transactions (user_id, occurred_on desc);

-- Updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- Validate transaction category belongs to same user
create or replace function public.validate_transaction_category()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.categories
    where id = new.category_id
      and user_id = new.user_id
  ) then
    raise exception 'Category does not belong to user';
  end if;
  return new;
end;
$$;

create trigger transactions_validate_category
  before insert or update on public.transactions
  for each row execute function public.validate_transaction_category();

-- Seed default categories for new users
create or replace function public.seed_default_categories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories (user_id, name, kind, color) values
    (new.id, 'Salary', 'income', '#16A34A'),
    (new.id, 'Freelance', 'income', '#22C55E'),
    (new.id, 'Other Income', 'income', '#4ADE80'),
    (new.id, 'Food', 'expense', '#EF4444'),
    (new.id, 'Rent', 'expense', '#DC2626'),
    (new.id, 'Transport', 'expense', '#F97316'),
    (new.id, 'Bills', 'expense', '#EAB308'),
    (new.id, 'Shopping', 'expense', '#8B5CF6'),
    (new.id, 'Entertainment', 'expense', '#EC4899'),
    (new.id, 'Other', 'expense', '#64748B');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.seed_default_categories();

-- Row Level Security
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

create policy "Users can view own categories"
  on public.categories for select
  using (user_id = auth.uid());

create policy "Users can insert own categories"
  on public.categories for insert
  with check (user_id = auth.uid());

create policy "Users can update own categories"
  on public.categories for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own categories"
  on public.categories for delete
  using (user_id = auth.uid());

create policy "Users can view own transactions"
  on public.transactions for select
  using (user_id = auth.uid());

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.categories
      where id = category_id and user_id = auth.uid()
    )
  );

create policy "Users can update own transactions"
  on public.transactions for update
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.categories
      where id = category_id and user_id = auth.uid()
    )
  );

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (user_id = auth.uid());
