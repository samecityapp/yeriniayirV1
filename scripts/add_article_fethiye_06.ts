import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye Tekne Turu Seçim Rehberi: 12 Adalar mı Yoksa Ölüdeniz Çıkışlı Mı? (Tam Karşılaştırma)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Türkiye'nin güneybatısındaki o muhteşem Fethiye kıyılarına adım atan her tatilcinin, oteline yerleştiği ilk gün aklına gelen o değişmez ve harika aktivite şüphesiz ki <strong>tam günlük bir tekne turuna (Boat Trip)</strong> katılmaktır. Nitekim Fethiye sadece bir kara harikası değil, yüzlerce gizli koyu, antik sualtı kalıntıları, çam ağaçlarının denize karıştığı sarp ormanları ve sadece denizden ulaşılabilen ıssız plajlarıyla dünyanın en büyük mavi yolculuk rotalarından biridir. Ancak Fethiye limanına veya kordona indiğinizde tatili bir miktar strese sokabilecek o devasa kafa karışıklığı anı başlar: Yan yana dizilmiş yüzlerce irili ufaklı ahşap tekne, sizi iki bambaşka rotaya davet eder. "12 Adalar Turu mu almalıyım, yoksa Ölüdeniz kalkışlı Kelebekler Vadisi tekne turunu mu?"</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Bu soru, sadece küçük bir rota meselesi değildir; o gün, tatilinizin en unutulmaz, huzurlu aile günü mü yoksa yorucu ve aşırı kalabalık bir parti mi olacağını belirleyecek en kritik virajdır. Çünkü <a href="/guide/fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota" class="text-blue-600 hover:text-blue-800 underline transition-colors">ilk kez gelen misafirler</a>, bu iki farklı kalkış noktasının suyundan mola verilen koylarına, yolcu profilinden müzik sesine kadar her alanda 180 derece farklı iki ayrı tatil deneyimi sunduğunu bilmeyebilirler.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Eğer 1 günlük tatiliniz, bütçeniz ve Fethiye rüyanız kıymetliyse, karar vermeden önce dünyanın veya Türkiye'nin neresinden bağlandığınızı unutturacak devasa SEO rehberimizle Fethiye'nin derin maviliklerine dalıyoruz. İhtiyacınız olan o huzurlu <a href="/guide/fethiyede-nerede-kalinir-bolge-secim-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Fethiye limanı çıkışlı</a> büyük adalara mı yoksa açık denizin efsanevi efsanevi manzaralarına sahip Ölüdeniz teknesine mi bilet alacağınıza saat saat her detayı ile hazırlanmış bu lüks metin ile, tablo tablo eksiksiz bir netlikle karar vereceğiz. Tatiliniz şansa bırakılamayacak kadar değerlidir; o halde kaptana vira bismillah diyoruz!</p>

<img src="/images/articles/boat_trip_placeholder_cover.png" alt="Fethiye açıklarında turkuaz deniz üzerinde seyreden devasa ahşap gulet ve tatilci tekneleri havadan görünümü" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Tekne Seçim Süreci İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#fethiye_merkez" class="hover:text-blue-900 transition-colors">Seçenek 1: Klasik ve Göller Gibi Sakin "Fethiye Merkez Çıkışlı 12 Adalar Turu"</a></li>
        <li><a href="#oludeniz_kalkis" class="hover:text-blue-900 transition-colors">Seçenek 2: Dünyaca Ünlü Akdeniz "Ölüdeniz Çıkışlı Kelebekler Vadisi Turu"</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Karar Anı: 12 Adalar Mı, Ölüdeniz Teknesi Mi? (Dev Karşılaştırma Tablosu)</a></li>
        <li><a href="#mavi_yolculuk" class="hover:text-blue-900 transition-colors">Özel Gulet Kiralama Lüksü: Toplu Tur vs VIP Yat</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Deniz Tursuz Dönmemek İçin Hayat Kurtaran Tüyolar (Kontrol Listesi)</a></li>
    </ul>
