-- ============================================================================
-- RBAC SYSTEM - Complete Migration Script
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PHASE 1: CREATE CORE RBAC TABLES
-- ============================================================================

-- 1.1 Roles Table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,  -- System roles cannot be deleted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Role-Permission Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- ============================================================================
-- PHASE 2: CREATE NEW ENTITY TABLES
-- ============================================================================

-- 2.1 Classes Table (Homeroom)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  academic_year VARCHAR(20),
  grade_level INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Parents Table
CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  phone_number VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Parent-Student Relationship
CREATE TABLE IF NOT EXISTS parent_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  relationship VARCHAR(30) DEFAULT 'parent',
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- ============================================================================
-- PHASE 3: MODIFY STUDENTS TABLE
-- ============================================================================

-- 3.1 Add class_id column to students
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'class_id'
  ) THEN
    ALTER TABLE students ADD COLUMN class_id UUID REFERENCES classes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3.2 Create index for class lookups
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_student ON parent_students(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);

-- ============================================================================
-- PHASE 4: SEED DEFAULT ROLES & PERMISSIONS
-- ============================================================================

-- 4.1 Insert Default Roles
INSERT INTO roles (name, description, is_system) VALUES
  ('admin', 'Full system access', true),
  ('teacher', 'Manage classes and students', true),
  ('parent', 'View children information', true),
  ('student', 'Play games and view own progress', true)
ON CONFLICT (name) DO NOTHING;

-- 4.2 Insert Default Permissions
INSERT INTO permissions (name, description, resource, action) VALUES
  -- Student permissions
  ('students.read', 'View student information', 'students', 'read'),
  ('students.write', 'Create/update students', 'students', 'write'),
  ('students.delete', 'Delete students', 'students', 'delete'),
  ('students.manage', 'Full student management', 'students', 'manage'),
  
  -- Class permissions
  ('classes.read', 'View classes', 'classes', 'read'),
  ('classes.write', 'Create/update classes', 'classes', 'write'),
  ('classes.manage', 'Full class management', 'classes', 'manage'),
  
  -- Game permissions
  ('games.play', 'Play games', 'games', 'play'),
  ('games.read', 'View game information', 'games', 'read'),
  ('games.manage', 'Manage games', 'games', 'manage'),
  
  -- Score/Report permissions
  ('scores.read', 'View scores', 'scores', 'read'),
  ('scores.write', 'Record scores', 'scores', 'write'),
  ('reports.read', 'View reports', 'reports', 'read'),
  ('reports.generate', 'Generate reports', 'reports', 'generate'),
  
  -- Parent permissions
  ('parents.read', 'View parent information', 'parents', 'read'),
  ('parents.write', 'Update parent information', 'parents', 'write'),
  ('parents.manage', 'Manage parents', 'parents', 'manage'),
  
  -- Content permissions
  ('vocabulary.read', 'View vocabulary', 'vocabulary', 'read'),
  ('vocabulary.manage', 'Manage vocabulary', 'vocabulary', 'manage'),
  ('videos.read', 'View videos', 'videos', 'read'),
  ('videos.manage', 'Manage videos', 'videos', 'manage'),
  
  -- Admin permissions
  ('system.admin', 'System administration', 'system', 'admin')
ON CONFLICT (name) DO NOTHING;

-- 4.3 Assign Permissions to Roles
-- Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Teacher permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'teacher' AND p.name IN (
  'students.read', 'students.write',
  'classes.read',
  'games.play', 'games.read',
  'scores.read', 'reports.read',
  'parents.read',
  'vocabulary.read', 'videos.read'
)
ON CONFLICT DO NOTHING;

-- Parent permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'parent' AND p.name IN (
  'scores.read', 'reports.read',
  'vocabulary.read', 'videos.read'
)
ON CONFLICT DO NOTHING;

