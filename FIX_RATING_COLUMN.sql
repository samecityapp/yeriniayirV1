-- Rating (Puan) Kolonunu Düzeltme
-- Mevcut 'numeric(2,1)' tanımı 10.0 değerini alamıyor (Max 9.9).
-- Ayrıca eski 'CHECK (rating <= 5)' kısıtlaması varsa 10 puan girilemez.

-- 1. Önce eski kısıtlamayı (varsa) kaldıralım
ALTER TABLE public.hotels DROP CONSTRAINT IF EXISTS hotels_rating_check;

-- 2. Kolon tipini 'numeric(3,1)' olarak değiştirelim
-- Bu sayede 10.0 (3 basamak toplam, 1 ondalık) değeri sığabilir.
ALTER TABLE public.hotels 
ALTER COLUMN rating TYPE numeric(3,1) USING rating::numeric(3,1);

-- 3. Yeni kısıtlamayı ekleyelim (0 - 10 arası)
ALTER TABLE public.hotels 
ADD CONSTRAINT hotels_rating_check CHECK (rating >= 0 AND rating <= 10);
