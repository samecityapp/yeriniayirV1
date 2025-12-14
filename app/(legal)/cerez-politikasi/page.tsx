import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası | Yerini Ayır',
  description: 'Yerini Ayır platformu çerez kullanım politikası ve tercih yönetimi.',
};

export default function CookiePolicy() {
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
          <h1 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
            Çerez (Cookie) Politikası
          </h1>
          <p className="text-base text-zinc-500 font-medium">
            Son Güncelleme: {lastUpdated}
          </p>
        </div>

        {/* Giriş */}
        <p>
          Bu Çerez Politikası, Yerini Ayır ("Biz", "Platform") tarafından kullanılan çerezlerin türlerini, kullanım amaçlarını ve bu çerezleri nasıl yönetebileceğinizi açıklamaktadır.
          Çerez kullanımımız, <strong>KVKK</strong> ve <strong>GDPR</strong> düzenlemelerine tam uyumlu olarak yürütülmektedir.
        </p>

        <h3>1. Çerez Nedir?</h3>
        <p>Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza (bilgisayar, tablet, telefon) kaydedilen küçük metin dosyalarıdır. Bu dosyalar, site tercihlerinizin hatırlanmasını, oturumunuzun açık kalmasını ve sitenin daha performanslı çalışmasını sağlar.</p>

        <h3>2. Kullandığımız Çerez Türleri</h3>
        <p>Platformumuzda aşağıdaki kategorilerde çerezler kullanılmaktadır:</p>

        <div className="not-prose grid gap-4 my-8">
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <h4 className="font-bold text-zinc-900 mb-2">🔒 Zorunlu (Gerekli) Çerezler</h4>
            <p className="text-sm text-zinc-600 mb-0">Sitenin temel fonksiyonlarının (sayfa geçişleri, güvenlik, oturum açma) çalışması için şarttır. Bu çerezler kapatılamaz.</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <h4 className="font-bold text-zinc-900 mb-2">📊 Performans ve Analitik Çerezleri</h4>
            <p className="text-sm text-zinc-600 mb-0">Ziyaretçi sayısını, en çok okunan sayfaları ve site performansını ölçmemizi sağlar. <strong>Google Analytics</strong> ve <strong>Vercel Analytics</strong> araçları bu amaçla kullanılır. İzninize tabidir.</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <h4 className="font-bold text-zinc-900 mb-2">🔥 Davranışsal Analiz Çerezleri</h4>
            <p className="text-sm text-zinc-600 mb-0">Kullanıcıların site içindeki tıklama ve gezinme haritalarını oluşturmak için <strong>Microsoft Clarity</strong> kullanılır. Kişisel veriler anonimleştirilir.</p>
          </div>
        </div>

        <h3>3. Çerezleri Nasıl Yönetebilirsiniz?</h3>
        <p>Çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz:</p>
        <ul>
          <li><strong>Site Üzerinden:</strong> Sitemizin alt kısmında yer alan "Çerez Ayarları" panelini kullanarak onayınızı geri çekebilirsiniz.</li>
          <li><strong>Tarayıcı Ayarlarından:</strong> Kullandığınız tarayıcının (Chrome, Safari, Firefox vb.) ayarlar menüsünden tüm çerezleri silebilir veya engelleyebilirsiniz.</li>
        </ul>

        <h3>4. Veri Güvenliği</h3>
        <p>
          Çerezler aracılığıyla toplanan veriler, sadece belirtilen amaçlar doğrultusunda ve yasal saklama süreleri boyunca güvenli sunucularda (Supabase, Vercel) saklanır.
          Daha fazla bilgi için <a href="/gizlilik-politikasi">Gizlilik Politikamızı</a> inceleyebilirsiniz.
        </p>

        <div className="mt-12 pt-8 border-t border-zinc-200">
          <h3>5. İletişim</h3>
          <p>
            Çerez politikamızla ilgili sorularınız için:
          </p>
          <p className="font-medium text-zinc-900">
            E-posta: privacy@gnkotel.com<br />
            Konum: İstanbul, Türkiye
          </p>
        </div>

      </article>
    </main>
  );
}
