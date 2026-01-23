-- ============================================================================
-- MIGRATION: Add Teacher Role Support
-- Run this script to add teachers table and link students to teachers
-- ============================================================================

-- 1. Create teachers table (if not exists)
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  phone_number VARCHAR(20),
  school_name VARCHAR(200),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add teacher_id column to students (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'teacher_id'
  ) THEN
    ALTER TABLE students ADD COLUMN teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Create index for teacher_id lookup
CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(teacher_id);

-- 4. Create trigger for teachers updated_at
DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable RLS on teachers
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if current user is teacher
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teachers
    WHERE auth_user_id = auth.uid()
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get teacher ID for current user
CREATE OR REPLACE FUNCTION get_my_teacher_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM teachers
    WHERE auth_user_id = auth.uid()
    AND is_active = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES FOR TEACHERS TABLE
-- ============================================================================

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Teachers can view own profile" ON teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON teachers;
DROP POLICY IF EXISTS "Admins can manage teachers" ON teachers;

-- Create policies
CREATE POLICY "Teachers can view own profile"
  ON teachers FOR SELECT
  USING (auth_user_id = auth.uid());

CREATE POLICY "Teachers can update own profile"
  ON teachers FOR UPDATE
  USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can manage teachers"
  ON teachers FOR ALL
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES FOR STUDENTS (Teacher access)
-- ============================================================================

-- Drop existing teacher policies if any
DROP POLICY IF EXISTS "Teachers can view own students" ON students;
DROP POLICY IF EXISTS "Teachers can create students" ON students;
DROP POLICY IF EXISTS "Teachers can update own students" ON students;
DROP POLICY IF EXISTS "Teachers can delete own students" ON students;

-- Create teacher policies for students
CREATE POLICY "Teachers can view own students"
  ON students FOR SELECT
  USING (teacher_id = get_my_teacher_id());

CREATE POLICY "Teachers can create students"
  ON students FOR INSERT
  WITH CHECK (teacher_id = get_my_teacher_id());

CREATE POLICY "Teachers can update own students"
  ON students FOR UPDATE
  USING (teacher_id = get_my_teacher_id());

CREATE POLICY "Teachers can delete own students"
  ON students FOR DELETE
  USING (teacher_id = get_my_teacher_id());

-- ============================================================================
-- SAMPLE DATA (Optional - comment out if not needed)
-- ============================================================================

-- Insert sample teacher (only if not exists)
INSERT INTO teachers (id, auth_user_id, email, full_name, school_name)
VALUES (
  '450e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000001',
  'teacher@school.com',
  'Ms. Daisy',
  'Sunshine Primary School'
)
ON CONFLICT (email) DO NOTHING;

-- Link existing students to teacher (optional)
-- UPDATE students SET teacher_id = '450e8400-e29b-41d4-a716-446655440001' 
-- WHERE id IN ('750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002');

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
COMMENT ON TABLE teachers IS 'Teacher accounts who manage students';

SELECT 'Migration completed successfully!' AS status;
