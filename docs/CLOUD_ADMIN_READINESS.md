> **1 Kasım 2026 devir güncellemesi:** Güncel ana kaynak `../ANTIGRAVITY_HANDOFF.md`. Bu belgedeki önceki test raporu tarihidir. Staging cron kurulmuş, head8 ve published/unchanged işi salt okunur doğrulanmıştır; eski1saatliklease güncel değildir. Yeni internet araştırma işçisi, kişisel admin kurulumu, kart Google puanı ve bulut Lighthouse hâlâ açık. Son QR düzenlemesi typecheck/build geçti; tüm gerçek browserregresyonu tekrar edilmedi. Production42engeli korunur.

# Yerini Ayır — Gerçek bulut ve kalıcı yönetici test raporu

1 Kasım 2026. **Staging’de gerçek Supabase bağlantısı, veri aktarımı ve kişisel hesap/MFA mimarisi çalışıyor. Production etkinleştirilmedi; mevcut 3300 değişmedi.**

## Gerçekte çalışanlar

- Ayrı geliştirme kopyası: `yeriniayir-cloud-admin`, dal `feat/gastronomy-cloud-admin`. Antigravity ve orijinal Codex klasörlerine yazılmadı. Ortak Git metaverisine müdahale edilmeden bağımsız yerel Git deposu hazırlandı.
- Gerçek Supabase Free staging: `vhptlecaixpawtxnhsde`, İrlanda. Kullanıcı mevcut production kuruluşu için Pro satın aldığını bildirdi; yeni staging ayrı Free kuruluşta. Ek ücretli proje/API başlatılmadı.
- Kullanıcının açık onayıyla yeni staging şeması ve dört gerçek mekan/46 dinamik araştırma JSON dosyası aktarıldı. Paket arşivi 1,740,589 bayt. Kaynak dosyaları, canonical ziyaretçi verisi ve arşiv JSON’u veritabanıyla salt okunur karşılaştırıldı: **birebir eşit**, SHA eşleşiyor. Eski yerel kayıtlar silinmedi.
- Çekirdek, Story, Guten Morgen ve Montag gerçek bulut yayın kaynağından SSR ile okunuyor. Menü bilgileri korunuyor; bağımsız ürün kanıtı yeterli olmadığı için yeni tavsiye uydurulmadı.
- Ziyaretçi DTO’su katı izin listesine bağlı. Araştırma arşivi ayrı özel şemada; kaynak, yorum sayısı, şifre veya yönetici kaydı ziyaretçi çıktısında yok.
- Gerçek fotoğraf yerine mevcut dört temsili SVG kompozisyonu korunuyor. Storage’dan görsel indirilmedi.

## Yönetici yetkilendirmesi

Gerçek Supabase Auth üzerinde yalnızca bu staging için **iki yapay hesap** oluşturuldu: bir yönetici, bir yetkisiz kullanıcı. Gerçek production kullanıcıları kopyalanmadı; e-posta gönderilmedi. Kalıcı yetki modeli:

- Sunucuda gerçek `getUser` doğrulaması, aktif özel üyelik tablosu ve TOTP/`aal2` kontrolü.
- Kullanıcı tarafından düzenlenebilen metadata yönetici yetkisi vermez; yalnızca signed-in olmak veya parola bilmek yeterli değildir.
- HttpOnly/SameSite Strict oturum çerezleri; HTTPS ortamında Secure. Sırlar tarayıcı depolamasına yazılmaz. Eski Basic yardımcıları bulut modunda erişimi kapatır; MFA’yı aşamaz.
- Yeni yayınlarda beklenen sürüm ve atomik işlem; manuel çıkarma/ekleme/sıralama, gerekçeli geçmiş ve eski veriyi silmeden yeni sürümle geri alma. Serbest ürün/kalite iddiası gönderilemez; yalnızca doğrulanmış canonical mekanlar seçilebilir.
- Gerçek tarayıcıda giriş, TOTP, kaydet, ziyaretçide sonucu gör, geçmişten geri al ve çıkış tamamlandı. Çıkıştan sonra eski oturum tekrar gönderildiğinde **401** döndü.
- Test değişiklikleri ayrı staging geçmişinde açık test gerekçeleriyle kaldı. Son sürüm **7**; dört mekanın ilk sırası geri yüklendi. Kaynak arşivi değişmedi.

