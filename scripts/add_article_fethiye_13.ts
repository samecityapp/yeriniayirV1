import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye'de Çocukla Tatil: Güvenli Plajlar, Aile Aktiviteleri ve Kapsamlı Hayatta Kalma Rehberi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">İki yetişkin (Sevgili veya eş) olarak tatile çıkıp sırt çantasını alarak Fethiye dağlarına veya o hırçın dalgalı sahillere rastgele atlamak dünyanın en özgür ve sorunsuz eylemidir. Ancak işin içine 'Küçük bir yürüyen çocuk (Toddler) veya bebek' girdiğinde, Fethiye'de o muazzam okyanus ve doğa tatili, %100 oranında önceden çok ince detaylandırılması gereken ve en ufak bir hatanın felaketle sonuçlanabileceği ciddi bir askeri turizm lojistiğine dönüşmektedir. Su çok derinleşir mi? Çocuğun ayaklarına kumsalda taş batar mı? Puset (Stroller) otele giderken rampa çıkar mı? Restoranda mama sandalyesi bulunur mu?</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Muğla'nın doğası gereği Fethiye, sadece tek düze kumlu plajlardan oluşan bir bölge değildir. <a href="/guide/fethiyede-nerede-kalinir-bolge-secim-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Vadilerle ve yüksek dağlık kasabalarla</a> doludur. Mükemmel bir aile oteli tuttuğunuzu sanıp her akşam yemeğine bebeğinizin pusetini 45 derecelik Ovacık dağ yokuşlarında ittirerek kan ter içinde kalmak da an meselesidir; ya da <a href="/guide/fethiyede-en-iyi-plaj-ve-koy-secimi" class="text-blue-600 hover:text-blue-800 underline transition-colors">yanlış koya gidip</a> çocuğunuzun derin dalgalarda iki adım gidip boğulma tehlikesiyle ağlamasına sebep olmak da. Amacımız sadece anneleri ve babaları bu muazzam coğrafyada korkutmak değil; aksine Fethiye'nin aslında çocuklar için dünyanın en donanımlı 'Organik havuz' (Lagün) ve aktivite cenneti olduğunu kanıtlamaktır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Eğer 0 ile 12 yaş arası bir evladınıza Fethiye'nin o benzersiz turkuaz maviliğini ve Likya'nın doğa sevgisini korkusuzca aşılamak istiyorsanız; ebeveynlerin o kutsal streslerini sıfıra indiren uluslararası devasa 'Fethiye Çocuk ve Aile SEO Tatil Dosyamızı' (Family Holiday Checklist) açıyoruz. Hangi plajdan asla çıkmamalısınız, Fethiyd'de bebek arabasına uygun kordon nerede var ve ailecek yapılacak o en efsanevi tekne turu hangisi? Altını değiştirmek kolay, Fethiye'yi değiştirmek zordur; o halde en güvenli rehberimize başlıyoruz!</p>

<img src="/images/articles/family_placeholder_cover.png" alt="Ölüdeniz sığ kumlarında ve dalgasız sularda oynayan mutlu anne ve bebek Fethiye havadan" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Çocukla Tatil İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#kumsallar_guvenlik" class="hover:text-blue-900 transition-colors">1. Çocuklar İçin %100 Güvenli ve Sığ Karşılaştırmalı Plajlar</a></li>
        <li><a href="#konaklama_sorunsali" class="hover:text-blue-900 transition-colors">2. Puset (Bebek Arabası) Dostu Olan ve Olmayan Bölgeler (Konaklama)</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Aile Otelleri Algoritması: Her Şey Dahil mi Butik Ev mi? (Tablo)</a></li>
        <li><a href="#aktiviteler" class="hover:text-blue-900 transition-colors">3. Çocuklar Sıkılmasın: Fethiye'deki En Garanti 3 Aktivite (Tekne/Kanyon)</a></li>
        <li><a href="#saglik" class="hover:text-blue-900 transition-colors">4. Özel Acil Durumlar: Klinikler, Hastaneler ve Çocuk Doktorları Erişimi</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Ebeveynlere Özel Altın Fethiye Tüyoları (Checklist)</a></li>
    </ul>
