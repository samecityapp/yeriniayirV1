import React from 'react';
import { Check, Instagram, Users, Star, Zap } from 'lucide-react';
import { getLocativeSuffix, getAblativeSuffix } from '@/lib/turkish-grammar';

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

import { IncludedItem } from '@/lib/types';

interface OfferPageTemplateProps {
    hotelName: string;
    price: string;
    region: string;
    lang?: 'tr' | 'en' | 'el'; // Add 'el' support
    includedItems?: IncludedItem[] | null;
    promoText?: string;
}

export default function OfferPageTemplate({ hotelName, price, region, lang = 'tr', includedItems, promoText }: OfferPageTemplateProps) {

    // Content Dictionary
    const t = {
        tr: {
            badge: "Yeni Nesil Konaklama Deneyimi",
            titlePrefix: "Yerini",
            titleHighlight: "Ayir",
            titleDomain: ".com",
            subtitle: <span className="block text-3xl md:text-4xl font-extrabold tracking-tight mt-2"><span className="text-indigo-400">Sıfır Komisyon</span>, <span className="text-white">Direkt Rezervasyon</span></span>,
            statsTitle: "Tanıtım Gücü",
            followersSuffix: " Takipçi",
            quote: "\"Otelinizi yıl boyunca sosyal medya hesaplarımızda ve web sitemizde öne çıkarır, rezervasyonlarınızı artırırız.\"",

            val1Title: "Premium Misafir Kitlesi",
            val1Desc: "Size, otelinizin ruhunu anlayan ve fiyat yerine deneyimi önemseyen premium misafirler getireceğiz.",

            val2Title: "Hak Ettiğiniz Değer",
            val2Desc: "Diğer online seyahat platformlarında (OTA’lar) binlerce otel arasında hak ettiğiniz değeri göremiyorsunuz. Bizde ise otelinizle benzer kalite ve karakterdeki sınırlı sayıdaki seçkin oteller arasında yer alırsınız.",

            val3Title: "\"0\" Komisyon",
            val3Desc: "Biz aradan çekilir, misafiri doğrudan size bağlarız. Sizinle misafir arasındaki bağı koparmayız. Komisyon almayız",

            exBadge: "Sadece Seçkin Oteller İçin",
            exTitle: <>Otelinizin sayfasını, <span className="text-yellow-400">başka hiçbir platformda olmayan</span> şekilde tamamen size özel oluşturacağız.</>,
            exDesc: "Bunu, az sayıda seçkin otelle çalıştığımız için yapabiliyoruz.",

            growthTitle: "Rezervasyonlarınızı Nasıl Artırıyoruz?",

            step1Title: "Nokta Atışı Kitle",
            step1Desc: "Sosyal medya hesaplarımız, her ay otel arayan milyonlarca kişiye ulaşıyor. Otelinizi nokta atışı kitleyle buluşturacağız.",

            step2Title: "Görsel Optimizasyon Uzmanlığı",
            step2Desc: "Doğru görsel seçimi rezervasyonları artırır. 11 yıllık tecrübemizle, hangi görsellerin rezervasyon getirdiğini biliyoruz ve tüm satış kanallarındaki görsellerinizi buna göre optimize edeceğiz.",

            step3Title: "SEO ve GEO (Yapay Zeka) Gücü",
            step3Desc: "SEO ile web aramalarında, GEO ile yapay zekâ tabanlı aramalarda öne çıkmanızı sağlıyor; yabancı misafirleri doğrudan size getiriyoruz.",

            offerTitle: "Özel Katılım Teklifi – Founding Partner",
            currency: "TL",
            vat: "+ KDV",
            promoBadge: "Lansmana Özel - İlk 100 Otel",

            includedTitle: "Neler Dahil?",

            feat1Title: "12 + 2 Ay Üyelik",
            feat1Desc: "Toplam 14 ay boyunca platformda aktif ve görünür listelenme",

            feat2Title: "Sosyal Medya Tanıtımı",
            feat2Desc: <>
                <p><span className="text-indigo-400 font-semibold">@TurkeyandHotels:</span> Otelinize ait 2 özel hikâye paylaşımı</p>
                <p><span className="text-indigo-400 font-semibold">@GeceliğiNeKadar:</span> Otelinize ait 2 özel hikâye paylaşımı</p>
            </>,

            feat3Title: "Bölgenize Ait Makalelerde Önerilme",
            // Dynamic check for suffix handled in render
            feat3DescPrefix: "“",
            feat3DescSuffix: " Nerede Kalınır?” gibi rehber içeriklerde otelinizin önerilmesi",

            feat4Title: "Liste & “En İyiler” Önerileri",
            feat4Desc: "Yıl boyunca aralıklarla otelinizi tanıtan sosyal medya paylaşımları.",

            feat5Title: "OTA Görsel Düzenleme Desteği",
            feat5Desc: "Mevcut OTA (Booking vb.) görsellerinizin daha etkili hale getirilmesi için düzenleme önerileri",

            feat6Title: "Otelinizin Instagram hesabı analizi ve iyileştirme önerileri",
            feat6Desc: "Otelinizin Instagram hesabı için içerik ve görünürlük analizi",

            feat7Title: <> {region}{getAblativeSuffix(region)} Sınırlı Sayıda Seçilmiş Otel</>, // Fallback for TR
            feat7Desc: "Her bölgeden yalnızca çok az sayıda otel kabul edilir (herkese açık bir liste değildir)",

            feat8Title: "“YeriniAyir Seçilmiş Oteli” Rozeti",
            feat8Desc: "Web sitenizde ve tanıtımlarınızda kullanabileceğiniz prestij rozeti",

            disclaimer: "*Bu kampanyalı teklif, yalnızca ilk 100 üye otel için geçerlidir."
        },
        en: {
            badge: "Next Generation Stay Experience",
            titlePrefix: "WorldAnd",
            titleHighlight: "Hotels",
            titleDomain: ".com",
            subtitle: <span className="block text-3xl md:text-4xl font-extrabold tracking-tight mt-2"><span className="text-indigo-400">Zero Commission</span>, <span className="text-white">Direct Reservation</span></span>,
            statsTitle: "Promotion Power",
            followersSuffix: " Followers",
            quote: "\"We highlight your hotel on our social media accounts and website throughout the year, increasing your reservations.\"",

            val1Title: "Premium Guest Audience",
            val1Desc: "We bring you premium guests who understand your hotel's soul and prioritize experience over price.",

            val2Title: "The Value You Deserve",
            val2Desc: "You don't get the value you deserve among thousands of hotels on other OTAs. With us, you take your place among a limited number of exclusive hotels with similar quality and character.",

            val3Title: "\"0\" Commission",
            val3Desc: "We step aside and connect the guest directly to you. We don't break the bond between you and the guest. We don't take commission.",

            exBadge: "For Exclusive Hotels Only",
            exTitle: <>We will create a page completely unique to your hotel, <span className="text-yellow-400">like no other platform.</span></>,
            exDesc: "We can do this because we work with a small number of selected hotels.",

            growthTitle: "How Do We Increase Your Reservations?",

            step1Title: "Targeted Audience",
            step1Desc: "Our social media accounts reach millions of people looking for hotels every month. We will bring your hotel together with a targeted audience.",

            step2Title: "Visual Optimization Expertise",
            step2Desc: "Choosing the right visuals increases reservations. With our 11 years of experience, we know which visuals bring reservations and we will optimize your visuals on all sales channels accordingly.",

            step3Title: "Power of SEO and GEO (AI)",
            step3Desc: "We ensure you stand out in web searches with SEO and AI-based searches with GEO; we bring foreign guests directly to you.",

            offerTitle: "Special Access Offer – Founding Partner",
            currency: "TL",
            vat: "+ VAT",
            promoBadge: "Launch Special - First 100 Hotels",

            includedTitle: "What's Included?",

            feat1Title: "12 + 2 Months Membership",
            feat1Desc: "Active and visible listing on the platform for a total of 14 months",

            feat2Title: "Social Media Promotion",
            feat2Desc: <>
                <p><span className="text-indigo-400 font-semibold">@TurkeyandHotels:</span> 2 special story shares for your hotel</p>
                <p><span className="text-indigo-400 font-semibold">@GeceliğiNeKadar:</span> 2 special story shares for your hotel</p>
            </>,

            feat3Title: "Recommendation in Regional Articles",
            feat3DescPrefix: "Recommendation of your hotel in guide content such as “Where to Stay in ",
            feat3DescSuffix: "?”",

            feat4Title: "List & “Best of” Recommendations",
            feat4Desc: "Social media posts promoting your hotel at intervals throughout the year.",

            feat5Title: "OTA Visual Editing Support",
            feat5Desc: "Editing suggestions to make your existing OTA (Booking, etc.) visuals more effective",

            feat6Title: "Analysis and improvement suggestions for your hotel's Instagram account",
            feat6Desc: "Content and visibility analysis for your hotel's Instagram account",

            feat7Title: null,
            feat7Desc: "Only a very small number of hotels from each region are accepted (not a public list)",

            feat8Title: "“WorldAndHotels Selected Hotel” Badge",
            feat8Desc: "A prestige badge you can use on your website and promotions",

            disclaimer: "*This campaign offer is valid only for the first 100 member hotels."
        },
        el: {
            badge: "Εμπειρία Διαμονής Επόμενης Γενιάς",
            titlePrefix: "WorldAnd",
            titleHighlight: "Hotels",
            titleDomain: ".com",
            subtitle: <>Υποστηριζόμενη από τη δύναμη των influencer, <span className="text-white font-semibold">η πλατφόρμα μόνο για τα πιο εκλεκτά ξενοδοχεία.</span></>,
            statsTitle: "Δύναμη Προώθησης",
            followersSuffix: " ακόλουθοι",
            quote: "\"Προβάλλουμε το ξενοδοχείο σας στους λογαριασμούς μας στα social media και στην ιστοσελίδα μας καθ' όλη τη διάρκεια του έτους, αυξάνοντας τις κρατήσεις σας.\"",

            val1Title: "Premium Κοινό Επισκεπτών",
            val1Desc: "Σας φέρνουμε premium επισκέπτες που κατανοούν την ψυχή του ξενοδοχείου σας και δίνουν προτεραιότητα στην εμπειρία έναντι της τιμής.",

            val2Title: "Η Αξία που Σας Αξίζει",
            val2Desc: "Δεν λαμβάνετε την αξία που σας αξίζει ανάμεσα σε χιλιάδες ξενοδοχεία σε άλλα OTA. Μαζί μας, παίρνετε τη θέση σας ανάμεσα σε έναν περιορισμένο αριθμό εκλεκτών ξενοδοχείων με παρόμοια ποιότητα και χαρακτήρα.",

            val3Title: "\"0\" Προμήθεια",
            val3Desc: "Κάνουμε πίσω και συνδέουμε τον επισκέπτη απευθείας με εσάς. Δεν σπάμε τον δεσμό μεταξύ εσάς και του επισκέπτη. Δεν παίρνουμε προμήθεια.",

            exBadge: "Μόνο για Εκλεκτά Ξενοδοχεία",
            exTitle: <>Θα δημιουργήσουμε μια σελίδα εντελώς μοναδική για το ξενοδοχείο σας, <span className="text-yellow-400">όπως καμία άλλη πλατφόρμα.</span></>,
            exDesc: "Μπορούμε να το κάνουμε αυτό επειδή συνεργαζόμαστε με έναν μικρό αριθμό επιλεγμένων ξενοδοχείων.",

            growthTitle: "Πώς Αυξάνουμε τις Κρατήσεις Σας;",

            step1Title: "Στοχευμένο Κοινό",
            step1Desc: "Οι λογαριασμοί μας στα social media προσεγγίζουν εκατομμύρια ανθρώπους που αναζητούν ξενοδοχεία κάθε μήνα. Θα φέρουμε το ξενοδοχείο σας σε επαφή με ένα στοχευμένο κοινό.",

            step2Title: "Εξειδίκευση στη Βελτιστοποίηση Εικόνας",
            step2Desc: "Η επιλογή των σωστών εικαστικών αυξάνει τις κρατήσεις. Με την 11ετή εμπειρία μας, γνωρίζουμε ποιες εικόνες φέρνουν κρατήσεις και θα βελτιστοποιήσουμε τις εικόνες σας σε όλα τα κανάλια πωλήσεων ανάλογα.",

            step3Title: "Δύναμη του SEO και του GEO (AI)",
            step3Desc: "Σας εξασφαλίζουμε να ξεχωρίζετε στις διαδικτυακές αναζητήσεις με SEO και στις αναζητήσεις βάσει τεχνητής νοημοσύνης με GEO; φέρνουμε ξένους επισκέπτες απευθείας σε εσάς.",

            offerTitle: "Ειδική Προσφορά Πρόσβασης – Founding Partner",
            currency: "TL",
            vat: "+ ΦΠΑ",
            promoBadge: "Ειδική Προσφορά Λανσαρίσματος - Πρώτα 100 Ξενοδοχεία",

            includedTitle: "Τι Περιλαμβάνεται;",

            feat1Title: "Συνδρομή 12 + 2 Μηνών",
            feat1Desc: "Ενεργή και ορατή καταχώριση στην πλατφόρμα για συνολικά 14 μήνες",

            feat2Title: "Προώθηση στα Social Media",
            feat2Desc: <>
                <p><span className="text-indigo-400 font-semibold">@TurkeyandHotels:</span> 2 ειδικές κοινοποιήσεις story για το ξενοδοχείο σας</p>
                <p><span className="text-indigo-400 font-semibold">@GeceliğiNeKadar:</span> 2 ειδικές κοινοποιήσεις story για το ξενοδοχείο σας</p>
            </>,

            feat3Title: "Πρόταση σε Περιφερειακά Άρθρα",
            feat3DescPrefix: "Πρόταση του ξενοδοχείου σας σε περιεχόμενο οδηγών όπως “Πού να μείνετε στ",
            feat3DescSuffix: ";”",

            feat4Title: "Λίστα & Προτάσεις “Καλύτερων”",
            feat4Desc: "Αναρτήσεις στα social media που προωθούν το ξενοδοχείο σας κατά διαστήματα όλο το χρόνο.",

            feat5Title: "Υποστήριξη Επεξεργασίας Εικόνας OTA",
            feat5Desc: "Προτάσεις επεξεργασίας για να κάνετε τις υπάρχουσες εικόνες OTA (Booking, κ.λπ.) πιο αποτελεσματικές",

            feat6Title: "Ανάλυση και προτάσεις βελτίωσης για τον λογαριασμό Instagram του ξενοδοχείου σας",
            feat6Desc: "Ανάλυση περιεχομένου και ορατότητας για τον λογαριασμό Instagram του ξενοδοχείου σας",

            feat7Title: null,
            feat7Desc: "Μόνο ένας πολύ μικρός αριθμός ξενοδοχείων από κάθε περιοχή γίνεται δεκτός (δεν είναι δημόσια λίστα)",

            feat8Title: "Σήμα “WorldAndHotels Selected Hotel”",
            feat8Desc: "Ένα σήμα κύρους που μπορείτε να χρησιμοποιήσετε στην ιστοσελίδα και τις προωθητικές σας ενέργειες",

            disclaimer: "*Αυτή η προσφορά καμπάνιας ισχύει μόνο για τα πρώτα 100 μέλη ξενοδοχεία."
        }
    };

    const content = t[lang] || t.tr;

    return (
        <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-indigo-500/30">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-20 pb-16 px-6 overflow-hidden">

                {/* Background Glows */}
                {/* Background Glows - Optimized for Safari (No Blur) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-900/20 rounded-full opacity-30 -z-10" />

                <div className="max-w-5xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-10 shadow-lg shadow-indigo-900/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        {content.badge}
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
                        {content.titlePrefix}<span className="text-indigo-400">{content.titleHighlight}</span>{content.titleDomain}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed mb-16">
                        {content.subtitle}
                    </p>

                    {/* Stats Section with Divider */}
                    <div className="relative mb-12">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#050B14] px-4 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                                {content.statsTitle}
                            </span>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {/* Card 1 */}
                        <a href="https://www.instagram.com/turkeyandhotels" target="_blank" rel="noopener noreferrer" className="bg-[#0A101D] border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300 group block">
                            <div className="flex items-center gap-2 mb-3">
                                <Instagram className="w-4 h-4 text-[#D62976]" />
                                <span className="text-[10px] font-bold tracking-widest text-[#D62976] uppercase">Instagram</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">@turkeyandhotels</div>
                            <div className="text-4xl font-bold text-white group-hover:text-indigo-400 transition-colors">323.000+{content.followersSuffix}</div>
                        </a>

                        {/* Card 2 */}
                        <a href="https://www.instagram.com/geceligi.ne.kadar" target="_blank" rel="noopener noreferrer" className="bg-[#0A101D] border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300 group block">
                            <div className="flex items-center gap-2 mb-3">
                                <Instagram className="w-4 h-4 text-[#FA7E1E]" />
                                <span className="text-[10px] font-bold tracking-widest text-[#FA7E1E] uppercase">Instagram</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">@geceligi.ne.kadar</div>
                            <div className="text-4xl font-bold text-white group-hover:text-indigo-400 transition-colors">303.000+{content.followersSuffix}</div>
                        </a>

                        {/* Card 3 */}
                        <a href="https://www.tiktok.com/@geceligi.nekadar" target="_blank" rel="noopener noreferrer" className="bg-[#0A101D] border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300 group block">
                            <div className="flex items-center gap-2 mb-3">
                                <TikTokIcon className="w-4 h-4 text-[#00F2EA]" />
                                <span className="text-[10px] font-bold tracking-widest text-[#00f2ea] uppercase">TikTok</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">@geceligi.nekadar</div>
                            <div className="text-4xl font-bold text-white group-hover:text-indigo-400 transition-colors">60.000+{content.followersSuffix}</div>
                        </a>
                    </div>

                    {/* Quote Box */}
                    <div className="relative bg-gradient-to-r from-white/5 to-white/0 rounded-xl p-6 md:p-8 border-l-4 border-indigo-500 text-left max-w-4xl mx-auto">
                        <p className="text-lg md:text-xl text-gray-200 font-light italic leading-relaxed">
                            {content.quote}
                        </p>
                    </div>

                </div>
            </section>

            {/* --- VALUE PROPOSITION --- */}
            <section className="pt-24 pb-10 px-6 bg-[#080E1A]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 (Renamed from Card 3) */}
                        <div className="bg-[#0F1623] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Zap className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{content.val3Title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {content.val3Desc}
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#0F1623] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Star className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{content.val2Title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {content.val2Desc}
                            </p>
                        </div>

                        {/* Card 3 (Renamed from Card 1) */}
                        <div className="bg-[#0F1623] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Users className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{content.val1Title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {content.val1Desc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EXCLUSIVE PROMISE --- */}
            <section className="pt-10 pb-16 px-6 bg-black relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-[#080E1A] via-black to-[#080E1A]" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-8">
                        {content.exBadge}
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-white">
                        {content.exTitle}
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        {content.exDesc}
                    </p>
                </div>
            </section>

            {/* --- GROWTH STRATEGY --- */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full opacity-20 -z-10" />
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{content.growthTitle}</h2>
                        <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-8">
                        {/* Item 1 */}
                        <div className="flex gap-6 md:gap-8 items-start group">
                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#0F1623] rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-indigo-500 border border-white/5 group-hover:border-indigo-500/30 transition-colors shadow-lg">
                                1
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold text-white mb-2">{content.step1Title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {content.step1Desc}
                                </p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex gap-6 md:gap-8 items-start group">
                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#0F1623] rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-indigo-500 border border-white/5 group-hover:border-indigo-500/30 transition-colors shadow-lg">
                                2
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold text-white mb-2">{content.step2Title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {content.step2Desc}
                                </p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex gap-6 md:gap-8 items-start group">
                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#0F1623] rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-indigo-500 border border-white/5 group-hover:border-indigo-500/30 transition-colors shadow-lg">
                                3
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold text-white mb-2">{content.step3Title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {content.step3Desc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING / OFFER SECTION --- */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-full pointer-events-none" />

                    <div className="relative bg-[#0F1623] border border-white/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">

                        {/* Header Area */}
                        <div className="bg-[#131B2C] p-8 md:p-12 text-center border-b border-white/5">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{content.offerTitle}</h2>

                            <div className="flex items-center justify-center gap-3 mb-6">
                                <span className="text-6xl md:text-7xl font-black text-white tracking-tight">{price}</span>
                                <div className="flex flex-col items-start">
                                    <span className="text-2xl font-bold text-gray-400">{content.currency}</span>
                                    <span className="text-sm font-medium text-gray-500">{content.vat}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className="text-lg md:text-xl font-medium text-gray-500 block">
                                    {/* Smart Formatting: Bold/White for Price parts, Gray/Soft for Labels */}
                                    {(promoText || content.promoBadge).split(/(\s+)/).map((part, i) => {
                                        // Create a regex to detect price-like parts: Numbers, currency symbols, TL, /
                                        // Added \b for Ay to prevent matching 'Aylık'
                                        const isPricePart = /[\d\.,]+|TL|~|\/|\bAy\b/i.test(part);
                                        return (
                                            <span key={i} className={isPricePart ? "text-white font-bold" : ""}>
                                                {part}
                                            </span>
                                        );
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 space-y-12">

                            {/* Section: Neler Dahil? */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    {content.includedTitle}
                                    <div className="h-px bg-white/10 flex-grow ml-4"></div>
                                </h3>

                                <ul className="space-y-6">
                                    {(includedItems && Array.isArray(includedItems) && includedItems.length > 0) ? (
                                        // Dynamic Rendering
                                        includedItems.map((item) => {
                                            if (!item.isActive) return null;

                                            // Determine if it's a standard item by easy lookup
                                            // We use the ID to check against known keys
                                            const key = item.id;
                                            const isStandard = ['feat1', 'feat2', 'feat3', 'feat4', 'feat5', 'feat6', 'feat7', 'feat8'].includes(key);

                                            // Multi-language support logic:
                                            // If it's a standard item, we prefer the localized "rich" content from t[lang]
                                            // UNLESS the user has significantly changed the text in the DB (customized standard item).
                                            // For simplicity, if it's standard, we assume the user prefers the Localization + Rich Formatting 
                                            // effectively treating the Admin Panel text as a "Label" for toggling, 
                                            // unless we detect it's a completely new custom entry (isCustom).

                                            // Wait, if user EDITS "14 Ay" to "24 Ay" in Admin, strictly using t[lang] ignores the edit.
                                            // But using DB text loses the Rich JSX (colors in feat2).
                                            // Compromise: We use DB text for Title/Points generally, but for specific Rich items we might prefer `t`.
                                            // Let's rely on: if isStandard, try to use t[lang]. If t[lang] title is wildly different? No that's expensive.
                                            // Valid Approach: If `isCustom` is true, render DB text. 
                                            // If `isStandard`: Render `t[lang]` version to preserve "Bire bir" quality and Localization.
                                            // This implies Standard Items are "Toggle Only" in practice for the Frontend, even if editable in Admin.
                                            // This is the safest way to ensure "Hata eksik olmasın".

                                            let displayTitle: React.ReactNode = item.title;
                                            let displayDesc: React.ReactNode = item.description;

                                            if (isStandard && !item.isCustom) {
                                                // @ts-ignore
                                                const standardTitle = content[`${key}Title`];

                                                // Handle Dynamic Region Titles/Descs
                                                if (key === 'feat3') {
                                                    // Region logic
                                                    if (lang === 'tr') {
                                                        displayDesc = <>“{region}{getLocativeSuffix(region)} Nerede Kalınır?” gibi rehber içeriklerde otelinizin önerilmesi</>;
                                                    } else {
                                                        // @ts-ignore
                                                        displayDesc = <>{content.feat3DescPrefix}{region}{content.feat3DescSuffix}</>;
                                                    }
                                                    displayTitle = standardTitle;
                                                }
                                                else if (key === 'feat7') {
                                                    if (lang === 'tr') {
                                                        displayTitle = <>{region}{getAblativeSuffix(region)} Sınırlı Sayıda Seçilmiş Otel</>;
                                                    } else if (lang === 'en') {
                                                        displayTitle = <>Limited Number of Selected Hotels from {region}</>;
                                                    } else {
                                                        displayTitle = <>Περιορισμένος Αριθμός Επιλεγμένων Ξενοδοχείων από {region}</>;
                                                    }
                                                    // @ts-ignore
                                                    displayDesc = content[`${key}Desc`];
                                                }
                                                else {
                                                    // Normal Standard Items
                                                    if (standardTitle) displayTitle = standardTitle;
                                                    // @ts-ignore
                                                    const standardDesc = content[`${key}Desc`];
                                                    if (standardDesc) displayDesc = standardDesc;
                                                }
                                            }

                                            return (
                                                <li key={item.id} className="flex gap-4">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold text-lg">{displayTitle}</h4>
                                                        <div className="text-gray-400 text-sm mt-1">{displayDesc}</div>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        // FALLBACK (Legacy or Empty) - Keeping the exact original hardcoded list for reliability
                                        <>
                                            {/* Item 1 */}
                                            <li className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">{content.feat1Title}</h4>
                                                    <p className="text-gray-400 text-sm mt-1">{content.feat1Desc}</p>
                                                </div>
                                            </li>

                                            {/* Item 2 */}
                                            <li className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">{content.feat2Title}</h4>
                                                    <div className="text-gray-400 text-sm mt-2 space-y-2">
                                                        {content.feat2Desc}
                                                    </div>
                                                </div>
                                            </li>

                                            {/* Item 3 - DYNAMIC REGION LOCATIVE */}
                                            <li className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">{content.feat3Title}</h4>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        {lang === 'tr' ? (
                                                            <>“{region}{getLocativeSuffix(region)} Nerede Kalınır?” gibi rehber içeriklerde otelinizin önerilmesi</>
                                                        ) : lang === 'en' ? (
                                                            <>{content.feat3DescPrefix}{region}{content.feat3DescSuffix}</>
                                                        ) : (
                                                            <>{content.feat3DescPrefix}{region}{content.feat3DescSuffix}</>
                                                        )}
                                                    </p>
                                                </div>
                                            </li>

                                            {/* Item 4 */}
                                            <li className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">{content.feat4Title}</h4>
                                                    <p className="text-gray-400 text-sm mt-1">{content.feat4Desc}</p>
                                                </div>
                                            </li>

                                            {/* Item 5 */}
                                            <li className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">{content.feat5Title}</h4>
                                                    <p className="text-gray-400 text-sm mt-1">{content.feat5Desc}</p>
                                                </div>
                                            </li>

                                            {/* Item 6 */}
                                            <li className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">{content.feat6Title}</h4>
                                                    <p className="text-gray-400 text-sm mt-1">{content.feat6Desc}</p>
                                                </div>
                                            </li>

                                            {/* Item 7 - DYNAMIC REGION ABLATIVE */}
                                            <li className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">
                                                        {lang === 'tr' ? (
                                                            <>{region}{getAblativeSuffix(region)} Sınırlı Sayıda Seçilmiş Otel</>
                                                        ) : lang === 'en' ? (
                                                            <>Limited Number of Selected Hotels from {region}</>
                                                        ) : (
                                                            <>Περιορισμένος Αριθμός Επιλεγμένων Ξενοδοχείων από {region}</>
                                                        )}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm mt-1">{content.feat7Desc}</p>
                                                </div>
                                            </li>

                                            {/* Item 8 */}
                                            <li className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">{content.feat8Title}</h4>
                                                    <p className="text-gray-400 text-sm mt-1">{content.feat8Desc}</p>
                                                </div>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            {/* Footer Disclaimer */}
                            <div className="text-center pt-4">
                                <p className="text-gray-500 text-sm font-medium">
                                    {content.disclaimer}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
