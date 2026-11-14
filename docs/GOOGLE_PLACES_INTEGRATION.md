# Resmî Google puanları — yerel ve pasif entegrasyon

30 Ekim 2026. Yalnız `feat/codex-development`, Moda kahve seçkisi. Mevcut seçki, kaynaklar ve manuel kararlar değiştirilmez.

## Gerçek erişim kontrolü

- Sunucu ortamında `GOOGLE_PLACES_API_KEY` veya `GOOGLE_MAPS_API_KEY` bulunmadı. Anahtar değerleri okunarak raporlanmaz.
- Google servis hesabı OAuth kimlik doğrulamasını geçiyor. Bu sonuç Places erişimi değildir.
- Salt okunur Service Usage ve Cloud Billing metadata istekleri 403 döndü. API etkinliği ve faturalandırma **doğrulanamadı**; kapalı olduğu iddia edilmiyor.
- Gerçek Places araması/Details isteği: **0**. Gerçek doğrulanmış puan: **0/4**. Place ID henüz eşleştirilmedi. Testlerdeki puanlar yalnız izole fixture'dır.
- Gizli değer içermeyen erişim özeti: ignored `work/google-places/environment-check.json`.

## Şube eşleştirmesi

Çekirdek (Şair Latifi 9/A), Story (Dalga 22), Guten Morgen (Fırıldak 19/B), Montag (Bademaltı 22/A) mevcut kartların kendi ad/adres/OSM koordinatlarıyla aranır. İsim benzerliği yeterli değildir: marka, sokak, kapı ve varsa birim, Kadıköy/İstanbul, 50 metre yakınlık, kahve kategorisi ve OPERATIONAL birlikte aranır. Birden çok uyumlu sonuç, eksik birim veya çelişki halinde puan gizlenir. Konum toleransı yürüyüş mesafesi değildir. Bu muhafazakâr eşik gerçek şubeyi kaçırabilir; başka şube ile doldurmaz.

Text Search (New) yalnız kimlik alanlarını ister; benzersiz eşleşmeden sonra Details aynı kimliği yeniden doğrular ve `rating`, `userRatingCount`, `googleMapsUri`, `attributions` alır. Reviews/photos istenmez. Kalıcı pinin kimliği her Details cevabında yeniden doğrulanır; 12 aydan eski pin yeniden aranır. Saklanan pinlerin güvenli olması için mevcut yerel adres/koordinat parmak izi de eşleşmelidir.

Puan ve yorum sayısı dönüştürülmez/yuvarlanmaz. Türkçe ondalık virgül yalnız gösterim biçimidir. İkisinden biri eksikse ikisi de gizlenir. Resmî puan kalite seçimini veya sıralamayı değiştirmez.

## İzin, maliyet ve güvenlik

Yerel yönetici kimlik doğrulaması, localhost, aynı origin, sunucuda ayrı harcama izni ve API anahtarı birlikte gerekir. GET yalnız durum okur; sayfa açılışı Google isteği başlatmaz. POST tarayıcıdan hedef, anahtar veya onay kabul etmez. Üretim ve Vercel ortamları kapalıdır.

Şu anda harcama izni yoktur; `approval.json` üretilmemiştir. Gelecekte açık kullanıcı izninden sonra sunucuda oluşturulacak izin en fazla bir saat ve yalnız mevcut dört kartın parmak izleri için geçerlidir. İş başına toplam en fazla 8 istek (4 Text Search + 4 Details), kalıcı sayaç ve tek işlem kilidi vardır. Gönderimden önce sayaç ayrılır; timeout/403/429/redirect otomatik tekrar edilmez, kalan işler durur. Kesin olmayan istekler de bütçeden düşülür. Yeni izin kullanıcıdan ayrıca alınır; yeniden çalıştırma yeni bütçe yaratmaz. Yerel ağ koruması henüz Places alan adına izin vermiyor; açık harcama izni alınmadan açılmayacak.

30 Ekim 2026 fiyat tablosuna göre Text Search Pro ilk ücretsiz aylık sınırı 5.000, ilk ücretli dilimi $32/1.000; Place Details Enterprise (rating/count alanları) ücretsiz sınırı 1.000, ilk ücretli dilimi $20/1.000. Ücretsiz kota kalmamışsa ilk 8 istek yaklaşık **$0,208 + vergi** olabilir. Kotanın projede kaldığı doğrulanmadı; ücretsiz çalışacağı taahhüt edilmez. Bulut bütçe uyarıları tek başına kesin harcama kesicisi değildir; uygulama limiti ayrıca uygulanır. Abonelik, API aktivasyonu ve faturalandırma değişikliği yapılmadı.

## Gösterim ve saklama

Google içerikleri sunucu belleğinde cevap süresince ve tarayıcıda mevcut görünüm süresince tutulur. Puan, yorum sayısı, Google adı/adresi/koordinatı; log, veritabanı, localStorage veya kalıcı cache'e yazılmaz. HTTP private/no-store. Ignored `work/google-places/place-ids.json` yalnız saklanmasına izin verilen Place ID, uygulamaya ait eşleştirme parmak izi/tarih ve istek muhasebesini tutar. Google cevapları veya anahtarlar test çıktısına/CLI çıktısına yazılmaz.