</div>

<h2 id="kumsallar_guvenlik">1. Çocuklar İçin %100 Güvenli, Sığ ve Kumlu Plajlar Seçimi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Okyanus Dalgalarından Korunan Doğal Havuzlar</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Söz konusu çocuğunuzsa, özellikle yüzmeyi yeni öğrenen 3 ile 8 yaş bandındaysa Türkiye'de yüzbaşı olacağınız yegane ve değişmez 1 numaralı adres <strong>Ölüdeniz Kumburnu (Mavi Lagün İç Kısım)</strong> plajıdır. Dışarıdaki deniz fırtınayla kopsa bile içeriye giren burnun o dairesel yapısı suyu bir banyo küveti kadar sakinleştirir ve tabanın neredeyse hepsi ipeksi beyaz kumdan oluşur. Ufaklığınız o turkuaz suyun dibinde küçük gümüş balıklarını sayarak saatlerce deniz gözlüğüyle (sıfır tehlikeyle) oynayabilir. Boyunu aşması için neredeyse 50 metre açılması gerekir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Alternatif ama daha lokal bir seçenek olan Fethiye Koyu arkasındaki <strong>Kuleli Koyu veya Büyük Boncuklu Koyları</strong> (Fethiye Yarımadası etrafındadır). Tamamen ağaçların altında, denizin oldukça sığ ve dalgasız olduğu bu koylar, ailecek çadırımla / havlumla gelirim mangalımda kahvaltı eder çocukla oynarım diyen Fethiye sakinleri için dev efsanedir. Öte yandan <strong>Kesinlikle Kaçmanız Gereken Plajlar (Danger Zone):</strong> Belcekız ana kumsalı (İki adımda aniden boy aşar ve çok büyük köpüklü dalga yapar), Kıdrak Koyu (Aniden düşer kayalıktır) bölgelerinden cankurtaran olsanız bile çocuklarınızı kollukla bile %100 uzakta tutmalısınız!</p>

<h2 id="konaklama_sorunsali">2. Puset (Bebek Arabası) Dostu Olan ve Olmayan Yokuşlu Bölgeler</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Eğer <a href="/guide/fethiye-butce-planlayici" class="text-blue-600 hover:text-blue-800 underline transition-colors">bütçenizi lüks bir resort otele bağlamayıp</a> her akşam dışarıdaki merkez restoranlarda dolaşmayı ve bebeğinizi pusetle uyutmayı hayal ediyorsanız en çok dikkat edeceğiniz 'Aşil Topuğu' bölge seçimidir. <strong>En Puset Dostu (Stroller Friendly) Bölge: Çalış Plajı ve Fethiye Merkezidir (Marina).</strong> Çalış'ın kumsal arkası kilometrelerce uzanan (araçsız) trafiğe kapalı düm düz kordon yoludur. Dünyanın pusetle ittirerek saatlerce yorulmayacağınız, bebek sarsılmadan uyurken denize nazır harika bira-kahve içebileceğiniz yegane Ege / Akdeniz harikasıdır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Buna karşılık olarak; eğer sadece doğa harikası diyerek Hisarönü, Ovacık dağılık tepelerinden veya Faralya, Kabak gibi vadilerden çok şirin, muazzam şık bir butik otel tutarsanız; akşam yemeği sonrasında sokağa çıkmak istediğinizde 45 derecelik dikine bir asfaltta veya Arnavut kaldırımlarda elinizde kilolarca pusetle ağlayarak otele geri dönmek istersiniz. Çocuklu aileler için her zaman deniz seviyesi (Sea level), düz ova ve Fethiye Kordon (Marina / Çalış) bölgesinde konaklamak (ve gece oralarda yürümek) altın değerinde bir sağlık sigortasıdır.</p>

