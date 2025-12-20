-- Create the generations table
create table if not exists public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  image_url text not null,
  prompt text,
  style text,
  view_type text,
  aspect_ratio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb
);

-- Enable Row Level Security (RLS)
alter table public.generations enable row level security;

-- Create policies for generations table
create policy "Users can view their own generations"
  on public.generations for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own generations"
  on public.generations for insert
  with check ( auth.uid() = user_id );

-- Create storage bucket 'generations'
insert into storage.buckets (id, name, public)
values ('generations', 'generations', true)
on conflict (id) do nothing;

-- Create storage policies
create policy "Users can upload their own generation images"
  on storage.objects for insert
  with check ( bucket_id = 'generations' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can view their own generation images"
  on storage.objects for select
  using ( bucket_id = 'generations' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can update their own generation images"
  on storage.objects for update
  using ( bucket_id = 'generations' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can delete their own generation images"
  on storage.objects for delete
  using ( bucket_id = 'generations' and auth.uid()::text = (storage.foldername(name))[1] );
