import React from 'react';
import { Check, ArrowRight, Instagram, Users, Star, Zap } from 'lucide-react';
import Link from 'next/link';

// Custom TikTok Icon since it's not in Lucide by default or commonly used one
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

export default function HotelOfferPageV2() {
    return (
        <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-indigo-500/30">

            {/* --- HERO SECTION BASED ON IMAGE --- */}
            <section className="relative pt-20 pb-16 px-6 overflow-hidden">

                {/* Background Glows matching the image's dark blue aesthetic */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] -z-10" />

                <div className="max-w-5xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-10 shadow-lg shadow-indigo-900/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Yeni Nesil Konaklama Deneyimi
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
                        Yerini<span className="text-indigo-400">Ayir</span>.com
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed mb-16">
                        Influencer gücüyle desteklenen, <span className="text-white font-semibold">sadece en seçkin otellerin platformu.</span>
                    </p>

                    {/* Stats Section with Divider */}
                    <div className="relative mb-12">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#050B14] px-4 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                                Tanıtım Gücü
                            </span>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {/* Card 1 */}
                        <div className="bg-[#0A101D] border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300 group">
                            <div className="flex items-center gap-2 mb-3">
                                <Instagram className="w-4 h-4 text-[#D62976]" />
                                <span className="text-[10px] font-bold tracking-widest text-[#D62976] uppercase">Instagram</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">@turkeyandhotels</div>
                            <div className="text-4xl font-bold text-white group-hover:text-indigo-400 transition-colors">321.000+</div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#0A101D] border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300 group">
                            <div className="flex items-center gap-2 mb-3">
                                <Instagram className="w-4 h-4 text-[#FA7E1E]" />
                                <span className="text-[10px] font-bold tracking-widest text-[#FA7E1E] uppercase">Instagram</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">@geceligi.ne.kadar</div>
                            <div className="text-4xl font-bold text-white group-hover:text-indigo-400 transition-colors">305.000+</div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#0A101D] border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300 group">
                            <div className="flex items-center gap-2 mb-3">
                                <TikTokIcon className="w-4 h-4 text-[#00F2EA]" />
                                <span className="text-[10px] font-bold tracking-widest text-[#00f2ea] uppercase">TikTok</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">@geceligi.nekadar</div>
                            <div className="text-4xl font-bold text-white group-hover:text-indigo-400 transition-colors">60.000+</div>
                        </div>
                    </div>

                    {/* Quote Box */}
                    <div className="relative bg-gradient-to-r from-white/5 to-white/0 rounded-xl p-6 md:p-8 border-l-4 border-indigo-500 text-left max-w-4xl mx-auto">
                        <p className="text-lg md:text-xl text-gray-200 font-light italic leading-relaxed">
                            "Otelinizi yıl boyunca sosyal medya hesaplarımızda ve web sitemizde öne çıkarır, rezervasyonlarınızı artırırız."
                        </p>
                    </div>

                </div>
            </section>

            {/* --- REST OF THE CONTENT (ADAPTED TO DARK THEME) --- */}

            {/* Value Prop Section */}
            {/* --- VALUE PROPOSITION (3-CARD LAYOUT) --- */}
            {/* --- VALUE PROPOSITION (3-CARD LAYOUT) --- */}
            <section className="pt-24 pb-10 px-6 bg-[#080E1A]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1: Premium Misafir */}
                        <div className="bg-[#0F1623] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Users className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Premium Misafir Kitlesi</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Size, otelinizin ruhunu anlayan ve fiyat yerine deneyimi önemseyen premium misafirler getireceğiz.
                            </p>
                        </div>

                        {/* Card 2: Hak Ettiğiniz Değer */}
                        <div className="bg-[#0F1623] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Star className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Hak Ettiğiniz Değer</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Diğer online seyahat platformlarında (OTA’lar) binlerce otel arasında hak ettiğiniz değeri göremiyorsunuz. Bizde ise otelinizle benzer kalite ve karakterdeki sınırlı sayıdaki seçkin oteller arasında yer alırsınız.
                            </p>
                        </div>

                        {/* Card 3: Doğrudan Bağlantı */}
                        <div className="bg-[#0F1623] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Zap className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">"0" Komisyon</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Biz aradan çekilir, misafiri doğrudan size bağlarız. Sizinle misafir arasındaki bağı koparmayız. Komisyon almayız
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EXCLUSIVE PROMISE (NEW SECTION) --- */}
            <section className="pt-10 pb-16 px-6 bg-black relative overflow-hidden flex items-center justify-center">
                {/* Subtle Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#080E1A] via-black to-[#080E1A]" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-8">
                        Sadece Seçkin Oteller İçin
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-white">
                        Otelinizin sayfasını, <span className="text-yellow-400">başka hiçbir platformda olmayan</span> şekilde tamamen size özel oluşturacağız.
                    </h2>

                    {/* Subtext */}
                    <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        Bunu, az sayıda seçkin otelle çalıştığımız için yapabiliyoruz.
                    </p>
                </div>
            </section>

            {/* --- GROWTH STRATEGY (HOW WE INCREASE) --- */}
            <section className="py-24 px-6 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Rezervasyonlarınızı Nasıl Artırıyoruz?</h2>
                        <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-8">
                        {/* Item 1 */}
                        <div className="flex gap-6 md:gap-8 items-start group">
                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#0F1623] rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-indigo-500 border border-white/5 group-hover:border-indigo-500/30 transition-colors shadow-lg">
                                1
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold text-white mb-2">Nokta Atışı Kitle</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Sosyal medya hesaplarımız, her ay otel arayan milyonlarca kişiye ulaşıyor. Otelinizi nokta atışı kitleyle buluşturacağız.
                                </p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex gap-6 md:gap-8 items-start group">
                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#0F1623] rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-indigo-500 border border-white/5 group-hover:border-indigo-500/30 transition-colors shadow-lg">
                                2
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold text-white mb-2">Görsel Optimizasyon Uzmanlığı</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Doğru görsel seçimi rezervasyonları artırır. 11 yıllık tecrübemizle, hangi görsellerin rezervasyon getirdiğini biliyoruz ve tüm satış kanallarındaki görsellerinizi buna göre optimize edeceğiz.
                                </p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex gap-6 md:gap-8 items-start group">
                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#0F1623] rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-indigo-500 border border-white/5 group-hover:border-indigo-500/30 transition-colors shadow-lg">
                                3
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold text-white mb-2">SEO ve GEO (Yapay Zeka) Gücü</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    SEO ile web aramalarında, GEO ile yapay zekâ tabanlı aramalarda öne çıkmanızı sağlıyor; yabancı misafirleri doğrudan size getiriyoruz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING / OFFER SECTION (FOUNDING PARTNER) --- */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative bg-[#0F1623] border border-white/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">

                        {/* Header Area */}
                        <div className="bg-[#131B2C] p-8 md:p-12 text-center border-b border-white/5">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Özel Katılım Teklifi – Founding Partner</h2>

                            <div className="flex items-center justify-center gap-3 mb-6">
                                <span className="text-6xl md:text-7xl font-black text-white tracking-tight">29.000</span>
                                <div className="flex flex-col items-start">
                                    <span className="text-2xl font-bold text-gray-400">TL</span>
                                    <span className="text-sm font-medium text-gray-500">+ KDV</span>
                                </div>
                            </div>

                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wide border border-indigo-500/30">
                                Lansmana Özel - İlk 100 Otel
                            </span>
                        </div>

                        <div className="p-8 md:p-12 space-y-12">

                            {/* Section: Neler Dahil? */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    Neler Dahil?
                                    <div className="h-px bg-white/10 flex-grow ml-4"></div>
                                </h3>

                                <ul className="space-y-6">
                                    {/* Item 1 */}
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">12 + 2 Ay Üyelik</h4>
                                            <p className="text-gray-400 text-sm mt-1">Toplam 14 ay boyunca platformda aktif ve görünür listelenme</p>
                                        </div>
                                    </li>

                                    {/* Item 2 (Moved from 3) */}
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Sosyal Medya Tanıtımı</h4>
                                            <div className="text-gray-400 text-sm mt-2 space-y-2">
                                                <p><span className="text-indigo-400 font-semibold">@TurkeyandHotels:</span> Otelinize ait 2 özel hikâye paylaşımı</p>
                                                <p><span className="text-indigo-400 font-semibold">@GeceliğiNeKadar:</span> Otelinize ait 2 özel hikâye paylaşımı</p>
                                            </div>
                                        </div>
                                    </li>

                                    {/* Item 3 (Previously 2) */}
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Bölgenize Ait Makalelerde Önerilme</h4>
                                            <p className="text-gray-400 text-sm mt-1">“Kapadokya’da Nerede Kalınır?” gibi rehber içeriklerde otelinizin önerilmesi</p>
                                        </div>
                                    </li>



                                    {/* Item 5 */}
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Liste & “En İyiler” Önerileri</h4>
                                            <p className="text-gray-400 text-sm mt-1">Yıl boyunca aralıklarla otelinizi tanıtan sosyal medya paylaşımları.</p>
                                        </div>
                                    </li>

                                    {/* Item 6 */}
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">OTA Görsel Düzenleme Desteği</h4>
                                            <p className="text-gray-400 text-sm mt-1">Mevcut OTA (Booking vb.) görsellerinizin daha etkili hale getirilmesi için düzenleme önerileri</p>
                                        </div>
                                    </li>

                                    {/* Item 7 */}
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Otelinizin Instagram hesabı analizi ve iyileştirme önerileri</h4>
                                            <p className="text-gray-400 text-sm mt-1">Otelinizin Instagram hesabı için içerik ve görünürlük analizi</p>
                                        </div>
                                    </li>

                                    {/* Item 8 (From Privileges) */}
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Kapadokya’dan Sınırlı Sayıda Seçilmiş Otel</h4>
                                            <p className="text-gray-400 text-sm mt-1">Her bölgeden yalnızca çok az sayıda otel kabul edilir (herkese açık bir liste değildir)</p>
                                        </div>
                                    </li>

                                    {/* Item 9 (From Privileges) */}
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">“YeriniAyir Seçilmiş Oteli” Rozeti</h4>
                                            <p className="text-gray-400 text-sm mt-1">Web sitenizde ve tanıtımlarınızda kullanabileceğiniz prestij rozeti</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Footer Disclaimer */}
                            <div className="text-center pt-4">
                                <p className="text-gray-500 text-sm font-medium">
                                    *Bu kampanyalı teklif, yalnızca ilk 100 üye otel için geçerlidir.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
