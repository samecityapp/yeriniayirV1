import React from 'react';
import { Check, Users, TrendingUp, Camera, Search, ArrowRight, Star } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Yerini Ayır - Otel İşbirliği ve Başvuru',
    description: 'Seçkin oteller için özel işbirliği fırsatları.',
};

export default function HotelOfferPage({ params }: { params: { lang: string } }) {
    return (
        <main className="bg-white text-gray-900 font-sans selection:bg-rose-100 selection:text-rose-900 pb-20">

            {/* 1. HERO SECTION & VALUE PROP - Tighter vertical spacing */}
            <section className="relative pt-16 pb-12 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-rose-100/40 to-orange-100/40 rounded-full opacity-50 -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-100/30 rounded-full opacity-50 -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="max-w-6xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full text-rose-600 text-xs font-bold tracking-wider uppercase mb-2">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                        Sadece Seçkin Oteller İçin
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-none">
                        Otelinizin sayfasını, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600 animate-gradient-x">
                            başka hiçbir sitede olmayan
                        </span> <br />
                        şekilde size özel oluşturuyoruz.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto">
                        Bunu, az sayıda seçkin otelle çalıştığımız için yapabiliyoruz.
                    </p>
                </div>
            </section>

            {/* 2. DUAL COLUMN: PREMIUM GUEST & VALUE COMPARISON */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16">

                    {/* Left: Premium Guest Text */}
                    <div className="flex flex-col justify-center space-y-6">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-[1.15]">
                            Size, otelinizin <span className="text-rose-600 italic">ruhunu</span> anlayan ve fiyat yerine <span className="underline decoration-4 decoration-rose-200 decoration-skip-ink">deneyimi önemseyen</span> premium misafirler getireceğiz.
                        </h2>
                    </div>

                    {/* Right: Value vs Volume Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Yerini Ayır Farkı</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                                    <p className="line-through decoration-gray-300">"Diğer otel sitelerinde binlerce otel arasında hak ettiğiniz değeri göremiyorsunuz."</p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-lg md:text-xl font-bold text-gray-900 leading-snug">
                                        Bizde ise sınırlı sayıdaki <span className="text-rose-600">seçkin oteller</span> arasında yer alırsınız.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. DIRECT CONNECTION (DARK SECTION) */}
            <section className="py-16 md:py-24 bg-[#0B1221] text-white overflow-hidden relative my-12 rounded-[2.5rem] mx-2 md:mx-6 shadow-2xl">
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="relative max-w-4xl mx-auto text-center px-6 space-y-8">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/20 backdrop-blur-xl">
                        <Users className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                        Biz aradan çekilir, <br />
                        <span className="text-rose-400 inline-block mt-2">misafiri doğrudan size bağlarız.</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto border-t border-white/10 pt-8 mt-8">
                        Komisyon yok. Aracı yok. Sizinle misafir arasındaki o özel bağı koparmayız.
                    </p>
                </div>
            </section>

            {/* 4. GROWTH STRATEGY (3 PILLARS) */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block relative">
                            Rezervasyonlarınızı Nasıl Artırıyoruz?
                            <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-rose-500 rounded-full opacity-20"></div>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Pillar 1 */}
                        <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100 hover:bg-rose-50 transition-colors duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-rose-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sosyal Medya & Erişim</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Sosyal medya hesaplarımız, her ay otel arayan milyonlarca kişiye ulaşıyor.
                                <span className="block text-rose-700 font-bold mt-1">Otelinizi nokta atışı kitleyle buluşturacağız.</span>
                            </p>
                        </div>

                        {/* Pillar 2 */}
                        <div className="bg-orange-50/50 p-8 rounded-3xl border border-orange-100 hover:bg-orange-50 transition-colors duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Camera className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Görsel Optimizasyon</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                11 yıllık tecrübemizle, hangi görsellerin rezervasyon getirdiğini biliyoruz ve
                                <span className="block text-orange-700 font-bold mt-1">tüm görsellerinizi buna göre optimize edeceğiz.</span>
                            </p>
                        </div>

                        {/* Pillar 3 */}
                        <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 hover:bg-blue-50 transition-colors duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Search className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">SEO & GEO Yapay Zeka</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                SEO ve GEO ile (yapay zekâ tabanlı) web aramalarında öne çıkmanızı sağlıyor;
                                <span className="block text-blue-700 font-bold mt-1">yabancı misafirleri doğrudan size getiriyoruz.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PRICING CARD */}
            <section className="py-12 px-6">
                <div className="max-w-md mx-auto relative">
                    {/* Glow behind card */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-rose-200 to-orange-200 rounded-full blur-3xl -z-10 opacity-50" />

                    <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Özel Katılım Teklifi</h3>

                        <div className="my-6">
                            <div className="flex items-center justify-center gap-1 text-gray-900 leading-none">
                                <span className="text-6xl font-black tracking-tighter">25.000</span>
                                <div className="flex flex-col items-start gap-0.5 ml-1">
                                    <span className="text-lg font-bold text-gray-400">TL</span>
                                    <span className="text-xs font-bold text-gray-300">+ KDV</span>
                                </div>
                            </div>
                            <div className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">
                                Lansmana Özel Fırsat
                            </div>
                        </div>

                        <div className="space-y-5 text-left mb-8 px-2">
                            {/* Item 1 */}
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-rose-600" />
                                </div>
                                <div>
                                    <span className="block text-gray-900 font-bold text-lg">12 + 2 Ay Üyelik</span>
                                    <span className="block text-gray-500 text-sm font-medium">Toplam 14 ay boyunca platformda aktif listelenme</span>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-rose-600" />
                                </div>
                                <div>
                                    <span className="block text-gray-900 font-bold text-lg">Turkeyandhotels Hikaye</span>
                                    <span className="block text-gray-500 text-sm font-medium">2 adet otelinizi tanıtan özel hikaye paylaşımı</span>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-rose-600" />
                                </div>
                                <div>
                                    <span className="block text-gray-900 font-bold text-lg">GeceliğiNeKadar Hikaye</span>
                                    <span className="block text-gray-500 text-sm font-medium">2 adet otelinizi tanıtan özel hikaye paylaşımı</span>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-rose-600" />
                                </div>
                                <div>
                                    <span className="block text-gray-900 font-bold text-lg">Liste Önerileri</span>
                                    <span className="block text-gray-500 text-sm font-medium">Sosyal medyada "En İyiler" listelerinde yer alma</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group">
                            Hemen Başvurun <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-4 text-xs text-gray-400 font-medium">
                            Sınırlı kontenjan nedeniyle başvurular değerlendirmeye alınacaktır.
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
