-- =================================================================
-- FINAL REPAIR SCRIPT: AUTHENTICATION & RBAC
-- Run this script to fix Error 500 Login and enable Secure Role Check
-- =================================================================

-- 1. FORCE RELOAD SCHEMA CACHE
-- Giúp Supabase nhận diện lại thay đổi quyền
NOTIFY pgrst, 'reload schema';

-- 2. FIX PERMISSIONS (Sửa lỗi "Database error querying schema")
-- Cấp quyền đọc schema hệ thống cho các role
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated, service_role;

GRANT USAGE ON SCHEMA information_schema TO postgres, anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO postgres, anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO postgres, anon, authenticated, service_role;

-- 3. FIX SEARCH PATH
-- Đảm bảo hệ thống tìm thấy bảng users
ALTER ROLE authenticator SET search_path TO public, auth, extensions;
ALTER ROLE authenticated SET search_path TO public, auth, extensions;
ALTER ROLE anon SET search_path TO public, auth, extensions;

-- 4. SECURE RPC FUNCTION (Server-Side Role Check)
-- Logic kiểm tra quyền bảo mật, thay thế cho logic Client-side cũ
CREATE OR REPLACE FUNCTION public.get_user_role_profile()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- Chạy với quyền Owner để bypass RLS
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    curr_user_id uuid;
    rec record;
    teacher_classes jsonb;
    parent_children jsonb;
BEGIN
    curr_user_id := auth.uid();
    
    IF curr_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1. Check ADMIN
    SELECT * INTO rec FROM public.admins WHERE auth_user_id = curr_user_id AND is_active = true LIMIT 1;
    IF FOUND THEN
        RETURN jsonb_build_object(
            'role', 'admin',
            'profile', row_to_json(rec)
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
            'profile', row_to_json(rec) || jsonb_build_object('classes', COALESCE(teacher_classes, '[]'::jsonb))
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
            'profile', row_to_json(rec) || jsonb_build_object('children', COALESCE(parent_children, '[]'::jsonb))
        );
    END IF;

    -- 4. Check STUDENT (Linked User)
    SELECT * INTO rec FROM public.students WHERE auth_user_id = curr_user_id AND is_active = true LIMIT 1;
    IF FOUND THEN
        RETURN jsonb_build_object(
            'role', 'student',
            'profile', row_to_json(rec)
        );
    END IF;

    RETURN NULL;
END;
$$;

-- Cấp quyền execute RPC
GRANT EXECUTE ON FUNCTION public.get_user_role_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role_profile() TO service_role;
