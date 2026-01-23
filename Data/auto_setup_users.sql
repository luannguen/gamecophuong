-- ============================================================================
-- AUTO SETUP: Create Admin & Teacher Users (One-Click)
-- Just copy this entire script and run in Supabase SQL Editor
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CREATE ADMIN USER
-- Email: admin@cophuong.com | Password: 123456
-- ============================================================================

DO $$
DECLARE
  admin_uid UUID;
  existing_uid UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_uid FROM auth.users WHERE email = 'admin@cophuong.com';
  
  IF existing_uid IS NOT NULL THEN
    -- User exists, update password
    admin_uid := existing_uid;
    UPDATE auth.users 
    SET encrypted_password = crypt('123456', gen_salt('bf')), updated_at = NOW()
    WHERE id = admin_uid;
    RAISE NOTICE 'Admin user updated: admin@cophuong.com';
  ELSE
    -- Create new user
    admin_uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'admin@cophuong.com',
      crypt('123456', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      'authenticated',
      'authenticated'
    );
    RAISE NOTICE 'Admin user created: admin@cophuong.com';
  END IF;

  -- Insert/Update admin record
  INSERT INTO admins (auth_user_id, email, full_name, role, is_active)
  VALUES (admin_uid, 'admin@cophuong.com', 'Miss Phương', 'super_admin', true)
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    is_active = true;
END $$;

-- ============================================================================
-- CREATE TEACHER USER
-- Email: teacher@school.com | Password: 123456
-- ============================================================================

DO $$
DECLARE
  teacher_uid UUID;
  existing_uid UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_uid FROM auth.users WHERE email = 'teacher@school.com';
  
  IF existing_uid IS NOT NULL THEN
    teacher_uid := existing_uid;
    UPDATE auth.users 
    SET encrypted_password = crypt('123456', gen_salt('bf')), updated_at = NOW()
    WHERE id = teacher_uid;
    RAISE NOTICE 'Teacher user updated: teacher@school.com';
  ELSE
    teacher_uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      teacher_uid,
      '00000000-0000-0000-0000-000000000000',
      'teacher@school.com',
      crypt('123456', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      'authenticated',
      'authenticated'
    );
    RAISE NOTICE 'Teacher user created: teacher@school.com';
  END IF;

  -- Insert/Update teacher record
  INSERT INTO teachers (auth_user_id, email, full_name, school_name, is_active)
  VALUES (teacher_uid, 'teacher@school.com', 'Ms. Daisy', 'Sunshine Primary School', true)
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    is_active = true;

  -- Link students to teacher
  UPDATE students 
  SET teacher_id = (SELECT id FROM teachers WHERE email = 'teacher@school.com')
  WHERE display_name IN ('Alex', 'Emma', 'Noah', 'Liam');
END $$;

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================

SELECT 'AUTH USERS' as table_name, id, email FROM auth.users 
WHERE email IN ('admin@cophuong.com', 'teacher@school.com');

SELECT 'ADMINS' as table_name, auth_user_id, email, full_name, role FROM admins;

SELECT 'TEACHERS' as table_name, auth_user_id, email, full_name FROM teachers;

-- ============================================================================
-- DONE! Login credentials:
-- Admin:   admin@cophuong.com / 123456  → /admin/login
-- Teacher: teacher@school.com / 123456  → /teacher/dashboard
-- ============================================================================
