# Yerini Ayır — duraklatılmış production için güvenli kurtarma planı

**Son durum — açık onay sonrası:** Geçici yazma engeli production’a uygulandı; 14 tabloda 42 RESTRICTIVE politika doğrulandı (45 → 87 politika). Eski politikalar/okuma izinleri korundu; anon okuma kontrolleri başarılı. Kullanıcı veri yedeği korunuyor. Kalıcı yönetici yetkilendirmesi henüz tamamlanmadı. Güncel ayrıntı: `SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md`. Aşağıdaki önceki hazırlık/onay bekleme ifadeleri tarihsel durumdur.

**Güncel sonuç:** Production açıldı, parola maskeli yerel girişle alındı, 4,9 MB gerçek mantıksal yedek ve salt okunur RLS denetimi tamamlandı. Kritik anonim yazma izinleri bulundu. Geçici yazma engeli yalnız yerelde test edildi; production uygulaması ayrı onay bekliyor. Ayrıntı: `docs/SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md`.

Durum: 31 Ekim 2026. Projenin duraklatılmış olduğu ve Storage ZIP indirildiği kullanıcı tarafından bildirildi; sağlayıcı hesabından bağımsız doğrulanmadı. Veritabanı yedeği henüz alınmadı. RLS henüz production'da denetlenmedi.

## Mevcut bağlantı kontrolü

- Entegrasyonun `.env.local` bağlantısı loopback/dev adresinde. Production bağlantısı eklenmedi; 3300 uygulaması korunuyor.
- Özgün Codex ortamındaki proje referansı `jerkkxwgddujigsbeqwo`. Bunun Dashboard'daki YeriniAyir ile aynı proje olduğu kullanıcı hesabından doğrulanmalı. Eski belgelerde başka referanslar bulunduğundan isim tek başına yeterli değil.
- Anon anahtar uygulama erişimi sağlar; PostgreSQL yedeği veya metadata denetimi için DB parolasının/uygun bağlantının yerini tutmaz. Service-role da PostgreSQL parolası değildir.
- Database URL/parolası ve Management API tokenı mevcut değil. Anahtar/parola değerleri yazdırılmadı.
- Resmî Supabase CLI **2.122.0**, uygulama paketlerini değiştirmeden `work/supabase-recovery/tooling` içine kuruldu. Sürüm, dump/query yardım çıktıları ve sahte bağlantıyla dump dry-run doğrulandı. Docker, pg_dump ve psql bulunamadı. Gerçek CLI dump için gerekli Docker çalıştırıcısı henüz hazır değil; kurulumu teknik ajan üstlenecek, işletim sistemi etkileşimi gerekirse kullanıcıya açıkça belirtilecek. Mevcut app bağımlılıkları değiştirilmedi.

## İlk hesap işlemi

Supabase Dashboard → **YeriniAyir → Project Overview**. **Download database backup / Download backups** seçeneği varsa Storage ZIP'inden ayrı veritabanı yedeğini önce indir. Bu seçenek bazı uzun süre duraklatılmış projelerde bulunur; her projede bulunduğu varsayılmaz. Henüz **Restore project** düğmesine basma. Yalnız bu düğme görünüyorsa yeniden başlatma öncesi aşağıdaki erişim riskini ele alacağız.

İndirilen arşivi silme veya staging'e yükleme. Storage ZIP, veritabanı yedeğinin yerine geçmez. İki arşiv birlikte saklanmalı; indirilen DB dosyası sonradan ajan tarafından özel yerel klasörde bütünlük/format açısından kontrol edilecek. Şu anda dosyanın içeriği veya indirildiği doğrulanmış değildir.

## Yeniden başlatmadan önce

1. Proje adı + reference ID eşleşmesi, plan ve Restore project düğmesinin kullanılabilirliği doğrulanacak. Ücretli plan yükseltme gerekirse ayrı onay alınacak. Geri yükleme süresi geçmişse yeni proje açma/aktarma otomatik yapılmayacak.
2. Mevcut canlı uygulamalar, dış entegrasyonlar, zamanlanmış işler ve public Data API erişimi tespit edilecek. **Projeyi yeniden başlatmak, mevcut API erişimini ve mevcut kötü politikaları da yeniden etkinleştirebilir.** 3300'un production'dan ayrı olması tüm dış istemcileri durdurmaz.
3. Erişim kısıtlaması gerekiyorsa değişiklik kapsamı ve geri alma planı önce kullanıcıya sunulacak. Ağ kısıtlarının Data API'yi de kapattığı varsayılmayacak. Anahtar iptali, Data API ayarı, cron kapatma veya production politikası değişikliği izinsiz yapılmayacak. Yalnız sitenin deployment'ını durdurmak doğrudan API erişimini engellemez.
4. Yedek ve metadata için doğru project ref, Dashboard **Connect → Direct connection** veya IPv4 gerekiyorsa **Session pooler (5432)** bilgisi hazırlanacak; transaction pooler 6543 kullanılmayacak. Parola sohbet yerine maskeli yerel girişle alınacak. Mevcut DB parolası bilinmiyorsa **Reset database password** düğmesine düşünmeden basılmayacak; bağlı sistemleri etkiler, ayrı onay gerektirir.
5. Docker çalışma ortamı ve CLI dump önkoşulları tamamlanacak. Sırlar URL/komut argümanına veya kalıcı loglara konulmadan kullanılacak. Seçilen CLI'nin --db-url kullanımında SUPABASE_DB_PASSWORD değişkeni tek başına parola iletmiyor: sahte dry-run bunu doğruladı. Gerçek parolayı argümana koyarak sorunu çözmeyeceğiz; güvenli aktarım/çalıştırıcı doğrulanmadan gerçek çağrı yapılmayacak.

