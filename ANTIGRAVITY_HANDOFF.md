# Yerini Ayır — Antigravity eksiksiz devir rehberi

**Kesim tarihi: 1 Kasım 2026.** Sonraki dört günün geliştirme sorumlusu Antigravity. Bu belge güncel giriş noktasıdır; eski belgelerdeki tamamlanma iddiaları aşağıdaki ortam ve test ayrımıyla okunmalıdır. Yeni özellik değil yayın engelleri önceliklidir. Sohbet geçmişi gerekli değildir.

## 1. Nereden başlamalı?

**Çalışma klasörü:** `/Users/erdems/Documents/Codex/yeriniayir-cloud-admin`  
**Dal:** `feat/gastronomy-cloud-admin`  
Bu bağımsız Git deposu en yeni gerçek bulut/yönetici kodunu ve entegre gastronomi UI'sinin kopyasını içerir. Orijinal Git ortak dizinine bağlı değildir. Devir öncesi commit yoktu; bu devirde sır taramasından geçirilen dosyalar yerel commit ile korunur. Son commit kimliği `git log -1` ve yanındaki devir paketinin `COMMIT.json` kaydındadır.

**İlk iş:** Bu belgeyi ve güvenli snapshot envanterini oku; aşağıdaki salt okunur staging kontrolüyle başla, mevcut production build'i 3401'de çalıştır ve dört gerçek kartın güncel bulut çıktısını doğrula. Ardından üçlü içerik yönetimindeki eksikleri tamamla. Production'a geçiş yapma.

GitHub: `https://github.com/samecityapp/yeriniayirV1`. Bu bağımsız depoda yanlışlıkla push olmaması için remote eklenmedi. Köken ortak depodaki `dbacf9c...` çalışma kopyasıdır; tasarım `7a7e3a4...` dalından entegre edilmişti. Yeni bulut deposunu orijinale doğrudan merge edilebilir ortak tarihçe sanma; dosya farkları ve snapshot manifestleri üzerinden kontrollü aktarım gerekir.

## 2. Kesin ürün ve güvenlik kuralları

- Yerini Ayır gastronomi keşif platformudur. İlk gerçek kapsam **Moda → Kahve**, dört seçilmiş fiziksel şube. Veri olmayan bölgeler hazırmış gibi sunulmaz.
- Ana başlık “Canın ne çekiyor?”; alt metin “Konumunu seç. Kahvecileri, yemek mekanlarını ve yerel deneyimleri keşfet.” Tek header, şehir/ilçe/semt ve URL ile tutarlı kategori seçimi.
- En fazla 7 kategori. **Uygun bölgelerde** “Mutlaka Denenmesi Gerekenler” ilk sırada; yeterli veri yoksa zorla kategori doldurulmaz. “Buranın Ritüelleri” ayrı bölüm. Yürüyüş/rota geliştirilmez.
- Ziyaretçi kısa, tarafsız metin görür. Övgü, kişi adları, kişisel alıntı/anlatı, “Neden Gitmeli?”, özel araştırma bağlantıları yoktur. Kaynaklar yönetici/denetimde korunur.
- Gerçek şubeye ait resmi Google rating doğrulanırsa değişmeden ör. 4,4/5; **yorum sayısı ziyaretçi UI ve DTO'da yoktur**. Başka şubeden/başka siteden puan alınmaz. Doğrulanmayan alan gizlenir. Google atıf/lisansı korunur.
- En fazla 1–3 bağımsız olumlu ürün deneyimiyle destekli ve güncel sunumu doğrulanmış tavsiye. Menüde bulunma kalite değildir. Yalnız mevcut ürün detayda “Menüden”; kanıt yoksa başlık/kutu da yok.
- Ana uzmanlık, kategori uygunluğu, imza ürün ilişkisi, önerilebilir ürün ve diğer menü ürünleri ayrıdır. Brekkie kahve satıyor diye kahveci seçilmez. Eksik kanıt kötü kalite değildir. Kopya/sponsorlu/eski/yanlış şube kanıtları ayrılır; birleşik lezzet puanı yok.
- Otomatik seçim/rutin kararlar yönetici onayına bağlı değildir; yeterli kanıt yoksa ek araştırma. Manuel çıkarılan otomatik geri gelmez; manuel eklenen keyfi silinmez. Tüm değişiklikler gerekçeli, kayıtlı ve geri alınabilir olmalı. Manuel ekleme uydurma kalite iddiası yayımlayamaz.
- Hak kanıtı olmayan fotoğraf yayımlanmaz. Mevcut premium krem/beyaz, kontrollü mavi SVG illüstrasyonlar ve “Temsili görsel” etiketi korunur; gerçek mekan/ürün gibi sahte fotoğraf üretme.
- Otel/makale navigasyonda gizlidir; kodları, verileri ve eski URL'leri silinmez.
- **Ayrı açık onay olmadan push, deployment, production migration/veri aktarımı, ücretli API yok.** Geçici RLS engellerini kaldırma; kullanılmayan zannedilen Storage dosyalarını silme. Erişim engeli/403 aşma, Google yorum kazıma yok.

