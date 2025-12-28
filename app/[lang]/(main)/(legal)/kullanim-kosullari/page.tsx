import React from 'react';

export const metadata = {
  title: 'Kullanım Koşulları | Yerini Ayır',
  description: 'Yerini Ayır kullanım koşulları, hizmet şartları ve yasal sorumluluklar hakkında bilgilendirme.',
};

export default function KullanimKosullariPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Kullanım Koşulları (Revize)</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="font-semibold text-gray-900">Son Güncelleme: 27.12.2025</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Taraflar ve Kapsam</h3>
        <p>
          Bu Kullanım Koşulları ("Koşullar"), YeriniAyir.com alan adlı internet sitesinin ("Platform") kullanımına ilişkindir. Platform’un sahibi ve işleteni <strong>Yerini Ayır</strong>’dır ("Şirket", "Biz"). Platform’u ziyaret eden veya kullanan herkes ("Kullanıcı") bu Koşulları okumuş ve kabul etmiş sayılır.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Platform’un Niteliği – Rezervasyon Hizmeti Sunmuyoruz</h3>
        <p>
          Platform; otel/konaklama seçeneklerini keşif ve listeleme amacıyla tanıtır. Platform rezervasyon acentesi, tur operatörü veya otel işletmecisi değildir; Platform üzerinden ödeme alınmaz, kredi kartı bilgisi işlenmez. Rezervasyon, ödeme, iptal, iade ve değişiklik süreçleri; Kullanıcı’nın yönlendirildiği otel veya üçüncü taraf rezervasyon platformu koşullarına tabidir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Bilgilerin Doğruluğu – Sorumluluk Sınırı</h3>
        <p>
          Fiyat, müsaitlik, puan, fotoğraf ve açıklamalar bilgilendirme amaçlıdır; gerçek zamanlı olmayabilir ve üçüncü taraf kaynaklara bağlıdır. Şirket;
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>fiyat/müsaitlik değişikliklerinden,</li>
          <li>yönlendirilen sitelerdeki hatalardan,</li>
          <li>konaklama deneyiminizin niteliğinden,</li>
          <li>üçüncü tarafların sözleşme/politikalarından</li>
        </ul>
        <p className="mt-2">sorumlu değildir.</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Yönlendirme ve Üçüncü Taraf Bağlantılar</h3>
        <p>
          Platform’da üçüncü taraf sitelere bağlantılar bulunabilir. Bu sitelerin içerik ve uygulamalarından Şirket sorumlu değildir. Kullanıcı, yönlendirildiği sitelerin şartlarını ayrıca kabul etmiş olur.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Kullanıcı Yükümlülükleri</h3>
        <p>Kullanıcı;</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>rezervasyon yapmadan önce ilgili platformun koşullarını okumayı,</li>
          <li>fiyat/koşulları yönlendirildiği sitede yeniden kontrol etmeyi,</li>
          <li>Platform’u hukuka aykırı amaçlarla kullanmamayı,</li>
          <li>Platform’un işleyişini bozacak/zarar verecek işlemler (bot, scraping, saldırı vb.) yapmamayı</li>
        </ul>
        <p className="mt-2">kabul eder.</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Yasaklı Kullanım</h3>
        <p>
          Kullanıcı; hukuka aykırı, yanıltıcı, hakaret içeren, fikri mülkiyet ihlali yaratan içerik/işlem yapamaz; Platform’un güvenliğini tehlikeye sokamaz.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. Fikri Mülkiyet</h3>
        <p>
          Platform’daki marka, logo, tasarım, metin, görsel ve yazılım dahil tüm içerikler Şirket’e veya lisans verenlerine aittir. Yazılı izin olmaksızın kopyalanamaz, çoğaltılamaz, dağıtılamaz.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">8. Sponsorluk/Affiliate Şeffaflığı</h3>
        <p>
          Bazı bağlantılar yönlendirme/iş ortaklığı (affiliate) içerebilir ve Şirket bu yönlendirmelerden gelir elde edebilir. Bu durum Kullanıcı’nın ödeyeceği bedeli değiştirmeyebilir; yine de nihai koşullar üçüncü tarafta belirlenir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">9. Hizmetin Kesintiye Uğraması</h3>
        <p>
          Bakım, güncelleme, mücbir sebep veya teknik nedenlerle Platform geçici olarak durabilir. Şirket, kesintisiz erişim taahhüdü vermez.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">10. Koşullarda Değişiklik</h3>
        <p>
          Şirket, Koşulları güncelleyebilir. Güncel metin Platform’da yayımlandığı anda yürürlüğe girer.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">11. Uygulanacak Hukuk ve Yetki</h3>
        <p>
          Koşullar Türkiye Cumhuriyeti hukukuna tabidir. Tüketici işlemlerinde tüketici hakem heyetleri/tüketici mahkemeleri saklı kalmak kaydıyla; diğer uyuşmazlıklarda İstanbul mahkemeleri ve icra daireleri yetkilidir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">12. İletişim</h3>
        <p>
          <strong>Şirket:</strong> Yerini Ayır<br />
          <strong>E-posta:</strong> info@yeriniayir.com<br />
          <strong>Adres:</strong> [İlgili Bilgiler Eklenecektir]
        </p>
      </div>
    </div>
  );
}
