# 31 Ekim 2026 güncellemesi

Antigravity `7a7e3a4` devir commit’i doğrulandı ve yerel entegrasyon tamamlandı. Güncel teslim/test/eksik listesi: `docs/GASTRONOMY_INTEGRATION_DELIVERY.md`. Aşağıdaki hazırlık notları tarihsel kayıttır.

# Gastronomi UI + araştırma entegrasyonu hazırlığı

30 Ekim 2026. Durum: **Tasarım devri bekleniyor. Birleşik ziyaretçi sitesi henüz oluşturulmadı.**

## Güvenli çalışma

- Codex kaynak: `/Users/erdems/Documents/Codex/yeriniayir-codex-development`, `feat/codex-development`.
- Antigravity tasarım kaynağı (yalnız okundu): `/Users/erdems/Documents/antigravity-design-lab/yeriniayir-mobile-design`, `feat/mobile-restaurant-detail-design`.
- Entegrasyon hazırlığı: `/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration`, `feat/gastronomy-ui-integration`.
- İki kaynak dalın ortak son commit'i `dbacf9c`. Tasarım dalında bunun üstünde yeni commit yok. Ana sayfa yeniden düzenlemesi staged rename, layout değişikliği ve yeni UI/provider dosyaları henüz commit edilmemiş durumda. Tamamlanma/devir kaydı bulunamadı.
- Antigravity klasöründen çalışan Node sunucusu 3200 portunda tespit edildi. Bu, ajanın mutlaka düzenleme yaptığı kanıtı değildir; tasarımın güvenli teslim edildiği de doğrulanamadı. Bu nedenle yarım dosyalar birleştirilmedi, taşınmadı, commit edilmedi.
- Kaynak dosyaların SHA-256 envanteri yerel `work/integration/source-integrity.json` içinde; snapshot sırasında iki kaynak değişmedi. Git worktree/dal metadata'sı yeni çalışma alanı için olağan şekilde oluşturuldu; orijinal checkout/index veya kaynak dosyaları değiştirilmedi.
- Codex araştırma, seçim, denetim ve nötr ziyaretçi sözleşmesinin kopyası bu ayrı worktree'ye alındı. Yerel araştırma JSON kayıtları ve manuel kararlar ayrı kopyadır; kaynak klasörüne symlink değildir.
- Tarihsel tracked `.env.local.backup` yeni checkout'tan kaldırıldı. Gerçek `.env.local`, Google/Tavily anahtarları, servis hesabı, faturalama ve harcama izinleri kopyalanmadı. Bu worktree yalnız yeni yerel yönetici parolası ve internete çıkmayan test Supabase yapılandırması içerir. Bağımlılıklar kurulu Codex node_modules üzerinden salt-okunur kullanılır; paket kurulumu yapılmadı.

## Hazır olan gerçek veri bağlantısı

Korumalı localhost GET: `/tr/moda-kadikoy-pilot/integration?region=moda&category=kahve`.

`lib/pilot/integration/discovery.ts`, mevcut seçim okuyucusunun nötr DTO'sunu kullanır; araştırma veya Google çağrısı başlatmaz. Dört mevcut kayıt aynı sırada: Çekirdek / Şair Latifi, Story / Dalga, Guten Morgen / Fırıldak, Montag / Moda. Kaynaklar/kanıtlar yönetici modelinde kalır; ziyaretçi sınırı yalnız izinli alanları kopyalar. Ürün/fotoğraf/puan doğrulanmadıysa boş kalır. Hazırlık çıktısı `integration-preparation` etiketi taşır; üretimde yayımlanmış gibi gösterilmez.

UI URL eşlemesi: `region=moda` → `moda-kadikoy`, `category=kahve` → `coffee`. İstanbul/Kadıköy/Moda coğrafi zinciri korunur. Başka bölge/kategori istekleri 404'tür; sessiz Moda fallback veya mock kayıt yoktur. Şu anda yalnız Kahve kategorisinin verisi vardır. En fazla yedi kategori; “Mutlaka Denenmesi Gerekenler” yalnız uygunluk kanıtı varsa eklenecek ve varsa ilk sırada olacak. Önceki zorunlu must-try hükmünün yerini bu son kullanıcı kararı alır. Ritüel kanıtı bulunmadığından ayrı ritüeller listesi boştur.

