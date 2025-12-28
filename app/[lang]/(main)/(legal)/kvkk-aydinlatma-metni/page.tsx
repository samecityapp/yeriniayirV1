import React from 'react';

export const metadata = {
  title: 'KVKK Aydınlatma Metni | Yerini Ayır',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni.',
};

export default function KVKKAydinlatmaMetniPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">KVKK Aydınlatma Metni (Revize)</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="font-semibold text-gray-900">Son Güncelleme: 27.12.2025</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Veri Sorumlusu</h3>
        <p>
          KVKK kapsamında veri sorumlusu: <strong>Yerini Ayır</strong><br />
          Adres: [İlgili Bilgiler Eklenecektir]<br />
          E-posta: info@yeriniayir.com
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. İşlenen Kişisel Veriler</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>İşlem güvenliği:</strong> IP, cihaz/tarayıcı bilgileri, log kayıtları</li>
          <li><strong>Kullanım:</strong> gezinme/tıklama, arama/filtre tercihleri</li>
          <li><strong>İletişim:</strong> bülten aboneliği varsa e-posta</li>
          <li><strong>Çerez verileri:</strong> (detay: Çerez Politikası)</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Toplama Yöntemi</h3>
        <p>
          Veriler; Platform’u ziyaretiniz sırasında otomatik yöntemlerle (çerezler, loglar) ve bülten aboneliği gibi formlar aracılığıyla toplanabilir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. İşleme Amaçları ve Hukuki Sebepler</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Platform’un yürütülmesi, güvenlik, hata giderme (meşru menfaat)</li>
          <li>Analiz ve performans ölçümü (açık rıza gereken haller)</li>
          <li>Hukuki yükümlülüklerin yerine getirilmesi (kanunda öngörülme/kanuni yükümlülük)</li>
          <li>Bülten gönderimi (ticari elektronik ileti onayı)</li>
          <li>5651 kapsamındaki yükümlülükler (trafik kayıtları) (kanunda öngörülme)</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Aktarım</h3>
        <p>
          Veriler; hizmet sağlayıcı altyapı firmalarına (barındırma, veritabanı, güvenlik, analiz) ve hukuken yetkili kurumlara aktarılabilir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Yurt Dışına Aktarım</h3>
        <p>
          Yurt dışı sağlayıcılar kullanılması halinde aktarım KVKK m.9’daki güncel mekanizmalara uygun yürütülür (yeterlilik/uygun güvenceler/standart sözleşme ve gerekli hallerde açık rıza).
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. KVKK m.11 Kapsamındaki Haklarınız</h3>
        <p>
          KVKK m.11 kapsamındaki tüm haklarınızı kullanabilirsiniz (bilgi talebi, düzeltme, silme/yok etme, aktarılan üçüncü kişileri öğrenme, itiraz, zarar giderimi talebi vb.).
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">8. Başvuru Yöntemi</h3>
        <p>
          Başvurularınızı <strong>info@yeriniayir.com</strong> adresine iletebilirsiniz. Kimlik doğrulaması için ek bilgi talep edebiliriz. Başvurular kural olarak 30 gün içinde sonuçlandırılır.
        </p>
      </div>
    </div>
  );
}