## 3. Tüm çalışma alanları ve Git durumu

Aşağıdaki sayılar devir başlangıcındaki `git status --untracked-files=all` dosya sayılarıdır, tamamı kayıp önleyici snapshot kapsamındadır. Eski klasörler commit/checkout/reset/clean ile değiştirilmedi.

| Klasör | Dal | HEAD | Değişmiş/izlenmeyen yol |
|---|---|---|---:|
| `/Users/erdems/.gemini/antigravity/scratch/yeriniayirV1` | `feat/pilot-moda-kadikoy-coffee` | `dbacf9c9e0f4523c74401b656c9d4de3c806d8f3` | 112 |
| `/Users/erdems/Documents/antigravity-design-lab/yeriniayir-mobile-design` | `feat/mobile-restaurant-detail-design` | `7a7e3a4752e55bf11551a440b010614fdaa62cdb` | 0 |
| `/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration` | `feat/gastronomy-ui-integration` | `dbacf9c9e0f4523c74401b656c9d4de3c806d8f3` | 258 |
| `/Users/erdems/Documents/Codex/yeriniayir-codex-development` | `feat/codex-development` | `dbacf9c9e0f4523c74401b656c9d4de3c806d8f3` | 210 |
| `/Users/erdems/Documents/Codex/yeriniayir-cloud-admin` | `feat/gastronomy-cloud-admin` | `Devir başlangıcında commit yok` | 2359 |
| `/Users/erdems/Documents/Codex/yeriniayir-signature-research` | `Git deposu değil` | `Devir başlangıcında commit yok` | 0 |

Orijinal `.git` ortak dizini Antigravity scratch klasöründedir; Codex/integration/design worktree komutları da oraya yazabilir. Bu sebeple yeni cloud-admin deposu bağımsızdır. Signature-research bir Git worktree değil ayrı deney klasörüdür; içindeki farklılıklar da korunmuştur. Tasarım dalı başlangıçta temiz, eski scratch dalı ise kirliydi; scratch değişikliklerini tamamlanmış tasarım diye birleştirme.

`node_modules` cloud-admin'de integration'a symlink'tir. Lighthouse tooling ve Postgres.app da eski integration'a bağlıdır. **Bu bağlantılar üzerinden npm install/update veya dosya düzenleme yapma.** Bağımlılık değişecekse yeni ayrı kopyada kendi node_modules dizinini oluştur. Arşivler yeniden üretilebilir node_modules/.next/cache dizinlerini içermez; kaynak, lockfile, çalışma verileri ve Git metaverisi korunur. Symlink hedefleri envanterde kayıtlıdır. Orijinal klasörleri silme/taşıma.

## 4. Mimari ve önemli dosyalar

Next.js **15.5.28**, React18.3.1, TypeScript, App Router, Tailwind; Supabase Postgres/Auth/Storage; Vercel hedefi, henüz bu bulut sürümü deploy edilmedi.

