-- ============================================================================
-- FIX DATABASE SCHEMA ERROR
-- Run this in Supabase SQL Editor to fix broken triggers/functions
-- ============================================================================

-- Drop potentially broken triggers
DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
DROP TRIGGER IF EXISTS update_parents_updated_at ON parents;

-- Check if update_updated_at_column function exists, create if not
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers
CREATE TRIGGER update_classes_updated_at 
    BEFORE UPDATE ON classes
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parents_updated_at 
    BEFORE UPDATE ON parents
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Test auth by selecting from admins table
-- ============================================================================

SELECT 'Testing admin table access...' as status;
SELECT id, email, auth_user_id, is_active FROM admins WHERE email = 'admin@cophuong.com';

SELECT 'If you see admin data above, the fix worked!' as result;
