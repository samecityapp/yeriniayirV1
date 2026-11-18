# PAKET 02 — P0 KRİTİK GÜVENLİK DÜZELTMELERİ (`samecityapp/yeriniayirV1`)

**Tarih:** 18 Kasım 2026  
**Geliştirme Dalı:** `feat/antigravity-production-readiness`  
**Önceki Rapor:** [PAKET_01_ALTYAPI_DENETIMI.md](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/docs/audits/PAKET_01_ALTYAPI_DENETIMI.md)  
**Kapsam & Sınırlar:** Yalnızca P0-1 (Yetkisiz `service_role` Server Action / `lib/offers.ts` / SSRF) ve P0-2 (Preview–Production Supabase izolasyonu) düzeltmeleri. Canlı `main` dalına dokunulmadı, Production dağıtımı yapılmadı, canlı/staging Supabase veritabanına hiçbir test kaydı yazılmadı, mevcut Gastronomi V5 tasarımına dokunulmadı.

---

## Özet Durum Tablosu

| Kalem | Başlık | Kod İçi Durum | Panel / Canlı Durum |
|---|---|---|---|
| **P0-1.1** | Kullanılmayan `getOffers` Server Action'ının kapatılması | **Geçti** | — |
| **P0-1.2** | `createOffer` / `updateOffer` / `deleteOffer` sunucu içi kimlik, admin yetkisi (MFA/Basic), CSRF (`same-origin`) ve `lib/offers.ts` yetki sembolü kapısı | **Geçti** | — |
| **P0-1.3** | `middleware.ts` `/jilinrime` nokta (`.`) atlama sırası ve `GASTRONOMY_AUTH_MODE=supabase` MFA bypass açığının kapatılması | **Geçti** | — |
| **P0-1.4** | Herkese açık `DynamicOfferPage` (`getBySlug`) `service_role` kullanımının en az yetkili `anon` RLS istemcisine indirilmesi | **Geçti** | — |
| **P0-1.5** | `actions.ts` sunucu SSRF / path traversal `fetch` ve `OfferManager.tsx` sabit `yeriniayir.com` polling döngüsünün kaldırılması | **Geçti** | — |
| **P0-2.1** | Kod içi Preview / Staging / Test ↔ Production Supabase okuma/yazma izolasyonu (`lib/supabase-env-guard.ts`, `next.config.js`, `lib/supabase*.ts`, `layout.tsx`) | **Geçti** | — |
| **P0-2.2** | Vercel Project Settings ortam değişkeni kapsam ayrıştırması & Supabase anahtar hijyeni | *Ajan kapsamı dışı* | **Test edilemedi** *(Kullanıcı panel adımı bekliyor — Bölüm 5)* |

---

## 1. Doğrulanan Güvenlik Açıkları ve Kanıtları

Değişiklik yapılmadan önce izole `127.0.0.1` mock sunucusu + yerel `npx next start` üzerinde çalıştırılan doğrulamalar sonucunda hem **gerçekleşen açıklar** hem de **gerçekleşmediği kanıtlanan bir senaryo** ayrıştırılmıştır:

### 1.1 Gerçek Olmadığı Kanıtlanan Senaryo (Değişiklik Yapılmadı)
- **`/tr` kök sayfasına doğrudan anonim `POST Next-Action` çağrısı:**
  - `.next/server/server-reference-manifest.json` çıktısında `workers` alanı teklif aksiyonlarını yalnızca `app/[lang]/(admin)/jilinrime/teklif-yonetimi/page` rotasına bağladığı için, `/tr` kök rotasına `Origin` başlığıyla gönderilen anonim `POST deleteOffer` isteği `HTTP 200` dönmüş ve mock DB'ye **0 istek** ulaşmıştır. (Dolayısıyla genel `/` ziyaretçi rotasından doğrudan `offers` silme senaryosu Next.js 15 yönlendirmesi nedeniyle çalışmamaktadır.)

