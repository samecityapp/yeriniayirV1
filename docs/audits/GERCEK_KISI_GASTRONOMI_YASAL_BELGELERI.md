# YeriniAyir.com — Gerçek Kişi Gastronomi İlk Yayını Yasal Belgeleri ve Veri İşleme Raporu

- **Proje / Repo:** `samecityapp/yeriniayirV1` (`/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures`)
- **Çalışma Dalı:** `feat/paket-10d-gastronomy-legal-and-hotel-separation`
- **Baz Alınan Güvenlik Commit'i:** `0d45c7cb701d99cd75de3e9eb1dd05a79fbaaf83` (`fix/paket-10c-chatgpt-review-closures`)
- **Kod, Yasal Sayfa, Ayrım ve Test Commit SHA:** `82d537d78fc8af3b3afd7cc6dc390e51d830afee`
- **Kapsam Kararı:** YeriniAyir.com ilk yayınında **yalnızca yerel gastronomi keşif hizmeti** (21 il, 92 bölge, zincir dışı restoran/kafe/fırın seçkileri) sunulmakta olup Platform şu aşamada **gerçek kişi site işletmecisi / gerçek kişi veri sorumlusu** tarafından yönetilmektedir. Şirket kuruluşu, otel listeleme, otel aracılığı/rezervasyonu ve ödeme alma akışları ilk yayın kapsamı dışındadır.

> **ÖNEMLİ YASAL UYARI:** Bu doküman ve kod tabanında hazırlanan yasal metinler teknik ve mevzuat uyumu esas alınarak hazırlanmış taslak/uygulama metinleridir; yayıma alınmadan önce yetkili bir Türk hukuku uzmanı (avukat) tarafından son kez gözden geçirilmesi ve `[İlgili Bilgiler Eklenecektir]` alanlarının gerçek kişi işletmecinin doğrulanmış bilgileriyle doldurulması zorunludur.

---

## 1. Güncellenen 5 Yasal Sayfa ve Tasarım / SEO Uyum Özeti

Tüm yasal sayfalarda mevcut arayüz tasarımı (`app/[lang]/(main)/(legal)/layout.tsx`), tekil kanonik yapı ve `info@yeriniayir.com` iletişim adresi korunmuş; otel rezervasyonu, `Booking.com`, konaklama aracılığı, e-bülten aboneliği ve var olmayan kurumsal/şirket/MERSİS/Hukuk Birimi ibareleri tamamen temizlenmiştir:

| Sayfa | Dosya Yolu | Kanonik URL & Robots Durumu | Gerçekleştirilen Güncelleme |
|---|---|---|---|
| **Kullanım Koşulları** | [kullanim-kosullari/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/kullanim-kosullari/page.tsx) | `https://www.yeriniayir.com/kullanim-kosullari` (İndeks açık, TR & EN içerik) | Gerçek kişi işletmeci modeli, gastronomi keşif kapsamı (masa ayırtma/sipariş/ödeme yok), bilgi güncelliği ve hata bildirimi (`info@yeriniayir.com`), Google Maps harici yönlendirmesi, sponsorlu içeriklerin aktif olmadığı şeffaflığı, FSEK fikri mülkiyet ve dengeli sorumluluk sınırı. |
| **Gizlilik Politikası** | [gizlilik-politikasi/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/gizlilik-politikasi/page.tsx) | `https://www.yeriniayir.com/gizlilik-politikasi` (İndeks açık, TR & EN içerik) | Gerçek kişi veri sorumlusu (`[İlgili Bilgiler Eklenecektir]`), kodda fiilen işlenen log/`ya_rl_anon`/istemci içi GPS/isteğe bağlı analitik ve e-posta verilerinin dürüst açıklaması; olmayan form ve üyelik iddialarının çıkarılması. |
| **KVKK Aydınlatma Metni** | [kvkk-aydinlatma-metni/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/kvkk-aydinlatma-metni/page.tsx) | `https://www.yeriniayir.com/kvkk-aydinlatma-metni` (İndeks açık, TR & EN içerik) | KVKK m.10 ve Aydınlatma Tebliği uyumlu tablo: faaliyet, veri kategorisi, amaç, m.5 hukuki sebep, saklama süresi; yurt içi/yurt dışı altyapı sağlayıcıları (Vercel, Upstash, Supabase ve yalnızca açık rızayla GA4/Clarity); doğrulanmamış aktarım güvencesi vaadi verilmeden KVKK m.9 durumu; KVKK m.11 hakları ve başvuru usulü. |
| **Çerez Politikası** | [cerez-politikasi/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/cerez-politikasi/page.tsx) | `https://www.yeriniayir.com/cerez-politikasi` (İndeks açık, TR & EN içerik) | Kodla birebir uyumlu zorunlu (`ya_rl_anon` API çerezi, `cookie-consent-granular` `localStorage`) ve açık rızalı analitik (`_ga*`, `_gid`, `_gat`, `_clck`, `_clsk`) envanteri; aktif olmayan pazarlama/işlevsel çerezlerin şeffaf açıklaması ve `#cerez-ayarlari` geri çekme davranışı. |
| **Kullanım Şartları (Eski URL)** | [kullanim-sartlari/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/kullanim-sartlari/page.tsx) | `canonical: https://www.yeriniayir.com/kullanim-kosullari`, `noindex, nofollow` | Eski otel, `Booking.com` ve "Yerini Ayır Hukuk Birimi" metinleri kaldırıldı; üst kısımda `/kullanim-kosullari` sayfasına yönlendirme kutusu, altında çelişmeyen `1..9` gastronomi kullanım esasları özeti korundu. |

