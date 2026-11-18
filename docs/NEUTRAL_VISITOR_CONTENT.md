# Tarafsız ziyaretçi içeriği — UI entegrasyon sözleşmesi

Codex yalnız otomatik metin/veri sınırını hazırladı; Antigravity tasarım uygulamasını kendi klasöründe yapar. Mevcut yönetici ekranı ve kanıt arşivi korunur.

## Kullanım

`GET /tr/moda-kadikoy-pilot/selection/data?audience=visitor`

Mevcut yönetici kimlik doğrulaması ve localhost geliştirme koruması devam eder; üretimde kapalıdır. Varsayılan rota yönetici için kaynakları, seçim gerekçelerini ve araştırma notlarını döndürmeye devam eder.

Ziyaretçi kartı yalnız `id`, `name`, `location`, `categoryId`, `description`, `whatToOrder`, `alsoTry`, `beforeYouGo`, `photo`, `ratings` alanlarını içerir. `whyGo`, `sources`, `selection`, yazarlar, kişisel alıntılar ve ham araştırma notları bu sözleşmede yoktur. `null` ve boş diziler için ilgili UI bölümü gösterilmez.

Ana kartta açıklama/ek ürün/ziyaret notları kullanılmaz; yalnız ad, fotoğraf, konum, doğrulanmış puan ve `whatToOrder`. Detay kısa açıklamayı ve varsa ek alanları kullanır. “Neden Gitmeli?” hiçbir ziyaretçi görünümünde eklenmez. Yönetici notlarını ziyaretçi kartına yaymayın/spread etmeyin. Bu görevde TSX veya canlı kart tasarımı değiştirilmedi.

Ürünler ham cümlelerden çıkarılmaz. Aynı şubeye ait kullanılabilir operatör menü kanıtı, geçerli kaynak URL'si, kontrol tarihi (en fazla 180 gün) ve sözlükte tam ürün adı eşleşmesi gerekir. Çelişkili kimlik/kapalı işletme ürün metni üretmez. Yeni ürün sözlüğe yalnız kanıtlı, tarafsız ürün adı olarak eklenir. En fazla dört ana ve dört ek ürün; kalite sıralaması değildir. Bu sürümde kesinleşmiş yapılandırılmış ziyaret bilgisi olmadığı için `beforeYouGo` boştur.

Mevcut dört adayda ürün kanıtlarının önemli kısmı marka menüsü veya tarihsel editoryal anlatıdır. Bunlar araştırmada korunur ama şube menüsü sayılmaz; boş ürün listesi başarısızlık gizlemek için doldurulmaz. Google puanları ayrı resmî doğrulama/atıf hattında kalır: bu DTO çıplak puanları veya demo değerleri kopyalamaz. `ratings` şimdilik boştur.

Test: `node scripts/verify_visitor_content.cjs`. Gerçek yerel çıktının kaynak veya övgü taşımadığı ayrıca API üzerinden kontrol edilir. Yeni araştırma, model veya ücretli API çağrısı gerekmez.

## Son karar: yorum sayısı ziyaretçiye kapalı

`ratings` artık yalnız Google Maps için sıfır veya bir öğe taşır: `{platform:'google-maps', value, attribution:{label:'Google Maps', mapsUri, providers}}`. Doğrulanmış resmî adaptör sonucu ve aynı uygulama şube ID'si olmadan boş kalır. Araştırma kartındaki çıplak puan aktarılmaz. Yorum sayısı veya alternatif platform puanı eklenmez. `GooglePlaceRating` ortak kart/detay bileşeni `String(value)` ile ondalık virgül ve `/5` gösterir; yuvarlamaz. Google ve üçüncü taraf atıfları güvenli bağlantılarla korunur. Yönetici `RatingResult.reviewCount` ve iç `googleReviewCount` alanları aynı kalır. Mevcut gerçek dört şube doğrulanmadığı için ziyaretçi puanları hâlâ boştur. Bileşen Antigravity tasarımı devredildiğinde bağlanmak üzere hazırdır.

## Son karar: ürün tavsiyesi / Menüden ayrımı

`whatToOrder` yalnız bağımsız kalite + doğru şube menüsü + kategori desteğiyle A sınıfına ulaşan 1–3 ürün içindir. Menü mevcudiyeti artık bu alanı doldurmaz. B sınıfı ürün adları yeni `menuFrom` dizisine gider; UI başlığı “Menüden” olur. `alsoTry` yalnız aynı güçlü eşiği sağlayan ek ürünlerdir; toplam imza ürün sınırı üçtür. Boş alan gizlenir. Ana uzmanlık, kategori uygunluğu ve ürün gerekçelerinin kaynakları yalnız yönetici `productResearch` modelindedir; ziyaretçi DTO'suna spread edilmez. Önceki menü-yalnız sipariş yaklaşımının yerini bu karar alır.

Bu ürün politikasıyla menü erişim tazeliği 90 gündür; önceki 180 günlük menü eşiğinin yerini alır. Yayın/güncelleme tarihi ve stok teyidi ayrı kalır.
