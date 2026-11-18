# Beş kahvecide gerçek araştırma — 30 Ekim 2026

## Neden önce 95/0 çıktı?

Önceki denetçi yedi alanın tamamının geçmesini istiyordu, ancak ürün, faaliyet, kategori ve güncellik alanlarını adaptörler koşulsuz `unverified` üretiyordu. Bu haliyle sıfırdan farklı tam doğrulama teknik olarak mümkün değildi. Buna Overpass 502, Montag 429, dar kaynak kapsamı ve şube karışıklıkları eklendi. Sadece API anahtarı kontrolü yapıldığı için mevcut Google servis hesabı da önceki bağlantı raporunda atlandı.

Düzeltme, tam kalite standardını düşürmek değildir. Harita gerektirmeyen kaynak olguları artık kendi kanıtlarıyla ölçülür. Kaynakları doğrulanmış bir kanıt dosyası ile tüm güncel kalite/faaliyet alanları doğrulanmış bir işletme ayrı sonuçlardır. Mevcut 95 aday raporu değiştirilmedi; yeni beş aday çalışması ayrı, gerçek kaynak raporudur.

## Gerçek sonuç

- 5 hedef: Montag Moda, Story Dalga Sokak, Çekirdek Şair Latifi, Guten Morgen Fırıldak ve Coffee Manifesto Moda.
- 12 kaynak kaydı: 10 erişilebilir yayın/işletme sayfası, 1 engelli Montag kaydı, 1 başarısız harita kaydı.
- 25 desteklenen olgu, 11 tarihsel kayıt. Aynı ürünün aynı kaynak içindeki genel/özel ad tekrarları birleştirilir.
- Story için 1 hazır kanıt dosyası: adres iki ailede eşleşir; erişilen resmî şube listesi ve resmî içecek menüsü vardır; bağımsız Time Out yayını ayrıca bulunur.
- Tam güncel kalite doğrulaması: 0. Güncel kesin tarihli bağımsız şube ziyareti yoktur. Dosya hazır olması yayın/seçki veya bugün kapısı açık anlamına gelmez.

Story: resmî listede Dalga Sokak 22; Cortado ve V60 Pour Over menüde; Cinnamon Roll ve Sea Salt Brownie de listeleniyor. Menü marka kapsamındadır, şube stok/bugünkü servis veya tadım başarısı değildir. İçecek menüsü kendi güncelleme tarihini 01.07.2026 olarak verir. Time Out'un 12 Mart 2024 yayını ayrı tarihsel kanıttır; 2026 ziyareti sayılmaz.

Çekirdek: iki ayrı editöryal adres ailesi; Barista'da espresso/filtre, Cornucopia'da cappuccino. Güncel resmî faaliyet ve menü yok. Guten Morgen: eski espresso/cortado ve ekşi maya/tatlı kaydı; erişilen resmî site marka kavurma kataloğudur, şube faaliyet teyidi değildir. Coffee Manifesto: resmî Moda adresi, marka paket çekirdekleri ve marka düzeyinde Americano kaydı; başka şubenin yemek anlatısı Moda'ya taşınmaz. Önceki Güneşli Bahçe kaydı Moda ile birleştirilmez. Montag: Barista V60 anlatısı marka kapsamındadır; resmî kaynağın 429 beklemesi korunur.

## Çalışan akış ve tekrar çalıştırma

`node scripts/research-five-coffee.cjs` mevcut Next.js/TypeScript yapısında çalışır; yeni paket/model satın almaz. Sabit olanlar yalnızca araştırma hedefleri, kaynak URL dizini ve ayrıştırma kurallarıdır. İşletme sonuçları/demo iddialar sabit olarak yüklenmez. Yeni cevaplar canlı HTTP'den, tekrarlar tarihler korunarak olgu önbelleğinden üretilir. Eski kalite ledger'ı yeni kanıt yerine okunmaz.

Girdi URL'leri bu geliştirme oturumunda Codex web aramasıyla bulundu. Uygulamanın kendisi yeni bağımsız URL araması yapacak arama API anahtarına sahip değildir. Bu oturumun arama aracı backend'e bağlı gibi gösterilmez. Menü/sokak/ürün ayrıştırması sınırlı, deterministik kurallarla yapılır; yeni sayfa biçimleri için yeni adaptör gerekebilir.

Başarı koşulu: en az iki kaynak ailesinde çelişkisiz şube adresi, resmî şube kaydı, resmî içecek menüsü, en az bir bağımsız yayın. Kanıt denetçisi kaynak ID/URL/aile/kind kaydını izinli dizinle karşılaştırır; olgu parmak izi, tarih, şube/marka kapsamı ve adres çelişkilerini denetler. İlk seçimin iddialarını doğru kabul etmez. Deneyim tarihi bilinmiyorsa null kalır. Model çağrısı yoktur; tam otonom semantik gastronomi değerlendirmesi tamamlandı denmez.

