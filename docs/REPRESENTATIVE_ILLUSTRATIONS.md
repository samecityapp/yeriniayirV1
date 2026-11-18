# Premium temsili illüstrasyon sistemi

31 Ekim 2026. Yalnız `feat/gastronomy-ui-integration` çalışma alanında uygulandı. Birleşik önizleme: http://127.0.0.1:3300/tr?region=moda&category=kahve

## Teslim

- Altı kategori: kahve, hamburger, pizza, kahvaltı, tatlı/pastane, yöresel yemek.
- Kahve için dört ayrı kompozisyon; diğer beş kategori için birer çizim; bilinmeyen kategoriler için bir genel gastronomi çizimi: **10 yeni SVG**.
- Toplam **14.350 bayt**; en büyük dosya **2.018 bayt**. Vektörler responsive, harici font/görsel/script içermiyor.
- Krem/beyaz zemin, az sayıda mavi vurgu, çizgisel konturlar ve düz renkler. Gerçek mekan, tabela, iç mekan veya doğrulanmış spesifik ürün görüntüsü taklit edilmiyor. Kahve araçları/yiyecek şekilleri yalnız kategori simgeleri; mekanda o ürün/ekipman bulunduğu iddiası değil.
- Her kullanımda `VenueImage` bileşeni görünür, en az 11px **Temsili görsel** etiketi koyar. SVG başlığı ve alternatif metin de temsili niteliği belirtir. Varlığı bileşen dışına taşıyan gelecekteki tasarımlar aynı görünür etiketi korumalıdır.
- Moda'daki dört işletme, genel kategori bazlı ve çakışma önleyici atama sayesinde dört farklı kahve kompozisyonu kullanıyor. İşletme adına özel kural yok; kimliğe göre kararlı atama, manuel sıralama değişince aynı görseli korur.
- Altı kategori görsel altyapısı hazırlanması altı gerçek araştırma kategorisi yayımlandığı anlamına gelmez. Gerçek yerel kapsam hâlâ yalnız Moda / Kahve ve mevcut dört mekan.

## Uygulama ve hata davranışı

`scripts/generate_gastronomy_illustrations.py` özgün SVG geometrisini yeniden üretebilir. İnternetten fotoğraf/vektör, ikon paketi veya görsel dosyası indirilmedi. Yeni bağımlılık/model/API çağrısı yok. İzin dayanağı kullanıcı tarafından yetkilendirilen özgün proje çizimidir; kaynağı, dosyası, hash'i, kategorisi, tarihi ve atıf bilgisi `lib/pilot/images/illustration-assets.json` içinde. Önceki tekil SVG ve eski hak kaydı `legacyAssets` bölümünde korunur. Gerçek fotoğraf kaynak ve izin araştırma kayıtları değiştirilmedi.

`lib/food/illustrations.ts` saf kategori kataloğu, Türkçe/İngilizce eşleştirme ve kararlı varyant atamasını sağlar. Asıl araştırma veya seçim motoruna müdahale etmez.

`components/food/VenueImage.tsx` kart ve bottom sheet tarafından ortak kullanılır:

1. Fotoğraf yoksa kategori illüstrasyonu seçilir.
2. Birincil görsel yüklenemezse yerel kategori illüstrasyonuna geçilir.
3. Yerel SVG de yüklenemezse aynı kategori için sayfa içinde SVG çizilir. Böylece kırık resim veya boş gri kutu kalmaz.
4. Yedek görsele geçişte etiket ve alternatif metin temsili olarak kalır.

Gelecek gerçek fotoğraf için sunum sözleşmesi `rights-cleared-photo` türünü ve gerektiğinde atıfları destekler. Mevcut sunucu adaptörü, izin ve şube doğrulaması tamamlanana kadar rastgele fotoğraf URL'sini kabul etmez ve yalnız kendi SVG kataloğunu aktarır. Bu görev gerçek fotoğraf/Google Photos hattını etkinleştirmedi. Yeni fotoğraf bağlanmadan önce önceki hak denetimi koşulları, şube eşleşmesi, gereken atıflar ve sağlayıcının saklama kuralları tamamlanmalıdır; tür adı tek başına izin belgesi değildir. Fotoğraf modunda Next kalıcı görsel optimizasyonu kullanılmaz.

## Doğrulama

- TypeScript ve production build başarılı. Ağ korumasıyla üretim/ücretli servis erişimi engellendi; sunucu yalnız 127.0.0.1:3300 üzerinde.
- Değişen bileşen/katalog/adaptör dosyalarında lint hatası veya uyarısı yok. Önceki tam proje taramasındaki 54 eski hata bu görev kapsamında değiştirilmedi; tüm proje lint temizliği iddia edilmiyor.
- İllüstrasyon politikası: **6 kontrol**; kategori eşleşmesi, varyantlar, boyutlar/hash/köken, kararlı sıra, 100 adaylık yeniden kullanım ve tarihsel kayıt koruması.
- Gerçek veri adaptörü: **5 kontrol**; dört farklı mevcut yerel varlık, gerçek kimlik/sıra, menü/tavsiye ayrımı, demo ve lisanssız kaynak sızıntısı olmaması.
- Yeni tarayıcı testleri: **8 kontrol**; 375/390/430/1440 px, dört farklı yüklenen görsel, okunabilir etiketler, etiket/başlık/kapatma çakışmaması, tüm 10 SVG için 200 yanıtı, zorlanmış ağ hatasında dört kart ve detayda satır içi yedek, kategori ailesi görsel denetimi ve dış ağ/JS hatası olmaması.
- Koruma kontrolleri: entegrasyon veri sınırı **5**, resmi Google puan politikası **6**, ürün/manuel kayıt koruması **3**, önceki fotoğraf kaynak denetimi **6**, pilot güvenlik **48** başarılı.
- Gerçek fotoğraflar hâlâ doğrulanmış kullanım iznine sahip değil; Google puanları hâlâ doğrulanmadığı için gizli. Bu görsel çalışması bunları doldurmuş gibi göstermez.

Ekran görüntüleri `work/illustrations/browser/` içindedir. Görsel aile sayfası yalnız test çıktısıdır, yeni bir ziyaretçi kategorisi veya demo mekan yayımlamaz. Antigravity kaynak klasörü aynı commit'te temiz kaldı; Codex orijinal klasörüne yazılmadı. Araştırma, denetçi ve manuel karar dosyalarının hash'leri korundu. Push, deployment veya üretim veritabanı işlemi yapılmadı.