<img src="/images/articles/family_placeholder_1.png" alt="Çalış plajı Fethiye kordonunda bebeğini pusetle yürüten ebeveynler ve dümdüz mermer yollar" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="karsilastirma">Dev İkilem: Mega Resort (Her Şey Dahil) mu Yoksa Geniş Özel Villa ve Mutfak mı? (Tablo)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Mutfakta kendi seçici çocuğun için çorba (mama) yapmak istiyorsun ama aynı zamanda da ebeveyn olarak dinlenip hizmet bekliyorsun. "Her Şey Dahil 5 Yıldız vs Özel Havuzlu Kiralık Villa" dev SEO rehberi:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Ebeveyn İhtiyacı & Kriterler</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Devasa 5 Yıldızlı "Her Şey Dahil (All-Inclusive)" Tatil Köyü (Otel)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Kendin Pişir Özel Kiralık Müstakil Havuzlu Villa (Ovacık / Çalış)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Çocuk (Toddler) Yemek Seçiciliği (Mama / Diyet)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Açık büfede çeşit 100 kadardır devasadır ancak genelde tuzludur. Kendi özel diyet (vegan/organik mama) kontrolünüz zordur.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Mutfakta yerel taze Fethiye salı pazarından alınan domateslerle kendi güvenilir bildiğiniz anne yemeğini/çorbasını saniyede hazırlarsınız.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Gürültü Kontrolü ve Uyku Saatleri</td>
        <td class="py-4 px-6 text-sm text-gray-700">Gündüz dev animatör çığlıkları, akşamları 23.30'a kadar süren bitmeyen Anfi tiyatro Tarkan şarkıları bebeğinizi asla uyutmaz.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Kendi bahçeniz ve doğa sessizliğidir (Private Oasis). Bebek içerde (Baby Monitor ile uyurken) siz şezlongda şarabınızı %100 yudumlarsınız.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Yetişkinlerin "Dinlenme ve Rahatlama" Kalitesi</td>
        <td class="py-4 px-6 text-sm text-gray-700">Temizlik derdi, yemek bulaşık derdi 0 (Sıfır). Animasyonlu Aqua Park evladı oyalar ve anne-baba kusursuzca SPA'da dinlenir.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Temizlik yapan, marketten ağır sebze paketlerini villaya taşıyan, aşçı ve yorgun ebeveyn sizsiniz. Anne için tatil değil, sadece mekan değişikliğidir.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="aktiviteler">3. Çocuklar Asla Sıkılmasın: Eğlence Patlaması 3 Özel Fethiye Aktivitesi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Mesele çocuğunuzu denize girmeye ikan etmek değil, günün geri kalan saatinde iPad/Telefon bağımlılığından kurtarıp doğa sevincine odaklamaktır:</p>
<ul class="list-none space-y-4 text-lg text-gray-700 mb-8 mt-4">
  <li><strong class="text-gray-900 font-bold block mb-1">A) Dalgasız ve Kusursuz Aile 12 Adalar Tekne Turu:</strong> <a href="/guide/fethiye-tekne-turu-secme-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Ölüdeniz'in dev açık müzikli teknelerinden kesinlikle uzak durup</a>, Göcek ve Fethiye körfezinin o <strong>"Sessiz Fethiye Limanı Çıkışlı (12 Islands Boat Trip)"</strong> ahşap turlarına binin. Sular göl kadar dümdüz pürüzsüzdür, çocuğunuz sallanmaz/kusmaz ve teknenin dev alt ahşap yataklarında (Kabin altı) harika bir rüzgarlı doğa öğle uykusu uyur.</li>
  <li><strong class="text-gray-900 font-bold block mb-1">B) Saklıkent Kanyonu Doğal Çamur Eğlencesi:</strong> Eğer evladınız 6 veya 7 yaşından büyükse (Kucakta taşınmayacaksa) o buz gibi <a href="/guide/saklikent-kanyonu-gezi-rehberi-fethiye-selale" class="text-blue-600 hover:text-blue-800 underline transition-colors">Saklıkent Kanyonu suyunun</a> birazcık içinden çığlık atarak geçerek arka taraftaki killi Sarı Doğal Çamur banyosuna ulaşıp elini yüzünü bulamasına izin vermek, onun lise hayatı boyunca unutamayacağı o eşsiz "Safari" veya Komando oyunudur.</li>
  <li><strong class="text-gray-900 font-bold block mb-1">C) Çalış Su Taksi (Water Taxi) Deneyimi:</strong> Arabayla veya taksiyle Fethiye çarşı parkına gelip trafik derdi çekmektense; çocuk için inanılmaz olan basit "Çalış kordonundan kalkan ufacık Su Taksi motorlarıyla" 15-20 dakikalık (kanalların içinden Venedik gibi süzülen) tekne deniz yolculuğuyla şehir çarşısı ışıklarına gidin. Çocuğun gözündeki o ulaşım şekli şevkini inanın asla parayla ve lüks otellerde satın alamazsınız.</li>
