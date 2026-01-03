-- Create table for storing localized image metadata
CREATE TABLE IF NOT EXISTS public.article_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    alt_tr TEXT,
    alt_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.article_media ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for everyone
CREATE POLICY "Allow public read access" ON public.article_media
    FOR SELECT USING (true);

-- Create policy to allow write access for authenticated users (admins)
CREATE POLICY "Allow authenticated insert" ON public.article_media
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON public.article_media
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant access to anon key just in case
GRANT SELECT ON public.article_media TO anon;
GRANT SELECT ON public.article_media TO authenticated;
GRANT ALL ON public.article_media TO service_role;