- `lib/pilot/integration/`: gerçek seçimden visitor adaptörü ve cache; `components/food/VenueImage.tsx`, `components/ui/FoodGuideCard.tsx`: premium kart/görsel.
- `lib/pilot/gastronomy/`: politika, durum/kararlar, seçki, bölge/kategori kataloğu, pipeline, scheduler hazırlığı.
- `lib/pilot/research/`: keşif, focused kaynak erişimi, opsiyonel Tavily adaptörü ve limitler. Anahtar yokken pasif; demo sonucu gerçek sayma. Araştırma sayfa açılışında çalışmaz.
- `lib/pilot/quality/`: ürün motoru, `product-evidence.json`, `targeted-followup.json`, kanıt defteri. `lib/pilot/auditor/`: bölgesel sınırlı işler, karşılaştırma/denetim. Türkiye tek taramada çalıştırılmaz.
- `lib/pilot/images/`: kaynak/hak incelemesi, illüstrasyon eşlemesi. Gerçek yeniden yayın izni doğrulanmış pilot fotoğrafı yok.
- `lib/pilot/googlePlaces/`: resmi transport, şube eşleştirme ve visitor puan kapısı.
- `lib/cloud/{config,client,contracts,publication,auth}.ts`: server-only Supabase bağlantısı, dar ziyaretçi sözleşmesi, bounded cache, üyelik ve MFA.
- `app/api/gastronomy-public/`: yalnız güvenli yayın projeksiyonu.
- `app/api/gastronomy-admin/{login,session,logout,workspace,research,publish}/`: server-side doğrulama, no-store, Origin kontrolleri.
- `app/[lang]/(admin)/gastronomi-yonetimi/`: güvenli yönetici paneli. İlk MFA kaydı QR'lıdır; son QR düzenlemesi build/typecheck geçti, kişisel hesapla uçtan uca kayıt henüz yapılmadı.
- `docs/PRODUCT_DECISIONS.md`, `CONTENT_GUIDELINES.md`, `PRODUCT_RECOMMENDATION_POLICY.md`, `REPRESENTATIVE_ILLUSTRATIONS.md`: ayrıntılı ürün kararları.

## 5. Gerçek mekanlar ve ürün kararları

| ID | Fiziksel şube | Şu anki güvenli ürün çıktısı |
|---|---|---|
| osm-node-5764070654 | Çekirdek — Şair Latifi | Öneri yok, doğrulanmış menü ürünü yok |
| osm-node-6124757286 | Story — Moda / Dalga Sokak | Menüden: Espresso, Cortado, V60 Pour Over; özel tavsiye yok |
| osm-node-8017443297 | Guten Morgen — Fırıldak | Öneri yok, doğrulanmış menü ürünü yok |
| osm-node-9375785317 | Montag — Moda / Bademaltı | Menüden: Hario V60 Demleme, Espresso, Filtre kahve; özel tavsiye yok |

Son ürün değerlendirmesinde **0 güçlü öneri**. Bu gerçek araştırma eksikliğidir, algoritma başarı puanı veya ürünlerin kötü olduğu iddiası değildir. Menü tazelik ve şube şartları geçmeden listeyi genişletme. Story Time Out 2024 iced V60 / iced dirty chai latte eski incelemedir; güncel şube menüsüyle eşleştirilmeden tavsiye olmaz. Montag Bomonti deneyimini Moda'ya taşıma. Brekkie kruvasan/fırın odağı ayrı vaka; spesifik ürün yeterince doğrulanmadıysa uydurma.

Ayrıntı: `docs/PRODUCT_RESEARCH_RESULTS.md`, `SIGNATURE_PRODUCT_FOLLOWUP.md`; `lib/pilot/quality/targeted-followup.json` somut URL ve reddetme gerekçelerini içerir. `product-evidence.json` sabit kod defteri de korunur; 46 dinamik dosya arşiviyle aynı şey değildir.

Başlangıç keşfinde 282 aday / 91 kahve sinyali, sonraki havuzlarda 95 aday görülmüştü. Bunlar tam kalite doğrulanmış işletme sayısı değildir. Son dört otomatik seçimi ve manuel karar geçmişini koru; eski demo pilot DTO'sunu ziyaretçi kaynağı sanma.

