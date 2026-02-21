import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Likya Yolu Fethiye Bölümü (Başlangıç Parkuru): Yürüyüşçüler İçin Tam Destansı Rehber</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Türkiye'nin güney şeridi, sadece o kusursuz Mavi Bayraklı plajları ve devasa lüks tatil köyleriyle değil; aynı zamanda binlerce yıllık efsanevi tarihin orman ve denizle iç içe geçtiği "Dünyanın En İyi 10 Uzun Mesafe Yürüyüş Rotasından" birine de ev sahipliği yapar: <strong>Likya Yolu (The Lycian Way).</strong> Toplamda 500 kilometreyi aşan ve Fethiye'den başlayıp Antalya'ya kadar uzanan bu muazzam kültür ve doğa rotası, her yıl dünyanın dört bir yanından binlerce profesyonel veya amatör doğa sporu (Trekking) tutkununu mıknatıs gibi kendine çeker. Ancak bu devasa yolun başlangıç (Sıfırıncı Kilometresi) ve en görkemli, en fotojenik olan en çarpıcı ayakları tartışmasız olarak Fethiye dağları sınırları içerisinde atılır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Peki, Fethiye'ye 1 haftalık bir deniz tatili için geldiniz ama ayaklarınızda kaşıntı mı var? Bütün gün şezlongta yatmak yerine bedeninizin o eski çağlardan kalma patikalara basmasını, yüksek uçurumlardan <a href="/guide/oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Ölüdeniz'in o dev lagününü</a> kuşbakışı seyretmeyi ve çam ormanları içinde efsanevi antik harabelerle karşılaşmayı mı istiyorsunuz? Güzel haber şu: Likya yolunun tümünü (1 aya yakın) yürümek zorunda asla değilsiniz! Fethiye'den başlayan ve günübirlik (Daily Hike) veya 1 gece konaklamalı yapılabilecek inanılmaz kısa başlangıç parkurları, tam da tatilcilere ve amatör doğaseverlere göre harika bir vizyon sunar.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Eğer tatil rotanızda sıradanlıktan tamamen çıkmak, Fethiye'nin terleten ama ödülü paha biçilemez o sarp ve denize paralel dağlarına adım atmak istiyorsanız doğru adrestesiniz. Fethiye Ovacık başlangıç noktasından nerelere yürünür, hangi etap bir aile için uygundur (Easy Hike) ve hangi etap sadece atletik sporcuları zorlar? Yanınıza alınması gereken su miktarından tutun da, o meşhur sarı-kırmızı dağ işaretlerine kadar her şeyi büyük tablolu ve devasa SEO optimizasyonlu Likya Yolu (Fethiye Bölümü) rehberimizde deşifre ediyoruz. Bağcıkları sıkı bağlayın, tarihin ve denizin eşsiz sınırına doğru tırmanıyoruz!</p>

<img src="/images/articles/lycian_way_placeholder_cover.png" alt="Sarp kayalıkların üstündeki dar orman patikasında denize (Ölüdeniz) karşı yürüyen sırt çantalı gezgin" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Likya Yolu Fethiye Bölümü İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#baslangic_noktasi" class="hover:text-blue-900 transition-colors">Sıfır Noktası: Ovacık (Hisarönü) Efsanevi Başlangıç Takı</a></li>
        <li><a href="#etap_1_ovacik_faralya" class="hover:text-blue-900 transition-colors">En Meşhur Parkur #1: Ovacık - Faralya (Kelebekler Vadisi Tepesi)</a></li>
        <li><a href="#etap_2_kayakoy_oludeniz" class="hover:text-blue-900 transition-colors">Kısa ve Tarihi Tarihi Parkur #2: Hayalet Şehir Kayaköy - Ölüdeniz</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Hangi Parkur Bana Göre? Parkur Karşılaştırma Analizi (Tablo)</a></li>
        <li><a href="#isaretleme_sistemi" class="hover:text-blue-900 transition-colors">Dağda Kaybolmamak: Sarı - Kırmızı Uluslararası Boya İşaretleri</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Likya Dağlarını Kurtaracak SEO Hayatta Kalma Tüyoları (Checklist)</a></li>
    </ul>