### 1.2 Kod ve Çalışma Zamanında Kanıtlanan Gerçek Açıklar (`P0-1` ve `P0-2`)

1. **`P0-1A` — Fonksiyon İçi Sıfır Yetki Kontrolü + `GASTRONOMY_AUTH_MODE=supabase` MFA Bypass'ı (`Geçti — Düzeltildi`):**
   - `app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts` (`getOffers`, `createOffer`, `updateOffer`, `deleteOffer`) ve `lib/offers.ts` (`import { supabaseAdmin } from './supabase-admin'`) içinde hiçbir oturum, rol, MFA veya `Origin`/`Host` kontrolü bulunmuyordu.
   - `GASTRONOMY_AUTH_MODE=supabase` ayarlandığında `lib/pilot/adminAuth.ts` paylaşımlı Basic Auth'u emekliye ayırıp `jilinrime/layout.tsx` sayfa çizimini engellediği (`blockedByLayout: true`) halde, `middleware.ts`'deki eski `/jilinrime` bloğu `GASTRONOMY_AUTH_MODE` kontrolü yapmıyor ve sabit zamanlı olmayan `===` kullanıyordu. Next.js `POST Next-Action` çağrıları `layout.tsx` korumasından önce aksiyonu işlettiği için, emekliye ayrılmış Basic Auth başlığıyla gönderilen `POST /tr/jilinrime/teklif-yonetimi` isteklerinin MFA'yı atlayıp doğrudan `service_role` DB mutasyonu başlattığı yerel mock testinde kanıtlandı.
   - Ayrıca `getOffers` yalnız sunucu bileşeni olan `teklif-yonetimi/page.tsx` tarafından çağrılmasına rağmen `'use server'` dosyasında durduğu için derlenen `server-reference-manifest.json` içinde dışa açık Server Action ID'si olarak kayıtlıydı.

2. **`P0-1B` — `middleware.ts` Nokta (`.`) İçeren Yol Atlama Sırası (`Geçti — Düzeltildi`):**
   - `middleware.ts` içinde `pathname.includes('.')` statik atlama koşulu `/jilinrime` korumasından önce yer alıyordu (ör. `/tr/jilinrime/teklif-yonetimi.json` benzeri uzantılı yollar middleware Basic Auth denetimini atlayabiliyordu).

3. **`P0-1C` — Ziyaretçi Rotasında `service_role` Kullanımı (`Geçti — Düzeltildi`):**
   - `app/[lang]/[slug]/page.tsx` (`DynamicOfferPage`), her tekil slug isteğinde `offers.getBySlug(slug)` aracılığıyla `supabaseAdmin` (`SUPABASE_SERVICE_ROLE_KEY`) kullanıyordu; oysa `public.offers` tablosu için RLS'de anonim `SELECT` politikası zaten tanımlıdır (`supabase/migrations/20261029193000_lockdown_rls_policies.sql:125-128`).

4. **`P0-1D` — Sunucu SSRF / Path Traversal ve Canlı Domain Polling (`Geçti — Düzeltildi`):**
   - Eski `actions.ts:43-50`, FormData'dan gelen doğrulanmamış ham `slug` değeriyle sunucu tarafında `fetch(\`${baseUrl}/tr/${slug}\`)` ve `/en/${slug}` çağrısı yapıyordu (`../...` veya query/fragment enjeksiyonu ile iç yol taraması veya varsayılan `https://www.yeriniayir.com` nedeniyle Preview/yerelden canlı sunucuya istek).
   - Eski `OfferManager.tsx:294-312` istemcide sabit `https://www.yeriniayir.com/tr/${slug}?t=...` adresine 20 tekrarlı `fetch` döngüsü çalıştırıyordu.

