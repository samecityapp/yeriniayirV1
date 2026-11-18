# V1 güvenlik engelleri — 31 Ekim 2026

**Son durum — açık onay sonrası:** Geçici yazma engeli production’a uygulandı; 14 tabloda 42 RESTRICTIVE politika doğrulandı (45 → 87 politika). Eski politikalar/okuma izinleri korundu; anon okuma kontrolleri başarılı. Kullanıcı veri yedeği korunuyor. Kalıcı yönetici yetkilendirmesi henüz tamamlanmadı. Güncel ayrıntı: `SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md`. Aşağıdaki önceki hazırlık/onay bekleme ifadeleri tarihsel durumdur.

**Sonraki production denetimi güncellemesi:** Gerçek yedek alındı ve production RLS salt okunur denetlendi. Kritik anonim yazma izinleri doğrulandı; yayın engeli sürüyor. Aşağıdaki önceki "production henüz incelenmedi" durumu tarihsel hazırlık durumudur. Güncel rapor: `docs/SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md`.

Çalışma alanı: `yeriniayir-gastronomy-integration`, dal: `feat/gastronomy-ui-integration`.
Özgün Codex, Antigravity ve imza araştırması klasörleri değiştirilmedi. Push, deployment, production migration veya ücretli Places/model çağrısı yapılmadı.

## Kapanan yerel engeller

- Next.js 13.5.6 → 15.5.28; React 18.3.1 ile mevcut bileşen uyumluluğu korundu. Async headers/params ve istemci haritası geçişi tamamlandı. Next 15.5.28 güvenlik yaması: https://nextjs.org/blog/nextjs-security-update-october-14-2026 . Geçiş kuralları: https://nextjs.org/docs/app/guides/upgrading/version-15 . React sürümü bu Next paketinin gerçek peerDependencies aralığına uygundur ve tarayıcı testleriyle doğrulanmıştır.
- Entegrasyonun node_modules bağlantısı özgün klasörden ayrıldı; bağımlılıklar bağımsız yüklendi.
- jsPDF, PostCSS, protobufjs, Zod, Google istemcisinin UUID bağımlılığı ve Puppeteer güvenlik güncellemeleri uygulandı. gaxios yalnızca v4() kullanıyor; UUID 11.1.1 uyumluluğu ayrıca test edildi.
- `npm audit --omit=dev`: 0 açık. Tüm bağımlılıklar dahil tarama: 21 orta, 0 yüksek, 0 kritik. Kalanlar geliştirme araçları/eski manuel Cloud SDK betik zincirindedir; geliştirme ortamı tamamen açık içermiyor diye sunulmamalıdır. Zorlayıcı uyumsuz otomatik sürüm düşürme/yükseltme uygulanmadı.
- Form URL doğrulaması HTTP/HTTPS dışındaki şemaları reddediyor.
- APP_ENVIRONMENT=staging olduğunda bütün uygulama sayfaları ve API'ler ayrı staging parolasıyla korunuyor. Eksik parola 503, girişsiz erişim 401. Yanıtlar noindex/private/no-store. Statik Next varlıkları kimlik doğrulamadan muaftır; içine sır konulmamalıdır.
- 119 derlenmiş tarayıcı varlığı mevcut sunucu sırlarının değerleriyle karşılaştırıldı: 0 eşleşme.

## Google anahtar envanteri

Hiçbir anahtar değeri bu rapora yazılmadı. API anahtarı alma veya gerçek Places testi yapılmadı.