### Gastronomi V5 Alt Bilgi ve Çerez Banner Bağlantı Düzeltmeleri
- **Yeni Ortak Alt Bilgi Bağlantı Bileşeni:** [GastronomyLegalFooterLinks.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/GastronomyLegalFooterLinks.tsx) oluşturularak kart/vitrin tasarımına dokunmadan tüm Gastronomi V5 `<footer>` alanlarına (`/tr`, `/tr/gastronomi`, `/tr/gastronomi/[...segments]`, `/tr/gastronomi/mekan/[venueSlug]`) Kullanım Koşulları, Gizlilik Politikası, Çerez Politikası, KVKK Aydınlatma Metni, `#cerez-ayarlari` (`Çerez Tercihleri`) ve Hakkımızda bağlantıları eklendi.
- **Çerez Banner Hatalı / 404 Bağlantı Onarımı:** [CookieBanner.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/ui/CookieBanner.tsx) görsel tasarımı değiştirilmeden [dictionaries/tr.json](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/dictionaries/tr.json) içindeki `/tr/gizlilik-politikasi` bağlantısı `/tr/cerez-politikasi` olarak, [dictionaries/en.json](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/dictionaries/en.json) içindeki 404 dönen `/en/privacy-policy` bağlantısı `/en/cerez-politikasi` olarak düzeltildi; pazarlama ve işlevsel kutucuk açıklamaları gerçek duruma uyumlu hale getirildi.
- **Yasal Yan Menü Güncellemesi:** [app/[lang]/(main)/(legal)/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/layout.tsx) bağlantıları geçerli dil ön ekini (`/${lang}/...`) koruyacak biçimde güncellendi ve yan menüye `#cerez-ayarlari` ile sabit tarih (`19 Kasım 2026`) eklendi.

---

## 2. Güncellenen Yasal Metinlerin Tam İçeriği (Canlı Türkçe Sürüm)

*(Her sayfanın `/en/...` rotasında da eşdeğer İngilizce metin yer alır; hukuki ihtilaflarda Türkiye Cumhuriyeti mevzuatına tabi Türkçe metin esastır. Kaynak dosyalar: `app/[lang]/(main)/(legal)/*`.)*

