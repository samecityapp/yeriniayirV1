import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'Yerini Ayır kullanım koşulları ve sorumluluk bildirimi',
};

export default function TermsOfUsePage() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-8">
        Kullanım Koşulları
      </h1>

      <p className="text-zinc-600 text-lg mb-8">
        Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
        <h3 className="text-lg font-semibold text-amber-900 mt-0 mb-2">Önemli Uyarı</h3>
        <p className="text-amber-800 mb-0">
          Yerini Ayır, bir rezervasyon acentesi, tur operatörü veya otel işletmecisi değildir.
          Sitemizde yer alan oteller, fiyatlar ve diğer bilgiler, bilgilendirme amaçlıdır ve
          doğruluğu üçüncü taraf sağlayıcılara (oteller, rezervasyon siteleri) bağlıdır.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">1. Hizmetin Tanımı</h2>
        <p className="mb-4">
          Yerini Ayır (&quot;Yerini Ayır&quot;, &quot;biz&quot;, &quot;bizim&quot;), kullanıcılara Türkiye&apos;deki
          oteller hakkında bilgi sağlayan bir keşif ve listeleme platformudur. Sitemiz:
        </p>
        <ul className="text-zinc-700 space-y-2 my-4">
          <li>Otel bilgileri, fotoğrafları ve özellikleri sunar</li>
          <li>Kullanıcıları otellerin resmi websitelerine veya rezervasyon platformlarına yönlendirir</li>
          <li>Otel puanları ve değerlendirmeleri paylaşır</li>
          <li>Gezi rehberleri ve seyahat tavsiyeleri yayınlar</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">2. Rezervasyon ve Ödeme Sorumluluğu</h2>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6 rounded-r-lg">
          <h3 className="text-lg font-semibold text-red-900 mt-0 mb-2">Kritik Madde</h3>
          <p className="text-red-800 mb-0">
            <strong>Yerini Ayır bir rezervasyon acentesi değildir.</strong> Sitede yer alan fiyatlar, müsaitlik bilgileri
            ve otel özellikleri tamamen bilgilendirme amaçlıdır.
          </p>
        </div>

        <p className="text-zinc-700 leading-relaxed">
          Yerini Ayır üzerinden bir otele tıkladığınızda:
        </p>
        <ul className="text-zinc-700 space-y-2 my-4">
          <li>Otelin resmi websitesine veya Booking.com, Hotels.com gibi üçüncü taraf rezervasyon sitelerine yönlendirilirsiniz</li>
          <li>Rezervasyon işlemi o platformda tamamlanır</li>
          <li>Ödeme bilgileriniz o platforma girilir, Yerini Ayır&apos;a değil</li>
          <li>İptal, değişiklik ve iade süreçleri o platformun politikalarına tabidir</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">3. Sorumluluk Reddi</h2>

        <h3 className="text-xl font-semibold text-zinc-800 mt-8 mb-3">3.1. Fiyat ve Müsaitlik Değişiklikleri</h3>
        <p className="text-zinc-700 leading-relaxed">
          Sitemizde gösterilen fiyatlar ve müsaitlik bilgileri, otel veya rezervasyon platformları tarafından
          güncel tutulmaya çalışılsa da, gerçek zamanlı olmayabilir. <strong>Yerini Ayır, yönlendirilen sitelerdeki
            fiyat hatalarından veya değişikliklerinden sorumlu tutulamaz.</strong>
        </p>

        <h3 className="text-xl font-semibold text-zinc-800 mt-8 mb-3">3.2. Hizmet Kalitesi ve İçerik Doğruluğu</h3>
        <p className="text-zinc-700 leading-relaxed">
          Otel açıklamaları, fotoğrafları ve özellikleri iyi niyetle derlenmiş olsa da, Yerini Ayır:
        </p>
        <ul className="text-zinc-700 space-y-2 my-4">
          <li>Otellerin sunduğu hizmetlerin kalitesini garanti etmez</li>
          <li>Otellerdeki konaklama deneyiminizden sorumlu değildir</li>
          <li>Otel fotoğraflarının veya açıklamalarının %100 güncel olduğunu garanti etmez</li>
          <li>Üçüncü taraf rezervasyon platformlarının politikalarından sorumlu tutulamaz</li>
        </ul>

        <h3 className="text-xl font-semibold text-zinc-800 mt-8 mb-3">3.3. İptal ve İade</h3>
        <p className="text-zinc-700 leading-relaxed">
          Rezervasyon iptalleri, değişiklikleri ve iadeler tamamen yönlendirilen platformun veya otelin
          kendi politikalarına tabidir. <strong>Yerini Ayır bu süreçlerde aracı değildir ve iptal/iade taleplerinde
            muhatap kabul edilemez.</strong> Lütfen rezervasyon yaptığınız sitenin koşullarını inceleyiniz.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">4. Kullanıcı Sorumlulukları</h2>
        <p className="text-zinc-700 leading-relaxed">
          Sitemizi kullanarak şunları kabul edersiniz:
        </p>
        <ul className="text-zinc-700 space-y-2 my-4">
          <li>Rezervasyon yapmadan önce ilgili platformun şartlarını okuyacağınızı</li>
          <li>Fiyat ve koşulları yönlendirildiğiniz sitede tekrar kontrol edeceğinizi</li>
          <li>Yerini Ayır&apos;nin bir aracı kurum olmadığını anladığınızı</li>
          <li>Rezervasyon sorunlarında (iptal, iade, yanlış oda vb.) tek muhatabın rezervasyon
            sitesi veya otel olduğunu kabul ettiğinizi
          </li>
        </ul>
        <p className="mt-4">
          beyan etmiş olursunuz.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">5. Fikri Mülkiyet Hakları</h2>
        <p className="text-zinc-700 leading-relaxed">
          Site içeriği (logo, tasarım, metin, fotoğraflar) Yerini Ayır&apos;nin veya lisans verenlerin mülkiyetindedir.
          İzinsiz kopyalama, çoğaltma veya dağıtım yasaktır.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">6. Bağlantı Politikası</h2>
        <p className="text-zinc-700 leading-relaxed">
          Sitemiz üçüncü taraf websitelerine bağlantılar içerir. Bu sitelerin içeriği, gizlilik politikaları
          veya uygulamalarından Yerini Ayır sorumlu değildir. Bağlantılara tıkladığınızda o sitenin şartlarını kabul
          etmiş sayılırsınız.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">7. Değişiklikler</h2>
        <p className="text-zinc-700 leading-relaxed">
          Yerini Ayır, bu kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar.
          Sitede yayınlandığı andan itibaren yeni koşullar geçerli olur.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">8. Uygulanacak Hukuk</h2>
        <p className="text-zinc-700 leading-relaxed">
          Bu koşullar Türkiye Cumhuriyeti yasalarına tabidir. Ortaya çıkabilecek anlaşmazlıklarda
          Türkiye mahkemeleri yetkilidir.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">9. İletişim</h2>
        <p className="text-zinc-700 leading-relaxed">
          Kullanım koşulları hakkında sorularınız için:{' '}
          <a href="mailto:info@gnkoteller.com" className="text-zinc-900 font-semibold hover:underline">
            info@gnkoteller.com
          </a>
        </p>
      </section>

      <div className="border-t border-zinc-200 mt-12 pt-8">
        <p className="text-sm text-zinc-500 italic">
          Bu kullanım koşullarını kabul ederek, GNK&apos;nin bir bilgilendirme platformu olduğunu
          ve rezervasyon/ödeme süreçlerinde taraf olmadığını onaylamış sayılırsınız.
        </p>
      </div>
    </article>
  );
}
