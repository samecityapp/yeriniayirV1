-- OTELLER TABLOSUNU GÜNCELLEME (Eksik Alanlar)
-- Bu scripti SQL Editor'de çalıştırın.

-- 1. Kahvaltı Alanları
ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS breakfast_description text,
ADD COLUMN IF NOT EXISTS breakfast_images text[] DEFAULT '{}';

-- 2. Sıkça Sorulan Sorular (JSONB olarak saklayacağız)
-- Örnek: [{"question": "...", "answer": "..."}]
ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;

-- 3. Diğer olası eksik alanlar (Kodda kullanılıyorsa)
-- Eğer 'rating' zaten varsa hata vermez (IF NOT EXISTS)
ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS rating numeric(2,1) DEFAULT 0;
