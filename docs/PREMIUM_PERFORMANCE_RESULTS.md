# Yerini Ayır V1 — Premium performans denetimi

Tarih: 1 Kasım 2026. Next.js 15.5.28 production build; `feat/gastronomy-ui-integration`. Yalnızca yerel entegrasyon ortamı.

**Sonuç:** Mobil performans minimum 90 ve hedef 95+ bütün navigasyon ölçümlerinde sağlandı. Masaüstü 100; erişilebilirlik ve Best Practices 100. Bununla birlikte iki mobil LCP ölçümü 2.500 ms sınırını geçtiği ve önizleme bilinçli olarak noindex olduğu için bütün yayın kriterleri tamamlandı denemez. Kalıcı kontrol komutu bu durumu başarısız olarak raporluyor.

## Önce / sonra — üç bağımsız ölçüm

| Cihaz / ekran | Önce Performance | Sonra Performance | Önce LCP ms | Sonra LCP ms |
|---|---|---|---|---|
| mobile / home | 78 / 80 / 84 | 97 / 98 / 98 | 5026 / 4987 / 4514 | 2527 / 2490 / 2475 |
| mobile / moda-coffee | 81 / 81 / 81 | 98 / 97 / 98 | 4978 / 4973 / 4976 | 2477 / 2624 / 2475 |
| desktop / home | 99 / 100 / 99 | 100 / 100 / 100 | 922 / 822 / 1029 | 511 / 506 / 513 |
| desktop / moda-coffee | 100 / 100 / 99 | 100 / 100 / 100 | 819 / 815 / 1003 | 551 / 545 / 564 |

Mobil ölçümler sırasıyla 375, 390 ve 430 px; masaüstü üç kez 1440 px. Lighthouse 13.6.0, mobilde simüle mobil ağ/CPU yavaşlatması ve her navigasyonda temiz depolama. Her sürümde 12 navigasyon, 24 detay etkileşim aralığı ve 24 detay görüntü denetimi: **60 rapor, önce+sonra 120 rapor**. Ara adayların ölçümleri de saklandı; başarısız sonuçlar silinmedi.

Son durumda bütün navigasyonlarda CLS 0, Accessibility 100 ve Best Practices 100. Mobil ana sayfa LCP medyanı 2.490 ms; liste 2.477 ms. En kötü değerler sırasıyla 2.527 ve 2.624 ms: en kötü iki ölçüm sınırı aşıyor; yalnızca medyana bakılarak başarılı sayılmadı. Minimum 90 mobil performansın altında kalan navigasyon yok.

## Dört gerçek mekanın detayları

Detaylar bağımsız URL sayfası yerine mevcut tasarımdaki modal ekranlardır. Bu nedenle modal açılışına navigasyon LCP değeri veya navigasyon performans puanı atanmadı. Lighthouse timespan ile gerçek tıklama etkileşimi, snapshot ile açık modalın erişilebilirliği ölçüldü. Her mekan her cihazda üç kez açıldı.

| Mekan | Önce mobil etkileşim ms | Sonra mobil etkileşim ms | Sonra masaüstü ms |
|---|---|---|---|
| Çekirdek | 143 / 112 / 116 | 131 / 104 / 107 | 58 / 57 / 58 |
| Story Coffee | 51 / 54 / 46 | 48 / 50 / 44 | 32 / 31 / 35 |
| Guten Morgen | 44 / 44 / 49 | 42 / 50 / 41 | 34 / 34 / 35 |
| Montag | 50 / 56 / 51 | 47 / 43 / 44 | 35 / 34 / 35 |

