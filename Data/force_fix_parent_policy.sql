-- Forcefully remove ALL policies on the 'parents' table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'parents') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON parents';
    END LOOP;
END $$;

-- Enable RLS
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

-- Create CLEAN, non-recursive policies

-- A. Public Read Access (Safe for internal dashboard lists)
CREATE POLICY "policy_allow_select_all"
ON parents FOR SELECT
USING (true);

-- B. Authenticated Write Access
CREATE POLICY "policy_allow_insert_authenticated"
ON parents FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "policy_allow_update_authenticated"
ON parents FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "policy_allow_delete_authenticated"
ON parents FOR DELETE
TO authenticated
USING (true);
