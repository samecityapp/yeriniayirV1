# PRODUCT DECISIONS — YERİNİ AYIR ÜRÜN KARARLARI KÜTÜPHANESİ

Bu belgede, Yerini Ayır projesinde kesinleşmiş olan ürün, algoritma ve UX kararları yer almaktadır.

---

## 1. Kesinleşmiş Ürün ve Algoritma Kararları

1. **Bölge Başına Maksimum 7 Gastronomi Kategorisi:**
   - Bir semt veya bölgede sonsuz kategori listelenemez.
   - Her bölge en fazla 7 kategori slotu barındırabilir.
   - **Kural #1:** İlk sırada daima **"Mutlaka Denenmesi Gerekenler"** yer alır (kategoriler üstü semt klasikleri).
   - Kalan 6 kategori bölgenin gastronomik kimliğine göre özel seçilir (örneğin Moda için: 3. Nesil Kahve, Kruvasan/Brunch, Yeni Nesil Meyhane, Burger/Sokak Lezzeti, Çarşı Esnafı, Butik Dondurma).

2. **Yapay Birleşik Puanların Yasaklanması:**
   - 94.2 / 91.6 / 88.9 gibi yüzdelik birleşik skorlar kullanılmaz.
   - Bunun yerine 3 ayrı bağımsız boyut kullanılır:
     - **Ürün Kalitesi Bulguları:** Kendi kavurması, çekirdek izlenebilirliği, demleme standardı.
     - **Kanıt Güvenilirliği:** Bağımsız kaynak sayısı, 1. parti kayıtlar, tekilleştirilmiş bloglar, tarih tazeliği.
     - **Ziyaretçi Uygunluğu:** Hızlı kahve molası mı, uzun oturum mu, laptop/çalışma uygunluğu mu.

3. **Google Puanı Tek Başına Seçim Ölçütü Olamaz:**
   - Turistik yığılmalar, konum avantajı veya tatlı ikramları Google puanını yapay olarak yükseltebilir.
   - Seçim için bağımsız uzman rehberler (Barista Magazine, European Coffee Trip, yerel saygın gastronomi yazarları) esastır.
   - Google puanı yalnızca taban sinyali olarak izlenir, ham veri depolanmaz.