## 6. Google Places — gerçekte tamamlanan ve açık olan

Önceki açık onaylar toplam **12 istek** içindi: 5 arama (IP engelli ilk istek dahil) +7 detay. Story, Çekirdek ve Montag doğru şube kontrollerinden geçti; Guten Morgen kapı/bağımsız bölüm doğrulamasından geçmedi. **Bu izin tüketildi; yeni sorgu için yeni onay gerekir.** Tahmini seri üst maliyeti 0,30USD+vergi idi; gerçek fatura okunmadı.

Ham rating/userRatingCount yanıtları diske/DB'ye saklanmadı. Kalıcı metadata Place ID ve makbuzlardan oluşur. Dolayısıyla **üç eski API doğrulaması, kartlarda üç güncel puan çalışıyor demek değildir. Şu an bulut DTO'sunda rating yoktur; 3300 de otomatik yeni Places çağrısı yapmaz.** Eski onayla yeniden runner çalıştırma.

`docs/GOOGLE_PLACES_INTEGRATION.md` en son “toplam12istek” bölümünü oku. `work/google-places/` yerel makbuzlar ve Place ID store'u içerir; bunlar Git dışında özel arşivde korunur. Sırlar/ham puanlar devir belgesine yazılmaz. Google OAuth ile Places erişimini karıştırma. Daha önce sohbet/görselde açığa çıkmış anahtar kullanıcı tarafından silindi; bütün eski yerel anahtarlar için eski güvenlik raporunun iptal/yenileme planını yeniden doğrula, hiçbirini loglama.

Sürdürülebilir çözüm hâlâ açık: resmi puanın sunum/yenileme yaşam döngüsü, Google Maps atıfları ve güncel lisans saklama kurallarıyla uyumlu olmalı; keyfi TTL ile puan depolama veya ziyaretçi başına kontrolsüz ücretli istek yasak. Yeni araştırma/ücret izni olmadan sahte fixture puanını gerçekmiş gibi bağlama.

## 7. Supabase ortamları ve RLS

**Production:** YeriniAyir, `jerkkxwgddujigsbeqwo`, Frankfurt. Kullanıcının 1 Kasım ekranı YeriniAyir kuruluşunda **Pro** ve bu projeyi doğruladı. Hesap ekstresi ayrıca okunmadı. Duraklama kaldırıldı; gerçek veritabanı yedeği alındı.

**Staging:** YeriniAyir-Staging, `vhptlecaixpawtxnhsde`, İrlanda. Ayrı **turkeyandhotels Free** kuruluşundadır. Paneldeki `main PRODUCTION` etiketi o proje içindeki ana daldır; staging kimliğini gerçek production ile karıştırma.

Production'da daha önce kullanıcı onayıyla uygulanmış **42 RESTRICTIVE false yazma engeli + 45 eski PERMISSIVE = 87 politika** vardır: 13 uygulama tablosu ve storage.objects, toplam 14 ilişki. Birleşim `OR(PERMISSIVE) AND AND(RESTRICTIVE)` olduğundan eski geniş izinler false engelini aşamaz. Service-role bypass ayrı risktir; yalnız sunucu tarafında kalır. Bu devirde production değiştirilmedi.

**Production'a uygulanmayanlar:** yeni cloud şeması, gastronomi veri paketi, kişisel yönetici üyeliği, yayın cron'u ve kalıcı RLS geçişi. Geçici 42 engeli kaldırma.

Yalnız staging'e uygulanmış değişiklikler:
1. `supabase/proposed/20261101_gastronomy_cloud_admin.sql`
2. `20261101_staging_conflict_fix.sql` — PostgREST'in uzun retry davranışı nedeniyle 40001 yerine PT409.
3. `20261101_publication_pipeline.sql`
4. Özel `work/release-system/pipeline-input.private.sql` veri paketi.
5. `20261101_publication_cron.sql`

