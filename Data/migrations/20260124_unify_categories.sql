-- Add 'icon' column to categories if missing (to store Material Symbol name)
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon TEXT;

-- Update existing categories with icons matching our design
UPDATE categories SET icon = 'pets' WHERE name = 'Animals';
UPDATE categories SET icon = 'diversity_3' WHERE name = 'My Family';
UPDATE categories SET icon = 'restaurant' WHERE name = 'Foods'; -- Note: Seed data didn't have Foods? check seeddata line 10-14. 
-- Seed data: Animals, My Family, Daily Routines, My House.
-- My Video Categories: Animals, Family, Foods, School, My Home, Music.
-- We need to merge them.

-- Merge/Upsert: Ensure all my video categories exist in the main categories table
-- Animals (Exists)
UPDATE categories SET icon = 'pets' WHERE slug = 'animals';

-- My Family (Exists)
UPDATE categories SET icon = 'diversity_3', color_code = '#FCCD2B' WHERE slug = 'my-family';

-- Daily Routines (Exists)
UPDATE categories SET icon = 'schedule', color_code = '#FFE66D' WHERE slug = 'daily-routines';

-- My House (Exists)
UPDATE categories SET icon = 'cottage', color_code = '#F97316' WHERE slug = 'my-house';

-- Insert missing ones from my Video list (Foods, School, Music)
INSERT INTO categories (name, slug, icon, color_code, sort_order)
VALUES 
    ('Foods', 'foods', 'restaurant', '#26d9d9', 5),
    ('School', 'school', 'school', '#A855F7', 6),
    ('Music', 'music', 'music_note', '#EC4899', 7)
ON CONFLICT (slug) DO UPDATE SET icon = EXCLUDED.icon, color_code = EXCLUDED.color_code;