### 2.1. Kullanım Koşulları (`/tr/kullanim-kosullari`)
- **Son Güncelleme:** `19.11.2026`
- **1. Taraflar, Kapsam ve İşletmeci Statüsü:** YeriniAyir.com (&quot;Platform&quot;) ilk yayın döneminde yalnızca gastronomi keşif hizmeti sunmakta olup **gerçek kişi site işletmecisi** (&quot;İşletmeci&quot;) tarafından bireysel olarak yürütülmektedir.
- **2. Sunulan Gastronomi Hizmetinin Niteliği:** Türkiye genelinde il, ilçe, semt ve kategori bazlı bağımsız restoran, kafe, fırın ve yerel lezzet duraklarının keşfine yönelik editöryal seçkiler, kısa tanıtım notları, ürün/sipariş önerileri, sokak seviyesi adres bilgileri, bölge-kategori filtreleri ve Google Maps yol tarifi bağlantıları sunar. Platform üzerinden masa ayırtma, paket/sipariş satışı, bilet satışı veya çevrim içi ödeme işlemi yapılmaz; ziyaret edilen mekândaki hizmet, fiyat ve kalite doğrudan ilgili işletmenin sorumluluğundadır.
- **3. İşletme Bilgilerinin Değişebilirliği ve Hata Bildirimi:** Mekânların çalışma durumları, saatleri, menü içerikleri, fiyat seviyeleri ve oturma düzenleri işletmeler tarafından değiştirilebilir. Kapanmış, el değiştirmiş veya bilgisi güncelliğini yitirmiş mekânlar `info@yeriniayir.com` adresine bildirilebilir.
- **4. Üçüncü Taraf Bağlantıları ve Yol Tarifi Yönlendirmeleri:** `maps.google.com` veya işletmelere ait harici bağlantılara tıklandığında ilgili üçüncü tarafın kendi kullanım koşulları ve gizlilik politikaları geçerli olur.
- **5. Sponsorluk ve Ücretli Tanıtım Şeffaflığı:** Mevcut gastronomi yayınında ücretli mekân listelemesi, sponsorlu öne çıkarma veya satış komisyonuna dayalı yönlendirme özelliği **aktif değildir**. İleride reklam veya sponsorlu içerik sunulursa açıkça belirtilecektir.
- **6. Kullanıcı Yükümlülükleri ve Yasaklı İşlemler:** Otomatik istek, bot saldırısı ve yetkisiz toplu veri kazıma (scraping) yasaktır; ziyaret öncesi güncel çalışma saati ve menü kontrolü tavsiye edilir.
- **7. Fikri Mülkiyet ve Görsel Kullanım Hakları:** 5846 sayılı FSEK kapsamında özgün seçki metinleri, derleme yapısı, arayüz ve özgün illüstrasyonlar İşletmeci'ye veya hak sahiplerine aittir; hak sahipliği bildirimleri `info@yeriniayir.com` üzerinden alınır.
- **8. Sorumluluk Sınırı ve Yasal Hakların Saklılığı:** Koşullardaki hiçbir hüküm Kullanıcının Türk Borçlar Kanunu ve ilgili mevzuat kapsamındaki emredici yasal haklarını veya İşletmeci'nin kasıt ve ağır kusurundan doğan sorumluluğunu ortadan kaldırmaz.
- **9. Kişisel Veriler ve Çerezler:** Gizlilik Politikası, KVKK Aydınlatma Metni ve Çerez Politikası sayfalarına atıf yapılır.
- **10. Güncelleme, Uygulanacak Hukuk ve İletişim:** Türkiye Cumhuriyeti hukuku uygulanır; tüketiciye özgü yasal yetki ve görev kuralları saklıdır. `Gerçek Kişi Site İşletmecisi: [İlgili Bilgiler Eklenecektir]`, `Tebligata Elverişli Adres: [İlgili Bilgiler Eklenecektir]`, `E-posta: info@yeriniayir.com`.

### 2.2. Gizlilik Politikası (`/tr/gizlilik-politikasi`)
- **Son Güncelleme:** `19.11.2026`
- **1. Veri Sorumlusu ve Kapsam:** Tüzel kişi sıfatı olmaksızın **gerçek kişi veri sorumlusu** (`[İlgili Bilgiler Eklenecektir]`, Adres: `[İlgili Bilgiler Eklenecektir]`, `info@yeriniayir.com`) tarafından sunulan gastronomi keşif platformunu kapsar.
- **2. Mevcut Gastronomi Sürümünde İşlenen Veriler:** Kullanıcı üyeliği, yorum alanı, ticari ileti aboneliği, sipariş formu veya ödeme ekranı bulunmadığı; yalnızca (a) standart HTTP bağlantı/güvenlik kayıtları, (b) yalnız ziyaretçi API çağrılarında günlük UTC tuzlu SHA-256 IP özeti ve 15 dk imzalı `ya_rl_anon` çerezi (HTML sayfalarında üretilmez), (c) yalnızca kullanıcı tıklamasıyla **100% tarayıcı içinde** çalışan ve sunucuya iletilmeyen GPS bölge eşleştirmesi (`Konumumu Kullan`), (d) tarayıcı içi/URL filtreleme (sunucuda profil tutulmaz), (e) `cookie-consent-granular` `localStorage` kaydı ile yalnız açık rızalı GA4/Clarity analitiği ve (f) gönüllü `info@yeriniayir.com` başvurularının işlendiği dürüstçe açıklanır.
- **3–6. Sağlayıcılar, Saklama, Güvenlik ve Haklar:** Verilerin satılmadığı; Vercel, Upstash, Supabase ve yalnızca açık rızayla Google Analytics 4 / Microsoft Clarity'nin teknik hizmet sağlayıcı olarak görev alabildiği; harici Google Maps tıklamalarında Google politikasının işlediği; saklama süreleri (`ya_rl_anon` 15 dk, günlük özet 24 sa, erişim logları en fazla 2 yıl), veri minimizasyonu/HTTPS/HSTS/CSP/HMAC/özetleme tedbirleri ve KVKK m.11 hakları açıklanır.

