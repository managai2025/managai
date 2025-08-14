-- src/lib/db/schema.sql
-- Minimal Supabase schema for CORE + MVP (v1)
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  email text not null,
  role text not null default 'editor',
  created_at timestamptz default now()
);

create table if not exists connectors (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  type text not null, -- shopify|woo|ga4|mail|slack
  status text not null default 'disconnected',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  type text not null,
  ts timestamptz not null default now(),
  source text not null,
  idemp_key text,
  payload jsonb not null,
  keys jsonb,
  unique(org_id, idemp_key)
);

create table if not exists rules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  json jsonb not null,
  enabled boolean default true,
  created_at timestamptz default now()
);

create table if not exists actions (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references rules(id) on delete cascade,
  type text not null,
  cfg jsonb not null default '{}'::jsonb
);

create table if not exists segments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  def jsonb not null,
  created_at timestamptz default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  email text,
  attrs jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  sku text,
  attrs jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  customer_id uuid references customers(id),
  total numeric,
  items jsonb not null default '[]'::jsonb,
  status text,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  channel text not null,
  status text not null default 'queued', -- queued|sent|failed
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  email text not null,
  source text not null default 'landing',
  status text not null default 'subscribed',
  plan text,
  meter jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(email)
);

create table if not exists experiments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  def jsonb not null,
  metrics jsonb,
  created_at timestamptz default now()
);
