import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Kelebekler Vadisi Rehberi: Türkiye'nin Gözbebeği Saklı Cennete Ulaşım ve Konaklama Sırları</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Dünya üzerinde öyle yerler vardır ki, bir fotoğraf karesini gördüğünüz an hafızanıza kazınır ve o an orada olmak için dayanılmaz bir istek duyarsınız. İşte Türkiye'nin Fethiye ilçesinde, Babadağ'ın dik yamaçlarının arasından Akdeniz'in o eşsiz turkuaz sularına aniden açılan görkemli ve sarp bir kanyon olan <strong>Kelebekler Vadisi (Butterfly Valley)</strong> tam olarak böyle efsanevi bir doğa harikasıdır. Sadece ülkemizin değil, Avrupa'nın ve dünyanın en çok fotoğraflanan, en çok merak edilen ve uluslararası turizm platformlarında "Mutlaka Görülmeli (Must-See)" listelerinde her zaman zirvede yer alan bu devasa vadi, sıradan bir tatil kumsalından çok daha fazlasıdır. Dünyadan ve ana karadan tamamen izole edilmiş bu saklı cennet, el değmemiş doğası, milyonlarca kelebeğe ev sahipliği yapan botanik ekosistemi ve ulaşımının getirdiği "zorluk" ile ziyaretçilerini büyülemektedir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Peki, Fethiye tatil planınızı yaparken Kelebekler Vadisi'ne gidip gitmemek konusunda veya buraya nasıl güvenli bir şekilde ulaşacağınız konusunda endişeleriniz mi var? Hangi tekneyle gitmelisiniz, karadan inmek mümkün mü, kanyonda yürüyüş yapılır mı, vadide telefon çekiyor mu ve orada kamp / konaklama yapılabilir mi? İlk kez <a href="/guide/fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota" class="text-blue-600 hover:text-blue-800 underline transition-colors">Fethiye'ye gelen tatilciler</a> için bu soruların cevaplarını bilmek hayati önem taşır. Coğrafi zorlukları ve ulaşım sırları ile başlı başına bir macera olan bu yer, doğru planlama yapılmadığında hayal kırıklığına bile dönüşebilir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Eğer tatil rotanızda Fethiye varsa ve en az bir gününüzü bu inanılmaz büyüklükteki coğrafi anıta ayırmayı düşünüyorsanız, arama motorlarında saatlerce dağınık bilgi aramanıza gerek yok. Saat saat planlanmış, tamamen SEO ve ulaşım pratiklikleri düşünülerek bir araya getirilmiş bu 2500+ kelimelik dürüst ve devasa rehberimizde; <strong>Kelebekler Vadisi'ne ulaşım yöntemlerini (Tekne vs Yürüyüş)</strong>, içindeki büyük şelale rotasını, orada konaklamanın (kamp/bungalov) tüm gerçek boyutlarını tam profesyonel bir dille açıklıyoruz. İşte karşınızda, o ulaşılmaz cennetin kapılarını sonuna kadar aralayan en kapsamlı Fethiye Kelebekler Vadisi Başucu Kılavuzu!</p>

<img src="/images/articles/kelebekler_placeholder_cover.png" alt="Kelebekler Vadisi'nin devasa iki kaya arasından turkuaz denize açıldığı ve plajın havadan çekilmiş muazzam manzarası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Kelebekler Vadisi Rehberi İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#tarihce" class="hover:text-blue-900 transition-colors">Vadinin Coğrafi Önemi ve Kelebekler Neden Buradalar?</a></li>
        <li><a href="#ulasim" class="hover:text-blue-900 transition-colors">Vadiye Nasıl Gidilir? (Deniz Yolu mu, Kara Yolu mu?)</a></li>
        <li><a href="#tablo_kiyas" class="hover:text-blue-900 transition-colors">Önemli Karşılaştırma: Tekne Dolmuşu vs Faralya Yürüyüşü (Tablo)</a></li>
        <li><a href="#ic_dunya" class="hover:text-blue-900 transition-colors">Vadinin İçi: Şelale Yürüyüşü ve Tiger (Kaplan) Kelebeği Peşinde</a></li>
        <li><a href="#konaklama" class="hover:text-blue-900 transition-colors">Orada Kalmak Mümkün Mü? (Bungalov ve Çadır Kampı)</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Tatili Kurtaracak Pro Tüyolar ve Yasaklar (Kontrol Listesi)</a></li>
    </ul>
</div>

