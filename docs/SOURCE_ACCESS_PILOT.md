# Kaynak erişimi pilotu — 30 Ekim 2026

## Gerçek sonuç ve önceki yöntemle karşılaştırma

Mevcut Moda beşli araştırması korunur. `research-source-access.cjs` ayrı bir rapor üretir; ilk keşif, kalite ledger'ı, yönetim/manuel kararlar ve `work/focused-research/latest.json` değiştirilmez. Yönetici ekranı kaynak erişimi raporunu salt okunur biçimde birleştirir. Sayfa/polling arama başlatmaz.

Gerçek ortamda `TAVILY_API_KEY` yoktur. Bağlantı hazır fakat pasiftir: 0 arama, 0 kota API isteği, 0 kredi. 5 hedefte önceki 1 kanıt dosyası ve 25 desteklenen olgu korunmuştur. Yeni URL veya yeni doğrulanmış olgu 0'dır. Canlı Tavily karşılaştırması yapılamadığı için yeni yöntemin başarıyı artırdığı söylenmez. Testlerdeki etkin API cevapları sadece bellek/geçici test dizinindedir; gerçek rapora karışmaz.

Her işletmede üç bölüm gösterilir:

1. Kaynaklarla desteklenen işletme/şube/menü olguları. Tek işletme beyanı ile çok kaynaklı adres eşleşmesi farklı etiketlenir. Menü ürünü marka kapsamı/servis sınırlamasıyla korunur.
2. Bağımsız yayınlarda geçen ürün kayıtları. Bunlar tat/kalite doğrulaması veya yeni ziyaret sayılmaz. Mevcut adaptör kesin deneyim tarihi çıkarmadığı için güncel bağımsız deneyimle doğrulanmış kalite 0'dır; tarihsel notlar ayrı gösterilir.
3. Eksikler, şube/adres çelişkileri ve doğrulanamayan faaliyet/kalite bilgileri.

## Opsiyonel Tavily bağlantısı

Yerel CLI: `node scripts/research-source-access.cjs`. İleride mevcut güvenli ortam yönetiminden `TAVILY_API_KEY` sağlanır ve `TAVILY_SEARCH_ENABLED=true` seçilirse çalışabilir. Bu görevde sır dosyası değiştirilmedi, anahtar uydurulmadı ve etkinleştirme yapılmadı. Üretim/VERCEL ortamı engellenir. Yeni SDK/bağımlılık veya abonelik yoktur.

Hedefler yalnızca Montag Moda, Story Dalga, Çekirdek Şair Latifi, Guten Morgen Fırıldak, Coffee Manifesto Moda. Her hedefe tek sabit işletme/konum/menü sorgusu, en fazla 3 sonuç. Serbest kullanıcı sorgusu, il/ülke taraması veya başka kategori çalışmaz.

`POST https://api.tavily.com/search`: `search_depth=basic`, `auto_parameters=false`, `include_answer=false`, `include_raw_content=false`, `include_images=false`, `include_usage=true`. Advanced/Research/Extract/Crawl endpoint'leri kullanılmaz. Yalnız URL ve keşif zamanı/işletme hedefi kalıcıdır; provider özetleri, ham içerik, görseller, puanlar veya API cevabının bütünü saklanmaz. URL sorgu takibi temizlenir. Anahtar sadece Authorization başlığında kullanılır; log/durum/istemci paketine yazılmaz.

## Ücretsiz kullanım ve sayaç koruması

Yerel limitler: iş başına 5 kredi/arama, İstanbul takvimine göre günde 20 ve ayda 200 ihtiyatlı ayrılan kredi. HTTP istek sınırı ayrıca günlük 40 / aylık 400'dür; başarısız kota kontrolleri de bu sınırda sayılır. Her ağ isteği 12 saniye, en fazla 500 KB JSON. Aynı sorgunun URL önbelleği 24 saat; orijinal keşif tarihi korunur.

Her aramadan hemen önce ücretsiz `GET /usage` kontrolü gerekir. Kabul edilen durum: belgelenen Free/Researcher planı, sayısal hesap/anahtar kullanımı ve en fazla 1.000 kredi limiti, sıfır paygo kullanımı ve sıfır paygo limiti. Eksik/belirsiz/sayısal olmayan alanlar, ücretli plan veya tükenen hesap kotası durumunda arama yapılmaz. Bu katman sağlayıcının ücretli kullanım ayarını değiştirmez; sıfır ücretli ek kullanım şartını doğrulamadan devam etmez.

