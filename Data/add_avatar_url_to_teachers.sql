-- Add avatar_url column to teachers table if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'avatar_url') THEN
        ALTER TABLE teachers ADD COLUMN avatar_url text;
    END IF;
END $$;

-- Optionally, verify it was added by selecting it (this part won't run in migration logic usually but good for manual check)
-- SELECT avatar_url FROM teachers LIMIT 1;
