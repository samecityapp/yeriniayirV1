# Ürün önerisi ve ana uzmanlık politikası

30 Ekim 2026 — yalnız izole entegrasyon worktree'si.

## Önceki yöntemin somut zayıflıkları

- Ziyaretçi üreticisinde kullanılabilir operatör menüsü + 180 günlük erişim + ürün sözlüğü eşleşmesi doğrudan `whatToOrder` üretiyordu; bağımsız olumlu tadım şartı yoktu. Bu, bir menü öğesini tavsiyeye yükseltebilirdi. Dört gerçek adayda eski şube filtresi yüzünden bu alanlar zaten boştu; önceki yönetici notlarıyla boş ziyaretçi çıktısı farklıdır.
- Yönetici kartlarının `details('drink')` yolu tarihsel/çıkarım cümlelerini taşıyordu. Story için cortado/2020 notu, Montag için marka V60 çıkarımı, Guten için 2024 espresso/cortado ve Çekirdek için 2026 espresso/filtre ile tarihsiz cappuccino aynı sipariş modelindeydi.
- Eski kelime ayrıştırıcısı iced dirty chai latte'yi tanımıyordu. `V60` alt dizesi soğuk/sıcak ve tarif farkını saklayabiliyor; genel cheesecake adı spesifik tarifin içinde de bulunabiliyordu.
- Menü, kategori uzmanlığı ve kalite kanıtı aynı ürün düzeyinde ayrı değerlendirilmiyordu. Paket çekirdek sayfası fincan mevcudiyetini, marka menüsü tek başına şube kalitesini kanıtlamaz.

## Üç ayrı boyut

1. `mainSpecialty`: bağımsız kaynaklarda doğrudan anlatılan ana gastronomi odağı ve ziyaret amacı. Kaynağın şube/marka kapsamı, tarihi ve güncellik sınıfı korunur. Sosyal medya popülerliği/işletmeci söylemi tek başına bu boyutu oluşturmaz.
2. `categorySuitability`: her kategori için ayrı `supported`, `historical`, `brand-only` veya `needs-research`. `categoryCanLead` yalnız güncel güçlü bağımsız kategori kanıtıyla true döner. Menü ürünü, başka kategorinin ünü veya başka şubenin anlatısı bu kapıyı açmaz. Birden fazla kategori ancak ayrı kanıtlarla desteklenebilir.
3. `signatureProducts`: mevcut şube menüsü, tam ürün/tarif eşleşmesi, kategori desteği ve bağımsız olumlu ürün kanıtı birlikte sağlanan en fazla üç ürün. Kaynak sayısının fazlalığı lezzet puanı değildir.

Kuralların içinde işletme, semt veya şehir adına dayanan istisna yoktur. Brekkie yalnız gerçek verili bir karşı örnektir. Model yeni kategorileri string kimlikleriyle destekler; Türkiye'nin tamamında gerçek kaynak toplamadan sonuç üretmez.

## A / B / C

- A `recommendable` / Önerilebilir: şubeye uygulanabilir güncel operatör menüsü, yeterli bağımsız ayrıntılı olumlu ürün kanıtı, güçlü kategori desteği, çözülmemiş güncel karşı kanıt yok.
- B `menu-confirmed` / Menüde doğrulandı: güncel şube/şubeye resmen bağlanan ortak menü destekli; özel ürün tavsiyesi eşiği sağlanmadı. Ziyaretçide yalnız **Menüden** alanına gider.
- C `uncertain` / Belirsiz: menü, şube, tarih, ürün eşleşmesi veya güncel karşı kanıtta açıklık yok. Ziyaretçi önerisine/menüsüne taşınmaz. Eksik kanıt kötü kalite hükmü değildir.

Menü kontrolü en fazla 90 günlük; kalite yayını en fazla 365 günlük olmalıdır. Bilinen deneyim tarihi de son 365 gün içinde ve yayından sonra olmamalıdır. Bilinen eski deneyim yılı güncel yayın başlığıyla yenilenmez. Tarihi bilinmeyen güncelleme yeni ziyaret sayılmaz. Ziyaret tarihi bilinmeyen güncel uzman anlatısı gözlemsel dayanak olarak açık notuyla değerlendirilebilir; yeni tarihli tadım ilan edilmez. Bu eşikler lezzet puanı değil, tekrar araştırma politikasıdır.

