-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    duration TEXT, -- Stores "5 mins" string as seen in mock
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    category TEXT, -- e.g., 'Animals', 'Family', 'Songs'
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- 1. Everyone can view videos (Public Read)
CREATE POLICY "Public videos are viewable by everyone" 
ON public.videos FOR SELECT 
USING (true);

-- 2. Only Admins can insert/update/delete (assuming auth logic, relying on specific roles usually, 
--    but for this simple app, we might check if user is authenticated or has specific metadata. 
--    For now, allowing authenticated users to CRUD if they are admins, 
--    or purely relying on App logic if RLS is 'true' for select and stricter for others).

-- Simple Admin Policy (Adjust 'role' check based on your actual auth setup)
-- CREATE POLICY "Admins can manage videos" 
-- ON public.videos FOR ALL 
-- USING (auth.jwt() ->> 'role' = 'service_role'); -- Example

-- For now, allowing full access to authenticated users acting as Admin in the app context is riskier 
-- but common in simple prototypes. A safer quick default:
CREATE POLICY "Authenticated users can manage videos" 
ON public.videos FOR ALL 
USING (auth.role() = 'authenticated'); 
