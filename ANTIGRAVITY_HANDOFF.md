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

## 7. Supabase ortam ayrımı ve RLS

**Production:** YeriniAyir, `jerkkxwgddujigsbeqwo`, Frankfurt. Kullanıcının 1 Kasım ekranı YeriniAyir kuruluşunda **PRO** ve bu projeyi doğruladı; hesap ekstresi bağımsız okunmadı. Önceki duraklama kaldırıldı, veritabanı gerçek yedeği alındı.

**Staging:** YeriniAyir-Staging, `vhptlecaixpawtxnhsde`, İrlanda; ayrı turkeyandhotels **Free** kuruluşunda. Panelin `main PRODUCTION` etiketi proje içi ana dal etiketidir; bu kimliği gerçek production projesiyle karıştırma.

Production'da kullanıcı onayıyla daha önce uygulanmış **42 RESTRICTIVE false yazma engeli +45 eski PERMISSIVE =87 politika**, 13 uygulama tablosu ve storage.objects (14 ilişki) vardır. Kural `OR(PERMISSIVE) AND AND(RESTRICTIVE)`; eski geniş izinler restrictive false'u aşamaz. Geçici engelleri kalıcı yetki ve ayrı onay olmadan kaldırma. Service-role bypass ayrı risk; sadece sunucu tarafında ve dar işlerde.

Production'a yeni cloud şeması, gastronomi paketi, üyelik, cron veya kalıcı RLS taslağı **uygulanmadı**. Devirde production değişikliği yapılmadı.

Yalnız staging'e uygulanmış dosyalar:
1. `supabase/proposed/20261101_gastronomy_cloud_admin.sql`
2. `20261101_staging_conflict_fix.sql` (40001 yerine PT409; PostgREST uzun retry engeli)
3. `20261101_publication_pipeline.sql`
4. Özel `work/release-system/pipeline-input.private.sql` veri paketi
5. `20261101_publication_cron.sql`

`supabase/proposed/20261101_permanent_write_boundary.sql` **yalnız taslak ve yerel test**. AşamaA eski42'yi tutup kalıcı42 ekler129politika; AşamaB ayrı onay/test sonrası eski42'yi çıkarır87kalır. Eski45 silinmez. Legacy tabloları geniş admin yazmasına açmaz; yeni gastronomi dar MFA RPC'sini kullanır. Local288kontrol geçti; production uygulandı diye yorumlama.

Storage salt okunur envanteri358dosya /662804194bayt. EskiDBreferanslarına göre217incelemeadayı var; kesin kullanılmayan değil. Hiçbiri silinmedi. DB SQL yedeği yaklaşık4,9MB ve StorageZIP yaklaşık662,7MB ayrı şeylerdir; tam geri yükleme tatbikatı henüz yayına hazır kabul edilmedi. Yedek konumlarını `docs/SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md` ve `SUPABASE_PRODUCTION_RECOVERY.md` üzerinden bul; içeriklerini ziyaretçiye/Git'e açma.

## 8. Yönetici ve üçlü ortak içerik yönetimi

Çalışan temel: insan yönetici paneli + Codex + Antigravity aynı doğrulanmış canonical kayıt/yayın geçmişi üzerinden ilerlemeli; **üç ayrı dosya kaynağı son-yazan-kazan şeklinde senkron değildir**. Tek bulut kaynak modeli hazırlanmıştır, fakat iki ajanın araştırma çıktısını aynı güvenli, sürüm kontrollü girişe yazması ve tam yeni araştırma işçisi henüz bitmedi.

Staging özel şeması `ya_private`: üyelik, canonical workspace, SHA ile tam araştırma arşivi, değişiklik geçmişi, publication_inputs ve publication_jobs. Public: yalnız ziyaretçi yayın snapshots ve aktif head. Özel araştırma arşivi doğrudan anon/auth'a açık değil. `ya_is_admin` aktif üyelik + gerçek Auth + **aal2** ister; user_metadata admin bayrağı kabul edilmez.

Kayıtlar optimistic revision ile atomik; manuel sıralama/çıkarma ve geri alma yeni değişmez sürüm oluşturur, eskiyi silmez. Canonical dışı ID/serbest kalite iddiası kabul edilmez. Son staging head devir salt-okunur kontrolünde **8**. Önceki test reorders/undo kayıtları test gerekçeli, dört orijinal mekan restore edilmişti. Yenileme işi mevcut manuel order/exclusion'ı korur.

