/*
# Tighten SAKHI Data API grants

1. Scope
- Removes broad default table privileges that were visible to the anonymous and authenticated roles.
- Keeps public visitors able to read only published/demo content.
- Keeps guests able to create reports and use the explicitly supported interaction tables.
- Keeps authenticated users able to access only their own profile and lesson progress through RLS.

2. Security
- Anonymous access is removed from private user tables and admin audit logs.
- Content tables are read-only for browser roles.
- Interaction tables expose only the verbs required by the guest experience.
- RLS policies remain the row-level enforcement layer.
*/

REVOKE ALL ON public.sakhi_opportunities, public.sakhi_schemes, public.sakhi_learning_modules, public.sakhi_health_resources FROM anon, authenticated;
GRANT SELECT ON public.sakhi_opportunities, public.sakhi_schemes, public.sakhi_learning_modules, public.sakhi_health_resources TO anon, authenticated;

REVOKE ALL ON public.sakhi_saved_items FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.sakhi_saved_items TO anon, authenticated;

REVOKE ALL ON public.sakhi_interest_registrations FROM anon, authenticated;
GRANT SELECT, INSERT ON public.sakhi_interest_registrations TO anon, authenticated;

REVOKE ALL ON public.sakhi_reports FROM anon, authenticated;
GRANT INSERT ON public.sakhi_reports TO anon, authenticated;

REVOKE ALL ON public.sakhi_profiles, public.sakhi_lesson_progress FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sakhi_profiles TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.sakhi_lesson_progress TO authenticated;

REVOKE ALL ON public.sakhi_admin_audit_logs FROM anon, authenticated;