4. **Doğru Fiziksel Şube ve Rota Doğrulaması:**
   - Zincirleşmiş veya çok şubeli markaların doğru şubesi belirtilmelidir (Örn: Montag'ın Kadıköy Çarşı şubesi ile Moda Bademaltı şubesi ayrılmıştır).
   - Yürüme mesafeleri tahmini değil, OpenStreetMap/OSRM yaya profili üzerinden sokak sokak doğrulanmış değerlerdir.

5. **Tam Otonom Araştırma ve Seçim — 29 Ekim 2026 ürün kararı:**
   - Önceki işletme başına yönetici onayı zorunluluğu kaldırılmıştır.
   - Sistem işletmeleri keşfeder, araştırır, kanıtlarını değerlendirir ve kanıt standardını sağlayan 3–5 işletmeyi rutin onay istemeden seçer.
   - Yeterli kanıt yoksa sayı tamamlanmaz; 0–2 uygun aday da olsa gerçek sonuç korunur. Eksikler otomatik Ek Araştırma havuzuna gider.
   - Kahve, hamburger, pizza, kahvaltı, yöresel lezzetler ve bölgeye uygun diğer kategoriler aynı seçim/yayın sözleşmesini kullanır.
   - Yiyecek çeşitliliği veya düşük görünürlük tek başına eleme nedeni değildir. Yapay birleşik puan kullanılmaz.

6. **Kategori İhlalinde Zorlama Listeleme Yapılamaz:**
   - Bir mekan kaliteli olsa bile o kategorinin ana uzmanlığını taşımıyorsa (Örn: Rafine Moda'nın kahve yerine brunch/fine cuisine mutfağına evrilmesi) sırf 3'e tamamlamak için listede tutulamaz; doğru kategoriye kaydırılır.

---

## 2. Restoran Detay Penceresi (Planlanan 5 Bölümlü Mimari)

Kullanıcının restoran kartına tıkladığında göreceği modalın 5 temel bölümü:

1. **Ne Sipariş Etmeli? (İmza Lezzet)**
   - Mekanın en güçlü, tescilli ve denenmesi gereken somut içeceği/yemeği.
2. **Neden Gitmeli? (Seçim Gerekçesi)**
   - Nitelikli kavurma, zanaatkâr üretim, köklü mahalle geçmişi gibi kanıtlanmış nedenler.
3. **Sana Uygun mu? (Ziyaretçi Filtresi)**
   - Hızlı kahve molası arayanlar için mi, yoksa saatlerce arkadaşıyla oturmak isteyenler için mi?
4. **Ayrıca Bunları da Dene (Yan Uzmanlıklar)**
   - Ana kahve odağının dışındaki sürpriz ürünler (Örn: Story'nin tarçınlı rulosu, Çekirdek'in ev yapımı tartları).
5. **Gitmeden Bil (Kritik İpuçları)**
   - Dar alan uyarısı, laptop yasağı/uygunluğu, şube ayrımı gibi sürpriz yaşamayı önleyen bilgiler.

---

## 3. Henüz Kesinleşmemiş / Geliştirme Aşamasındaki Konular

- **Yeniden Değerlendirme Sıklığı:** Haftalık kontrol kararı alınmıştır (bölüm 4). Adaptör ve kaynak kotaları doğrultusunda kaynak başına tarama sıklığı ayrıca sınırlanabilir.
- **Dinamik Rota Origin Noktası:** Şu an referans başlangıç noktası Moda İlkokulu / Tramvay kesişimidir; gelecekte kullanıcının anlık konumuna göre dinamik rota hesaplama planlanmaktadır.


## 4. Otonom Gastronomi Yönetimi ve Yayın Politikası — 29 Ekim 2026

Bu bölüm önceki devir belgelerindeki tek tek onay bekleme ve sabit ilk üç yaklaşımının yerine geçer.

- Ana yönetici deneyimi **AI Gastronomi Yönetimi**: otomatik seçki, kanıt ve gerekçeler, ek araştırma havuzu, manuel müdahaleler, geçmiş, çelişkiler ve uyarılar.
- Manuel ekleme, çıkarma ve sıralama bölge/kategori bazındadır. Çıkarma kararı açıkça kaldırılana kadar otomatik çalışmalarda korunur. Manuel eklenen kayıt sonraki çalışmada silinmez; kapanış veya önemli kimlik/kanıt sorunu varsa uyarı alır. Ekleme, kalite standardını aşan bir yayın izni değildir.
- Otomatik seçim, manuel ekleme/çıkarma/sıralama, kategori düzenlemesi, yayın ve geri alma işlemleri aktör, zaman, kanıt referansları ve gerekçeyle kalıcı kaydedilir. Geri alma geçmişi silmez; yeni bir olay oluşturur. Daha sonraki çelişen değişikliği sessizce ezmez.
- Seçki otomatik yenilendiğinde mevcut manuel kararlar tekrar uygulanır. Kategori sınırı bölge başına 7; ilk slot **Mutlaka Denenmesi Gerekenler**.
- Yayın için doğru fiziksel şube, kategoriye uygun somut ürün kanıtı, birbirinden bağımsız ve tarihli kaynaklar, güncel faaliyet/kimlik teyidi ve açık çelişkilerin çözülmesi gerekir. İşletme menüsü, marka anlatısı, eski yayın veya kaynağa yeni erişim tek başına güncel kalite kanıtı değildir.
- İlk teknik politika: son 365 gün içinde iki ayrı bağımsız yayın ailesinin açık şube/ürün kanıtı; bunlardan en az birinde son 180 günde tarihli deneyim; son 90 günde şube kapsamlı işletme faaliyet beyanı ve doğrulanmış adres/konum; engelleyici açık çelişki olmaması. Bu eşikler ürün standardının ilk sürümüdür, toplam puan değildir.
- İşletmeler haftalık yeniden değerlendirme kuyruğuna alınır. Kaynaklar tazelenmeden eski notlar yeni deneyim sayılmaz. Kimlik, faaliyet veya kalite kanıtı süresi dolduğunda otomatik yayında güvenli şekilde beklemeye alınır; manuel ekleme kaydı silinmez.
- Otomatik yayın teknik olarak desteklenecek ve önce yalnızca yerel geliştirme koleksiyonunda test edilecektir. **Mevcut canlı sitede/üretim veritabanında otomatik yayın kapalıdır. İlk canlı etkinleştirme ayrıca kullanıcı izni gerektirir.** Bu görev bu izni vermez.
- Ücretli API/LLM aboneliği, üretim şifresi/anahtarı değişikliği, push ve deployment bu çalışma kapsamında yapılmaz.

## 5. Bağımsız AI Kalite Denetçisi — 30 Ekim 2026

- Araştırma/seçim motorundan ayrı bir denetim katmanı kurulur. İlk seçim ve eski kaynak notları doğruluk kabulü değil, kontrol edilecek girdilerdir.
- **Bölgeyi Kontrol Et** il/ilçe/semt ve kategori kapsamıyla iş planlar. İl işleri ilçelere, büyük ilçe işleri mahalle/semt parçalarına ayrılır. Türkiye tek bir istekte taranmaz. İlk çalıştırılabilir pilot yalnızca Moda–Kadıköy kahvedir; Türkiye taraması başlatılmaz.
- Denetim faaliyet, fiziksel şube/adres/konum, kategori, ürün iddiaları, kaynak kökeni ve tarihlerini ayrı ayrı değerlendirir. Aynı kaynağın yeniden okunması yeni bağımsız yayın veya yeni müşteri deneyimi sayılmaz.
- Mevcut listede bulunmayan adaylar da sınırlı bir yeniden keşif sorgusuyla araştırılır. Keşfedilmek güçlü/kaliteli sayılmak değildir; yeterli bağımsız kanıt yoksa Ek Araştırma durumunda kalır.
- Düşük riskli biçim/yazım düzeltmeleri ancak aynı şube kimliği ve olgusal eşdeğerlik yeterli kanıtla desteklenirse uygulanabilir. Adres taşıma, kapı numarası değişikliği, koordinat taşıma, kapanış, kategori ve ürün/kalite hükümleri belirsizlikte otomatik uygulanmaz.
- Manuel çıkarma, ekleme ve sıra tercihleri denetçi tarafından değiştirilmez. Kapanış/kimlik/güvenlik sinyalleri önemli uyarı olarak ayrıca kaydedilir. Denetçi manuel çıkarılan işletmeyi geri ekleyemez.
- Her işin kaynak/istek/süre bütçesi, sınırlı eşzamanlılık, yeniden deneme sayısı, kontrol geçmişi, son başarılı kontrolü ve kaynak parmak izleri tutulur. Kaynak tazeliği önbellek kullanılarak ileri taşınmaz. Başarısız veya engelli kaynak kesin doğrulama sayılmaz.
- Denetimler ve otomatik düzeltmeler aktör, zaman, gerekçe, önce/sonra değer, alan ve kaynaklarla kalıcı kaydedilir. Geri alma yeni olaydır; sonraki çelişen değişikliği ezmez.
- Periyodik denetim, son başarılı kontrol ve kapsam bazlı takvim üzerinden tasarlanır. İzole pilot dışında otomatik tarama kapalıdır.
- **Canlı sitede otomatik düzeltme ve yayın etkinleştirilmez.** Geliştirme pilotu ayrı denetim dosyası ve düzeltme katmanı kullanır; mevcut araştırma dosyaları, manuel kararlar ve üretim veritabanı değiştirilmez.

### 5.1 Gerçek araştırma başarısının ölçümü — 30 Ekim 2026

- Kaynak olguları doğrulanmış kanıt dosyası, tam güncel kalite/faaliyet doğrulamasından ayrı ölçülür. Eksik alanlar başarıyı sıfırlayıp destekli olguları gizlemez; buna karşılık dosyanın hazır olması işletmeyi otomatik yayımlama standardını düşürmez.
- İlk çalışan kapsam yalnızca Montag Moda, Story Moda, Çekirdek, Guten Morgen ve Coffee Manifesto Moda'dır. Kaynak şube/marka kapsamı, erişim tarihi, yayın/güncelleme tarihi ve bilinmeyen deneyim tarihi ayrı tutulur.
- Harita erişilememesi menü ve bağımsız yayın olgularının işlenmesini durdurmaz. Engellenen bir alan adının diğer yolları denenerek 403/429 aşılmaz.
- Bu oturumdaki web araması ile uygulamanın arama API bağlantısı farklıdır. Mevcut Google servis hesabı bulunmuştur; ücretsiz OAuth testi başarılıdır. Model veya ücretli arama çağrısı bu pilotta yapılmaz. Yeni abonelik başlatılmaz.
- İşlem/maliyet/hata kayıtları ve önceki raporlar yerel araştırma geçmişinde korunur. Mevcut seçki, manuel tercihler ve üretim yayını değiştirilmez.

### 5.2 Opsiyonel arama ve ücretsiz kaynak erişimi pilotu — 30 Ekim 2026

- Tavily yalnız keşif bağlantısı sağlar; özetler otomatik doğrulanmış iddiaya veya kalite hükmüne dönüşmez. Önemli olgular izinli asıl kaynak adaptörleriyle denetlenir; yeni/engelli kaynaklarda haklar ve şube kapsamı çözülmeden iddia üretilmez.
- Anahtar yoksa bağlantı pasiftir. Etkin bağlantı yalnız beş Moda kahve hedefinde, ücretsiz plan/ücretli ek kullanım kapalı kontrolü ve kalıcı bütçe korumasıyla çalışabilir. Yeni abonelik/ücretli kullanım bu pilot kapsamında başlatılmaz.
- Her işletmede işletme-şube-menü olguları, bağımsız deneyim/kalite kanıtı ve doğrulanamayan bilgiler ayrı raporlanır. Ürün adının menüde veya yayında bulunması lezzet kanıtı değildir.
- Eski/yeni yöntem aynı beş adayda karşılaştırılır. Canlı arama yoksa artış ölçülmediği açıkça yazılır; test cevapları gerçek araştırma sonucu gibi sunulmaz. Önceki kanıt ve manuel karar dosyaları korunur.

### 5.3 Canlı ücretsiz bağlantı ve nullable kotalar — 30 Ekim 2026

- Kullanıcının açık isteğiyle Tavily anahtarı gizli yerel girişten bağlandı; yalnız Git dışındaki `.env.local` içinde 0600 izinle saklanır. Anahtar/önek/ham yanıt loglanmaz.
- Sağlayıcının opsiyonel anahtar ve paygo limitleri ücretsiz hesapta `null` dönebilir. `null` sıfır veya ücretli kullanım kapalı kanıtı sayılmaz. Ücretsiz planın sayısal kalan kotası, sıfır paygo tüketimi ve 5/20/200 yerel sınırlar zorunlu kalır; pozitif paygo limiti, ücretli plan veya belirsiz hesap kotası duruş nedenidir. Her işte kalan ücretsiz bakiye yerel tüketimle de azaltılır; eski Usage cevabı tekrar kredi yaratmaz.
- Abonelik/faturalama ayarlarını değiştiren veya ücretsiz bakiye dışında devam eden kod yoktur. Kaynak kullanım kısıtı olan yayınlar yalnız bağlantı olarak tutulur; farklı şubenin kalite anlatısı Moda'ya taşınmaz.

### 5.4 İlk gerçek yerel seçki — 30 Ekim 2026

- Son kullanıcı talimatıyla kesin tarihli yakın dönem tadım, her aday için zorunlu tek geçiş koşulu olmaktan çıkar. Şubeye özgü bağımsız ürün anlatısı, kaynak güvenilirliği, güncellik ve fiziksel kimlik ayrı değerlendirilir; tarihsel anlatı yeni deneyim sayılmaz.
- Ürün anlatısı ve kimlik kanıtı olmayan yalnız menü/popülerlik adayları seçilmez. Marka düzeyindeki ürün kanıtı, ancak fiziksel şube ve operatörün aynı kategori/menü bağı açıkken daha düşük kanıt düzeyinde değerlendirilebilir; bu durum kartta görünür.
- Sıralama bir kalite puanı değildir: önce şubeye özgü bağımsız ürün kanıtı, ardından yayının güncellik sınıfı, bağımsız kaynak çeşitliliği ve eksikler karşılaştırılır. Eşit kanıtta deterministik sıra yalnız sunum içindir; tat üstünlüğü iddiası değildir. Manuel sıra ve dışlama korunur.
- İlk sürüm yalnız geliştirme seçkisidir. Puan, yorum sayısı, fotoğraf ve yürüme süresi doğrulanıp kullanım hakkı uygun değilse null kalır. Yeni model/ücretli API kullanılmaz; Codex araştırma ajanının kaynak okuması ve denetlenebilir deterministik seçim politikası ayrı kaydedilir.

## 30 Ekim 2026 — Google puanları için ayrı ve izinli yerel pilot

Mevcut dört Moda kahvecisinin seçimi/sırası ve manuel kararları korunur. Google puanı seçim kalitesiyle birleştirilmez. Yalnız resmî Places API'den, doğru fiziksel şube Place ID ile muhafazakâr biçimde eşleştirildikten sonra alınan rating/userRatingCount değiştirilmeden gösterilir; eksikte sayı alanı gizlenir. OAuth Places erişimi sayılmaz. API anahtarı veya açık harcama izni eksikse sistem pasiftir. İlk iş en fazla 8 istek, localhost ve yönetici korumasıyla sınırlıdır; sayfa açılışı ücretli istek başlatmaz. Puanlar ve Google içerikleri kalıcı saklanmaz, yalnız izinli Place ID ve uygulama muhasebesi tutulur. Atıf ve kullanım koşulları uygulanır. Üretim, billing/API aktivasyonu ve canlı istek ayrı izin gerektirir. Ayrıntılar: `docs/GOOGLE_PLACES_INTEGRATION.md`.

## 30 Ekim 2026 — Tarafsız ve kısa ziyaretçi içeriği (önceki sunum kararlarının yerine geçer)

- Tüm ziyaretçi kartları ve detaylarında “Neden Gitmeli?” kaldırılır. Övgü, üstünlük iddiası, işletmeci/çalışan/yorumcu/içerik üreticisi adları, kişisel anlatılar ve alıntılar yayımlanmaz.
- Ana kart yalnız fotoğraf/ad, kısa konum, doğru şubenin doğrulanmış gerçek Google puanı/yorum sayısı ve güvenilir biçimde doğrulanmış ürünleri içerir. Eksik alan gizlenir; demo veya tahminle doldurulmaz.
- Detay yalnız ad/konum/kategori, kısa olgusal açıklama, doğrulanmış ürünler, varsa ek ürünler, kesinleşmiş önemli ziyaret bilgileri ve doğrulanmış platform puanlarını içerir. Menü mevcudiyeti lezzet üstünlüğü değildir.
- Kaynak URL'leri, araştırma dosyaları, kanıt listeleri, seçim gerekçeleri, araştırma belirsizlik kutuları ziyaretçi DTO'suna taşınmaz. Yönetici, seçim motoru, araştırma ve AI Kalite Denetçisi tüm kanıt/tarih/kayıtları korur.
- Görev ayrımı: Antigravity kendi izole klasöründe ana kart/detay UI sadeleşmesini uygular; Codex kendi klasöründe otomatik metin ve ziyaretçi veri sözleşmesini uygular. Ortak canlı tasarıma, üretime, push/deployment'a müdahale yoktur.
- Codex sunumu kaynak düzyazısını kısaltarak yayımlamaz: uygulamaya ait konum/kategori şablonu ve açık ürün sözlüğü kullanır. Ürün yalnız erişilmiş, kullanılabilir, aynı fiziksel şubeye ait operatör menü kanıtından gelir; marka geneli/tarihsel tadım/çıkarım ziyaretçi ürün önerisine dönüşmez. Menü kontrolü 180 günden eskiyse yeniden doğrulanana kadar gizlenir; yakın erişim tarihi güncel stok garantisi sayılmaz. Serbest metin uyarılar ziyaretçiye aktarılmaz. Bu ihtiyatlı sınır bazı gerçek ürünleri gizleyebilir; kanıt dosyasında kaybolmaz.
- Korumalı yerel veri rotasında `audience=visitor` yalnız izinli sunum alanlarını döndürür; varsayılan yönetici çıktısı değişmez. Bu seçenek ziyaretçiye açık yeni bir yayın rotası veya yayın izni değildir. Google puanları ayrı resmî kimlik/atıf hattı gerektirir; çıplak sayılar aktarılmaz.

## 30 Ekim 2026 — İzole algoritma/UI entegrasyonu

Kaynak Codex ve Antigravity checkout'ları değiştirilmeyecek. Hazırlık/entegrasyon ayrı `feat/gastronomy-ui-integration` worktree'sinde yapılır. Antigravity tasarımı devredilene kadar commit edilmemiş dosyalar birleştirilmez. Yeni ana sayfa başlığı “Canın ne çekiyor?”, alt metni “Konumunu seç. Kahvecileri, yemek mekanlarını ve yerel deneyimleri keşfet.” olur. En fazla yedi dinamik kategori; “Mutlaka Denenmesi Gerekenler” yalnız uygun bölgede, varsa ilk sıradadır (önceki zorunluluk yerine geçer). Ritüeller kategorilerden ayrıdır. İlk gerçek kapsam Moda/Kahve ve mevcut algoritmanın dört seçimidir. Otel/makale navigasyonu gizlenir; kod/içerik/URL silinmez. Nötr ziyaretçi sınırı, kaynakların yönetici tarafında korunması, eksik puan/ürün/fotoğrafı gizleme ve manuel kararları koruma zorunludur. Bu aşamada rota/yürüme özelliği geliştirilmez. Ek Places harcaması, push ve deployment yapılmaz. Hazırlık durumu `docs/INTEGRATION_READINESS.md` içinde kaydedilir.

## 30 Ekim 2026 — Ziyaretçide yalnız Google Maps işletme puanı

Ana kart ve detayda yalnız doğru fiziksel şubeye ait, resmî Google Places API ile doğrulanmış Google Maps puanı gösterilir. Değer aynen korunur; 4.4 → `4,4/5` yalnız yerelleştirmedir, yuvarlama/tahmin/başka şube aktarımı yapılmaz. Doğrulama veya gerekli atıf eksikse puan alanı gizlenir. Yorum sayısı (`reviewCount`, `userRatingCount`, `googleReviewCount` ve benzer alanlar) ziyaretçi DTO'sunda ve görsel bileşende bulunmaz. Google Maps ve gerekli üçüncü taraf atıfları korunur. Yönetici ve araştırma tarafında yorum sayısı/kanıt verisi korunabilir; mevcut iç modeller değiştirilmez. Bu karar yalnız izole entegrasyon worktree'sinde uygulanır; Antigravity'nin kaynak dosyalarına müdahale edilmez. Puan bileşeni tasarım devrinde hem karta hem detaya bağlanır; tasarım henüz birleştirilmiş sayılmaz. Ücretli API isteği gerektirmez.

## 30 Ekim 2026 — Ürün tavsiyesi ile menü ve uzmanlık ayrımı

Menüde bulunmak kalite tavsiyesi veya kategori liderliği değildir. Her mekanda ana uzmanlık, kategori uygunluğu ve imza ürün ayrı kanıt boyutlarıdır. Her kategori için kendi bağımsız ürün/uzmanlık kanıtı gerekir; farklı ana uzmanlığı olan mekan ikinci kategoride yeterli kanıtla yer alabilir. Sosyal popülerlik veya işletmeci söylemi tek başına geçiş sağlamaz. Brekkie incelemesi şehir/işletme adına özel istisna değil, genel kuralın gerçek karşı örneğidir.

Ürün durumları: Önerilebilir (A), Menüde doğrulandı (B), Belirsiz (C). Yalnız A ürünlerinden toplam en fazla üç kısa öneri; B ürünleri tarafsız “Menüden” alanında, C ürünleri yalnız yönetici araştırmasında kalır. Menü, tam ürün varyantı, doğru şube, bağımsızlık, ilk elden deneyim, kaynak kalitesi ve tarihler birlikte değerlendirilir. Güçlü güncel uzman incelemesi yüzeysel/kopya kaynak sayısına üstün tutulur; sponsorlu/türetilmiş içerik ve tarihsel deneyim güncel kanıt sayılmaz. Eksiklik olumsuz lezzet hükmü değildir, sayısal lezzet puanı üretilmez. Kaynak/kanıtlar yönetici tarafında korunur. Mevcut mekan seçimi, manuel müdahaleler ve denetçi kayıtları değiştirilmez. Detaylar `docs/PRODUCT_RECOMMENDATION_POLICY.md`.

## 31 Ekim 2026 — Görsel kaynak ve kullanım hakkı

Öncelik sırası: doğru şubeye ait hakları belgeli gerçek mekan fotoğrafı; aynı işletmenin güncel/doğrulanmış ürününe ait hakları belgeli gerçek ürün fotoğrafı; görünür “Temsili görsel” etiketli ve hakları uygun kategori illüstrasyonu. Bunlar yoksa görsel alanı gizlenir. İşletmenin web/Instagram yayını veya fotoğraf kredisi yeniden kullanım izni değildir. Şube/ürün eşleşmesi, kaynak, izin/lisans kanıtı, zorunlu atıflar ve doğrulama durumu ayrı saklanır. Google Photos için saklama/atıf koşulları ayrı uygulanır; kalıcı kopya ve izinsiz ücretli çağrı yoktur. AI ile gerçek şube/spesifik ürün fotoğrafı izlenimi üretilmez. İlk kapsam dört Moda şubesinde kaynak ve izin denetimidir; mevcut seçim, manuel kayıtlar ve Antigravity tasarımı değişmez. Sonuçlar `docs/IMAGE_RIGHTS_PILOT.md` ve `lib/pilot/images/moda-image-audit.json` içindedir; araştırma kaydı tek başına yayın yetkisi sağlamaz.

## 31 Ekim 2026 — Onaylı tasarımın gerçek yerel entegrasyonu

Antigravity'nin `7a7e3a4752e55bf11551a440b010614fdaa62cdb` devir commit'i ayrı entegrasyon worktree'sinde gerçek ziyaretçi adaptörüyle kullanılır. Yerel önizleme yalnız açık bayrak ve loopback Host ile etkin, noindex olur. Veri kaynağı mevcut gerçek seçkidir; demo sağlayıcı yayımlanmaz. Menüde doğrulandı sınıfı “Menüden”, yalnız yeterli bağımsız kanıtlı ürün “Ne Sipariş Etmeli?” olarak sunulur. Hakları belgeli gerçek fotoğraf yokken açıkça “Temsili görsel” etiketli, özgün ve geçici kategori SVG grafiği kullanılır. Google puanı doğrulanmadığında gizli kalır, yorum sayısı ziyaretçi çıktısına girmez. Eski otel/makale yolları ve üretim ana sayfa/metadata geri dönüşü korunur. Bu yerel entegrasyon canlı yayın veya Vercel deployment onayı değildir.

## 31 Ekim 2026 — Yeniden kullanılabilir premium temsili illüstrasyonlar

Kahve, hamburger, pizza, kahvaltı, tatlı/pastane ve yöresel yemek için özgün hafif SVG aileleri kullanılır. Kahve varyantları aynı bölgedeki işletmelere kimliğe göre kararlı ve mümkünken tekrarsız atanır; manuel sıralama görseli değiştirmez. Beyaz/krem zemin ve kontrollü mavi vurgu korunur. Görünür “Temsili görsel” etiketi her kart ve detay kullanımında zorunludur; gerçek şube veya spesifik ürün tasviri iddia edilmez. Eksik/bozuk görsel kategori çizimine, o da erişilemezse sayfa içi kategori SVG'sine düşer. Altı kategori grafiği hazır olması altı gerçek araştırma kategorisi yayımlama yetkisi değildir. Lisanslı gerçek fotoğraf için atıflı ayrı sunum türü korunur; mevcut izin doğrulanmadan fotoğraf hattı açılmaz. Kayıtlar ve testler `docs/REPRESENTATIVE_ILLUSTRATIONS.md` içinde.

## 31 Ekim 2026 — İmza, tavsiye ve menü ayrımının yerel yayını

İmza ilişkisi doğrudan bağımsız imza/ziyaret amacı kanıtı gerektirir; olumlu inceleme, popülerlik veya çok satılma tek başına imza değildir. Tavsiye güncel resmi şube menüsü ve güçlü bağımsız ürün deneyimi gerektirir; en fazla üç ürün. Menüde doğrulandı bilgisi ziyaretçi ana kartında gösterilmez, yalnız detayda “Menüden” olarak sunulur. Kaynak/ret gerekçeleri korumalı yönetici raporunda kalır. Yeterli kanıt bulunamazsa alan gizlenir; eşikler sırf sonuç artsın diye gevşetilmez. Ayrı araştırma kopyası korunarak doğrulanmış kurallar entegrasyon alanına aktarıldı.

## V1 premium hız yayın standardı — 31 Ekim 2026

- Instagram mobil trafiği öncelikli; gerçek içerik ve kullanıcı işlevi gizlenerek skor yükseltilmez.
- Lighthouse production build: mobil Performance minimum 90 (hedef 95+), desktop 95+, SEO 100, Accessibility 95+, Best Practices 95+.
- Core Web Vitals hedefleri: LCP ≤2500 ms, INP ≤200 ms, CLS ≤0,1. Navigation Lighthouse/TBT gerçek kullanıcı INP'sinin yerine geçmez; yerel etkileşim ölçümü ve yayın sonrası p75 saha verisi ayrı izlenir.
- Ana sayfa, Moda/Kahve listesi ve dört gerçek mekan detayı her önemli değişiklikte en az üç tur ölçülür; min/medyan/max ve başarısız tüm ölçümler raporlanır. 375/390/430 px mobil ve desktop kapsanır. Modal detaylar için timespan/snapshot skorları navigation skoru gibi sunulmaz.
- İndekslenebilir yayın sürümünde SEO 100 kapısı vardır. Güvenli yerel/staging noindex koruması Lighthouse skoru için kaldırılmaz; bunun ham skora etkisi açık raporlanır.
- 50/100/300 eşzamanlı senaryo yalnız izole test ortamında; production veritabanına yük testi yapılmaz.
- Ziyaretçi cache'i admin/araştırma verisini veya sırları paylaşmaz; manuel karar değişimi sonraki istekte fark edilir. Lisanslı Google verileri için özel saklama/atıf/onay kuralları korunur; ziyaret başına ücretli Places sorgusu başlatılmaz.
- Bu ölçümler yayın kapısıdır; push, deployment, ücretli API veya production değişikliği için ayrıca onay gerekir.

## 2026-11-01 — Bulut veri kaynağı, kalıcı yönetici yetkisi ve plan değişikliği

- Kullanıcı Pro paketini aldığını bildirdi. Ücretsiz plan başlangıç varsayımı bu karar sonrasında güncel değildir; düşük sorgu ve transfer ilkeleri plan değişse de korunur. Panel/fatura henüz bağımsız doğrulanmadı.
- Her ziyaretçi için araştırma dosyası veya ham kaynak okuma yerine, doğrulanmış ve süreli ziyaretçi anlık görüntüsü kullanılır. Araştırma arşivi ayrı özel şemadadır; ziyaretçi çıktısı katı izin listesiyle doğrulanır.
- Yönetici yetkisi e-posta adına veya kullanıcı tarafından düzenlenen metadata'ya dayanmaz. Supabase Auth ile doğrulanmış kişisel oturum, TOTP/aal2 ve özel tabloda aktif üyelik gerekir. Üyelik her işlemde veritabanından kontrol edilir; herkese açık kayıt yönetici yetkisi vermez.
- Yeni test katmanı ayrı `yeriniayir-cloud-admin` kopyasında geliştirilir. 3300, Antigravity ve orijinal Codex dosyaları değiştirilmez. Bulut modu aktifken eski Basic yönetici yardımcıları erişimi kapatır; MFA'ya dönüşmez veya bypass oluşturmaz.
- Yeni yayınlar atomik sürüm kontrolüyle kaydedilir. Manuel çıkarma/sıralama kalıcıdır; geri alma geçmişi silmez, yeni sürüm üretir. Yönetici yalnızca kanıt dosyasıyla daha önce doğrulanmış dalları seçebilir; serbest ürün/kalite iddiası gönderemez.
- Google puanı/yorum sayısı veya ham API sonuçları kalıcı ziyaretçi anlık görüntüsüne alınmaz. Place ID ve araştırma kayıtları mevcut kullanım sınırları içinde korunur. Yeni resmi puan taşıma yolu ayrıca lisans ve gerçek API erişimiyle doğrulanmalıdır; bu görev ücretli çağrı yetkisi vermez.
- Production'da daha önce onayla uygulanan tek geçici yazma önlemi 42 RESTRICTIVE politikadır; 45 eski politika yerindedir. Yeni şema taslağı, kalıcı lockdown migration veya yeni veri aktarımı production'a uygulanmadı. Kalıcı yetki testi bitmeden engeller kaldırılmaz.
- Pro kuruluşunda ek proje ücret doğurabilir; kullanıcının Pro satın alması ek compute/proje/migration/veri aktarımı için genel izin sayılmaz. Test için uygun ücretsiz ayrı kuruluş varsa kullanılabilir; ücret görünüyorsa ayrıca onay gerekir.
- Gerçek Supabase staging bağlantısı, gerçek Auth/MFA, verinin buluttan SSR'a gelişi, kaydet/yenile/geri al ve anonim-yetkisiz erişim testleri tamamlanmadan bulut bağlantısı veya yönetici sistemi tamamlandı denmez. Yerel SQL/fixture testleri bunun yerine geçmez.


## 1 Kasım 2026 — Antigravity devir dönemi
Dört gün boyunca geliştirme/test/optimizasyon/araştırma/yayın hazırlığını Antigravity yürütecek. Güncel durum ve izin sınırları kökteki ANTIGRAVITY_HANDOFF.md'dedir. Yeni özellik geliştirilmez; ortak bulut içerik yönetimi ve gerçek yayın engelleri önceliklidir. Devir production, push, deployment veya ücretli API yetkisi vermez.