### 2.3. KVKK Aydınlatma Metni (`/tr/kvkk-aydinlatma-metni`)
- **Son Güncelleme:** `19.11.2026`
- **1. Veri Sorumlusu Kimliği:** Gerçek kişi site işletmecisi (`[İlgili Bilgiler Eklenecektir]`, Tebligat Adresi: `[İlgili Bilgiler Eklenecektir]`, `info@yeriniayir.com`).
- **2. İşleme Faaliyeti / Amaç / Hukuki Sebep (KVKK m.5) / Saklama Süresi Envanteri:**
  1. *Erişim ve Güvenlik Logları* (IP, User-Agent, URL, zaman damgası) -> ağ güvenliği ve 5651 sayılı Kanun -> `m.5/2-a`, `m.5/2-ç`, `m.5/2-f` -> en fazla 2 yıl.
  2. *Rate-Limit ve `ya_rl_anon` Çerezi* (yalnız ziyaretçi API isteklerinde imzalı rastgele nonce + günlük UTC tuzlu `SHA-256` IP özeti) -> CGNAT adaleti ve flood engelleme -> `m.5/2-f` -> çerez 15 dk (`Max-Age=900`), pencere `10–60 sn`, günlük özet anahtarı 24 saat.
  3. *Çerez Rıza Tercihi* (`localStorage: cookie-consent-granular`) -> rıza kaydı -> `m.5/2-ç`, `m.5/2-f` -> kullanıcı silene/değiştirene dek.
  4. *Tarayıcı İçi Konum Eşleştirme (GPS — `Konumumu Kullan`)* -> cihaz içi semt önerisi -> kullanıcı tarayıcı izni -> sunucuda `0` saniye (iletilmez/kaydedilmez).
  5. *İsteğe Bağlı Analitik* (GA4 IP anonimleştirmeli + Microsoft Clarity) -> toplu istatistik -> **Açık rıza (`m.5/1`)**, varsayılan kapalı, `#cerez-ayarlari` ile geri çekilebilir.
  6. *E-posta Başvuruları (`info@yeriniayir.com`)* -> düzeltme/hak talebi yanıtı -> `m.5/2-ç`, `m.5/2-e`, `m.5/2-f` -> yasal zamanaşımı süresince.
- **3–6. Toplama Yöntemi, Yurt Dışı Aktarım (m.8–9), m.11 Hakları ve Başvuru:** Elektronik otomatik toplama ve gönüllü e-posta başvurusu açıklanır; Vercel, Upstash, Supabase ve açık rızalı GA4/Clarity yönünden KVKK m.9 uyumu konusunda doğrulanmamış güvence iddiasında bulunmadan durum şeffafça belirtilir; KVKK m.11'in 8 hakkı ve Başvuru Tebliği çerçevesinde 30 gün yanıt süresi yer alır.

