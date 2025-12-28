import React from 'react';
import type { Metadata } from 'next';
import { Instagram } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hakkımızda | Yerini Ayır',
  description: '10 yıllık deneyimle Türkiye\'nin en özel otellerini keşfediyoruz. Yerini Ayır hikayesi.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">

        {/* Başlık */}
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-8 tracking-tight">
          Biz Kimiz?
        </h1>

        {/* Giriş Hikayesi */}
        <div className="prose prose-zinc prose-lg text-zinc-600 mb-12">
          <p>
            Hikayemiz, sosyal medyada seyahat etmeyi seven dostlarımızla paylaştığımız
            <a href="https://www.instagram.com/geceligi.ne.kadar/" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-900 mx-1 hover:text-black hover:underline transition-colors">@geceligi.ne.kadar</a>
            ve
            <a href="https://www.instagram.com/turkeyandhotels/" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-900 mx-1 hover:text-black hover:underline transition-colors">@turkeyandhotels</a>
            sayfalarıyla başladı.
          </p>
          <p>
            Tam <strong>10 yıldır</strong>, Türkiye'nin dört bir yanındaki butik ve özel otelleri bizzat yerinde deneyimliyor, sadece güvendiğimiz ve sevdiğimiz yerleri sizlerle paylaşıyoruz. Bu on yıllık birikimi, şimdi daha kapsamlı bir rehbere dönüştürmenin heyecanını yaşıyoruz.
          </p>
        </div>

        <hr className="border-zinc-100 my-12" />

        {/* Misyon & Vizyon */}
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-black rounded-full"></span>
              Yerini Ayır Nedir?
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              Yerini Ayır, bir otel rezervasyon sitesi değildir. Biz, binlerce seçenek arasında kaybolmamanız için hazırlanmış <strong>seçkin bir otel keşif platformuyuz.</strong> Amacımız satış yapmak değil, size en doğru deneyimi önermektir.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-black rounded-full"></span>
              Amacımız
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              Kalabalıkların değil, "bilenlerin" tercih ettiği yerleri keşfetmek. Binlerce otel arasından sadece karakteri, hikayesi ve ruhu olan işletmeleri listelemek. Algoritmaların değil, <strong>gerçek deneyimin</strong> küratörlüğünü sunmak.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
          <p className="text-zinc-800 font-medium text-center italic">
            "Türkiye'nin turizm potansiyelini modern ve güvenilir bir arayüzle sunmak; seyahat planı yapan herkesin 'Acaba nerede kalsam?' sorusuna, en doğru cevabı veren adres olmak için çalışıyoruz."
          </p>
        </div>

        {/* Sosyal Medya */}
        <div className="mt-16 text-center">
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
            Bizi Takip Edin
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/geceligi.ne.kadar/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-all hover:scale-105"
            >
              <Instagram size={18} />
              @geceligi.ne.kadar
            </a>
            <a
              href="https://www.instagram.com/turkeyandhotels/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 border border-zinc-200 text-zinc-900 rounded-full font-medium hover:bg-zinc-50 transition-all hover:scale-105"
            >
              <Instagram size={18} />
              @turkeyandhotels
            </a>
          </div>
        </div>

      </article>
    </main>
  );
}