</div>

<h2 id="baslangic_noktasi">Tarihe Açılan Efsane Kapı: Ovacık (Hisarönü) Likya Takı (Sıfır Noktası)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Dünyanın En Üzgün, En Uzun Yürüyüşünün O İlk Mutlu Adımı</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Her büyük ve destansı yolculuk, sembolik bir eşik ve çok net bir başlangıç (Start Point) ile işaretlenir. 500 kilometrelik bu devasa uluslararası rotanın Fethiye ucundaki başlangıç noktası, merkeze sadece 15 dakika dolmuş mesafesindeki o serin ve ormanlık <strong>Ovacık (Hisarönü)</strong> mahallesindedir. Ovacık ana asfalt yolundan dağa (Babadağ eteklerine) doğru biraz sapıldığında, asfaltın bittiği ve o toprak çamlı patikanın başladığı noktada sizi dev taş bir anıt kapı ve altında o meşhur sarı ahşap tabela karşılar: <strong>"Likya Yoluna Hoşgeldiniz (Welcome to Lycian Way)".</strong></p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Hafif bir şelale fısıltısı, dev çam ağaçlarının inanılmaz net oksijen kokusu ve sabah saat 08:00'deki o kuş seslerinin dışında duyduğunuz tek şey çakıllara basan dağcı botlarınızın sesidir. Bu kapıdan geçip ilk yarım saati tırmandığınız an; arkanızdaki betonlaşmış turizm yapıları tamamen gözden kaybolur. O an sadece siz, sarp Babadağ yamaçları ve önünüze çıkacak olan uçurum manzaraları kalır. Fethiye'den başlayan amatör günlük yürüyüşçüler (Day-Hikers) için bu kapı arkasında en çok tercih edilen iki efsanevi resmi ve harika parkur vardır. Şimdi bunları detaylarıyla inceleyelim.</p>

<img src="/images/articles/lycian_way_placeholder_1.png" alt="Ovacık dağlarında Likya yolu ahşap sarı tabelası ve ormana dalan patika" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="etap_1_ovacik_faralya">Parkur #1 (Klasik ve Yorucu Etap): Ovacık'tan Faralya Köyüne Asılı Tırmanış</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Likya yolunun Fethiye'den başlayan ve tam 1. Günü olarak kabul edilen resmi orijinal parkurudur. Toplam 12-14 kilometre uzunluğundadır (Normal bir yürüme temposuyla molalar dahil ortalama 5 ile 7 saat sürer). Ovacık takından (Kapısından) geçerek başlanır ve tırmanış inanılmaz derecede sarp, Babadağ'ın deniz gören yamaçlarına oyulmuş dar çoban patikalarından sürekli yokuş yukarı olacak şekilde ivmelenir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Bu rotanın ilk 2 saati bacaklarınızı test eden sağlam bir tırmanıştır ancak zirve (bel noktası) sayılan sarp sırta çıktığınız an; aşağıda boylu boyunca uzanan <strong>Ölüdeniz'in o dev lagün (Mavi Göl) haritasını</strong> tıpkı bir drone kamerası ve uçak penceresi gibi saatlerce yüksekten tam dik olarak izleyerek yürürsünüz. Dünyadaki o meşhur "Likya Yolu Fotoğraflarının" %70'i bu ilk 3 kilometrelik büyüleyici okyanus manzaralı tepeden çekilmiştir. Rota daha sonra Kozağaç köyü gibi otantik taş evlerden ve yerel keçi çobanlarının yanından sıyrılarak, gün sonu hedefine, yani denize dik 400 metrelik dev uçurumuyla meşhur olan o görkemli <a href="/guide/kelebekler-vadisi-rehberi-fethiye-ulasim" class="text-blue-600 hover:text-blue-800 underline transition-colors">Faralya Köyüne (Kelebekler Vadisi zirvesine)</a> harika bir çam ormanı inişiyle ulaşır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Eğer günübirlik yürüyorsanız Faralya köyündeki manzaralı butik kafelerde buz gibi taze limonatanızı (veya biranızı) yudumlar; ardından sizi köye getirdiğini unuttuğunuz o güzel Ölüdeniz dolmuşuna saniyeler içinde binerek 20 dakikada tekrar Fethiye Merkezdeki otelinize acısız lüks bir şekilde geri dönebilirsiniz. Kondisyonunuz (Sportifliğiniz) iyiyse tatilinizin bir gününü bu 14km'lik efsanevi oksijen terine kesinlikle ama kesinlikle adamalısınız.</p>

