# Gelecek Otel Hizmeti, Şirket Kuruluşu ve Yasal Geçiş Planı (Dahili Kontrol Dokümanı)

- **Proje / Repo:** `samecityapp/yeriniayirV1` (`/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures`)
- **Dal:** `feat/paket-10d-gastronomy-legal-and-hotel-separation`
- **Kod & Ayrım Commit SHA:** `82d537d78fc8af3b3afd7cc6dc390e51d830afee`
- **Niteliği:** Bu dosya **ziyaretçiye gösterilmeyen dahili teknik/hukuki geçiş planıdır.** Bugünkü gerçek kişi gastronomi belgeleri ile ileride kurulacak şirketin otel belgelerinin birbirine karıştırılmaması için ayrı tutulmaktadır.

---

## 1. Silinmeden Korunan Otel Altyapısı Envanteri

İlk gastronomi yayınında otel hizmeti sunulmamasına karar verilmiş olmakla birlikte, ileride şirket kurulduğunda yeniden kullanılabilmesi için aşağıdaki kod, veritabanı, migration ve API bileşenleri **eksiksiz korunmuştur**:

1. **Veritabanı Şeması ve SQL Migration'lar (`73` Dosya):**
   - `hotels`, `hotel_groups`, `group_hotels`, `offers`, `hotel_clicks`, `analytics_events`, `tags`, `page_content`, `search_terms` tabloları ve `supabase/migrations/` altındaki `73` migration dosyasının tamamı korundu.
   - Paket 10B (`20261119180000_enforce_cloud_mfa_admin_rls.sql`) ve Paket 10C (`20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql`) ile sertleştirilmiş `is_admin_user()`, `ya_admin_save_group` RPC, `analytics_events`/`hotel_clicks` doğrudan yazma kilidi ve storage izolasyon kuralları aynen korundu.
2. **Otel Sayfaları, Bileşenleri ve Eski Yönetici Paneli:**
   - Sayfalar: `app/[lang]/(main)/_legacy/HotelHomePage.tsx`, `app/[lang]/(main)/otel/[id]/page.tsx` (+ `opengraph-image.tsx`), `app/[lang]/(main)/otel-listesi/page.tsx`, `app/[lang]/(main)/search/page.tsx`, `app/[lang]/[slug]/page.tsx`, `app/[lang]/hoteloffer/page.tsx` ve `hoteloffer1`–`hoteloffer4/page.tsx`.
   - Bileşenler ve Kütüphaneler: `components/HotelCard.tsx`, `components/HotelDetails.tsx`, `components/HotelListItem.tsx`, `components/LegacyHotelHomeClient.tsx`, `components/MobileHotelInfo.tsx`, `components/OfferPageTemplate.tsx`, `components/blog/RelatedHotels.tsx`, `components/hotel/*`, `components/skeletons/Hotel*`, `components/PageViewTracker.tsx`, `lib/db.ts`, `lib/offers.ts`, `lib/hotelSeo.ts`, `lib/hotelSearchCache.ts`, `lib/demoHotels.ts`, `lib/admin/offerAdminGuard.ts`.
   - Eski Otel Yönetim Paneli: `app/[lang]/(admin)/jilinrime/*` ve Server Actions (`legacyAdminActions.ts`).
3. **Analitik ve Dış Yönlendirme API'leri (Eski Otel Altyapısı İçin Sertleştirilmiş):**
   - [app/api/go/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/api/go/route.ts): SSRF/open-redirect engelli, `rl.policy === 'upstash'` ve otel doğrulamalı `hotel_clicks` kaydı korundu.
   - [app/api/track-event/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/api/track-event/route.ts): Upstash kesinti/fallback durumunda DB yazımını düşüren korumalar korundu.

---

## 2. İlk Gastronomi Yayınında Gizlenen / Pasifleştirilen Otel Yüzeyleri ve URL/SEO Kararları

Merkezi özellik anahtarı [lib/hotelLaunchGate.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/hotelLaunchGate.ts) (`isHotelSurfaceEnabled()`, varsayılan `false`) üzerinden kontrol edilen değişiklikler:

