-- ============================================================================
-- RBAC RLS POLICIES - Complete Policy Script
-- Run AFTER rbac_migration.sql
-- ============================================================================

-- ============================================================================
-- DROP EXISTING CONFLICTING POLICIES (if any)
-- ============================================================================

-- Students policies
DROP POLICY IF EXISTS "Teachers can view own students" ON students;
DROP POLICY IF EXISTS "Teachers can create students" ON students;
DROP POLICY IF EXISTS "Teachers can update own students" ON students;
DROP POLICY IF EXISTS "Teachers can delete own students" ON students;

-- ============================================================================
-- ROLES TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read roles" ON roles;
CREATE POLICY "Anyone can read roles"
  ON roles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
CREATE POLICY "Admins can manage roles"
  ON roles FOR ALL
  USING (get_user_role() = 'admin');

-- ============================================================================
-- PERMISSIONS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read permissions" ON permissions;
CREATE POLICY "Anyone can read permissions"
  ON permissions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage permissions" ON permissions;
CREATE POLICY "Admins can manage permissions"
  ON permissions FOR ALL
  USING (get_user_role() = 'admin');

-- ============================================================================
-- ROLE_PERMISSIONS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read role_permissions" ON role_permissions;
CREATE POLICY "Anyone can read role_permissions"
  ON role_permissions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage role_permissions" ON role_permissions;
CREATE POLICY "Admins can manage role_permissions"
  ON role_permissions FOR ALL
  USING (get_user_role() = 'admin');

-- ============================================================================
-- CLASSES TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Public can view active classes" ON classes;
CREATE POLICY "Public can view active classes"
  ON classes FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Teachers can manage own classes" ON classes;
CREATE POLICY "Teachers can manage own classes"
  ON classes FOR ALL
  USING (
    get_user_role() = 'admin' 
    OR (get_user_role() = 'teacher' AND teacher_id IN (
      SELECT id FROM teachers WHERE auth_user_id = auth.uid()
    ))
  );

-- ============================================================================
-- PARENTS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Parents can view own profile" ON parents;
CREATE POLICY "Parents can view own profile"
  ON parents FOR SELECT
  USING (auth_user_id = auth.uid() OR get_user_role() = 'admin');

DROP POLICY IF EXISTS "Parents can update own profile" ON parents;
CREATE POLICY "Parents can update own profile"
  ON parents FOR UPDATE
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can view parents of their students" ON parents;
CREATE POLICY "Teachers can view parents of their students"
  ON parents FOR SELECT
  USING (
    get_user_role() = 'teacher' AND id IN (
      SELECT ps.parent_id FROM parent_students ps
      JOIN students s ON ps.student_id = s.id
      WHERE s.class_id = ANY(get_my_class_ids())
    )
  );

DROP POLICY IF EXISTS "Admins can manage parents" ON parents;
CREATE POLICY "Admins can manage parents"
  ON parents FOR ALL
  USING (get_user_role() = 'admin');

