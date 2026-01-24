-- Comprehensive fix for videos table schema
-- Run this to ensure all columns exist, regardless of previous state

-- 1. Ensure table exists (in case it was deleted)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add potentially missing columns safely
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS duration TEXT;

ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'));

ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS category TEXT;

ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 3. Refresh schema cache (Supabase typically handles this, but creating/altering triggers cache reload)
NOTIFY pgrst, 'reload schema';