### A. Aktif Gastronomi Yüzeylerinden Temizlenen Otel Bağlantı ve Metinleri
| Yüzey | Yapılan İşlem (Varsayılan `ENABLE_HOTEL_SURFACE !== '1'`) |
|---|---|
| [components/Header.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/Header.tsx) | Masaüstü ve mobil menüden `"Oteller"` (`#oteller`) bağlantısı kaldırıldı; `"Kafe & Restoran Rehberi"` doğrudan `/tr/gastronomi` / `/en/gastronomy` dizinine bağlandı. |
| [components/Footer.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/Footer.tsx) | `/search` ve `"Fethiye/Antalya/Bodrum/Marmaris Otelleri"` bağlantıları gizlendi; yerine Gastronomi Dizini ile popüler gastronomi bölgeleri (`Moda`, `İstanbul`, `Alaçatı`, `Gaziantep`) ve `@gnkoteller` yerine `mailto:info@yeriniayir.com` iletişim ikonu eklendi. |
| [app/[lang]/(main)/hakkimizda/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/hakkimizda/page.tsx) & `dictionaries/{tr,en}.json` | `"10 yıllık butik otel keşif platformu"` anlatısı kaldırıldı; gerçek kişi işletmecili bağımsız gastronomi rehberi anlatımına ve `info@yeriniayir.com` iletişimine geçildi (`@geceligi.ne.kadar`, `@turkeyandhotels` gizlendi). |
| [app/[lang]/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/layout.tsx) & [app/manifest.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/manifest.ts) | Kök meta açıklamasından `"seçkin konaklama rehberi"`, `keywords`'ten `"otel önerileri"`, manifest'ten `"En İyi Oteller"` ifadeleri kaldırıldı. |
| [lib/schema-generator.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/schema-generator.ts) | `Organization` JSON-LD açıklaması gastronomiye uyarlandı; `WebSite` JSON-LD içindeki `/search?q=...` otel `SearchAction`'ı pasif moda alındı. |
| [app/[lang]/(main)/feed.xml/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/feed.xml/route.ts) | RSS kanal başlık ve açıklamasından `"boutique stays / konaklama"` kaldırıldı. |
| [app/[lang]/(main)/rehber/[slug]/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/rehber/%5Bslug%5D/page.tsx) | `<RelatedHotels />` bileşeni ve `"Konaklama seçenekleri ve fiyat aralıkları"` maddesi varsayılan gastronomi modunda gizlendi. |
| [app/[lang]/not-found.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/not-found.tsx) | Tüm sayfaların RSC sınırında taşınan `"Sizi en iyi otellere geri götürelim"` / `otellere göz atın` metin ve `/search` bağlantısı `/gastronomi` (`"gastronomi dizinine göz atın"`) olarak güncellendi. |

### B. Sitemap, Eski URL Politikası (`404 / 410 / noindex`), Domainler ve Güvenlik
1. **Sitemap İzolasyonu ([app/sitemap.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/sitemap.ts)):** `db.hotels.getAll()` çağrısı `!isSupabaseIsolated && isHotelSurfaceEnabled()` koşuluna bağlandı. Supabase bağlı olsa dahi `ENABLE_HOTEL_SURFACE=1` açılmadıkça `sitemap.xml` çıktısında **0 otel URL'si** yer alır (`1.529` gastronomi/rehber URL'si korunur).
2. **Eski Otel / Teklif URL'leri İçin Karar (`noindex, nofollow` vs `404`/`410`):**
   - `/otel/[id]`, `/hotel/[id]`, `/otel-listesi`, `/search`, `/hoteloffer`–`hoteloffer4`, `/[slug]` teklif yolları varsayılan modda hem HTTP başlığında ([middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/middleware.ts) `X-Robots-Tag: noindex, nofollow`) hem HTML `<meta name="robots">` etiketinde `noindex, nofollow` olarak işaretlenir ve `sitemap.xml` ile tüm navigasyondan çıkarılmıştır.
   - Alakasız otel URL'leri gastronomi ana sayfasına **otomatik 301 yönlendirilmez** (soft-404 ve konu alakasızlığı cezası riskini önlemek için).
   - *Eğer canlıda daha önce indekslenmiş belirli otel URL'lerinin arama sonuçlarından hızlı düşürülmesi istenirse:* Şirket açılışına kadar yalnızca ilgili eski otel rotaları (`otel/[id]`, `hoteloffer*`) için `ENABLE_HOTEL_SURFACE !== '1'` iken HTTP `410 Gone` döndürülmesi ayrı bir küçük ürün/SEO kararı olarak değerlendirilebilir. Mevcut kod altyapısının test edilebilirliğini (`verify_paket10b` Check 7 ve `verify_paket10c` Check 7) ve geri dönüş esnekliğini korumak için şu an `noindex, nofollow` + zero-sitemap yaklaşımı uygulanmıştır.
3. **`worldandhotels.com` Domain İlişkisi:**
   - Mevcut yapıda `www.yeriniayir.com` (TR) ve `www.worldandhotels.com` (EN) gastronomi sayfalarının `hreflang` çiftleri olarak `sitemap.ts`, `llms.txt` ve `middleware.ts` üzerinde aktiftir; mevcut çalışan bu domain yönlendirmesi plan dışı bozulmamıştır. Ancak marka bütünlüğü açısından şirket kurulduğunda İngilizce otel hizmetinin `worldandhotels.com` altında ayrı konumlandırılıp gastronomi EN rotalarının kendi domaininde ya da açık alt-bölümde nasıl ayrışacağı marka/SEO stratejisiyle ayrıca kararlaştırılmalıdır.
4. **Erişim Kontrolü ve `noindex` Sınırı:**
   - `robots.txt` ve `X-Robots-Tag: noindex, nofollow` yalnızca arama motoru indekslemesini engeller; **erişim kontrolü değildir**. Eski yönetici yolları (`/jilinrime/*`), pilot rotaları (`/moda-kadikoy-pilot/*`) ve analitik/yönlendirme uç noktaları (`/api/go`, `/api/track-event`) Supabase MFA (`aal2`), Postgres RLS, fail-closed `ADMIN_PASSWORD`, CSRF ve Upstash rate-limit katmanlarıyla bağımsız korunmaktadır.

