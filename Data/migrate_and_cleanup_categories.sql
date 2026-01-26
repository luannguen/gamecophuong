-- Migration Script: Consolidate Video Categories into Main Categories
-- Goal: Use 'public.categories' for everything, Drop 'public.video_categories'.

-- 1. Ensure the 'Daily Life' category exists in 'public.categories' with the well-known UUID
-- We use the ID '11111111-1111-1111-1111-111111111111' which was hardcoded in the seed and code.
INSERT INTO public.categories (id, name, slug, description, icon_url, color_code, sort_order, is_active)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Daily Life', 
    'daily-life', 
    'Everyday activities and routines', 
    'sun', 
    '#F59E0B', 
    1, 
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    color_code = EXCLUDED.color_code;

-- 2. Update 'units' table FK reference if needed.
-- First, drop old FK if it exists wrapping this in a DO block to be safe or just standard ALTER.
DO $$ 
BEGIN
  -- Try to drop FK to video_categories if it exists
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'units_category_id_fkey') THEN
    ALTER TABLE units DROP CONSTRAINT units_category_id_fkey;
  END IF;
  
  -- Try to drop FK to video_categories (alternate name)
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_units_video_category') THEN
    ALTER TABLE units DROP CONSTRAINT fk_units_video_category;
  END IF;
END $$;

-- 3. Add new FK to public.categories
-- Ensure clear data first: Update any units with invalid category_id to the default one
UPDATE units 
SET category_id = '11111111-1111-1111-1111-111111111111'
WHERE category_id NOT IN (SELECT id FROM public.categories);

-- Now add constraint
ALTER TABLE units 
ADD CONSTRAINT fk_units_category 
FOREIGN KEY (category_id) 
REFERENCES public.categories (id) 
ON DELETE SET NULL;

-- 4. Drop the redundant table
DROP TABLE IF EXISTS public.video_categories;

-- 5. Helper: If you had other data in video_categories you wanted to keep, you would insert it to categories first.
-- For this specific request, the user implies just switching over.
