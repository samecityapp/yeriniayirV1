# Moda görsel kaynak ve kullanım hakkı denetimi

Kontrol: 31 Ekim 2026. Aşama: yalnız kaynak/izin araştırması. Bu belge ve `lib/pilot/images/moda-image-audit.json` bir yayın izni, görsel üretim sonucu veya tamamlanmış otomatik görsel servisi değildir.

## Sonuç

| Mekan / hedef şube | Bulunan fotoğraf adayı | Kullanılabilir fotoğraf | Eksik |
|---|---|---:|---|
| Çekirdek / Şair Latifi 9/A | Barista Magazine, dış cephe | 0 | İzin, tam fiziksel şube ve görüntü doğrulaması |
| Story / Dalga Sokak 22 | Resmî kafeler sayfasında Story Moda görseli | 0 | Yeniden yayın izni, görüntü doğrulaması |
| Guten Morgen / Fırıldak 19/B | Time Out, Guten Morgen kredili fotoğraf | 0 | İzin, şube/görüntü doğrulaması; yayındaki Üsküdar etiketiyle adres çelişkisi |
| Montag / Bademaltı 22/A | Resmî Moda sayfası; ayrıca Barista Magazine iç mekan görseli | 0 | İzin; resmî görselin doğrulanması; editoryal fotoğrafın şubesi belirsiz |

Toplam dört işletmede beş fotoğraf adayı; yeniden yayın hakkı doğrulanmış fotoğraf **0**. İzin ve işletme/ürün eşleşmesi birlikte doğrulanmış ürün fotoğrafı **0**. Dört işletmede temsili kategori illüstrasyonu gerekiyor; bu aşamada illüstrasyon üretilmedi veya bağlanmadı. Mevcut ziyaretçi çıktısında dört `photo` alanı da `null` kalır.

### Kaynaklar ve tarihler

