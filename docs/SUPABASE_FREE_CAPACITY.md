# Yerini Ayır — Supabase Free kapasite ve RLS değerlendirmesi

31 Ekim 2026. Ölçüm tabanı: birleşik gastronomi uygulaması / 3300. Ayrı yük testi: yalnız 127.0.0.1:3330. Production'a yük testi, veri yazma, politika değişikliği, ücretli API sorgusu, push veya deployment yapılmadı.

## Karar

**Supabase Free, önbellekli ve küçük ziyaretçi verisi kullanan kontrollü bir başlangıç için kaynak açısından uygun olabilir. 3.000 veya 5.000 ziyaret/gün tek başına Pro zorunluluğu değildir. Ancak bu çalışma mevcut sürüme genel canlı yayın onayı vermiyor.**

Temel sınır: 3300 gastronomi görünümü `GASTRONOMY_LOCAL_PREVIEW=1` ve loopback koşuluyla açılıyor; seçilmiş dört mekan yerel araştırma dosyalarından geliyor. Bulut ziyaretçi veri akışı henüz bağlanmış değil. Loopback dışındaki ana sayfa halen legacy otel yoluna düşüyor. Bu kontrol kaldırılmadı. Dolayısıyla yereldeki sıfır Supabase çağrısı, üretimde Supabase'e bağlı sitenin kapasite testi değildir. Eski otel/makale URL'lerinin üretim trafiği, organizasyonun diğer projeleri ve güncel fatura dönemi egress sayacı bu ölçüme dahil değildir; toplam kalan kota hesap erişimi olmadan doğrulanamadı. Kalıcı yönetici yetkilendirmesi ve önceki ürün yayın koşulları ayrıca sürüyor.

## Free kaynakları ve mevcut boyut

