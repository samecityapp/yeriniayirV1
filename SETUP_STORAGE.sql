-- Storage Bucket Kurulumu (Resim ve Video)

-- 1. 'hotel-images' Bucket Oluşturma (Resimler için)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'hotel-images', 
    'hotel-images', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- 2. 'hotel-videos' Bucket Oluşturma (Videolar için)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'hotel-videos', 
    'hotel-videos', 
    true, 
    104857600, -- 100MB limit
    ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
) ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 104857600,
    allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

-- 3. RLS Politikaları (Güvenlik Ayarları)

-- Mevcut politikaları temizle (Çakışmayı önlemek için)
DROP POLICY IF EXISTS "Public Access Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Images" ON storage.objects;

DROP POLICY IF EXISTS "Public Access Videos" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Videos" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Videos" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Videos" ON storage.objects;

-- --- GÖRSELLER ('hotel-images') ---

-- Herkes görebilir (Okuma izni)
CREATE POLICY "Public Access Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'hotel-images' );

-- Sadece giriş yapmış kullanıcılar yükleyebilir
CREATE POLICY "Auth Upload Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'hotel-images' AND auth.role() = 'authenticated' );

-- Sadece giriş yapmış kullanıcılar güncelleyebilir
CREATE POLICY "Auth Update Images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'hotel-images' AND auth.role() = 'authenticated' );

-- Sadece giriş yapmış kullanıcılar silebilir
CREATE POLICY "Auth Delete Images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'hotel-images' AND auth.role() = 'authenticated' );

-- --- VİDEOLAR ('hotel-videos') ---

-- Herkes görebilir (Okuma izni)
CREATE POLICY "Public Access Videos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'hotel-videos' );

-- Sadece giriş yapmış kullanıcılar yükleyebilir
CREATE POLICY "Auth Upload Videos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'hotel-videos' AND auth.role() = 'authenticated' );

-- Sadece giriş yapmış kullanıcılar güncelleyebilir
CREATE POLICY "Auth Update Videos"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'hotel-videos' AND auth.role() = 'authenticated' );

-- Sadece giriş yapmış kullanıcılar silebilir
CREATE POLICY "Auth Delete Videos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'hotel-videos' AND auth.role() = 'authenticated' );