<h2 id="etap_2_kayakoy_oludeniz">Parkur #2 (Ailelere Uygun Kültür Rotası): Hayalet Şehir Kayaköny'den Ölüdeniz Sahiline İniş</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Eğer 14 kilometrelik dev sarp tırmanışlar bacaklarınızı (veya <a href="/guide/fethiyede-cocukla-tatil-kisabir-rehber" class="text-blue-600 hover:text-blue-800 underline transition-colors">yanınızdaki okul çağındaki çocuklarınızı</a>) korkutuyorsa, Likya coğrafyası içinde muazzam ve çok kısa bir güzergahınız daha vardır! Resmi ana Likya rotasına paralel kısa bir bağlantı yolu olan bu güzergah, dağın en tepesinde yıllardır terk edilmiş halde bulunan ve yamaçlı taş evleriyle insana ürperti ve o dev dramatik bir his veren tarihi <strong>Hayalet Şehir Kayaköy'den (Karmylassos / Ghost Town)</strong> başlar.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Bu etap toplaman 6 ile 7 kilometre civarıdır (2 ile 3 saatlik yavaş bir yürüyüş mesafesi). Sabah Kayaköy gişelerinden girip terk edilmiş kiliselerin, boyasız eski yüzlerce sapsarı Rum harabesi evin arasından tepeye (aşılacak bel noktasına) hafifçe tırmanırsınız. Vadi sırtına ulaştığınızda birdenbire ormanın arasından önünüze Mavi Akdeniz ve Soğuk Su koyunun (Cold Water Bay) körfezi açılır. Yokuş kısmı çok kısadır, bundan sonrası tamamen ve kesintisiz olarak kızılçam ormanlarının içinden kıvrıla kıvrıla denize doğru yapılan sürekli bir "İniş" (Downhill descent) kurgusudur.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Öğle saatine doğru patikadan aşağıya süzülürken orman biter, çalılar (maki) başlar ve aniden patikanın alt ucunda <strong>Belcekız kumsalının ve turkuaz sığ suların o muazzam ferah yüzü size bakar.</strong> Yürüyüş tam olarak denizin sıfır noktasında; ayaklarınızı çıkartıp sıcak kumlara basmanızla (ve hemen soğuk denize terli bedeninizle dalmanızla) Fethiye Ölüdeniz beldesinde şahane ve kusursuzca son bulur. Yeni başlayanlar, sadece spor ayakkabısı olanlar ve fotoğraf karesi / tarih birleşimi hastaları için tek kelimeyle bir doğa başyapıtıdır.</p>