Bu, production’da senin kişisel yönetici hesabının açıldığı anlamına gelmez. Gerçek hesabın ve cihazındaki TOTP kurulumu, production yetki dağıtımının ayrı adımıdır; test parolaları sohbette paylaşılmadı.

## Gerçek sorgu ve transfer ölçümleri

| Durum | Supabase veri sorgusu | Gerçek ölçüm |
|---|---:|---|
| İlk soğuk SSR okuması | 1 | Toplam sayfa yanıtı 959 ms; ilk RPC 827 ms |
| Isınmış aynı süreçte 5 ayrı SSR ziyareti | **Toplam 0** | Yanıtlar 9–23 ms; Supabase veri aktarımı 0 |
| Aynı yayın sorgusunun bağımsız boyut ölçümü | 1 tanı isteği | **648 bayt gzip gövde**, 1726 bayt açılmış JSON |
| Ziyaretçi tarayıcısından doğrudan Supabase/Google sorgusu | 0 | Veriler sunucudan geliyor; Google çağrısı yok |

Boyut tanısında yanıt başlıkları ayrıca 924 bayttı; TLS/TCP ve istek başlıkları bu sayılara dahil değildir. Bunlar fatura paneli egress tutarı değil, ölçülen ağ gövdesi/başlık boyutlarıdır. Güvenlik testi sorguları ve yönetici arşiv indirmeleri ziyaretçi sorgusu sayılmadı. Soğuk/sıcak ölçümler yerel sunucu → İrlanda staging içindir; Frankfurt production/CDN performans garantisi değildir.

Sunucuda 60 saniyelik bounded/deduplicated önbellek ve Next Data Cache kullanılıyor; yayın değişikliği sonrası tag invalidation var. Aynı süreçte hemen, diğer önbelleklerde en geç TTL süresi içinde yenilenir. Yönetici cevapları no-store. Kaynak geçerliliği önbellek vuruşlarında yeniden kontrol edilir; bulut bozulursa yerel/demo sonuca sessiz dönüş yoktur.

**Pilot anlık görüntüsünün güvenlik geçerlilik sınırı: 01.11.2026 12:44 Türkiye saati.** Araştırma tarihleri değiştirilmedi; süresi dolmuş veriyi güncelmiş gibi tutmak için otomatik süre uzatılmadı. Bu süre sonunda içerik gizlenir. Production öncesinde kanıt güncelliğine bağlı yayın yenileme/araştırma işçisi ve periyodik çalıştırma tamamlanmalıdır. Mevcut bir saatlik staging test ayarı production yayın politikası değildir.

## Gerçek testin bulduğu ve düzelttiğim sorunlar

1. Sürüm çakışmasında SQLSTATE `40001`, PostgREST’in yeniden denemelerine yol açtı; ilk istek 125.161 ms sonunda 504 döndü. Bu durum başarı sayılmadı. `PT409` kullanılarak düzeltildi; son testte uygulama 347 ms’de 409 döndü (RPC 134 ms). Ağ hatalarının çakışma gibi raporlanması da kaldırıldı; yönetici Supabase istekleri 15 saniyeyle sınırlı.
2. Tarayıcıda parola → MFA geçişinde uncontrolled alanın eski değeri kalabiliyordu. Form adımı değişince alanların yeniden oluşturulması sağlandı; gerçek tarayıcı testi MFA alanının boş olduğunu doğruladı. Hiçbir gerçek kullanıcı parolasıyla test yapılmadı.

