# İlk gerçek yerel seçki — Moda / Kahve

30 Ekim 2026. Gerçek çalışmanın kaydı `work/first-selection/latest.json`; yönetim kararı kalıcı denetim günlüğünde (portfolio-v2). Kaynaklardan bağımsız olarak seçim ID'lerini sabitleyen bir liste yoktur. 282 gerçek keşif kaydı, 91 ilk kahve sinyali ve ilave kimlik kayıtlarıyla 95 kahve araştırma adayı; bunlardan 20 derin dosya aynı kuralla değerlendirildi. Önceden incelenen beşliye ek olarak on gerçek adayda 10 yeni Basic Tavily araması yapıldı. Bu görev 10 kredi, bugünkü toplam 15 kredi; iş başı 5/gün 20/ay 200 sınırları korunur.

## Otomatik sonuç

1. Çekirdek / Şair Latifi 9/A: 2026 şubeye özgü espresso/filtre anlatısı, iki ayrı adres yayını, yakın OSM gözlemi. Resmî güncel menü ve yeni bağımsız ziyaret yok; faaliyet işletme tarafından doğrudan teyitli değildir.
2. Story / Dalga 22: şubeye özgü 2024 ürün anlatısı ile resmî adres ve menü desteği. 2020 Milor ve 2024 Time Out tarihsel kaynaklardır. Menüde bulunmak lezzet teyidi değildir.
3. Guten Morgen / Fırıldak 19/B: resmî iletişim sayfası yeniden okunarak fiziksel adres doğrulandı; 2024 espresso/cortado ve ekşi maya anlatısı var. Güncel içecek menüsü ve yeni tadım yok; üçüncü taraf farklı sokak anlatısı taşınmadı.
4. Montag / Moda Bademaltı 22/A: işletmenin daha önce erişilmiş şube ve menü kaydı ile 2026 bağımsız marka ürün anlatısı var. Doğrudan sayfanın 429 beklemesi aşılamaz; önceki olgular kendi erişim tarihleriyle kullanılır. Ürün anlatısı marka kapsamındadır ve şube tadımı olarak sunulmaz.

Sıra bir sayısal kalite puanı veya kesin tat üstünlüğü değildir. Öncelik: şubeye özgü bağımsız ürün anlatısı → yayın güncellik sınıfı → resmî menüyle sipariş desteği → bağımsız ürün ailesi çeşitliliği → eşitlikte kararlı ID sırası. Menü boyutu servis belgeliliğidir, tat puanı değildir. Farklı menü/atmosfer özellikleri kartta kaynak metninin kapsamıyla anlatılır.

Coffee Manifesto eski Güneşli Bahçe havuz kaydı, güncel Moda adresiyle aynı şube varsayılmadığından seçilmedi. HODL sponsorluk/menü kaynakları bağımsız ürün tadımı sayılmadı. Meet Lab'ın fiziksel şubesi destekli olsa da bağımsız ürün kaydı eksik. Kronotrop Moda/Eatery şube eşleştirmesi, Urban konumu ve diğer adayların kanıt eksikleri ek araştırmada. Seçilmeme kötü kalite hükmü değildir; beşinci mekanla liste doldurulmadı.

## Gerçek akış ve tekrar çalıştırma

`node scripts/run-first-selection.cjs` mevcut keşif döngüsünü çalıştırır, son kullanılabilir gerçek havuzu kaynak hatasında korur, yeni kaynak olgularını/önbelleğini yeniler, mevcut katalogdan tüm uygun adayları karşılaştırır ve mevcut `changeManagement` üzerinden otomatik kararı kaydeder. Kimlik ve kalite kaynakları eski ledger/gerçek kaynak raporlarından gelir; demo dosyası tüketilmez. Tarihleri bilinmeyen deneyimler null kalır. Yeni kaynaklar için semantik yorum/adaptör henüz yoksa sadece bağlantı tutulur.

`work/first-selection/activation.json` explicit yerel politika geçişidir; kazanan ID veya puan içermez. Katalogdaki 20 dosyanın tamamına aynı profil uygulanır. Diğer bölgeler/kategoriler aynı seçim ve kart veri modelini kullanabilir; yeni coğrafyanın ve yayın tipinin kaynak adaptörü olmadan orada araştırma tamamlandı denmez.