## Açıldıktan sonra — önce yedek

- Dashboard durumunun healthy/active olması, bağlantı TLS doğrulaması, project ref ve Postgres sürümü kontrol edilecek. Bağlantı denemeleri sınırlı olacak; başarısız parola denemeleri döngüye sokulmayacak.
- Sadece dump/query kullanılacak. `db push`, `db reset`, `migration up`, seed ve production'a SQL geri yükleme çalıştırılmayacak. Uygulama production'a yönlendirilmeyecek.
- Supabase CLI ile ayrı roller, şema ve veri dump'ları alınacak. Public/app şemalarının yanında auth/storage verileri ve bu şemalardaki özel RLS/trigger tanımları açıkça kapsama alınacak; varsayılan şema dump'ı bunların tamamını kapsıyor diye sunulmayacak. Extension/Vault/encryption-root ve Edge Function gibi mantıksal yedeğin kapsamadığı bileşenler ayrıca envantere yazılacak. Root encryption key kontrolsüz dışarı çıkarılmayacak.
- Dump'lar üretime SQL yazmaz; sunucudan okuma yapar ve I/O/egress yükü doğurur. Yedek büyüklüğü ve planın kota/egress durumu henüz bilinmiyor. Beklenmedik ücret veya büyük aktarım varsa önce onay alınacak.
- Yedek, Git dışındaki 0700 özel yerel dizine, 0600 dosyalar halinde yazılacak. Roller/veri dosyaları kullanıcı bilgisi, hash veya sır içerebilir; raporda ham içerik olmayacak. SHA-256, dosya boyutu, komutun başarı durumu ve kapsam manifesti üretilecek. Tamamlanmamış dosyalar başarılı yedek diye gösterilmeyecek.
- Birbirinden ayrı CLI dump'larının aynı anın ortak snapshot'ı olduğu iddia edilmeyecek. Dış yazan sistemler varsa tutarlılık riskini azaltan snapshot/erişim planı ayrıca belirlenecek. İzole ve ağ erişimi kapalı yerel restore testi yapılmadan yalnız dosya oluşması yeterli kurtarma kanıtı sayılmayacak. Production verileri staging'e aktarılmayacak.

## Ardından salt okunur RLS denetimi

`supabase/audits/production_rls_readonly.sql` BEGIN READ ONLY / ROLLBACK ve kısa timeout'larla yalnız katalog metadata'sını okur. Public/storage RLS, tablo ve view özellikleri, politikalar, grants/default grants, SECURITY DEFINER fonksiyonları ve profiles trigger tanımları incelenecek. Kullanıcı satırları veya auth şifre hash'leri rapora alınmayacak. Politikadaki hassas sabitler varsa raporda ayrıca maskelenecek.

Kaynak migration'larda **anon/authenticated için koşulsuz INSERT/UPDATE/DELETE** ve profiles.is_admin alanını kullanıcı tarafından değiştirme riski bulunan eski tanımlar var. Sonraki düzeltmeler bunları değiştirmiş olabilir. Bu, **production açığı doğrulandı** anlamına gelmez. Üretimde halen geçerliyse kritik olarak raporlanacak; hiçbir politika/migration izinsiz uygulanmayacak.

Önceden hazırlanmış lockdown migration'ı yerelde 13/13 test geçiyor; bu, production'da uygulandığını veya tüm üretim tablolarını kapsadığını kanıtlamaz.

## Kaynaklar

- https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore
- https://supabase.com/docs/reference/cli/supabase-db-dump
- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://supabase.com/kb/troubleshooting/restore-project-after-90-days-pause

Bu hazırlıkta production'a bağlanılmadı, yeniden başlatma/yedek/RLS denetimi tamamlanmış sayılmadı. Push, deployment, production migration veya yeni ücretli hizmet başlatılmadı.