Tek kalıcı kilit altında kredi rezervasyonu ve HTTP niyeti POST öncesi atomik kaydedilir. Çökme veya zaman aşımında ayrılan kredi geri verilmez. Sağlayıcının bildirdiği tüketim, ihtiyatlı ayrılan miktar ve belirsiz tüketim ayrı gösterilir. Eksik tüketim bilgisi veya beklenmedik >1 kredi cevabı yeni harcamayı durdurur. Sayaç kaydı bozuksa sıfırlanmaz; kapalı kalır. Gün/ay değişiminde eski kayıtlar silinmeden yeni takvim penceresi kullanılır.

401/403/429 ve kredi hataları sonrasında otomatik tekrar yoktur; bekleme kaydı tutulur. Yönlendirmeler izlenmez. Başka istemcilerin aynı hesapta yaptığı tüketim `/usage` ile kontrol edilir; yerel sayaç o tüketimi bilemez. Sağlayıcı ayarlarının başka bir istemci tarafından değiştirilmemesi gerekir; bu uygulama tüm hesap için faturalama yönetimi yaptığını iddia etmez. Gerçek anahtar olmadığı için canlı sağlayıcı plan/alan biçimi henüz test edilmedi; beklenmeyen biçim güvenli duruşla sonuçlanır.

## Asıl kaynağa dönme ve haklar

Tavily sonuçları keşif bağlantısıdır; arama özeti kanıt değildir. Bilinen URL mevcut izinli kaynak diziniyle tam eşleşirse asıl sayfa adaptörü (ve tarihli olgu önbelleği) kontrol edilir. Aynı URL tek kez işlenir. Yeni alan adı veya yeni yol otomatik fetch edilmez: kaynak hakları/robots/şube ayrıştırıcısı bekleyen bağlantı olarak kalır. Kaynak denetimi bütçesi ayrıca 12 HTTP / 90 saniyedir.

Mevcut kaynak katmanının robots, 403/429 alan adı beklemesi, yönlendirme reddi, boyut/bütçe ve telifli tam içerik saklamama kuralları korunur. Robots izni bir telif lisansı değildir. Yeni bir yayın için sayfa erişimi, kullanım koşulları ve olgusal alıntı/özet sınırları ayrıca incelenmeden kanıt adaptörü eklenmez. Google/Yandex/Tripadvisor müşteri yorumları veya puanları toplanmaz. Üretim verisi veya gizli bilgi arama sorgusuna gönderilmez.