| Grup | Kullanım / iz | Proje bağlantısı | İşlem |
|---|---|---|---|
| Güncel Places | Özgün Codex ve entegrasyonun Git dışındaki yerel ortamında aynı anahtar; önceki testlerde kullanılmıştır | Kesin proje doğrulanamadı. Yerel eski ayar grand-citadel-482815-c9, önceki Console ekranı project-079f6e9a-bdae-40af-b22 ipucu veriyor; bunlar bağ kanıtı değildir | Kullanımı koru, kısıt/usage ve sahip proje Console'dan doğrulanmalı |
| Eski model/görsel anahtarı | 10 eski manuel üretim betiği ve Git geçmişi; ziyaretçi çalışmasında kullanılmıyor | Belirsiz | Açığa çıkmış kabul et; iptal/yenileme gerekli. Entegrasyon betiklerinde daha önce literal kaldırıldı; özgün klasöre dokunulmadı |
| Eski Firebase web anahtarı | 4 eski proje dışa aktarma belgesi; aktif uygulama kodu kullanmıyor | Gömülü Firebase yapılandırması gnkgnkgnkreal diyor; sağlayıcı hesabından doğrulanmadı | Güncel entegrasyon belgelerindeki değer kaldırıldı. Public client kimliği olduğundan service-role sırrıyla eş tutulmaz; ilgili Firebase/API kısıtları ve kuralları hesapta kontrol edilmeli |
| Sohbette daha önce paylaşılan anahtar | Kullanıcı silindiğini bildirmişti | Güncel anahtarla aynı olduğu varsayılmadı | Silme/iptal sağlayıcıdan doğrulanamadı |

256 erişilebilir commit tarandı. 7 committe 5 biçim eşleşmesi bulundu: 2 gerçek kaynak anahtarı grubu; diğer 3'ü Lighthouse ekran görüntülerinin base64 içindeki tesadüfi alt dizileridir, gerçek anahtar değildir. Çalışan Places anahtarının parmak izi bu iki tarihsel grupla eşleşmiyor. Git geçmişi yeniden yazılmadı; dosyadan silmek sağlayıcıda iptal etmek değildir.

Mevcut servis hesabıyla iki Cloud projesinin metadata okuması denendi: ikisi de HTTP 403. Anahtar değerleri istenmedi; hesap oturumu/e-posta/tarayıcı kontrolü yapılmadı. API etkinliği, faturalandırma, anahtar→proje bağı ve son kullanım bu yetkiyle doğrulanamaz.

### Hesapta yapılacak adımlar — terminal gerektirmez

1. Google Cloud Console üst proje seçicisinde önce `grand-citadel-482815-c9`, sonra `project-079f6e9a-bdae-40af-b22` projesini seç. **APIs & Services → Credentials** bölümünde anahtarların adlarını/kısıtlarını kontrol et. **Show key** açıkken ekran görüntüsü paylaşma. Bir projeyi göremiyorsan o projenin sahibi hesabı kullan.
2. Aktif Places anahtarında yalnız **Places API (New)** ve sunucunun doğru çıkış IP'leri olmalı. **APIs & Services → Enabled APIs & services → Places API (New)** altında Metrics/Quotas üzerinden kullanım ve limitler kontrol edilmeli. Faturalandırmayı veya yeni ücretli testi ayrıca onay olmadan başlatma.
3. Eski görsel/model anahtarını ilgili projede tanımla. Kullanılmıyorsa **Delete**; hâlâ gerekli manuel iş varsa yalnız gerekli API'lere kısıtlı yeni anahtar oluştur → sohbet dışında güvenli yerel giriş → yerel yapılandırma geçişi/testi → eski anahtarı iptal sırasını izle. Çalışan Places anahtarını eskiyle karıştırıp silme. Yenilemenin doğrulanması için ücretli istek gerekirse ayrıca onay alınacak.
4. Eski Firebase projesi hâlâ sana ait ve kullanımdaysa kendi Console hesabında web anahtarı kısıtları ile Firestore/Storage erişim kurallarını incele. Yalnız eski belgeye dayanarak aktif proje/anahtar iptali yapılmamalı.
5. Hesaba erişim paylaşmak zorunda değilsin. Anahtar değerleri kapalı ad/kısıt/proje ekranları yeterli ilk bilgidir. Yenisi hiçbir zaman sohbete, Git'e veya tarayıcı kaynak koduna konulmayacak.

