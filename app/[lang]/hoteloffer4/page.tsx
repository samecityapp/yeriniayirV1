import React from 'react';
import { Check, Star, Users, Zap, Instagram, ChevronRight, BarChart3, Globe } from 'lucide-react';
import Link from 'next/link';

// Custom TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="1em"
        width="1em"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

export default function HotelOfferPageV4() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black/10">

            {/* Header / Nav Placeholder (Minimal) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-bold text-lg tracking-tight text-black">Yerini<span className="text-gray-400">Ayir</span>.com</div>
                    <Link href="#pricing" className="text-xs font-semibold bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all shadow-sm">
                        Başvur
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20">

                {/* --- HERO SECTION: COMPACT & CENTERED --- */}
                <section className="px-6 mb-12 text-center relative">
                    <div className="max-w-4xl mx-auto">

                        {/* Elegant Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-10 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                            Yeni Nesil Konaklama Deneyimi
                        </div>

                        {/* Title - Deep Black, High Contrast */}
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black mb-8 leading-[1.05]">
                            Yerini<span className="text-gray-300">Ayir</span>.com
                        </h1>

                        {/* Subtitle - Refined Serif/Slate tone */}
                        <p className="text-xl md:text-3xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed mb-12">
                            Influencer gücüyle desteklenen, <span className="text-black font-semibold">sadece en seçkin otellerin platformu.</span>
                        </p>

                        {/* Social Proof Stats (Horizontal Strip) - Clean White Card style */}
                        <div className="inline-flex flex-wrap justify-center gap-6 md:gap-16 p-2 md:p-4 border border-gray-100 rounded-3xl bg-white shadow-xl shadow-gray-200/50 mb-16">
                            <div className="px-4 py-2 flex items-center gap-3">
                                <Instagram className="w-6 h-6 text-black" />
                                <div className="text-left">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">@turkeyandhotels</div>
                                    <div className="text-xl font-bold text-black leading-none mt-1">321.000+</div>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
                            <div className="px-4 py-2 flex items-center gap-3">
                                <Instagram className="w-6 h-6 text-black" />
                                <div className="text-left">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">@geceligi.ne.kadar</div>
                                    <div className="text-xl font-bold text-black leading-none mt-1">305.000+</div>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
                            <div className="px-4 py-2 flex items-center gap-3">
                                <TikTokIcon className="w-6 h-6 text-black" />
                                <div className="text-left">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">@geceligi.nekadar</div>
                                    <div className="text-xl font-bold text-black leading-none mt-1">60.000+</div>
                                </div>
                            </div>
                        </div>

                        {/* Quote Box - Minimalist */}
                        <div className="relative bg-gray-50 rounded-2xl p-8 border-l-4 border-black text-left max-w-3xl mx-auto shadow-sm">
                            <p className="text-xl text-gray-800 font-serif italic leading-relaxed">
                                "Otelinizi yıl boyunca sosyal medya hesaplarımızda ve web sitemizde öne çıkarır, rezervasyonlarınızı artırırız."
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- BENTO GRID LAYOUT (VALUE + GROWTH) --- */}
                <section className="px-6 max-w-7xl mx-auto mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* 1. Value Prop: Premium Audience (Large Card) */}
                        <div className="bg-gray-50 md:col-span-2 p-10 md:p-12 rounded-[2.5rem] relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
                                    <Users className="w-6 h-6 text-black" />
                                </div>
                                <h3 className="text-3xl font-bold text-black mb-4">Premium Misafir Kitlesi</h3>
                                <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                                    Size, otelinizin ruhunu anlayan ve fiyat yerine deneyimi önemseyen premium misafirler getireceğiz.
                                </p>
                            </div>
                            <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-indigo-100/50 to-transparent -z-0 rounded-bl-[100px]"></div>
                        </div>

                        {/* 2. Value Prop: Direct Connection */}
                        <div className="bg-gray-50 p-10 md:p-12 rounded-[2.5rem] flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
                            <div>
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
                                    <Zap className="w-6 h-6 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-4">"0" Komisyon</h3>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    Biz aradan çekilir, misafiri doğrudan size bağlarız. Sizinle misafir arasındaki bağı koparmayız. Komisyon almayız
                                </p>
                            </div>
                        </div>

                        {/* 3. Value Prop: True Value */}
                        <div className="bg-gray-50 p-10 md:p-12 rounded-[2.5rem] group hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
                                <Star className="w-6 h-6 text-black" />
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">Hak Ettiğiniz Değer</h3>
                            <p className="text-gray-600 leading-relaxed text-base">
                                Diğer online seyahat platformlarında (OTA’lar) binlerce otel arasında hak ettiğiniz değeri göremiyorsunuz. Bizde ise otelinizle benzer kalite ve karakterdeki sınırlı sayıdaki seçkin oteller arasında yer alırsınız.
                            </p>
                        </div>

                        {/* 4. Exclusive Promise Banner (Wide & Classy) */}
                        <div className="md:col-span-2 bg-black p-10 md:p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                            <div className="flex-1 z-10 text-center md:text-left">
                                <span className="text-yellow-400 text-[11px] font-bold tracking-widest uppercase mb-3 block">Sadece Seçkin Oteller İçin</span>
                                <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
                                    Otelinizin sayfasını, <span className="text-gray-400">tamamen size özel</span> oluşturacağız.
                                </h3>
                                <p className="text-gray-400 text-sm font-medium">Bunu, az sayıda seçkin otelle çalıştığımız için yapabiliyoruz.</p>
                            </div>

                            <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
                        </div>

                    </div>
                </section>

                {/* --- HOW IT WORKS (Clean White Cards) --- */}
                <section className="px-6 max-w-7xl mx-auto mb-24">
                    <h2 className="text-3xl font-bold text-black mb-12 tracking-tight">Rezervasyonlarınızı Nasıl Artırıyoruz?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-5xl font-black text-gray-100 mb-6">1</div>
                            <h4 className="text-xl font-bold text-black mb-3">Nokta Atışı Kitle</h4>
                            <p className="text-gray-500 leading-relaxed text-sm">Sosyal medya hesaplarımız, her ay otel arayan milyonlarca kişiye ulaşıyor. Otelinizi nokta atışı kitleyle buluşturacağız.</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-5xl font-black text-gray-100 mb-6">2</div>
                            <h4 className="text-xl font-bold text-black mb-3">Görsel Optimizasyon Uzmanlığı</h4>
                            <p className="text-gray-500 leading-relaxed text-sm">Doğru görsel seçimi rezervasyonları artırır. 11 yıllık tecrübemizle, hangi görsellerin rezervasyon getirdiğini biliyoruz ve tüm satış kanallarındaki görsellerinizi buna göre optimize edeceğiz.</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-5xl font-black text-gray-100 mb-6">3</div>
                            <h4 className="text-xl font-bold text-black mb-3">SEO ve GEO (Yapay Zeka) Gücü</h4>
                            <p className="text-gray-500 leading-relaxed text-sm">SEO ile web aramalarında, GEO ile yapay zekâ tabanlı aramalarda öne çıkmanızı sağlıyor; yabancı misafirleri doğrudan size getiriyoruz.</p>
                        </div>
                    </div>
                </section>

                {/* --- PRICING: PREMIUM WHITE & BLACK --- */}
                <section id="pricing" className="px-6 max-w-4xl mx-auto">
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-indigo-100/50 overflow-hidden relative">
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-50 to-transparent -z-0"></div>

                        <div className="p-10 md:p-14 relative z-10">
                            <div className="text-center mb-14">
                                <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-black text-white text-[11px] font-bold tracking-widest uppercase shadow-lg shadow-black/20">
                                    Lansmana Özel • İlk 100 Otel
                                </span>
                                {/* Corrected Header */}
                                <h2 className="text-3xl md:text-5xl font-black text-black mb-4 tracking-tight">Özel Katılım Teklifi – Founding Partner</h2>
                                <div className="text-6xl md:text-7xl font-bold text-black tracking-tighter my-6">
                                    29.000 <span className="text-2xl text-gray-400 font-normal tracking-normal">+ KDV</span>
                                </div>
                                {/* Removed 'Tek seferlik' text here as requested */}
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-black font-bold text-lg">12 + 2 Ay Üyelik</div>
                                            <div className="text-gray-500 text-sm mt-1">Toplam 14 ay boyunca platformda aktif ve görünür listelenme</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-black font-bold text-lg">Sosyal Medya Tanıtımı</div>
                                            <div className="text-gray-500 text-sm mt-1 space-y-1">
                                                <div><span className="text-indigo-600 font-semibold">@TurkeyandHotels:</span> Otelinize ait 2 özel hikâye paylaşımı</div>
                                                <div><span className="text-indigo-600 font-semibold">@GeceliğiNeKadar:</span> Otelinize ait 2 özel hikâye paylaşımı</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-black font-bold text-lg">Bölgenize Ait Makalelerde Önerilme</div>
                                            <div className="text-gray-500 text-sm mt-1">“Kapadokya’da Nerede Kalınır?” gibi rehber içeriklerde otelinizin önerilmesi</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-black font-bold text-lg">Liste & “En İyiler” Önerileri</div>
                                            <div className="text-gray-500 text-sm mt-1">Yıl boyunca aralıklarla otelinizi tanıtan sosyal medya paylaşımları.</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-black font-bold text-lg">Otelinizin Instagram hesabı analizi ve iyileştirme önerileri</div>
                                            <div className="text-gray-500 text-sm mt-1">Otelinizin Instagram hesabı için içerik ve görünürlük analizi</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-black font-bold text-lg">OTA Görsel Düzenleme Desteği</div>
                                            <div className="text-gray-500 text-sm mt-1">Mevcut OTA (Booking vb.) görsellerinizin daha etkili hale getirilmesi için düzenleme önerileri</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Star className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-black font-bold text-lg">Kapadokya’dan Sınırlı Sayıda Seçilmiş Otel</div>
                                            <div className="text-gray-500 text-sm mt-1">Her bölgeden yalnızca çok az sayıda otel kabul edilir (herkese açık bir liste değildir)</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Star className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-black font-bold text-lg">“YeriniAyir Seçilmiş Oteli” Rozeti</div>
                                            <div className="text-gray-500 text-sm mt-1">Web sitenizde ve tanıtımlarınızda kullanabileceğiniz prestij rozeti</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-10 text-gray-400 text-xs font-medium uppercase tracking-widest">
                        *Bu kampanyalı teklif, yalnızca ilk 100 üye otel için geçerlidir.
                    </div>
                </section>

                <footer className="mt-24 text-center border-t border-gray-100 pt-10 pb-10">
                    <p className="text-gray-400 text-sm font-medium">© 2026 YeriniAyir.com. Tüm hakları saklıdır.</p>
                </footer>

            </main>
        </div>
    );
}