<img src="/images/articles/lycian_way_placeholder_2.png" alt="Sırt çantalı turist ailenin Hayalet köy taş evleri arasından geçen çok hafif toprak patika rotası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="karsilastirma">Rota İkilemi: Ovacık (Ana Rota) ile Kayaköy (Kısa İniş) Parkuru Karşılaştırma Algoritması</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Tatil planınız bir hayatta kalma programı değil! Hangi patikada bedeninizin sınırını çizeceğinizi asla hata yapmadan seçmeniz için hayati Fethiye yürüyüş (Hike) kıyaslaması:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Analiz Edilen Metrik</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Parkur #1: Ovacık Başlangıcı -> Faralya (Kelebekler)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Parkur #2: Hayalet Kayaköy -> Ölüdeniz Plaj İnişi</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Arazi Formasyonu ve Uzunluk</td>
        <td class="py-4 px-6 text-sm text-gray-700">Uzun (14km), çok yüksek irtifada sarp kayalıklarda uçurum manzaralı. Sürekli ciddi tırmanış grafiği.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Kısa (6-7km), geniş ormanlık toprak yollar ve tepeden sonra tamamen denize doğru inen (yumuşak) iniş profili.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Efor ve Gereksinim Durumu</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yüksek kondisyon (Athletic), mutlaka bilekli gerçek doğa yürüyüşü botu gerektirir. Küçük çocuklarla gidilmez.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Amatör seviyesi (Beginner). Normal, altı kalın herhangi bir şehir spor ayakkabısı dahi yetebilir. Çocuklulara (8+ yaş) uygundur.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Final (Ödül Noktası - Peak)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yüksek tepeden meşhur Kelebekler Vadisinin dik o sarp kanyon vadisine kuşbakışı sarsıcı son bakış.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Ölüdeniz Belcekız ana kumsalı. Ayağınızdan ayakkabıyı çıkartıp terden sırılsıklam halde kendinizi serin denize anında atabilme özgürlüğü.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="isaretleme_sistemi">Dağda Kaybolmamak: O Hayat Kurtaran "Sarı-Kırmızı" Boya Çizgileri</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Dünyanın en ilkel dağ yollarında kilometrelerce yürürken cebinizdeki Google Haritası genelde o yoğun çam ormanlarında çalışmaz (Sinyal kopuklukları çoktur). Likya yolunu yeryüzünde dünyanın en başarılı parkurlarından biri yapan şey, GPS'e gerek duymadan bir ormanda yönünüzü sadece çıplak gözünüzle bulmanızı sağlayan "Fransız Grande Randonnee (Büyük Gezi)" sistemi kökenli uluslararası yol işaretleridir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Asfaltı bırakıp ormana adım attığınız andan itibaren kayaların köşelerinde, yaşlı ağaçların büyük kalın gövdelerinde ya da elektrik direklerinde (Eğer köyden geçiyorsa) sprey boyayla çizilmiş <strong>altlı üstlü "Kırmızı ve Sarı" kalın çizgiler (The Paint Marks)</strong> görürsünüz. Bu boyaları her ortalama 50 ile 100 yürüme adımda bir önünüzde görüyorsanız demek ki Likya rotasından hiç sapmamış, en doğru istikamettesiniz demektir. Eğer karşınıza kayanın üstünde kırmızı renkte büyük bir X işareti (Çarpı - Cross mark) çıkarsa derhal durun! O işaret size uçuruma, dönülmez sapa bir yanlışa veya dikenlere girdiğinizi, ana yoldan veya patikadan (Trail) çıktığınızı anlatır; hemen geri dönüp o son gördüğünüz sarı-kırmızı düz çizgiyi buluncaya kadar tırmanışa devam etmeyin.</p>