30 Ekim 2026 incelemesi: [Tavily Search belgeleri](https://docs.tavily.com/documentation/api-reference/endpoint/search), [Usage](https://docs.tavily.com/documentation/api-reference/endpoint/usage), [Kredi maliyetleri](https://docs.tavily.com/documentation/api-credits), [Platform koşulları, 4 Mayıs 2026](https://www.tavily.com/terms). Basic arama belgede 1 kredi; ücretsiz kota 1.000/ay. Platform koşulları üçüncü taraf hakları/koşullarına uyma ve çıktıları bağımsız kontrol etme sorumluluğunu müşteride bırakır. Bu görevde hesap oluşturulmadı veya koşullar kullanıcı adına kabul edilmedi.

## Dosyalar ve doğrulama

`lib/pilot/research/search/tavily.ts`: opsiyonel istemci, ücretsiz plan/kota kontrolü, atomik sayaç/kilit, URL önbelleği.

`lib/pilot/research/focused/sourceAccess.ts`: beş hedef pilotu, asıl kaynak kontrolü, üçlü ayrım ve karşılaştırma. Çıktı ve önceki çalışmalar `work/source-access-pilot/` altında, Git dışında saklanır.

`verify_tavily_pilot.cjs`: pasif bağlantı, ücretsiz plan şartları, günlük/aylık/HTTP bütçeleri, önceden rezervasyon, belirsiz hata, önbellek, 403/429, bozuk kayıt, eşzamanlılık, URL güvenliği, asıl kaynağa dönüş, menü/kalite ayrımı ve üretim engeli. Etkin API senaryoları gerçek ağa çıkmadan taklit edilir ve geçici dosyalar temizlenir. Mevcut araştırma/güvenlik testleri korunur.

Hazırlık: opsiyonel entegrasyon ve güvenlik pilotu hazır. Gerçek Tavily erişimi ve yeni kaynaklarla başarı artışı ölçümü anahtar/ücretsiz hesap doğrulaması gelene kadar eksiktir. Türkiye ölçeğinde veya yeni kaynak adaptörleri olmadan sınırsız taramaya hazır değildir.

## Canlı ücretsiz bağlantı — 30 Ekim 2026

Anahtar macOS gizli giriş penceresinden Node alt sürecinin özel pipe'ına alındı; değeri argüman, sohbet, log veya Git'e yazılmadı. `.env.local` atomik yenilendi, izinleri 0600; geçici sır dosyası silindi. Uygulama tarafında anahtar yalnız sunucuda ortam değişkeni olarak okunur.

Gerçek Usage cevabı ücretsiz plan/1000 kredi/sıfır kullanım doğruladı; opsiyonel anahtar ve paygo limitleri `null` geldi. Bunlar sıfır veya paygo kapalı varsayılmadı. Katman ücretsiz planın zorunlu sayısal kalan bakiyesini, sıfır paygo tüketimini ve mevcut 5/20/200 limitlerini kullanacak biçimde nullable alanları düzeltti; pozitif paygo limiti/ücretli plan/belirsiz plan kotası hâlâ reddedilir. Sorgular yalnız doğrulanmış ücretsiz bakiye içinde çalışır; ücretsiz paket dışında devam/abonelik değiştirme kodu yoktur. Aynı işte gecikmeli Usage verisi üstüne yeniden harcama yapılmaması için yerel kalan bakiye tüketim kadar azaltılır. Resmî fiyat sayfası ücretsiz kredi bitiminde isteklerin durduğunu açıklar: https://www.tavily.com/pricing

Beş gerçek Basic arama tamamlandı; sağlayıcı toplam 5 kredi bildirdi, belirsiz kredi yok. Yerel günlük/aylık tüketim 5/5. Arama cevapları 10 tekil URL verdi. Sonraki asıl kaynak kontrolleri aynı beş sorgunun önbelleğini kullandı: ek Tavily kredisi 0. Önceki ham cevaplar veya müşteri yorumları saklanmadı.

- Story resmî ana sayfasından paket kahve kataloğu olgusu eklendi. Marka beyanıdır; içecek lezzeti veya şube stok doğrulaması değildir. Desteklenen olgular 25 → 26; hazır dosya 1 → 1; güncel bağımsız kalite 0.
- Çekirdek sorgusunda gelen Story sitesi Çekirdek kanıtı yapılmadı; dışlanan hedef raporda kaydedildi.
- Filter Notes ve OGGUSTO iki yeni editöryal araştırma bağlantısıdır. Filter Notes incelemesinin ana şubesi Çarşı'dır; ayrıca https://www.filternotes.com/terms ticari/rakip veritabanı kullanımını izin gerektiren kapsamda tutar. İçeriği aktarılmadı; sadece link ve kullanım kararı kaydedildi.
- OGGUSTO robots ve sayfası 200 döndü; şubeye güvenle bağlanan ayrıştırıcı/haklar değerlendirmesi tamamlanmadığı için olgu/kalite iddiası alınmadı. Başarılı erişim, doğrulanmış kalite değildir.
- Instagram, Tripadvisor ve Yandex sonuçlarının yorum/puan içerikleri alınmadı.

Asıl kaynak önbelleği pilotun kendi `original-cache.json` dosyasında tutulur; önceki odak araştırma önbelleği ve raporu değiştirilmez. Engel/bekleme kayıtları böylece yeniden çalıştırmalarda korunur. Yeni olgu künyeleri ve kaynak erişim kayıtları rapora eklenir.

`verify_local_tavily_secret.cjs` yalnız yapılandırma/izin/Git dışlama ve oluşturulan dosyalarda sızıntı bulunmadığı bilgisini gösterir; anahtarın herhangi bir kısmını göstermez. Gerçek bağlantı testleri etkin yanıta uyarlanırken önceki pasif rapor testi arşivden korunmuştur. Nullable kotalar ve gecikmeli Usage cevabında ücretsiz bakiyenin tekrar harcanmaması ayrıca test edilir.
