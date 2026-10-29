# AGENTS.md — OpenAI Codex & AI Geliştirici Kılavuzu

Bu belge, **Yerini Ayır (`samecityapp/yeriniayirV1`)** projesinde çalışacak yapay zeka ajanları (OpenAI Codex, Antigravity, Claude, vb.) için bağlayıcı geliştirme ve güvenlik kurallarını içerir.

---

## 1. Proje Özeti ve Teknoloji Yığını
- **Framework:** Next.js (App Router, React 18, TypeScript)
- **Stil & UI:** Tailwind CSS, Lucide React Icons
- **Veritabanı & Auth:** Supabase (PostgreSQL, Row Level Security)
- **Hız Sınırlama (Rate Limiting):** Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`)
- **Çoklu Dil (i18n) & Domain Tabanlı Yönlendirme:**
  - Türkçe: `yeriniayir.com` (`/tr`)
  - İngilizce: `worldandhotels.com` (`/en`)
  - Yerel Geliştirme: `localhost:3000` / Vercel Preview domainleri

---

## 2. Temel Güvenlik Kuralları (ASLA İHLAL EDİLEMEZ)

1. **Sabit Şifre ve Yedekler Yasaktır:**
   - Kod tabanında (özellikle `middleware.ts` veya test betiklerinde) asla `|| 'Otel2024!'` veya benzeri sabit şifre yedeği bırakılamaz.
   - Yönetici korumalı rotalarda (`/jilinrime`, onay ekranları) `ADMIN_PASSWORD` eksikse sistem "Fail-Closed" (503 Service Unavailable) davranmalıdır.

2. **Supabase İstemci Güvenliği (`lib/supabase-admin.ts`):**
   - Service Role anahtarı (`SUPABASE_SERVICE_ROLE_KEY`) RLS bypass yetkisine sahiptir; **asla istemci bileşenlerinde (client components) import edilemez.**
   - Dosya başında `if (typeof window !== 'undefined') throw new Error(...)` koruması korunmalıdır.
   - Anahtar ön ekleri (örn. `key.substring(0, 5)`) dahil hiçbir gizli değer konsola veya loglara yazdırılamaz.

3. **Supabase RLS Yetki Koruması:**
   - Canlı Supabase üzerinde manuel veya kontrolsüz `ALTER TABLE` / `DROP POLICY` çalıştırılamaz.
   - Hazırlanan RLS migration'ı (`supabase/migrations/20261029193000_lockdown_rls_policies.sql`) incelenmeden doğrudan canlıya uygulanamaz.

4. **Sırların Depolanması:**
   - `.env`, `.env.local` ve benzeri sır dosyaları `.gitignore` içinde tutulur, asla Git'e commit edilemez.

---

## 3. Kodlama ve Mimari Standartları

1. **Mevcut Tasarımları Koruma:**
   - `components/nearby-places/RestaurantCard.tsx` ve ana sayfa kart tasarımları canlı vitrindir; tasarım onaysız değiştirilemez.
2. **Kategori Mimarisi (Maksimum 7 Kategori):**
   - Her bölge en fazla 7 gastronomi kategorisine sahip olabilir.
   - 1. sırada daima **"Mutlaka Denenmesi Gerekenler"** yer alır.
   - Kalan 6 kategori bölgenin gastronomi kimliğine göre atanır.
3. **Puanlama Sistemi Kuralı:**
   - 94.2 / 91.6 gibi tekil yapay birleşik puanlar kullanılmaz.
   - **Ürün Kalitesi**, **Kanıt Güvenilirliği** ve **Ziyaretçi Uygunluğu** olarak 3 ayrı boyutta kanıt temelli değerlendirilir.
4. **Coğrafi Rota ve Mesafe Doğrulaması:**
   - Tahmini veya kuş uçuşu yürüme mesafeleri kesin bilgi gibi sunulamaz.
   - Ölçümler OpenStreetMap / OSRM yaya rota servisi üzerinden sokak sokak doğrulanmalıdır.
5. **Veri ve İçerik Lisansları:**
   - Google ve diğer platformların API kullanım koşulları ihlal edilemez (Google yorumları veya ham puanları veritabanında toplu saklanamaz).
   - Bağımsız editöryal kaynakların tam URL'si, yayıncısı ve tarihi belirtilir; telifli fotoğrafları izinsiz kopyalanamaz.

---

## 4. Git Çalışma Yöntemi

1. **Ana Dala Doğrudan Yazma:**
   - `main` dalına doğrudan commit veya push yapılmaz.
   - Yeni çalışmalar `feat/...` veya `fix/...` dallarında yürütülür (Mevcut dal: `feat/pilot-moda-kadikoy-coffee`).
2. **Canlı Veritabanına Müdahale Yasağı:**
   - Kullanıcı açıkça onay vermeden yeni restoran kayıtları canlı Supabase `restaurants` tablosuna eklenemez.
   - Yeni mekan onayları Staging / Bellek (Dossier) üzerinde tutulur.

---

## 5. Build ve Test Komutları

```bash
# Bağımlılıkları yükleme
npm install

# Yerel geliştirme sunucusu
npm run dev

# TypeScript tipi denetimi
npx tsc --noEmit

# Üretim derlemesi (Next.js production build)
npm run build

# RLS Güvenlik Doğrulama Testi (PGlite PostgreSQL 16 motoru ile)
node scripts/verify_rls_security.mjs
```
