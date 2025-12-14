import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kullanım Şartları | Yerini Ayır',
    description: 'Yerini Ayır platformu kullanım koşulları ve yasal sorumluluk reddi beyanı.',
};

export default function TermsOfUse() {
    const lastUpdated = new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <main className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
            <article className="prose prose-zinc prose-lg max-w-4xl mx-auto">

                {/* Başlık Alanı */}
                <div className="border-b border-zinc-200 pb-8 mb-10">
                    <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
                        Kullanım Şartları
                    </h1>
                    <p className="text-base text-zinc-500 font-medium">
                        Yürürlük Tarihi: {lastUpdated}
                    </p>
                </div>

                {/* Giriş */}
                <p>
                    Bu Kullanım Şartları ("Şartlar"), <strong>Yerini Ayır</strong> platformu ("Site", "Hizmet") aracılığıyla sunulan tüm içerik ve hizmetlerden yararlanırken uymanız gereken koşulları düzenlemektedir.
                    Siteyi kullanmanız, bu Şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi gösterir.
                </p>

                <h3>1. Tanımlar</h3>
                <ul>
                    <li><strong>Kullanıcı:</strong> Platforma erişen, kayıt olan veya hizmetten yararlanan gerçek/tüzel kişi.</li>
                    <li><strong>Hizmet:</strong> Yerini Ayır tarafından sunulan otel keşfi, içerik görüntüleme, blog yazıları ve ilgili tüm dijital hizmetler.</li>
                    <li><strong>İçerik:</strong> Platformda yer alan tüm metin, görsel, video, veri ve yazılımlar.</li>
                </ul>

                {/* Vurgulu Kutu: Hizmetin Kapsamı */}
                <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500 my-8">
                    <h3 className="text-amber-900 mt-0">2. Hizmetin Kapsamı (Önemli)</h3>
                    <p className="mb-2 text-amber-800">Yerini Ayır; oteller ve seyahat içerikleri sağlayan bir dijital keşif platformudur.</p>
                    <ul className="list-disc pl-6 text-zinc-600 space-y-1">
                        <li><strong>Yerini Ayır bir rezervasyon sitesi değildir.</strong></li>
                        <li>Yerini Ayır otel fiyatlarını belirlemez veya rezervasyon işlemlerini doğrudan yürütmez.</li>
                        <li>Platformda yer alan bilgiler yalnızca genel bilgilendirme amacı taşır. Nihai fiyat ve müsaitlik, yönlendirilen otelin kendi sitesinde geçerlidir.</li>
                    </ul>
                </div>

                <h3>3. Kullanıcı Yükümlülükleri</h3>
                <p>Kullanıcı, hizmeti yalnızca hukuka uygun amaçlarla kullanacağını kabul eder. Platformun işleyişine zarar verecek (bot kullanımı, veri kazıma vb.) faaliyetlerde bulunamaz.</p>

                <h3>4. Sorumluluk Reddi (Disclaimer)</h3>
                <p>Yerini Ayır aşağıdaki konulardan sorumlu tutulamaz:</p>
                <ul>
                    <li>Listelenen otellerin hizmet kalitesi veya fiyat değişiklikleri.</li>
                    <li>Üçüncü taraf (Booking.com vb.) sitelerdeki hatalı bilgiler.</li>
                    <li>Kullanıcının platforma teknik nedenlerle erişememesi.</li>
                </ul>
                <p>Platform "olduğu gibi" sunulur ve kusursuzluk garantisi vermez.</p>

                <h3>5. Fikri Mülkiyet Hakları</h3>
                <p>
                    Platformdaki tüm içerikler (metinler, görseller, Yerini Ayır logosu, tasarım) Yerini Ayır'a aittir veya lisanslıdır.
                    İzinsiz kopyalanması, çoğaltılması veya ticari amaçla kullanılması yasaktır.
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-zinc-900 mb-4">6. Üçüncü Taraf Bağlantıları</h2>
                    <p className="text-zinc-600 leading-relaxed">
                        Sitemiz, otellerin web sitelerine veya sosyal medya platformlarına bağlantılar içerebilir.
                        Bu bağlantılar sadece kolaylık sağlamak içindir; yönlendirilen sitelerin içeriğinden veya güvenliğinden Yerini Ayır sorumlu değildir.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-zinc-900 mb-4">6. Değişiklikler</h2>
                    <p className="text-zinc-600 leading-relaxed">
                        Yerini Ayır, bu Şartları önceden bildirimde bulunmaksızın güncelleme hakkını saklı tutar.
                        Güncellemeler yayınlandığı anda yürürlüğe girer.
                    </p>
                </section>

                <h3>8. Uygulanacak Hukuk</h3>
                <p>
                    Bu Şartlar, Türkiye Cumhuriyeti kanunlarına tabidir. Her türlü uyuşmazlıkta İstanbul Mahkemeleri ve İcra Müdürlükleri yetkilidir.
                </p>

                <div className="mt-12 pt-8 border-t border-zinc-200">
                    <h3>9. İletişim</h3>
                    <p>
                        Bu şartlarla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                    </p>
                    <p className="font-medium text-zinc-900">
                        Yerini Ayır Hukuk Birimi<br />
                        E-posta: legal@gnkotel.com<br />
                        Konum: İstanbul, Türkiye
                    </p>
                </div>

            </article>
        </main>
    );
}
