# AI Kalite Denetçisi — izole Moda kahve pilotu

30 Ekim 2026. Ürün kararı PRODUCT_DECISIONS.md bölüm 5'tedir. Bu modül mevcut seçimin doğruluğunu varsaymaz. Tam bağımsız AI ürün/tadım araştırması henüz çalışmıyor: model ve arama sağlayıcısı bağlı değil. Ücretsiz, sabit izinli kaynak adaptörleriyle yeniden kaynak okuma ve olgusal karşılaştırma çalışır. İlk araştırmayla aynı yayın ailesinin tekrar okunması yeni bağımsız kanıt sayılmaz.

## Veri yolu ve izolasyon

Yönetici → kimlik doğrulamalı `/tr/moda-kadikoy-pilot/auditor` → kapsam planlayıcısı → kalıcı iş kuyruğu → ayrı kaynak adaptörleri → yedi alanın karşılaştırılması → denetim raporu ve isteğe bağlı izole düzeltme katmanı.

Ana katalog yalnızca kontrol hedefidir; kalite/işletme açık bilgisi olarak güvenilmez. Manuel ve önceki çalışmalardan korunmuş kayıtlar da kontrol girdisine alınır. Mevcut keşif, kalite ve yönetim dosyalarına yazılmaz. Denetim durumu `work/quality-auditor/state.json` içinde tutulur, Git dışında kalır. Denetim düzeltmeleri ana seçki/yayın tüketicilerine bağlanmamıştır. Production/VERCEL üzerinde mutasyon reddedilir. API admin kimliğini bağımsız doğrular; POST aynı origin ve localhost gerektirir. Sayfa açılması ve GET/polling araştırma başlatmaz.

## Kaynaklar ve kanıt sınırları

- OpenStreetMap/Overpass: Moda sınır kutusunda mevcut ve liste dışı kahve sinyalleri; ODbL atfı korunur. Harita tutarlılığı bağımsız faaliyet/kalite teyidi değildir. Kapanış etiketi çelişki oluşturur, tek başına kapanış kararı verilmez.
- Story ve Montag resmi şube sayfaları: adres/şube olguları. Harita ile aynı sokak/kapı/marka/konum varsa kısmi kimlik teyidi.
- Barista Magazine: adlandırılan işletmeler ve ürün adları; yayın tarihi ayrı, bilinmeyen deneyim tarihi null. Yeni bir tadım yapılmış gibi sunulmaz.
- HTML öncesi robots kontrolü; 403/429 veya robots engeli aşılmaz, yönlendirme takip edilmez. Yanıt 2 MB ile sınırlı; ham telifli sayfa/yorum/fotoğraf saklanmaz. Kaydedilenler yapılandırılmış olgu, URL, aile, tarih, parmak izi ve hatadır.

29 Ekim UTC / 30 Ekim Türkiye ilk gerçek işinde 95 aday kontrol edildi. Üç denemede Overpass HTTP 502, Montag HTTP 429 verdi; Story ve Barista okundu. 0 tam doğrulama, 0 güvenli gerçek düzeltme ve 0 yeni güçlü aday. Bu eksikler başarılı kalite doğrulaması gibi gösterilmez. Ana araştırma dosyalarının SHA-256 değerleri değişmedi.

## Ölçekleme ve bütçe

Coğrafi kayıt ilk pilotta İstanbul'un 39 ilçesi ve Kadıköy'ün 21 mahallesiyle sınırlıdır. İl seçimi ilçelere, Kadıköy mahallelere ayrılır. Yedi kategoride İstanbul 273 plan işi üretir; plan üst sınırı 300'dür. Diğer illerin kayıtları/adaptörleri henüz yoktur. Yalnızca açıkça seçilen Moda/kahve işi çalışabilir; diğer kapsamlar plan durumunda kalır ve ağ isteği yapmaz. Türkiye çapında tarama yoktur.

İş başına en fazla 8 HTTP isteği (robots dahil), 90 saniye, 120 mevcut ve 30 yeni aday, 10 düzeltme; eşzamanlı tek iş. Kaynak başarılı/engelli önbelleği 24 saat, geçici hata 60 saniye. ETag/Last-Modified desteklenir. Değişmeyen kaynaklar ve aynı karşılaştırma parmak izi tekrar kullanılır; eski kaynak/deneyim tarihi yenilenmez.

Atomik dosya değişimi ve kısa yazma kilidi kayıp güncellemeyi engeller. Kaynak okuma kilit dışında yapılır. Kalıcı 120 saniyelik lease ve token kontrolü, eski çalışanın yeni işi ezmesini engeller. Süresi geçen iş kurtarılır; başarısız/kısmi işler 60 saniyeden başlayan üstel bekleme ile en fazla üç kez denenir. Son tamamlanan ve son başarılı kaynak kontrol tarihleri ayrıdır; teknik kaynak başarısı tam kalite teyidi değildir.

`node scripts/auditor-worker.cjs --watch` yerel işçiyi çalıştırır; tek sefer için bayraksız kullanılır. Haftalık plan varsayılan olarak kapalıdır. Panelden açılırsa yalnızca Moda/kahve üretir; bilgisayar ve işçi açık olmalıdır. Türkiye ölçeğinde dağıtık kuyruk/coğrafi kayıt/sağlayıcı bağlantısı sonraki adımdır; mevcut dosya deposu çok sunuculu üretim deposu değildir.

## Düzeltme ve geri alma

Pilot yalnızca iki kaynakla aynı şubeye bağlanan ad/adres boşluk biçimini düzeltebilir. Ürün kalitesi, faaliyet, kategori, taşınma, kapanma veya yayın kararı otomatik değiştirilmez. İş başlangıcı/sonu şube kimliği değişmişse düzeltme atlanır. Manuel eklenen/çıkarılan işletmeye otomatik düzeltme uygulanmaz; sonradan gelen manuel tercih eski katmanı da maskeler.

Her düzeltme önce/sonra değeri ve kaynaklarıyla kaydedilir. Geri alma yeni olay ekler; geçmişi silmez. Sonraki düzeltmeyle çelişen geri alma reddedilir. Geri alınan aynı düzeltmenin tekrar uygulanması bastırılır. Gerçek veride düzeltme bulunmadı; olumlu düzeltme/geri alma yolları yalnızca bellekte ve silinen geçici test dizininde sınandı.

## Doğrulama

- `node scripts/verify_auditor.cjs`: kaynak/parçalama, robots/403, bütçe/önbellek, şube ve kanıt güvenliği.
- `node scripts/verify_auditor_persistence.cjs`: gerçek dosya deposu üzerinde izole kuyruk/lease/düzeltme/undo/manuel koruma.
- `node scripts/verify_auditor_api.cjs`: gerçek route üzerinde auth/CSRF/production engeli ve planın ağ başlatmaması.
- `node scripts/verify_auditor_browser.cjs`: localhost yönetici sekmesi, gerçek rapor, salt okunur açılış, güvenli buton ve mobil görünüm.
- TypeScript, mevcut pilot regresyonları ve üretim derlemesi ayrıca çalıştırılır. Canlı servis erişimi yerel ağ korumasıyla engellenir.

Coğrafya referansları: [İstanbul resmî ilçe listesi](https://istanbul.ktb.gov.tr/TR-276146/ilceler.html), [Kadıköy açık mahalle sınırları](https://acikveri.kadikoy.bel.tr/en/dataset/kadikoy-ilcesindeki-mahalle-sinirlari).
