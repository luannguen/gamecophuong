-- FIX: RLS Infinite Recursion on 'classes' table
-- PROBLEM: The current RLS policy on 'classes' likely references a table that references 'classes' back, causing a loop.
-- SOLUTION: Use a SECURITY DEFINER function to fetch classes. This bypasses RLS completely for this specific query.

-- 1. Create the RPC function
CREATE OR REPLACE FUNCTION get_active_classes()
RETURNS TABLE (
  id uuid,
  name text
) 
LANGUAGE plpgsql
SECURITY DEFINER -- <--- This is the key. It runs with the privileges of the creator (postgres/admin), bypassing RLS.
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name::text
  FROM classes c
  ORDER BY c.name ASC;
END;
$$;

-- 2. Grant execute permission to authenticated users (and anon if needed)
GRANT EXECUTE ON FUNCTION get_active_classes() TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_classes() TO service_role;
GRANT EXECUTE ON FUNCTION get_active_classes() TO anon; -- Optional: if you need public access

-- COMMENT: Run this in your Supabase SQL Editor to fix the "Class Unavailable" issue immediately.
