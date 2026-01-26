-- FIX SCRIPT: Seed Watch & Learn Data correctly
-- Goal: Overwrite bad data (order 99, 0s duration) with correct sample data.

-- 1. Ensure Categories
INSERT INTO public.categories (id, name, slug, description, icon_url, color_code, sort_order, is_active)
VALUES 
(
    '11111111-1111-1111-1111-111111111111', 'Daily Life', 'daily-life', 'Everyday activities', 'sun', '#F59E0B', 1, true
),
(
    '22222222-2222-2222-2222-222222222222', 'Science', 'science', 'Explore the world', 'beaker', '#3B82F6', 2, true
),
(
    '33333333-3333-3333-3333-333333333333', 'Math', 'math', 'Numbers and Logic', 'calculator', '#10B981', 3, true
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    color_code = EXCLUDED.color_code;


-- 2. Fix Unit: Daily Routines
INSERT INTO public.units (id, title, description, "order", status, category_id)
VALUES (
    'unit_daily_routine_01', 
    'Daily Routines', 
    'Learn about daily activities like brushing teeth, having breakfast, and going to school.', 
    1, 
    'published',
    '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    category_id = EXCLUDED.category_id;


-- 3. Fix Lessons (Overwrite bad ones if IDs match, otherwise insert new ones)
-- Note: User's bad lessons likely have different UUIDs if they created them via UI.
-- We will INSERT our good lessons. User can delete their bad ones.
-- Or we can try to update specific known IDs if we knew them. We don't.
-- So we generate standard IDs.

INSERT INTO public.lessons (id, unit_id, title, description, "order", current_version_id)
VALUES 
(
    'lesson_morning_routine_01', 'unit_daily_routine_01', 'Morning Routine', 'Start your day with energy!', 1, 'ver_morning_01'
),
(
    'lesson_school_time_01', 'unit_daily_routine_01', 'School Time', 'Getting ready for school.', 2, 'ver_school_01'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    "order" = EXCLUDED."order",
    current_version_id = EXCLUDED.current_version_id;


-- 4. Fix Versions
INSERT INTO public.lesson_versions (id, lesson_id, version_number, status, video_source, video_url, duration_sec, difficulty)
VALUES
(
    'ver_morning_01', 'lesson_morning_routine_01', 1, 'published', 'youtube', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 120, 1
),
(
    'ver_school_01', 'lesson_school_time_01', 1, 'published', 'youtube', 'https://www.youtube.com/embed/jNQXAC9IVRw', 150, 2
)
ON CONFLICT (id) DO UPDATE SET
    video_url = EXCLUDED.video_url,
    duration_sec = EXCLUDED.duration_sec;


-- 5. Seed Vocabulary (needed for checkpoints)
INSERT INTO public.vocabulary (id, category_id, word, meaning, image_url, audio_url)
VALUES
('a0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Wake Up', 'Thức dậy', NULL, NULL),
('a0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Brush Teeth', 'Đánh răng', NULL, NULL)
ON CONFLICT (id) DO NOTHING;


-- 6. Checkpoints
DELETE FROM public.checkpoints WHERE lesson_version_id IN ('ver_morning_01', 'ver_school_01');

INSERT INTO public.checkpoints (id, lesson_version_id, time_sec, type, vocab_id, content)
VALUES
('cp_m1', 'ver_morning_01', 15, 'vocab', 'a0000000-0000-0000-0000-000000000001', NULL),
('cp_m2', 'ver_morning_01', 45, 'vocab', 'a0000000-0000-0000-0000-000000000002', NULL);