Bir güncel, ayrıntılı ve bağımsız uzman anlatısı yeterli olabilir. Alternatif yol, gerçekten ayrı iki kaynak ailesinden ayrıntılı ilk elden deneyimdir. Sponsorlu, ticari kökeni belirsiz, dizin, yüzeysel anma, engelli veya yalnız link olarak tutulabilen kaynak tavsiye oyu üretmez. Türetilmiş İngilizce yayın, kopya/sindikasyon ve aynı köken tekilleştirilir. Güncel olumsuz/karışık ürün kanıtı belirsizlik yaratır; eski olumsuzluk ayrı tarihsel kayıt olarak kalır.

Ürünler yalnız tam etiket veya açıkça tanımlanmış eş adla eşleşir. Iced V60, sıcak V60 ve Japanese Iced Pour Over farklıdır; Sticky bun, Cinnamon Roll ve portakallı çikolatalı roll farklı tariflerdir; tek ve çift espresso eşitlenmez. Bilinmeyen ad tahminle bir ürüne bağlanmaz. Mevcut Focus ayrıştırıcısı artık uzun varyantı önce yakalar ve içindeki kısa adı ikinci ürün gibi üretmez.

## Çalışan entegrasyon

- İnceleme olguları: `lib/pilot/quality/product-evidence.json` (geliştirme ajanının gerçek web okumaları; demo değil).
- Genel karar: `products.ts`; güncel tarihe göre yeniden değerlendirilen okuyucu: `productResearch.ts`.
- `loadCatalog` araştırmayı yalnız metadata olarak ekler. Mekan sıralama/uygunluk politikaları, kalıcı otomatik seçim, manuel tercihler ve denetçi dosyaları değiştirilmedi. Yeni kategori boyutu güçlü kategori araştırması/ürün önerisi kapısını sağlar; mevcut dört mekanın yerel kısa listesini otomatik yeniden sıralayan veya yayımlayan bir iş başlatılmadı.
- İç kartta A ürünleri `whatToOrder`, B ürünleri `menuFrom`; eski kaynak/iddialar kalite raporunda ve araştırma dosyasında korunur. Ziyaretçi yalnız kısa ürün etiketlerini alır; kaynağı, kişi adını, kişisel alıntıyı ve kanıt nedenlerini almaz.
- Yerel korumalı yönetici JSON: `/tr/moda-kadikoy-pilot/products`. GET araştırma başlatmaz; üretim/harici host kapalıdır.
- `menuFrom` ziyaretçi veri sözleşmesine eklendi. Antigravity tasarım dosyalarına dokunulmadı; tasarım devrinde bu alan yalnız “Menüden” başlığıyla bağlanmalı, “Ne Sipariş Etmeli?” gibi yeniden adlandırılmamalıdır.

## Gerçek sonuç ve sınırlar

Dört kahveci: 30 ürün; 0 A, 12 B, 18 C. Brekkie vakası: 7 ürün; operatör şube/menü teyidi eksik olduğundan 7 C. Toplam 5 işletme dosyası, 37 ürün adayı, 22 kaynak kaydı. Menü B olmak, bağımsız lezzet üstünlüğü anlamına gelmez.

Story'de 2024 yayınının buzlu dirty chai latte adı 2026 ortak kafe menüsünde aynen var; yalnız B. Buzlu V60 için yalnız Japanese Iced Pour Over kaydı bulundu; bunlar eşitlenmedi. Montag'ın Moda şube sayfası resmî menüye doğrudan bağlanıyor: sıcak V60 ve diğer menü ürünleri B; 2026 değerlendirmesi iki şubeli marka kapsamında olduğundan şube imza ürünü yapılmadı. Çekirdek'in yeni menü alan adının sahipliği/adresi doğrulanamadı. Guten'in paket kahve kataloğu ve ABD şablon menüsü şube menüsü sayılmadı.

Brekkie'nin 2026 bağımsız anlatıları kruvasan/fırın ve kahvaltı odağını destekliyor. 24/1, eski 68/B ve 8/B kayıtları tek şube kabul edilmedi. Resmî hesap erişilemedi; güncel ürünler operatörden doğrulanamadı. Kahve bir eşlikçi olarak anılmasıyla güçlü kahve kategorisine yükseltilmedi. Harbiyiyorum ve İngilizce uyarlaması iki yeni ziyaret sayılmadı; 2019 arşiv deneyimi 2026 güncellemesiyle yeni tadım olmadı.

Karar otomatik/deterministiktir; her sitede serbest metni kendi kendine anlayan evrensel bir ürün araştırma ajanı tamamlandı iddiası yoktur. Kaynaklar mevcut izinli adaptörler ve geliştirme ajanı tarafından incelenip olgu olarak kaydedilir. Yeni kaynak ve tariflerde bu doğrulama adımı gerekir. Bu görevde Google yorumu/puanı kazınmadı, ücretli API veya yeni model servisi kullanılmadı.
