# Yerini Ayır — Manuel Yayın Öncesi İşlemler ve Operatör Runbook'u

**Kapsam:** `feat/paket-10-final-release-audit` (`dda2cd6a2d9a669fbee9e14b7a2d6defd93f01ed`) canlıya çıkarılmadan önce **insan/operatör tarafından** tamamlanması zorunlu güvenlik, hukuk, bulut paneli, fiziksel cihaz ve felaket kurtarma adımları.

---

## 1. P0 Kritik Blokajlar (Canlıya Çıkmadan Önce Kesin Tamamlanmalı)

1. **`origin/main` Üzerindeki 3 Sızdırılmış Google API Anahtarını İptal / Rotate Edin (Madde 08 & 13):**
   - `origin/main` (`125c51108d5ef88f09baccf00dd044653b00e365`) üzerinde `19` noktada yer alan `3` benzersiz Google `AIza...` anahtarını Google Cloud Console → **APIs & Services → Credentials** altından derhal devre dışı bırakın / silin.
   - Yeni üretilen sunucu anahtarlarını (yalnız Places / GenAI için gerekiyorsa) API kapsamına ve sunucu IP / HTTP referrer kısıtlamasına bağlayın; asla istemci (`NEXT_PUBLIC_*`) veya Git deposuna koymayın.
   - `origin/main` üzerindeki `.env.local.backup` ve eski credential içeren script/markdown dosyalarını temizleyin; gerekiyorsa Git geçmişini (`git filter-repo` / yeni temiz `main` kesimi) yeniden yazın ve `origin/main`'de kullanılmış eski Supabase anon/URL çiftlerini kontrol edin.
2. **Tüm Ana Hesaplarda Sahiplik & 2FA/MFA Doğrulaması (Madde 07):**
   - Domain registrar, GitHub (`samecityapp/yeriniayirV1`), Vercel ve Supabase yönetim hesaplarının sahipliğini ve TOTP/donanım 2FA + kurtarma kodlarını teyit edin.

---

## 2. P1 Bulut Paneli, RLS & Bütçe / Alarm Ön Koşulları

3. **Vercel Ortam Değişkenleri & Bölge Eşleştirmesi (Madde 01, 12, 18):**
   - Production ortamında yalnız production Supabase projesi (`aknhkpevrlpsrfxzqtop` veya onaylı prod ref) ve Preview/Staging ortamında `vhptlecaixpawtxnhsde` tanımlı olduğundan emin olun (`cross-env` karıştırmayın).
   - Production için zorunlu anahtarları kontrol edin:
     - `APP_ENVIRONMENT=production`
     - `SUPABASE_PRODUCTION_AUTHORIZED=1`
     - `GASTRONOMY_PRODUCTION_AUTHORIZED=1`
     - `GASTRONOMY_AUTH_MODE=supabase`, `GASTRONOMY_CLOUD_ENV=production`
     - `UPSTASH_REDIS_REST_URL` (`https://...`), `UPSTASH_REDIS_REST_TOKEN`
     - `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block`
   - Deploy ortamında çalıştırarak teyit edin: `node scripts/verify_production_ratelimit_config.cjs` (`exit 0` vermeli).
   - Vercel Serverless Function bölgesini (ör. `fra1` Frankfurt) Supabase DB bölgesiyle aynı bölgeye sabitleyin.
4. **Vercel & Supabase & Upstash Maliyet Sınırları ve Alarmları (Madde 03, 05, 06, 31):**
   - Vercel → **Spend Management**: aylık bütçe tavanı, `%50 / %75 / %90` erken uyarı alıcıları ve aşım halinde **Auto-Pause / Webhook** kuralını etkinleştirin.
   - Supabase → **Billing / Spend Cap**: Spend Cap açık kalsın ve Auth MAU / PITR / Storage gibi Spend Cap dışı kalemleri ayrıca not edin.
   - Google Cloud Billing + Upstash Console'da günlük/aylık kota alarmı ve e-posta bildirimlerini açın.
   - Harici Sentetik Uptime İzleme (ör. Better Stack / UptimeRobot) ile `/tr`, `/tr/gastronomi/mekan/moda-gg-pizza` ve `/tr/search` uçlarını 1–5 dakikalık periyotla izleyin ve sorumluya **gerçek deneme alarmı gönderip ulaştığını doğrulayın**.
5. **Canlı Supabase RLS Kilidi Doğrulaması (Madde 09, 10):**
   - `jilinrime` eski istemci sayfaları (`restoranlar`, `dashboard`, `etiket-yonetimi`, `main-page-tags`, `otel-listesi`) tarayıcıdan `anon` `@/lib/supabase` kullandığından, canlı Supabase SQL Editor'de `hotels`, `restaurants`, `tags`, `price_tags`, `analytics_events`, `articles`, `offers` tablolarının `anon` rolüne karşı `INSERT`/`UPDATE`/`DELETE` yetkilerinin **kesin kapalı** olduğunu ve yalnızca `ya_publications` (yayınlanmış satırlar) vb. güvenli okumalara açık olduğunu SQL ile teyit edin.
   - Canlı Staging'de 1 adet yetkisiz hesap (`401`/`403`) ve 1 adet MFA (`aal2`) yönetici hesabıyla duman testi yapın.
