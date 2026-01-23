-- EMERGENCY REPAIR: DROP ALL TRIGGERS ON auth.users
-- Fix 500 Database Error during Login
-- Vấn đề Trigger hỏng thường chặn việc login/update user

DO $$ 
DECLARE 
    _sql text;
    _trigger_name text;
BEGIN
    FOR _trigger_name, _sql IN (
        SELECT 
            trigger_name,
            'DROP TRIGGER IF EXISTS ' || trigger_name || ' ON auth.users;'
        FROM information_schema.triggers
        WHERE event_object_schema = 'auth' 
        AND event_object_table = 'users'
        AND trigger_name NOT LIKE 'supabase_%' -- Keep internal system triggers if any
    ) LOOP
        RAISE NOTICE 'Dropping trigger: %', _trigger_name;
        EXECUTE _sql;
    END LOOP;
END $$;

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
