# PROJECT HANDOFF — ANTIGRAVITY'DEN CODEX'E PROJE DEVİR RAPORU

**Tarih:** 29 Ekim 2026  
**Aktif Git Dalı:** `feat/pilot-moda-kadikoy-coffee`  
**GitHub Repository:** `samecityapp/yeriniayirV1`

---

## 1. Proje Vizyonu ve Mevcut Durum

Yerini Ayır; kullanıcıların turistik tuzaklara ve yapay algoritma şişirmelerine düşmeden, semtlerin gerçek gastronomik kimliğini ve imza lezzetlerini keşfetmelerini sağlayan yeni nesil bir seyahat ve lezzet platformudur.

Kullanıcı mekan aramak için saatlerce yorum okumaz veya tadım yapmaz; AI araştırma ajanları çoklu bağımsız kaynakları tarar, şubeyi ve spesifik ürünü doğrular, yönetici ise hazırlanan kanıt paketini inceleyip tek tıkla onaylar.

---

## 2. Tamamlanan ve Doğrulanan İşler

1. **Güvenlik Sertleştirmeleri:**
   - `middleware.ts`: Hardcoded şifre yedeği (`|| 'Otel2024!'`) tamamen kaldırıldı. Şifre eksikse 503 fail-closed eklendi.
   - `lib/supabase-admin.ts`: Service role anahtarının client-side import edilmesi engellendi, loglardaki substring sızıntısı temizlendi.
   - `supabase/migrations/20261029193000_lockdown_rls_policies.sql`: RLS politikası hazırlandı, anonim `INSERT/UPDATE/DELETE` engellendi.
   - `scripts/verify_rls_security.mjs`: PGlite in-memory PostgreSQL 16 motoru ile 10/10 güvenlik testi başarıyla çalıştırıldı.

2. **Moda–Kadıköy Kahve Pilotu (Astra & Argon Modeli):**
   - Yapay yüzdelik puanlar (94.2 vb.) kaldırıldı.
   - 3 ayrı değerlendirme boyutu modellendi: **Ürün Kalitesi**, **Kanıt Güvenilirliği**, **Ziyaretçi Uygunluğu**.
   - Gerçek OSRM Yaya Rota Servisi entegre edildi (`Moda Caddesi & Cem Sokağı Kesişimi` referans başlangıç noktası).
   - Aday araştırması tamamlandı:
     - **#1 Montag Coffee Roasters:** Bademaltı şubesi ayrıştırıldı (209.7m / 2 dk 48 sn OSRM rotası).
     - **#2 Story Coffee Roasters:** Dalga Sk. Marko Paşa Köşkü şubesi doğrulandı (258.2m / 3 dk 27 sn OSRM rotası).
     - **#3 Çekirdek:** Salih Tunca Özgürer'in zanaatkâr dükkanı 3. sıraya yükseltildi (792.0m / 10 dk 35 sn OSRM rotası).
     - **Elenen Aday (Rafine Moda - Fine Cuisine):** Nene Hatun Sk. No:3/A adresinin saf kahveci değil, Fransız-Türk brunch/bistro konseptine dönüştüğü doğrulanarak kahve listesinden çıkarıldı ve brunch havuzuna aktarıldı.
     - **Elenen Aday (Kava Coffee):** Kadıköy Leylek Sk. şubesinin kapalı olduğu teyit edildi.

3. **Yönetici Onay Arayüzü:**
   - `/tr/moda-kadikoy-pilot` sayfası sıfır TypeScript hatası ile Next.js Production Build (`npm run build`) onayından geçti.
   - İnceleme sekmesinde şube, tam URL'ler, yazarlar, yayın tarihleri, karşıt görüşler ve açık çelişkiler listelenmektedir.

---

## 3. Devam Eden / Sıradaki Geliştirme Adımları (Codex Yol Haritası)

1. **Restoran Detay Modalı Genişletmesi:**
   - Mevcut `RestaurantDetailsModal.tsx` bileşenini 5 bölümlü yeni ürün mimarisine kavuşturmak:
     1. Ne Sipariş Etmeli?
     2. Neden Gitmeli?
     3. Sana Uygun mu?
     4. Ayrıca Bunları da Dene (Ana uzmanlık dışındaki özel lezzetler)
     5. Gitmeden Bil (Masa kısıtı, laptop durumu, açılış saati)
2. **Otomatik AI Pipeline Rotaları (`/api/pilot/...`):**
   - Mevcut pilot verisi doğrulanmış kanıtlara dayalı sabit dosya (`lib/pilot/modaKadikoyCoffeePilot.ts`) üzerinden sunuluyor.
   - Dinamik arama ve web tarama adımlarının API rotası olarak otomatize edilmesi.
3. **Vercel Preview URL Yetkilendirmesi:**
   - GitHub PR açıldıktan sonra Vercel Preview ortamında Basic Auth veya `x-admin-key` ile pilot ekranının halka kapalı test edilmesi.

---

## 4. Bilinen Notlar & Dikkat Edilmesi Gerekenler

- `app/sitemap.ts`: Derleme sırasında Supabase bağlantısı başarısız olsa bile build'in çökmemesi için try-catch emniyet kemeri eklendi.
- `.env.local`: Yeni rastgele 32 karakterlik yönetici şifresi atandı, dosya gitignore'da koruma altındadır.