Gerçek staging'de iki **sentetik** hesapla Auth/MFA/yayın/geri alma test edildi. Kullanıcının kişisel admin hesabı henüz yok. Kendi şifresi ve MFA'sı yalnız kullanıcı tarafından Dashboard/siteye girilir; ajan bu alanları okumaz, görüntülemez, dosyaya almaz. Tam kurulum: `docs/PERSONAL_ADMIN_ONBOARDING.md`. Yetki için yalnız kullanıcı UUID'si yeterlidir. Runtime'da service/secret key yok; kurulum secret'ı yalnız özel test kurulumu içindir.

Eski Basic yardımcı endpointleri cloud auth modunda503 ile kapanır. Oturum HttpOnly/SameSiteStrict, HTTPS'teSecure; Origin kontrolü ve logout sonrası eski oturum401. Son QR kayıt görünümü derlendi; gerçek kullanıcıyla veya yeni sentetik kayıtla son regresyon hâlâ gerekir.

## 9. Yayın pipeline ve önbellek

46 dinamik araştırma JSON dosyası ve manuel seçimler SHA manifestiyle staging özel arşivine taşındı; canonical/arşiv eşitliği gerçek SQL ile kanıtlandı. Arşiv1740589bayt; kaynakları silme. `work/cloud-admin/source-manifest.json` tam46yol+SHA'dır. Yerel source, staging arşivi ve eski kopyalar arasındaki farklar bu manifestle karşılaştırılmalı.

Staging'de gerçek **pg_cron**, `yeriniayir-staging-publication`, her5dakika aktif. Devir anında salt okunur kayıtta published ve sonraki unchanged işleri görüldü. Sınırlı scope, advisory lock, hata gecikmesi ve değişmez iş kayıtları vardır. **Yaptığı mevcut kanıtı tekrar değerlendirip yayın lease'ini yenilemektir; internetten yeni bağımsız kaynak araştırması değildir.**

`prepare_pipeline.cjs` gerçek ürün motoruyla çıktıyı tekrar değerlendirir, eski checkedAt tarihlerini değiştirmez. Kanıtın hard sınırı bu pakette **5 Kasım2026 20:10:28UTC (23:10Türkiye)**; bu tarih gelince yeni gerçek kanıt olmadan yenileme yapılmaz/gösterim gizlenir. Zamanı uzatıp araştırılmış gibi gösterme. Eski `CLOUD_ADMIN_READINESS.md` içindeki1saatlik12:44lease artık tarihi test durumudur; güncel pg_cron yayını8'e geçti. SQL cron tek başına yeni kaynak işçisini tamamlamaz.

Ziyaretçi servercache60s bounded/deduplicated +NextDataCache/tag invalidation; adminno-store. Expiry hercachehit'te de kontrol edilir. Cloudhatasında demoya/yerel veriye sessizfallback yok. Yayın güncellemesi aynı süreçte anlık, diğer süreçlerdeTTLsonunda; hosting/CDN üzerinde ayrıca test gerekir. Rating kalıcı yayın belgesinin parçası değildir.

Ölçülmüş gerçek staging yolu: soğukSSR959ms, RPC827ms; beşsıcakSSR9–23ms, toplam0ekSupabaseverisorgusu. RPC648B gzipbody /1726B açılmışJSON +924B yanıtbaşlık; TLS/istekbaşlık dahil değil. Bunlar fatura garantisi değil. Tarayıcıdan doğrudanSupabase/Google0. Yeni cron sonrası tüm ziyaret akışı ölçümleri yeniden yapılmalı.

## 10. Testlerin güvenilir durumu

**Tamamlanan önceki gerçek staging testleri:** anonim8; Auth/MFA14; yönetici browser5 +logout replay401; ziyaretçi13grup375/390/430/1440px; SHA/arşiv eşitliği. Kanıtlar `work/cloud-admin/real-*-tests.json`, browserloglar ve `import-verification.json`.

**Son yerel test:** yeni pipeline dahil42PostgreSQLcheck geçti (`work/release-system/pipeline-sql-tests.log`); kalıcı RLS geçişinin288sentetikcheck'i geçti (`work/free-capacity/permanent-rls-test.json`). Bunlar yerel sentetik Auth ve gerçek DDL/politika tanımlarıdır; production saldırı testi değildir.

**Son kod:** TypeScript ve Next15.5.28 productionbuild başarılı (`work/release-system/{typecheck,build}.log`). Önceki lint hatasız, devralınmış uyarılar var; son QR düzenlemesinden sonra tüm gerçek Auth/browserregresyonu tekrarlanmadı. Eski117clientchunk sır taraması0eşleşme; yeni build için yeniden çalıştır.

