import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye'ye Ne Zaman Gidilir? Ay Ay Hava Durumu ve En İyi Tatil Dönemi Rehberi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Muğla'nın o efsanevi batısında yer alan ve Akdeniz ile Ege sularının devasa bir coşkuyla birleştiği cennet köşe Fethiye, haritadaki o mükemmel konumu sayesinde klasik bir "Yazlık Beklenti" (Summer Resort) ilçesinden çok daha fazlasıdır. Çoğu turist tatil dendiğinde sadece o cayır cayır yanan "Temmuz - Ağustos" aylarını baz alır. Ancak Fethiye, sarp Toros dağlarının korunaklı körfezlerinde yer aldığından; kışın dahi badem çiçeklerinin açtığı, baharda Likya yollarında rüzgarların serin estiği ve sonbaharda deniz suyunun banyo suyu sıcaklığında kaldığı tam 300 günlük güneşli devasa bir "Mikro-İklim" (Micro-Climate) harikasıdır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Peki ama bu 12 aylık serüvende <strong>siz tatilciler için en efsanevi, o "Altın Dönem" (Golden Time)</strong> tam olarak ne zamandır? Eğer balayına çıkıyor ve sıfır kalabalık arıyorsanız, cevabınız başka olacaktır. Eğer <a href="/guide/fethiyede-cocukla-tatil-kisabir-rehber" class="text-blue-600 hover:text-blue-800 underline transition-colors">iki küçük okul çağındaki çocuğunuz</a> varsa mecburen seçeceğiniz aylar başkadır. Fethiye'nin yerelleri (Muğla halkı) temmuz sıcağında yaylalara kaçarken, <a href="/guide/likya-yolu-fethiye-baslangic-parkurlari-rota" class="text-blue-600 hover:text-blue-800 underline transition-colors">Likya yolu yürüyüşü</a> veya o meşhur <a href="/guide/fethiye-babadag-paragliding-guide" class="text-blue-600 hover:text-blue-800 underline transition-colors">Yamaç paraşütünü</a> yapmak isteyen adrenalin sporcuları Ekim sonunu adeta bir sır gibi dört gözle beklerler.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Uçak biletlerinizi (ve otel rezervasyonlarınızı) daha almadıysanız lütfen hemen o kredi kartınızı veya planınızı bir kenara bırakın! Sizi Fethiye'de çok aşırı yanmaktan, kışın yağan muson tarzı dev lokal yağmurlara yakalanmaktan veya buz gibi soğuk denize girmekten kalıcı olarak kurtaracak, SEO uyumlu ve en keskin "Aydan Aya (Month by Month) Fethiye Turizm İklimi" SEO rehberimizle tanıştırıyoruz. Valizinizi hangi mevsime göre hazırlayacağğinize karar vermeye hazır olun!</p>

<img src="/images/articles/weather_placeholder_cover.png" alt="Ekim ayında Fethiye Ölüdeniz Lagününde sapsarı güneş ve masmavi durgun su, uçan yamaç paraşütçüsüyle" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: İklim ve Tatil Zamanı İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#ilkbahar" class="hover:text-blue-900 transition-colors">İlkbahar (Nisan - Mayıs): Doğanın Uyanışı ve Trekking Sezonu</a></li>
        <li><a href="#yaz" class="hover:text-blue-900 transition-colors">Yüksek Yaz (Haziran - Ağustos): İnanılmaz Kalabalık ve Sıcak Dorukları</a></li>
        <li><a href="#sonbahar" class="hover:text-blue-900 transition-colors">Sonbahar Altın Çağı (Eylül - Kasım): Yerel Halkın Favorisi Sessiz Fethiye</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Matris Tablosu: Amaca Göre En Doğru Ay Seçimi (Budget vs Lüks)</a></li>
        <li><a href="#kis" class="hover:text-blue-900 transition-colors">Kış Aylarında Fethiye (Aralık - Mart): Ölü Sezon mu Yoksa Huzur mu?</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Bavul Hazırlama SEO Tüyoları (Mevsimlerin Gizli Tuzakları)</a></li>
    </ul>
</div>

