-- SEED SCRIPT: Reset and Populate "Daily Life" Category
-- FIX: Used proper UUIDs for Vocabulary table (mixed type project: Units=String, Vocab=UUID)

DO $$
DECLARE
    daily_life_cat_id UUID := '11111111-1111-1111-1111-111111111111';
    
    -- Pre-calculated UUIDs for Vocabulary (Must be valid UUIDs)
    vocab_wake_up UUID := 'a0000000-0000-0000-0000-000000000001';
    vocab_brush UUID   := 'a0000000-0000-0000-0000-000000000002';
    vocab_bus UUID     := 'a0000000-0000-0000-0000-000000000003';
    vocab_teacher UUID := 'a0000000-0000-0000-0000-000000000004';
    vocab_clean UUID   := 'a0000000-0000-0000-0000-000000000005';
BEGIN
    -- ========================================================================================
    -- STEP 1: CLEANUP (Remove old data linked to this category)
    -- ========================================================================================
    RAISE NOTICE 'Cleaning up old Daily Life data...';

    -- Delete Checkpoints linked to Lesson Versions of Units in this Category
    DELETE FROM public.checkpoints 
    WHERE lesson_version_id IN (
        SELECT lv.id FROM public.lesson_versions lv
        JOIN public.lessons l ON lv.lesson_id = l.id
        JOIN public.units u ON l.unit_id = u.id
        WHERE u.category_id = daily_life_cat_id
    );

    -- Delete Lesson Versions linked to Lessons of Units in this Category
    DELETE FROM public.lesson_versions 
    WHERE lesson_id IN (
        SELECT l.id FROM public.lessons l
        JOIN public.units u ON l.unit_id = u.id
        WHERE u.category_id = daily_life_cat_id
    );

    -- Delete Lessons linked to Units in this Category
    DELETE FROM public.lessons 
    WHERE unit_id IN (
        SELECT id FROM public.units 
        WHERE category_id = daily_life_cat_id
    );

    -- Delete Units in this Category
    DELETE FROM public.units 
    WHERE category_id = daily_life_cat_id;
    
    -- Note: We don't delete vocabulary automatically as it might be shared, 
    -- but we will upsert our test vocab below.

    -- ========================================================================================
    -- STEP 2: ENSURE CATEGORY EXISTS
    -- ========================================================================================
    INSERT INTO public.categories (id, name, slug, description, icon, color_code, sort_order, is_active)
    VALUES (
        daily_life_cat_id, 
        'Daily Life', 
        'daily-life', 
        'Learn about everyday activities, routines, and habits.', 
        'sunny', 
        '#F59E0B', 
        1, 
        true
    )
    ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color_code = EXCLUDED.color_code,
        sort_order = EXCLUDED.sort_order;


    -- ========================================================================================
    -- STEP 3: INSERT UNITS (ID Type: VARCHAR/STRING)
    -- ========================================================================================
    INSERT INTO public.units (id, category_id, title, description, "order", status)
    VALUES 
        ('u_daily_01', daily_life_cat_id, 'Morning Routine', 'Start your day the right way!', 1, 'published'),
        ('u_daily_02', daily_life_cat_id, 'School Life', 'Fun times at school with friends.', 2, 'published'),
        ('u_daily_03', daily_life_cat_id, 'Evening Chores', 'Helping at home before bed.', 3, 'published');


    -- ========================================================================================
    -- STEP 4: INSERT LESSONS (ID Type: VARCHAR/STRING)
    -- ========================================================================================
    INSERT INTO public.lessons (id, unit_id, title, description, "order", current_version_id)
    VALUES 
        ('l_daily_01_01', 'u_daily_01', 'Wake Up & Shine', 'How to wake up nicely.', 1, 'v_daily_01_01_v1'),
        ('l_daily_01_02', 'u_daily_01', 'Brush Your Teeth', 'Keep your smile bright.', 2, 'v_daily_01_02_v1'),
        ('l_daily_02_01', 'u_daily_02', 'The School Bus', 'Riding the bus safely.', 1, 'v_daily_02_01_v1'),
        ('l_daily_02_02', 'u_daily_02', 'Classroom Rules', 'Listening to the teacher.', 2, 'v_daily_02_02_v1'),
        ('l_daily_03_01', 'u_daily_03', 'Tidy Up Toys', 'Clean up after playing.', 1, 'v_daily_03_01_v1');


    -- ========================================================================================
    -- STEP 5: INSERT VERSIONS (ID Type: VARCHAR/STRING)
    -- ========================================================================================
    INSERT INTO public.lesson_versions (id, lesson_id, version_number, status, video_source, video_url, duration_sec, difficulty)
    VALUES 
        ('v_daily_01_01_v1', 'l_daily_01_01', 1, 'published', 'youtube', 'https://www.youtube.com/embed/1GDFa-nEzlg', 180, 1),
        ('v_daily_01_02_v1', 'l_daily_01_02', 1, 'published', 'youtube', 'https://www.youtube.com/embed/wCio_xVlgQ0', 145, 1),
        ('v_daily_02_01_v1', 'l_daily_02_01', 1, 'published', 'youtube', 'https://www.youtube.com/embed/8hp9MefuI_I', 200, 2),
        ('v_daily_02_02_v1', 'l_daily_02_02', 1, 'published', 'youtube', 'https://www.youtube.com/embed/Dd6dBq3rVQA', 150, 2),
        ('v_daily_03_01_v1', 'l_daily_03_01', 1, 'published', 'youtube', 'https://www.youtube.com/embed/gPq7wzGEjqE', 120, 1);


    -- ========================================================================================
    -- STEP 6: INSERT VOCABULARY (ID Type: UUID)
    -- ========================================================================================
    INSERT INTO public.vocabulary (id, category_id, word, meaning, image_url, audio_url)
    VALUES 
    (vocab_wake_up, daily_life_cat_id, 'Wake Up', 'Thức dậy', NULL, NULL),
    (vocab_brush, daily_life_cat_id, 'Brush', 'Chải (răng)', NULL, NULL),
    (vocab_bus, daily_life_cat_id, 'Bus', 'Xe buýt', NULL, NULL),
    (vocab_teacher, daily_life_cat_id, 'Teacher', 'Giáo viên', NULL, NULL),
    (vocab_clean, daily_life_cat_id, 'Clean', 'Dọn dẹp', null, null)
    ON CONFLICT (id) DO NOTHING;


    -- ========================================================================================
    -- STEP 7: INSERT CHECKPOINTS (ID Type: VARCHAR, VocabRef: UUID)
    -- ========================================================================================
    INSERT INTO public.checkpoints (id, lesson_version_id, time_sec, type, vocab_id)
    VALUES 
        ('cp_wake_01', 'v_daily_01_01_v1', 10, 'vocab', vocab_wake_up),
        ('cp_brush_01', 'v_daily_01_02_v1', 30, 'vocab', vocab_brush)
    ON CONFLICT (id) DO UPDATE SET time_sec = EXCLUDED.time_sec;

    RAISE NOTICE 'Seed completed successfully for Daily Life! MIXED ID TYPES handled.';
END $$;