</div>

<h2 id="fethiye_merkez">Seçenek 1: Klasik, Göller Gibi Sakin ve Çam Kokulu "Fethiye Merkez Çıkışlı 12 Adalar Turu"</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Kapalı Havzada Sıfır Dalga, Sınırsız Rota ve Klasik Ege Huzuru</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Sabah uyanıp kahvaltınızı yaptıktan sonra Fethiye merkez kordonunda veya Çalış sahil kesimindeki o geniş liman bölgesinde sıralanmış o devasa ahşap, çoğunun önünde korsan heykelleri veya iskele babaları bulunan büyük guletleri ve yolcu gemilerini görürsünüz. Bu teknelerin hepsi tek bir klasik rota için bağlıdır: <strong>Dünyaca Ünlü 12 Adalar (12 Islands) Güzergahı</strong>. Burası Göcek – Fethiye burnu arasında kalan, Akdeniz'in inanılmaz derecede "Kapalı", neredeyse devasa bir tuzlu su gölü görünümünde olan çok özel bir koruma körfezi alanıdır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Ölüdeniz'in o devasalığına ve dalgalarına inat, Fethiye Merkezden çıkan bu tekneler denize açıldıkça o meşhur rüzgarları körfezin coğrafyası nedeniyle tamamen kesilir. Sular burada bir havuza, ya da tabiri caizse düm düz pürüzsüz bir göle dönüşür. 12 adalar turu boyunca teknenin güvertesinde kitabınızı pürüzsüz okur, <a href="/guide/fethiyede-cocukla-tatil-kisabir-rehber" class="text-blue-600 hover:text-blue-800 underline transition-colors">bebekleriniz beşiğinde veya pusette</a> en ufak bir sarsıntı yaşamadan huzurla uyur ve açık deniz korkusu veya mide bulantısı (Deniz tutması - seasickness) yaşayanlar için bu sarsıntısız göl misali gezi, inanılmaz kurtarıcıdır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Uğranan meşhur duraklar arasında ise Kızıl Ada (Red Island), Yassıcalar, Göcek Adaları, sığ kumlu suları olan Akvaryum Koyu (Aquarium Bay) ve Kleopatra Hamamı Koyu (Cleopatra Baths - İçinde denizin dibinde antik Roma hamamı kalıntıları vardır, şnorkelle aralarına girilebilir!) bulunur. Mola yerleri her zaman çam ağaçlarının doğrudan denizin köpüklerine dokunduğu, oksijen duvarı gibi yeşilin laciverte tam karıştığı o eşsiz klasik Muğla koylarıdır.</p>

