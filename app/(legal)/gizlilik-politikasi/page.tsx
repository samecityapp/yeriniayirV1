import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Yerini Ayır',
  description: 'Yerini Ayır platformu veri koruma, KVKK ve GDPR uyumluluk politikası.',
};

export default function PrivacyPolicy() {
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
            Gizlilik Politikası
          </h1>
          <p className="text-base text-zinc-500 font-medium">
            Son Güncelleme: {lastUpdated}
          </p>
        </div>

        {/* Giriş */}
        <p>
          Yerini Ayır ("Platform", "Biz") olarak, kullanıcılarımızın kişisel verilerinin güvenliğini en yüksek standartlarda korumayı taahhüt ediyoruz.
          Bu Gizlilik Politikası; <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")</strong>, Avrupa Birliği <strong>Genel Veri Koruma Tüzüğü ("GDPR")</strong> ve ilgili diğer mevzuata uygun olarak hazırlanmıştır.
        </p>

        {/* 1. Veri Toplama */}
        <h3>1. Topladığımız Kişisel Veriler</h3>
        <p>Platformu kullanırken doğrudan veya dolaylı olarak aşağıdaki verileri toplayabiliriz:</p>
        <ul>
          <li><strong>Otomatik Toplanan Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgisi, işletim sistemi ve site içi gezinme hareketleri (Tıklamalar, sayfada kalma süreleri).</li>
          <li><strong>İletişim Verileri:</strong> Bültenimize (Newsletter) abone olmanız durumunda e-posta adresiniz.</li>
          <li><strong>Kullanım Verileri:</strong> Arama terimleri ve filtreleme tercihleri.</li>
        </ul>
        <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-zinc-900 text-sm my-6">
          <strong>Önemli Not:</strong> Yerini Ayır bir rezervasyon acentesi değildir. Sitemiz üzerinden doğrudan ödeme alınmaz, kredi kartı bilgisi işlenmez ve saklanmaz. Tüm rezervasyon işlemleri yönlendirilen otelin veya partner sitenin sorumluluğundadır.
        </div>

        {/* 2. İşleme Amaçları */}
        <h3>2. Verilerinizi Neden İşliyoruz?</h3>
        <p>Toplanan veriler şu meşru amaçlarla işlenir:</p>
        <ul>
          <li><strong>Hizmet İyileştirme:</strong> Sitemizin performansını ölçmek ve kullanıcı deneyimini (UX) geliştirmek.</li>
          <li><strong>Güvenlik:</strong> Siber saldırıları önlemek, bot trafiğini engellemek ve sistem güvenliğini sağlamak (Rate Limiting).</li>
          <li><strong>Analitik:</strong> Hangi bölgelerin popüler olduğunu anlamak ve içerik stratejimizi buna göre belirlemek.</li>
          <li><strong>Yasal Yükümlülük:</strong> 5651 sayılı kanun gereği zorunlu trafik loglarını tutmak.</li>
        </ul>

        {/* 3. Üçüncü Taraflar */}
        <h3>3. Verilerin Paylaşımı ve Altyapı Sağlayıcıları</h3>
        <p>Kişisel verileriniz asla pazarlama amacıyla üçüncü şahıslara satılmaz. Ancak hizmeti sunabilmek için aşağıdaki küresel altyapı sağlayıcıları ile çalışıyoruz:</p>
        <ul>
          <li><strong>Vercel Inc. (ABD):</strong> Hosting ve sunucu hizmetleri.</li>
          <li><strong>Supabase (Singapur/ABD):</strong> Veritabanı ve kimlik doğrulama hizmetleri.</li>
          <li><strong>Google Analytics (ABD):</strong> Site trafiği analizi.</li>
          <li><strong>Microsoft Clarity (ABD):</strong> Kullanıcı davranış analizi (Isı haritaları).</li>
          <li><strong>Upstash (ABD):</strong> Güvenlik ve hız sınırlaması (DDoS koruması).</li>
        </ul>
        <p>Bu sağlayıcılar, verilerinizi uluslararası veri aktarımı standartlarına (GDPR Standard Contractual Clauses) uygun olarak işler.</p>

        {/* 4. Çerezler */}
        <h3>4. Çerezler (Cookies)</h3>
        <p>
          Sitemizde deneyiminizi geliştirmek için zorunlu ve analitik çerezler kullanıyoruz. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman silebilirsiniz.
          Detaylar için <a href="/cerez-politikasi">Çerez Politikamızı</a> inceleyin.
        </p>

        {/* 5. Haklarınız */}
        <h3>5. Kullanıcı Hakları (KVKK & GDPR)</h3>
        <p>Kullanıcı olarak aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>Verilerinizin düzeltilmesini veya silinmesini ("Unutulma Hakkı") talep etme,</li>
          <li>Verilerinizin işlenmesine itiraz etme.</li>
        </ul>

        {/* 6. Güvenlik */}
        <h3>6. Veri Güvenliği</h3>
        <p>
          Verileriniz; <strong>SSL/TLS şifreleme</strong>, <strong>RLS (Row Level Security)</strong> politikaları ve <strong>Güvenlik Duvarları</strong> ile korunmaktadır.
          Verilerinize yetkisiz erişimi engellemek için "En Az Yetki" (Least Privilege) prensibi uygulanır.
        </p>

        {/* 7. İletişim */}
        <div className="mt-12 pt-8 border-t border-zinc-200">
          <h3>7. İletişim</h3>
          <p>
            Gizlilik veya veri güvenliği ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
          </p>
          <p className="font-medium text-zinc-900">
            Yerini Ayır Veri Koruma Birimi<br />
            E-posta: info@gnkotel.com<br />
            Konum: İstanbul, Türkiye
          </p>
        </div>

      </article>
    </main>
  );
}