Resmî Free kapsamı: 500 MB DB, 1 GB dosya saklama, 5 GB uncached + ayrı 5 GB cached egress, 50.000 Auth MAU. Normal girişsiz ziyaretçiyi Supabase Auth oturumuna çevirmediğimiz sürece ziyaret sayısı Auth MAU sayısı değildir. Pro başlangıcı $25/ay; abonelik başlatılmadı. [Supabase pricing](https://supabase.com/pricing), [egress açıklaması](https://supabase.com/docs/guides/platform/manage-your-usage/egress).

Boyutlar tek sınırlı READ ONLY envanter sorgusunda alındı; sonda ayrı metadata kontrolüyle 42 engelin sürdüğü ve anon/authenticated rollerinin tablo sahipliğinden RLS bypass yapamadığı doğrulandı:

| Kaynak | Gerçek değer | Free payı, yaklaşık |
|---|---:|---:|
| Veritabanı | 18.205.843 bayt (18,2 MB) | %3,6 |
| Storage | 662.804.194 bayt (662,8 MB), 358 nesne | %66,3 |

Oranlar ondalık MB/GB kullanır ve diğer organizasyon projelerinin kullanımını kapsamaz. 4,9 MB mantıksal dump dosyası ile DB'nin 18,2 MB disk kullanımı aynı ölçü değildir. Eski Storage dosyaları silinmedi veya taşınmadı.

Nano Free için resmî sınırlar 60 direct DB connection, 200 pooler client, varsayılan pool 15. **300 ziyaretçi, 300 doğrudan DB bağlantısı demek değildir.** HTTP/PostgREST/uygulama cache katmanları araya girer. Micro Pro'ya geçmek de direct/pooler limitini otomatik olarak büyütmez; aynı 60/200 sınırları vardır. [Compute tablosu](https://supabase.com/docs/guides/platform/compute-and-disk).

## Gerçek sayfa akışında sorgu ve transfer

390 px mobil Chrome, temiz geçici profil, production Next build, localhost bağlantısı. Sunucu dış servis guard'ı ve tarayıcı istek kaydı birlikte izlendi. İki katmanda da Supabase/Google isteği veya engellenmiş dış çağrı **0**. Yerel Supabase dummy portuna olası çağrıları da final 3300 guard'ı engeller/kaydeder.

| Akış | Supabase sorgusu / yanıt KB | Places çağrısı | Uygulama hostundan transfer |
|---|---:|---:|---:|
| Ana sayfa, soğuk | 0 / 0 KB | 0 | 655,4 KB |
| Moda → Kahve seçimi | 0 / 0 KB | 0 | 8,3 KB |
| Story detayını açma | 0 / 0 KB | 0 | 0 KB; mevcut tarayıcı verisi |
| Liste sıcak yeniden yükleme | 0 / 0 KB | 0 | 17,7 KB; 30 kaynak olayı, yalnız 2 gerçek ağ transferi |

Soğuk ana sayfa TTFB 143 ms, DOMContentLoaded 186 ms; detail dialog UI-ready 26 ms. Ölçümdeki network-idle beklemeleri açılış süresi diye sunulmadı; bunlar ayrıca 500 ms sessizlik içeriyor. Bunlar yerel ağ/makine değerleri, mobil hücresel ağ garantisi değil.

Tam ilk ziyaret yaklaşık **663,7 KB** uygulama/CDN trafiği. Scriptler yaklaşık 427 KB, fontlar 166 KB, görseller 8,5 KB. Baskın maliyet Supabase değil JS/font aktarımı. Her ziyaretin tamamen soğuk olduğunu varsayarsak 3.000/gün için ~59,7 GB, 5.000/gün için ~99,5 GB/ay uygulama hostu trafiği oluşabilir; **Supabase egress'i değildir** ve hosting bütçesi ayrıca izlenmelidir.

## 3.000 / 5.000 günlük ziyaret için aylık hesap

30 gün; KB=1.000, GB=1.000.000.000 bayt. Formül: günlük ziyaret × 30 × ziyaret başına Supabase yanıt baytı. Aşağıdaki 10/50/100 KB satırları **gelecekteki bulut bağlantısı için varsayımlardır**, ölçülmüş Supabase yanıtı değildir.

| Ziyaret başına Supabase aktarımı | 3.000/gün (90.000/ay) | 5.000/gün (150.000/ay) |
|---|---:|---:|
| Bugünkü yerel Moda akışı: 0 KB | 0 GB | 0 GB |
| Varsayım: 10 KB | 0,90 GB | 1,50 GB |
| Varsayım: 50 KB | 4,50 GB | 7,50 GB |
| Varsayım: 100 KB | 9,00 GB | 15,00 GB |

Bugünkü dört mekanın gerçek ziyaretçi DTO'su 2.337 bayt JSON / 722 bayt gzip. Gelecekte her ziyarette yalnız aynı boyutta tek origin yanıtı alınsaydı ham JSON hesabı 0,210 / 0,351 GB/ay olurdu. Bu **Supabase yanıt ölçümü değildir**; SQL/REST endpoint'i aynı veri şekliyle henüz yayında değildir. Çok sayfa/yeniden deneme/yanıt başlıkları/backuplar/diğer trafik bütçeyi artırır.

Sıradan dört adet 100 KB Storage görseli her ziyarette çekilse 36 / 60 GB/ay eder. CDN hit olması Supabase trafiğini ücretsiz/sınırsız yapmaz: cached ve uncached kotalar ayrıdır. İkisi gerektiğinde ayrı hesaplanmalıdır. Bizim pilot illüstrasyonları Supabase'den çekilmiyor.

## Güvenli yerel 50 / 100 / 300 değerlendirmesi

8 CPU thread, 8 GB RAM'li Mac; tüm dış servisler kapalı. Her seviyede eşzamanlı bir HTTP SSR istek dalgası. 20 sn timeout ve 1.400 MiB bellek durdurma sınırı; sınır tetiklenmedi. Bunlar 300 tam Chrome oturumu veya Supabase Nano donanım testi değil. Sürekli soak/dağıtık reklam yükü testi yapılmadı; p95 değerleri bu sınırlı dalgaların örneklemidir.

| Eşzamanlı istek | Başarılı / hata | p50 | p95 | Next sunucu peak RAM |
|---|---:|---:|---:|---:|
| 50 | 50 / 0 | 217 ms | 225 ms | 169 MiB |
| 100 | 100 / 0 | 284 ms | 363 ms | 214 MiB |
| 300 | 300 / 0 | 611 ms | 1.026 ms | 422 MiB |

Önceki yöntemde 50 istek p95 **4.804 ms** idi; aynı yerel akışta kısa süreli DTO cache ile **225 ms**. Yaklaşık 21 kat iyileşme, bu örneklem için. Soğuk/revizyon değişmiş cache'de ilk istek yeniden kaynak okur; process bazlı cache, CDN veya paylaşılan serverless cache değildir. Daha fazla Node instance'ı cache miss sayısını artırabilir.

Darboğaz: önceden her SSR isteği tüm keşif/kanıt kataloğunu tekrar değerlendiriyordu. Cache sonrası SSR/React serileştirmesi, gzip ve ön yüzde JS/font aktarımı öne çıkıyor. Supabase Pro bu Next.js darboğazlarını doğrudan çözmez.

## Uygulanan yerel iyileştirmeler

- Yalnız ziyaretçiye izin verilen DTO için 30 saniyelik, en fazla 4 girdili, process bazlı cache. Eşzamanlı miss'ler tek okuma paylaşır; hatalar cache'de tutulmaz. Dönüşler kopyalanır.
- Manuel karar ve araştırma dosyalarının inode/mtime/ctime/boyut bilgileri cache anahtarına katılır. Sonraki istekte değişiklik fark edilir; açık tarayıcı oturumu için yeni canlı güncelleme özelliği eklenmedi. Admin/araştırma çıktısı cache'e konulmaz.
- Gelecekte lisanslı Google puanı taşıyan sonuçlar kalıcı process cache'inde tutulmaz. Ziyaretçi akışı Google araması/Details çağrısı tetiklemez. Mevcut onay/kredi guard'ları korundu; 10 offline Google kontrolü geçti, gerçek ücretli çağrı yapılmadı.
- Temsili SVG'ler uygulamanın kendi `/images/gastronomy/` yolunda. `public, max-age=86400, stale-while-revalidate=604800` tarayıcı cache'i HTTP'de doğrulandı. Gerçek fotoğraf indirip kopyalama yapılmadı; Storage ve fotoğraf hakları kayıtları korundu.
- HTML/admin yanıtları için kontrolsüz public CDN cache eklenmedi. Korumalı staging'de SVG isteği dahil 401/no-store testi geçti.

## 45 PERMISSIVE + 42 RESTRICTIVE — gerçek davranış testi

**42 engel, daha önce kullanıcının açık onayıyla YeriniAyir PRODUCTION projesine (`jerkkxwgddujigsbeqwo`, main) uygulanmıştı. Staging'e uygulanmış sanılmamalıdır.** Bu görevde production'da yalnız iki kısa salt okunur kontrol yapıldı: boyut/politika envanteri ve son politika/tablo sahipliği doğrulaması; engel kaldırılmadı/değiştirilmedi.

Güncel production snapshot'ındaki 87 politika tanımı, gerçek müşteri satırları alınmadan ayrı yerel PostgreSQL 17'ye kuruldu. Önce gerçek 45 eski tanım ile örnek restaurants INSERT'inin çalıştığı gösterildi. Sonra production'dan kopyalanan 42 engel eklendi ve tüm 87 kural birlikte sınandı.

PostgreSQL kuralı: ilgili komut için uygulanabilir PERMISSIVE ifadeler OR; RESTRICTIVE ifadeler AND ile birleştirilir. Sonuç bunların AND'idir. `(... OR ...) AND false` yazmayı engeller; eski bir `USING(true)` yeni RESTRICTIVE false'u aşamaz. Yeni kurallar SELECT için tanımlı değildir. Production son kontrolünde anon/authenticated için hedef tablo sahipliği üzerinden bypass olmadığı da doğrulandı. [PostgreSQL CREATE POLICY](https://www.postgresql.org/docs/17/sql-createpolicy.html).

**288 kontrol başarılı:** anon, authenticated, authenticated üyesi yetkisiz rol ve DB rolünü değiştirmeyen sahte admin-claim senaryosu. 14 tabloda INSERT RLS hatasıyla reddedildi; UPDATE/DELETE gerçekten çalıştırılıp RETURNING ile **0 satır** etkilediği ve örnek kayıtların değişmediği doğrulandı. Storage'da hotel-images/hotel-videos/images kapsamları ayrı denendi. Önceki SELECT satır sayıları korundu.

Bu gerçek SQL denemeleri **yalnız yerel sentetik veride** yapıldı. Production'da test INSERT/UPDATE/DELETE, rollback veya restore yapılmadı. Superuser, tablo sahibi ve service-role bypass yolları bu istemci engelinin güvenlik garantisine dahil değildir; kalıcı sunucu/admin yetkilendirmesi gerekir. Geçici engel o çalışma tamamlanmadan kaldırılmayacak. Yedekler korundu.

## Pro'ya geçiş eşiği

Ziyaretçi sayısından bağımsız olarak önerdiğimiz operasyon bütçesi: cached veya uncached kaleminin **aylık tahmini 4 GB'a** ulaşması (%20 pay); DB **400 MB**, Storage **800 MB** yaklaşması; gerçek bulut ölçümünde kalıcı yüksek API gecikmesi/429/5xx veya kaynak baskısı; otomatik günlük yedek ve daha güçlü destek ihtiyacı. Bunlar bizim erken uyarı eşiklerimiz, Supabase'in resmî limit/SLA'sı değildir.

5.000/günde 4 GB bütçe için ortalama Supabase aktarımı **26,7 KB/ziyaret**, 3.000/günde **44,4 KB/ziyaret** altında hedeflenmeli; diğer proje/backup trafiği için ayrıca pay bırakılmalı. Örnek 50 KB/ziyarette 3.000/gün 4,5 GB ile payı tüketir; 5.000/gün 7,5 GB ile kotayı aşar. Bu modelde reklam büyütmeden Pro planlanmalı. Küçük cache'li metadata + uygulama hostunda illüstrasyonlarla 5.000/gün matematiksel olarak Free'ye sığabilir; henüz bulut yük testiyle kanıtlanmış değildir.

Öneri: Free ile sınırlı pilot, bulut ziyaretçi akışı bağlanınca gerçek egress/query ölçümü, reklamları kademeli artırma. Beklenen ani talep için yalnız Pro satın almak yerine CDN/veri cache'i ve doğru bağlantı yönetimi gerekir. Bu görevde ücretli plan açılmadı.

## Kontroller ve önizleme

Build, TypeScript, lint başarılı (mevcut uyarılar kaldı, hata yok). 8 cache kontrol grubu; 288 politika birleşim kontrolü; 48 auth; 10 offline Google; 13 mobil/masaüstü tarayıcı; 5 ürün/yönetici raporu; 3 kayıt koruma; staging koruma kontrolleri geçti. Dört gerçek mekan, tasarım, ürün sınıfları ve manuel kayıtlar korundu.

Güncel önizleme: http://127.0.0.1:3300/tr?region=moda&category=kahve . Bulut staging kurulmuş/deploy edilmiş veya production sitede bu cache değişikliği yayınlanmış değildir.
