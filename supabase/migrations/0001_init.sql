-- Linkr MVP schema (TRD §3-4). Multi-collection via link_collections join table.
-- Run with: supabase db push

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- Profiles mirror auth.users (minimal PII per TRD §11)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon_key text not null default 'folder',
  color_key text not null default 'blue' check (color_key in ('pink','blue','teal','orange')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  canonical_url text not null,
  original_url text not null,
  title text not null,
  description text,
  source_domain text not null,
  preview_image_url text,
  metadata_status text not null default 'pending'
    check (metadata_status in ('pending','ready','unavailable','timeout')),
  saved_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, canonical_url)
);

create table if not exists public.link_collections (
  link_id uuid not null references public.links(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (link_id, collection_id)
);

-- Search: full-text over title/description/domain + trigram for prefix match (TRD §6)
alter table public.links add column if not exists search_tsv tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(source_domain,''))) stored;
create index if not exists links_user_idx on public.links (user_id);
create index if not exists links_search_idx on public.links using gin (search_tsv);
create index if not exists links_title_trgm on public.links using gin (title gin_trgm_ops);

-- RLS: ownership derived from auth.uid(), never client-supplied user_id (TRD §11)
alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.links enable row level security;
alter table public.link_collections enable row level security;

create policy "profiles_owner" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "collections_owner" on public.collections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "links_owner" on public.links for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "link_collections_owner" on public.link_collections for all using (
  exists (select 1 from public.links l where l.id = link_id and l.user_id = auth.uid())
) with check (
  exists (select 1 from public.links l where l.id = link_id and l.user_id = auth.uid())
);