`supabase/proposed/20261101_permanent_write_boundary.sql` **yalnız taslak ve yerel testtir**. Aşama A eski 42'yi tutup kalıcı 42 ekler: 129 politika. Aşama B ayrı onay/test sonrası geçici 42'yi çıkarır: 87 kalır. Eski 45 silinmez. Legacy tablolara geniş yönetici yazması açılmaz; gastronomi dar MFA RPC'sini kullanır. Yerelde 288 kontrol geçti; production uygulanması değildir.

Production Storage salt okunur envanteri: **358 dosya / 662.804.194 bayt**. Eski DB referanslarına göre 217 inceleme adayı vardır; kesin kullanılmayan demek değildir. Hiçbiri silinmedi. SQL yedeği yaklaşık 4,9 MB; Storage ZIP yaklaşık 662,7 MB, ayrı yedeklerdir. Tam geri yükleme tatbikatı yayın kapısı olarak henüz tamamlanmadı. Konumlar: `docs/SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md`, `SUPABASE_PRODUCTION_RECOVERY.md`. İçeriği Git'e veya ziyaretçiye açma.

## 8. Yönetici ve üçlü ortak içerik yönetimi

İnsan yönetici paneli, Codex ve Antigravity aynı doğrulanmış canonical kayıt ve yayın geçmişini kullanmalıdır. **Üç ayrı dosya kaynağı arasında tamamlanmış bir senkronizasyon yoktur.** Tek bulut kaynak modeli hazırlanmıştır; iki ajanın araştırma çıktısını güvenli ve sürüm kontrollü ortak girişe yazması, tam yeni kaynak araştırma işçisi ve nihai entegrasyon eksiktir.

Özel `ya_private` şeması üyelikleri, canonical workspace'i, SHA ile araştırma arşivini, karar geçmişini, publication_inputs ve publication_jobs tablolarını tutar. Public tablolar yalnız ziyaretçi yayın snapshots ve aktif head içerir. `ya_is_admin` aktif özel üyelik + gerçek Auth + **aal2** ister; kullanıcı metadata'sındaki admin bayrağı kabul edilmez.

Yayın optimistic revision ile atomiktir. Manuel sıralama/çıkarma ve geri alma yeni değişmez sürüm oluşturur; geçmiş silinmez. Canonical dışı ID veya serbest kalite iddiası kabul edilmez. Son salt okunur staging kontrolünde **head 8** bulundu. Önceki sentetik reorder/undo testleri gerekçeli geçmişte durur; dört mekanın orijinal sırası geri yüklenmişti. Otomatik yenileme mevcut manuel sıra ve çıkarımları korur.

Gerçek staging'de iki **sentetik** hesapla Auth/MFA/yayın/geri alma test edildi. Kullanıcının kişisel hesabı henüz oluşturulmadı. Parola ve MFA yalnız kullanıcı tarafından Dashboard/siteye girilir; ajan alanları okumaz, görüntülemez veya dosyaya almaz. Akış `docs/PERSONAL_ADMIN_ONBOARDING.md` içindedir. Yetki ataması için yalnız kullanıcı UUID'si gerekir; kişisel parola gerekmez. Runtime'da service/secret key yoktur. Özel kurulum secret'ı yalnız test kurulumu içindir.

Eski Basic yardımcı endpointleri cloud auth modunda 503 ile kapanır. Oturum HttpOnly/SameSite Strict, HTTPS'te Secure; Origin kontrolü ve logout sonrası eski oturum 401 doğrulandı. Son QR kayıt görünümü derlendi; yeni hesapla QR kayıt regresyonu henüz yapılmadı.

## 9. Araştırma arşivi, yayın pipeline ve önbellek

**46 dinamik araştırma JSON dosyası**, manuel seçimler ve SHA manifesti staging özel arşivine taşındı. Canonical/arşiv eşitliği gerçek SQL ile kanıtlandı. Arşiv 1.740.589 bayttır. `work/cloud-admin/source-manifest.json` tam 46 yol ve SHA'yı içerir; eski kopyalarla farkları bu manifest üzerinden karşılaştır. Kaynaklar silinmez. Sabit kod defteri `lib/pilot/quality/product-evidence.json` ayrıca korunur.