Araştırma ajanı bu oturumdaki Codex kaynak incelemesidir; metin/model sağlayıcısına yeni ücretli çağrı yapılmadı. Çalışan uygulama aşaması deterministik kaynak/kanıt değerlendirmesidir. Kendi kendine her sitede yeni tadım metnini anlayan evrensel bir LLM ajanı tamamlandı iddiası yoktur.

## Güvenlik, manuel tercihler ve denetim

Mevcut yönetim state'i, manuel ekle/çıkar/sıra ve CAS geri alma mekanizması korunur. Otomatik çalışma aynı API eylemini kullanır; özel kazanan yazma yolu yoktur. Eksik manuel ekleme tutulur fakat kanıtsız kalite yayımlanmaz. Manuel çıkarma otomatik yeniden eklenmez. Önceki yönetim dosyası `before-management.json` içinde korunur; asıl günlük silinmez.

Kaynak portföyü; bilinen URL/aile/kind, olgu parmak izi, kaynak kapsamı, erişim/yayın tarihi, şube-adres uyuşması ve faaliyet sinyalini kontrol eder. Çarşı/Moda ayrımı kalite yarıştırması değildir; kapsam kontrolüdür. Kapanış sinyali veya önemli kimlik çelişkisi seçimi durdurur. Resmî kayıtta listelenmek bugün kapının açık olduğu iddiası değildir.

Seçki sonrası kartlar tekrar okunarak sıralama, kaynaklar ve null alanlar denetlendi. Mevcut AI Kalite Denetçisi ayrıca Moda işini çalıştırdı; harita kaynağı hatası nedeniyle tam yedi-alan doğrulaması kısmi, yeni tarihli tadım doğrulaması 0 kaldı. Bu, belirsizliği açıklanmış yerel portföy seçkisinden farklı bir standarttır; dört seçilmiş mekan “bütün alanları tam doğrulanmış” ilan edilmedi. Rapor iki sonucu birlikte saklar.

## Antigravity entegrasyon sözleşmesi

Antigravity klasörüne veya ortak canlı kart bileşenine dokunulmadı.

- Tip: `lib/pilot/gastronomy/cards.ts` içindeki `VenueCardData`.
- Sunucu okuma: `readVenueSelection(regionId, categoryId)`; ağ araştırması başlatmaz.
- Yerel korumalı JSON: `/tr/moda-kadikoy-pilot/selection/data?region=moda-kadikoy&category=coffee`.
- Kart/detay önizlemesi: `/tr/moda-kadikoy-pilot/selection`.
- Ana yönetici panelinde “Gerçek araştırmadan otomatik seçilen mekanlar”. Eski sabit pilot ayrı etiketli sekmede kalır.

Modelde isim, adres, OSM nokta koordinatı, sipariş seçenekleri, neden gitmeli, ek lezzetler, uygunluk, kaynak tarihleri/kapsamları ve belirsizlikler var. Google puanı ve yorum sayısı, fotoğraf, yaya rotası ve başka platform puanları doğrulanmadığı için null/boş. Placeholder bir mekan fotoğrafı değildir. Tüketici bu alanları gizlemeli; null'u 0 puana çevirmemelidir. Üretim JSON endpoint'i ve bütün değişiklikler kapalıdır; canlı veri akışına bağlanmamıştır.

## Doğrulama ve sınırlar

`verify_first_selection.cjs` gerçek çalışmayı ve bellek içi karşı örnekleri denetler: menü-yalnız ret, marka/şube farkı, tarihi olmayan/yeni deneyim uydurmama, kapanış/şube çatışması, kararlı sıralama, manuel dışlama/sıra/geri alma, puan-fotoğraf-rota uydurmama, diğer kategoriye aynı kurallar. Bellek fixture'ları gerçek rapora yazılmaz.

`verify_first_selection_browser.cjs` gerçek dört kartı, API auth, detay başlıkları, mobil/masaüstü ve sayfa açılınca mutasyon olmamasını kontrol eder. Mevcut yönetim, kalıcılık, araştırma, güvenlik ve RLS testleri korunur. Politika sürümü beklentisi yeni kullanıcı kararıyla v2'ye güncellendi.

İlk kullanılabilir **yerel** sürümün seçki/kart/manuel kontrol hattı çalışır. Eksik olanlar güncel bağımsız saha tadımı, lisanslı fotoğraf, izinli Google verisi, gerçek yaya rotası ve her yeni bölge/yayın için kaynak adaptörleridir. Bunlar gizlenmez; canlı veya tüm Türkiye için bitmiş ürün diye sunulmaz.