<h2 id="ilkbahar">İlkbahar (Nisan ve Özel Mayıs): Trekking Sporcularının ve Uyanışın Cenneti</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Hava: 21°C - 26°C (Gündüz) | Deniz: 18°C - 20°C (Biraz Titretici)</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye'nin kış yağmurlarından silkinip sapsarı papatyalara ve yemyeşil dağ ormanlarına büründüğü bu erken ilkbahar dönemi, turizm sezonunun (ve devasa lüks otellerin) kepenklerini yeni yeni açarak güneşe göz kırptığı uyanış dönemidir. Özellikle Nisan ortası ve Mayıs'ın tamamı; Fethiye'ye <strong>denizde çok terlemek için değil, yürümek, tarih görmek ve doğayla iç içe dinlenmek</strong> için gelen o meşhur "Kuzey Avrupa"lı (İngiliz/Alman) ekolojist ve orta yaş emekli gezginlerin akın ettiği zaman dilimidir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Mayıs ayında o sarp yokuşlu <a href="/guide/likya-yolu-fethiye-baslangic-parkurlari-rota" class="text-blue-600 hover:text-blue-800 underline transition-colors">Likya Yolunda yürümek</a> veya <a href="/guide/tlos-antik-kenti-yakapark-gizlikent-fethiye-selale-rotasi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Tlos antik kentini o güneş tepedeyken tırmanmak</a> inanılmaz derecede ferah ve keyiflidir. Kesinlikle güneş çarpmazsınız. Üstelik otel fiyatları yüksek yaz sezonunun resmen "Yarı (Half-Price) fiyatındadır". Tek sorun: Nisan-Mayıs aylarında deniz suyu henüz tam ısınmamış ve biraz dondurucu (Chilly) kıvamdadır. Sıcak kumsallarda uzun çocuklu deniz banyoları yapmak isteyenler için bu dönem biraz hayal kırıklığı olabilir, ancak akşam yürüyüşleri için hafif ve çok lüks bir bahar hırkası ile en kusursuz termal hava dengesidir.</p>

<img src="/images/articles/weather_placeholder_1.png" alt="Mayıs ayında Fethiye sahilinde incecik bir hırkayla sabah denizine bakan sakin ve izole turist fotoğrafı" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="yaz">Zirve ve 'High Season' (Haziran, Temmuz, Ağustos): Kavurucu Güneş ve Milyonluk Kalabalıklar</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Hava: 35°C - 42°C (Gündüz) | Deniz: 27°C - 29°C (Banyo Suyu Kıvamı)</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Tüm okulların kapandığı, dünyada milyonlarca çalışanın o meşhur dev yıllık izinlerini kullandığı "Pik" (Peak Season) aylarıdır. Haziran başında deniz suyu tam o lüks yüzme sıcaklığına erişirken; Temmuz ve Ağustos ayları <a href="/guide/fethiyede-en-iyi-plaj-ve-koy-secimi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Ölüdeniz Belcekız</a> plajının ve tüm şehir merkezinin iğne atsanız yere düşmeyeceği devasa uğultulu ve enerjik kitlelere ev sahipliği yapar. Tüm bar sokaklarında (Hisarönü ve Paspatur) müzik sesleri birbirine karışır, tatil bir curcuna şenliğine döner.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Eğer <a href="/guide/fethiye-tekne-turu-secme-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">12 Adalar Tekne Turlarında</a> şezlong kapmak veya Babadağ zirvelerinden yamaç paraşütü için günün en güzel saatlerine yer bulmak (Ticking the bucket list) istiyorsanız; bu 3 ay boyunca "Erken Rezervasyonlar" bir lüks değil mecburiyettir! Hava nemli ve yakıcıdır. Öğlenleri Fethiye halkı ile birlikte muhtemelen gölgelere veya otel odası klimasına kaçar, sadece sabah 11 öncesi ve akşamüstü 16:30 sonrası dışarı serinleyerek çıkarsınız. Eğlencenin ve hareketin kalbinde olmak isteyen dev kafileler, aşıklar ve genç enerji tutkunlarının bütçeyi umursamadan gözü kara daldığı o koca cümbüşlü dönemin ta kendisidir.</p>