Staging'de gerçek **pg_cron** işi `yeriniayir-staging-publication`, her 5 dakika aktif. Devir kontrolünde bir **published** ve sonraki **unchanged** işi görüldü. İşler sınırlı scope, advisory lock, hata gecikmesi ve kalıcı kayıt kullanır. **Bu iş mevcut kanıtı yeniden değerlendirip yayın lease'ini yeniler; internetten yeni bağımsız kaynak araştırmaz.**

`prepare_pipeline.cjs` gerçek ürün motoruyla değerlendirme yapar, eski checkedAt tarihlerini değiştirmez. Bu pakette hard kanıt sınırı **5 Kasım 2026 20:10:28 UTC / 23:10 Türkiye**. Yeni gerçek kanıt bulunmazsa süre dolunca yenileme durur ve içerik gizlenir. Tarihi ileri alarak araştırılmış gibi gösterme. Eski `CLOUD_ADMIN_READINESS.md` içindeki 1 saatlik 12:44 lease artık tarihsel test durumudur; güncel cron yayını head 8'e geçti.

Ziyaretçi sunucusunda 60 saniyelik bounded/deduplicated cache, Next Data Cache ve tag invalidation vardır. Yönetici cevapları no-store. Expiry cache vuruşlarında da kontrol edilir. Cloud hatasında yerel/demo veriye sessiz fallback yoktur. Yayın güncellemesi aynı süreçte anlık, diğer süreçlerde en geç TTL sonunda görülür; gerçek hosting/CDN ayrıca test edilmelidir. Rating kalıcı yayın belgesine dahil değildir.

Ölçülmüş gerçek staging yolu: soğuk SSR 959 ms, RPC 827 ms. Beş sıcak SSR 9–23 ms, toplam 0 ek Supabase veri sorgusu. RPC 648 B gzip gövde / 1.726 B açılmış JSON + 924 B yanıt başlığı. TLS ve istek başlıkları dahil değildir, fatura garantisi sayılamaz. Tarayıcıdan doğrudan Supabase/Google sorgusu 0. Yeni cron sonrası bütün ziyaret akışı ölçümleri tekrar yapılmalıdır.

## 10. Testlerin güvenilir durumu

**Tamamlanan önceki gerçek staging testleri:** anonim erişim 8; Auth/MFA 14; yönetici tarayıcı akışı 5 + logout replay 401; ziyaretçi 13 grup, 375/390/430/1440 px; SHA/arşiv eşitliği. Kanıtlar `work/cloud-admin/real-*-tests.json`, browser logları ve `import-verification.json` içindedir.

**Son yerel testler:** pipeline dahil 42 PostgreSQL kontrolü (`work/release-system/pipeline-sql-tests.log`); kalıcı RLS geçişi için 288 sentetik kontrol (`work/free-capacity/permanent-rls-test.json`). Bunlar gerçek DDL/politika tanımlarıyla yerel sentetik Auth testleridir; production saldırı testi değildir.

**Son kod:** TypeScript ve Next.js 15.5.28 production build başarılı (`work/release-system/{typecheck,build}.log`). Önceki lint hatasız, devralınmış uyarılar var. Son QR düzenlemesinden sonra bütün gerçek Auth/browser regresyonu tekrarlanmadı. Önceki 117 client chunk sır taraması 0 eşleşmeydi; yeni build için yeniden çalıştırılmalı.

**Performans ayrımı:** dosya tabanlı 3300'ün önceki mobil 97–98 / desktop 100 puanları yeni bulut 3401 ölçümü değildir. İki eski LCP 2,5 saniyeyi aştı. Preview noindex nedeniyle SEO 66; `perf:check` bu nedenle başarısızdı. Yeni gerçek bulut Lighthouse üç tekrarı **henüz yapılmadı**. Puan için içerik veya güvenlik gizlenmez, preview noindex koruması kaldırılmaz. INP saha ölçümü, laboratuvar TBT ile aynı değildir.