---

## 3. Şirket Kurulduğunda Otel Hizmeti İçin 8 Aşamalı Geçiş Yol Haritası

> **Kritik İlke:** Şirket kurulduğunda bugünkü gerçek kişi gastronomi belgeleri kendiliğinden yeni şirketi veya otel hizmetini kapsamaz; tersi şekilde şirketin yeni belgeleri de eski verilerin hukuki sebebini kendiliğinden dönüştürmez. Geçiş ayrı hukuki inceleme ile yürütülür.

1. **Şirket Kuruluşu ve Ticari Kimlik Doğrulaması:** Ticaret sicil tescili, MERSİS, vergi kimlik numarası, merkez adresi, KEP/tebligat ve varsa ETBİS kayıt gerekliliklerinin tamamlanması.
2. **Otel Hizmet Modelinin Hukuki Tanımının Netleştirilmesi:** Hizmetin salt tanıtım/yönlendirme mi, 6563 sayılı ETK kapsamında aracı hizmet sağlayıcı mı, yoksa 1618 sayılı Kanun kapsamında seyahat acentesi / doğrudan oda satışı veya paket tur aracılığı mı olacağının kesinleştirilmesi.
3. **Yeni Şirket Veri Sorumlusu KVKK Aydınlatma ve Gizlilik Belgeleri:** Yeni tüzel kişi veri sorumlusunun kimliğiyle otel müşterisi/rezervasyon adayı, tesis yetkilisi, fatura, destek talebi ve tıklama/yönlendirme loglarını kapsayan ayrı KVKK m.10 aydınlatma metninin ve açık rıza kurgularının hazırlanması (gerekirse VERBİS değerlendirmesi).
4. **Sözleşme ve Tüketici Bilgilendirmeleri:** Doğrudan rezervasyon, ödeme veya kapora akışı eklenecekse Ön Bilgilendirme Formu, Mesafeli Satış Sözleşmesi (6502 sayılı TKHK ve Mesafeli Sözleşmeler Yönetmeliği), iptal/iade/cayma hakkı istisnaları (konaklama hizmetlerinde cayma istisnası dahil) ve tesislerle B2B üye işyeri sözleşmelerinin hazırlanması.
5. **Veri Sorumlusu Değişimi ve Geçmiş Veri Analizi:** Gerçek kişi döneminde elde edilen sınırlı teknik verilerin veya e-posta yazışmalarının yeni tüzel kişiye devredilip devredilemeyeceğinin KVKK kapsamında değerlendirilmesi; hukuki sebebi bulunmayan eski kayıtların yeni şirkete aktarılmayıp temizlenmesi veya silinmesi.
6. **Çerez ve Açık Rıza Mekanizmalarının Gözden Geçirilmesi:** Otel kampanyası, retargeting/pazarlama pikseli, gömülü harita/video veya canlı destek eklenecekse rıza banner'ının gerçek betiklerle uyumlu güncellenmesi ve eski tercih kayıtlarının yeniden onay gereksinimi yönünden ele alınması.
7. **Yeni Belgelerin Yayına Alınması ve Kullanıcı Bilgilendirmesi:** Güncellenen Kullanım Koşulları, Gizlilik, Çerez ve KVKK metinlerinin gerçek şirket bilgileriyle yayımlanması ve hizmet kapsamındaki değişikliğin kullanıcılara duyurulması.
8. **Otel Sistemi İçin Ayrı Güvenlik, Ödeme ve Yayın Onayı:** `ENABLE_HOTEL_SURFACE=1` açılmadan önce otel/teklif/ödeme akışlarının ayrı güvenlik, PCI-DSS/ödeme kuruluşu entegrasyonu ve hukuki uyum onayından geçirilmesi.

---

## 4. İleride Otel Hizmeti Açılırken Kullanılacak Aktivasyon Kontrol Listesi

- [ ] Şirket unvanı, MERSİS/VKN, KEP ve açık adresi 5 yasal sayfaya işlendi ve hukuk danışmanı tarafından onaylandı.
- [ ] Otel rezervasyon/aracılık modeline özel ön bilgilendirme, mesafeli sözleşme ve iptal/iade metinleri eklendi (rezervasyon/ödeme yoksa yönlendirme modeli açıkça sınırlandı).
- [ ] Veri sorumlusu gerçek kişiden yeni şirkete geçiş analizi ve KVKK m.9 yurt dışı aktarım sözleşmeleri tamamlandı.
- [ ] Eski otel URL'leri (`otel/[id]`, `otel-listesi`, `search`) ile aktif otel kataloğu (`hotels`, `offers` tabloları) içerik ve SEO açısından denetlendi (`worldandhotels.com` yönlendirme kararları netleştirildi).
- [ ] Yalnızca gerekli sunucu/build ortamında `ENABLE_HOTEL_SURFACE=1` ve `NEXT_PUBLIC_ENABLE_HOTEL_SURFACE=1` tanımlandı ve tam güvenlik/RLS/SEO regresyon kapısı yeniden geçirildi.