5. **`P0-2` — Preview Ortamının Canlı Supabase Projesine (`jerkkxwgddujigsbeqwo`) Bağlanması (`Geçti — Kod Tarafı Kapatıldı; Panel Ayarı Bekleniyor`):**
   - Vercel Preview dağıtımında istemci JS chunk'ına (`5649-b1165e7cc3d14393.js`) `https://jerkkxwgddujigsbeqwo.supabase.co` adresinin derlendiği `PAKET_01` denetiminde doğrulanmıştı.
   - Kök neden: Vercel `Preview` ortam değişkenlerinin canlı projeyi paylaşması + `next.config.js`, `lib/supabase.ts`, `lib/supabase-admin.ts` ve `app/[lang]/layout.tsx:113,115` içinde canlı `jerkkxwgddujigsbeqwo` referansını durduran kod-içi kilit bulunmaması.

---

## 2. Değiştirilen Dosyalar ve Yapılan Düzeltmeler

| Dosya | Yapılan Düzeltme | Durum |
|---|---|---|
| [lib/supabase-env-guard.ts](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/lib/supabase-env-guard.ts) *(Yeni)* | Bilinen canlı Supabase projelerini (`jerkkxwgddujigsbeqwo`, `aknhkpevrlpsrfxzqtop`) Preview, Development, Staging (`APP_ENVIRONMENT`/`GASTRONOMY_CLOUD_ENV`), `GASTRONOMY_LOCAL_PREVIEW=1`, `test` ve `.vercel.app` / loopback tarayıcılarında algılayıp sıfır soket açan fail-closed `fetch` (`YA_SUPABASE_ENV_ISOLATION_BLOCKED`, HTTP 503) döndüren paylaşımlı izolasyon modülü eklendi. | **Geçti** |
| [next.config.js](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/next.config.js) | `VERCEL_ENV` `preview`/`development` veya staging derlemelerinde `NEXT_PUBLIC_SUPABASE_URL` canlı projelerden birine işaret ediyorsa derleme anında sentinel (`https://isolated-preview-blocked.invalid` / `isolated-preview-blocked-anon-key`) değerleriyle maskeleme eklendi; böylece istemci chunk'larına canlı URL ve anon key gömülmesi önlendi. | **Geçti** |
| [lib/supabase.ts](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/lib/supabase.ts) | `resolvePublicSupabaseConfig` ve `createBlockedSupabaseFetch` bağlandı; izole ortamlarda canlı Supabase'e tek bir ağ isteği dahi çıkması engellendi (`isSupabaseIsolated` dışa aktarıldı). | **Geçti** |
| [lib/supabase-admin.ts](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/lib/supabase-admin.ts) | `typeof window !== 'undefined'` koruması korundu; `SUPABASE_SERVICE_ROLE_KEY` yokken `NEXT_PUBLIC_SUPABASE_ANON_KEY`'e sessiz geri dönüş kaldırıldı; Preview/Staging'de canlı Supabase'e karşı `service_role` tamamen bloke edildi ve `assertSupabaseAdminReady()` kapısı eklendi. | **Geçti** |
| [lib/cloud/config.ts](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/lib/cloud/config.ts) | Canlı referans kontrolüne `aknhkpevrlpsrfxzqtop` ve `VERCEL_ENV === 'preview'` / `'development'` / `APP_ENVIRONMENT === 'staging'` ek blokajı getirildi. | **Geçti** |
| [app/[lang]/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/app/[lang]/layout.tsx) | Sabit `https://jerkkxwgddujigsbeqwo.supabase.co` `<link rel="preconnect">` ve `dns-prefetch` etiketleri kaldırılıp `getAllowedPublicSupabaseOrigin(...)` kontrolüne bağlandı. | **Geçti** |
| [lib/admin/offerAdminGuard.ts](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/lib/admin/offerAdminGuard.ts) *(Yeni)* | Sunucu-özel `requireOfferAdminAccess` / `verifyOfferAdminRequest` katmanı oluşturuldu: `same-origin` CSRF doğrulaması (`sec-fetch-site`, `origin`, `host`, loopback dışı `https:`), `GASTRONOMY_AUTH_MODE=supabase` modunda `ya_cloud_admin` + Supabase `auth.getUser` + `ya_is_admin` RPC doğrulaması (emekli Basic Auth ve `aal1`/normal kullanıcı reddi), Pilot modunda `checkPilotAdmin` + Bearer/`sb-*` reddi ve modül dışından sahtelenemeyen `Symbol('OfferAdminCapability')` yetki kanıtı eklendi. | **Geçti** |
| [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/middleware.ts) | `/jilinrime` kontrolü statik/nokta (`.`) atlama kuralının üstüne taşındı; sabit zamanlı olmayan parola kıyaslaması kaldırılıp `checkPilotAdmin` + `GASTRONOMY_AUTH_MODE=supabase` çerez kapısı bağlandı; tüm `/jilinrime` yanıtlarına `Cache-Control: private, no-store, max-age=0` ve `X-Robots-Tag: noindex, nofollow` eklendi. | **Geçti** |
| [app/[lang]/(admin)/jilinrime/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/app/[lang]/(admin)/jilinrime/layout.tsx) | `requireOfferAdminAccess({ requireSameOrigin: false })` ile hizalandı. | **Geçti** |
| [lib/offers.ts](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/lib/offers.ts) | `getAll`, `create`, `update`, `delete` ilk satırlarında `assertValidOfferAdminCapability(cap)` + `assertSupabaseAdminReady()` zorunlu hale getirildi, UUID/slug doğrulaması ve alan allowlist'i eklendi. Ziyaretçi `getBySlug` `supabaseAdmin` yerine RLS'li `supabase` anon istemcisine indirildi ve geçersiz slug'lar DB'ye gitmeden reddedildi. | **Geçti** |
| [app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts) | Kullanılmayan `getOffers` Server Action kaldırıldı. `createOffer`, `updateOffer`, `deleteOffer` başında `requireOfferAdminAccess({ requireSameOrigin: true })` ve katı `zod` şema doğrulaması zorunlu kılındı. Sunucu taraflı SSRF warmup `fetch(...)` bloğu tamamen kaldırılıp yerine yalnızca `revalidatePath` bırakıldı. | **Geçti** |
| [app/[lang]/(admin)/jilinrime/teklif-yonetimi/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/app/[lang]/(admin)/jilinrime/teklif-yonetimi/page.tsx) | `getOffers` yerine sayfa içinde doğrudan `requireOfferAdminAccess` + `offers.getAll(auth.capability)` çağrısına geçildi. | **Geçti** |
| [app/[lang]/(admin)/jilinrime/teklif-yonetimi/OfferManager.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/app/[lang]/(admin)/jilinrime/teklif-yonetimi/OfferManager.tsx) | Sabit `https://www.yeriniayir.com/tr/${slug}` adresine atılan 20 tekrarlı istemci polling döngüsü kaldırıldı ve `deleteOffer` hata/başarı dönüş kontrolü eklendi. | **Geçti** |
| [scripts/verify_p0_security_fixes.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/scripts/verify_p0_security_fixes.cjs) *(Yeni)* | Canlı veritabanına sıfır bağlantı ile yerel `127.0.0.1` mock sunucu ve derlenen `.next` çıktısı üzerinde Anonim / Normal Kullanıcı / Yönetici / Preview izolasyonu doğrulama paketi eklendi. | **Geçti** |