**Performans ayrımı:** dosya tabanlı3300 önceki mobil97–98/desktop100 ölçümleri yeni bulut3401puanı değildir. İki eskiLCP2,5süstü, previewnoindex yüzündenSEO66; `perf:check` bu nedenlebaşarısızdı. Yeni gerçekbulut Lighthouse3tekrarı **henüz yapılmadı**. Puan için içeriği/güvenliği gizleme/noindexkorumasını kaldırma. INP saha ölçümü labTBT ileeşit değildir.

Hedefler kalıcı: mobilmin90/hedef95+, desktop95+, A11y/BP95+, SEO100(gerçekyayındakural), LCP≤2,5s, INP≤200ms, CLS≤0,1. Herönemlisayfa3tekrar. Eski50/100/300concurrency yalnızloopbackHTTPburst; SupabaseFree300DBquerygarantisi değil; üretimde yük testi yasak.

## 11. Yerelde çalıştırma ve doğrulama

Komutları Antigravity kendisi çalıştırır, kullanıcıya terminal işi verilmez. Tümkomutlar başlangıçklasöründe:

```sh
cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin
git status --short
git log -1 --oneline
npm run typecheck
npm run lint
npm run build
# Salt okunur; yalnız sabit staging kimliğine izin verir:
python3 scripts/cloud/staging_operations.py check
# Gerçek bulut uygulaması, loopback3401; private config otomatik okunur:
node scripts/cloud/start_staging.cjs
```

Son devir HTTP kontrolünde **3300 ve3401kapalıydı (HTTP000/bağlantıreddi)**; açık çalışan sunucu varmış gibi raporlama. 3300 korunmuş eskiintegration,3401yeni cloud-admin. Önizleme URL'leri:
- `http://127.0.0.1:3300/tr?region=moda&category=kahve`
- `http://127.0.0.1:3401/tr?region=moda&category=kahve`
- `http://127.0.0.1:3401/tr/gastronomi-yonetimi`

3300gerekirse integrationklasörünün kendi korumalı `.env.local` ayarlarıyla `node node_modules/next/dist/bin/next start -H 127.0.0.1 -p3300`; öncebuilddurumunukontrol et. Onunorijinaldosyalarını değiştirmeden yeni3401'ideğerlendir.

Yerel güvenlik testleri (cloudklasöründe, üretimebağlanmaz):
```sh
node scripts/cloud/verify_contracts.cjs
python3 scripts/cloud/verify_database.py
python3 scripts/cloud/verify_permanent_boundary.py
node scripts/verify_security_upgrade.cjs
node scripts/verify_google_places_transport.cjs
```

Gerçek staging testleri bazıları **sentetik reorder/undo oturumları yazar**; saltokunur değil. Gerçek kullanıcıolmadan, mevcuttestUUID'leri ve orijinalorderrestore doğrulanarak çalıştır:
```sh
node scripts/cloud/verify_real_anonymous.cjs
node scripts/cloud/verify_real_auth.cjs
node scripts/cloud/verify_real_admin_browser.cjs
VERIFY_ORIGIN=http://127.0.0.1:3401 VERIFY_CLOUD_MODE=1 node scripts/verify_gastronomy_integration_browser.cjs
```

Önce endpointlerde4gerçekmekan olduğunu doğrula; süresidolmuşboşsayfayla skorölçme. CPUyükleyenbaşkaişolmaksızın:
```sh
PERF_ORIGIN=http://127.0.0.1:3401 PERF_REPORT_DIR=work/release-system/lighthouse-mobile PERF_DEVICES=mobile node scripts/run_premium_lighthouse.mjs after
```
Harnes3mobilrun ve detaymodaldenetimlerini içerir. Toolingsymlink'i okunur; kurulumgerekirse ayrıdizineyap. Gerçekperformanssonuçlarını eskiraporların üstünebaşarısızölçümleri silerekyazma.

`staging_operations.py` diğeraction'larımigration/import/grant yapar; checkdışındakileri körlemesine tekrarçalıştırma. Mevcutşemavarsa schemaactionyenidenbaşlatmaz. Eskiimport.private.sqllease'ieskidir; tekrarimportetme. Productionkimliğiniengelleyen guard'larıkaldırma.

## 12. Öncelikli devam sırası ve gerçek yayın engelleri