<img src="/images/articles/lycian_way_placeholder_3.png" alt="Bir çam ağacı gövdesine boyanmış likya yolu orjinal sarı ve kırmızı yol şeridi" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="tuyolar">Dağları Kabusa Çevirmemek İçin Geri Sayım: SEO Hayatta Kalma Tüyoları (Checklist)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye sokaklarında gezmek veya şezlonga uzanmak başka, saatlerce tabiatın (Medeniyetsiz vahşi alanın) tam kalbinde sadece kendi ayaklarınızın kası ile var olmak bambaşka bir cesaret ve ciddi hazırlıktır. Acil durum sinyali vermeden bu destanı tam gücüyle bitirmek için Fethiyeli dağcılardan altın reçeteler:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">💧</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Su Yönetimi Kuralı (The 3 Liters Rule - Dehidrasyon İhtimali)</span>
            <span class="text-gray-700 text-base leading-relaxed">Özellikle Mayıs'tan sonra (Yaz sezonu başında) Fethiye dağlarında güneşin sarp kayalardaki yansıması adeta bir fırın etkisi yaratır. Çantanızda (Kişi başı) kesinlikle en ama en az "2 veya 3 Litre" civarında saf pet şişe veya matara suyu taşımalısınız. "Yolda bir bakkal bulup soğuk içerim" diyerek veya otel konseptinizdeki küçük bardak sulara güvenerek tek matara ile yarım litre ile dağa sapan her misafir tırmanışta ağır dehidrasyona (susuzluk şoku) girer ve parkuru o aciz durum yüzünden panikle kesinlikle bitiremez.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">👟</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Doğru "Taban" Seçimi: Fantezi Spor Ayakkabı Felaketi</span>
            <span class="text-gray-700 text-base leading-relaxed">Pahalı koşu ayakkabıları veya dümdüz pamuk/ince hasır tabanlı şehir (Fashionable) bez ayakkabılarıyla Ovacık Kayalık (Kireçtaşı - Limestone) sivri patikalarından yürümeye kalkışılmaz! O sarp kayalar ortalama bir spor ayakkabısının yumuşak altını 2 saatte adeta bıçak ve zımpara gibi jiletler deler, dengenizi bozar ve kaymanıza sebep olur. O patikaya girecekseniz; altı tırtıklı (Vibram gibi) çok kalın tutunucu outdoor tabanlı bir trekking ayakkabısı almanız ayak parmaklarınızın en büyük ve tek kurtarıcısıdır.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📲</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Çevrimdışı (Offline) Harita Uygulamaları Kullanımı Kaçınılmaz</span>
            <span class="text-gray-700 text-base leading-relaxed">Zirvede cep telefonlarının internet hatları (Edge/3G vb) genel olarak koptuğundan, Ovacık'tan (Asfalttan) ayrılmadan evvel telefonunuza internet olmadan sadece GPS uydusundan rota çizen uygulamaları (Örn: Maps.me veya Wikiloc) kesinlikle indirin ve tüm bu "Lycian Way: Ovacik-Faralya" rotasını Cihaza İndirme (Download) seçeğiyle çevrimdışı (Offline) çalışacak konuma getirin. Taş boyası işareti bulamadığınız sarp bir noktada sadece bu uydudan offline çalışan kalın kırmızı çizgiler yolunuzu (ve can güvenliğinizi) %100 oranında emniyette tutacaktır.</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Ayaklarınız toz içinde ama kalbiniz binlerce yıllık Likyalı ataların o aynı attığı cesaret ve doğa ritmiyle dolu... O dağın en yüksek uçurum yamacında sadece rüzgarın o devasa şahane esintisi, deniz kokusu ve arkanızdaki yeşil heybetli orman. 5 Yıldızlı Lüks otellerin size kapalı kapılar ardından dahi vaat demeyeceği ve size asla sunamayacağı bu olağanüstü meditasyonu, Fethiye gezinizin bir sabah yürüyüşüne (Hike) sığdırarak ruhunuzu tamamen özgürlük kelimesi ile baştan inşa etmiş olursunuz. Denizi tepeden görmek çok ama çok başka bir dev sevgilidir. Kusursuz izli yollar ve o serin tatlı patika rüzgarları dileriz!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 10/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Lycian Way Fethiye Routes Guide", tr: "Likya Yolu Fethiye Başlangıç Parkuru Rehberi (Ovacık - Ölüdeniz)" },
        slug: "likya-yolu-fethiye-baslangic-parkurlari-rota",
        slug_en: "lycian-way-fethiye-starting-routes-guide",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/lycian_way_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye'den başlayan Likya yolu etapları (Ovacık, Faralya, Kayaköy). Günübirlik yürüyüş rotaları, sarı çizgi işaretleri ve dev ekipman tablolu SEO doğa rehberi.",
            en: "Ultimate Guide to starting the Lycian Way from Fethiye (Ovacik, Faralya, Kayakoy). Daily hiking routes, trails, maps, and offline tips with full SEO tables."
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
