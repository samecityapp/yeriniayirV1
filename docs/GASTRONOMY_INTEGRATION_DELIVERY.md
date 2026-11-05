> Güncelleme: Tek geçici kahve grafiği yerine altı kategori ve dört kahve varyantından oluşan yeni sistem tamamlandı. Güncel görsel teslimi: `docs/REPRESENTATIVE_ILLUSTRATIONS.md`. Aşağıdaki belge ilk entegrasyonun tarihsel kaydıdır.

# Gastronomi tasarımı ve gerçek algoritma — yerel teslim

31 Ekim 2026. Çalışma alanı: `/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration`, dal: `feat/gastronomy-ui-integration`.

## Sonuç

Antigravity'nin `7a7e3a4752e55bf11551a440b010614fdaa62cdb` commit'i doğrulandı. Kaynak dal `feat/mobile-restaurant-detail-design`, devir anında temiz. Codex kaynağı `feat/codex-development` dalında `dbacf9c9e0f4523c74401b656c9d4de3c806d8f3` commit'i ve korunmuş yerel değişiklikleri içeriyor. Orijinal iki checkout'a yazılmadı. Tasarım dosyaları devir commit'inden kontrollü olarak ayrı entegrasyon alanına alındı; tüm commit'e körlemesine merge/cherry-pick yapılmadı. Dosya listesi `work/integration/handover/source.json`, önceki entegrasyon dosyaları `work/integration/handover/before/` içinde.

**Çalışan ana sayfa:** http://127.0.0.1:3300/tr

**Doğrudan pilot:** http://127.0.0.1:3300/tr?region=moda&category=kahve

Antigravity'nin ortak header, ana sayfa, konum seçici, kategori ızgarası, premium kart ve Variant A bottom sheet düzenleri gerçek ziyaretçi verisine bağlandı. Ritüel bileşeni ve demo sağlayıcı kodu korundu, gerçek ziyaretçi akışına bağlanmadı. Gaziantep/Fethiye hazır konum olarak sunulmuyor. Bu çalışma canlı yayına alınmadı.

## Gerçek veri yolu

Yerel yönetim/manuel karar kayıtları → `readVisitorVenueSelection` → `readIntegrationDiscovery` → `toFoodDiscovery` sunucu adaptörü → minimal ziyaretçi prop'ları → gerçek UI sağlayıcısı → kart/detay.

Sayfa açılması araştırma/arama/Google sorgusu başlatmaz. Sadece mevcut yerel seçki okunur. Her istek dinamik okunur; kalıcı manuel seçim/dışlama kayıtları yeniden oluşturulmaz veya değiştirilmez. Ziyaretçi sayfası yerel preview bayrağı ve loopback Host koşuluyla açılır. Üretimde varsayılan eski ana sayfa/SEO metadatası korunur. Yönetici rotalarının bağımsız kimlik doğrulaması korunur. Yerel preview analitik ve takip isteği göndermez; bu nedenle çerez paneli de yerel preview'de gizlidir. Eski panel fiziksel konum düğmesini kapattığı için bu hata ayrıca giderildi.

| Mekan | Şube | Gerçek Google puanı | Ürün sunumu |
|---|---|---|---|
| Çekirdek | Şair Latifi | Doğrulanmadığı için gizli | Yeterli şube/ürün kanıtı olmadığından alan gizli |
| Story Coffee | Dalga Sokak | Gizli | Menüden: Espresso, Cortado, V60 Pour Over |
| Guten Morgen | Fırıldak | Gizli | Yeterli şube/ürün kanıtı olmadığından alan gizli |
| Montag | Moda / Bademaltı | Gizli | Menüden: Hario V60 Demleme, Espresso, Filtre kahve |

Bu ürünler bağımsız kalite tavsiyesi gibi etiketlenmez. Gerçek ürün araştırmasının önerilebilir sınıfında sonuç olmadığından “Ne Sipariş Etmeli?” zorla doldurulmaz. Yorum sayısı, kaynak listesi, yayıncı, araştırma dosyası, seçilme gerekçesi ve kişi anlatıları visitor DTO/HTML/RSC prop'larına aktarılmaz. Google veri yolu, doğru şube ve resmi API doğrulaması olmadığında boş kalır; ortak atıflı puan bileşeni karta ve detaya bağlandı. Bu görevde yeni API anahtarı, Photos/Places/Tavily veya model çağrısı yapılmadı.

## Temsili grafik