Google verisi haritasız, kendi çerçevesinde exact `Google Maps` atfıyla (translate=no, normal font, 12px, gri, nowrap), Google Maps bağlantısıyla ve cevaptaki tüm üçüncü taraf atıflarıyla gösterilir. OSM haritasına bindirilmez. Atıf güvenli biçimde gösterilemiyorsa puan gizlenir. Ekranda Google koşulları ve gizlilik bağlantıları vardır. Herkese açık yayından önce uygulamanın erişilebilir Terms/Privacy belgelerinin Google hükümleriyle bütünlüğü, faturalandırma adresine göre EEA şartları ve güncel Google koşulları ayrıca doğrulanmalıdır. Bu pilot yalnız korumalı yerel geliştirmedir; canlı yayın izni değildir.

## Kullanıcının tamamlaması gereken minimum adım

Google Cloud Console'da uygun projede **Places API (New)** etkinliği/faturalandırma ve sunucu kullanımına kısıtlanmış API anahtarı gerekir. Mevcut OAuth bağlantısı bunun yerine geçmez. Anahtar sohbete gönderilmez; hazır olduğunda ajan yerel maskeli giriş ile ignored `.env.local` içine güvenle bağlar. Konsol hesap yetkisi yoksa kullanıcının bu hesap adımını yapması gerekir. API etkinleştirmek, billing bağlamak veya ilk en fazla 8 isteği çalıştırmak için ayrıca açık izin alınır. Terminal veya dosya düzenleme gerekmez.

## Doğrulama

`verify_google_places.cjs`: izole sahte fetch ile şube belirsizliği, yanlış adres/konum, kapalı işletme, eksik puan, onay/anahtar eksikliği, 8 istek sınırı, ID saklama ve engellerde tekrar yapmama.
`verify_google_places_api.cjs`: bağımsız auth, aynı origin, localhost, production engeli, istemciden izin/hedef/anahtar geçirememe ve salt okunur GET.
Tarayıcı testi gerçek yerel durumu (anahtar yok, 0 çağrı, 4 puan alanı gizli, mevcut kartlar korunmuş) kontrol eder. Bunlar gerçek Google puanı doğrulaması olarak sayılmaz.

## Resmî kaynaklar

- https://developers.google.com/maps/documentation/places/web-service/policies
- https://developers.google.com/maps/documentation/places/web-service/place-id
- https://developers.google.com/maps/documentation/places/web-service/data-fields
- https://developers.google.com/maps/billing-and-pricing/pricing
- https://developers.google.com/maps/documentation/places/web-service/get-api-key

## İlk canlı bağlantı testi — 30 Ekim 2026, 21:07–21:10 Türkiye

Kullanıcı yeni anahtarı kendisi oluşturup yalnız Places API (New) ve 212.253.223.209 dış IPv4 adresine kısıtladığını bildirdi. Hesap/tarayıcı kontrol yetkisi geri çekildi; sonraki işlemler yalnız yerel ortamda yapıldı. Yeni anahtar native maskeli yerel girişle `.env.local` içine 0600 izinle kaydedildi. Kullanıcı en fazla 8 sorgu, yaklaşık $0,21 + vergi tahminiyle ilk teste açık onay verdi.

İlk Çekirdek araması native fetch/çift yığın bağlantısında `403 API_KEY_IP_ADDRESS_BLOCKED` döndü; diğer istekler durduruldu. Kısıtlama kaldırılmadı. Yalnız Google Places alan adına giden, TLS doğrulamasını koruyan ve `family:4` kullanan sunucu taşıması eklendi; yönlendirme/proxy/otomatik tekrar yok. İlk başarısız işletmenin sorgusu yinelenmedi. Story, Guten Morgen ve Montag aramaları IPv4 taşımasıyla HTTP 200 döndü. Üç yanıtta da katı şube kimliği filtresi geçmedi; hiçbir puan veya yorum sayısı gösterilmedi. Bu başarısızlığın tekil adres/isim alanı sebebi kaydedilmedi; tahminle kimlik doğrulaması yapılmayacak.

Gerçek toplam: 4 arama isteği (1 engelli, 3 başarılı), 0 Details isteği, 0/4 doğrulanmış puan. Başarılı HTTP erişimi doğru şube doğrulaması değildir. Kalan izin 4 istektir; 4 arama+4 Details planını genişleten yeni araştırma için ayrıca izin alınmalıdır. Yeni harcama izni otomatik oluşturulmaz. Google puanları/yanıt adresleri diske yazılmadı; metadata makbuzları ve istek defteri ignored `work/google-places` içindedir. Deneme kredisi/hesap tüketimi bu oturumda okunmadığı için gerçek net ücret doğrulanmadı. Eski Google Cloud proje metadata yetki sorunu Places anahtarıyla giderilmiş sayılmaz; iki kimlik ayrı tutulur.

