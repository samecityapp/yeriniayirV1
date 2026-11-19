import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TR_SITE_ORIGIN } from '@/lib/gastronomy-v3/geoCatalog';

export const metadata: Metadata = {
  title: 'Çerez Politikası | Yerini Ayır',
  description:
    'Yerini Ayır gastronomi platformunda kullanılan zorunlu ve rızaya dayalı analitik çerezler ile tercih yönetimi.',
  alternates: {
    canonical: `${TR_SITE_ORIGIN}/cerez-politikasi`,
  },
};

export default async function CerezPolitikasiPage(props: {
  params?: Promise<{ lang: string }>;
}) {
  const params = props.params ? await props.params : undefined;
  const isEn = params?.lang === 'en';
  const localePrefix = isEn ? '/en' : '/tr';

  if (isEn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: 19.11.2026 · Gastronomy Release</p>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-5">
          <p>
            This Cookie Policy accurately reflects the cookies and browser storage technologies used in the active Gastronomy Discovery release of Yerini Ayır.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Strictly Necessary Technologies (Active Without Marketing Tracking)</h2>
          <div className="overflow-x-auto mt-4 mb-6">
            <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-900 font-bold border-b">
                <tr>
                  <th className="px-3 py-2.5">Name / Technology</th>
                  <th className="px-3 py-2.5">Category &amp; Legal Basis</th>
                  <th className="px-3 py-2.5">Exact Purpose in Code</th>
                  <th className="px-3 py-2.5">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2.5 font-medium"><code>ya_rl_anon</code><br /><span className="text-xs text-gray-500">HttpOnly · SameSite=Lax · Secure (HTTPS)</span></td>
                  <td className="px-3 py-2.5">Strictly Necessary (Security / Legitimate Interest KVKK m.5/2-f)</td>
                  <td className="px-3 py-2.5">HMAC-SHA256 signed random nonce issued <strong>only</strong> on visitor API requests (never on static/ISR HTML pages) to preserve fair rate limits across shared carrier IPs (CGNAT) and block automated floods.</td>
                  <td className="px-3 py-2.5">15 minutes (`Max-Age=900`)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-medium"><code>cookie-consent-granular</code><br /><span className="text-xs text-gray-500">Browser <code>localStorage</code></span></td>
                  <td className="px-3 py-2.5">Strictly Necessary (Statutory / Consent Record KVKK m.5/2-ç)</td>
                  <td className="px-3 py-2.5">Stores your accept/reject/custom cookie consent selections locally in your browser so you are not asked repeatedly.</td>
                  <td className="px-3 py-2.5">Until cleared or updated</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Optional Analytics Cookies (Default Off — Explicit Consent Required)</h2>
          <p>
            Before you grant consent in the Cookie Banner or settings panel, Google Consent Mode v2 defaults to <code>denied</code> and neither analytics script is added to the page. Only when you explicitly allow Analytics do the following tools load:
          </p>
          <div className="overflow-x-auto mt-4 mb-6">
            <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-900 font-bold border-b">
                <tr>
                  <th className="px-3 py-2.5">Provider &amp; Cookie Names</th>
                  <th className="px-3 py-2.5">Category &amp; Basis</th>
                  <th className="px-3 py-2.5">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2.5 font-medium">Google Analytics 4 (`_ga`, `_ga_*`, `_gid`, `_gat`)</td>
                  <td className="px-3 py-2.5">Analytics (Explicit Consent KVKK m.5/1)</td>
                  <td className="px-3 py-2.5">Aggregate traffic and visit measurement with <code>anonymize_ip: true</code>.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-medium">Microsoft Clarity (`_clck`, `_clsk`)</td>
                  <td className="px-3 py-2.5">Analytics (Explicit Consent KVKK m.5/1)</td>
                  <td className="px-3 py-2.5">Aggregated usability and navigation interaction insights.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Marketing &amp; Functional Categories</h2>
          <p>
            Although the preference panel displays switches for Marketing and Functional categories, <strong>no advertising pixels, retargeting cookies, live-chat widgets, or third-party video embeds are loaded</strong> in the active Gastronomy release. Unused third-party cookies are never listed as active.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Withdrawing Consent &amp; Contact</h2>
          <p>
            You can withdraw or update analytics consent at any time by opening{' '}
            <a href="#cerez-ayarlari" className="font-bold underline hover:text-red-600">Cookie Preferences</a>. When you turn off Analytics, the Platform revokes Consent Mode flags, stops Clarity, disables GA4 tracking, removes the injected loader scripts, and clears third-party analytics cookies (<code>_ga*</code>, <code>_gid</code>, <code>_gat</code>, <code>_clck</code>, <code>_clsk</code>). For questions, see our <Link href={`${localePrefix}/kvkk-aydinlatma-metni`} className="text-red-600 underline">KVKK Disclosure</Link> or email <strong>info@yeriniayir.com</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Çerez Politikası</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="font-semibold text-gray-900">Son Güncelleme: 19.11.2026</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Amaç ve Kapsam</h3>
        <p>
          Bu Çerez Politikası, YeriniAyir.com gastronomi keşif platformunda teknik olarak gerçekten kullanılan çerezleri ve tarayıcı depolama öğelerini açıklar. Kişisel Verileri Koruma Kurumu’nun Çerez Uygulamaları Rehberi uyarınca yalnızca zorunlu teknik mekanizmalar rıza aranmaksızın çalıştırılır; analitik çerezleri ise varsayılan olarak kapalıdır ve yalnızca açık rızanızla yüklenir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Kullanılan Çerez ve Tarayıcı Depolama Envanteri</h3>

        <div className="overflow-x-auto mt-4 mb-6">
          <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-900 font-bold border-b">
              <tr>
                <th className="px-3 py-2.5">Çerez / Anahtar Adı</th>
                <th className="px-3 py-2.5">Kategori ve Hukuki Sebep</th>
                <th className="px-3 py-2.5">Kodda Gerçek Kullanım Amacı</th>
                <th className="px-3 py-2.5">Saklama Süresi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-2.5 align-top font-medium">
                  <code>ya_rl_anon</code><br />
                  <span className="text-xs text-gray-500">HttpOnly · SameSite=Lax · Secure (HTTPS)</span>
                </td>
                <td className="px-3 py-2.5 align-top">Zorunlu (İşlem güvenliği / KVKK m.5/2-f meşru menfaat)</td>
                <td className="px-3 py-2.5 align-top">
                  Statik/önbellekli HTML sayfalarında değil, <strong>yalnızca ziyaretçi API isteklerinde</strong> verilir. Ortak mobil ağ (CGNAT) IP adaletini korumak ve otomatik yoğunluk/bot isteklerini sınırlamak amacıyla HMAC-SHA256 imzalı rastgele belirteç taşır; kullanıcı kimliği içermez.
                </td>
                <td className="px-3 py-2.5 align-top">15 dakika (<code>Max-Age=900</code>)</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 align-top font-medium">
                  <code>cookie-consent-granular</code><br />
                  <span className="text-xs text-gray-500">Tarayıcı <code>localStorage</code></span>
                </td>
                <td className="px-3 py-2.5 align-top">Zorunlu (Tercih kaydı / KVKK m.5/2-ç ve m.5/2-f)</td>
                <td className="px-3 py-2.5 align-top">
                  Çerez tercih penceresinde yaptığınız kabul, ret veya kategorik onay seçimini tarayıcınızda saklar.
                </td>
                <td className="px-3 py-2.5 align-top">Kullanıcı silene veya değiştirene dek</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 align-top font-medium">
                  <code>_ga</code>, <code>_ga_*</code>, <code>_gid</code>, <code>_gat</code><br />
                  <span className="text-xs text-gray-500">Google Analytics 4</span>
                </td>
                <td className="px-3 py-2.5 align-top">Analitik (KVKK m.5/1 <strong>Açık Rıza</strong>)</td>
                <td className="px-3 py-2.5 align-top">
                  Yalnızca &quot;Analitik Çerezler&quot; için açık onay verdiğinizde <code>anonymize_ip: true</code> ayarıyla sayfa ziyaret istatistiklerini ölçer. Onay yoksa betik sayfaya hiç yüklenmez.
                </td>
                <td className="px-3 py-2.5 align-top">Rıza geri çekilene veya sağlayıcı teknik süresine dek</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 align-top font-medium">
                  <code>_clck</code>, <code>_clsk</code><br />
                  <span className="text-xs text-gray-500">Microsoft Clarity</span>
                </td>
                <td className="px-3 py-2.5 align-top">Analitik (KVKK m.5/1 <strong>Açık Rıza</strong>)</td>
                <td className="px-3 py-2.5 align-top">
                  Yalnızca &quot;Analitik Çerezler&quot; için açık onay verdiğinizde sayfa içi gezinme ve kullanılabilirlik ölçümü yapar. Onay yoksa tarayıcıya eklenmez.
                </td>
                <td className="px-3 py-2.5 align-top">Rıza geri çekilene veya sağlayıcı teknik süresine dek</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Kullanılmayan Kategoriler Hakkında Şeffaflık</h3>
        <p>
          Çerez tercih panelinde &quot;Pazarlama Çerezleri&quot; ve &quot;İşlevsel Çerezler&quot; anahtarları görünmekle birlikte, mevcut gastronomi ilk yayınında Platform tarafından hiçbir reklam/yeniden hedefleme pikseli, pazarlama çerezi, canlı sohbet widget’ı veya üçüncü taraf video çerezi <strong>kullanılmamaktadır</strong>. Gerçekte çalıştırılmayan çerezler aktifmiş gibi listelenmez.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Rıza Mekanizması ve Onayı Geri Çekme Davranışı</h3>
        <p>
          Ziyaretin başında tüm isteğe bağlı analitik depolama izinleri teknik olarak kapalıdır (<code>denied</code>). Tercihinizi dilediğiniz an değiştirmek veya verdiğiniz onayı geri çekmek için{' '}
          <a href="#cerez-ayarlari" className="font-bold underline hover:text-red-600">Çerez Tercihleri</a> bağlantısını kullanabilirsiniz.
        </p>
        <p className="mt-2">
          &quot;Tümünü Reddet&quot; seçildiğinde veya analitik izni kapatıldığında Platform; Google Consent Mode durumunu <code>denied</code> konumuna alır, Microsoft Clarity oturumunu durdurur (<code>clarity(&apos;stop&apos;)</code>), GA4 izlemeyi devre dışı bırakır, yüklenmiş üçüncü taraf betikleri sayfadan kaldırır ve tarayıcıdaki analitik çerezlerini (<code>_ga*</code>, <code>_gid</code>, <code>_gat</code>, <code>_clck</code>, <code>_clsk</code>) temizler.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Tarayıcı Ayarları ve İletişim</h3>
        <p>
          Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. Zorunlu güvenlik mekanizmalarının engellenmesi API hız sınırı doğrulanabilirliğini etkileyebilir. Çerezler ve kişisel veri haklarınız için <Link href={`${localePrefix}/kvkk-aydinlatma-metni`} className="text-red-600 underline">KVKK Aydınlatma Metni</Link> sayfasını inceleyebilir veya <strong>info@yeriniayir.com</strong> adresine yazabilirsiniz.
        </p>
      </div>
    </div>
  );
}