<h2 id="karsilastirma">Size En Uygun Zamana Karar Vermek Adına Kritik Veri Tablosu (Matrix Analizi)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Hangi ay, cüzdanınıza veya beklentinize ihanet etmez? Hata riskini sıfıra indiren bütçe, kalabalık ve hava SEO iklim analiz kıyaslamamız:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Aylar (Dönem)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Konaklama Bütçesi & Rezervasyon Zorluğu</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Ana Olay / Hissiyat (Vibe)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">İdeal Tatilci Tipi (Ziyaretçi)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Nisan / Mayıs (İlkbahar)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Çok Uygun Fiyatlar, boş ve seçmeli otel kapasitesi, tur şirketlerinde bolluk.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Tarihi harabeler (Tlos, Kayaköy) gezisi, dağ trekkingleri. Çok hafif esintili serin akşam yürüyüşleri.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Doğa fotoğrafçıları, emekli çiftler, yürüme tutkunları, güneşten ve yanıktan inanılmaz korkanlar.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Temmuz / Ağustos (Zirve - Peak)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yılın en ama en pahalı tarifesi. Restoranlar ve oteller için aylar öncesinden ayırtmak 'Extreme' derecede mecburidir.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Bangır bangır müzik, beach clublar, sıcak kavurucu nem, çok ısınmış bir deniz, inanılmaz hızlı gece hayatı.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Parti ve gece hayatı kitleleri, okulları tatil olmuş kalabalık lise/üniversite grupları ve tüm dev kalabalık çocuklu dev aileler.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Eylül / Ekim (Okyanus 'Golden' Sezon)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Ağustosa göre %30 ucuzdur ancak hala talep çok fazladır. Mantıklı fırsatlar aniden yakalanabilir.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Tüm o Temmuz sıcağının denizi ısıttığı rüya; ılık berrak sular. Kalabalığın %50 gitmesi ve çok dinlendirici sessizlik.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Sessiz lüks arayan Balayı Çiftleri (Honeymooners), tecrübeli gurme gezginler, sükunetle roman okuyan elit tatilciler.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="sonbahar">Sonbahar Okyanus Altın Çağı (Eylül - Ekim ve Kısmi Kasım): Yerel Turizm Gurmelerinin Saklı Zamanı</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Bir Fethiye yerlisine (Muğlalıya) sorsanız, <strong>"Denize en güzel ne zaman girilir, deniz en çok hangi ay efsane olur?"</strong> diye; alacağınız o yegane, tereddütsüz cevap daima: <strong>"Eylül ve Ekim Aylarında!"</strong> olur. Neden mi? Çünkü o bitmek bilmeyen uzun Temmuz ve Ağustos'un kavurucu bunaltı fırını (sıcaklıkları), bütün kocaman 2 ay boyunca resmen 'Akdeniz'in suyunu alttan ısıtmış', denizi kelimenin tam anlamıyla ılık, süt gibi bir rüya derecesine devasa şekilde yavaşça getirmiştir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Eylül geldiğinde ise o "Okul zilleri" tüm Avrupa'da ve Türkiye'de yeniden çalmaya başlar. O gürültülü üniversite gençliği ve çok bağıran tatil köyü çocuk animasyonları %100 oranında bir anda ana evlerine geri döner (Kalabalık aniden kaybolur). Güneş, o acıtan yakıcı dikliğini tamamen kaybeder, artık sadece cildinizi usulca okşayan bir altın filtre (Golden Hour efekti) tüm gün sokaklardadır. O koca kordon yürüyüş yolları, çok lüks elit balayı çiftlerine (Honeymoon), yabancı expatlara ve dingin ruhlulara baki kalır. Fethiye'de Ekim akşamüstünde Ölüdeniz tabanındaki kumları cam gibi parlatarak yansıyan ışıklarda izlemek, bir dünya klasmanıdır ve tatil zevki budur!</p>

<img src="/images/articles/weather_placeholder_2.png" alt="Ekim ayında serin bir seste batan güneş ve tamamen boşalmış sakin Ölüdeniz kumsalı ve dalgalar" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="kis">Fethiye'de Kış Tatili (Aralık - Mart Arası): Çölleşen Sahiller mi Yoksa Huzur Barınağı Mı?</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Turizmin %90 tesisinin kapısına asma kilit vurduğu, Hisarönü Barlar Sokağının "Hayalet Kasaba"ya döndüğü o ıssız aylardır Kış (Winter). Fethiye'nin kışları eksi dereceleri (Kar ve Don) asla görmez (13-16 derece ortalamadadır) ancak bölgenin dağlık konumu sebebiyle, devasa, muson tarzında bir seferde günlerce sürebilen şiddetli yağmurlar Fethiye'nin meşhur sert yüzüdür. 12 Ada Tekne turları tamamen iptaldir, dalgalar Belcekız'da bazen sahili döver.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Ama tüm bunlara karşılık; kışın Fethiye'de sadece "Müstakil Lüks Şömineli Özel Kiralık Villalarda" veya ahşap evlerde yağmura karşı kitabınızı okumak, boş merkezde (Paspatur'da) bir avuç lokal esnafla sımsıcak soba başında çay içmek ve Çalış sahilinde o fırtınalı gri denizi (Storm watching) çok ucuza izlemek gibi romantik bir sükunet köşesine çekilebilirsiniz. Fethiye kışın denize girilecek (Yabancı İngiliz soğuk alışkınları hariç) değil, kafayı tamamen dinleyip dijital detoks yapılacak o uykulu sessiz dev liman kentidir.</p>

