import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TR_SITE_ORIGIN } from '@/lib/gastronomy-v3/geoCatalog';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | Yerini Ayır',
  description:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) m.10 uyarınca Yerini Ayır gerçek kişi veri sorumlusu aydınlatma metni.',
  alternates: {
    canonical: `${TR_SITE_ORIGIN}/kvkk-aydinlatma-metni`,
  },
};

export default async function KVKKAydinlatmaMetniPage(props: {
  params?: Promise<{ lang: string }>;
}) {
  const params = props.params ? await props.params : undefined;
  const isEn = params?.lang === 'en';
  const localePrefix = isEn ? '/en' : '/tr';

  if (isEn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Personal Data Clarification Notice (Law No. 6698 / KVKK)
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: 19.11.2026 · Republic of Turkey Law No. 6698 Art. 10 Disclosure (Turkish text governs)
        </p>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-5">
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Identity of the Natural-Person Data Controller</h2>
          <p>
            In the initial Gastronomy Discovery release of YeriniAyir.com, personal data processing is conducted directly by an individual natural-person data controller:
          </p>
          <p>
            <strong>Natural-Person Data Controller:</strong> [İlgili Bilgiler Eklenecektir]<br />
            <strong>Contact Address:</strong> [İlgili Bilgiler Eklenecektir]<br />
            <strong>Email:</strong> info@yeriniayir.com
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Processing Activities, Categories, Legal Bases &amp; Retention</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>HTTP Security &amp; Access Logs (Transaction Security):</strong> IP address, User-Agent, URL path, timestamp — security continuity and Law No. 5651 obligations (KVKK Art. 5/2(a), 5/2(ç), 5/2(f)), retained up to 2 years per statutory/hosting windows.</li>
            <li><strong>Rate-Limit &amp; Signed <code>ya_rl_anon</code> Cookie (Transaction Security):</strong> Issued only on visitor API requests (`Max-Age=900`, 15 min) plus daily UTC-salted SHA-256 IP hash (`10s–60s` sliding window) for carrier-IP fairness and flood defense (KVKK Art. 5/2(f)).</li>
            <li><strong>Consent Record (`cookie-consent-granular` in `localStorage`):</strong> Remembering cookie acceptance/rejection choices (KVKK Art. 5/2(ç), 5/2(f)).</li>
            <li><strong>In-Browser Geolocation (`Use My Location`):</strong> Strictly optional and processed 100% inside the browser; <strong>never transmitted to or stored on Yerini Ayır servers</strong>.</li>
            <li><strong>Optional Analytics (`GA4` &amp; `Microsoft Clarity`):</strong> Disabled by default (`Consent Mode denied`); loaded <strong>only with explicit consent</strong> (KVKK Art. 5/1) and revocable anytime via <a href="#cerez-ayarlari" className="text-red-600 underline">Cookie Preferences</a>.</li>
            <li><strong>Email Inquiries (`info@yeriniayir.com`):</strong> Answering user corrections or KVKK requests (KVKK Art. 5/2(ç), 5/2(e), 5/2(f)).</li>
          </ul>
          <p>
            No user registration, comment forms, subscription lists, payment forms, or order checkout data exist on the Gastronomy platform.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Recipients &amp; Cross-Border Infrastructure (KVKK Art. 8 &amp; 9)</h2>
          <p>
            Authorized public authorities upon lawful demand; technical infrastructure providers (Vercel hosting/CDN, Upstash short-window rate-limit counter, Supabase backend security); and, <strong>only where explicit analytics consent is granted</strong>, Google LLC (GA4) and Microsoft Corporation (Clarity). Where infrastructure servers are located abroad, transfers remain subject to KVKK Article 9 requirements (no unverified adequacy or registered standard contract claim is made here).
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Data Subject Rights &amp; Application Method (KVKK Art. 11)</h2>
          <p>
            You may exercise all rights under KVKK Article 11 in writing or via e-mail to <strong>info@yeriniayir.com</strong> in accordance with the Communiqué on Principles and Procedures for Application to the Data Controller. Requests are resolved as soon as possible and within 30 days at the latest. For full cookie lists, see our <Link href={`${localePrefix}/cerez-politikasi`} className="text-red-600 underline">Cookie Policy</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">KVKK Aydınlatma Metni</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="font-semibold text-gray-900">Son Güncelleme: 19.11.2026</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Veri Sorumlusunun Kimliği</h3>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) m.10 ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, YeriniAyir.com gastronomi keşif platformu üzerindeki veri işleme faaliyetlerinin veri sorumlusu <strong>gerçek kişi site işletmecisi</strong>dir:
        </p>
        <p className="mt-2">
          <strong>Gerçek Kişi Veri Sorumlusu:</strong> [İlgili Bilgiler Eklenecektir]<br />
          <strong>Tebligata Elverişli Adres:</strong> [İlgili Bilgiler Eklenecektir]<br />
          <strong>E-posta:</strong> info@yeriniayir.com
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. İşlenen Kişisel Veriler, Amaçlar, Hukuki Sebepler ve Saklama Süreleri</h3>
        <p>
          Mevcut gastronomi sürümünde üyelik sistemi, iletişim/yorum formu, ticari ileti aboneliği ve ödeme/sipariş akışı bulunmamaktadır. Yalnızca Platform’un teknik sunumu ve güvenliği kapsamında aşağıdaki gerçek veri işleme faaliyetleri yürütülür:
        </p>

        <div className="overflow-x-auto mt-4 mb-6">
          <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-900 font-bold border-b">
              <tr>
                <th className="px-3 py-2.5">Faaliyet ve Veri Kategorisi</th>
                <th className="px-3 py-2.5">Amaç</th>
                <th className="px-3 py-2.5">Hukuki Sebep (KVKK m.5)</th>
                <th className="px-3 py-2.5">Saklama Süresi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-2.5 align-top">
                  <strong>Erişim ve Güvenlik Logları</strong><br />
                  <span className="text-xs text-gray-500">İşlem güvenliği (IP adresi, User-Agent, URL yolu, zaman damgası)</span>
                </td>
                <td className="px-3 py-2.5 align-top">Sunucu/ağ güvenliği, hata tespiti ve 5651 sayılı Kanun kapsamındaki trafik yükümlülüklerinin yerine getirilmesi.</td>
                <td className="px-3 py-2.5 align-top">Kanunlarda öngörülme (m.5/2-a), hukuki yükümlülük (m.5/2-ç), meşru menfaat (m.5/2-f).</td>
                <td className="px-3 py-2.5 align-top">Mevzuat ve altyapı günlük politikaları uyarınca en fazla 2 yıl.</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 align-top">
                  <strong>Hız Sınırı (Rate-Limit) ve İmzalı Anonim Çerez</strong><br />
                  <span className="text-xs text-gray-500"><code>ya_rl_anon</code> (HMAC imzalı rastgele belirteç) + günlük UTC tuzlu SHA-256 IP özeti</span>
                </td>
                <td className="px-3 py-2.5 align-top">Yalnız ziyaretçi API çağrılarında ortak mobil IP (CGNAT) adaletini sağlama ve bot/yoğunluk saldırılarını önleme (HTML sayfalarında üretilmez).</td>
                <td className="px-3 py-2.5 align-top">Veri sorumlusunun meşru menfaati (m.5/2-f).</td>
                <td className="px-3 py-2.5 align-top"><code>ya_rl_anon</code>: 15 dakika; kayan sayaç penceresi: 10–60 saniye; günlük tuzlu özet anahtarı: 24 saat.</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 align-top">
                  <strong>Çerez Rıza Tercihi</strong><br />
                  <span className="text-xs text-gray-500">Tarayıcı <code>localStorage</code>: <code>cookie-consent-granular</code></span>
                </td>
                <td className="px-3 py-2.5 align-top">Ziyaretçinin kabul/ret beyanını tarayıcıda hatırlama.</td>
                <td className="px-3 py-2.5 align-top">Hukuki yükümlülük (m.5/2-ç) ve meşru menfaat (m.5/2-f).</td>
                <td className="px-3 py-2.5 align-top">Kullanıcı tarayıcı verisini temizleyene veya tercihi değiştirene dek cihazda.</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 align-top">
                  <strong>Tarayıcı İçi Konum Eşleştirme (GPS)</strong><br />
                  <span className="text-xs text-gray-500">Yalnız &quot;Konumumu Kullan&quot; tıklandığında alınan yaklaşık koordinat</span>
                </td>
                <td className="px-3 py-2.5 align-top">Cihazda en yakın gastronomi bölgesini bulma. Sunucuya iletilmez ve veritabanına kaydedilmez.</td>
                <td className="px-3 py-2.5 align-top">Kullanıcı tarayıcı izni (yalnız istemci belleğinde anlık işleme).</td>
                <td className="px-3 py-2.5 align-top">Sunucu tarafında saklanmaz (0 saniye).</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 align-top">
                  <strong>İsteğe Bağlı Analitik Çerezleri</strong><br />
                  <span className="text-xs text-gray-500">Google Analytics 4 (IP anonimleştirmeli) ve Microsoft Clarity (<code>_ga*</code>, <code>_clck</code>, <code>_clsk</code>)</span>
                </td>
                <td className="px-3 py-2.5 align-top">Toplu sayfa görüntüleme ve kullanılabilirlik istatistiklerinin incelenmesi.</td>
                <td className="px-3 py-2.5 align-top"><strong>Açık rıza (m.5/1)</strong> — varsayılan kapalıdır; <a href="#cerez-ayarlari" className="underline">Çerez Tercihleri</a> üzerinden her an geri alınabilir.</td>
                <td className="px-3 py-2.5 align-top">Rıza geri çekilene veya ilgili çerez teknik süresi dolana dek.</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 align-top">
                  <strong>E-posta Başvuruları</strong><br />
                  <span className="text-xs text-gray-500">İletişim (gönderen e-posta adresi ve mesaj içeriği)</span>
                </td>
                <td className="px-3 py-2.5 align-top">Kullanıcının ilettiği hatalı mekân bildirimi, hak talebi veya KVKK başvurularının yanıtlanması.</td>
                <td className="px-3 py-2.5 align-top">Hukuki yükümlülük (m.5/2-ç), hakkın tesisi/korunması (m.5/2-e), meşru menfaat (m.5/2-f).</td>
                <td className="px-3 py-2.5 align-top">Başvuru sonuçlandıktan sonra ilgili yasal zamanaşımı süresince.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Kişisel Verilerin Toplanma Yöntemi</h3>
        <p>
          Kişisel verileriniz; Platform sayfalarını ve API uç noktalarını ziyaretiniz sırasında otomatik elektronik yöntemlerle (HTTP protokol kayıtları, rate-limit doğrulaması, tarayıcı rıza kaydı ve yalnızca açık rızanız hâlinde yüklenen analitik betikleri) veya gönüllü olarak <code>info@yeriniayir.com</code> adresine e-posta göndermeniz yoluyla toplanır. Arama/kategori filtreleri ve &quot;Konumumu Kullan&quot; eşleştirmesi tarayıcınız içinde çalışır; bu seçimler için sunucuda kişisel arama geçmişi veya konum veri tabanı tutulmaz.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Kişisel Verilerin Aktarılması ve Yurt Dışı Sağlayıcılar (KVKK m.8 ve m.9)</h3>
        <p>
          İşlenen sınırlı veriler; mevzuattan doğan yükümlülükler kapsamında yurt içi yetkili kamu kurum ve kuruluşlarına (talep veya kanuni zorunluluk hâlinde) ve Platform’un teknik olarak işletilebilmesi için aşağıdaki altyapı/hizmet sağlayıcılara aktarılabilir:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Barındırma, İçerik Dağıtımı ve Güvenlik Altyapısı:</strong> Vercel (web barındırma ve erişim kayıtları), Upstash (kısa süreli tek yönlü özetlenmiş hız sınırı sayaçları) ve Supabase (yönetim/güvenlik veri altyapısı).</li>
          <li><strong>İsteğe Bağlı Analitik Sağlayıcıları:</strong> Yalnızca çerez yönetiminden açık rıza vermeniz hâlinde Google LLC (Google Analytics 4) ve Microsoft Corporation (Microsoft Clarity).</li>
          <li><strong>Harici Harita Bağlantısı:</strong> Google Maps yol tarifi bağlantılarına kullanıcının kendi tercihiyle tıklaması hâlinde Google LLC’nin kendi platformuna geçiş gerçekleşir.</li>
        </ul>
        <p className="mt-2">
          Belirtilen bulut ve analitik sağlayıcıların sunucularının yurt dışında bulunabilmesi sebebiyle oluşabilecek aktarımlar, 6698 sayılı KVKK’nın 9. maddesi kapsamındaki yasal aktarım rejimine tabidir. Henüz Kurul nezdinde tescil edilmiş standart sözleşme veya yeterlilik kararına dayalı bir güvence tesis edilmeden açık rızaya dayalı analitik araçları varsayılan olarak kapalı tutulmaktadır; ilgili altyapı sözleşmelerinin yayın öncesi hukuki değerlendirme kontrolü yürütülmektedir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. İlgili Kişinin KVKK m.11 Kapsamındaki Hakları</h3>
        <p>KVKK’nın 11. maddesi uyarınca veri sorumlusuna başvurarak;</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
          <li>KVKK m.7 çerçevesinde silinmesini veya yok edilmesini isteme,</li>
          <li>Düzeltme ve silme/yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme,</li>
          <li>Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
        </ul>
        <p className="mt-2">haklarına sahipsiniz.</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Başvuru Yöntemi</h3>
        <p>
          KVKK m.11 kapsamındaki taleplerinizi, <em>Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ</em> uyarınca ad-soyad, iletişim ve talep konusunu içeren başvurunuzu <strong>info@yeriniayir.com</strong> e-posta adresine veya kimlik teyidine elverişli yazılı kanal üzerinden yukarıda belirtilen tebligat adresine iletebilirsiniz. Başvurular talebin niteliğine göre en kısa sürede ve en geç <strong>30 gün</strong> içinde ücretsiz olarak sonuçlandırılır (işlemin ayrıca maliyet gerektirmesi hâlinde KVK Kurulu tarifesindeki ücret saklıdır).
        </p>
        <p className="mt-2">
          Çerez tercihlerinize ilişkin ayrıntılar için{' '}
          <Link href={`${localePrefix}/cerez-politikasi`} className="text-red-600 underline">Çerez Politikası</Link> sayfasını inceleyebilirsiniz.
        </p>
      </div>
    </div>
  );
}
