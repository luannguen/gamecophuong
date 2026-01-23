-- FIX 500 ERROR ROOT CAUSE
-- Grant permissions to 'authenticator' role (Supabase API Gateway Role)
-- Script trước thiếu role này nên API vẫn báo lỗi Database Schema Error

GRANT USAGE ON SCHEMA auth TO authenticator;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticator;

-- Grant access to extensions schema as well (for crypto functions)
GRANT USAGE ON SCHEMA extensions TO authenticator;
GRANT SELECT ON ALL TABLES IN SCHEMA extensions TO authenticator;

-- Force reload schema cache
NOTIFY pgrst, 'reload schema';