<img src="/images/articles/boat_trip_placeholder_1.png" alt="Fethiye Limanından kalkan dalgasız 12 adalar körfezinde yüzen devasa ahşap tatil tekneleri" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="oludeniz_kalkis">Seçenek 2: Dünyaca Ünlü Açık Akdeniz "Ölüdeniz Çıkışlı 6 Adalar & Kelebekler Vadisi Turu"</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Müthiş Manzaralar, Derin Sular ve Yüksek Frekanslı Eğlence</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye merkezindeki (veya Çalış/Hisarönü bölgelerindeki) otelinizden sabahın erken o ılık saatlerinde dolmuşla Ovacık tepelerini geçip <a href="/guide/oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">doğrudan Ölüdeniz sahiline (Belcekız Plajına) inerseniz</a>, kumların hemen dibinde suya çapalarını atmış çok daha renkli, genelde yüksek sesle ritmik dans müzikleri (Köpük Partileri vs) çalan ve bir parti aurası sunan tekneler sizi karşılar. Bu tekneler Fethiye merkezdeki gibi o durgun göl kıyılarına değil, açık ve engin Akdeniz'in ta kalbine ve büyük dalgalarına doğru dümen kırarlar.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Ölüdeniz çıkışlı tekneler (Bölgede genelde 6 Adalar turu diye geçer), açık limansız sahil olan Belcekız üzerinden hareket edip, devasa ve dimdik sarp Babadağ kayalıklarını kıyı kıyı takip eder. Su saniyeler içinde o açık, turkuaz renkten metrelerce derinlikte bir laciverte döner. Rüzgar güvertede serttir, dalgalar tekneyi oldukça eğlenceli ve heyecanlı boyutlarda şaha kaldırır ve o açık denizde seyretmenin sınırsız özgürlük hissi ruhunuza işler.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Bu turun rotasındaki en ikonik ve tek sebep diyebileceğimiz ana durağı, karadan ulaşımı olmayan <strong><a href="/guide/kelebekler-vadisi-rehberi-fethiye-ulasim" class="text-blue-600 hover:text-blue-800 underline transition-colors">Kelebekler Vadisi (Butterfly Valley)</a></strong>'dir. Tekneler vadi kumsalında genelde 1 veya duruma göre en fazla 1,5 saat durur; siz bu vadide ister ormanın derinliklerindeki şelalelere tırmanır, isterseniz o bembeyaz vadinin kumlarında o muazzam turkuaz suya dalarsınız. Ardından rota meşhur Deve Plajına (Camel Beach), devasa St. Nicholas (Gemiler) adasına ve kayalıklarının arasında akvaryum gibi balıklarla yüzülen Soğuk Su Koyuna (Cold Water Bay - Yukarıdaki tepeden buz gibi tatlı su kaynağı tam denizin içine akarak şok etkisi yaratır) devam eder. Eğlence, coşku ve en egzotik fotoğraflar için muazzamdır.</p>

