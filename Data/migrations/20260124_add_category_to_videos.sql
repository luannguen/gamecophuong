-- Add category column to videos table if it doesn't exist
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Just in case description is also missing (based on previous error potential)
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS description TEXT;
