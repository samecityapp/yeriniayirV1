import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TR_SITE_ORIGIN } from '@/lib/gastronomy-v3/geoCatalog';

export const metadata: Metadata = {
  title: 'Kullanım Şartları (Kanonik Bilgilendirme) | Yerini Ayır',
  description:
    'Yerini Ayır gastronomi platformu güncel kullanım koşullarına yönlendirme ve bilgilendirme özeti.',
  alternates: {
    canonical: `${TR_SITE_ORIGIN}/kullanim-kosullari`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function TermsOfUseArchiveNotice(props: {
  params?: Promise<{ lang: string }>;
}) {
  const params = props.params ? await props.params : undefined;
  const isEn = params?.lang === 'en';
  const canonicalTermsHref = `${isEn ? '/en' : '/tr'}/kullanim-kosullari`;

  return (
    <main className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <article className="prose prose-zinc prose-lg max-w-4xl mx-auto">
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3 tracking-tight">
            {isEn ? 'Terms of Use — Updated Canonical Page Notice' : 'Kullanım Şartları (Güncel Metin Bilgilendirmesi)'}
          </h1>
          <p className="text-base text-zinc-500 font-medium">
            {isEn ? 'Last Updated: 19.11.2026' : 'Son Güncelleme: 19.11.2026'}
          </p>
          <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-950">
            {isEn ? (
              <>
                This legacy URL is retained only for compatibility (`noindex`). The authoritative Terms of Use for Yerini Ayır&apos;s Gastronomi Discovery release are published at{' '}
                <Link href={canonicalTermsHref} className="font-bold underline text-red-700">
                  Terms of Use (/kullanim-kosullari)
                </Link>.
              </>
            ) : (
              <>
                Bu eski bağlantı yalnızca geriye dönük uyumluluk amacıyla indekse kapalı (<code>noindex</code>) olarak tutulmaktadır. Yerini Ayır’ın yalnızca gastronomi keşif yayını için geçerli tam ve güncel metin{' '}
                <Link href={canonicalTermsHref} className="font-bold underline text-red-700">
                  Kullanım Koşulları (/kullanim-kosullari)
                </Link>{' '}
                sayfasında yer almaktadır.
              </>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">1. Taraflar ve Gerçek Kişi İşletmeci</h2>
        <p>
          YeriniAyir.com (&quot;Platform&quot;), ilk yayın döneminde tüzel kişiliği olmaksızın gerçek kişi site işletmecisi tarafından bireysel olarak işletilen bağımsız bir yerel gastronomi keşif rehberidir.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">2. Gastronomi Keşif Hizmetinin Kapsamı</h2>
        <p>
          Platform yalnızca restoran, kafe ve gastronomi mekânı seçkilerini, bölge/kategori filtrelerini, sokak seviyesi adres bilgilerini ve Google Maps yol tarifi bağlantılarını sunar. Platform üzerinden masa ayırtma, sipariş satışı veya ödeme işlemi gerçekleştirilmez.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">3. İşletme Bilgilerinin Güncelliği ve Düzeltme Talepleri</h2>
        <p>
          Mekânların menü, fiyat seviyesi, çalışma saatleri veya açıklık durumu işletmeler tarafından değiştirilebilir. Hatalı veya güncelliğini yitirmiş bilgiler <strong>info@yeriniayir.com</strong> üzerinden bildirilebilir.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">4. Üçüncü Taraf Harita ve Harici Bağlantılar</h2>
        <p>
          Harici Google Maps bağlantıları veya işletme sayfaları kendi kullanım ve gizlilik koşullarına tabidir. Platform dışındaki üçüncü taraf hizmetler ilgili sağlayıcının sorumluluğundadır.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">5. Sponsorluk ve Ücretli Tanıtım Durumu</h2>
        <p>
          Mevcut gastronomi ilk yayınında sponsorlu sıralama, ücretli tanıtım veya satış komisyonlu yönlendirme aktif değildir.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">6. Kullanıcı Davranışı ve Fikri Mülkiyet Hakları</h2>
        <p>
          Platform içerikleri ve derleme yapısı 5846 sayılı FSEK kapsamında korunur. Otomatik veri kazıma (scraping), bot trafiği veya hizmet güvenliğini bozucu girişimler yasaktır.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">7. Sorumluluk Sınırı ve Zorunlu Haklar</h2>
        <p>
          Bu metin, yürürlükteki mevzuat uyarınca Kullanıcının sahip olduğu emredici yasal hakları ortadan kaldırmaz; yalnızca bilgilendirme amaçlı içerik kullanımının çerçevesini çizer.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">8. Uygulanacak Hukuk</h2>
        <p>
          Uyuşmazlıklarda Türkiye Cumhuriyeti hukuku uygulanır ve güncel bütünleşik düzenleme için{' '}
          <Link href={canonicalTermsHref} className="text-red-700 underline">
            Kullanım Koşulları
          </Link>{' '}
          sayfası esas alınır.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-6 mb-3">9. İletişim</h2>
        <p>
          Gerçek kişi site işletmecisi ile tüm düzeltme, içerik ve hukuki bildirimler için:{' '}
          <strong>info@yeriniayir.com</strong>
        </p>
      </article>
    </main>
  );
}