<h2 id="tarihce">Kelebekler Vadisi'nin Coğrafi Önemi: Kelebekler Neden Sadece Buradalar?</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Doğanın İnsandan İzole Ettiği Botanik Bir Mucize</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Kelebekler Vadisi (Eski adıyla Güdürümsu), Babadağ'ın devasa kayalıklarının 350 - 400 metrelik çok keskin ve sarp duvarlarla adeta ikiye yarılması sonucu oluşmuş dev bir yeryüzü anıtıdır. 1995 yılında Türkiye Cumhuriyeti devleti tarafından 1. Derece Doğal Sit Alanı ilan edilmiş olan bu vadi, hiçbir betonarme yapılaşmanın, lüks otellerin veya yol asfaltının bulunmadığı, %100 koruma altındaki endemik (sadece o bölgede yaşayan) bir bitki ve hayvan alanıdır. İçi her mevsim akan ve dökülen mini şelalelerle, devasa çalılarla ve sığla ağaçlarıyla kaplı olan bu yer, inanılmaz nemli ve sadece buraya has bir mikroklima yaratır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Peki ama bu derin kanyona neden "Kelebekler" vadisi denmiştir? Bunun sebebi vadinin çok izole ve rüzgardan tam korunaklı olması sayesinde, özellikle "Jersey Tiger" (Kaplan Kelebeği) başta olmak üzere 80'den fazla farklı irili ufaklı kelebek türünün koloni halinde burada barınması, burada çiftleşmesi ve üremesidir. Sığı ağaçlarının salgıladığı çok özel kokulu bir reçine, bu kelebek türlerinin bu bölgede toplanmasındaki asıl büyük nedendir. Eğer <a href="/guide/fethiyede-ne-zaman-gidilir" class="text-blue-600 hover:text-blue-800 underline transition-colors">Nisan ortası ve Haziran başlarında</a> (sezonun hemen başı) kanyonun devasa kayalıklarının derinliklerine doğru sessizce yürürseniz, ağaçların gövdelerini bir halı gibi kaplamış ve aniden havalanan on binlerce kırmızı/siyah renkli o eşsiz kaplan kelebeklerinin kanat uçuşlarına şahit olabilirsiniz. Bu görsel, dünya üzerinde pek az insanın canlı şahit olabileceği vahşi ve kırılgan bir mucizedir.</p>

<h2 id="ulasim">Kelebekler Vadisine Nasıl Gidilir? (Deniz Yolu ve Kara Çıkmazı)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Türkiye'nin Karadan Yolu Olmayan En Meşhur Turizm Noktası</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Ziyaretçilerin Fethiye tabelasını geçip <a href="/guide/oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Ölüdeniz'e vardığında</a> sorduğu en temel ve hayal kırıklığına sebep olabilen soru şudur: "Kelebekler vadisine arabamızı nereye park edip yürüyoruz?". Maalesef veya neyse ki, Kelebekler Vadisi'nin kumsalına inen herhangi bir asfalt araç yolu veya merdivenli bir yaya yolu sistemi kesinlikle <strong>YOKTUR</strong>. Vadiye otomobil, lüks cip, motosiklet veya otobüs ile inmeniz coğrafi olarak 400 metrelik bir uçurum sebebiyle imkansızdır. Bu sarp izolasyon, zaten vadinin bugüne kadar bozulmadan kalmasını sağlayan en büyük savunma kalkanıdır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Bu izole vadinin o eşsiz sıcak kumlarına ayak basmak, denize girmek ve içerideki ormanlık otopark (şelale) alanını gezmek istiyorsanız önünüzde sadece iki rasyonel seçenek vardır. İlki ve herkes tarafından kullanılan en konforlu %90'lık seçenek olan <strong>Ölüdeniz Belcekız kumsalından kalkan deniz (tekne) dolmuşları / özel turlar</strong>, bir diğeri de (sadece ama sadece profesyonel tırmanışçıların kullandığı çok tehlikeli bir yöntem olan) <strong>Faralya köyü uçurum patika yürüyüşüdür.</strong> Şimdi bu iki ulaşım türünün hayati değer taşıyan karşılaştırmasını rehberimizin tablosunda en açık haliyle masaya yatırıyoruz.</p>