-- Student permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'student' AND p.name IN (
  'games.play', 'games.read',
  'scores.read', 'scores.write',
  'vocabulary.read', 'videos.read'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PHASE 5: ENABLE RLS ON NEW TABLES
-- ============================================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PHASE 6: HELPER FUNCTIONS
-- ============================================================================

-- Get user's role from auth
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if admin
  IF EXISTS (SELECT 1 FROM admins WHERE auth_user_id = auth.uid() AND is_active = true) THEN
    RETURN 'admin';
  END IF;
  
  -- Check if teacher
  IF EXISTS (SELECT 1 FROM teachers WHERE auth_user_id = auth.uid() AND is_active = true) THEN
    RETURN 'teacher';
  END IF;
  
  -- Check if parent
  IF EXISTS (SELECT 1 FROM parents WHERE auth_user_id = auth.uid() AND is_active = true) THEN
    RETURN 'parent';
  END IF;
  
  -- Check if student
  IF EXISTS (SELECT 1 FROM students WHERE auth_user_id = auth.uid() AND is_active = true) THEN
    RETURN 'student';
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get teacher's class IDs
CREATE OR REPLACE FUNCTION get_my_class_ids()
RETURNS UUID[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT c.id FROM classes c
    JOIN teachers t ON c.teacher_id = t.id
    WHERE t.auth_user_id = auth.uid()
    AND c.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get parent's children IDs
CREATE OR REPLACE FUNCTION get_my_children_ids()
RETURNS UUID[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT ps.student_id FROM parent_students ps
    JOIN parents p ON ps.parent_id = p.id
    WHERE p.auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has permission
CREATE OR REPLACE FUNCTION has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_name TEXT;
BEGIN
  user_role_name := get_user_role();
  IF user_role_name IS NULL THEN RETURN FALSE; END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN roles r ON rp.role_id = r.id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE r.name = user_role_name AND p.name = permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PHASE 7: CREATE TRIGGERS
-- ============================================================================

-- Update timestamp triggers
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PHASE 8: MIGRATE EXISTING DATA
-- ============================================================================

-- Create a default class for existing teacher-student relationships
DO $$
DECLARE
  teacher_rec RECORD;
  new_class_id UUID;
BEGIN
  -- For each teacher with students
  FOR teacher_rec IN 
    SELECT DISTINCT t.id, t.full_name 
    FROM teachers t 
    WHERE EXISTS (SELECT 1 FROM students s WHERE s.teacher_id = t.id)
  LOOP
    -- Create a class for this teacher
    INSERT INTO classes (name, teacher_id, academic_year, is_active)
    VALUES (
      COALESCE(teacher_rec.full_name, 'Teacher') || '''s Class',
      teacher_rec.id,
      '2025-2026',
      true
    )
    RETURNING id INTO new_class_id;
    
    -- Move students to this class
    UPDATE students 
    SET class_id = new_class_id 
    WHERE teacher_id = teacher_rec.id;
  END LOOP;
END $$;

-- ============================================================================
-- PHASE 9: SAMPLE DATA
-- ============================================================================

-- Insert sample parent
INSERT INTO parents (id, auth_user_id, email, full_name, phone_number)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '11111111-1111-1111-1111-111111111111',
  'parent@family.com',
  'Mr. Parent',
  '0901234567'
)
ON CONFLICT (email) DO NOTHING;

-- Link parent to students (Alex and Emma)
INSERT INTO parent_students (parent_id, student_id, relationship, is_primary_contact)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  id,
  'parent',
  true
FROM students 
WHERE display_name IN ('Alex', 'Emma')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'ROLES' as table_name, name, description FROM roles;
SELECT 'PERMISSIONS COUNT' as info, COUNT(*) as count FROM permissions;
SELECT 'CLASSES' as table_name, name, teacher_id FROM classes;
SELECT 'PARENTS' as table_name, full_name, email FROM parents;
SELECT 'PARENT-STUDENTS' as info, p.full_name as parent, s.display_name as student
FROM parent_students ps
JOIN parents p ON ps.parent_id = p.id
JOIN students s ON ps.student_id = s.id;

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
