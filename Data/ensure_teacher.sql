-- ENSURE TEACHER ACCOUNT EXISTS
-- Create or Update Teacher user for testing
-- Email: teacher@school.com | Pass: 123456

DO $$
DECLARE
  teacher_uid UUID;
  existing_uid UUID;
BEGIN
  -- 1. Check/Create Auth User
  SELECT id INTO existing_uid FROM auth.users WHERE email = 'teacher@school.com';
  
  IF existing_uid IS NOT NULL THEN
    teacher_uid := existing_uid;
    -- Reset password to ensure we know it
    UPDATE auth.users 
    SET encrypted_password = crypt('123456', gen_salt('bf')), updated_at = NOW()
    WHERE id = teacher_uid;
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
  END IF;

  -- 2. Create/Update Teacher Profile in public schema
  INSERT INTO public.teachers (auth_user_id, email, full_name, school_name, is_active)
  VALUES (teacher_uid, 'teacher@school.com', 'Ms. Daisy', 'Sunshine School', true)
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    is_active = true;

  RAISE NOTICE 'Teacher account ready: teacher@school.com / 123456';
END $$;
