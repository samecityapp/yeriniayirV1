# Moda–Kadıköy otomatik araştırma motoru — Aşama 1

## Çalıştırma ve önizleme

- Dal: `feat/codex-development`.
- Yerel CLI: `node scripts/research-coffee.cjs`.
- Yönetici ekranı: `/tr/moda-kadikoy-pilot`, varsayılan **Otomatik Araştırma Havuzu** sekmesi.
- Yönetici aynı ekrandaki **Araştırmayı çalıştır** düğmesiyle yeni çalışma başlatır.
- `GET /tr/moda-kadikoy-pilot/research` yalnızca son yerel kaydı okur.
- Aynı adrese boş JSON ile `POST` araştırma başlatır. Basic Auth, aynı origin, JSON ve localhost zorunludur. Vercel üzerinde çalıştırma kapalıdır.
- Sayfa açılışı ve ziyaretçi sayfaları dış kaynak taraması başlatmaz.
- Harita kaynağı geçici olarak hata verirse başarısız deneme geçmişte korunur; ekranda son kullanılabilir harita havuzu, kendi eski kaynak tarihleriyle gösterilir. Son denemenin tarihi, kayıt sayısı ve hataları ayrı uyarıda belirtilir. Eski kayıtlar yeni araştırma gibi sunulmaz.
- Çalışma kilidi eşzamanlı işleri önler; 10 dakika içindeki çağrılar son kaydı döndürür. Son 20 çalışma ve son sonuç `work/pilot-research/` içinde tutulur, Git'e girmez.
- İşlem beklenmedik biçimde öldürülürse kalan `run.lock` dosyası yeni işi güvenli biçimde engeller. Geliştirme ajanı çalışan süreç olmadığını doğruladıktan sonra yerel kilidi kaldırabilir; kullanıcıdan terminal istenmez.

## Gerçek kaynaklar

1. **OpenStreetMap / Overpass**: `[40.978, 29.018, 40.992, 29.037]` dikdörtgeninde cafe, coffee shop ve faaliyet dışı cafe etiketlerini tek sorguda keşfeder. Merkez koordinatları, adres alanları, kaynak kimlikleri, güncelleme ve varsa saha kontrol tarihlerini kaydeder. Bu alan resmi Moda sınırı değildir; çaycı, pastane ve genel kafeler de adaydır.
2. **Barista Magazine**: Kadıköy rehberinin işletme başlıklarını otomatik ayrıştırır. Yayın tarihi, yazar (varsa), işletme adı ve tam kaynak URL'sini kaydeder. Yazı metni, tadım değerlendirmesi ve fotoğrafları saklamaz. Başlıkların değişmesi görünür kaynak hatası olur. Marka düzeyindeki bilgi fiziksel şubeyi doğrulamaz.
3. **Story işletme şube listesi**: Moda şube kartından işletme adı ve adresi okur. Sokak ve kapı numarası tek bir harita şubesiyle uyuşursa adresi destekler. İşletmenin kendi beyanıdır; kalite veya bağımsız güncel faaliyet kanıtı değildir. Google kökenli saatler/puanlar alınmaz.
4. **European Coffee Trip**: robots erişimi kontrol edilir; şu anda HTTP 403 nedeniyle engellidir. Koruma aşılmaz; kayıp kaynak raporlanır. Erişim açılması adaptörü otomatik hazır hale getirmez: yeniden kullanım koşulları ve ayrıştırıcı ayrıca değerlendirilmelidir.

Kaynak listesi bölge araştırması için yapılandırılmıştır; işletme adayları sabit pilot dosyasından gelmez. Montag, Story, Çekirdek ve Guten Morgen yalnızca keşif sonrası kapsama kontrolünde aranır. Havuz sıralaması alfabetiktir; kalite kazananı yoktur.

## Kimlik ve kanıt kuralları

- OSM nesne kimliği birincil kimliktir. Aynı normalize marka adı ve 25 metre içindeki kayıtlar, mevcut sokak/kapı alanları çelişmiyorsa birleştirilir. Kahve sözcüğünün yaygın yazım farkları normalize edilir. Her iki kaynak bağlantısı korunur. Eski önbellekler de ağ isteği yapmadan güncel tekilleştirme kurallarıyla okunur; kaynak tarihleri değiştirilmez. Ayrı şubeler marka adına göre topluca birleştirilmez.
- Yakınlık yalnızca kayıt eşleştirmesinde kullanılır; yürüme mesafesi veya rota olarak sunulmaz.
- Farklı yazım/eksik adresler bütün tekrarları yakalama garantisini engeller; belirsiz şubeler insan incelemesi ister.
- Yakın tarihli OSM düzenlemesi faaliyet kanıtı değildir. Saha kontrol etiketi ayrı, sınırlı harita sinyalidir. Gelecek tarihler faaliyet sinyali sayılmaz.
- İşletme sitesindeki şube kaydı “işletmenin listesinde var” demektir. Bugün açık olduğunun kesin teyidi değildir. Kapanış etiketleri ve kaynak çelişkileri korunur.
- Kaynakların yayın tarihi yoksa `null` kalır; erişim zamanı yayın tarihi yerine geçmez. Tam adres veya koordinat yoksa uydurulmaz.

## Güvenlik ve sınırlar

- Kaynak URL'leri sabittir; kullanıcı URL, sorgu veya API anahtarı gönderemez. HTTP yönlendirmeleri izlenmez, yanıt boyutu ve istek süresi sınırlıdır. OSM'de bulunan web adresleri otomatik ziyaret edilmez.
- HTML kaynakları robots kontrolünden sonra okunur. 403/429 veya belirsiz robot politikası hata olarak raporlanır; captcha/login/ücret duvarı aşılmaz.
- OSM olgusal kayıtları ODbL kapsamında tutulur; ekranda ve her kanıtta © OpenStreetMap contributors atfı bulunur. Kamuya dağıtımda türetilmiş veritabanı lisans yükümlülükleri ayrıca korunmalıdır.
- Eski sabit pilot ayrı sekmelerde, geçmiş çalışma olarak etiketlenmiştir.
- Ücretli API, LLM çağrısı, Google puanı filtresi, Supabase yazması, canlı site değişikliği, push veya deployment yoktur.
- Genel web arama API erişimi yapılandırılmadı. Kaynak kapsamı sınırlı; bütün şubelerin güncel faaliyet durumu, doğru fiziksel adresi ve kahve uzmanlığı henüz kesinleştirilmiş değildir. Ürün kalite sıralaması sonraki aşamadır.

## Testler

- `npm run typecheck`
- `npm run build`
- `node scripts/verify_research.cjs`: normalizasyon, şube ayrımı, tekrarlar, kaynak tarihleri, robots/erişim hatası, eksik bilgi, kapalı/çelişkili kayıtlar, SSRF koruması, JSON/CSRF/Auth ve yerel çalışma kısıtları.
- `node scripts/verify_pilot_security.cjs`: mevcut pilot erişim ve karar korumaları.
- `node scripts/verify_rls_security.mjs`: canlı veritabanına bağlanmayan izole PGlite güvenlik testi.
- Test içi sahte kaynaklar yalnızca test belleğindedir; araştırma sonuç dosyasına yazılmaz.