Açık detayların Accessibility değeri 95’ten 100’e çıktı; Best Practices 100, etkileşim CLS 0. Mobil laboratuvar etkileşimi en kötü 131 ms. Timespan Performance 100 yalnızca ölçülen etkileşim aralığına aittir. Gerçek ziyaretçi p75 INP/CrUX verisi henüz yok; INP ≤200 ms saha standardı kesin doğrulandı denemez. [Lighthouse ölçüm modları](https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md), [laboratuvar ve saha ölçümleri](https://web.dev/articles/lab-and-field-data-differences).

## Trafik, sorgular ve yanıtlar

| Ölçüm | Önce | Sonra |
|---|---:|---:|
| Ana sayfa soğuk toplam ağ aktarımı | 655.397 bayt | 252.947 bayt (%61,4 azalma) |
| Moda kahve soğuk toplam ağ aktarımı | 661.761 bayt | 259.333 bayt (%60,8 azalma) |
| Next ilk yük JavaScript raporu | yaklaşık 372 KB | yaklaşık 127 KB |
| Menü/detay açılışı ek ağ aktarımı | 0 | 0 |

390 px gerçek Chrome akışı: ana sayfa TTFB 15 ms, DOMContentLoaded 42 ms. Konum seçimi yalnızca eksik üç SVG için toplam 6.404 bayt indirdi; tekrar RSC/API isteği oluşmadı. Story detay arayüzü 25 ms içinde hazırdı. Sıcak liste yenilemesinde ağ aktarımı 12.646 bayt; statik dosyalar tarayıcı önbelleğinden geldi. Akışın toplam süreleri ayrıca 500 ms network-idle beklemesi içerdiğinden gerçek render süresi gibi sunulmadı.

**Ölçülen ziyaretçi akışlarında Supabase sorgusu 0, Supabase aktarımı 0, Google Places isteği 0.** Bu sonuç mevcut yerel dosya tabanlı gerçek araştırma verisi için geçerlidir; gelecekte Supabase’e taşınan veri yolunun maliyet garantisi değildir. Tarayıcı toplam aktarımı Supabase egress’i olarak sayılmadı.

Mekan/kategori ziyaretçi DTO’su mevcut 30 saniyelik sunucu önbelleğini kullanır: kaynak ve manuel karar dosyası değişince anahtar yenilenir; eşzamanlı aynı istekler birleştirilir, bellek sınırı korunur. Yönetici çıktıları no-store kalır. Google lisanslı puan verileri bu genel önbelleğe katılmaz. Google sorguları ziyaretçi render yolunda yoktur; önceki onay/bütçe/şube doğrulama korumaları değişmedi. Bu test için yeni Google puanı alınmadı; doğrulanmış güncel veri yokken alan gizlidir.

SVG’ler yerel ve küçük; mevcut etiketler ve dört farklı kompozisyon korunur. Inter ailesinin Türkçe/İngilizce karakterlerini ve tüm ağırlıkları içeren 44.248 bayt yerel alt kümesi kullanılır; OFL lisansı dosyası korunur. Hash içeren font bir yıl immutable, SVG’ler mevcut bir günlük tarayıcı önbelleğiyle sunulur. Üretim CDN davranışı deployment yapılmadığından ölçülmedi.

## Güvenli eşzamanlılık testi

| Eşzamanlı HTTP istek | Başarılı | Hata | Önce p95 ms | Sonra p95 ms | Sonra p95 TTFB ms |
|---:|---:|---:|---:|---:|---:|
| 50 | 50 | 0 | 225 | 248 | 242 |
| 100 | 100 | 0 | 363 | 344 | 329 |
| 300 | 300 | 0 | 1026 | 987 | 949 |

Her seviyede tek sınırlı HTTP SSR patlaması; 300 ayrı Chrome tarayıcısı veya sürekli yük testi değildir. Yalnızca 127.0.0.1:3330, 8 CPU iş parçacığı / 8 GB geliştirme bilgisayarı. Üretim Supabase’ine yük verilmedi; dış bağlantılar sunucu seviyesinde engellendi. Bu test Free Nano’nun 300 eşzamanlı veritabanı sorgusunu kaldırdığını kanıtlamaz.

## Düzeltmeler ve kalan darboğaz

- Eski otel arayüzü, tüm Lucide ikon kataloğu ve Supabase client kodu gastronomi açılış paketinden ayrıldı; eski sayfalar ve URL’ler korunur.
- Gerektiğinde çalışan bildirim ve izleme bileşenleri ertelendi. Ortak header çoğaltılmadı.
- Gereksiz ikinci font kaldırıldı; Inter korunarak yerel Türkçe/İngilizce font önceliklendirildi. SVG öncelikleri düzeltildi.
- Konum/kategori değişimi URL ve Geri/İleri ile uyumlu native history kullanır; aynı gerçek veri için tekrar sunucu isteği göndermez.
- Mobil zoom engeli kaldırıldı; kart başlık hiyerarşisi, konum düğmesi etiketi ve soluk metin kontrastı düzeltildi.
- Kalan sınır: soğuk mobil açılışta ortak render engelleyen CSS ve font zinciri; iki LCP ölçümü 27 ve 124 ms fazla. Eski sayfaların paylaştığı CSS’i büyük bir yeniden yapılandırmayla ayırmak bu görevde yapılmadı.

## Güvenlik ve regresyon

- Next production build başarılı; TypeScript başarılı; lint hata yok, mevcut ve yeni hook bağımlılığı/legacy img uyarıları var.
- 13/13 birleşik tarayıcı kontrolü ve 5/5 imza ürün entegrasyon kontrolü başarılı; 375/390/430/1440 px, dört mekan, detay/geri dönüş, gizli kaynak ve yorum sayısı sızıntısı yok.
- 48/48 yetkilendirme/middleware güvenliği, 10/10 Google Places çevrimdışı koruması, 8 ziyaretçi önbellek grubu, 3 ürün/manuel kayıt koruma grubu ve 4 staging güvenlik grubu başarılı. Google test fixture’ları gerçek puan doğrulaması değildir.
- 109 istemci build dosyasında yapılandırılmış sunucu sırları bulunmadı; değerleri rapora veya loga yazılmadı.
- Üretimdeki geçici yazma engelleri kaldırılmadı; bu görevde production sorgusu, değişiklik veya migration yapılmadı. Yedekler korunur.

## Kalıcı yayın kapısı ve açık konular

`docs/PRODUCT_DECISIONS.md`, `scripts/premium-performance-budget.json`, `npm run perf:check` ve `npm run perf:lighthouse` kalıcı kriterleri içerir. Lighthouse yerel, Git dışı tooling altında kurulur; yeni çalışma ortamında ajan tarafından yeniden hazırlanmalıdır. Son testin build kaydı ve ham raporlar `work/premium-performance` altında tutulur.

**perf:check şu anda beklenen şekilde başarısız:** iki LCP aşımı ve bütün navigasyonlarda SEO 66. SEO’daki başarısız denetim önizlemenin bilerek noindex olmasıdır; puan uğruna güvenlik/indeksleme koruması kaldırılmadı. Detay snapshot SEO 100, sınırlı modal denetimidir; ana navigasyon SEO 100 demek değildir.

Canlıda indekslenebilir domain, canonical/robots, gerçek hosting/CDN gecikmesi, saha INP ve üretim veri yolu ayrıca doğrulanmalıdır. Yerel hızlı sürüm, tüm yayın güvenliği ve gerçek veri eksiklerinin kapandığı anlamına gelmez. Önceki ürün kanıtları/sıfır güçlü tavsiye ve güncel Google puanı eksikleri aynen korunmuştur.

Push, deployment, production veritabanı değişikliği ve ücretli API çağrısı yapılmadı.

Önizleme: http://127.0.0.1:3300/tr?region=moda&category=kahve