<h2 id="tuyolar">Profesyonel Bavul Hazırlama SEO Tüyoları (Gizli İklim Tuzaklarından Kurtulun)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Seyahatiniz Ekim de olsa Ağustos da olsa, bu "Mikro klima" bölgesine geliyorsunuz. Hata yapmamak için bavula girecek hayati checklist analizimiz:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">🧥</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Eylül & Mayıs Ayı Hırkası Unutkanlığı (The Chill Trap)</span>
            <span class="text-gray-700 text-base leading-relaxed">Gündüzleri güneş inanılmaz sıcaktır ve terlersiniz. "Nasıl olsa Antalya Akdeniz sıcağı burası" diyerek gece akşam yemeğine (Ovacık, Hisarönü veya Çalış sahil barına) de sadece ip askılı ince bir elbiseyle veya tek kat kısa kol tişörtle (Şortla) çıkarsanız; o akşam saati çam dağlarından deniz üzerine çöken rutubetli ani rüzgar saniyeler içinde bütün tatilinizi sinüzite ve boğaz/titreme kabusuna çevirir. Bavula asla ama asla 'en az 1 adet içi hafif pamuklu kışlık rüzgarlıklı kalın hırka/Kazak' atmadan, hangi yaz ayı olursa olsun o sahil şehrine şansa gitmeyin.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">🦟</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Sinek Savucu Sırrı (Mosquito Season Peak: Haziran - Eylül)</span>
            <span class="text-gray-700 text-base leading-relaxed">Özellikle yemyeşil, ağaçlık, böceklerin doğal florasının ta kendisi sarp Kelebekler Vadisi, Kayaköy ve Çalış bölgelerinde akşam üzeri o Golden Hour saatinde balkonda şarabınızı/çayınızı yudumlarken bacaklarınıza inanılmaz sessiz küçük (Pervane) sivrisinek sürüsü pike yapar. Otelin lobisine veya o bölgedeki eczanelere koşturup fahiş fiyattan yabancı sinek spreyi almaktansa; Türkiye'den getirdiğiniz tabletleri, sıvı likit savarları ve kremleri bavulun bir köşesine mutlak şifa olarak sığdırın. Geceleriniz uykusuz geçmesin.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">🩱</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Kasım (Sonbahar) Deniz Çantası Umutsuzluğu: Mayo Bırakmayın</span>
            <span class="text-gray-700 text-base leading-relaxed">Özellikle İstanbul'dan veya İngiltere-Norveç hattından Kasım ilk haftası bilet aldıysanız ve "Havalar döndü, orada yağmur yağıyordur, denize hayatta girmem" diyerek mayonuzu evde bıraktıysanız çok büyük depresyona hazır olun. Kasım Fethiye'si çoğunlukla dev sürprizlerle (Yalancı Yaz'larla) parlar. Etraftaki yabancı İngilizler turistlerin 22 derece denize o ılık sakin pürüzsüz sulardan çığlık atarak şezlonga girip çıktığını, şortla kahve içtiklerini görüp pişmanlık çekmemek için, her ihtimale karşı "Bagaja atılmış şanslı ve ufacık bir Mayo", Sonbahar dönemi Akdeniz kurtarıcısı SEO canavarıdır.</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Sonuç olarak; Fethiye sadece Temmuz ağustosunun gürültüsünden, yanan o lüks beach club eğlencesinden ibaret hiç değildir. Dağ rüzgarlarının en sessiz baharlarda fısıldadığı lüksü, Eylül'ün efsanevi Golden Hour kızıl altın kumu sularıyla tamamen ılıklaşıp harmanlanmasında yatar. Turizm algoritmanız ne ise, ona göre Fethiye'ye bileti kesin; ancak şu asıl gerçek ki, o efsane deniz suyunun Akdeniz rüzgarıyla dansı, 12 ayın her takvim yaprağında çok ama çok farklı ve lüks bir masalın bambaşka, unutulmaz dev anahtarıdır. Doğru takvimle şaşırtıcı tatiller dileriz!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 12/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Best Time to Visit Fethiye: Month by Month Weather Guide", tr: "Fethiye'ye Ne Zaman Gidilir? Aydan Aya Hava Durumu ve En İyi Zamanlama Rehberi" },
        slug: "fethiyeye-ne-zaman-gidilir-hava-durumu",
        slug_en: "best-time-to-visit-fethiye-weather",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/weather_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye tatili için en iyi aylar. Yaz sıcaklıkları, Eylül Ekim sonbahar sükuneti ve İlkbahar deniz suyu sıcaklıkları Fethiye SEO iklim ve bavul rehberi.",
            en: "When is the best time to go to Fethiye? Detailed SEO weather guide month by month. Summer peaks, autumn sea temperatures and spring trekking tips."
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
