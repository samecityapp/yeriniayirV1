# Otonom gastronomi yönetimi — yerel uygulama

## Ürün kararı

`docs/PRODUCT_DECISIONS.md` bölüm 4 geçerlidir. İşletme başına onay kaldırıldı. İlk canlı etkinleştirme izni verilmediğinden üretim yazıcısı bulunmaz; Vercel ve production çalışma ortamında bütün değişiklik uçları ayrıca kapalıdır.

## Gerçekten çalışan akış

- `/tr/moda-kadikoy-pilot` artık **AI Gastronomi Yönetimi** ile açılır. Eski araştırma ve tarihsel sabit pilot ayrı sekmelerde korunur.
- `lib/pilot/gastronomy/catalog.ts` gerçek keşif kimliklerini ve Aşama 2 kaynaklarını ortak bölge/kategori sözleşmesine dönüştürür. Marka veya çıkarım düzeyindeki iddialar bağımsız şube kalite kanıtı yapılmaz.
- `policy.ts` aynı kategori parametresiyle kahve, hamburger, pizza, kahvaltı, yöresel ve diğer kategoriler için çalışır. Menü ve faaliyet kaydı bağımsız kalite kaynağı sayılmaz. Ayrı kalite, kanıt ve uygunluk bulguları korunur; yapay toplam puan yoktur.
- Uygun adaylar önce ayrı bağımsız aile sayısı, sonra tarihli deneyim tazeliği, sonra kararlı kimlikle sıralanır. Bu bir toplam kalite skoru değildir. En fazla 5 mekan seçilir. Yeterli kanıt yoksa 0–2 mekanla kalınır; liste tamamlanmaz.
- Yerel otomatik yayın her geçerli kararın ardından uygulanır. `/tr/moda-kadikoy-pilot/selection?region=moda-kadikoy&category=coffee` yalnızca mevcut kanıt standardını hâlâ sağlayan yerel yayın kimliklerini gösterir. Sonradan eskiyen kanıtlar GET sırasında da güvenli biçimde gizlenir; kalıcı değişiklik sonraki iş döngüsünde günlüğe yazılır.
- Manuel ekleme/çıkarma/sıra tercihleri bölge/kategori kapsamlı kalıcı politikalardır. Çıkarma kaldırılana kadar yeniden eklenmez. Eklenen kayıt kanıt yetersizliği veya kapanışta silinmez; bekletilir ve uyarılır. Sıra tercihi sonraki otomatik seçimde uygulanır. Kaynak kaydı kaybolursa manuel kararın bağlı olduğu gerçek adayın son bilinen kimliği korunur; faaliyet/kimlik tekrar doğrulanana kadar yayın bekletilir. Önbellekteki eski kimlik güncel kaynak verisini ezmez.
- Yeni işletme adı/adresiyle yalnızca kanıtsız araştırma kaydı oluşturulur; kalite iddiası veya yayın yetkisi girilemez.
- En fazla 7 kategori ve zorunlu ilk slot sunucu tarafında doğrulanır. Kaldırılan kategorinin eski yayın koleksiyonu erişime açılmaz; manuel geçmişi silinmez.

## Kanıt standardı v1

Doğru şube/adres/koordinat, kategoriye özgü somut ürün, son 365 gün içinde 2 ayrı bağımsız yayın ailesi, bunlardan en az birinde son 180 gün içinde açık deneyim tarihi, son 90 gün içinde şubeye özgü işletme faaliyet beyanı ve engelleyici çelişki olmaması gerekir. Erişim zamanı deneyim yerine kullanılamaz. Gelecek ve tutarsız tarihler reddedilir.

Gerçek başlangıç verisinde kesin deneyim tarihleri yoktur. Bu yüzden ilk otomatik seçim/yayın 0; kahve için 95 aday Ek Araştırma durumundadır. Sentetik olarak yeterli kanıtı olan test adayları yalnızca test ortamında kullanılır, gerçek seçkiye aktarılmaz.

## Kalıcılık, geçmiş ve geri alma

`work/gastronomy-management/state.json` Git dışındadır. Her değişiklik dosya kilidi, istemci sürüm kontrolü ve atomik dosya değişimiyle kaydedilir. Birden fazla yerel sunucu işlemi aynı kilidi kullanır. Geçmiş, aktör, gerekçe, önce/sonra seçkileri, kaynak raporu kimlikleri, karar başına gerekçe ve kaynak/tarih anlık görüntülerini içerir. Geçmiş budanmaz.