[PostgREST/Supabase’in 40001 yeniden deneme açıklaması](https://supabase.com/kb/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions), [özel HTTP hata kodları](https://docs.postgrest.org/en/v12/references/errors.html).

## Test özeti

- Gerçek staging anonim erişimi: **8 kontrol**; INSERT/UPDATE/DELETE ve yönetici RPC’leri veritabanı yetkileriyle reddedildi; dört kayıt korunuyor.
- Gerçek Supabase Auth/MFA, yetkisiz hesap, kaydetme/çakışma/geri alma/arşiv/çıkış: **14 kontrol**.
- Gerçek yönetici tarayıcı akışı: **5 kontrol**, ek olarak eski oturumu yeniden kullanma **401**, runtime hatası yok.
- Gerçek bulut ziyaretçi akışları: **13 kontrol**, 375/390/430/1440 px; dört mekan, detay, URL/geri dönüş, özel veri sızıntısı yok.
- Yeni şema yerel PostgreSQL: **35 kontrol**. Mevcut gerçek 87 politika tanımının yerel sentetik birleşim testi: **288 kontrol**.
- Next.js 15.5.28 production build, TypeScript başarılı; lint hata yok, devralınmış uyarılar var.
- 117 istemci build dosyası gerçek staging anahtarları, DB/test parolaları ve TOTP sırrına karşı tarandı: **0 eşleşme**. Kurulum Secret key çalışma ortamına eklenmedi; özel dosyalar 0600, Git dışında.

Önceki Lighthouse puanları bu yeni bulut sürümünün yeniden ölçülmüş puanı gibi sunulmadı. Yeni veri yolunun hosting/CDN ve Lighthouse yayın kontrolü ayrıca çalıştırılmalıdır; bu görev tüm V1 yayın kapılarının geçtiği iddiası değildir.

## Production ve Storage durumu

Production `jerkkxwgddujigsbeqwo` üzerinde önceden açık onayla uygulanmış **42 RESTRICTIVE** yazma engeli ve eski **45 PERMISSIVE** politika yerinde. Bu görevde salt okunur envanterle tanımların önceki kayıtla aynı olduğu doğrulandı. Birleşim kuralı `OR(PERMISSIVE) AND AND(RESTRICTIVE)`; anonim/yetkisiz yazmalar false RESTRICTIVE kurallarını aşamaz. Üretimde saldırı/yük testi yapılmadı; 288 test sentetik yerel PostgreSQL’deydi.

Yeni bulut şeması ve hata düzeltmesi **yalnızca staging’e** uygulandı. Production’da migration, veri aktarımı, yönetici üyeliği veya politika değişikliği yapılmadı. Kalıcı lockdown migration taslağı da otomatik uygulanmadı; geçici engeller kaldırılmadı.

Production Storage’da **358 dosya / 662,804,194 bayt** var. Önceki public DB yedeğinde 141 dosya referansı bulundu; **217 dosya inceleme adayı**, kesin kullanılmayan değil. Dış tüketiciler ve güncel referanslar bilinmeden silinmez. **0 silme**; mevcut yedekler korunuyor.

## Production öncesi kalan işler

1. Bu test edilmiş değişiklikler için integration/3300’e geçiş planı; orijinal 3300 şu anda korunmuş dosya tabanlı sürümdür.
2. Yeni şema + doğrulanmış veri paketi + kişisel yönetici UUID üyeliğinin production’a aktarımı, ayrı açık onayla. Production kimliği mevcut test araçlarında özellikle engellidir.
3. Senin kişisel yönetici hesabının parola/TOTP kurulumu ve üretimde yetkisiz hesap/oturum testleri. Mevcut eski uygulama tablolarındaki 42 geçici engel bu işlemle topluca kaldırılmaz.
4. Kanıt güncelliğini, arşiv sürümlerini ve manuel kararları koruyan periyodik bulut yayın/araştırma yenilemesi; süre dolumu ve hata yönetiminin production’da doğrulanması.
5. Google resmi puanlarının ayrı lisanslı/güncel taşıma yolu ve önceki ürün kanıtı/yayın kriterleri. Bu görevde puan veya sipariş önerisi uydurulmadı; yeni ücretli Places çağrısı yok.
6. Yeni bulut veri yoluyla performance/SEO ve gerçek korumalı hosting preview kontrolü. Push ve deployment ayrıca onay gerektirir.

## Önizlemeler

- **Gerçek bulut verili test sitesi:** http://127.0.0.1:3401/tr?region=moda&category=kahve
- **Yeni yönetici giriş ekranı:** http://127.0.0.1:3401/tr/gastronomi-yonetimi — şimdilik yalnızca özel yerelde tutulan yapay test hesabı vardır; kişisel hesap oluşturulmadı.
- **Korunan mevcut birleşik site:** http://127.0.0.1:3300/tr?region=moda&category=kahve

GitHub push, Vercel deployment, production değişikliği ve ücretli API işlemi yapılmadı.
