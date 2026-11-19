import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TR_SITE_ORIGIN } from '@/lib/gastronomy-v3/geoCatalog';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | Yerini Ayır',
  description:
    'Yerini Ayır yerel gastronomi keşif platformu kullanım koşulları, bilgilendirme sınırları ve tarafların sorumlulukları.',
  alternates: {
    canonical: `${TR_SITE_ORIGIN}/kullanim-kosullari`,
  },
};

export default async function KullanimKosullariPage(props: {
  params?: Promise<{ lang: string }>;
}) {
  const params = props.params ? await props.params : undefined;
  const isEn = params?.lang === 'en';
  const localePrefix = isEn ? '/en' : '/tr';

  if (isEn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Terms of Use</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: 19.11.2026 · Gastronomy Discovery Release (Turkish text governs under Republic of Turkey law)
        </p>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-5">
          <p>
            Yerini Ayır (&quot;Platform&quot;) is an independent neighborhood and city gastronomy discovery guide operated by a natural person (&quot;Site Operator&quot;). By accessing or browsing the Platform, you agree to these Terms of Use.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Operator Status and Scope</h2>
          <p>
            Yerini Ayır is operated directly by an individual natural person rather than a registered legal entity. Mandatory statutory identity details not yet supplied for publication are marked honestly below until pre-launch verification is finalized:
          </p>
          <p>
            <strong>Natural Person Operator:</strong> [İlgili Bilgiler Eklenecektir]<br />
            <strong>Contact Address:</strong> [İlgili Bilgiler Eklenecektir]<br />
            <strong>Email:</strong> info@yeriniayir.com
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Nature of Gastronomy Service (Discovery Only)</h2>
          <p>
            The Platform provides city, district, and neighborhood restaurant, cafe, bakery, and culinary spot selections; editorial notes; order/dish highlights; street-level location summaries; category and location filters; and external map direction links. Yerini Ayır does <strong>not</strong> process table-holding, food orders, online payments, or brokerage transactions. Any visit, dining experience, menu choice, or agreement happens directly between the visitor and the independent venue.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Accuracy of Venue Information and Error Reporting</h2>
          <p>
            Opening status, menus, portion standards, pricing levels, seating arrangements, or ownership of restaurants and cafes may change over time. Editorial summaries are prepared for informational guidance only. If you notice closed venues, outdated addresses, or inaccurate details, please report them to <strong>info@yeriniayir.com</strong> for review and correction.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Third-Party Links and External Maps</h2>
          <p>
            Venue cards may contain external links (such as <code>maps.google.com</code> directions or official venue websites). Once you leave Yerini Ayır, the terms and privacy policies of those third-party services apply independently.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Editorial Independence and Sponsorship Transparency</h2>
          <p>
            Paid placements, sponsored venue rankings, and commission-based sales links are <strong>not active</strong> in this Gastronomy release. Should sponsored content ever be introduced in the future, it will be clearly labeled in compliance with applicable advertising rules.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Intellectual Property and Acceptable Use</h2>
          <p>
            Original selection texts, compilation structure, interface code, and Platform-authored illustrations belong to the Site Operator or respective licensors. Automated scraping, bulk copying, denial-of-service attempts, or unlawful use are prohibited. Nothing in these Terms waives mandatory consumer or statutory rights that cannot be excluded under Turkish law.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. Privacy, KVKK, and Cookies</h2>
          <p>
            Information about limited technical data processing and optional analytics preferences is set out in our{' '}
            <Link href={`${localePrefix}/gizlilik-politikasi`} className="text-red-600 underline">Privacy Policy</Link>,{' '}
            <Link href={`${localePrefix}/kvkk-aydinlatma-metni`} className="text-red-600 underline">KVKK Disclosure</Link>, and{' '}
            <Link href={`${localePrefix}/cerez-politikasi`} className="text-red-600 underline">Cookie Policy</Link>.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">8. Governing Law and Contact</h2>
          <p>
            These Terms are governed by the laws of the Republic of Turkey, without prejudice to mandatory jurisdiction rules under consumer or statutory protections. Inquiries and correction requests may be sent to <strong>info@yeriniayir.com</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Kullanım Koşulları</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="font-semibold text-gray-900">Son Güncelleme: 19.11.2026</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Taraflar, Kapsam ve İşletmeci Statüsü</h3>
        <p>
          Bu Kullanım Koşulları (&quot;Koşullar&quot;), YeriniAyir.com alan adlı internet sitesinin (&quot;Platform&quot;) kullanımına ilişkindir. Yerini Ayır’ın ilk yayın döneminde yalnızca gastronomi keşif hizmeti sunulmaktadır ve Platform <strong>gerçek kişi site işletmecisi</strong> (&quot;İşletmeci&quot;) tarafından bireysel olarak yürütülmektedir. Platform’u ziyaret eden veya içeriklerinden yararlanan herkes (&quot;Kullanıcı&quot;) aşağıdaki esaslar çerçevesinde Platform’u kullanmayı kabul eder.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Sunulan Gastronomi Hizmetinin Niteliği</h3>
        <p>
          Platform; Türkiye genelinde il, ilçe, semt ve kategori bazlı bağımsız restoran, kafe, fırın ve yerel lezzet duraklarının keşfedilmesine yönelik editöryal mekân seçkileri, kısa tanıtım notları, sipariş/ürün önerileri, sokak seviyesi adres bilgileri, bölge-kategori filtreleri ve Google Maps yol tarifi bağlantıları sunar.
        </p>
        <p className="mt-2">
          Platform bir yeme-içme işletmesi, aracılık platformu veya ödeme kuruluşu değildir. Yerini Ayır üzerinden masa ayırtma, paket/sipariş satışı, bilet satışı veya çevrim içi ödeme işlemi yapılmaz; ziyaret edilen mekândaki hizmet, fiyat ve kalite doğrudan ilgili işletmenin sorumluluğundadır.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. İşletme Bilgilerinin Değişebilirliği ve Hata Bildirimi</h3>
        <p>
          Mekânların çalışma durumları (kapanma, taşınma, sezonluk ara), servis saatleri, menü içerikleri, fiyat seviyeleri ve oturma düzenleri zaman içerisinde ilgili işletmeler tarafından değiştirilebilir. Platform’daki bilgiler yayın/doğrulama tarihi esaslı bilgilendirme niteliğindedir.
        </p>
        <p className="mt-2">
          Kapanmış, el değiştirmiş veya adres/kategori bilgisi güncelliğini yitirmiş bir mekân tespit etmeniz hâlinde <strong>info@yeriniayir.com</strong> adresine bildirimde bulunabilirsiniz; iletilen bildirimler incelenerek gerekli güncellemeler yapılır.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Üçüncü Taraf Bağlantıları ve Yol Tarifi Yönlendirmeleri</h3>
        <p>
          Mekân kartlarında ve detay sayfalarında Google Maps yol tarifi bağlantıları (<code>maps.google.com</code>) veya işletmelere ait harici bağlantılar bulunabilir. Kullanıcı bu bağlantılara tıklayarak Platform dışına çıktığında, yönlendirilen üçüncü taraf platformun kendi kullanım koşulları ve gizlilik politikaları geçerli olur.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Sponsorluk ve Ücretli Tanıtım Şeffaflığı</h3>
        <p>
          Platform’un mevcut gastronomi yayınında ücretli mekân listelemesi, sponsorlu öne çıkarma veya satış komisyonuna dayalı yönlendirme özelliği <strong>aktif değildir</strong>. İleride sponsorlu içerik veya reklam niteliğinde bir uygulama devreye alınırsa ilgili alanlarda açık ve anlaşılır biçimde belirtilecektir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Kullanıcı Yükümlülükleri ve Yasaklı İşlemler</h3>
        <p>Kullanıcı, Platform’u yalnızca hukuka uygun ve kişisel bilgilendirme amacıyla kullanmayı kabul eder. Bu kapsamda;</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Platform’un çalışmasını aksatacak otomatik istek, bot saldırısı veya yetkisiz toplu veri çekme (scraping) faaliyetlerinde bulunmamayı,</li>
          <li>Üçüncü kişilerin haklarını veya yürürlükteki mevzuatı ihlal eden girişimlerden kaçınmayı,</li>
          <li>Mekâna gitmeden önce özellikle çalışma saati veya güncel menü gerektiren durumlarda işletmenin kendi güncel duyurularını da kontrol etmeyi</li>
        </ul>
        <p className="mt-2">gözetir.</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. Fikri Mülkiyet ve Görsel Kullanım Hakları</h3>
        <p>
          5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında Platform’daki özgün editöryal seçki metinleri, kategori/bölge derleme yapısı, arayüz tasarımı, yazılım bileşenleri ve proje bünyesinde üretilmiş özgün illüstrasyonlar İşletmeci’ye veya ilgili lisans/hak sahiplerine aittir. Kaynak gösterilmeden ticari amaçla çoğaltılamaz ve dağıtılamaz. Hak sahipliği iddiasına ilişkin talepler için <strong>info@yeriniayir.com</strong> adresine başvurulabilir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">8. Sorumluluk Sınırı ve Yasal Hakların Saklılığı</h3>
        <p>
          İşletmeci, Platform içeriklerinin özenle hazırlanması için çaba gösterir; ancak teknik bakım, altyapı kesintisi veya üçüncü taraf veri/işletme değişikliklerinden kaynaklanan dolaylı uyuşmazlıklardan mevzuatın izin verdiği ölçüde sorumlu değildir. Bu Koşullardaki hiçbir hüküm, Kullanıcının Türk Borçlar Kanunu ve ilgili mevzuat uyarınca sahip olduğu emredici yasal hakları veya İşletmeci’nin kasıt ve ağır kusurundan doğan sorumluluğunu ortadan kaldırmaz.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">9. Kişisel Veriler ve Çerezler</h3>
        <p>
          Platform kapsamında işlenen sınırlı teknik verilere ve çerez tercihlerinize ilişkin ayrıntılar{' '}
          <Link href={`${localePrefix}/gizlilik-politikasi`} className="text-red-600 underline">Gizlilik Politikası</Link>,{' '}
          <Link href={`${localePrefix}/kvkk-aydinlatma-metni`} className="text-red-600 underline">KVKK Aydınlatma Metni</Link> ve{' '}
          <Link href={`${localePrefix}/cerez-politikasi`} className="text-red-600 underline">Çerez Politikası</Link>{' '}
          sayfalarında yer almaktadır.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">10. Koşullarda Güncelleme, Uygulanacak Hukuk ve İletişim</h3>
        <p>
          Bu Koşullar güncellendiğinde yeni metin güncellenme tarihi ile Platform’da yayımlanır. Uyuşmazlıklarda Türkiye Cumhuriyeti hukuku uygulanır; görevli ve yetkili merciler yönünden ilgili usul hükümleri ile tüketiciye özgü yasal yetki kuralları saklıdır.
        </p>
        <p className="mt-4">
          <strong>Gerçek Kişi Site İşletmecisi:</strong> [İlgili Bilgiler Eklenecektir]<br />
          <strong>Tebligata Elverişli Adres:</strong> [İlgili Bilgiler Eklenecektir]<br />
          <strong>İletişim E-postası:</strong> info@yeriniayir.com
        </p>
      </div>
    </div>
  );
}