</ul>

<img src="/images/articles/family_placeholder_2.png" alt="Fethiye'den kalkan 12 adalar sessiz göl teknesinin ucunda babasıyla manzaraya bakan çocuk resmi" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="saglik">4. Asla İhtiyaç Duyulmamasını Dilediğimiz Bilgi: Sağlık ve Çocuk Doktorları Güvencesi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Turizmin dünya başkentlerinden olmanın en muazzam ve iç rahatlatan VIP artısı nedir biliyor musunuz? Issız ve çok tehlikeli olan üçüncü dünya ülkelerindeki çaresizlik yoktur; Fethiye Hastanelerinde (Özel devasa Avrupa standartlarında hastaneler, Lokman Hekim veya Esnaf Hospital gibi) mükemmel uluslararası (international) dev poliklinikler ve tercüman destekli "24 Saat Çocuk - Pediatri" Acil Servisleri devrede durur.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Özellikle yabancı ülke veya Gurbetçi sigortaları (Seyahat Travel Insurance) burada anında mükemmel işler. Çocuğunuzda çok şiddetli ateş, kulak iltihabı (Deniz Suyu sebebiyle - Swimmer's Ear), rüzgardan klimadan soğuk algınlığı veya gıda (Güneş - Sun stroke) zehirlenmesi / Güneş Çarpması yaşandığında gece saat 03:00'te bile Fethiye ana merkezde hemen pırıl pırıl 10 dakikada doktorunuzu yanınızda hazır ve uzman olarak bulursunuz. Bu muazzam tıbbi güvenlik zırhı; Kaş, Kalkan, Akyaka veya o ıssız ege Datça köylerine inat; "Acaba çocuğa bir şey olursa neresi yakın" travmalı ebeveyn tatili sorularını saniyede ortadan dev boyutta komple yok eder.</p>

<h2 id="tuyolar">Bir Aileyi Tatilde Parçalanmaktan Kurtaracak Hayati SEO Cihaz Listesi (Tüyolar)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Tatil planı, evladın uçakta midesinin bulanması veya oteldeki ilk mızıldaması ile büyük sınava tabi tutulur. Asla hata yapmamanız gereken Fethiye anneleri / babaları kuralları:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">👟</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Çocuk İçin Kopmaz Deniz Ayakkabısı (Kids Aqua Shoes) Şartı</span>
            <span class="text-gray-700 text-base leading-relaxed">Fethiye plajlarının kumu muhteşemdir ancak suyun içine ilk adımda, kıyıların (Belcekız, Çalış vb.) giriş seviyesi hep milyonlarca hafif parlak çok beyaz çakılımsı (Pebbles) mermer taşlarla çevrilidir. Sürekli denize koşup çıkıp koşan o çocukların o ince ayak tabanlarının suyun içinde ufak sıyrıklarla tahriş olup acı çekmesini asla istemiyorsanız; asla çıkmayan çok kalın o Cırt Cırtlı (Velcro) bağcıklı Deniz ayakkabısını ülkenizdeki Decathlon veya marketlerden evladınıza mutlaka 2 çift olarak kesin getirin! Senede bir gününüz ve deniz hevesiniz de acılarla çöpe girmesin.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">☀️</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">UV Korumalı İnce Kıyafet (Rash Guards) Zırhı ile Güneş Savunması</span>
            <span class="text-gray-700 text-base leading-relaxed">Turistler (Kuzey Avrupalılar) çok iyi bilir ancak gurbetçilerimiz veya yerli halk bazen (Tatlı Su hatasında) unutur. Akdeniz güneşi (Muğla şeridi) İstanbul'un veya Londra'nın yazına zerre kadar asla benzemez; Temmuz'da ışınlar direkt teni ve en çok da ufaklıkların ince omzunu yakar. Sürekli (Günde 10 kez) SPF 60 Faktör Kremlere de devasa bütçeler harcamak istemiyorsanız; çocuğu denizde UV filtreli bütün 1 parça (Dalgıç kıyafeti tipi Rash Guard) tişörtlerle/mayo ile çok ince su tişörtleri ile güneşe atın. Akşam ıstıraptan uyanan ve acı çeken bir çocuk; ebeveynin Fethiye barlarında iki kadeh bira içme şansını tamamen ama tamamen %100 yok eder.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">💊</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Mide Bulantısı İkilemi: Uçak, Tekne ve Ovacık Virajları!</span>
            <span class="text-gray-700 text-base leading-relaxed">Fethiye merkeze inerken dev Göcek dağ rampalarından veya Ovacıka çıkarken o virajlı dik yollardan araba sürecekseniz! Hele ki çocukla <a href="/guide/fethiye-tekne-turu-secme-rehberi" class="text-blue-600 hover:text-blue-800 underline">dev Ölüdeniz Tekne turuna</a> çıkıyorsanız, o arabadaki arka koltuktaki ufak çocuğun iç organları saniyeler içinde alt üst olur. Eczanenizden kesinlikle ama kesinlikle deniz veya araç tutmasına, 'Mide Bulantı Sakızı / Hapı veya Bilekliği' çantanızın en ama en ulaşılır dış ön gizli gözünde (Fermuarında) ilk dakika şifa aracı olarak çok net durmalıdır. Ovacık dağına kusarak çıkan bir evladınız o efsane tatili daha başlamadan bitirir.</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Ufak ve yaramaz bir çocukla Fethiye sınırlarına kadar gelmek, dünyanın herhangi devasa ve korkunç ıssız ormanına gitmekten on kat çok daha Lüks ve Güvenlidir. Ölüdeniz Kumburnu'nun o annelere rahat nefes yaşatan inanılmaz havuz dalgasız doğasından tutun da, Fethiye merkezindeki uluslararası uzman donanımlı acil dev sağlık kuruluşlarına kadar; "Her şey ebeveyninizin rahat nefes ve güven içeceği" bir sistem için tasarlanmıştır. Yeter ki Fethiye'yi tanırken ailenizin limitini ve doğru otopark - otel puset rotasını haritada saniyeler içinde önceden çizin. Çocuklarınıza denizi kumda kule yaparak bir ömür öğreteceğiniz unutulmaz masmavi devasa bir Akdeniz yaz anısı serüveni dileriz!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 13/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Fethiye with Kids: Family Holiday Travel Guide", tr: "Fethiye’de Çocukla Tatil: Güvenli Aile Otelleri ve Plajlar SEO Rehberi" },
        slug: "fethiyede-cocukla-tatil-kisabir-rehber",
        slug_en: "fethiye-with-kids-family-holiday-guide",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/family_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye çocukla tatile gidilir mi? Bebekli ve küçük çocuklu aileler için sığ Ölüdeniz kumsalları, puset dostu Çalış sahil otelleri ve SEO etkinlik rehberi.",
            en: "Ultimate family SEO travel guide to Fethiye with kids and toddlers. Best shallow beaches, stroller-friendly hotels, and safe family boat trips listed."
        },
        is_published: true,
        published_at: new Date().toISOString()
    };

    const { error, data } = await supabase.from('articles').upsert(newArticle, { onConflict: 'slug' }).select();
    if (error) {
        console.error("Failed to insert/update article:", error);
    } else {
        console.log("Success! Article updated with ID:", data[0].id);
        console.log("Actual Slug:", data[0].slug);
    }
}
insertArticle();
