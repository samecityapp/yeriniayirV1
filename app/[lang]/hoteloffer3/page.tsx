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

export default function HotelOfferPageV3() {
    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white/20">

            {/* Header / Nav Placeholder (Minimal) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="font-bold text-lg tracking-tight">Yerini<span className="text-gray-400">Ayir</span>.com</div>
                    <Link href="#pricing" className="text-xs font-medium bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                        Başvur
                    </Link>
                </div>
            </header>

            <main className="pt-24 pb-20">

                {/* --- HERO SECTION: COMPACT & CENTERED --- */}
                <section className="px-6 mb-10 text-center relative">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-8">
                            <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                            Yeni Nesil Konaklama Deneyimi
                        </div>

                        {/* Corrected Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
                            Yerini<span className="text-indigo-400">Ayir</span>.com
                        </h1>

                        {/* Corrected Subtitle */}
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                            Influencer gücüyle desteklenen, <span className="text-white">sadece en seçkin otellerin platformu.</span>
                        </p>

                        {/* Social Proof Stats (Horizontal Strip) - Corrected Numbers */}
                        <div className="inline-flex flex-wrap justify-center gap-4 md:gap-12 p-1 border border-white/10 rounded-2xl bg-[#050507] mb-12">
                            <div className="px-6 py-3 flex items-center gap-3">
                                <Instagram className="w-5 h-5 text-pink-500" />
                                <div className="text-left">
                                    <div className="text-xs text-gray-500 font-medium">@turkeyandhotels</div>
                                    <div className="text-lg font-bold text-white leading-none">321.000+</div>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                            <div className="px-6 py-3 flex items-center gap-3">
                                <Instagram className="w-5 h-5 text-orange-500" />
                                <div className="text-left">
                                    <div className="text-xs text-gray-500 font-medium">@geceligi.ne.kadar</div>
                                    <div className="text-lg font-bold text-white leading-none">305.000+</div>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                            <div className="px-6 py-3 flex items-center gap-3">
                                <TikTokIcon className="w-5 h-5 text-cyan-400" />
                                <div className="text-left">
                                    <div className="text-xs text-gray-500 font-medium">@geceligi.nekadar</div>
                                    <div className="text-lg font-bold text-white leading-none">60.000+</div>
                                </div>
                            </div>
                        </div>

                        {/* Restored Quote Box */}
                        <div className="relative bg-white/5 rounded-xl p-6 border-l-4 border-indigo-500 text-left max-w-3xl mx-auto">
                            <p className="text-lg text-gray-300 font-light italic leading-relaxed">
                                "Otelinizi yıl boyunca sosyal medya hesaplarımızda ve web sitemizde öne çıkarır, rezervasyonlarınızı artırırız."
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- BENTO GRID LAYOUT (VALUE + GROWTH) --- */}
                <section className="px-6 max-w-7xl mx-auto mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* 1. Value Prop: Premium Audience (Large Card) */}
                        <div className="bg-[#0A0A0A] md:col-span-2 p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                                    <Users className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">Premium Misafir Kitlesi</h3>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                                    Size, otelinizin ruhunu anlayan ve fiyat yerine deneyimi önemseyen premium misafirler getireceğiz.
                                </p>
                            </div>
                            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-900/10 blur-[80px] -z-0"></div>
                        </div>

                        {/* 2. Value Prop: Direct Connection - Corrected Text */}
                        <div className="bg-[#0A0A0A] p-8 md:p-10 rounded-3xl border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                            <div>
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">"0" Komisyon</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Biz aradan çekilir, misafiri doğrudan size bağlarız. Sizinle misafir arasındaki bağı koparmayız. Komisyon almayız
                                </p>
                            </div>
                        </div>

                        {/* 3. Value Prop: True Value - Corrected Text */}
                        <div className="bg-[#0A0A0A] p-8 md:p-10 rounded-3xl border border-white/5 group hover:border-white/10 transition-colors">
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                                <Star className="w-5 h-5 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Hak Ettiğiniz Değer</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Diğer online seyahat platformlarında (OTA’lar) binlerce otel arasında hak ettiğiniz değeri göremiyorsunuz. Bizde ise sınırlı sayıdaki seçkin oteller arasında yer alırsınız.
                            </p>
                        </div>

                        {/* 4. Exclusive Promise Banner (Wide) - Verified Text */}
                        <div className="md:col-span-2 bg-[#0A0A0A] p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 z-10 text-center md:text-left">
                                <span className="text-yellow-500 text-[10px] font-bold tracking-widest uppercase mb-2 block">Sadece Seçkin Oteller İçin</span>
                                <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight mb-2">
                                    Otelinizin sayfasını, <span className="text-yellow-400">başka hiçbir platformda olmayan</span> şekilde tamamen size özel oluşturacağız.
                                </h3>
                                <p className="text-gray-400 text-sm">Bunu, az sayıda seçkin otelle çalıştığımız için yapabiliyoruz.</p>
                            </div>

                            <div className="absolute left-0 bottom-0 w-full h-full bg-gradient-to-r from-yellow-900/5 to-transparent pointer-events-none"></div>
                        </div>

                    </div>
                </section>

                {/* --- HOW IT WORKS (Horizontal Scroll / Grid) - Verified Text --- */}
                <section className="px-6 max-w-7xl mx-auto mb-20">
                    <h2 className="text-2xl font-semibold text-white mb-8">Rezervasyonlarınızı Nasıl Artırıyoruz?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-[#080808] border border-white/5">
                            <div className="text-4xl font-bold text-white/10 mb-4">1</div>
                            <h4 className="text-lg font-bold text-white mb-2">Nokta Atışı Kitle</h4>
                            <p className="text-gray-500 text-sm">Sosyal medya hesaplarımız, her ay otel arayan milyonlarca kişiye ulaşıyor. Otelinizi nokta atışı kitleyle buluşturacağız.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#080808] border border-white/5">
                            <div className="text-4xl font-bold text-white/10 mb-4">2</div>
                            <h4 className="text-lg font-bold text-white mb-2">Görsel Optimizasyon Uzmanlığı</h4>
                            <p className="text-gray-500 text-sm">Doğru görsel seçimi rezervasyonları artırır. 11 yıllık tecrübemizle, hangi görsellerin rezervasyon getirdiğini biliyoruz ve tüm satış kanallarındaki görsellerinizi buna göre optimize edeceğiz.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#080808] border border-white/5">
                            <div className="text-4xl font-bold text-white/10 mb-4">3</div>
                            <h4 className="text-lg font-bold text-white mb-2">SEO ve GEO (Yapay Zeka) Gücü</h4>
                            <p className="text-gray-500 text-sm">SEO ile web aramalarında, GEO ile yapay zekâ tabanlı aramalarda öne çıkmanızı sağlıyor; yabancı misafirleri doğrudan size getiriyoruz.</p>
                        </div>
                    </div>
                </section>

                {/* --- PRICING: CLEAN & LIST - Verified Text --- */}
                <section id="pricing" className="px-6 max-w-4xl mx-auto">
                    <div className="bg-[#050507] rounded-[2rem] border border-white/10 overflow-hidden relative">
                        {/* Decorative Blur */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-0"></div>

                        <div className="p-10 md:p-12 relative z-10">
                            <div className="text-center mb-12">
                                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-widest uppercase border border-indigo-500/20">
                                    Lansmana Özel - İlk 100 Otel
                                </span>
                                {/* Corrected Header */}
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Özel Katılım Teklifi – Founding Partner</h2>
                                <div className="text-5xl font-semibold text-white tracking-tighter my-4">
                                    29.000 <span className="text-xl text-gray-400 font-normal">+ KDV</span>
                                </div>

                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">12 + 2 Ay Üyelik</div>
                                            <div className="text-gray-500 text-xs mt-0.5">Toplam 14 ay boyunca platformda aktif ve görünür listelenme</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">Sosyal Medya Tanıtımı</div>
                                            <div className="text-gray-500 text-xs mt-1 space-y-1">
                                                <div><span className="text-indigo-400 font-medium">@TurkeyandHotels:</span> Otelinize ait 2 özel hikâye paylaşımı</div>
                                                <div><span className="text-indigo-400 font-medium">@GeceliğiNeKadar:</span> Otelinize ait 2 özel hikâye paylaşımı</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">Bölgenize Ait Makalelerde Önerilme</div>
                                            <div className="text-gray-500 text-xs mt-0.5">“Kapadokya’da Nerede Kalınır?” gibi rehber içeriklerde otelinizin önerilmesi</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">Liste & “En İyiler” Önerileri</div>
                                            <div className="text-gray-500 text-xs mt-0.5">Yıl boyunca aralıklarla otelinizi tanıtan sosyal medya paylaşımları.</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">Otelinizin Instagram hesabı analizi ve iyileştirme önerileri</div>
                                            <div className="text-gray-500 text-xs mt-0.5">Otelinizin Instagram hesabı için içerik ve görünürlük analizi</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">OTA Görsel Düzenleme Desteği</div>
                                            <div className="text-gray-500 text-xs mt-0.5">Mevcut OTA (Booking vb.) görsellerinizin daha etkili hale getirilmesi için düzenleme önerileri</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center flex-shrink-0">
                                            <Star className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">Kapadokya’dan Sınırlı Sayıda Seçilmiş Otel</div>
                                            <div className="text-gray-500 text-xs mt-0.5">Her bölgeden yalnızca çok az sayıda otel kabul edilir (herkese açık bir liste değildir)</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center flex-shrink-0">
                                            <Star className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">“YeriniAyir Seçilmiş Oteli” Rozeti</div>
                                            <div className="text-gray-500 text-xs mt-0.5">Web sitenizde ve tanıtımlarınızda kullanabileceğiniz prestij rozeti</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-8 text-gray-600 text-xs">
                        *Bu kampanyalı teklif, yalnızca ilk 100 üye otel için geçerlidir.
                    </div>
                </section>

                <footer className="mt-20 text-center border-t border-white/5 pt-8">
                    <p className="text-gray-600 text-sm">© 2026 YeriniAyir.com. Tüm hakları saklıdır.</p>
                </footer>

            </main>
        </div>
    );
}
