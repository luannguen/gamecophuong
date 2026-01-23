-- FUNCTION: get_user_role_profile
-- PURPOSE: Lấy role và profile của user hiện tại, chạy với quyền SECURITY DEFINER để tránh lỗi permission
-- NOTE: Function này trả về JSONB để FE dễ xử lý

CREATE OR REPLACE FUNCTION public.get_user_role_profile()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- QUAN TRỌNG: Chạy với quyền owner, bypass RLS của bảng user
SET search_path = public, auth, pg_temp -- Security Best Practice: Reset search path
AS $$
DECLARE
    curr_user_id uuid;
    rec record;
    teacher_classes jsonb;
    parent_children jsonb;
BEGIN
    -- Lấy User ID từ session hiện tại
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
        -- Lấy thêm danh sách lớp học
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
        -- Lấy thêm danh sách học sinh con
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

    -- 4. Check STUDENT (Linked Auth User - Nếu sau này có tính năng Student Login bằng Email)
    SELECT * INTO rec FROM public.students WHERE auth_user_id = curr_user_id AND is_active = true LIMIT 1;
    IF FOUND THEN
        RETURN jsonb_build_object(
            'role', 'student',
            'profile', row_to_json(rec)
        );
    END IF;

    -- Role not found
    RETURN NULL;
END;
$$;

-- Cấp quyền thực thi cho User (Authenticated)
GRANT EXECUTE ON FUNCTION public.get_user_role_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role_profile() TO service_role;

-- Comment mô tả
COMMENT ON FUNCTION public.get_user_role_profile() IS 'Lấy Role và Profile của user hiện tại, bảo mật bằng SECURITY DEFINER';
