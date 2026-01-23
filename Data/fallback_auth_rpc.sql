-- ROBUST FALLBACK AUTHENTICATION (FINAL CLEANUP)
-- Fix PGRST203: Ambiguous Function Call
-- Drop ALL previous versions of the function before recreating

-- 1. DROP OLD FUNCTIONS (Clean State)
DROP FUNCTION IF EXISTS public.get_user_role_profile();
DROP FUNCTION IF EXISTS public.get_user_role_profile(uuid);

-- Enable extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- 2. Verify Password Function
CREATE OR REPLACE FUNCTION public.verify_user_password(
    input_email TEXT,
    input_password TEXT
) 
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
    found_user auth.users%ROWTYPE;
BEGIN
    SELECT * INTO found_user FROM auth.users WHERE email = input_email LIMIT 1;
    
    IF found_user IS NULL THEN
        RETURN NULL;
    END IF;

    IF found_user.encrypted_password = crypt(input_password, found_user.encrypted_password) THEN
        RETURN found_user.id;
    END IF;

    RETURN NULL;
END;
$$;
GRANT EXECUTE ON FUNCTION public.verify_user_password(TEXT, TEXT) TO anon, authenticated, service_role;

-- 3. Get User Role Profile (Unified)
CREATE OR REPLACE FUNCTION public.get_user_role_profile(input_user_id UUID DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    curr_user_id uuid;
    rec record;
    teacher_classes jsonb;
    parent_children jsonb;
BEGIN
    curr_user_id := COALESCE(auth.uid(), input_user_id);
    
    IF curr_user_id IS NULL THEN
        RETURN NULL; 
    END IF;

    -- 1. Check ADMIN
    SELECT * INTO rec FROM public.admins WHERE auth_user_id = curr_user_id AND is_active = true LIMIT 1;
    IF FOUND THEN
        RETURN jsonb_build_object(
            'role', 'admin',
            'profile', to_jsonb(rec)
        );
    END IF;

    -- 2. Check TEACHER
    SELECT * INTO rec FROM public.teachers WHERE auth_user_id = curr_user_id AND is_active = true LIMIT 1;
    IF FOUND THEN
        SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name))
        INTO teacher_classes
        FROM public.classes
        WHERE teacher_id = rec.id AND is_active = true;

        RETURN jsonb_build_object(
            'role', 'teacher',
            'profile', to_jsonb(rec) || jsonb_build_object('classes', COALESCE(teacher_classes, '[]'::jsonb))
        );
    END IF;
    
    -- 3. Check PARENT
    SELECT * INTO rec FROM public.parents WHERE auth_user_id = curr_user_id AND is_active = true LIMIT 1;
    IF FOUND THEN
         SELECT jsonb_agg(
            jsonb_build_object(
                'id', s.id,
                'display_name', s.display_name,
                'avatar_url', s.avatar_url,
                'total_score', s.total_score,
                'total_stars', s.total_stars,
                'relationship', ps.relationship,
                'isPrimary', ps.is_primary_contact
            )
        )
        INTO parent_children
        FROM public.parent_students ps
        JOIN public.students s ON ps.student_id = s.id
        WHERE ps.parent_id = rec.id;

        RETURN jsonb_build_object(
            'role', 'parent',
            'profile', to_jsonb(rec) || jsonb_build_object('children', COALESCE(parent_children, '[]'::jsonb))
        );
    END IF;

    -- 4. Check STUDENT (Linked User)
    SELECT * INTO rec FROM public.students WHERE auth_user_id = curr_user_id AND is_active = true LIMIT 1;
    IF FOUND THEN
        RETURN jsonb_build_object(
            'role', 'student',
            'profile', to_jsonb(rec)
        );
    END IF;

    RETURN NULL;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_user_role_profile(UUID) TO anon, authenticated, service_role;

-- Force Schema Reload
NOTIFY pgrst, 'reload schema';
