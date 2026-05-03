-- ============================================================
-- Fix orphaned enrollments & progress stored under JWT sub
-- instead of the canonical DB UUID.
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- Step 1: See what's orphaned (rows whose user_id is NOT a valid users.id)
SELECT e.id, e.user_id as stored_under, e.course_id, e.status
FROM public.enrollments e
WHERE e.user_id NOT IN (SELECT id FROM public.users);

-- Step 2: Re-associate them to the correct DB user by matching email
-- This works because Web3Auth tokens carry an email that maps to users.email
UPDATE public.enrollments e
SET user_id = u.id
FROM public.users u
WHERE e.user_id NOT IN (SELECT id FROM public.users)
  AND u.email IS NOT NULL
  -- Manual override: set the correct DB UUID for the student account
  AND u.id = '62cee7dc-d053-4dcf-87f2-5339af5ee604';

-- Step 3: Fix orphaned course_progress rows the same way
UPDATE public.course_progress cp
SET user_id = '62cee7dc-d053-4dcf-87f2-5339af5ee604'
WHERE cp.user_id NOT IN (SELECT id FROM public.users);

-- Step 4: Ensure enrollment status is lowercase
UPDATE public.enrollments
SET status = 'active'
WHERE status = 'ACTIVE';

-- Step 5: Verify — should show your enrollments under the correct UUID
SELECT e.user_id, e.course_id, e.status, c.title
FROM public.enrollments e
JOIN public.courses c ON c.id = e.course_id
WHERE e.user_id = '62cee7dc-d053-4dcf-87f2-5339af5ee604';