<img src="/images/articles/boat_trip_placeholder_2.png" alt="Açık ve dalgalı denizde Ölüdeniz kumsalından kalkan, gençlerin partiletiği çift katlı Ölüdeniz teknesi" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="karsilastirma">Karar Anı: 12 Adalar (Fethiye) mı, Ölüdeniz Teknesi mi? Dev Kıyas Tablosu</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Bir tarafta sessizliğin adaları "12 Adalar", diğer yanda dünya standartlarında parti ve açık deniz efsanelerine yolculuk "Ölüdeniz Turları". İşte paranızın ve bir tam gününüzün karşılığını kusursuz alacağınız Türkiye'nin en gelişmiş kıyaslama algoritması:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Temel Karar Kriteri</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">12 Adalar (Fethiye Liman) Turu</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Ölüdeniz & Kelebekler Vadisi Turu</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Deniz Durumu (Mide Bulantısı / Deniz Tutması Eğilimi)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Deniz devasa bir kapalı körfez olduğu için sıfır dalgalıdır, göl gibi yaprak kımıldamaz. Deniz tutması yaşayanlar (Sea sickness) için çok kurtarıcı ve bir numaradır.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Tamamen açık Akdeniz hattı olduğu için rüzgarlı günlerde orta ve dev dalgalar kaçınılmazdır. Alt güvertede oturan veya midesi çok hassas olanlar ekstra ilaç almalıdır.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Hedef Kitle Eğlencesi ve Atmosfer</td>
        <td class="py-4 px-6 text-sm text-gray-700">Huzur, kitap okumak, dinlendirici hafif Akdeniz müziği, <a href="/guide/fethiyede-cocukla-tatil-kisabir-rehber" class="text-blue-600 hover:text-blue-800 underline">büyük bebekli aileler</a> ve "Sadece kuş sesi istiyorum" diyen yorgun orta yaş kitleleri.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Sınırsız enerji isteyen lise-üniversite gençleri veya genç Hisseden çiftler. Bangır bangır müzik çalınan, genelde güvertesinde danslı DJ köpük partisi bulunan süper çok yüksek enerji kitleleri.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Doğa ve Yüzecek Suların Derinliği</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yemyeşil kalın çam ormanlarıyla kaplı koruma koyları; demirlenen yerler sığdır, kumlu plajlardır ve genelde kıyıya halatla çıkılabilir. Aile için su güvenlidir.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Devasa büyüklükteki sarp kayalıklar ve dik dağların oyuklarıdır. Atlanılan yer metrelerce lacivert kör karanlık açık sudur (Kelebekler hariç). Sadece en iyi yüzücüler tam verim alır.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Ulaşımı Kendisi İçin Sağlama (Tekneye Gitmek)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Fethiye merkeze yürüyerek lüks kordon marinasından dev teknelere binilir, <a href="/guide/fethiyede-nerede-kalinir-bolge-secim-rehberi" class="text-blue-600 hover:text-blue-800 underline">Fethiye merkez ve Çalış otellerinde vizitörler</a> için asla servis dahi gerektirmez.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Mutlaka sabahın o telaşlı trafiğinde dolmuş (minibüs) veya araçla yokuşlu Ölüdeniz e inilip oradan Belcekız plaj kumsalları boyu yürünerek tekneye zoraki (su içinden) tırmanış yapılır.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="mavi_yolculuk">Özel Gulet & Tekne Kiralama Lüksü: Toplu Gürültülü Turlar mı Yoksa VIP Kaptanlar mı?</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Türkiye kıyılarında bütçesi daha geniş, <a href="/guide/fethiye-butce-planlayici" class="text-blue-600 hover:text-blue-800 underline transition-colors">özel tatil planlayıcısı (Private Yacht Charter)</a> olan veya balayı çiftleri için son derece kıymetli başka bir seçenek ise "Özel Tekne Kiralama (Private Daily Hire)" sistemidir. 50 ile 80 kişinin, üç katlı ve müzikli korsan tasarımlı tur teknelerinde hep beraber aynı anda denize atlayıp bir tabldot makarna/salata yemeğini yediği toplu turlar, sosyal anlamda harikadır ancak bazılarımız için "Kıyı ve Denizin Özel İzolasyonu" ve lüks anlayışına katiyen uymayabilir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Hem Fethiye Marinadan, hem de Ölüdeniz tarafından rahatlıkla çok sayıda "Küçük Aile Boy Gulet" veya "Vip Motor Yatch" ları sadece günlük 8 saat olarak kiralayabilirsiniz. Ailecek 4-6 kişilik büyük bir grupsanız; tekne başı ödenen bu rakam (toplu bilete kıyasla iki katına çıksa da); kaptanın sizin istediğiniz manzaralı o sapa gizli koya demirlemesi, denizin orta yerinde sadece sizin sevdiklerinizle o koyun pürüzsüz tadını çıkarmanız ve mutfakta size özel mangalda devasa levreklerin ve taptaze Akdeniz ahtapotlarının (size has soğuk mezelerin) eşlik etmesi, paha biçilemez değerde ve yıllarca unutulmayan bir tam gün Mavi Yolculuk lüksü yaratır. Turizmin başkenti olan ülkemizde hayat boyunca bir kez bu özel hissi yaşamak şarttır.</p>

