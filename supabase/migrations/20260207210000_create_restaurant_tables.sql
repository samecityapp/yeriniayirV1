
-- Create restaurant_categories table
CREATE TABLE IF NOT EXISTS public.restaurant_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title jsonb NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS public.restaurants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id uuid REFERENCES public.restaurant_categories(id) ON DELETE CASCADE,
    location text NOT NULL,
    name jsonb NOT NULL, -- or text, but user wants localization support? The types say name: LocalizedString | string
    image_url text, -- types say image or image_url
    description jsonb,
    google_rating numeric(2, 1),
    review_count text,
    order_suggestion jsonb,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create restaurant_notes table
CREATE TABLE IF NOT EXISTS public.restaurant_notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE,
    emoji text,
    text jsonb NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (optional but good practice)
ALTER TABLE public.restaurant_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable all access for all users" ON public.restaurant_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON public.restaurants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON public.restaurant_notes FOR ALL USING (true) WITH CHECK (true);
