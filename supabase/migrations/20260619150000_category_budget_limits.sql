alter table public.categories
  add column monthly_limit numeric(12, 2)
  check (monthly_limit is null or monthly_limit > 0);
