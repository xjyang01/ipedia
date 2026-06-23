-- iPedia schema

create extension if not exists "uuid-ossp";

-- Categories
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  emoji text default '📄',
  article_count int default 0,
  created_at timestamptz default now()
);

-- Articles
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  summary text not null,
  body jsonb not null default '[]',  -- [{heading, content}]
  category_slug text references public.categories(slug) on update cascade,
  tags text[] default '{}',
  status text default 'draft' check (status in ('draft','verified','published')),
  ai_generated boolean default true,
  verified_by text,
  verified_at timestamptz,
  featured boolean default false,
  read_time text default '5 min read',
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- References per article
create table if not exists public.article_refs (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid references public.articles on delete cascade,
  ref_number int,
  title text not null,
  authors text,
  year int,
  url text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists articles_category_idx on public.articles(category_slug);
create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_featured_idx on public.articles(featured);

-- Seed categories
insert into public.categories (name, slug, description, emoji) values
  ('People & Organizations', 'people', 'Biographies, institutions, companies, and movements that shaped the world', '👤'),
  ('Science & Medicine', 'science', 'Biology, genetics, oncology, neuroscience, and clinical medicine', '🔬'),
  ('Technology & AI', 'technology', 'Computing, artificial intelligence, engineering, and software', '💻'),
  ('Economics & Finance', 'economics', 'Markets, economic policy, business history, and finance', '📈'),
  ('History & Society', 'history', 'World history, culture, politics, and social science', '🌍')
on conflict (slug) do nothing;

-- RLS (read-only for public, write via service role)
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.article_refs enable row level security;

create policy "Public read categories" on public.categories for select using (true);
create policy "Public read published articles" on public.articles for select using (status = 'published');
create policy "Public read article refs" on public.article_refs for select using (true);