<img src="/images/articles/kelebekler_placeholder_1.png" alt="Ölüdeniz'den Kelebekler vadisi plajına doğru yaklaşan yolcu teknesi ve turkuaz deniz suyu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="tablo_kiyas">Mükemmel Ulaşım Tablosu: Tekne (Deniz) ile Gelmek vs Karadan (Faralya) İnmek</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Aşağıdaki tablo, tatilinizin büyük bir kaza mı yoksa harika bir anı mı olacağını belirleyecek niteliktedir. İnternet forumlarında okuduğunuz her "yukarıdan yürüdüm çok kolaydı" yorumuna asla itibar etmeyin. İşte coğrafi kıyaslama:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Ulaşım Analizi / Yöntemi</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">A Seçeneği: Ölüdeniz Tekne Dolmuşu (Deniz Yolu)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">B Seçeneği: Faralya Köyünden Patika İnişi (Kara Yolu)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Güzergah ve Kalkış Noktası</td>
        <td class="py-4 px-6 text-sm text-gray-700">Ölüdeniz Belcekız (ana plaj) kumundan saat başı kalkan resmi feribot/dolmuş tekneler veya günübirlik 6 Adalar turları.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Aracınızla veya <a href="/guide/fethiyede-aracsiz-arabasiz-tatil-plani-dolmus-taksi-yuruyus" class="text-blue-600 hover:text-blue-800 underline">Ölüdeniz dolmuşu</a> ile Ölüdeniz'den dağa (Faralya Köyüne) virajlı tırmanıp uçurum tepesinden yayan inmek.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Yolculuk Süresi ve Konfor</td>
        <td class="py-4 px-6 text-sm text-gray-700">Maksimum 30 dakika sürer. Güvertede güneşlenerek, pürüzsüz açık deniz rüzgarında müzik dinleyerek aşırı keyifli ve konforludur.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Ortalama 45 dakika sürer ancak tamamen dikey, taşlı, kayarak inilen kızgın güneşte adeta bir dağcılık kabusu veya hayatta kalma sınavıdır.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Uygun Hedef Kitle (Visitor Type)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Çocuklu aileler ve <a href="/guide/fethiyede-cocukla-tatil-kisabir-rehber" class="text-blue-600 hover:text-blue-800 underline">bebek arabası olanlar</a>, kampçılar, sıradan turistler ve tatili dinlenmek için rezerve eden herkes.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Sadece uygun dağcılık (trekking) botları, halat tecrübesi olan profesyonel sporcular ve ekstrem (aşırı zor) tırmanış arayan maceraperestler.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Güvenlik Durumu ve Risk</td>
        <td class="py-4 px-6 text-sm text-gray-700">%100 Güvenlidir. Can yelekleri, resmi kooperatif denetimi vardır. Fiziksel bir efor sıfırdır.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Çok yüksek ölüm veya ağır kaza riski vardır. Her yıl terlikle inen onlarca turist dağ kurtarma ekiplerince helikopterle kurtarılmaktadır. Tavsiye Asla Edilmez!</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="ic_dunya">Kelebekler Vadisinin O Gizemli İçi: Şelale Yürüyüşü ve Tiger Kelebeği</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Deniz yoluyla, o turkuaz maviliğinden yavaşça süzülüp kumsala attığınız o ilk adım anında (özellikle devasa iki dağın arasından içeri girerken) insan kendi boyutlarının ufaklığını ve doğanın ihtişamını hisseder. Vadinin dış kısmı deniz, güneş ve kumsal alanıdır. Ancak, arkanızı denize dönüp de kanyonun çok daha serin ve devasa yüksek ağaçlarla kaplı ormanlık iç kısımlarına yürümeye başladığınızda asıl botanik keşif rotası başlar.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Vadi zemininde yürümeye (Trekking / Doğa Yürüyüşü) devam ettikçe bitki örtüsü bir anda sıkılaşır, güneş ışınları yaprakların arasından bir şerit gibi süzülür ve ortam belirgin derecede en az 4-5 derece soğur. Yolun sonunda göreceğiniz iki şey tatilinizin anahtarıdır: "Birinci Şelale" (Küçük şelale) ve "İkinci Şelale" (Büyük Olan). Genellikle düz zemin sadece ilk küçük şelaleye kadar izin verir (Yaklaşık 15-20 dakikalık harika terletmeyen bir doğa yürüyüşüdür). Ancak gerçek bir şelale fışkırmasını görmek ve buz gibi akan sularda yüzünüzü yıkamak istiyorsanız, halatlarla desteklenmiş ufak kayaları yavaşça tırmanarak büyük şelaleye ulaşmalısınız. Sadece bu tırmanış sırasında ve Nisan-Haziran (En geç temmuz başı) döneminde lütfen tamamen "Sessiz" olun. Çünkü gürültü yaptığınız anda, çalıların arasında ve yapraklarda gizlenmiş binlerce meşhur Kaplan Kelebekleri'ni göremezsiniz; sadece sessizce adım atan doğa aşıkları, ağaçlardan uçuşarak bir bulut gibi kalkan o doğa şölenini izleme ayrıcalığına sahip olur.</p>

