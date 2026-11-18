# Supabase — gerçek yedek ve RLS denetimi sonucu

## Güncel durum — kullanıcı onayıyla uygulandı

Kullanıcı “Geçici yazma engelini uygula” yanıtıyla production değişikliğini açıkça onayladı. İncelenmiş operasyon dosyası değişmediği ve dört veri yedeğinin hash/izinleri doğrulandıktan sonra 42 RESTRICTIVE politika tek transaction ile uygulandı ve COMMIT doğrulandı. Politika sayısı **45 → 87**. 14 hedef tabloda INSERT/UPDATE/DELETE için anon/authenticated engelleri tek tek doğrulandı; önceki 45 politika, SELECT kuralları, RLS/table/grant metadata'sı aynen kaldı. Anon/authenticated rollerinde superuser/BYPASSRLS olmadığı ayrıca doğrulandı.

Production'da anon rolüyle restaurants/hotels/storage.objects okuma sorguları READ ONLY altında başarılı; içerik veya sayılar rapora alınmadı. Production'da gerçek veri ekleme/silme testi yapılmadı. Yerel 98 senaryo ve kayıt koruma 3/3 testleri geçti. İşlem öncesi/sonrası katalog ve onaylı SQL/rollback hash'leri özel yerel işlem kaydında saklandı.

Bu geçici engel anonim/oturum açmış istemci yazmalarını durdurur. Aynı erişimi kullanan yönetici düzenlemeleri, yüklemeler ve analytics eklemeleri geçici olarak durur; service-role bypass yolu hedeflenmedi. Kalıcı yönetici yetkilendirmesi ve okuma/gizlilik denetimi tamamlandı anlamına gelmez. Eski geniş politikalar silinmediğinden koruma kaldırılırsa eski açıklar geri gelir. Geri alma dosyası hazır, ancak otomatik geri alma yapılmadı; production rollback için ayrıca açık talimat alınmalı.

**Geri yükleme notu:** İlk veri yedeği değişiklikten önceki politikalara aittir. Buna ek olarak işlem sonrası public ve auth/storage şema yedekleri hazırlanır; geri yükleme planında 42 koruyucu kural korunmalı. Şema/veri dump'ları ortak atomik snapshot değildir. Gerçek production yedeğinin tam restore testi halen yapılmadı.

Aşağıdaki bulgular, acil engel uygulanmadan önceki denetimin tarihsel kaydıdır.

31 Ekim 2026. Production projesi: YeriniAyir / `jerkkxwgddujigsbeqwo`.

## Gerçekten tamamlanan işlemler

Kullanıcı hesabında proje yeniden açıldı ve veritabanı parolası yenilendi. Yeni parola macOS maskeli yerel girişinden alındı; sohbet/komut argümanı/loglara yazılmadı. Özel bağlantı dosyası 0600, çalışma klasörü 0700, Git dışında. Uygulamanın localhost bağlantısı production'a çevrilmedi.

Doğrudan IPv6 PostgreSQL bağlantısı kullanıldı. Sistem CA deposu Supabase kökünü tanımadığı için ilk TLS kontrolü durdu; doğrulama kapatılmadı. Supabase Studio'nun resmî `apps/studio/hooks/custom-content/custom-content.json` dosyasının tanımladığı sertifika indirildi. Sonraki bağlantı `verify-full` ile doğrulandı; sunucudan `pg_stat_ssl.ssl=true`, `transaction_read_only=on` alındı. Parola veya kök sertifika production'da ajan tarafından değiştirilmedi.

## Yerel veritabanı yedeği

Özel dizin: `work/supabase-recovery/database-backup-20261031T193110Z` (entegrasyon klasöründe, Git dışında).

| Dosya | Boyut |
|---|---:|
| roles.sql | 358 bayt |
| schema.sql | 20.538 bayt |
| managed-schema.sql | 158.196 bayt |
| data.sql | 4.711.831 bayt |
| Toplam | 4.890.923 bayt (yaklaşık 4,9 MB) |

Dört dosyanın SHA-256 değerleri manifestle yeniden karşılaştırıldı ve eşleşti; dosyalar 0600. Data dump'ında public için 13, auth için 26, storage için 7 tablo COPY bölümü bulundu; tamamı kapanmış. Veri satırları rapora alınmadı.