---

## 3. Test Sonuçları

Tüm güvenlik ve izolasyon testleri **canlı Supabase'e hiç bağlanmadan**, yalnızca yerel `127.0.0.1` mock sunucu ve bellek içi TypeScript yükleyicisi üzerinde çalıştırılmıştır (harici `fetch` çağrıları test boyunca bloklanmıştır):

### 3.1 `node scripts/verify_p0_security_fixes.cjs` — **24/24 Geçti**

| Test Grubu | Rol / Senaryo | Beklenen Sonuç | Gözlenen Sonuç | Durum |
|---|---|---|---|---|
| **A.1** | `actions.getOffers` kaldırılması | Client'a kapalı / manifestte yok | `typeof actions.getOffers === 'undefined'` ve `.next/server/server-reference-manifest.json` içinde yok | **Geçti** |
| **A.2–A.3** | **Anonim** `/jilinrime` (`tr`, `en`, kök, `.json`, `?_rsc`) & eksik `ADMIN_PASSWORD` | `401` (`no-store`, `noindex`) / eksik şifrede `503` | Tüm rotalarda `401` + başlıklar; eksik parolada `503` | **Geçti** |
| **A.4–A.5** | **Anonim** `createOffer`/`updateOffer`/`deleteOffer` ve yetkisiz doğrudan `lib/offers` çağrısı | `401` / `SECURITY VIOLATION`, `0` DB isteği | `status: 401`, `SECURITY VIOLATION`, mock DB istek sayısı = **`0`** | **Geçti** |
| **B.1** | **Normal Kullanıcı** Pilot modunda `Authorization: Bearer`, `sb-*-auth-token` çerezi, yanlış Basic | `403` / `401`, `0` DB isteği | Bearer `403`, `sb-*` çerezi `403`, yanlış Basic `401`, DB istek = **`0`** | **Geçti** |
| **B.2–B.4** | **Normal Kullanıcı** Bulut MFA modunda (`GASTRONOMY_AUTH_MODE=supabase`): emekli Basic, `aal1` pending çerezi, `ya_is_admin=false` normal Supabase kullanıcısı | Emekli Basic `401`, `aal1` `403`, normal üye `403`, `offers` mutasyonu `0` | Middleware + Action emekli Basic **`401`**, `aal1` **`403`**, normal kullanıcı **`403`**, `offers` tablosu istek = **`0`** | **Geçti** |
| **C.1** | **Yönetici** Cross-Origin / eksik `Origin` / `http://` non-loopback / `sec-fetch-site: cross-site` | `403`, `0` DB isteği | 5 farklı CSRF vektörünün tamamı `403`, DB istek = **`0`** | **Geçti** |
| **C.2–C.3** | **Yetkili Yönetici** (hem Pilot Basic hem Cloud MFA `ya_is_admin=true` modlarında ayrı ayrı) geçerli CRUD | İzole mock DB'de `create`/`update`/`delete` `{ success: true }` | Her iki modda da 3/3 mutasyon izole `127.0.0.1` mock DB üzerinde `{ success: true }`, harici warmup `fetch` = **`0`** | **Geçti** |
| **C.4** | **Yetkili Yönetici** ile SSRF / Path Traversal (`../api/go`, `169.254.169.254`, `/`, büyük harf), geçersiz UUID, bozuk JSON | Zod `400` reddi, `0` dış `fetch`, `0` DB yazma | Tüm kötü amaçlı slug ve ID'lerde `status: 400`, DB/fetch istek = **`0`** | **Geçti** |
| **D** | **Ziyaretçi** `offers.getBySlug` en az yetki | Anon anahtar ile sorgu (`service_role` yok); geçersiz slug `0` sorgu | İstek `Bearer dummy-anon-key-only` ile gitti; `../secret?x=1` için `0` sorgu | **Geçti** |
| **E.1–E.3** | **Preview İzolasyon** (`VERCEL=1 VERCEL_ENV=preview` altında hem `jerkkxwgddujigsbeqwo` hem `aknhkpevrlpsrfxzqtop`) | `0` ağ soketi, `YA_SUPABASE_ENV_ISOLATION_BLOCKED`, `next.config.js` maskelemesi, `cloudConfig` kilidi | Her iki canlı referans `0` ağ çağrısı ile `503 YA_SUPABASE_ENV_ISOLATION_BLOCKED`; `assertSupabaseAdminReady()` `SECURITY BLOCK` | **Geçti** |
| **F.1–F.2** | Derlenmiş `.next` & `next start` Preview simülasyonu (`GASTRONOMY_AUTH_MODE=supabase`) | Manifestte `getOffers` yok; `/tr` HTML `200` + preconnect yok; emekli Basic `POST` `401` | `/tr` `HTTP 200` (`jerkkxwgddujigsbeqwo.supabase.co` yok), emekli Basic `POST` `HTTP 401`, `/tr/luvicavehotel-teklif` `HTTP 200` | **Geçti** |