### 2.4. Çerez Politikası (`/tr/cerez-politikasi`)
- **Son Güncelleme:** `19.11.2026`
- **Zorunlu Envanter:** `ya_rl_anon` (`HttpOnly · SameSite=Lax · Secure`, `Max-Age=900` = 15 dk, yalnızca ziyaretçi API uç noktalarında) ve `cookie-consent-granular` (`localStorage`).
- **Açık Rızaya Tabi Analitik:** GA4 (`_ga`, `_ga_*`, `_gid`, `_gat`) ve Microsoft Clarity (`_clck`, `_clsk`) — ilk ziyarette `denied`, rıza verilmeden betikler DOM'a eklenmez.
- **Aktif Olmayan Kategoriler:** Tercih panelinde pazarlama ve işlevsel anahtarlar bulunsa dahi mevcut gastronomi sürümünde reklam/yeniden hedefleme pikseli, canlı sohbet widget'ı veya video izleme çerezi kullanılmadığı açıkça belirtilir.
- **Rıza Geri Çekme:** `#cerez-ayarlari` üzerinden rıza kaldırıldığında `denied`, `clarity('stop')`, `ga-disable`, betik kaldırma ve `clearThirdPartyAnalyticsCookies()` çalıştığı açıklanır.

### 2.5. Eski Kullanım Şartları Sayfası (`/tr/kullanim-sartlari` — `noindex, nofollow`)
- **Son Güncelleme:** `19.11.2026` · **Kanonik URL:** `https://www.yeriniayir.com/kullanim-kosullari`
- Üst bilgilendirme kutusunda güncel `/kullanim-kosullari` metnine bağlantı verilir; altında `1..9` maddelik çelişmeyen gastronomi özeti ve gerçek kişi işletmeci iletişim kanalı (`info@yeriniayir.com`) korunur (eski otel, `Booking.com` ve "Yerini Ayır Hukuk Birimi" metinleri tamamen kaldırılmıştır).

---

## 3. Dayanak Alınan Resmî Mevzuat ve Düzenleyici Kaynaklar

1. **6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK):**
   - **Madde 5/1 ve 5/2(a, ç, e, f):** İşleme şartları (isteğe bağlı analitik için açık rıza; 5651/erişim logları için kanuni öngörülme/hukuki yükümlülük; API rate-limit güvenliği ve CGNAT adaleti için veri sorumlusunun meşru menfaati).
   - **Madde 7:** Silme, yok etme veya anonimleştirme esasları.
   - **Madde 8 ve Madde 9 (2024 değişiklikleri sonrası güncel yurt dışına aktarım rejimi):** Yeterlilik kararı, uygun güvenceler (standart sözleşme vb.) veya istisnai aktarım halleri.
   - **Madde 10:** Veri sorumlusunun aydınlatma yükümlülüğü (gerçek kişi kimliği, amaç, alıcı, toplama yöntemi, hukuki sebep ve m.11 hakları).
   - **Madde 11:** İlgili kişinin bilgi, düzeltme, silme, itiraz ve zarar tazmini hakları.
2. **Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ:** Açık, sade dil; işleme faaliyetlerinin ayrı ayrı amaç/sebep eşleştirmesi; muğlak gelecek ihtimalleri yerine fiilî işlemenin bildirilmesi.
3. **Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ:** Başvuruda bulunması gereken asgari unsurlar, yazılı veya kayıtlı e-posta/iletişim kanalları ve 30 gün içinde ücretsiz sonuçlandırma (tarife istisnası hariç).
4. **Kişisel Verileri Koruma Kurumu — Çerez Uygulamaları Rehberi:** Kesinlikle gerekli (zorunlu) çerezler ile açık rızaya tabi analitik/pazarlama çerezlerinin ayrımı, varsayılan kapalı (opt-in) başlangıç, rızanın geri alınabilmesi ve aktif olmayan çerezlerin listelenmemesi ilkesi.
5. **5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun:** Barındırma/erişim ortamında trafik/erişim kayıtlarının tutulmasına ilişkin çerçeve.
6. **5846 sayılı Fikir ve Sanat Eserleri Kanunu (FSEK) ve 6098 sayılı Türk Borçlar Kanunu (TBK):** Editöryal içerik/derleme hakları, haksız kazıma yasağı ve emredici yasal hakları ortadan kaldırmayan dengeli sorumluluk sınırları.
7. **6502 sayılı Tüketicinin Korunması Hakkında Kanun (TKHK) / Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği İlkeleri:** Tüketicinin kanundan doğan emredici haklarına ve yetki kurallarına aykırı genel sorumluluk reddi hükümlerinden kaçınılması; ücretli/sponsorlu tanıtım aktif değilken şeffaf biçimde belirtilmesi.

---

## 4. Kod Üzerinden Doğrulanmış Teknik Kişisel Veri ve Çerez Envanteri

