-- =========================================================
-- FIX SUPABASE AUTH ERROR (AGGRESSIVE)
-- Run this in Supabase SQL Editor
-- =========================================================

-- 1. FIX PERMISSIONS
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. DISABLE TRIGGERS ON AUTH.USERS (TEMPORARY FIX)
-- Nếu có trigger nào tự động tạo user profile bị lỗi, nó sẽ chặn login.
-- Chúng ta sẽ drop các trigger phổ biến thường gây lỗi.

-- Drop trigger nếu tồn tại (cần quyền admin)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. FIX RLS POLICIES
-- Đôi khi RLS chặn chính việc đọc user của mình
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins Policy
DROP POLICY IF EXISTS "Admins can view own profile" ON admins;
CREATE POLICY "Admins can view own profile" ON admins FOR SELECT USING (true); -- Tạm thời mở hết để test

-- Students Policy
DROP POLICY IF EXISTS "Students can view own profile" ON students;
CREATE POLICY "Students can view own profile" ON students FOR SELECT USING (true);

-- 4. FIX USER ROLE FUNCTION
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER -- Chạy với quyền superuser để bypass RLS
AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN RETURN NULL; END IF;
  
  IF EXISTS (SELECT 1 FROM admins WHERE auth_user_id = user_id) THEN RETURN 'admin'; END IF;
  IF EXISTS (SELECT 1 FROM teachers WHERE auth_user_id = user_id) THEN RETURN 'teacher'; END IF;
  IF EXISTS (SELECT 1 FROM parents WHERE auth_user_id = user_id) THEN RETURN 'parent'; END IF;
  
  RETURN 'student';
END;
$$;

SELECT 'Fix script executed successfully' as status;