## 31 Ekim 2026 — IP düzeltmesinden sonraki onaylı test

Önceki 8 istek onayındaki ilk arama IP kısıtı nedeniyle durdu. Kullanıcı yeni dış IPv4 adresini Cloud anahtarına eklediğini bildirdi; sonraki üç arama ve üç detay başarılı HTTP yanıtı aldı. Ad/kapı biçimi nedeniyle eşleşmeler başlangıçta geçmedi. İşletme adındaki açıklayıcı ekleri ayrı token olarak değerlendirme ve `No:22`/`22` biçim eşitliği düzeltildi; bilinen bağımsız bölüm ve farklı kapı numarası kontrolleri korunuyor.

Kullanıcı ayrıca tek ek aramaya onay vererek toplam sınırı 9 isteğe yükseltti. Bu ek arama Çekirdek için aday ID verdi ancak isim eşleşmedi. Kalan son detay hakkı, adres biçimi düzeltmesini Story üzerinde elle yeniden doğrulamak için kullanıldı. Story Dalga şubesi bütün kimlik/adres/mesafe/faaliyet kontrollerini geçti ve gerçek API puanı alındı. Değer sadece o yanıtın sunumunda gösterildi; Google rating/count/adres içerikleri diske kaydedilmedi. Saklanan kayıtlar yalnız Place ID, uygulamaya ait parmak izi ve istek/başarı/hata metadata'sıdır.

Toplam: 5 arama (ilk IP engeli dahil), 4 detay = **9 istek**, **1/4 gerçek puan doğrulaması**. Ücretsiz kota kalmadığı varsayımıyla önceden onaylanan yaklaşık 0,24 USD + vergi; hesap ekstresi okunmadı, gerçek tahakkuk doğrulanmadı. Tek seferlik runner'lar giriş makbuzlarıyla tekrar çalışmayı reddeder. Bu onay yeni sorgulara veya ziyaretçi başına otomatik sorgulamaya genişletilmez.

Diğer üç işletmenin puanı henüz doğrulanmadı. Çekirdek adayının adı, Guten Morgen bağımsız bölüm bilgisi ve Montag'ın düzeltilmiş adres formatıyla tekrar teyidi çözülmeli. Aynı Google değerini dosyaya yazıp tüm ziyaretçilere dağıtan bir yayın uygulanmadı. Mevcut 3300 ziyaretçi adaptörü canlı Places verisi almadığından puan alanları hâlâ boş; API başarısı tam UI entegrasyonu diye raporlanmaz. Ziyaretçi başına maliyetli çağrı, keyfi süreyle puan önbelleklemesi veya eski puanı güncel gibi sunma açılmadı. Yeni ücretli istek için yeni açık onay gerekir.

## 31 Ekim 2026 — Üç ek Details onayı, toplam 12 istek

Kullanıcı kalan üç şubenin aday Place ID'leri için en fazla üç ek detay sorgusuna açık onay verdi. Aynı test serisinin toplam sınırı 12, ücretsiz kota yoksa tahmini toplam 0,30 USD + vergi. Üç sorgu çalıştı: Çekirdek Şair Latifi ve Montag Moda tüm şube kontrollerini geçerek gerçek API puanı doğrulandı. Story önceki son detay çağrısında doğrulanmıştı. Guten Morgen kapı/bağımsız bölüm kontrolünden geçmedi; puanı gösterilmedi. **3/4 şube doğrulanmış; toplam 5 arama + 7 detay = 12 istek.** Gerçek fatura/ücretsiz kota tüketimi okunmadı.

Puan/yorum sayısı ve ham Google yanıtları diske kaydedilmedi. Yerel metadata makbuzu `work/google-places/three-details-consent12.json`; eşleşen Place ID'leri ve uygulama parmak izleri ayrı store'da. Sunumda gerçek değerler yalnız alınan yanıt kapsamında bildirildi. Birden fazla yerel runner'ın aynı onay sayacını aşarak harcama yaratmaması için sayaç korundu; salt okunur setup kontrolünün tüketilmiş onayı “ready” göstermesi de engellendi.

Bu sonuç sürdürülebilir ziyaretçi entegrasyonunun tamamlandığı anlamına gelmez: mevcut 3300 DTO'su otomatik Places çağrısı başlatmaz ve puanı uydurmaz. Her yeni sayfa açılışında ücretli sorgu veya Google puanlarını süresiz dosyaya yazma etkin değil. Bir sonraki gerekli işler Guten Morgen'in bağımsız bölümünü birincil şube kaynağı/Place ID üzerinden çözmek ve ziyaretçi sunumu için ayrıca onaylanmış bütçe, sağlayıcı şartlarına uygun istek/bellek yaşam döngüsü belirlemek. Önceki test onayları periyodik/ziyaretçi başına harcama yetkisi değildir. Yeni ücretli istek gönderilmedi.
