import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TR_SITE_ORIGIN } from '@/lib/gastronomy-v3/geoCatalog';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Yerini Ayır',
  description:
    'Yerini Ayır gastronomi keşif platformu gizlilik politikası, teknik veri işleme esasları ve tercih haklarınız.',
  alternates: {
    canonical: `${TR_SITE_ORIGIN}/gizlilik-politikasi`,
  },
};

export default async function GizlilikPolitikasiPage(props: {
  params?: Promise<{ lang: string }>;
}) {
  const params = props.params ? await props.params : undefined;
  const isEn = params?.lang === 'en';
  const localePrefix = isEn ? '/en' : '/tr';

  if (isEn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: 19.11.2026 · Gastronomy Release</p>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-5">
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Data Controller (Natural Person)</h2>
          <p>
            For the Gastronomy Discovery release of Yerini Ayır, the platform is operated directly by an individual natural-person data controller:
          </p>
          <p>
            <strong>Data Controller:</strong> [İlgili Bilgiler Eklenecektir]<br />
            <strong>Address:</strong> [İlgili Bilgiler Eklenecektir]<br />
            <strong>Email:</strong> info@yeriniayir.com
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Data Processed in the Gastronomy Release</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Connection &amp; Security Data:</strong> Standard HTTP request logs (IP address, browser User-Agent, path, timestamp) processed for network security and statutory access logging.</li>
            <li><strong>Rate-Limit &amp; Abuse Protection:</strong> When calling visitor APIs (e.g., region data endpoint), a daily UTC-salted one-way SHA-256 hash of the IP address and a signed 15-minute <code>HttpOnly</code> cookie (<code>ya_rl_anon</code>) may be processed strictly to prevent traffic floods and share limits fairly on mobile carrier networks.</li>
            <li><strong>Consent Preferences:</strong> Stored locally in your browser&apos;s <code>localStorage</code> under <code>cookie-consent-granular</code>.</li>
            <li><strong>In-Browser Location Matching (GPS):</strong> If you explicitly click &quot;Use My Location&quot; inside the region picker, browser geolocation coordinates are matched 100% client-side in your browser against region boundaries and are <strong>never sent to or saved on Yerini Ayır servers</strong>.</li>
            <li><strong>Optional Analytics (Opt-In Only):</strong> Google Analytics 4 (with IP anonymization) and Microsoft Clarity scripts are loaded <strong>only</strong> after your explicit consent via the Cookie Banner/Settings.</li>
            <li><strong>Voluntary Email Contact:</strong> If you email <code>info@yeriniayir.com</code>, your email address and message content are used solely to reply to your inquiry or legal request.</li>
          </ul>
          <p>
            This release consists solely of read-only gastronomy discovery pages with no user accounts, comment boxes, subscription lists, online payments, or checkout forms.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Cookies and Third-Party Providers</h2>
          <p>
            Details of strictly necessary vs. consent-gated analytics cookies and withdrawal steps are explained in our{' '}
            <Link href={`${localePrefix}/cerez-politikasi`} className="text-red-600 underline">Cookie Policy</Link>. Infrastructure providers (such as Vercel hosting/CDN, Upstash rate-limit counters, and opt-in analytics providers Google and Microsoft) may process limited technical data on servers located abroad; cross-border compliance details are detailed in the{' '}
            <Link href={`${localePrefix}/kvkk-aydinlatma-metni`} className="text-red-600 underline">KVKK Disclosure</Link>. Clicking external Google Maps direction links takes you to Google&apos;s own service.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Security Measures &amp; Your Rights</h2>
          <p>
            Transport encryption (HTTPS), HSTS/CSP headers, signed HMAC fairness tokens, and daily salted IP hashing are used to minimize stored data. Under Law No. 6698 (KVKK Article 11), you may contact <strong>info@yeriniayir.com</strong> to exercise your rights of access, correction, deletion, objection, and withdrawal of analytics consent (or use <a href="#cerez-ayarlari" className="text-red-600 underline">Cookie Preferences</a>).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Gizlilik Politikası</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="font-semibold text-gray-900">Son Güncelleme: 19.11.2026</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Veri Sorumlusu ve Kapsam</h3>
        <p>
          Bu Gizlilik Politikası, YeriniAyir.com (&quot;Platform&quot;) üzerinde sunulan yalnızca yerel gastronomi keşif hizmetini kapsar. Platform, ilk yayın döneminde tüzel kişi sıfatı taşımaksızın <strong>gerçek kişi veri sorumlusu</strong> tarafından bireysel olarak işletilmektedir.
        </p>
        <p className="mt-2">
          <strong>Gerçek Kişi Veri Sorumlusu:</strong> [İlgili Bilgiler Eklenecektir]<br />
          <strong>Tebligata Elverişli Adres:</strong> [İlgili Bilgiler Eklenecektir]<br />
          <strong>İletişim E-postası:</strong> info@yeriniayir.com
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Mevcut Gastronomi Sürümünde İşlenen Veriler</h3>
        <p>Platform’da kullanıcı üyeliği, yorum alanı, ticari ileti aboneliği, sipariş formu veya ödeme ekranı bulunmamaktadır. Ziyaretiniz sırasında yalnızca aşağıdaki sınırlı işlemler gerçekleşir:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Bağlantı ve İşlem Güvenliği Kayıtları:</strong> Sayfa erişimlerinde sunucu ve barındırma altyapısı tarafından standart HTTP bağlantı kayıtları (IP adresi, tarayıcı bilgisi/User-Agent, talep edilen URL yolu ve zaman damgası) işlenebilir.</li>
          <li><strong>Hız Sınırı (Rate-Limit) ve Kötüye Kullanım Koruması:</strong> Bölge veri servisi gibi ziyaretçi API uç noktalarına yapılan isteklerde, ortak mobil ağ (CGNAT) adaletini ve otomatik saldırı savunmasını sağlamak amacıyla IP adresi günlük UTC tarihiyle tuzlanmış tek yönlü özetleme (<code>SHA-256</code>) yöntemiyle işlenir; yalnızca bu teknik doğrulama için 15 dakika süreli imzalı ve kimlik içermeyen <code>ya_rl_anon</code> çerezi verilebilir. Statik/önbellekli gastronomi HTML sayfalarında bu çerez üretilmez.</li>
          <li><strong>Tarayıcı İçi Konum Eşleştirme (GPS):</strong> Bölge seçici içinde kendi isteğinizle &quot;Konumumu Kullan&quot; seçeneğine tıklamanız ve tarayıcı izni vermeniz hâlinde enlem-boylam bilgisi yalnızca cihazınızdaki tarayıcı belleğinde en yakın semti önermek amacıyla kullanılır; <strong>konum koordinatlarınız Yerini Ayır sunucularına gönderilmez ve kaydedilmez</strong>.</li>
          <li><strong>Bölge ve Kategori Filtreleri:</strong> Arama ve kategori seçimleri sayfa URL’si veya tarayıcı içi önbellek üzerinden çalışır; ziyaretçiye bağlı kalıcı arama geçmişi veya kullanıcı profili oluşturulmaz.</li>
          <li><strong>Rıza Kaydı ve İsteğe Bağlı Analitik:</strong> Çerez tercihleriniz tarayıcınızın <code>localStorage</code> alanında (<code>cookie-consent-granular</code>) saklanır. Google Analytics 4 ve Microsoft Clarity yalnızca açık rızanızla yüklenir; rıza vermeden analitik çerezleri etkinleştirilmez.</li>
          <li><strong>Gönüllü E-posta Başvuruları:</strong> <code>info@yeriniayir.com</code> adresine hatalı bilgi bildirimi veya yasal başvuru göndermeniz hâlinde e-posta adresiniz ve mesaj içeriğiniz yalnızca başvurunuzu yanıtlamak amacıyla işlenir.</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Üçüncü Taraf Sağlayıcılar ve Harici Bağlantılar</h3>
        <p>
          Kişisel verileriniz satılmaz ve ticari pazarlama listelerine aktarılmaz. Platform’un yayınlanması ve güvenliği için barındırma/CDN (Vercel), kısa süreli özetlenmiş hız sınırı sayacı (Upstash), güvenlik/yönetim altyapısı (Supabase) ve yalnızca açık rızanız hâlinde analitik sağlayıcılar (Google LLC / Google Analytics 4 ve Microsoft Corporation / Microsoft Clarity) teknik hizmet sağlayıcı olarak görev alabilir.
        </p>
        <p className="mt-2">
          Mekân kartlarındaki Google Maps yol tarifi bağlantılarına tıkladığınızda Platform dışına çıkarsınız ve ilgili harita hizmeti Google’ın kendi gizlilik politikasına tabi olur.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Saklama Süreleri ve Çerez Tercihleri</h3>
        <p>
          <code>ya_rl_anon</code> çerezi en fazla 15 dakika, günlük özetlenmiş rate-limit sayacı en fazla 24 saat (pencere içi 10–60 saniye), 5651 sayılı Kanun ve erişim güvenliği logları ise ilgili mevzuatta ve teknik barındırma süreçlerinde öngörülen sürelerle (en fazla 2 yıl) sınırlı olarak tutulur. E-posta başvuruları sonuçlandırıldıktan sonra zamanaşımı ve yasal ispat sürelerince saklanır.
        </p>
        <p className="mt-2">
          Çerezlerin ayrıntılarını <Link href={`${localePrefix}/cerez-politikasi`} className="text-red-600 underline">Çerez Politikası</Link> sayfasında inceleyebilir, tercihlerinizi <a href="#cerez-ayarlari" className="font-bold underline hover:text-red-600">Çerez Tercihleri</a> üzerinden her an değiştirebilirsiniz.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Veri Güvenliği Tedbirleri</h3>
        <p>
          Veri minimizasyonu ilkesi gereği kimlik hesabı veya ödeme verisi toplanmaz. Platform’da HTTPS şifreli iletişim, güvenlik başlıkları (CSP/HSTS), HTML sayfalarından çerez izolasyonu, imzalı kısa ömürlü token yapısı ve tek yönlü özetlenmiş IP işleme gibi teknik tedbirler uygulanır. İnternet üzerinden veri iletimine özgü yapısal riskler sebebiyle hiçbir çevrim içi sistemde mutlak dokunulmazlık vaadi verilmese de gerekli teknik özen sürekli gözetilir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Haklarınız ve İletişim</h3>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 11. maddesi kapsamındaki tüm haklarınızı kullanmak ve ayrıntılı yasal bilgilendirmeyi incelemek için <Link href={`${localePrefix}/kvkk-aydinlatma-metni`} className="text-red-600 underline">KVKK Aydınlatma Metni</Link> sayfamızı ziyaret edebilir, taleplerinizi <strong>info@yeriniayir.com</strong> adresine iletebilirsiniz.
        </p>
      </div>
    </div>
  );
}
