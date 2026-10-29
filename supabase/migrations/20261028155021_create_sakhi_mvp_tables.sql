/*
# Create SAKHI MVP content and interaction tables

1. New Tables
- `sakhi_opportunities` stores opportunity listings with explicit demo/verification labels.
- `sakhi_schemes` stores government scheme summaries and source verification metadata.
- `sakhi_learning_modules` stores short learning cards and lesson content.
- `sakhi_health_resources` stores educational health resources and verification metadata.
- `sakhi_saved_items` stores anonymous device saves for opportunities and schemes.
- `sakhi_interest_registrations` stores clearly labeled interest records; it is not an application submission.
- `sakhi_reports` stores reports about suspicious or misleading content.
- `sakhi_admin_audit_logs` stores future administrator review actions.

2. Security
- Row level security is enabled on every table.
- Public content can be read by anonymous and authenticated visitors.
- Anonymous interaction rows can be created and read only by their opaque device identifier.
- Report submissions are insert-only for public visitors; review access is reserved for future authenticated administrators.
- Admin audit logs are not exposed to public visitors.

3. Important Notes
- No Aadhaar, PIN, OTP, password, precise home address, or detailed health data is stored.
- Demo content is intentionally marked and must be verified before production publication.
*/

CREATE TABLE IF NOT EXISTS public.sakhi_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_hi text NOT NULL,
  title_en text NOT NULL,
  provider_name text NOT NULL,
  category text NOT NULL,
  location_text text NOT NULL,
  work_mode text NOT NULL,
  compensation_note text NOT NULL,
  required_skills text NOT NULL,
  eligibility_summary text NOT NULL,
  application_method text NOT NULL,
  verification_status text NOT NULL DEFAULT 'demo' CHECK (verification_status IN ('demo', 'pending', 'verified', 'archived')),
  source_url text,
  last_verified_at timestamptz,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sakhi_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  official_name text NOT NULL,
  name_hi text NOT NULL,
  intended_beneficiaries text NOT NULL,
  eligibility_summary text NOT NULL,
  benefits_summary text NOT NULL,
  documents_required text NOT NULL,
  application_process text NOT NULL,
  official_source_url text,
  verification_status text NOT NULL DEFAULT 'demo' CHECK (verification_status IN ('demo', 'pending', 'verified', 'archived')),
  last_verified_at timestamptz,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sakhi_learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_hi text NOT NULL,
  title_en text NOT NULL,
  summary_hi text NOT NULL,
  lesson_body_hi text NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  verification_status text NOT NULL DEFAULT 'demo' CHECK (verification_status IN ('demo', 'pending', 'verified', 'archived')),
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sakhi_health_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_hi text NOT NULL,
  summary_hi text NOT NULL,
  resource_type text NOT NULL,
  official_source_url text,
  verification_status text NOT NULL DEFAULT 'demo' CHECK (verification_status IN ('demo', 'pending', 'verified', 'archived')),
  last_verified_at timestamptz,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sakhi_saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL CHECK (char_length(device_id) BETWEEN 16 AND 128),
  item_type text NOT NULL CHECK (item_type IN ('opportunity', 'scheme')),
  item_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (device_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS public.sakhi_interest_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL CHECK (char_length(device_id) BETWEEN 16 AND 128),
  opportunity_id uuid REFERENCES public.sakhi_opportunities(id) ON DELETE SET NULL,
  contact_preference text NOT NULL,
  message text,
  is_demo_record boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sakhi_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL CHECK (char_length(device_id) BETWEEN 16 AND 128),
  item_type text NOT NULL CHECK (item_type IN ('opportunity', 'scheme', 'health_resource')),
  item_id uuid NOT NULL,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sakhi_admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sakhi_opportunities_category_idx ON public.sakhi_opportunities(category);
CREATE INDEX IF NOT EXISTS sakhi_opportunities_location_idx ON public.sakhi_opportunities(location_text);
CREATE INDEX IF NOT EXISTS sakhi_schemes_name_idx ON public.sakhi_schemes(official_name);
CREATE INDEX IF NOT EXISTS sakhi_saved_items_device_idx ON public.sakhi_saved_items(device_id);
CREATE INDEX IF NOT EXISTS sakhi_interest_device_idx ON public.sakhi_interest_registrations(device_id);
CREATE INDEX IF NOT EXISTS sakhi_reports_status_idx ON public.sakhi_reports(status);

ALTER TABLE public.sakhi_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakhi_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakhi_learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakhi_health_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakhi_saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakhi_interest_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakhi_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakhi_admin_audit_logs ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.sakhi_opportunities, public.sakhi_schemes, public.sakhi_learning_modules, public.sakhi_health_resources TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.sakhi_saved_items TO anon, authenticated;
GRANT SELECT, INSERT ON public.sakhi_interest_registrations TO anon, authenticated;
GRANT INSERT ON public.sakhi_reports TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sakhi_admin_audit_logs TO authenticated;

DROP POLICY IF EXISTS "public_read_published_opportunities" ON public.sakhi_opportunities;
CREATE POLICY "public_read_published_opportunities" ON public.sakhi_opportunities FOR SELECT TO anon, authenticated USING (is_published = true OR verification_status = 'demo');
DROP POLICY IF EXISTS "public_read_published_schemes" ON public.sakhi_schemes;
CREATE POLICY "public_read_published_schemes" ON public.sakhi_schemes FOR SELECT TO anon, authenticated USING (is_published = true OR verification_status = 'demo');
DROP POLICY IF EXISTS "public_read_published_learning" ON public.sakhi_learning_modules;
CREATE POLICY "public_read_published_learning" ON public.sakhi_learning_modules FOR SELECT TO anon, authenticated USING (is_published = true OR verification_status = 'demo');
DROP POLICY IF EXISTS "public_read_published_health" ON public.sakhi_health_resources;
CREATE POLICY "public_read_published_health" ON public.sakhi_health_resources FOR SELECT TO anon, authenticated USING (is_published = true OR verification_status = 'demo');

DROP POLICY IF EXISTS "device_read_saved_items" ON public.sakhi_saved_items;
CREATE POLICY "device_read_saved_items" ON public.sakhi_saved_items FOR SELECT TO anon, authenticated USING (device_id = current_setting('request.headers', true)::json->>'x-sakhi-device');
DROP POLICY IF EXISTS "device_insert_saved_items" ON public.sakhi_saved_items;
CREATE POLICY "device_insert_saved_items" ON public.sakhi_saved_items FOR INSERT TO anon, authenticated WITH CHECK (device_id = current_setting('request.headers', true)::json->>'x-sakhi-device');
DROP POLICY IF EXISTS "device_delete_saved_items" ON public.sakhi_saved_items;
CREATE POLICY "device_delete_saved_items" ON public.sakhi_saved_items FOR DELETE TO anon, authenticated USING (device_id = current_setting('request.headers', true)::json->>'x-sakhi-device');

DROP POLICY IF EXISTS "device_read_interest" ON public.sakhi_interest_registrations;
CREATE POLICY "device_read_interest" ON public.sakhi_interest_registrations FOR SELECT TO anon, authenticated USING (device_id = current_setting('request.headers', true)::json->>'x-sakhi-device');
DROP POLICY IF EXISTS "device_insert_interest" ON public.sakhi_interest_registrations;
CREATE POLICY "device_insert_interest" ON public.sakhi_interest_registrations FOR INSERT TO anon, authenticated WITH CHECK (device_id = current_setting('request.headers', true)::json->>'x-sakhi-device');

DROP POLICY IF EXISTS "public_insert_reports" ON public.sakhi_reports;
CREATE POLICY "public_insert_reports" ON public.sakhi_reports FOR INSERT TO anon, authenticated WITH CHECK (char_length(device_id) BETWEEN 16 AND 128);

DROP POLICY IF EXISTS "admin_read_audit" ON public.sakhi_admin_audit_logs;
CREATE POLICY "admin_read_audit" ON public.sakhi_admin_audit_logs FOR SELECT TO authenticated USING (false);
DROP POLICY IF EXISTS "admin_insert_audit" ON public.sakhi_admin_audit_logs;
CREATE POLICY "admin_insert_audit" ON public.sakhi_admin_audit_logs FOR INSERT TO authenticated WITH CHECK (false);
DROP POLICY IF EXISTS "admin_update_audit" ON public.sakhi_admin_audit_logs;
CREATE POLICY "admin_update_audit" ON public.sakhi_admin_audit_logs FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "admin_delete_audit" ON public.sakhi_admin_audit_logs;
CREATE POLICY "admin_delete_audit" ON public.sakhi_admin_audit_logs FOR DELETE TO authenticated USING (false);
