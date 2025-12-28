import React from 'react';

export const metadata = {
  title: 'Gizlilik Politikası | Yerini Ayır',
  description: 'Yerini Ayır gizlilik politikası ve kişisel verilerin korunması hakkında bilgilendirme.',
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Gizlilik Politikası (Revize)</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="font-semibold text-gray-900">Son Güncelleme: 27.12.2025</p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Veri Sorumlusu</h3>
        <p>
          KVKK kapsamında veri sorumlusu: <strong>Yerini Ayır</strong><br />
          MERSİS/Vergi No: [İlgili Bilgiler Eklenecektir] – Adres: [İlgili Bilgiler Eklenecektir]<br />
          İletişim: info@yeriniayir.com
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Hangi Verileri Topluyoruz?</h3>
        <p>Platform’u kullandığınızda şu veriler işlenebilir:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>İşlem güvenliği verileri:</strong> IP, cihaz/tarayıcı bilgileri, log kayıtları</li>
          <li><strong>Kullanım verileri:</strong> sayfa görüntüleme, tıklama, arama/filtre tercihleri</li>
          <li><strong>İletişim verileri:</strong> bülten aboneliği varsa e-posta</li>
          <li><strong>Çerez verileri:</strong> tercih/analitik çerezleri (detay: Çerez Politikası)</li>
        </ul>
        <p className="mt-2">
          Platform üzerinden ödeme alınmaz; kredi kartı verisi işlenmez.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Amaçlar ve Hukuki Sebepler (KVKK m.5)</h3>
        <p>Verilerinizi aşağıdaki amaçlarla işleriz:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Platform’un çalışması, güvenliği, dolandırıcılık/saldırı önleme (meşru menfaat)</li>
          <li>Analiz/iyileştirme (analitik) (açık rıza gerektiren haller dahil)</li>
          <li>Hukuki yükümlülüklerin yerine getirilmesi (kanuni yükümlülük/kanunda öngörülme)</li>
          <li>Bülten gönderimi (ticari elektronik ileti onayı/açık rıza)</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Çerezler ve Benzeri Teknolojiler</h3>
        <p>
          Zorunlu çerezler Platform’un çalışması için kullanılır. Analitik/performans ve benzeri çerezler için tercih panelinden onay alınır; onayınızı dilediğiniz an geri çekebilirsiniz. (Detay: Çerez Politikası)
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Kimlerle Paylaşıyoruz?</h3>
        <p>
          Kişisel verileriniz satılmaz. Ancak hizmetin sunulması için veri işleyen konumundaki altyapı/analitik sağlayıcılarla paylaşılabilir (ör. barındırma, veritabanı, güvenlik, analiz hizmetleri). Mevzuat gereği yetkili kurumlara aktarım yapılabilir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Yurt Dışına Veri Aktarımı</h3>
        <p>
          Bazı hizmet sağlayıcılar yurt dışında bulunabilir; bu durumda kişisel veriler KVKK m.9 kapsamındaki güncel aktarım rejimine göre aktarılır (ör. yeterlilik kararı veya uygun güvenceler/standart sözleşmeler gibi mekanizmalar ve gerekli hallerde açık rıza).
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. Saklama Süreleri</h3>
        <p>
          Veriler; amaç için gerekli süre boyunca ve mevzuatta öngörülen süreler kadar saklanır. Trafik/log kayıtları, 5651 sayılı kanun çerçevesinde ilgili sürelerde saklanabilir.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">8. Veri Güvenliği</h3>
        <p>
          Uygun teknik ve idari tedbirler (erişim kontrolü, şifreleme, yetkilendirme, loglama, yedekleme vb.) uygulanır. Buna rağmen internet üzerinden iletimde %100 güvenlik garanti edilemez.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">9. Haklarınız (KVKK m.11)</h3>
        <p>
          KVKK m.11 kapsamındaki haklarınızı kullanabilirsiniz (işlenip işlenmediğini öğrenme, bilgi talebi, düzeltme, silme/yok etme, aktarılan üçüncü kişileri bilme, itiraz, zararın giderilmesini talep vb.). Başvurularınızı <strong>info@yeriniayir.com</strong> üzerinden iletebilirsiniz.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">10. Değişiklikler</h3>
        <p>
          Politika güncellenebilir; güncel metin Platform’da yayımlanır.
        </p>
      </div>
    </div>
  );
}
