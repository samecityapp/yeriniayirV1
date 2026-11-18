# Aşama 2 — Kaynaklı kahve ve ürün araştırması

## Kapsam ve gerçek veri kaynağı

Yalnızca `feat/codex-development`, Codex geliştirme klasörü. Canlı veritabanı veya ziyaretçi sayfalarına veri yazılmaz.

- Gerçek Aşama 1 keşif kaydındaki 91 kahve sinyali için mevcut konum/adres/faaliyet alanları ön kontrolden geçirilir. Bu işlem her işletmenin internette derinlemesine araştırıldığı anlamına gelmez.
- Genel kafe etiketinde kaldığı için filtreyi geçemeyen Montag Moda, Guten Morgen, Kropka ve Fahriye mevcut gerçek 282 kayıttan eklenir. Toplam 95 kayıt korunur; yiyecek satışı eleme ölçütü değildir.
- 20 farklı şube adayı için web kaynakları incelenmiş, ürün/konum belirsizlikleri ve sonuç vermeyen araştırmalar kaydedilmiştir. 10 aday karşılaştırma görünümünde başlangıçta seçilidir. Liste alfabetiktir; kazanan sıralaması değildir.
- Kaynak inceleme notları `lib/pilot/quality/evidence-ledger.json` içindedir. Bunlar geliştirme ajanının gerçek web araştırmasından gelen, kısa olgusal notlardır. Demo verisi veya eski sabit pilotun kalite iddiaları aktarılmamıştır.
- `searchQueries` alanı yeniden araştırma için sorgu önerileridir; otomatik arama servisinin işlem günlüğü değildir. Araştırmanın gerçek araç izi sohbetin araç kayıtlarındadır.

## Tekrar üretme

`node scripts/build-coffee-quality.cjs` kaydedilmiş kaynak notlarını gerçek keşif kimlikleriyle birleştirerek `work/pilot-quality/latest.json` dosyasını atomik yeniler. Bu komut yeni web araştırması veya yeni tadım yapmaz; kaynak inceleme tarihini değiştirmez. Eksik keşif kimliğinde aday uydurmak yerine hata verir. Ücretli API/LLM çağrısı yoktur.

Yönetici sayfasının varsayılan **Kalite & Ürün Araştırması** sekmesi kayıtlı raporu okur. Rapor yoksa boş durum gösterilir. Sayfa açılışında dış kaynak veya model çağrısı yapılmaz. Kimlik doğrulama, önceki pilotun sunucu ve middleware korumalarıdır.

## Kanıt ilkeleri

Her iddia kaynak kimliği, doğru şube/marka/belirsiz kapsamı, kaynak aktarımı/menü/çıkarım ayrımı ve gerekli çekinceyi taşır. Kaynak künyesinde tam URL, yayıncı, yazar (biliniyorsa), yayın, güncelleme, inceleme ve deneyim tarihleri ayrıdır. Bilinmeyen tarih `null` kalır. Yakın tarihli yayın yakın tarihli tadım demek değildir.

- Kalite bulguları, kanıt güvenilirliği ve ziyaretçi uygunluğu ayrı gösterilir. Birleşik puan yoktur.
- Yayın aileleri tekilleştirilir. Time Out’un üç sayfası bir yayın ailesidir. Söyleşide işletmecinin kendi beyanı, ticari tedarikçi portföyü, sponsorlu/affiliate içerik ve OSM türevleri bağımsız kalite ailesi sayılmaz.
- theMagger’ın HODL içeren yazısı açık Lenovo iş birliği nedeniyle bağımsız kalite sayımına alınmamıştır.
- Kahve Dergisi’ndeki Story söyleşisi yayıncı farklı olsa bile kurucu beyanıdır; bağımsız tadım olarak sayılmaz.
- Kava topluluk sayfası yalnızca ürün/konum ipucu olarak kullanılmıştır. Göreli müşteri tarihleri kesin tarihe çevrilmemiştir. Müşteri metinleri, adları, fotoğrafları ve puanları depolanmamıştır; izinli ham müşteri deneyimi entegrasyonu henüz yoktur.
- Doğrudan Kahveler.net erişimi 403 vermiştir; arama dizini, yeniden okunmuş kaynak gibi sunulmamıştır. Guten Morgen sitesi erişilememiştir. Bu kayıtlar iddiaları destekleyemez.
- Kaynaklardaki kısa olgusal özetler tutulur; makale ve fotoğraf kopyaları, Google puan ve yorum arşivi yoktur.

## Önemli somut ayrımlar

- Montag Moda Bademaltı ile Çarşı Muvakkithane ayrı şubelerdir. Marka V60 anlatısı Moda’ya ait yeni tadım sayılmaz.
- Coffee Manifesto’nun keşif kaydı Güneşli Bahçe 40; işletmenin güncel Moda listesi Dr. Esat Işık 22/B. Koordinatlar taşınmamış, şubeler birleştirilmemiştir. Yeldeğirmeni’nin ürün/atmosfer bulguları Moda’ya kopyalanmaz. Kapanış kesinleştirilmedi.
- Story: Milor’un 2020 cortado/sticky bun anlatısı, 2024 Time Out yazısı ve 2026 tarihli menü güncellemesi ayrı tutulur. Eski sticky bun ile mevcut Cinnamon Roll aynı tarif kabul edilmez. Milor’un cheesecake eleştirisi korunur.
- Çekirdek’in 2013 tatlı ve masa anlatısı bugünkü menü/kapasite değildir. Cornucopia’nın cappuccino kaydı tarihsizdir.
- Guten Morgen’ın kahve ve ekşi maya uzmanlıkları birlikte korunur. Kahvaltı sunmak kahve adaylığını düşürmez.
- Urban’ın Batumi, Earth’ün Doha ve Yesterday’in Vietnam adaşları yerel işletmelere bağlanmamıştır. Doz’un paket çekirdek sitesi Moda şubesinin açık olduğunu kanıtlamaz.
- Kapalı olma etiketi veya güncel listede bulunmama kesin kapanış sayılmaz. Bu çalışmada kesin kapanış teyidi: 0. Kanıt açığı olanlar Ek Araştırma durumunda kalır.

## Sınırlar

Bu aşama ücretli arama/LLM servisleri satın almadan, geliştirme ajanının kontrollü web incelemesiyle üretilmiş bir araştırma anlık görüntüsüdür. Kendi kendine yeni kaliteli işletme seçip yayımlayan bir sistem değildir. 20 dosyanın tamamında yeterli güncel ve bağımsız kalite kanıtı yoktur. Özellikle günlük stok, güncel faaliyet ve şubeye özgü yeni müşteri/uzman deneyimleri eksiktir. Kesin ilk üç ve yayın kararı yoktur.

## Doğrulama

- `npm run typecheck`, `npm run build`
- `node scripts/verify_quality.cjs`: gerçek keşif kimlikleri, desteklenmeyen/engelli iddia reddi, tarih ayrımı, kaynak ailesi/sponsorluk, şube çelişkileri, eleme yapmama, veri koruma ve ağsız rapor üretimi.
- `node scripts/verify_quality_browser.cjs`: yönetici erişimi, 10 aday sınırı, seçim değiştirme, 95 kayıt, kaynak istisnaları, mobil görünüm, araştırmayı sayfa açılışında çalıştırmama.
- Mevcut `verify_research.cjs`, `verify_pilot_security.cjs`, `verify_rls_security.mjs` korunmuştur. Aşama 1 tarayıcı testi yeni varsayılan sekmeden eski araştırma sekmesine geçerek çalışır.