`public/images/gastronomy/coffee-representative.svg` bu görev için özgün SVG çizgileriyle yazılmış geçici kategori grafiğidir. Beyaz/açık nötr zemin, kontrollü mavi fincan ve çekirdek çizimleri içerir. Başka bir fotoğraf/illüstrasyondan kopyalanmadı veya izlenmedi; dış görsel indirilmedi. Gerçek bir işletme veya spesifik servis ürünü tasvir etmez. Kartta ve detayda görünür **Temsili görsel** etiketi vardır. Aynı kategori için dört kartta bilinçli olarak aynı grafik kullanılır.

Kaynak dosyası, SHA256, üretim tarihi, izin dayanağı ve atıf durumu `lib/pilot/images/illustration-assets.json` içinde kaydedildi. Önceki gerçek fotoğraf kaynak/izin araştırması değiştirilmedi. Bu grafik son marka illüstrasyon seti değildir; kahve dışındaki kategoriler için varlık hazırmış gibi gösterilmez. Hakları doğrulanmamış mekan fotoğrafı adaptöre girse bile bu aşamada ziyaretçiye aktarılmaz.

## Koruma ve testler

- TypeScript: başarılı.
- Production build: başarılı; `work/integration/offline-guard.cjs` ile üretim/ücretli servis bağlantıları engellendi. Yerel production sunucusu loopback:3300 üzerinde çalışıyor. Bu, deployment değildir.
- Değiştirilen entegrasyon bileşenleri: lint hatası/uyarısı yok.
- Tüm proje lint taraması: **54 eski hata / 12 dosya**. Bu dosyalar kaynak Codex veya temel commit ile aynı; entegrasyon hatası olarak gizlenmedi. Eski sayfalardaki JSX metin kaçışları başlıca neden. Log: `work/integration/lint.log`.
- Araştırma, kalite, denetçi, seçki, güvenlik, ziyaretçi içerik, Google politika ve görsel araştırma regresyonları: **265 kontrol başarılı**.
- Mevcut ürün/manuel kayıt korunumu, rating politikası ve hazırlık sınırı: **14 kontrol başarılı**.
- Gerçek UI adaptörü: **5 kontrol başarılı**; dört gerçek kimlik/sıra, yalnız Moda/kahve, menü/tavsiye ayrımı, lisanssız fotoğraf ve demo sızıntısı engeli.
- Tarayıcı: **11 akış/görünüm kontrolü** başarılı; 375/390/430/1440 px, her boyutta dört detay aç/kapat, tek header, yüklenen temsili görseller, taşma olmaması, 3/6/7 kategori fixture'ları, yanlış kategori/konum, Back/Forward ve SSR/RSC veri sınırı. Fixture kategorileri araştırma sonucu veya gerçek kategoriler gibi yayımlanmaz.
- Tarayıcı/güvenlik son sınırları: **2 kontrol başarılı**; kimliksiz yönetici isteği 401, normal yerel sayfada JS hatası ve dış ağ isteği yok. İlk testte Chrome'un Basic Auth 401 cevabını navigation hatası sayması nedeniyle son auth kontrolü HTTP yanıtı üzerinden tamamlandı; uygulama koruması gevşetilmedi.
- Otel ve makale yollarındaki **6 dosya** temel commit ile birebir aynı. Antigravity `_legacy/HotelHomePage.tsx`, mevcut ana sayfanın üretim geri dönüşü olarak korundu; metadata/canonical üretimi de eski fonksiyona devrediliyor. Yerel ortamda üretim veritabanı içeriği test edilmedi.
- Seçilen dört kimlik/sıra, manuel kayıtlar ve denetçi/kalite kalıcı dosya hash'leri değişmedi.

Ekran görüntüleri `work/integration/browser/` içinde. Tekrar test komutları: `node scripts/verify_gastronomy_integration_browser.cjs`, `node scripts/verify_food_adapter.cjs`; mevcut araştırma testleri korunuyor. Tarayıcı testleri kişisel Google hesabına veya mevcut tarayıcı oturumlarına bağlanmayan ayrı, başsız test tarayıcısında çalıştı.

## Vercel ve canlı hazırlığı

Yerel birleşik sürüm denenebilir. Vercel preview oluşturulmadı, push/deployment yok. Canlı yayın hazır/onaylı sayılmaz: eski lint hatalarının temizlenmesi, yerel dosya tabanlı araştırma snapshot'larının staging için güvenli ve kalıcı dağıtım modeli, üretim yayın anahtarının ayrı onayı ve doğru şubelerin Google kimlik/puan doğrulaması henüz eksik. Mevcut yerel preview bayrağı loopback Host dışında gastronomi yayını açmaz. Gerçek işletme fotoğraf izinleri veya nihai marka illüstrasyon seti de hazır değil; bu eksikler görsel/puan uydurularak doldurulmadı.
