-- ==============================================================================
-- FIX ADMIN VISIBILITY (Run this in Supabase SQL Editor)
-- ==============================================================================

-- 1. Allow Admins to VIEW all profiles
-- Currently, users can only see their own profile. This adds an exception for admins.
create policy "Admins can view all profiles"
on profiles
for select
using (
  auth.jwt() ->> 'email' in (
    'renderman.arch@gmail.com',
    'salarchman@gmail.com',
    'projectkuddus@gmail.com'
  )
);

-- 2. Allow Admins to UPDATE all profiles
-- Required for changing Tiers and Credits
create policy "Admins can update all profiles"
on profiles
for update
using (
  auth.jwt() ->> 'email' in (
    'renderman.arch@gmail.com',
    'salarchman@gmail.com',
    'projectkuddus@gmail.com'
  )
);

-- 3. Allow Admins to Manage User Credits
-- Assuming user_credits table exists and has RLS enabled
create policy "Admins can manage user_credits"
on user_credits
for all
using (
  auth.jwt() ->> 'email' in (
    'renderman.arch@gmail.com',
    'salarchman@gmail.com',
    'projectkuddus@gmail.com'
  )
);