- [Story resmî şubeler sayfası](https://storyroasters.com/pages/kafelerimiz): Moda başlığı/etiketli görsel ile Dalga Sokak 22 adresi aynı bölümde. Yayın tarihi belirtilmiyor. Diğer Story şubelerinin fotoğrafları Moda'ya taşınmaz.
- [Montag resmî Moda sayfası](https://www.montagcoffee.com/pages/moda): Moda Espresso Bar başlığı/etiketli görsel ve Bademaltı 22/A adresi. Yayın tarihi belirtilmiyor.
- [Barista Magazine](https://www.baristamagazine.com/5-cool-cafes-to-check-out-in-kadikoy-istanbul/): 2 Mart 2026 yayını; fotoğraf kredisi Benjamin Sand. Çekirdek dış cephe ve Montag iç mekan adayları. Montag metni birden çok şube içeriyor. Fotoğraf kredisi yeniden kullanım izni değildir.
- [Time Out Guten Morgen](https://www.timeout.com/istanbul/tr/restoranlar/guten-morgen-1): 12 Mart 2024; fotoğraf kredisi Guten Morgen; Fırıldak 19 adresi, üst konum etiketi Üsküdar. Eski yayın güncel şube/görsel doğrulaması sayılmaz.

Kaynak sayfaları ve görsel etiketleri incelendi. Görsel dosyaları indirilmedi, hotlink yapılmadı, Instagram kazınmadı. Bu yüzden kaynak-etiket eşleşmesi ile görüntünün bağımsız görsel doğrulaması ayrı kaydedildi. İncelenen sayfalarda uygun açık lisans/yazılı yeniden yayın izni saptanmadı; izin hiç alınamaz anlamına gelmez. Sınırlı Commons aramasında uygun şube fotoğrafı bulunamadı; tüm internet için yokluk iddiası yapılmıyor. Paket kahve fotoğrafı şubede servis edilen spesifik içeceğin fotoğrafı sayılmadı.

## Türkiye genelinde uygulanacak karar sırası

1. Doğru işletme ve fiziksel şubesi doğrulanmış mekan fotoğrafı; varlığa bağlı ticari web gösterim/çoğaltma izni veya uygun açık lisans kanıtı zorunlu.
2. Aynı işletme, tam ürün varyantı ve güncel sunumu doğrulanmış gerçek ürün fotoğrafı; aynı kullanım hakkı koşulları zorunlu.
3. Hakları uygun kategori illüstrasyonu; kartta ve detayda görünür **Temsili görsel** etiketi. Gerçek şubeyi veya spesifik ürünü gördüğü izlenimi vermez.
4. Bunlar da yoksa görsel alanı boş kalır; stok veya demo fotoğrafı gerçek işletme fotoğrafı gibi atanmaz.

Sadece `owned`/`CC0` metni izin belgesi değildir. Gelecek uygulama; varlık kimliği/hash, kaynak türü, şube/ürün eşleşme kanıtı, hak sahibi, lisans sürümü/izin belgesi, ticari kullanım/yeniden boyutlandırma/barındırma kapsamı, gereken atıflar, geçerlilik ve geri çekilme durumunu kontrol etmelidir. İzin eksik/sona ermiş/geri çekilmişse gösterim durur. Aynı varlığa ait türev boyutlar tek izin kaydına bağlanır. Araştırma kaynakları yönetici tarafında kalır; **zorunlu görsel atıfları ziyaretçide gösterilir**.

Mevcut ziyaretçi DTO'sundaki basit lisans etiketi kontrolü tam hak yönetimi değildir. Mevcut dört kart görselsiz olduğu için bu pilotta izinsiz fotoğraf sunulmuyor. Hak belgesi doğrulama, geri çekme ve atıflı sunum hattı tamamlanmadan yeni bir `card.photo` kaydı eklenmemelidir. Bu ilk aşama mevcut algoritmayı, seçimi, manuel kararları veya tasarımı değiştirmedi.

## Google Places Photos

- [Resmî Photos belgesi](https://developers.google.com/maps/documentation/places/web-service/place-photos): fotoğraf adı önbelleğe alınamaz ve süresi dolabilir; gerektiğinde resmî Places cevabından yeniden alınır. Dönen `authorAttributions` varsa fotoğrafın gösterildiği yerde sağlanır.
- [Places kullanım/atıf politikası](https://developers.google.com/maps/documentation/places/web-service/policies): istisnalar dışında önceden çekme/önbellekleme/saklama yasakları, Google Maps/sağlayıcı atıfları ve kamuya açık kullanım/gizlilik metinleri geçerlidir. Place ID için saklama istisnası fotoğraf baytına veya fotoğraf adına genişletilemez. Hesabın faturalama bölgesine göre ilgili şartlar ayrıca değerlendirilir.
- Google fotoğrafları yerel `public`, kalıcı CDN, veritabanı veya mevcut uzun süreli Next image önbelleğine kopyalanmamalı. API anahtarı tarayıcıya, URL loguna veya ziyaretçi çıktısına girmemeli. Bu pilotta medya endpoint'i açılmadı.
- [Güncel fiyat tablosu](https://developers.google.com/maps/billing-and-pricing/pricing): Place Details Photos için aylık ücretsiz sınır 1.000; ilk ücretli kademede 1.000 istek 7 USD. Dört medya isteğinin ücretsiz kullanım öncesi karşılığı **0,028 USD**; kimlik eşleştirme, arama/Details ve vergiler buna dahil değil. Hesapta kalan ücretsiz kota veya deneme kredisinin uygulanacağı doğrulanmadı.
- Dört doğru şubenin Places kimliği bu görsel görevi kapsamında doğrulanmadı. Ücret onayı alınmadan Photos, arama veya Details isteği yapılmadı. **Bu görevde 0 ücretli API isteği, 0 Photos isteği, 0 USD doğrudan API harcaması.** Web araştırma aracının kendi hizmet maliyeti bu sayaç değildir.

## Kalan uygulama

Hak sahibinden varlığa bağlı izin gelirse belge denetlenip kaynak/şube ve zorunlu atıflarla kayıt tamamlanabilir. İşletmeye/kişilere otomatik ileti gönderilmedi. Alternatif olarak ayrı bütçe onayından sonra doğru Place ID ve koşullara uygun geçici Google fotoğraf sunumu test edilebilir. Hakları belgeli premium kategori illüstrasyonu üretimi/entegrasyonu sonraki adım; bu rapor illüstrasyon hazırmış gibi göstermez.

Doğrulama: `node scripts/verify_image_audit.cjs`, mevcut ürün/manuel seçim korunumu ve entegrasyon veri sınırı testleri. Görsel yayın servisi eklenmediği için bu testler lisans izni alındığını veya tasarımın tamamlandığını kanıtlamaz.

### Çalıştırılan kontroller

31 Ekim 2026: görsel denetimi 6/6, ürün ve kayıt korunumu 3/3, entegrasyon veri sınırı 5/5; toplam 14 kontrol başarılı. Gerçek dört ziyaretçi kartında fotoğraf alanları boş. Seçilen mekan kimlikleri/sırası, manuel kararlar ve kalite denetçisi kalıcı kayıtlarının hash değerleri değişmedi. Uygulama kodu/tasarımı değiştirilmediği için bu belge/veri denetimi kapsamında yeniden build çalıştırılmadı.