Kalıcı hedefler: mobil minimum 90/hedef 95+, desktop 95+, A11y/Best Practices 95+, SEO 100 gerçek yayında; LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1. Her önemli sayfada en az üç tekrar. Eski 50/100/300 eşzamanlılık ölçümü yalnız loopback HTTP patlamasıdır; Free planın 300 eşzamanlı DB sorgusunu kaldırdığını kanıtlamaz. Production yük testi yasaktır.

## 11. Çalıştırma ve doğrulama

Komutları Antigravity çalıştırır; kullanıcıya terminal işi verilmez. Başlangıç:

```sh
cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin
git status --short
git log -1 --oneline
npm run typecheck
npm run lint
npm run build
# Salt okunur; yalnız staging kimliğine izin verir:
python3 scripts/cloud/staging_operations.py check
# Gerçek bulut uygulaması; özel config otomatik okunur, sırları yazdırmaz:
node scripts/cloud/start_staging.cjs
```

Son devir HTTP kontrolünde **3300 ve 3401 kapalıydı: HTTP 000 / bağlantı reddi**. Çalışan sunucu varmış gibi raporlama. 3300 korunmuş eski integration; 3401 yeni cloud-admin kopyasıdır.

- `http://127.0.0.1:3300/tr?region=moda&category=kahve`
- `http://127.0.0.1:3401/tr?region=moda&category=kahve`
- `http://127.0.0.1:3401/tr/gastronomi-yonetimi`

3300 gerekirse integration klasörünün kendi korumalı yerel ayarlarıyla `node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3300` komutunu kullanır; önce build durumunu kontrol et. Orijinal dosyaları değiştirmeden yeni 3401'i değerlendir.

