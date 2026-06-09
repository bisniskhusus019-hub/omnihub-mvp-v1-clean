-- OmniHub MVP seller auth policies
-- Run this in Supabase SQL Editor after creating the base tables.

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.community_posts enable row level security;

-- Public marketplace/profile reads
drop policy if exists "Public read users" on public.users;
create policy "Public read users"
on public.users
for select
to anon, authenticated
using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
on public.products
for select
to anon, authenticated
using (is_published = true or true);

-- Seller profile creation/update from Supabase Auth
drop policy if exists "Authenticated users create own profile" on public.users;
create policy "Authenticated users create own profile"
on public.users
for insert
to authenticated
with check (auth.uid() = auth_user_id);

drop policy if exists "Authenticated users update own profile" on public.users;
create policy "Authenticated users update own profile"
on public.users
for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

-- Seller product creation/update. A seller can write products only for their own users.id row.
drop policy if exists "Authenticated sellers create own products" on public.products;
create policy "Authenticated sellers create own products"
on public.products
for insert
to authenticated
with check (
  exists (
    select 1
    from public.users
    where users.id = products.seller_id
      and users.auth_user_id = auth.uid()
  )
);

drop policy if exists "Authenticated sellers update own products" on public.products;
create policy "Authenticated sellers update own products"
on public.products
for update
to authenticated
using (
  exists (
    select 1
    from public.users
    where users.id = products.seller_id
      and users.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.users
    where users.id = products.seller_id
      and users.auth_user_id = auth.uid()
  )
);

-- Public checkout flow for early MVP testing
drop policy if exists "Public read transactions" on public.transactions;
create policy "Public read transactions"
on public.transactions
for select
to anon, authenticated
using (true);

drop policy if exists "Public insert transactions" on public.transactions;
create policy "Public insert transactions"
on public.transactions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public update transactions" on public.transactions;
create policy "Public update transactions"
on public.transactions
for update
to anon, authenticated
using (true)
with check (true);

-- Public community flow for early MVP testing
drop policy if exists "Public read community posts" on public.community_posts;
create policy "Public read community posts"
on public.community_posts
for select
to anon, authenticated
using (true);

drop policy if exists "Public insert community posts" on public.community_posts;
create policy "Public insert community posts"
on public.community_posts
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public update community posts" on public.community_posts;
create policy "Public update community posts"
on public.community_posts
for update
to anon, authenticated
using (true)
with check (true);
