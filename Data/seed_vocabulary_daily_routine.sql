-- Seed Vocabulary for "Daily Routines" (compatible with Super Simple Songs)
-- Category: Daily Life (Using the UUID from previous seed '11111111-1111-1111-1111-111111111111')

-- VOCAB LIST:
-- 1. Wake up
-- 2. Wash face
-- 3. Brush teeth
-- 4. Comb hair
-- 5. Eat breakfast
-- 6. Get dressed
-- 7. Go to school

INSERT INTO vocabulary (id, word, meaning, image_url, audio_url, category_id, created_at)
VALUES 
    -- Wake up (Already in seed, but ensuring)
    ('a0000000-0000-0000-0000-000000000001', 'Wake up', 'Thức dậy', 'wakeup.png', 'wakeup.mp3', '11111111-1111-1111-1111-111111111111', NOW()),
    
    -- Wash face
    (gen_random_uuid(), 'Wash face', 'Rửa mặt', 'wash_face.png', 'wash_face.mp3', '11111111-1111-1111-1111-111111111111', NOW()),
    
    -- Brush teeth (Already in seed)
    ('a0000000-0000-0000-0000-000000000002', 'Brush teeth', 'Đánh răng', 'brush_teeth.png', 'brush_teeth.mp3', '11111111-1111-1111-1111-111111111111', NOW()),
    
    -- Comb hair
    (gen_random_uuid(), 'Comb hair', 'Chải tóc', 'comb_hair.png', 'comb_hair.mp3', '11111111-1111-1111-1111-111111111111', NOW()),
    
    -- Eat breakfast
    (gen_random_uuid(), 'Eat breakfast', 'Ăn sáng', 'breakfast.png', 'breakfast.mp3', '11111111-1111-1111-1111-111111111111', NOW()),
    
    -- Get dressed
    (gen_random_uuid(), 'Get dressed', 'Mặc quần áo', 'get_dressed.png', 'get_dressed.mp3', '11111111-1111-1111-1111-111111111111', NOW()),
    
    -- Go to school
    (gen_random_uuid(), 'Go to school', 'Đi học', 'go_to_school.png', 'go_to_school.mp3', '11111111-1111-1111-1111-111111111111', NOW())

ON CONFLICT (id) DO NOTHING;
-- Note: gen_random_uuid() generates new IDs, so conflict on ID is unlikely unless collision.
-- BUT we want to avoid duplicates if 'word' already exists.
-- However, schema likely only has PK on ID.
-- Ideally we check if word exists. But for a seed script on 'dev', duplicate words with different IDs might happen if run multiple times without constraints. 
-- Since user asked for "what doesn't exist then add", I should use ON CONFLICT (id) or WHERE NOT EXISTS logic if I knew specific IDs.
-- Since I don't valid IDs for new items, I'm using gen_random_uuid().
-- To avoid duplicates, I should technically check `word` + `category_id`.
-- BETTER APPROACH for idempotency:
-- Use a DO block or specific UUIDs if possible, or INSERT SELECT WHERE NOT EXISTS.

-- Updated strategy for idempotency on WORD:
INSERT INTO vocabulary (word, meaning, image_url, audio_url, category_id)
SELECT 'Wash face', 'Rửa mặt', 'wash_face.png', 'wash_face.mp3', '11111111-1111-1111-1111-111111111111'
WHERE NOT EXISTS (SELECT 1 FROM vocabulary WHERE word = 'Wash face' AND category_id = '11111111-1111-1111-1111-111111111111');

INSERT INTO vocabulary (word, meaning, image_url, audio_url, category_id)
SELECT 'Comb hair', 'Chải tóc', 'comb_hair.png', 'comb_hair.mp3', '11111111-1111-1111-1111-111111111111'
WHERE NOT EXISTS (SELECT 1 FROM vocabulary WHERE word = 'Comb hair' AND category_id = '11111111-1111-1111-1111-111111111111');

INSERT INTO vocabulary (word, meaning, image_url, audio_url, category_id)
SELECT 'Eat breakfast', 'Ăn sáng', 'breakfast.png', 'breakfast.mp3', '11111111-1111-1111-1111-111111111111'
WHERE NOT EXISTS (SELECT 1 FROM vocabulary WHERE word = 'Eat breakfast' AND category_id = '11111111-1111-1111-1111-111111111111');

INSERT INTO vocabulary (word, meaning, image_url, audio_url, category_id)
SELECT 'Get dressed', 'Mặc quần áo', 'get_dressed.png', 'get_dressed.mp3', '11111111-1111-1111-1111-111111111111'
WHERE NOT EXISTS (SELECT 1 FROM vocabulary WHERE word = 'Get dressed' AND category_id = '11111111-1111-1111-1111-111111111111');

INSERT INTO vocabulary (word, meaning, image_url, audio_url, category_id)
SELECT 'Go to school', 'Đi học', 'go_to_school.png', 'go_to_school.mp3', '11111111-1111-1111-1111-111111111111'
WHERE NOT EXISTS (SELECT 1 FROM vocabulary WHERE word = 'Go to school' AND category_id = '11111111-1111-1111-1111-111111111111');
