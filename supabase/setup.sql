-- RoboRoots: run this ONCE in Supabase > SQL Editor > New query > Run.
-- Before running, replace ADMIN_EMAIL_HERE at the bottom with the admin's login email.
-- Safe to re-run.

-- 1. Who is an admin -----------------------------------------------------------
create table if not exists public.admins (
  email text primary key,
  added_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where email = lower(auth.jwt() ->> 'email'));
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. Lessons: a video and/or a PDF/PPT, shown on /learn -----------------------
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  module text not null default 'Extra',
  video_url text,
  resource_url text,
  resource_name text,
  resource_path text, -- set when the file was uploaded to Storage (used for deleting)
  created_at timestamptz not null default now()
);

-- 3. Gallery photos/videos added from /admin, shown on /gallery ---------------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image', 'video')),
  url text not null,
  cap text not null,
  category text not null,
  created_at timestamptz not null default now()
);

-- 4. Security: everyone can read, only admins can change ----------------------
alter table public.admins enable row level security;
alter table public.lessons enable row level security;
alter table public.media enable row level security;

grant select on public.lessons, public.media to anon, authenticated;
grant insert, update, delete on public.lessons, public.media to authenticated;
grant select, insert, delete on public.admins to authenticated;

drop policy if exists "public read" on public.lessons;
drop policy if exists "admin write" on public.lessons;
create policy "public read" on public.lessons for select to anon, authenticated using (true);
create policy "admin write" on public.lessons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.media;
drop policy if exists "admin write" on public.media;
create policy "public read" on public.media for select to anon, authenticated using (true);
create policy "admin write" on public.media for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all" on public.admins;
create policy "admin all" on public.admins for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 5. File storage for PDFs / PowerPoints (public to read, 50 MB per file) ------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resources', 'resources', true, 52428800,
  array[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin read resources" on storage.objects;
drop policy if exists "admin upload resources" on storage.objects;
drop policy if exists "admin update resources" on storage.objects;
drop policy if exists "admin delete resources" on storage.objects;
-- (Storage needs a select rule for admins too, or deletes silently do nothing.)
create policy "admin read resources" on storage.objects for select to authenticated
  using (bucket_id = 'resources' and public.is_admin());
create policy "admin upload resources" on storage.objects for insert to authenticated
  with check (bucket_id = 'resources' and public.is_admin());
create policy "admin update resources" on storage.objects for update to authenticated
  using (bucket_id = 'resources' and public.is_admin());
create policy "admin delete resources" on storage.objects for delete to authenticated
  using (bucket_id = 'resources' and public.is_admin());

-- 6. The first admin (must match the user created in Authentication > Users) ---
insert into public.admins (email) values (lower('ADMIN_EMAIL_HERE'))
on conflict do nothing;