Geri alma yeni bir olaydır. İlgili tercihin sonraki çelişen değişikliğini ezmez. Otomatik çalışmayı geri almak mevcut manuel tercihleri silmez. Eski yayın iddiaları kaynak standardı yeniden kontrol edilmeden geri gelmez. Geri alma da gerekçe taşır ve kendisi geri alınabilir.

## Keşif ve periyodik iş

- `pipeline.ts`: kahve için gerçek Aşama 1 keşfini yeniler, tarihleri değiştirmeden kaynak notlarını yeniden eşleştirir ve otomatik karar verir.
- Diğer standart kategoriler için Moda sınır kutusunda ücretsiz Overpass filtreleri vardır: hamburger/pizza/brunch/yöresel mutfak ve pastane etiketleri. Bunlar sadece adaydır; etiket tek başına nitelik veya kalite kanıtı değildir. Özel kategori ve yeni bölge adaptörsüzse açık uyarı verilir.
- Kaynak hatasında önceki dosyalar kendi tarihleriyle korunur. Yeni iş eski kanıtı yeni tadım gibi göstermez.
- `node scripts/gastronomy-worker.cjs`: haftalık son tarihleri her 60 saniyede kontrol eden yerel işçi, en fazla bir kapsamı bir döngüde işler. Yeni kapsamlar ilk değerlendirmeye alınır. `--once` tek kontrol içindir. Tek işçi kilidi çift çalışmayı engeller. Makine uyurken/uygulama kapalıyken çalışmaz; yeniden başlatıldığında gecikmiş işleri yakalar.
- `node scripts/initialize-gastronomy.cjs`: henüz çalışmamış kapsamları mevcut gerçek kanıtlarla ilk kez değerlendirir; dış ağ veya model çağırmaz.

## Gerçek engel ve sınırlar

**Yeni bağımsız kalite kaynaklarını arayıp şube/tarih bazında değerlendiren uygulama içi AI araştırma sağlayıcısı henüz bağlı değildir.** Geliştirme ajanının sohbetteki web araçları arka plan Node işçisinin API'si değildir. Aşama 2 notları gerçek araştırmadır ama statik tarihli kaynak notlarıdır. İşçi bunları kendi kendine güncellemiş sayamaz. Yeni ücretli API veya LLM çağrısı başlatılmadı.

Bu yüzden keşif, kanıt değerlendirme, seçki/yayın kapısı, kalıcı manuel müdahaleler ve periyodik yeniden değerlendirme çalışsa da uçtan uca yeni kalite kanıtı üretimi tamamlanmış gibi sunulmaz. Yetersiz adaylar rutin insan onayına gönderilmez; gerekçeleriyle araştırma kuyruğunda kalır. Genel bölgesel keşif ve lisanslı müşteri deneyimi adaptörleri ayrıca geliştirilmelidir.

## Güvenlik ve doğrulama

Yönetim ve yerel önizleme bağımsız sunucu Basic Auth kontrolüyle korunur. Mutasyonlar JSON, aynı origin, localhost ve development zorunluluğu taşır. Özel dış URL veya sağlayıcı anahtarı kabul edilmez. Üretim ve Vercel değişiklikleri reddedilir. Canlı veritabanına yazan bir adapter yoktur.

`verify_gastronomy.cjs` otomatik 3–5 seçimi, az kanıtta eksik listeyi, kalıcı manuel kararları, geri alma çelişkilerini, kapanış/eskime yayın engelini, çoklu kategori sözleşmesini, kategori sınırını, karar anlık görüntülerini ve doğrudan API güvenliğini test eder. Mevcut Aşama 1/2 ve RLS testleri korunur.


Ek testler: `node scripts/verify_gastronomy_persistence.cjs` üç uygun sentetik kaydın yalnızca izole ve sonunda silinen test klasöründe otomatik yerel yayınını, yeniden okuma/atomik kayıt ve eşzamanlı işlem kilidini doğrular. `node scripts/verify_gastronomy_scheduler.cjs` haftalık işin vadesi, kaynak kesintisi ve production işçisinin ağ erişiminden önce engellenmesini test eder. `node scripts/verify_gastronomy_browser.cjs` ayrı ve sonradan geri alınan bir test bölgesinde kalıcı yönetim kontrollerini doğrular; test kayıtları gerçek araştırma/yerel seçkiye karıştırılmaz.