## Erişim, bütçe, saklama

En fazla 32 HTTP isteği, 240 saniye, tek yerel çalışma kilidi. Robots host başına okunur. RFC 9309 kapsamında yalnızca robots 404, kural dosyası yok olarak ele alınır; robots 5xx/erişilemez ve Disallow durumları sayfa erişimini engeller. Sayfa 403/429 durumunda aynı alan adının diğer yolları da beklemeye alınır; mevcut denetçinin engel geçmişi devralınır. Proxy, kimlik değiştirme ve engel aşma yoktur. 502/503/504 sayfası bir kez, kısa bekleme sonrası tekrar denenebilir.

Haritada geniş bbox taraması yerine sadece beş bilinen OSM ID'si sorgulanır. İlk sunucu geçici erişim hatası verirse belgelenmiş ücretsiz Private.coffee Overpass alternatifi bir kez denenir; 403/429 sonrası alternatif denenmez. Her ikisi gerçek çalışmada 25 saniyede zaman aşımına uğradı. Harita hatası resmî menü/adres olgularının işlenmesini durdurmaz. Harita hata önbelleği 6 saat, başarılı olgular 24 saat; her yeniden çalıştırmada haritaya yük bindirilmez. Ana OSM düzenleme API'si salt okunur araştırma projesinin yedeği olarak kullanılmadı.

Ham sayfa/yorum/puan/fotoğraf saklanmaz. Kısa yapılandırılmış olgular, kaynak URL/aile/tarih, parmak izi, erişim/hata/maliyet kayıtları `work/focused-research/` altında kalır ve Git dışında tutulur. `runs/` dosyaları önceki raporları korur. Son 20 çalışma özeti panelde görünür. Her adayın `story.json` vb. dosyası otomatik yazılır. İlk gerçek çalışmada 18 HTTP, V60 ayrıştırıcısı düzeltmesinde yalnız ilgili kaynak için 2 HTTP; sonraki çalışmalarda 0 HTTP / 12 önbellek kullanımı. Harici API maliyeti toplam 0 USD, model çağrısı 0. Oturumdaki Codex arama/model kullanımının hesap maliyeti backend tarafından ölçülemez ve bu tutara dahil değildir.

Ana araştırma/kalite/yönetim dosyaları, manuel tercihler ve üretim verileri değiştirilmez. Panel veriyi yalnızca okur, açılışta kaynak araştırması çalıştırmaz. Üretim/VERCEL çalıştırması daha dosya veya ağ işlemi olmadan reddedilir.

## Mevcut bağlantı ve ekonomik sonraki adım

API anahtarları yok; `GOOGLE_CLOUD_PROJECT_ID` ve yerel Google servis hesabı vardır. Anahtar/token/proje değeri gösterilmeden OAuth doğrulaması başarılı oldu. Model yetkisi, kota ve faturalama ücretli model çağrısıyla test edilmedi. Bu pilot için bir model çağrısı zorunlu değildi.

Eksik bağlantı: uygulamanın yeni URL keşfi için arama API'si. [Tavily fiyatı](https://www.tavily.com/pricing) ve [resmî kredi belgesi](https://docs.tavily.com/documentation/api-credits), 30 Ekim 2026 kontrolü: ücretsiz 1.000 kredi/ay, kredi kartı gerekmez; Basic arama 1 kredi. Örnek 5 işletme × 3 sorgu = 15 kredi, ücretsiz kota içinde 0 USD. Ücretli pay-as-you-go hesabı ayrıca etkinleştirilirse aynı arama sayısı 15 × 0,008 = 0,12 USD; sayfa çıkarımı/model ayrıca hesaplanır. Bu yalnız tahmindir; hesap, abonelik veya ücretli kullanım başlatılmadı. Tavily bağlantısı açılmadan arama sonucu saklama/yeniden kullanım şartları ayrıca doğrulanmalıdır. Mevcut Google hesabı varken yeni model aboneliği önermeye gerek yoktur.

## Doğrulama

`verify_focused_research.cjs`: doğru şube, marka kapsamı, tarih, kaynak bütünlüğü, robots, 403/429, tekrar/bütçe, harita alternatifi ve gerçek dosya testleri. Mevcut denetçi, API, keşif, kalite ve gastronomi regresyonları korunur. TypeScript, lint, localhost tarayıcı ve build ayrıca doğrulanır.

Kaynak/politika referansları: [Story şubeleri](https://storyroasters.com/pages/kafelerimiz), [Story menüsü](https://storyroasters.com/pages/story-coffee-menu), [Time Out Story](https://www.timeout.com/istanbul/tr/restoranlar/story-coffee-food), [Barista Magazine](https://www.baristamagazine.com/5-cool-cafes-to-check-out-in-kadikoy-istanbul/), [Overpass alternatifleri](https://wiki.openstreetmap.org/wiki/Overpass_API), [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), [OSMF API kullanım politikası](https://operations.osmfoundation.org/policies/api/).