Yerel güvenlik testleri, cloud klasöründe (production'a bağlanmaz):

```sh
node scripts/cloud/verify_contracts.cjs
python3 scripts/cloud/verify_database.py
python3 scripts/cloud/verify_permanent_boundary.py
node scripts/verify_security_upgrade.cjs
node scripts/verify_google_places_transport.cjs
```

Gerçek staging testlerinin bazıları **sentetik reorder/undo ve oturum işlemleri yazar**, salt okunur değildir. Mevcut test UUID'lerini ve sonunda orijinal sıranın geri geldiğini doğrula:

```sh
node scripts/cloud/verify_real_anonymous.cjs
node scripts/cloud/verify_real_auth.cjs
node scripts/cloud/verify_real_admin_browser.cjs
VERIFY_ORIGIN=http://127.0.0.1:3401 VERIFY_CLOUD_MODE=1 node scripts/verify_gastronomy_integration_browser.cjs
```

Önce dört gerçek kaydın çıktıda bulunduğunu kontrol et; süresi dolmuş boş sayfada performans ölçme. CPU yükleyen başka işler olmadan:

```sh
PERF_ORIGIN=http://127.0.0.1:3401 PERF_REPORT_DIR=work/release-system/lighthouse-mobile PERF_DEVICES=mobile node scripts/run_premium_lighthouse.mjs after
```

Harness üç mobil run ve detay modal denetimleri içerir. Tooling symlink'i yalnız okunur; kurulum gerekirse ayrı dizine yapılır. Başarısız ölçümleri silme.

`staging_operations.py check` dışındaki action'lar şema/import/üyelik değiştirir; körlemesine tekrar çalıştırma. Mevcut şemayı sıfırlama. Eski `import.private.sql` lease'i eskidir; tekrar import etme. Production kimliğini engelleyen guard'ları kaldırma.

## 12. Öncelikli devam sırası ve gerçek yayın engelleri

1. **Üçlü ortak içerik yönetimi:** insan paneli ve iki ajan için tek canonical bulut kaynak; yetkili, sürüm kontrollü araştırma girdisi, manuel override/undo, kaynak çelişkisinde ek araştırma. Panel/MFA yayın RPC'sini yeniden yazma; mevcut temeli koru. SQL cron'u yeni keşif motoru sanma.
2. **Kalıcı yayın/veritabanı düzeni:** kişisel yönetici kurulumu, hard expiry'nin yeni gerçek araştırmayla yenilenmesi, sınırlı bütçeli kalıcı kaynak işçisi ve hata takibi. Production Pro hazır fakat cloud şema/veri/kişisel UUID üyeliği ve kalıcı RLS geçişi ayrı onay gerektirir. Mevcut 42 engeli açma.
3. **Google:** üç doğrulanmış şube için lisanslı güncel sunumu yeni bütçe onayıyla tamamla. Guten Morgen bağımsız bölümünü doğrula; belirsiz puanı gizle. Mevcut kartlarda 0 Google puanı gerçek yayın engelidir.
4. **Ürün:** dört şube ve Brekkie için hedefli kaynak araştırması; güçlü uzman incelemesinin kesin şube/güncel menü eşleşmesini ara. Şu an 0 güçlü öneri; Story/Montag menüsü var. Standardı düşürme.
5. **Bulut mobil performans:** üç run/sayfa, 375/390/430 px, gerçek dört kayıt, runtime hata/sızıntı kontrolü; LCP ve SEO eksiklerini doğru raporla.
6. **Son güvenlik/regresyon:** yeni build sır taraması, MFA QR kaydı, logout replay, yetkisiz DML, revizyon çatışması, eski URL'ler ve manuel ekleme/çıkarma/undo. Yedekten izole geri dönüş tatbikatı.
7. **Korumalı Vercel Preview:** yalnız staging runtime bağlantısı, HTTPS Secure cookie/Origin/canonical, deployment protection ve noindex. Service key tarayıcıda olmaz. Push/deployment için kullanıcı onayı olmadan oluşturma.
8. **Son canlı kapısı:** Google ve gerçek ürün şartları, veri/işçi/yetki ve performans başarılmadan “yayına hazır” deme. Production migration/veri aktarımının kapsam ve geri dönüş planını göster, ayrı onay al.

## 13. Güvenli koruma, erişim ve geri alma

Devir paketi: `/Users/erdems/Documents/Codex/yeriniayir-antigravity-handoff-20261101`. Aynı macOS kullanıcısının proje ve paket dosya sistemi erişimi kontrol edildi. **Antigravity uygulamasının içinden dosya açıldığı veya ajanın başlatıldığı test edilmedi.** Uygulamanın kendi sandbox izni ayrıca gerekebilir. E-posta, mesaj veya push ile aktarım yapılmadı.

`INVENTORY.json`: tüm Git durumları ve symlink'ler. `SNAPSHOTS.json`: kaynak/arşiv SHA ve doğrulama. `COMMIT.json`: güvenlik taramalı yerel commit. Özel arşivler .env, yerel bağlantı ayarları ve yedekler de içerebilir: dizin 0700, dosyalar 0600. **Git'e, bulut drive'a, sohbete veya halka açık URL'ye koyma.** Bunlar yalnız aynı bilgisayardaki korumalı kopyalardır. `work/` Git dışında kalır.

Arşivler kaynakları, izlenmeyen çalışmaları, araştırma/test çıktılarını ve Git metadata'sını içerir. Yeniden üretilebilir node_modules/.next/cache hariçtir; symlink'ler hedefi kopyalamadan korunur ve envanterde yazılıdır. Orijinal worktree pointer'ları eski mutlak yollara bağlıdır; başka yere çıkarınca körlemesine kullanma. Orijinal klasörleri silme veya taşıma.

Geri alma: önce arşiv SHA'sını manifestle karşılaştır, arşivi **yeni, özel, boş klasöre** çıkar; mevcut kopyanın üstüne açma. `git reset --hard` veya `git clean` kullanma. Sırlar 0600 kalmalı. Production dump'ını staging'e kopyalama. Kod geri alma yerel commit/snapshot ile; yayın geri alma yeni değişmez sürümle yapılır. Production geri dönüş SQL'i yalnız ayrı onayla uygulanır.

Bu devirde yeni özellik, ücretli API, push, deployment veya production değişikliği yapılmadı. Önce bu belgedeki güncel durum notlarını oku; eski belgelerdeki bir saatlik lease ve önceden doğrulanmış Google puanı ifadeleri bugünkü UI başarısı değildir.