1. **Üçlü ortak içerik yönetimi:** insan paneli ve iki ajan için tek canonical bulutkaynağı; yetkili,sürümkontrollü araştırmagirdisi, manueloverride/undo, kaynakçelişkisindeekaraştırma. Panel/MFAyayınRPC'sini yenidenyazma, mevcuttemelintestlerini koru. ŞuankiSQLcron'unu yenikeşifmotoru sanma.
2. **Kalıcı yayın/veritabanı düzeni:** kişiseladminonboarding, hardexpiry'ninyenigerçekaraştırmaylayenilenmesi, sınırlıbütçeli kalıcıkaynakworker'ı ve hatauyarıları. ProductionProhazır ama cloudşema/veri/kişiselUUIDüyeliği/kalıcıRLSgeçişi ayrıaçı konaygerektirir. Mevcut42engeliaçma.
3. **Google:** üçdoğrulanmışşube içinlisanslı güncelsunumubütçeonayıylatamamla; GutenMorgenbağımsızbölümünü doğrula, belirsizpuanıgizle. Mevcutkartlarda0Googlepuanıgerçekaçıkengel.
4. **Ürün:** dörtşube veBrekkie'de hedeflikaynakaraştırması; güçlüuzmanincelemesininkesinşube/güncelmenüeşleşmesiniara. Şuanda0öneri, Story/Montagmenüsüvar. Standardıdüşürme.
5. **Bulutmobilperformans:** 3run/sayfa,375/390/430, gerçek4kayıt, runtimeerror/sızıntıcheck; eksikLCPveSEOyu doğruçerçevele.
6. **Son güvenlik/regresyon:** yenibuildsırtaraması, kişiselMFAQRakışı, logoutreplay, yetkisizDML, revizyonçatışması, eskiURL'ler ve manuelçıkarma/ekleme/undo. Yedektenizolegeridönüşprovası.
7. **Korumalı VercelPreview:** hiçsecretkopyalamadan yalnızstagingruntimeanonconfig,HTTPS Securecookie/Origin/canonical, deploymentprotection,norobots. Servicekeytarayıcıdayok. Kullanıcıpush/deploymentonayıvermedenoluşturma.
8. **Son canlıkapısı:** Google+gerçekürünşartları, veri/worker/yetki ve performansbaşarılmadan “yayınahazır”deme. Productionmigrationveveriaktarımıiçinkapsam/rollbackgöster, ayrıonayal.

## 13. Güvenli koruma, erişim ve geri alma

Devirpaketi: `/Users/erdems/Documents/Codex/yeriniayir-antigravity-handoff-20261101`. Kullanıcının aynı macOS hesabından okunabilir; projevepaketdosyasistemerişimikontroledildi. **Antigravityuygulamasınıniçinden dosyaaçıldığı/ajanınbaşlatıldığıtestedilmedi**; erişimyetkisioradaayrıcaonaygerektirebilir. Paketaktarımıiçine-posta/mesaj/pushyapılmadı.

`INVENTORY.json`: tümGitdurumları,symlinkler; `SNAPSHOTS.json`: kaynak/özelarşivSHAveverifikasyon; `COMMIT.json`: yeni güvenliktaranmışyerelcommit. Özelarşivler `.env`/yerelbağlantılar/yedekleri deiçerebilir: dizin0700,dosyalar0600; **Git'e,bulutdrive'a,sohbete veya halka açık URL'yekoyma.** Bunlar sırların korumalıkopyasıdır, dağıtılabilirkaynakpaketideğildir. `work/`Gitdışında kalır. Manifesttestsonuçlarını veya gövdelerinitopluziyaretçiyeaçma.

Arşivler tümgerçekçalışmadosyalarını dahil eder; node_modules/.nextyenidenüretilebilir. Gitleizlenmeyenkaynaklar,araştırma/testçıktıları ve eskiGitobject/ref/worktreemetadatası da korunur. Orijinal worktreepointer'ları mutlak eskiyollara bağlıdır; `.git`dosyalarını farklıyereçıkarıppointer'larıkörlemesinekullanma.

Geri alma: öncesha256'yımanifestlekontrol et; arşivi **yeniözelboşklasöre** çıkar, mevcutkopyanınüstüneaçma. gitreset--hard/clean kullanma. Sırlar0600kalmalı; testDB'yeproductiondumpsızdırma. Kodrollback cloud-adminyerelcommit/snapshotile, yayınıgeri alma yeniimmutableversionile yapılır. ProductionrollbackSQLyalnızayrıonayla; temporaryhold'unDROPkomutunuyereldebilehangiDBolduğunudoğrulamadançalıştırma.

Devir sırasında yeni özellik, ücretli API, push, deployment, production değişikliği yapılmadı. İlk önce bu belgenin güncel durum notlarını oku; eski belgelerdeki tek saatlik lease ve “önceden doğrulanmış puan” ifadeleri güncel UI başarısı değildir.
