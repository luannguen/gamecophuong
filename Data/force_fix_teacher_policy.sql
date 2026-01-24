-- 1. Forcefully remove ALL policies on the 'teachers' table using a dynamic block
-- This handles the case where we don't know the exact policy names causing recursion.
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'teachers') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON teachers';
    END LOOP;
END $$;

-- 2. Verify RLS is enabled (or re-enable it)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- 3. Create CLEAN, non-recursive policies

-- A. Public Read Access (Safe for this context, allows viewing the list)
CREATE POLICY "policy_allow_select_all"
ON teachers FOR SELECT
USING (true);

-- B. Authenticated Write Access (Insert/Update/Delete for logged-in users)
CREATE POLICY "policy_allow_insert_authenticated"
ON teachers FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "policy_allow_update_authenticated"
ON teachers FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "policy_allow_delete_authenticated"
ON teachers FOR DELETE
TO authenticated
USING (true);
