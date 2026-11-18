# Yerini Ayır V1 yayın öncesi denetim

31 Ekim 2026 — feat/gastronomy-ui-integration. Karar: **yerel sürüm işlevsel; canlı yayın ve Vercel Preview henüz onaylanabilir durumda değil**. Bu rapor yeni özellik/yayın yetkisi değildir.

## Yayın engelleri

1. Kurulu framework Next.js **13.5.6**. Resmî [middleware yetkilendirme atlatma duyurusu](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw) bu sürümü etkiliyor. [Güncel destek politikası](https://nextjs.org/support-policy) ve [14 Ekim 2026 güvenlik güncellemesi](https://nextjs.org/blog/nextjs-security-update-october-14-2026) uyarınca desteklenen ve yamalı sürüme geçiş gerekli. Yerel pilot handler'larının bağımsız auth kontrolü bu framework açığını tüm uygulama için çözmez. Bilinmeyen tüm CVE'lerin tümü bu uygulamada istismar edilebilir iddiası yapılmıyor. İki ana sürümü ve eski routing/API davranışlarını etkileyen değişimi son kontrol kapsamında körlemesine yapmadım. Bağımlılıklar kaynak Codex checkout'una symlink; oraya kurulum yaparak orijinal ortamı değiştirmedim. Güvenli sonraki işlem ayrı bağımlılık kurulumunda desteklenen sürüme geçiş ve tam regresyondur.
2. Üretim Supabase politika/şema durumu **doğrulanmadı**. Üretime hiçbir sorgu veya migration yapılmadı. Hazırlanan migration yerel testte başarılı olsa da bu üretim onayı değildir. Eski profiller `is_admin`, hazırlanan fonksiyon `role` bekliyordu; her iki şemayı destekleyen JSONB okuma ve kendi rolünü yükseltmeyi engelleyen tetikleyici eklendi. Revize migration üretim şeması ve geçmiş migration listesiyle karşılaştırılmadan uygulanmamalı. Yerel rol testleri tüm üretim tablolarını/politikalarını kapsamaz.
3. Eski 10 üretim/deneme betiğinde sabit Google/Gemini anahtarı tespit edildi ve değerleri gösterilmeden ortam değişkenine geçirildi. Anahtar yokken işlem başlamadan durur. Bu betikler çalıştırılmadı. Eski anahtarların geçerli olup olmadığı bilinmiyor; hesap sahibi iptal/yenileme yapmalı. Çalışma dosyasından silmek Git geçmişini veya daha eski kopyaları silmez. Kullanıcının erişim sınırı gereği hesaplarda işlem yapılmadı.
4. Gastronomi ana sayfası hâlâ **loopback Host + GASTRONOMY_LOCAL_PREVIEW** ile açılıyor. Vercel'de olduğu gibi dağıtılırsa gastronomi yerine eski ana sayfa kalır. Seçim durumu `work/` altında, Git dışı yerel dosyalarda; güvenli, sadece ziyaretçi alanlarını içeren staging snapshot/kalıcı veri kaynağı hazırlanıp yayın sınırı açıkça belirlenmeli. Ham araştırma dosyalarını veya `work/` klasörünü topluca dağıtmak çözüm değildir. Yönetici yazma/araştırma yolları üretimde kapalı kalmalı.

## Güvenli şekilde düzeltilenler

- Tam lint taramasındaki 54 JSX metin kaçış hatası 12 dosyada temizlendi; görünen sözcükler korunuyor. Mevcut hook/performans uyarıları kaldı. Lint hatalarını derlemede yok sayan `ignoreDuringBuilds` artık false.
- Eski jilinrime yönetici layout'una sunucu tarafında ek kimlik kontrolü ve noindex eklendi. Pilot sayfaları ve veri handler'larının bağımsız kontrolü korundu. Bu ek savunma framework yükseltmesi yerine geçmez.
- Eski betiklerdeki sabit anahtarlar kaldırıldı, eksik anahtarda erken hata. Yeni anahtar oluşturulmadı ve API çağrısı yapılmadı.
- RLS düzeltmesi `profiles.role` / `profiles.is_admin` şema farkını karşılıyor; authenticated kullanıcının bu alanları değiştirmesi/ayrıcalıklı profil oluşturması engelleniyor. Yalnız SQL dosyası değişti.
- Tüm geçici `work/` içeriği Git dışında bırakıldı. Secret env dosyası 0600 ve ignore kapsamında; değerleri loglanmadı. Silinmiş `.env.local.backup` dosyası tekrar eklenmedi. İlk mevcut Git commit'inden geçmiş sırları temizlemek için geçmiş yeniden yazılmadı.

## Kullanıcı akışı ve içerik

Ana sayfa → konum arama/seçimi → Moda/Kahve → Çekirdek, Story, Guten Morgen, Montag → detay → kapatma/geri dönüş çalışıyor. Tek header; geçersiz kategori/konumda başka bölgeye veya demo mekanlara dönüş yok. Altı kategoriye ait görsel sistemi hazır olması altı gerçek bölge/kategori yayını anlamına gelmiyor. Gerçek kapsam yalnız Moda/Kahve.

Kartlarda güçlü ürün önerisi yoksa alan gizli. Yalnız mevcut olduğu doğrulanan ürünler Story/Montag detaylarında “Menüden”. Eksik ürün/puan alanlarında boş kutu yok. Resmî doğru-şube Google puanı olmadığı için tüm puan alanları gizli; yorum sayısı sunumda ve visitor DTO'da yok. Dört farklı, etiketli SVG kompozisyonu var. Gerçek fotoğraf izni varmış gibi davranılmıyor. Yönetici kanıtı ve kişi anlatıları ziyaretçi HTML/RSC çıktısına taşınmıyor.

Otel ve makale routing dosyaları korunuyor; `/tr/otel-listesi` ve `/tr/rehber` yerel HTTP 200. Canlı veritabanı içerik doğruluğu test edilmedi. Eski ana sayfa/metadata geri dönüşü korunuyor. Gastronomi önizlemesi noindex; canlı canonical/index politikası ancak gerçek yayın modu açılırken doğrulanmalı.

## Ölçümler ve testler

- TypeScript: başarılı. Tam proje lint: **hata yok**, önceki uyarılar var. Production build: başarılı; lint kapısı etkin. Ağ korumasıyla dış üretim/ücretli servis erişimi kapalı.
- PostgreSQL/PGlite: **13/13**; anon yazma engeli, admin yazma izni, kendi rolünü yükseltememe ve is_admin-only şeması. Üretim durumu ölçülmedi.
- Pilot güvenlik **48/48**, ürün karar testleri **23/23**, Google puanı sunum politikası **6/6**, gerçek veri adaptörü **5/5**, manuel durum/kaynak/denetçi hash korunumu başarılı.
- Ana sayfa/konum/kategori/dört detay, tarayıcı Back/Forward, SSR/RSC veri sınırı ve yönetici 401: **13/13** tarayıcı kontrolü başarılı. 375/390/430/1440 px. İmza/menü ayrımı ve yetkili rapor için ek dört boyut + auth kontrolü başarılı.
- Temsili görsellerin yüklenmesi ve zorlanmış dosya hatasında inline yedek testi ayrıca çalıştırıldı; son log `work/v1-audit/browser-images-final.log`.
- Yerel HTTP örnek ölçümü: ana sayfa 131 ms / 39.336 bayt HTML, Moda/Kahve 111 ms / 44.907 bayt HTML; otel listesi 16 ms, rehber 15 ms. Bunlar tek yerel ölçüm, tüm kaynak boyutu veya Lighthouse/Core Web Vitals/üretim performans skoru değildir. SVG ailesi toplam 14.350 bayt, dış görsel isteği gerektirmiyor.
- Loglar ve sonuçlar `work/v1-audit/` altında; özel veri olarak Git dışı.

## Koruma ve Vercel Preview sırası

Yerel çalışma kodu, araştırma modülleri, ilgili seçki/denetçi kayıtları ve illüstrasyonlar 0600 izinli `/Users/erdems/Documents/Codex/yeriniayir-v1-local-backup-20261031.tar.gz` arşivinde korunuyor. Env/sır dosyaları ve değişmeyen büyük eski medya dizini dahil değil; bu dizinin mevcut checkout'u korunuyor. Ayrı imza araştırma kopyası ve Antigravity/Codex orijinal klasörleri değiştirilmedi. Yerel commit/push yapılmadı; yedek Git commit'i değildir.

Preview için sıralama: (1) izole bağımlılıkla yamalı desteklenen Next sürümüne geçiş, (2) mevcut anahtarların hesap sahibince iptali ve gerekli sırların güvenli staging ortamına bağlanması, (3) production'dan ayrı staging Supabase üzerinde revize RLS migration ve yetki testleri, (4) sadece izinli ziyaretçi seçki snapshot'ı/kalıcı kaynak ve açık staging yayın modu, (5) tüm testler, env/secret/Git diff kontrolü, (6) kullanıcının ayrıca push ve Vercel Preview deployment onayı. Preview başarılı olmadan üretim açılmaz. Ücretsiz veri/görsel eksikleri uydurulmaz; Google puanı ve güçlü tavsiye olmaması tek başına yayın engeli değildir.

Kullanıcı için şu anda zorunlu hesap işlemi: daha önce kodda bulunan anahtarları sağlayıcı hesabından iptal/yenilemek. Terminal/dosya işlemi gerekmez. Üretim yetki/şema doğrulaması ve migration için ayrıca yetkili erişim/onay gerekir. Bu tur üretime veya hesaba erişilmedi.
