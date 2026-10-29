/*
# Add authenticated SAKHI user data

1. New Tables
- `sakhi_profiles` stores only optional profile preferences for a signed-in user.
- `sakhi_lesson_progress` stores completion state for a signed-in user's learning modules.

2. Security
- Both tables have row level security enabled.
- Only the signed-in owner can read, create, update, or delete their own rows.
- The owner is filled by the database from `auth.uid()` so the browser cannot assign another user's identity.
- Anonymous visitors receive no access to these tables and continue using guest/demo mode.

3. Privacy Notes
- Profile fields are optional and deliberately exclude Aadhaar, OTPs, passwords, PINs, precise addresses, and detailed health information.
- Lesson progress contains no sensitive content.
*/

CREATE TABLE IF NOT EXISTS public.sakhi_profiles (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_name text,
  district_state text,
  language text NOT NULL DEFAULT 'hi' CHECK (language IN ('hi', 'en')),
  interest text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sakhi_lesson_progress (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_key text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_key)
);

ALTER TABLE public.sakhi_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakhi_lesson_progress ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sakhi_profiles TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.sakhi_lesson_progress TO authenticated;

DROP POLICY IF EXISTS "users_read_own_sakhi_profile" ON public.sakhi_profiles;
CREATE POLICY "users_read_own_sakhi_profile" ON public.sakhi_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_insert_own_sakhi_profile" ON public.sakhi_profiles;
CREATE POLICY "users_insert_own_sakhi_profile" ON public.sakhi_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_update_own_sakhi_profile" ON public.sakhi_profiles;
CREATE POLICY "users_update_own_sakhi_profile" ON public.sakhi_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_delete_own_sakhi_profile" ON public.sakhi_profiles;
CREATE POLICY "users_delete_own_sakhi_profile" ON public.sakhi_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_read_own_sakhi_progress" ON public.sakhi_lesson_progress;
CREATE POLICY "users_read_own_sakhi_progress" ON public.sakhi_lesson_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_insert_own_sakhi_progress" ON public.sakhi_lesson_progress;
CREATE POLICY "users_insert_own_sakhi_progress" ON public.sakhi_lesson_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_delete_own_sakhi_progress" ON public.sakhi_lesson_progress;
CREATE POLICY "users_delete_own_sakhi_progress" ON public.sakhi_lesson_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);