Supabase CLI 2.122.0'un ürettiği dump betikleri native pg_dump 17.11 ile çalıştırıldı. Docker veya bulut staging kullanılmadı. Bu dört mantıksal dosya ayrı snapshot'lardır; ortak atomik snapshot değildir. Gerçek production yedeğinin tam geri yükleme testi henüz yapılmadı. Vault kök anahtarı, Vault/extension iç verileri, fonksiyon ortam sırları ve harici ayarlar bu setin tam kurtarma garantisine dahil değildir. Geri yükleme sırasında bunlar ayrı değerlendirilmelidir. İndirilen 662,7 MB Storage ZIP'i ayrıca saklanmalı; bütünlük kontrolü geçmişti. Production verileri staging'e kopyalanmadı.

## Gerçek salt okunur RLS bulguları — KRİTİK

Public/storage kapsamında **21 tablo/ilişki ve 45 politika** incelendi. RLS etkin olmasına rağmen geniş izin veren politikalar erişime izin veriyor. İnceleme katalog metadata'sına dayanır; production'da yazma/silme saldırı testi yapılmadı.

- **10 public tabloda 19 koşulsuz anonim yazma politikası** var: analytics_events, articles, group_hotels, groups, hotels, offers, restaurant_categories, restaurant_notes, restaurants, tags.
- Bunların bazılarında INSERT/UPDATE, bazılarında DELETE veya ALL izni bulunuyor. Her tablonun üç işleme de açık olduğu iddia edilmiyor. Analytics INSERT kasıtlı olabilir; sınırlandırılmamış halka açık kullanım spam riski taşır.
- **Storage objects için 8 yazma politikası** bulunuyor. Bunlar bucket'a göre sınırlı, ancak kimlik/admin kontrolü içermiyor; izin kapsamındaki görsel/video nesneleri için anonim upload/update/delete riski var. Tüm bucket'lar aynı kapsama açık diye sunulmuyor.
- Bu politikalara karşı RESTRICTIVE politika bulunmadı.
- Public profiles tablosu ve önceki admin helper/koruma trigger'ı bu envanterde yok. Yerel eski lockdown migration'ı production'a doğrudan uygulanabilir sayılmıyor.

**İlk denetim sırasında production değiştirilmedi.** Daha sonra yukarıda kaydedilen ayrı kullanıcı onayıyla geçici engel uygulandı.

## Geri alınabilir acil önlem — ONAY SONRASI UYGULANDI

`supabase/operations/20261031_emergency_write_hold.sql`: 13 public tablo ve storage.objects üzerinde anon/authenticated için INSERT/UPDATE/DELETE işlemlerini geçici olarak engelleyen 42 RESTRICTIVE politika ekler. Mevcut politikaları silmez ve SELECT izinlerini değiştirmez. Service-role bypass erişimini hedeflemez. Tüm işlem tek transaction ve kısa lock timeout ile yürür; başarısızlıkta kısmi değişiklik bırakmaz.

**Etkisi:** Ziyaretçi okumaları mevcut politikalarla sürer. Anon/authenticated kullanan yönetici düzenlemeleri, yüklemeler ve analytics eklemeleri geçici olarak durur. Bu, nihai admin yetkilendirmesi yerine geçmez. Service-role kullanan uçların sunucu yetkilendirmesi ayrıca korunmalıdır. Okuma/veri gizliliği politikalarına yönelik tüm incelemeler tamamlanmış sayılmaz.

`20261031_emergency_write_hold.rollback.sql` yalnız bu 42 yeni politikayı kaldırır ve mevcut davranışı geri getirir; geri alma eski açığı da geri getirir.

Önlem, üretimden bağımsız geçici PostgreSQL üzerinde **14 örnek tabloda 98 kontrol** geçti: anonim/authenticated yazmaları engellendi; okumalar ve service-role işlemleri korundu; rollback eski politikaları ve davranışı geri getirdi. Mekan seçimi/manuel karar/araştırma koruma testleri 3/3 başarılı. Bu testler production değişikliği yapmadı.

## İleri işlem sınırı

Onaylanan kapsam yalnız geçici 42 kuraldır ve uygulanmıştır. Kalıcı yönetici RLS modeli, eski politikaları silme, genel migration, veri değişikliği veya geri alma bu onaya dahil değildir. Bunlar production değişikliği gerektirirse ayrıca onay alınacak.

GitHub push, deployment, yeni ücretli hizmet veya Places/model API işlemi yapılmadı. Parolalar, API anahtarları, kişisel veriler ve ham SQL veri satırları bu rapora yazılmadı.