Yerel doğrulama: metadata SQL'i izole PGlite üzerinde 6 kontrolü geçti; READ ONLY altında yazma denemesi reddedildi, public/storage politika envanteri okundu ve örnek satırlar değişmedi. Mekan/manuel karar/araştırma kayıtlarını koruyan 3 kontrol de geçti. Bunlar production yedeği veya production RLS sonucu değildir.

## İndirilen arşiv kontrolü

Downloads erişimi açıldıktan sonra `jerkkxwgddujigsbeqwo.storage.zip` bulundu: 662.720.504 bayt, 358 arşiv girdisi. ZIP CRC bütünlük kontrolü başarılı; SHA-256 özel yerel denetim kaydına yazıldı. Arşiv açılıp dosyalar dışarı çıkarılmadı. Arşiv içinde .sql/.sql.gz/.backup/.dump girdisi yok. Bu, Storage dosyaları arşividir; veritabanı yedeği değildir. Tüm uzak Storage nesnelerinin eksiksiz bulunduğu ayrıca manifest karşılaştırması olmadan doğrulanamaz.

Downloads, Desktop ve Documents altındaki sınırlı hedefli taramada ayrı indirilmiş DB yedeği bulunamadı. Tarayıcı indirme durumunun/dosya adının kullanıcı tarafından bildirilmesi bekleniyor; bu sonuç dosyanın bilgisayarın başka bir konumunda bulunmadığını kanıtlamaz. Veritabanı yedeği ve production RLS doğrulanmış sayılmıyor. Production yeniden başlatılmadı veya değiştirilmedi.

## Son durum — native yedekleme çalıştırıcısı hazır

Önceki Docker önkoşulu kaldırıldı: Postgres.app'in resmî 2.9.6 PostgreSQL 17 paketinden **pg_dump/psql 17.11** yalnız yerel `work/supabase-recovery` içine alındı. Paket SHA-256 değeri GitHub release varlığıyla eşleşti; uygulama kod imzası doğrulandı. /Applications değiştirilmedi; GUI/veritabanı servisi otomatik başlatılmadı. Paket kaynağı: https://github.com/PostgresApp/PostgresApp/releases/tag/v2.9.6 .

`scripts/supabase_native_recovery.py`: Supabase CLI 2.122.0 **db dump --dry-run** çıktılarından bağlantı bilgisi içermeyen şablonlar üretir; bunları Docker yerine native PostgreSQL araçlarıyla çalıştırır. Bu, standart konteynerli CLI çağrısı değil, CLI'nin ürettiği pg_dump betiğinin yerel çalıştırılmasıdır. CLI'nin explicit schema desenindeki kabuk pipe kaçışı düzeltilip test edildi. Gerçek parola CLI'ye veya süreç argümanlarına verilmez; libpq süreç ortamında kullanılır. Sunucu TLS doğrulaması verify-full; veritabanı bağlantısı default_transaction_read_only=on. Yanlış proje, transaction-pooler portu, yanlış kullanıcı veya eksik parola reddedilir. Şifre/hata ham çıktıları terminale basılmaz.

Yerel maskeli macOS giriş penceresi hazır, **henüz açılmadı ve parola alınmadı**. Özel bağlantı dosyası ancak gerektiğinde 0600, özel klasör 0700 izinleriyle oluşturulacak; Git dışındadır. Database password bilinmiyorsa otomatik sıfırlanmaz. Paused projede Connect düğmesi kapalı olduğu için, mevcut parola biliniyorsa önce yalnız parola yerelde alınabilir; yeniden başlatma sonrasında gerekirse Session pooler adresi kullanıcı hesabından sağlanacaktır. Yanlış/eksik parola için otomatik deneme döngüsü yoktur.

`scripts/verify_supabase_native_backup.py` yalnız geçici, UNIX socket erişimli PostgreSQL 17 üzerinde çalıştırıldı; TCP dinleyicisi açılmadı. Dört dump türü başarılı; public/auth/storage örnek satırları ve RLS politikası ayrı yerel veritabanına geri yüklendi; readonly yazma reddedildi; TLS yapılandırması ve beş yanlış bağlantı durumu denetlendi. Test veritabanı kapatılıp kaldırıldı. **Bu sonuç production yedeği veya gerçek production restore doğrulaması değildir.**

Hâlâ gerekli: veritabanı parolası/bağlantısı, yeniden başlatmadan önce mevcut API erişimi riskinin kabulü veya koruma planı, ardından kullanıcının hesabında Resume project. Ücretli plan yükseltme gerekli değil diye garanti verilmedi; ekranda istenirse durulacak. Production hâlâ paused olarak ele alınıyor; hiçbir yeniden başlatma, parola sıfırlama, migration, push veya deployment yapılmadı.