| Bileşen / Kaynak Dosya | Kodda Fiilî Davranış | İşlenen Veri | Sunucu / Yurt Dışı Etkisi |
|---|---|---|---|
| [lib/pilot/rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/rateLimit.ts) (`enforceRateLimit`, `issueAnonFairnessCookieHeader`) | Yalnız `scope === 'api'` (ziyaretçi API uç noktaları) çağrılarında HMAC-SHA256 imzalı `ya_rl_anon` üretir (`Max-Age=900`, `HttpOnly`, `SameSite=Lax`, HTTPS/prod ortamında `Secure`). HTML gastronomi sayfalarında `Set-Cookie` **üretmez**. IP adresini günlük UTC tarihiyle tuzlayarak tek yönlü `SHA-256` özetine (32 hex karakter) dönüştürür. | Rastgele 16-byte nonce + zaman damgası (`ya_rl_anon`); günlük özetlenmiş IP | Vercel Edge/Node belleği ve koruma sayacında (Upstash Redis — sadece ilgili korunan/API rotalarında; çekirdek gastronomi GET sayfalarında `0` Upstash çağrısı). |
| [lib/cookieConsent.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/cookieConsent.ts) & [components/ui/CookieBanner.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/ui/CookieBanner.tsx) | İlk ziyarette tüm opsiyonel kategoriler `false`. Kullanıcı seçimi tarayıcı `localStorage` içinde `cookie-consent-granular` anahtarında saklanır. | `{ necessary: true, analytics, marketing, functional, performance }` | Sunucuya gönderilmez; %100 tarayıcı içi depolama. |
| [components/ConsentManagedAnalytics.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/ConsentManagedAnalytics.tsx) | Google Consent Mode v2'yi `'denied'` başlatır. Yalnız `prefs.analytics === true` ise `googletagmanager.com` (`G-593PL85N6Q` / `G-E2Z6W3YXSM`, `anonymize_ip: true`) ve `clarity.ms` (`ufxa278rg4`) yüklenir. Ret/geri çekmede `clarity('consent', false)`, `clarity('stop')`, `ga-disable-... = true`, betik kaldırma ve `clearThirdPartyAnalyticsCookies()` (`_ga*`, `_gid`, `_gat`, `_clck`, `_clsk` temizliği) çalışır. | Sayfa yolu, tarayıcı etkileşimi, anonimleştirilmiş IP (`analytics: true` verilmişse) | Açık rıza verilmişse Google LLC ve Microsoft Corporation (yurt dışı). Marketing/pazarlama pikseli **yoktur**. |
| [components/food/LocationPickerModal.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/LocationPickerModal.tsx) | Kullanıcı yalnızca `"Konumumu Kullan"` düğmesine bastığında `navigator.geolocation.getCurrentPosition` çağrılır (`enableHighAccuracy: false`, `timeout: 10000`, `maximumAge: 120000`). Eşleştirme (`findNearestPublishedRegion`) istemci içinde yapılır. | Anlık yaklaşık enlem/boylam (tarayıcı RAM'inde) | **0 sunucu gönderimi, 0 veritabanı kaydı.** |
| [components/PageViewTracker.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/PageViewTracker.tsx) | `HOTEL_DETAIL_UUID_REGEX` (`/^(?:\/(?:tr|en|el)\/(?:otel|hotel)\/<uuid>)/`) dışındaki **hiçbir** gastronomi, rehber veya yasal sayfada `/api/track-event` çağrısı yapmaz. | Gastronomi sayfalarında yok | Gastronomi ilk yayınında `/api/track-event` tetiklenmez. |
| **Gastronomi Arama / Kategori Filtreleri** | URL path (`/gastronomi/<il>/<ilce>/<semt>/<kategori>`) ve `/api/gastronomy/regions/[slug]` ISR JSON üzerinden çalışır. | Arama kutusu metni (tarayıcı durumu) | Sunucuda kullanıcı arama geçmişi tablosu yok. |
| **Üyelik / Form / Ödeme / Bülten** | Gastronomi yüzeylerinde kayıt, yorum, bülten veya ödeme formu yok. Yalnız kullanıcı dilerse `info@yeriniayir.com` adresine doğrudan e-posta gönderir. | E-posta gönderilmişse gönderen e-postası ve mesaj içeriği | İşletmeci e-posta kutusu. |
| **Google Maps Bağlantıları** | Mekân kartlarında `https://maps.google.com/?cid=...` bağlantıları yeni sekmede (`rel="noopener noreferrer"`) dış bağlantı olarak açılır. | Kullanıcının harita linkine tıklayıp üçüncü taraf siteye gitmesi | Tıklama sonrasında Google LLC'nin kendi veri sorumluluğu başlar. |

---

## 5. Yayın Öncesi Eksikler Listesi (Tamamlanmadan Canlıya Çıkılmamalı)

1. **Gerçek Kişi İşletmeci / Veri Sorumlusu Kimlik ve Tebligat Bilgileri:**
   - [kullanim-kosullari/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/kullanim-kosullari/page.tsx), [gizlilik-politikasi/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/gizlilik-politikasi/page.tsx) ve [kvkk-aydinlatma-metni/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/(legal)/kvkk-aydinlatma-metni/page.tsx) içindeki `[İlgili Bilgiler Eklenecektir]` alanlarına gerçek kişi site işletmecisinin **resmî Ad-Soyad** bilgisi ve **tebligata elverişli açık adresi** eklenmelidir.
2. **İletişim E-posta Kutusu Canlı Doğrulaması (`info@yeriniayir.com`):**
   - `info@yeriniayir.com` gelen kutusunun aktif olarak izlendiği ve KVKK m.11 başvurularının 30 günlük yasal süreyi kaçırmayacak şekilde yanıtlanabildiği teyit edilmelidir.
3. **KVKK m.9 Yurt Dışı Veri Aktarım Usulü Teyidi:**
   - Vercel (barındırma/CDN logları), Upstash (rate-limit sayaç altyapısı), Supabase ve rıza halinde çalışan Google Analytics 4 / Microsoft Clarity yönünden 6698 sayılı KVKK m.9 güncel aktarım mekanizmalarının (standart sözleşme imzası/bildirimi veya kurul düzenlemesine uyum) avukat eşliğinde doğrulanması gerekir. Alternatif olarak tam rıza mekanizması oturana dek `NEXT_PUBLIC_DISABLE_ANALYTICS=1` ile üçüncü taraf analitik tamamen kapalı başlatılabilir.
4. **Avukat / Hukuk Uzmanı Son Kontrolü:**
   - Türkiye'de yerleşik bir bilişim ve veri koruma hukuku avukatı tarafından tüm 5 sayfanın son kontrolünün yapılması ve `Son Güncelleme` tarihinin gerçek yayın tarihine çekilmesi önerilir.

---

## 6. Doğrulama Sonuçları (`82d537d78fc8af3b3afd7cc6dc390e51d830afee`)

| Doğrulama Komutu | Sonuç |
|---|---|
| `npx tsc --noEmit` | PASS (`exit 0`) |
| `npm run build` | PASS (`181/181` sayfa, `exit 0`) |
| `node scripts/verify_v3_gastronomy.cjs` | PASS (`21/21`, `exit 0`) |
| `node scripts/verify_visitor_content.cjs` | PASS (`10/10`, `exit 0`) |
| `node scripts/verify_gastronomy_legal_and_hotel_separation.cjs` | PASS (`6/6`, `exit 0`) |
| `node scripts/verify_gastronomy_snapshot_integrity.cjs` | PASS (`92` bölge, `2272` mekan, tekil `placeId`, `exit 0`) |
| `node scripts/verify_pilot_security.cjs` | PASS (`48/48`, `exit 0`) |
| `node scripts/cloud/verify_secret_leakage.cjs` | PASS (`120` dosya tarandı, `0` sızıntı, `exit 0`) |
| `node scripts/verify_rls_security.mjs` | PASS (PostgreSQL 17.11 `32/32`, `exit 0`) |
| `node scripts/verify_paket08_geo_ai_search.cjs` | PASS (`6/6`, `exit 0`) |
| `node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs` | PASS (`9/9`, `1529/1529` sitemap URL, `exit 0`) |
| `node scripts/verify_paket10_final_release_audit.cjs` | PASS (`6/6`, `exit 0`) |
| `node scripts/verify_paket10b_codex_closures.cjs` | PASS (`7/7`, `exit 0`) |
| `node scripts/verify_paket10c_independent_closures.cjs` | PASS (`8/8`, `exit 0`) |