### 3.2 Önizleme İstemci Paketi (Client Chunk) Simülasyon Derlemesi — **Geçti**
- `VERCEL=1 VERCEL_ENV=preview NEXT_PUBLIC_SUPABASE_URL="https://jerkkxwgddujigsbeqwo.supabase.co" NEXT_PUBLIC_SUPABASE_ANON_KEY="dummy-preview-anon-not-real" npm run build` çalıştırıldı:
  - Derleme `exit 0` ile tamamlandı (`sitemap.ts` `YA_SUPABASE_ENV_ISOLATION_BLOCKED` hatasını temiz fallback ile karşıladı, canlı ağa çıkılmadı).
  - `.next/static/` taramasında `https://jerkkxwgddujigsbeqwo.supabase.co`, `https://aknhkpevrlpsrfxzqtop.supabase.co` veya test anon anahtarına **0 eşleşme** bulundu (derleme zamanında `https://isolated-preview-blocked.invalid` ile maskelendi).

### 3.3 Proje Doğrulama ve Güvenlik Kapıları — **Tümü Geçti**
- `node scripts/verify_pilot_security.cjs` → **48/48 Geçti** (`exit 0`)
- `node scripts/verify_staging_preflight.cjs` → **8/8 Geçti** (`exit 0`)
- `node scripts/verify_v3_gastronomy.cjs` → **21/21 Geçti** (`exit 0`)
- `node scripts/verify_visitor_content.cjs` → **10/10 Geçti** (`exit 0`)
- `npx tsc --noEmit` → **Geçti** (`exit 0`)
- `npm run build` → **Geçti** (`exit 0`)
- `node scripts/verify_p0_security_fixes.cjs` → **24/24 Geçti** (`exit 0`)