## Supabase production — açık engel

Uygun Management API tokenı veya salt okunur PostgreSQL bağlantısı mevcut değil. Anon/service-role REST erişimi pg_policies denetiminin yerine geçmez. Production RLS durumu **doğrulanmadı**.

`supabase/audits/production_rls_readonly.sql` yalnız metadata okuyan BEGIN READ ONLY / ROLLBACK sorgusudur. Production'a çalıştırılmadı. Migration'ın yerel PGlite denetimi 13/13 geçti; bu sonuç production politikalarının uygulandığını kanıtlamaz.

Hesapta gerekli işlem: Supabase projesinin sahibi **Project Settings → Database / Connect** üzerinden salt okunur denetime uygun bağlantı/yetkiyi belirlemeli veya salt okunur Management bağlantısı sağlamalı. Parola/token sohbetten gönderilmemeli. Bağlantı sağlanırsa metadata sorgusunu ajan çalıştıracak; kullanıcıdan terminal veya SQL çalıştırması istenmiyor. Migration ayrı izin olmadan uygulanmayacak.

## Staging hazırlığı — dağıtım yapılmadı

- `config/staging/staging.env.example`: yalnız boş yer tutucular.
- `npm run staging:check`: ayrı Supabase referansı, uzun yeni parola, staging işareti, yerel preview kapalı ve API/service-role sırlarının yokluğunu denetler. Bilinen production referansları reddedilir.
- Cloud'da ayrı Vercel projesi + ayrı Supabase projesi gerekir. Varsayılan Vercel üretim değişkenlerini kopyalamamak gerekir; yalnız yapay/test verileri kullanılmalı. İlgili hesapta proje oluşturma ve deployment bu görevde yapılmadı.
- Vercel staging Build Command: `npm run staging:check && npm run build`. Node 24, staging'e özel auth, APP_ENVIRONMENT=staging, GASTRONOMY_LOCAL_PREVIEW=0. Vercel Deployment Protection mevcutsa ek katman olarak etkinleştirilmeli; uygulama koruması bundan bağımsızdır.
- Gerçek araştırma dosyaları, Google/model anahtarları, üretim service-role, production DB kopyası ve yönetici parolası staging'e aktarılmayacak. Ücretli API'ler varsayılan kapalı kalacak.
- Güvenli ziyaretçi verisi dağıtım paketi/cloud veri kaynağı hâlâ yayın engelidir: mevcut gastronomi görünümü loopback önizlemesine bağlıdır. Cloud staging'in dört mekanı hazır gösterdiği iddia edilmiyor.
- Güvenlik middleware'i iki geçici yerel staging sunucusunda test edildi; bu bir bulut staging dağıtımı değildir.

## Doğrulamalar ve sınırlar

Build, TypeScript ve lint başarılı (6 mevcut lint uyarısı; 0 lint hatası). Auth 48/48; yerel RLS 13/13; ziyaretçi tarayıcı 13/13; ürün/yönetici raporu tarayıcı 5/5; kayıt koruma 3/3; validasyon 8; staging preflight 8; gerçek yerel staging HTTP koruması 4 test grubu; Google offline 10/10 ve transport 3/3 geçti. Google testleri gerçek rating alınması anlamına gelmez.

375, 390, 430 ve 1440 px: dört mekan, detay/geri dönüş, URL uyumu, illüstrasyonlar ve özel veri gizliliği başarılı. Google puanları hâlâ canlı veri bağlanmadığı için gizli; araştırma sonuçlarında 0 güçlü sipariş önerisi var, yalnız doğrulanmış menüler detayda. Bu iki önceki ürün yayın koşulu bu güvenlik göreviyle kapanmış sayılmaz.

Yerel önizleme: http://127.0.0.1:3300/tr?region=moda&category=kahve . Production RLS, anahtar iptal/proje doğrulaması ve korumalı cloud staging doğrulanmadan canlıya hazır onayı verilmez.
