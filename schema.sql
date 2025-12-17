
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  credits int default 50,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Generations History table
create table generations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  prompt text,
  style text,
  image_url text, -- Store the Supabase Storage URL or Base64 (if small enough, but Storage recommended)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Generations
alter table generations enable row level security;
create policy "Users can view own generations" on generations for select using (auth.uid() = user_id);
create policy "Users can insert own generations" on generations for insert with check (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