6. **Canlı Yedekten Geri Yükleme & Instant Rollback Tatbikatı (Madde 32, 33, 34, 35):**
   - Supabase **Backups** sekmesinde otomatik günlük yedek / PITR sıklığı, saklama süresi ve Storage bucket yedek durumunu kaydedin.
   - Bir veritabanı yedeğini **ayrı bir test/staging projesine** geri yükleyin; örnek bir mekân/otel kaydı, bağlı görseli ve adresini açıp **gerçekleşen kurtarma süresini (RTO)** kaydedin.
   - Staging/Preview'da Upstash `TRAFFIC_EMERGENCY_MODE` anahtarını `shed` ↔ `off` çevirerek `0`-deploy acil modunu ve Vercel **Instant Rollback** işlemini prova edin.

---

## 3. P1 Hukuki Metinler, İçerik & Telif Doğrulamaları

7. **Yasal Metinlerdeki Yer Tutucuları Doldurun (Madde 39 — `KALDI`):**
   - [app/[lang]/(main)/(legal)/gizlilik-politikasi/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/gizlilik-politikasi/page.tsx) ve [app/[lang]/(main)/(legal)/kvkk-aydinlatma-metni/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/kvkk-aydinlatma-metni/page.tsx) dosyalarındaki `MERSİS/Vergi No: [İlgili Bilgiler Eklenecektir]` ve `Adres: [İlgili Bilgiler Eklenecektir]` ifadelerini gerçek şirket ünvanı, MERSİS/VKN ve tebligat adresiyle doldurun; log saklama sürelerini netleştirin.
   - [kullanim-kosullari/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/kullanim-kosullari/page.tsx) metninin gastronomi rehberini de kapsadığını hukuk açısından onaylayın.
8. **Paylaşılacak Pilot Seçkisi Saha ve Telif Kontrolü (Madde 40, 41):**
   - Instagram story ile duyurulacak ilk semtteki (ör. Moda/Kadıköy) tüm mekânların o gün açık olduğunu, doğru şube pinini (`cid=`), adını ve adresini manuel kontrol edin; hata bildirimi için aktif e-posta/iletişim yolunu (`info@yeriniayir.com`) teyit edin.
   - `public/` altında aktif gösterilecek tüm görsellerin kullanım/telif haklarını teyit edin.

---

## 4. P1/P2 Fiziksel Mobil Cihaz, Sosyal Önizleme ve Kademeli Yük Doğrulaması

9. **İki Gerçek Telefonda Instagram Story Uçtan Uca Testi (Madde 21, 22, 23, 44):**
   - Yayınlanacak Preview veya staging/prod URL'sini önce WhatsApp sohbetinde paylaşıp `yeriniayir-logo.png`, başlık ve açıklamanın doğru göründüğünü teyit edin (Madde 44).
   - En az **1 iPhone (Safari + Instagram içi tarayıcı)** ve **1 orta sınıf Android (Chrome + mobil veri)** cihazda story bağlantısını (`?utm_source=instagram&utm_medium=story`) açın:
     - İlk açılış, bölge arama, kategori filtreleme, kaydırma, sanal klavye, tarayıcı geri tuşu,
     - Konum izni reddi (`code=1`) ve izni verme (`Moda` eşleşmesi),
     - Google Maps kurulu olan ve kurulu olmayan senaryoda `Yol Tarifi` (`cid=`) bağlantısı ve adres metninin kopyalanabilirliği,
     - Sayfa Hızı / Core Web Vitals (`LCP <= 2,5 sn`, `INP <= 200 ms`, `CLS <= 0,1`).
10. **Kademeli Bulut Yük Testi, 1.000 Ziyaret Maliyeti ve Search Console (Madde 24–30, 36–38, 43, 46):**
    - Ekiple nöbetçi sorumluyu ve Instagram kriz iletişim mesajı taslağını belirleyin (`15 dk`lık `100 -> 500` VU bulut yük testiyle `x-vercel-cache > %95` ve `p95 TTFB < 300 ms` hedefini ölçüp `1.000` ziyaret fatura farkını çıkarın).
    - Canlıya çıkışta DNS/SSL yenileme bildirimlerini kontrol edin, Google Search Console'a `https://www.yeriniayir.com/sitemap.xml` ve `https://www.worldandhotels.com/sitemap.xml` haritalarını gönderin ve GA4 Real-Time'da rıza sonrası UTM test tıklamasını doğrulayın.
    - Küçük pilot sonrası `1.` saat metriklerini (`Madde 46`) doğrulamadan 1M takipçiye geniş duyuru (`Madde 47`) yapmayın.