## Tasarım devrinde çözülmesi gerekenler

1. Tasarım kaynağındaki `lib/food/mockProvider.ts` gerçek provider ile değiştirilecek. `lib/types-premium/multicategory-data.ts` ve sabit/demo veri fallback'leri gerçek akışta kullanılmayacak.
2. `PremiumRestaurantDetail`/FoodVenue zorunlu imageUrl varsayımı gevşetilecek; doğrulanmış fotoğraf yoksa alan gizlenecek. Pexels/Unsplash stok fotoğrafı gerçek şube fotoğrafı sayılmayacak.
3. Kart ve aktif Variant A detayda Google alanları yalnız resmî şube doğrulaması + atıf ile gösterilecek. Mevcut `toFixed(1)` puan yuvarlaması kaldırılacak; sayı değiştirilmeden gösterilecek. Ham araştırma DTO'su UI'ya spread edilmeyecek.
4. Eski Variant B/lab örneklerinde “Neden Gitmeli?” ve demo içerik var. Ziyaretçi akışına bağlanmayacak. Yönetici kanıtı/sources kullanıcı detayına taşınmayacak.
5. Mevcut header/layout wrapper ile tek ortak header korunacak. Başlık tam `Canın ne çekiyor?`, alt metin `Konumunu seç. Kahvecileri, yemek mekanlarını ve yerel deneyimleri keşfet.` olacak.
6. Otel/makale linkleri ziyaretçi navigasyonundan gizlenecek; route ve içerikler korunacak. Şimdilik tasarım tamamlanmadığı için eski ana sayfa/layout bu worktree'de değiştirilmedi.
7. `window.history.replaceState` ve React state'in ileri/geri gezinme ve aynı bölge kategori değişimlerinde URL ile birlikte çalışması uçtan uca doğrulanacak. Mevcut tasarım effect'i yalnız region değişince kategori güncelliyor; teslim sırasında düzeltme/test gerekiyor.
8. Tasarım durum modelindeki `published`/`demo` gerçek fakat henüz yayımlanmamış yerel araştırmayı yanlış etiketlememeli; açık `local-preview` karşılığı eklenecek.

## Google durumu

Orijinal güvenli sunucu anahtarı bağlı. IPv4 ile üç gerçek Text Search başarılı, ilk IPv6 denemesi IP kısıtlaması nedeniyle 403. Toplam dört istek, sıfır Details, **0/4 puan doğrulaması**. Şube eşleştirmeleri henüz geçmedi. Ek sekiz isteklik test için izin istendi fakat kullanıcı onay vermedi; bu görevde yeni ücretli istek yapılmadı. Entegrasyon worktree'sinde API anahtarı/harcama izni bulunmaz ve puan alanları boş kalır. Hesap/tarayıcı erişimi yapılmaz.

## Teslim kapısı ve test sınırı

Antigravity'nin tamamlanmış commit veya açık bir teslim kaydı olmadan dirty tasarım birleştirilmeyecek. Sonrasında üç yönlü karşılaştırma bu worktree'de yapılacak, mevcut Codex ve tasarım dalları korunacak. Şu an hazırlık/gerçek veri sözleşmesi test edilebilir; birleşik ana sayfa → Moda → Kahve → detay → geri dönüş ve 375/390/430px tasarım testleri **henüz çalıştırılamaz**. Bunlar tamamlanmış gibi raporlanmaz. Build/lint/TypeScript ve kaynak/manuel karar güvenliği hazırlık snapshot'ında ayrıca doğrulanır.

### Son puan sunumu kararı

Ziyaretçi kartı ve detayı yalnız resmî, doğru şubeye ait Google Maps puanını gösterecek. Yorum sayısı ziyaretçi sözleşmesinden ve ortak `components/food/GooglePlaceRating.tsx` bileşeninden çıkarılmıştır. Sayı yuvarlama yok; `4.4` değeri `4,4/5` olur. `ratings` izin listesi başka platform puanı veya yorum sayısı geçirmez. Google Maps ve sağlayıcı atıfları korunur. Yönetici/araştırma yorum sayısı modeli değişmedi. Antigravity'nin eski `googleRatingSignal.reviewCount` sunumu tasarım devrinde bu ortak bileşenle değiştirilecek; orijinal tasarım klasörü henüz değiştirilmedi.