<img src="/images/articles/boat_trip_placeholder_3.png" alt="Sadece bir ailenin kiraladığı tenha ve muazzam şık tasarımda küçük VIP ahşap tekne" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="tuyolar">Denizi Tatil Kabusuna Çevirmemek İçin Hayat Kurtaran Tüyolar (Checklist)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Sadece deniz, güneş ve kumsal dediğimiz oldukça huzur dolu eylemlerin arasında aslında ufak ama çok çok büyük acılara sebebiyet verecek tehlikeli nüanslar vardır. İşte sizi güvende hissettirecek profesyonel SEO gemi rotası altın kuralları:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📌</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Rüzgarlı Saçlar Uyarısı (The Wind Burn): En Devasa Yanılgı</span>
            <span class="text-gray-700 text-base leading-relaxed">Güvertede tekne rüzgarı kesintisiz bir 6-7 saat boyunca cildinize vururken ve kendinizi hiç sıcak hissetmeyip sadece ferahlık hissederken en az "SPF 50 (Factor 50)" devasa güneş koruyucuyu saatte bir kez yenileyin! Dünyadaki Fethiye tatiline gelip de akşam otel odasında birinci derece açık ten yanığıyla (acı içinde titreyerek) tatilini zehir eden %80 turist, bu yalan ferahlık hissine inanıp "bana bir şey olmaz, terlemiyorum ki" diyenlerdir.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📌</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Şnorkel Maskesini Kendiniz Alın (Temizlik ve Hijyen Seviyesi)</span>
            <span class="text-gray-700 text-base leading-relaxed">Özellikle Fethiye Akvaryum koylarında veya Ölüdeniz çıkışlı Soğuk Su Koyunda denizin dibi muazzam bir doğal akvaryuma (Balık Sürüleri) benzemesinden ötürü herkes suyun altını görmek ister. Turlarda tekneler ortak, demirbaş şnorkeller verebilir ("Eşantiyon / Free"). Ancak yaz sıcağında, sizden önce her günde onlarca kimliği belirsiz farklı kişinin yüzüne, terine ve ağzına değmiş plastik, kiralık deniz ürününü çocuklarınızın yüzüne ağzına takmamak adına; bavulunuza memleketinizden uygun fiyatlı ve kişisel Decathlon / yerel marka küçük pratik şnorkel tüplerini atmanız her daim çok önemlidir.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📌</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Büyük Gemi mi (Korsan), Yoksa Sade Ahşap Gulet mi Tercihi? (Sessiz Tur Seçeneği)</span>
            <span class="text-gray-700 text-base leading-relaxed">Bilet rezerve ederken veya sabah limana inerken gördüğünüz satış gişelerinde turizm görevlisine mutlaka ama mutlaka en çok net sormanız gereken asıl sihirli şifre kelimesi: <strong>"Do you provide a Silent Boat tour?" (Sessiz tur tekneniz var mı?).</strong> Fethiye'de bazı çok nadir tekneler müziksiz (veya aşırı kısık sesli keman/jazz) ve köpük partisiz, tamamen sessizlik adayı konseptlerde yüzdürebilirler. Eğlenceden uzak doğaya (yoga vb.) inen bu Sessiz tekneler için mutlaka aylar öncesinden satıcınıza rezervasyon sözleri için ısrar etmeyi hiç ama hiç sakın unutmayın.</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Sabah güvertesinden güneşin henüz yakan ilk ışıklarında Akdeniz'in tuzunu, büyük ahşap guletlerin o muazzam gıcırdayan esintisini teninize aldığınız o andan; akşam ufka gömülen turuncu bir ege güneşiyle limana yanaşma anınıza kadarki bu muazzam 7-8 saatlik büyük yolculuk, senenin geriye kalan 350 günü boyunca gözlerinizi ne zaman kapatsanız gülümseyerek arayacağınız dev bir hafıza sarayı olacaktır. Hangi rotayı seçtiğiniz önemli değildir; önemli olan Türkiye kıyılarının o muhteşem mavisinin ve pürüzsüz cömert doğasının size dünyada parayla satın alınamayacak muazzam bir "Yeniden Doğuş" tecrübesi sunmasıdır. Yelkenlerinize sonsuza dek eşlik edecek serin pürüzsüz rüzgarlarla, iyi tatiller dileriz!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 6/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Fethiye Boat Trip Choice: 12 Islands vs Oludeniz", tr: "Fethiye Tekne Turu Seçme Rehberi: 12 Adalar Mı Ölüdeniz mi?" },
        slug: "fethiye-tekne-turu-secme-rehberi",
        slug_en: "fethiye-boat-trip-choice",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/boat_trip_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye tatilinde 12 Adalar tekne turu ile Ölüdeniz Kelebekler vadisi turu arasındaki farklar. Hangi gemi size uygun? Kıyaslama tabloları ve deniz tutması önlemleri.",
            en: "Ultimate comparison between the 12 Islands Boat Trip and the Oludeniz Butterfly Valley boat tour. Detailed SEO travel guide with tables and tips."
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
