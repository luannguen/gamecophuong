-- ============================================================================
-- CREATE PARENT USER FOR TESTING
-- Run after rbac_migration.sql
-- ============================================================================

-- Create auth user for parent
DO $$
DECLARE
  parent_uid UUID;
  existing_uid UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_uid FROM auth.users WHERE email = 'parent@family.com';
  
  IF existing_uid IS NOT NULL THEN
    parent_uid := existing_uid;
    UPDATE auth.users 
    SET encrypted_password = crypt('123456', gen_salt('bf')), updated_at = NOW()
    WHERE id = parent_uid;
    RAISE NOTICE 'Parent user updated: parent@family.com';
  ELSE
    parent_uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      parent_uid,
      '00000000-0000-0000-0000-000000000000',
      'parent@family.com',
      crypt('123456', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      'authenticated',
      'authenticated'
    );
    RAISE NOTICE 'Parent user created: parent@family.com';
  END IF;

  -- Insert/Update parent record
  INSERT INTO parents (auth_user_id, email, full_name, phone_number, is_active)
  VALUES (parent_uid, 'parent@family.com', 'Mr. & Mrs. Smith', '0901234567', true)
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    is_active = true;

  -- Link parent to students (Alex and Emma)
  INSERT INTO parent_students (parent_id, student_id, relationship, is_primary_contact)
  SELECT 
    p.id,
    s.id,
    'parent',
    true
  FROM parents p, students s
  WHERE p.email = 'parent@family.com' 
  AND s.display_name IN ('Alex', 'Emma')
  ON CONFLICT (parent_id, student_id) DO NOTHING;
  
  RAISE NOTICE 'Parent linked to Alex and Emma';
END $$;

-- ============================================================================
-- VERIFY
-- ============================================================================

SELECT 'AUTH USER' as type, email FROM auth.users WHERE email = 'parent@family.com';
SELECT 'PARENT' as type, full_name, email FROM parents WHERE email = 'parent@family.com';
SELECT 'CHILDREN' as type, p.full_name as parent, s.display_name as child, ps.relationship
FROM parent_students ps
JOIN parents p ON ps.parent_id = p.id
JOIN students s ON ps.student_id = s.id
WHERE p.email = 'parent@family.com';

-- ============================================================================
-- LOGIN CREDENTIALS
-- Parent: parent@family.com / 123456 → /parent/login
-- ============================================================================
