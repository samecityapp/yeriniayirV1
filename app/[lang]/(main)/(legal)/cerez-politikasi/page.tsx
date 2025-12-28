import React from 'react';

export const metadata = {
  title: 'Çerez Politikası | Yerini Ayır',
  description: 'Yerini Ayır çerez kullanım politikası ve tercihlerinizi nasıl yönetebileceğiniz hakkında bilgiler.',
};

export default function CerezPolitikasiPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Çerez Politikası (Revize)</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="font-semibold text-gray-900">Son Güncelleme: 27.12.2025</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Çerez Nedir?</h3>
        <p>
          Çerezler; tarayıcınızda saklanan küçük dosyalardır. Bazıları kişisel veri niteliği taşıyabilir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Çerez Kategorileri ve Hukuki Dayanak</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Zorunlu Çerezler:</strong> Site’nin çalışması için gerekli (onay gerektirmez)</li>
          <li><strong>Fonksiyonel Çerezler:</strong> Tercihleri hatırlama (tercihe göre)</li>
          <li><strong>Analitik/Performans Çerezleri:</strong> Trafik ve performans ölçümü (açık rıza)</li>
          <li><strong>Reklam/Pazarlama Çerezleri:</strong> Davranışsal reklam (açık rıza)</li>
        </ul>
        <p className="mt-2">
          KVKK Kurumu’nun güncel rehberlerine göre, özellikle analitik ve davranışsal ölçüm için açık rıza yaklaşımı esas alınmaktadır.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Çerez Listesi</h3>
        <p>
          Web sitemizde kullanılan çerezler aşağıdaki kategorilere ayrılmaktadır:
        </p>

        <div className="overflow-x-auto mt-4 mb-6">
          <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-900 font-bold border-b">
              <tr>
                <th className="px-4 py-3">Çerez Kategorisi</th>
                <th className="px-4 py-3">Amaç</th>
                <th className="px-4 py-3">Dayanak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium">Zorunlu</td>
                <td className="px-4 py-3">Site güvenliği, oturum yönetimi ve temel fonksiyonların çalışması.</td>
                <td className="px-4 py-3">Meşru Menfaat</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Analitik</td>
                <td className="px-4 py-3">Ziyaretçi sayıları ve trafik kaynaklarını takip ederek site performansını ölçmek.</td>
                <td className="px-4 py-3">Açık Rıza</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Pazarlama</td>
                <td className="px-4 py-3">Kullanıcı ilgi alanlarına göre özelleştirilmiş içerik sunmak.</td>
                <td className="px-4 py-3">Açık Rıza</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">İşlevsel</td>
                <td className="px-4 py-3">Dil tercihleri gibi kişiselleştirilmiş ayarların hatırlanması.</td>
                <td className="px-4 py-3">Açık Rıza / Meşru Menfaat</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm italic text-gray-500">
          Not: Detaylı çerez listesi ve yönetim seçenekleri için sitemizin alt kısmında yer alan "Çerez Ayarları" panelini kullanabilirsiniz.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Onay Yönetimi ve Geri Alma</h3>
        <p>
          Analitik/pazarlama çerezleri varsayılan olarak kapalı sunulmaktadır; Kullanıcı açıkça seçerek bunları aktif hale getirebilir. Onayınızı dilediğiniz an geri almak veya değiştirmek için <strong>"Çerez Ayarları"</strong> panelini kullanabilirsiniz.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Tarayıcı Üzerinden Yönetim</h3>
        <p>
          Chrome, Safari, Firefox gibi tarayıcıların ayarlar menüsünden çerezleri silebilir veya engelleyebilirsiniz. Ancak zorunlu çerezleri engellemek Site’nin çalışmasını etkileyebilir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. İletişim</h3>
        <p>
          Çerez politikamızla ilgili sorularınız için: <strong>info@yeriniayir.com</strong>
        </p>
      </div>
    </div>
  );
}
