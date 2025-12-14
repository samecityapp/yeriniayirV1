import React from 'react';
import type { Metadata } from 'next';
import { Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | Yerini Ayır',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
};

export default function KVKKPolicy() {
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
            KVKK Aydınlatma Metni
          </h1>
          <p className="text-base text-zinc-500 font-medium">
            Son Güncelleme: {lastUpdated}
          </p>
        </div>

        {/* Giriş */}
        <p>
          Yerini Ayır Platformu ("Veri Sorumlusu") olarak, kişisel verilerinizin güvenliğini en üst seviyede sağlamak amacıyla, <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")</strong> uyarınca sizleri bilgilendiriyoruz.
          <br /><br />
          <strong>1. Veri Sorumlusu</strong><br />
          Kişisel verileriniz, veri sorumlusu sıfatıyla <strong>Yerini Ayır Platformu</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir.<br />
          <br />
          <strong>Unvan:</strong> Yerini Ayır Platformu<br />
          <strong>E-posta:</strong> privacy@gnkotel.com<br />
          <strong>Adres:</strong> İstanbul, Türkiye
        </p>

        <h3>2. İşlenen Kişisel Verileriniz</h3>
        <ul>
          <li><strong>Kimlik Bilgisi:</strong> Ad, Soyad (Üyelik durumunda).</li>
          <li><strong>İletişim Bilgisi:</strong> E-posta adresi.</li>
          <li><strong>İşlem Güvenliği:</strong> IP adresi, cihaz bilgileri, trafik logları.</li>
          <li><strong>Kullanım Verileri:</strong> Çerezler aracılığıyla toplanan site içi davranışlar.</li>
        </ul>

        <h3>3. Veri İşleme Amaçları ve Hukuki Sebepler</h3>
        <p>Kişisel verileriniz aşağıdaki hukuki sebeplere dayanarak işlenmektedir:</p>
        <ul>
          <li><strong>Kanunlarda Öngörülmesi:</strong> 5651 sayılı kanun gereği trafik loglarının tutulması.</li>
          <li><strong>Sözleşmenin İfası:</strong> Üyelik işlemlerinin gerçekleştirilmesi.</li>
          <li><strong>Meşru Menfaat:</strong> Site güvenliğinin sağlanması ve hizmet kalitesinin artırılması.</li>
          <li><strong>Açık Rıza:</strong> Pazarlama iletişimi ve analitik çerezler için.</li>
        </ul>

        <h3>4. Kişisel Verilerin Aktarılması</h3>
        <p>Verileriniz, hizmetin sunulabilmesi için gerekli olan ve veri güvenliği taahhüdü veren altyapı sağlayıcılarına (Supabase, Vercel, Google Analytics) aktarılabilir. Yasal zorunluluk hallerinde yetkili kamu kurumlarıyla paylaşılabilir.</p>

        <h3>5. KVKK Madde 11 Kapsamındaki Haklarınız</h3>
        <p>KVKK uyarınca aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse bilgi talep etme,</li>
          <li>Amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı 3. kişileri bilme,</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>Silinmesini veya yok edilmesini isteme.</li>
        </ul>

        {/* Başvuru Formu Alanı */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 my-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-semibold text-zinc-900 mb-2 mt-0">Veri Sahibi Başvuru Formu</h4>
            <p className="text-zinc-600 text-sm mb-0">
              Haklarınızı kullanmak için başvuru formunu indirip doldurarak bize iletebilirsiniz.
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors shrink-0"
          >
            <Download size={20} />
            Formu İndir (PDF)
          </a>
        </div>

        <h3>6. Başvuru Yöntemi</h3>
        <p>
          Taleplerinizi yukarıdaki formu doldurarak veya <strong>privacy@gnkotel.com</strong> adresine e-posta göndererek iletebilirsiniz. Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
        </p>

      </article>
    </main>
  );
}