---

## 4. Henüz Doğrulanamayan Noktalar

1. **Vercel Dashboard Gerçek Environment Variables Kapsamları:** Ajanın Vercel hesap paneline erişimi olmadığı için `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` ve özellikle `SUPABASE_SERVICE_ROLE_KEY` anahtarlarının Vercel `Preview` ve `Development` kapsamlarında şu an fiilen tanımlı olup olmadığı panelden teyit edilememiştir.
2. **Yeni Commit'in Canlı Vercel Preview URL'sinde Doğrulanması:** Bu paketteki değişiklikler henüz `git push` yapılmadan yerel `feat/antigravity-production-readiness` dalında tutulmaktadır; uzak Vercel Preview derlemesi ancak siz push/ortam ayrımını onayladıktan sonra canlı Preview URL'si üzerinden gözlenebilir.
3. **Canlı Production (`jerkkxwgddujigsbeqwo`) Üzerinde Gerçek Admin / MFA Oturum Akışı:** Görev sınırı gereği canlı Production veritabanı ve `main` dalı üzerinde test veya değişiklik yapılmamıştır.

---

## 5. Vercel ve Supabase Panelinde Sizden Beklenen İşlemler

Kod tarafında Preview ortamının canlı Supabase'e bağlanmasını engelleyen zırh devreye alınmıştır; ancak sır hijyeni açısından **anahtarların Preview ortamına hiç enjekte edilmemesi** de gereklidir:

