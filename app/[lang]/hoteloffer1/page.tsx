import React from 'react';
import { Check, Star, Users, BarChart3, Globe, Zap, Camera, Lock } from 'lucide-react';
import Link from 'next/link';

export default function PartnerPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">

            {/* --- HERO SECTION: HOOK --- */}
            <section className="relative bg-zinc-950 text-white py-20 px-6 md:py-32 overflow-hidden">
                {/* Dekoratif Arka Plan Efekti */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-yellow-600 rounded-full blur-[128px] transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-zinc-500 rounded-full blur-[96px] transform -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-zinc-800 text-yellow-500 text-xs font-bold tracking-widest uppercase mb-6 border border-zinc-700">
                        Sadece Seçkin Oteller İçin
                    </span>
                    <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8">
                        Otelinizin sayfasını, <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">başka hiçbir sitede olmayan</span> şekilde tamamen size özel oluşturacağız.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl mx-auto">
                        Bunu, az sayıda seçkin otelle çalıştığımız için yapabiliyoruz.
                    </p>
                </div>
            </section>

            {/* --- VALUE PROPOSITION: FAYDALAR --- */}
            <section className="py-20 px-6 bg-zinc-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-10">

                        {/* Kart 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-yellow-400">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Premium Misafir Kitlesi</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Size, otelinizin ruhunu anlayan ve fiyat yerine deneyimi önemseyen premium misafirler getireceğiz.
                            </p>
                        </div>

                        {/* Kart 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-yellow-400">
                                <Star size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Hak Ettiğiniz Değer</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Diğer otel sitelerinde binlerce otel arasında hak ettiğiniz değeri göremiyorsunuz. Bizde ise sınırlı sayıdaki seçkin oteller arasında yer alırsınız.
                            </p>
                        </div>

                        {/* Kart 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-yellow-400">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Doğrudan Bağlantı</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Biz aradan çekilir, misafiri doğrudan size bağlarız. Sizinle misafir arasındaki bağı koparmayız.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS: NASIL YAPIYORUZ? --- */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Rezervasyonlarınızı Nasıl Artırıyoruz?</h2>
                        <div className="w-20 h-1 bg-yellow-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-12">
                        {/* Madde 1 */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0 w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 font-bold text-2xl border border-yellow-100">1</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Nokta Atışı Kitle</h3>
                                <p className="text-zinc-600">
                                    Sosyal medya hesaplarımız, her ay otel arayan milyonlarca kişiye ulaşıyor. Otelinizi nokta atışı kitleyle buluşturacağız.
                                </p>
                            </div>
                        </div>

                        {/* Madde 2 */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0 w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 font-bold text-2xl border border-yellow-100">2</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Görsel Optimizasyon Uzmanlığı</h3>
                                <p className="text-zinc-600">
                                    Doğru görsel seçimi rezervasyonları artırır. 11 yıllık tecrübemizle, hangi görsellerin rezervasyon getirdiğini biliyoruz ve tüm satış kanallarındaki görsellerinizi buna göre optimize edeceğiz.
                                </p>
                            </div>
                        </div>

                        {/* Madde 3 */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0 w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 font-bold text-2xl border border-yellow-100">3</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">SEO ve GEO (Yapay Zeka) Gücü</h3>
                                <p className="text-zinc-600">
                                    SEO ile web aramalarında, GEO ile yapay zekâ tabanlı aramalarda öne çıkmanızı sağlıyor; yabancı misafirleri doğrudan size getiriyoruz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING: TEKLİF --- */}
            <section className="py-20 px-6 bg-zinc-900 text-white relative overflow-hidden">
                {/* Dekorasyon */}
                <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="max-w-md mx-auto relative z-10">
                    <div className="bg-zinc-800 rounded-3xl p-8 border border-zinc-700 shadow-2xl transform hover:scale-105 transition-transform duration-300 ring-1 ring-yellow-500/30">

                        <div className="text-center mb-8">
                            <span className="bg-yellow-500 text-zinc-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Özel Lansman Teklifi</span>
                            <h2 className="text-4xl font-bold mt-4">25.000 TL <span className="text-lg font-normal text-zinc-400">+ KDV</span></h2>
                            <p className="text-zinc-400 mt-2 text-sm">Yıllık Üyelik Paketi</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                <span className="text-zinc-200"><strong>12+2 (14 Aylık)</strong> Site Üyeliği</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                <span className="text-zinc-200"><strong>@turkeyandhotels</strong> sayfasında 2 adet Hikaye Tanıtımı</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                <span className="text-zinc-200"><strong>@geceliginekadar</strong> sayfasında 2 adet Hikaye Tanıtımı</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                <span className="text-zinc-200">Sosyal medyada periyodik &quot;Öneri Listeleri&quot; paylaşımları</span>
                            </li>
                        </ul>

                        <Link href="mailto:info@yeriniayir.com?subject=Partnerlik Başvurusu"
                            className="block w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold text-center py-4 rounded-xl transition-colors duration-200 shadow-lg shadow-yellow-500/20">
                            Hemen Başvurun
                        </Link>

                        <p className="text-center text-zinc-500 text-xs mt-4">
                            Sınırlı sayıda otel için geçerlidir.
                        </p>

                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-zinc-950 text-zinc-500 py-8 text-center border-t border-zinc-900">
                <p className="text-sm">© 2026 YeriniAyir.com - Tüm Hakları Saklıdır.</p>
            </footer>

        </div>
    );
}