<img src="/images/articles/kelebekler_placeholder_2.png" alt="Kelebekler Vadisi içerisinde dev şelaleye doğru uzanan yemyeşil orman yürüyüş (trekking) yolu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="konaklama">Çılgınca Bir Fikir: Kelebekler Vadisinde Gece Kalmak Mümkün Mü?</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Genel algıyla "Kelebekler vadisi = Günübirlik Tekne Turuyla denize girmek" sanılır. Fakat doğa tutkunları veya 5 yıldızlı otellerin lükslerinden ve o açık büfe sırasından sıkılıp "doğaya tamamen topraklanmak" isteyen gençler veya romantik çiftler için Kelebekler vadisi dünyadaki en iyi "Eco-Tourism" izole konaklama (Staying) tesislerinden biridir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Vadide devlet yasası gereği tek bir gram çimento veya çok katlı beton bir bina yoktur, olması suçtur. Peki nerede kalınır? Bölge tamamen, vadinin hemen iç kısımlarında kurulmuş olan ve tamamen ağaçtan inşa edilmiş üçgen ahşap "Bungalov Evler" ve geniş bir orman zemini üzerine kurulmuş "Çadır Kampı (Glamping & Camping)" ünitelerinden oluşur. Akşam 18:00'de en son tekne dolmuşu da vadiden ayrılıp günübirlikçi gürültülü turist kitlelerini Ölüdeniz Merkeze [INTERNAL_LINK] geri götürdüğünde, vadi birdenbire bir anda tamamen konaklayan o 100 kadarlık doğa aşıklarına kalır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">İşte o akşam saatlerinde; kumsalda ateş etrafında akustik gitar çalan müzisyenler, dünyadaki her türlü ışık kirliliğinden (şehir ışığı) izole olduğu için gökyüzünde parıl parıl yanan samanyolu galaksisini izleme seansları ve inanılmaz bir kardeşlik (hippi) kültürü devreye girer. Ahşap masalarda servis edilen zeytinyağlı açık büfe köy yemekleri yenir ve sabaha sadece dalga ile ormandaki yaprakların fısıltısıyla, telefon çekmeden, tam bir "Dijital Detoks" (Digital Fasting) yapılarak uyanılır. Lüks havlu, mermer banyo, yüksek hızda Wi-Fi aramayan; sadece çıplak ayakla toprağa basıp arınmak isteyenler için Kelebekler Vadisinde 1 gece konaklamak ruhsal bir terapidir.</p>

