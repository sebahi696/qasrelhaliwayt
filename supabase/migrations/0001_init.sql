-- Qasr Al Halaweyat — core schema (phase 1)
-- Orders, config overrides (menu/branches/intl/promos), customers. Staff = any authenticated Supabase user.

create extension if not exists pgcrypto;

-- ---------- orders ----------
create table if not exists public.orders (
  id            text primary key,                       -- e.g. Q2345 (shown to customer)
  status        text not null default 'received',
  branch        text not null,                          -- malla | mazraa | aramoun | intl
  type          text not null,                          -- delivery | pickup | intl
  source        text not null default 'app',            -- app | website | staff | whatsapp
  customer_phone text,
  customer_name  text,
  total         numeric(10,2) not null default 0,
  ts            bigint not null,                        -- epoch ms (what the UI sorts by)
  data          jsonb not null,                         -- full order document (lines, fees, address, driver, tracking…)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_ts_idx on public.orders (ts desc);
create index if not exists orders_phone_idx on public.orders (customer_phone);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- ---------- config overrides (admin-editable, merged over data.js defaults) ----------
create table if not exists public.config (
  kind       text not null,     -- menu | branch | intl | promo | banner | settings
  key        text not null,     -- item id / branch id / country code / promo code / 'global'
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (kind, key)
);
drop trigger if exists config_touch on public.config;
create trigger config_touch before update on public.config for each row execute function public.touch_updated_at();

-- ---------- customers ----------
create table if not exists public.customers (
  phone      text primary key,
  name       text,
  email      text,
  source     text default 'app',
  points     integer not null default 0,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists customers_touch on public.customers;
create trigger customers_touch before update on public.customers for each row execute function public.touch_updated_at();

-- ---------- RLS ----------
alter table public.orders    enable row level security;
alter table public.config    enable row level security;
alter table public.customers enable row level security;

-- Staff (any signed-in user of this project) can do everything.
create policy "staff all orders"    on public.orders    for all to authenticated using (true) with check (true);
create policy "staff all config"    on public.config    for all to authenticated using (true) with check (true);
create policy "staff all customers" on public.customers for all to authenticated using (true) with check (true);

-- Public (app + website, anon key): read config, place orders, upsert own customer record.
create policy "public read config"      on public.config    for select to anon using (true);
create policy "public place order"      on public.orders    for insert to anon with check (status = 'received');
create policy "public upsert customer"  on public.customers for insert to anon with check (true);
create policy "public update customer"  on public.customers for update to anon using (true) with check (true);

-- Customers read their own orders only by id (no listing) through this RPC.
create or replace function public.my_orders(ids text[])
returns setof public.orders language sql security definer stable set search_path = public as $$
  select * from public.orders where id = any(ids) order by ts desc;
$$;
grant execute on function public.my_orders(text[]) to anon, authenticated;

-- Realtime for the staff panel
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and tablename='orders') then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and tablename='config') then
    alter publication supabase_realtime add table public.config;
  end if;
end $$;

-- Driver link (unauthenticated phone page): may only move an order to onTheWay / delivered.
create or replace function public.driver_update(oid text, new_status text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if new_status not in ('onTheWay','delivered') then raise exception 'not allowed'; end if;
  update public.orders set status = new_status, data = data || jsonb_build_object('status', new_status) where id = oid;
end $$;
grant execute on function public.driver_update(text, text) to anon, authenticated;
