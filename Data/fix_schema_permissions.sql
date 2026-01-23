-- FIX LỖI "Database error querying schema"
-- Lỗi này xảy ra khi Supabase Auth không thể đọc thông tin schema hệ thống

-- 1. Cấp quyền truy cập USAGE cho schema auth và public
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

-- 2. Cấp quyền đọc metadata hệ thống (mấu chốt của lỗi querying schema)
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO postgres, anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO postgres, anon, authenticated, service_role;

-- 3. (Optional) Nếu vẫn lỗi, hãy kiểm tra lại Trigger
-- ALTER ROLE service_role BYPASSRLS; -- Dòng này bị bỏ vì yêu cầu quyền Superuser 