-- ============================================================================
-- PARENT_STUDENTS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Parents can view own children links" ON parent_students;
CREATE POLICY "Parents can view own children links"
  ON parent_students FOR SELECT
  USING (
    parent_id IN (SELECT id FROM parents WHERE auth_user_id = auth.uid())
    OR get_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "Teachers can view student-parent links in their class" ON parent_students;
CREATE POLICY "Teachers can view student-parent links in their class"
  ON parent_students FOR SELECT
  USING (
    get_user_role() = 'teacher' AND student_id IN (
      SELECT id FROM students WHERE class_id = ANY(get_my_class_ids())
    )
  );

DROP POLICY IF EXISTS "Admins can manage parent_students" ON parent_students;
CREATE POLICY "Admins can manage parent_students"
  ON parent_students FOR ALL
  USING (get_user_role() = 'admin');

-- ============================================================================
-- STUDENTS TABLE POLICIES (Updated for RBAC)
-- ============================================================================

-- Keep existing public view for leaderboards
-- Policy "Public can view active students" should already exist

-- Teacher: View/Manage students in their classes
DROP POLICY IF EXISTS "Teachers can view class students" ON students;
CREATE POLICY "Teachers can view class students"
  ON students FOR SELECT
  USING (
    get_user_role() = 'teacher' AND class_id = ANY(get_my_class_ids())
  );

DROP POLICY IF EXISTS "Teachers can create class students" ON students;
CREATE POLICY "Teachers can create class students"
  ON students FOR INSERT
  WITH CHECK (
    get_user_role() IN ('admin', 'teacher')
  );

DROP POLICY IF EXISTS "Teachers can update class students" ON students;
CREATE POLICY "Teachers can update class students"
  ON students FOR UPDATE
  USING (
    get_user_role() = 'teacher' AND class_id = ANY(get_my_class_ids())
  );

DROP POLICY IF EXISTS "Teachers can delete class students" ON students;
CREATE POLICY "Teachers can delete class students"
  ON students FOR DELETE
  USING (
    get_user_role() = 'teacher' AND class_id = ANY(get_my_class_ids())
  );

-- Parent: View their children
DROP POLICY IF EXISTS "Parents can view own children" ON students;
CREATE POLICY "Parents can view own children"
  ON students FOR SELECT
  USING (
    get_user_role() = 'parent' AND id = ANY(get_my_children_ids())
  );

-- ============================================================================
-- GAME_SESSIONS TABLE POLICIES (Updated for RBAC)
-- ============================================================================

DROP POLICY IF EXISTS "Teachers can view class sessions" ON game_sessions;
CREATE POLICY "Teachers can view class sessions"
  ON game_sessions FOR SELECT
  USING (
    get_user_role() = 'teacher' AND student_id IN (
      SELECT id FROM students WHERE class_id = ANY(get_my_class_ids())
    )
  );

DROP POLICY IF EXISTS "Parents can view children sessions" ON game_sessions;
CREATE POLICY "Parents can view children sessions"
  ON game_sessions FOR SELECT
  USING (
    get_user_role() = 'parent' AND student_id = ANY(get_my_children_ids())
  );

-- ============================================================================
-- SCORES TABLE POLICIES (Updated for RBAC)
-- ============================================================================

DROP POLICY IF EXISTS "Teachers can view class scores" ON scores;
CREATE POLICY "Teachers can view class scores"
  ON scores FOR SELECT
  USING (
    get_user_role() = 'teacher' AND student_id IN (
      SELECT id FROM students WHERE class_id = ANY(get_my_class_ids())
    )
  );

DROP POLICY IF EXISTS "Parents can view children scores" ON scores;
CREATE POLICY "Parents can view children scores"
  ON scores FOR SELECT
  USING (
    get_user_role() = 'parent' AND student_id = ANY(get_my_children_ids())
  );

-- ============================================================================
-- WEEKLY_RANKINGS TABLE POLICIES (Updated for RBAC)
-- ============================================================================

-- Keep public read for leaderboards

DROP POLICY IF EXISTS "Parents can view children rankings" ON weekly_rankings;
CREATE POLICY "Parents can view children rankings"
  ON weekly_rankings FOR SELECT
  USING (
    get_user_role() = 'parent' AND student_id = ANY(get_my_children_ids())
  );

-- ============================================================================
-- TEACHERS TABLE POLICIES (Updated)
-- ============================================================================

DROP POLICY IF EXISTS "Parents can view their children teachers" ON teachers;
CREATE POLICY "Parents can view their children teachers"
  ON teachers FOR SELECT
  USING (
    get_user_role() = 'parent' AND id IN (
      SELECT c.teacher_id FROM classes c
      JOIN students s ON s.class_id = c.id
      WHERE s.id = ANY(get_my_children_ids())
    )
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'RLS Policies Created Successfully!' as status;

-- List all policies for key tables
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('students', 'parents', 'classes', 'parent_students', 'roles')
ORDER BY tablename, policyname;
