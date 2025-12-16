-- Storage Politikalarını Güncelleme (Anonim Yüklemeye İzin Ver)
-- Önceki kısıtlayıcı politikaları kaldırıyoruz

-- 1. Görseller İçin
DROP POLICY IF EXISTS "Auth Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Images" ON storage.objects;

-- Herkese YÜKLEME izni ver (INSERT)
CREATE POLICY "Public Upload Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'hotel-images' );

-- Herkese GÜNCELLEME izni ver (UPDATE)
CREATE POLICY "Public Update Images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'hotel-images' );

-- Herkese SİLME izni ver (DELETE)
CREATE POLICY "Public Delete Images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'hotel-images' );


-- 2. Videolar İçin
DROP POLICY IF EXISTS "Auth Upload Videos" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Videos" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Videos" ON storage.objects;

-- Herkese YÜKLEME izni ver (INSERT)
CREATE POLICY "Public Upload Videos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'hotel-videos' );

-- Herkese GÜNCELLEME izni ver (UPDATE)
CREATE POLICY "Public Update Videos"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'hotel-videos' );

-- Herkese SİLME izni ver (DELETE)
CREATE POLICY "Public Delete Videos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'hotel-videos' );