1. **Vercel Dashboard -> Project Settings -> Environment Variables:**
   - **Canlı proje değişkenlerini yalnızca `Production` ile sınırlayın (`Preview` ve `Development` kutucuklarını kaldırın):**
     - `NEXT_PUBLIC_SUPABASE_URL` *(canlı `jerkkxwgddujigsbeqwo` URL'si → yalnız `Production`)*
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` *(canlı anon key → yalnız `Production`)*
     - `SUPABASE_SERVICE_ROLE_KEY` *(canlı service role key → **yalnız `Production`**; `Preview` ve `Development`'ta KESİNLİKLE bulunmamalıdır)*
     - Varsa `ADMIN_PASSWORD` *(canlı parola → yalnız `Production`; Preview/Staging testleri için ayrı güçlü parola kullanın)*
   - **Preview ortamı için izole değer tanımlayın (scope: yalnız `Preview`):**
     - `NEXT_PUBLIC_SUPABASE_URL` = staging projesinin URL'si (`https://vhptlecaixpawtxnhsde.supabase.co`) **veya** izole dummy değer `https://isolated-preview-blocked.invalid`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = staging projesinin public anon key'i **veya** `isolated-preview-blocked-anon-key` *(not: bu iki değişken boş bırakılırsa `lib/supabase.ts` derleme aşamasında eksik env hatası verecektir; o yüzden staging key ya da bu sentinel değerlerden biri bulunmalıdır)*
     - `GASTRONOMY_AUTH_MODE` = `supabase` *(ve Preview bulut testleri kullanılacaksa `GASTRONOMY_SUPABASE_*` değişkenleri yalnız `vhptlecaixpawtxnhsde` staging projesi için tanımlanmalıdır).*
   - Değişikliklerden sonra bir **Preview Redeploy** tetikleyin.
2. **Supabase Dashboard (`jerkkxwgddujigsbeqwo`) -> Settings -> API / JWT:**
   - Eğer canlı `SUPABASE_SERVICE_ROLE_KEY` geçmişte yanlışlıkla herkese açık/korumasız bir Preview dağıtımına veya dış bir ortama verilmiş olabileceğinden şüpheleniyorsanız, güvenle yeni bir `service_role` anahtarına **rotate** edip yalnız Vercel `Production` kapsamına güncelleyin (kodumuz anonim ziyaretçi okumasından `service_role`'ü zaten çıkardığı için yalnız `jilinrime/teklif-yonetimi` etkilenir).
   - 31.10.2026 tarihli **42 RESTRICTIVE** yazma engelini bu aşamada **kaldırmayın**.

---

## 6. Kalan Riskler (Sonraki Paketlerin Kapsamı)

1. **`[P0 — Performans / Maliyet]` `force-dynamic` ve `headers()` Nedeniyle CDN Önbelleksizliği:** `app/[lang]/(main)/page.tsx` ve `localPreview.ts` kaynaklı `x-vercel-cache: MISS` durumu (Instagram yoğun trafiğinde yüksek Serverless SSR maliyeti) **PAKET 02 kapsamı dışında tutulmuştur**; bir sonraki pakette ele alınmalıdır.
2. **`[P1]` Üretime Geçişte Gizli `Footer` (`articles`) Sorgusu ve Hatalı `POST /api/track-event`:** `VERCEL_ENV === 'production'` olduğunda tetiklenen görünmez `<Footer />` DB sorgusu ve `%100 400/500` veren analiz uç noktası henüz düzeltilmemiştir.
3. **`[P1]` `/api/*` Rate-Limit Bypass'ı, Statik Dosya Edge Middleware Çarpanı ve `Permissions-Policy: geolocation=()`:** `middleware.ts:209` ve `next.config.js:115` sonraki güvenlik/maliyet paketinde ele alınmalıdır.
4. **`[P2]` Açık Legacy/Demo Rotaları, KVKK Rıza Kapısı ve CORS Uyumsuzluğu:** `/design-demo`, `/preview-food-card`, `/fethiye-yemek-rehberi`, `/otel/*`, `logout/route.ts` `signOut` hatası ve `next.config.js` CORS başlığı sonraki pakete bırakılmıştır.