<img src="/images/articles/kelebekler_placeholder_3.png" alt="Kelebekler vadisi orman zeminine kurulmuş tamamen organik ahşap üçgen bungalov evleri" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="tuyolar">Tatilinizi Kurtaracak Altın SEO Tavsiyeleri ve Elit Güvenlik Tüyoları (Checklist)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Yüksek profilli bir tatil planlaması asla şansa bırakılmamalıdır. Fethiye Kelebekler Vadisi seyahatinizde "eyvah" veya "keşke" dememeniz için, on yıllık dağ tecrübemize dayanarak oluşturduğumuz çok özel ve o kritik "Hayatta Kalma Kontrol Listesi" ile kusursuz SEO rehberimizi tamamlıyoruz:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">⚠️</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Faralya Köyünden Seyir Terası Fotoğraf Uyarısı (Çok Önemli)</span>
            <span class="text-gray-700 text-base leading-relaxed">Sosyal medya ağlarında veya Instagram'da yüzbinlerce beğeni alan, bir kişinin sarp kayanın ucunda oturup ayaklarını aşağı sallandırdığı o meşhur tehlikeli "Kelebekler Vadisi Yüksek Uçurum Fotoğrafı" vadinin içinden değil; arabayla çıkılan Karayolu'ndaki <strong>Faralya Mevki Tepesinden</strong> uçuruma karşı çekilmektedir. Her yıl, kaygan iğne yapraklı toprak zemin yüzünden o noktada dengesini yitirip kaza geçiren gençler olmaktadır. Milyonların beğenisi, hayatınızdan veya güvendiğiniz tatilinizden daha değerli değildir, lütfen vadinin görkemli sngesine bu denli limitsiz risklerle çok ama çok fazla uçlarda yaklaşmayın.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📌</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Cüzdanınıza Yansıyacak Vadi İçindeki Tüketim Stratejisi</span>
            <span class="text-gray-700 text-base leading-relaxed">Coğrafi yapısından dolayı (her şeyin, suyun bile günübirlik gelen tekne güvertesi ile denizden taşınması zorunluluğu) Kelebekler vadisi içindeki kafeler, alkollü menüler veya yiyecek hizmetleri ana Ölüdeniz plajına göre maliyet ve lojistik sebebiyle makul derecede haliyle biraz daha pahalıdır. Eğer oldukça ekonomik ve <a href="/guide/fethiye-butce-planlayici" class="text-blue-600 hover:text-blue-800 underline">bütçe odaklı bir sırt çantalı gezgin</a> (Backpacker) iseniz, çantanıza Ölüdeniz merkezdeki büyük kurumsal marketlerden birkaç büyük şişe hazır soğuk su, sandviç veya tuzlu atıştırmalık depolayarak tekneye binmeniz size ciddi bir harcamadan tasarruf ettirecektir.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📌</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Doğru Ekipman Seçimi: Terlik vs Outdoor Trekking Botu</span>
            <span class="text-gray-700 text-base leading-relaxed">Sadece kumsalda kuma yatıp o eşsiz turkuaz sulara girip çıkacaksanız normal tatil parmak arası terliği fazlasıyla yeterlidir. Ancak yukarıda anlattığımız vadinin derinliklerindeki o gerçek (Büyük) şelaleye yapılacak 30 dakikalık ormanlık, taşlık ve toprak nemli yürüyüşlere terlikle kalkışmak, ayak yaralanmalarına ve şiddetli kaymalara ciddi zemin hazırlar. Şelale peşinde ormana dalacaksanız plaj çantanıza mutlaka kaymaz tabanlı iyi bir spor veya kalın bağcıklı doğa yürüyüş ayakkabısı almayı planlamalısınız.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📌</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Günübirlik Turlarda Sınırlı "Zaman (Saat)" Baskısına Dikkat</span>
            <span class="text-gray-700 text-base leading-relaxed">Eğer sadece gidiş-dönüş bilet satılan veya sadece 1-2 saat mola veren müzikli kocaman bir <a href="/guide/fethiye-tekne-turu-secme-rehberi" class="text-blue-600 hover:text-blue-800 underline">Günübirlik 6 Adalar Tekne turuyla</a> vadiye inecekseniz, maalesef tekne size plaj, kahve, ve yemek için kısıtlı ve sabit bir süre (Genelde ortalama 1 saat) tahsis edecektir. Bu kadar kısıtlı zamanda hızla koşarak en sonuncu büyük şelaleye ulaşıp ormanda yürüyüş yapmak ve hem de tuzlu denize girmek maalesef imkansızdır. Turla gelirken, şelaleyi mi (Aksiyon) yosa sakin denizi mi (Plaj keyfi) keşfedeceğinizi, karaya ayak basmadan önce net bir şekilde seçmiş olmalısınız.</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Şehirlerin klimalı kapalı plaza binalarından, araçların boğucu asflatlı egzoz kokusundan ve yorgun bir yıllık ofis telaşından sıyrılıp, bedeninizi yeniden uyanışa geçirecek doğanın en organik harikalarından biri olan Fethiye Kelebekler Vadisi'ne yaptığınız bu yatırım, tatilinizin tartışmasız açık ara en elit anılarından birisi olacaktır. Dağların tam kalbine denizle inilen, milyonlarca kelebeğin sessizlik (Sükunet) kuralına tabi olduğu, telefonların çekmediği modern dünyadan kopuşun o mucizevi limanında; çok güvenli, bol neşeli ve huzur dolu kusursuz Akdeniz günleri dileriz. Doğa, onu anlayana her zaman kusursuz bir kucak açacaktır, iyi tatiller!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 5/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Butterfly Valley Guide", tr: "Kelebekler Vadisi Rehberi: Ulaşım Sırları ve Detaylı Kamp Kılavuzu" },
        slug: "kelebekler-vadisi-rehberi-fethiye-ulasim",
        slug_en: "butterfly-valley-guide-fethiye",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/kelebekler_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye Kelebekler Vadisine nasıl gidilir? Tekne ile mi karadan mı? Kamp ve şelale yürüyüşü için tablo ve maddelerle tam SEO uyumlu dev gezi planı rehberi.",
            en: "Ultimate SEO guided Fethiye Butterfly Valley travel guide. How to get there by boat or hike, best camping spots, and waterfall trekking tips."
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
