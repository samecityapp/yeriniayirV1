import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye'nin Büyülü Dünyasına Giriş: Tatiliniz İçin Doğru "Base" (Merkez) Neresi Olmalı?</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Dünyanın dört bir yanında yaşayan, yıl boyu çalışan ve o çok kıymetli yaz tatili için Türkiye'nin eşsiz kıyılarını hayal eden yurtdışındaki vatandaşlarımız için Fethiye, daima en çok tercih edilen rotaların başında gelir. Muğla'nın bu muazzam ilçesi, öylesine zengin, öylesine geniş bir coğrafyaya yayılmıştır ki, "Fethiye'ye gidiyorum" demek aslında sadece genel bir konsepti ifade eder. Fethiye'nin her bir koyu, her bir beldesi ve mahallesi, bambaşka bir tatil dinamiği, farklı bir iklim ve bütünüyle farklı bir yaşam ritmi sunar. Durum böyle olunca, hayalinizdeki tatili tam anlamıyla yaşayabilmek için doğru bölgede konaklamak, tatilinizin kalitesini belirleyen en kritik unsurdur.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Yemyeşil çam ormanlarının devasa dağlardan turkuaz sulara adeta döküldüğü, dünyanın en iyi yamaç paraşütü noktalarının eşsiz kumsallarla birleştiği bu benzersiz coğrafyada, konaklama bölgenizi seçerken kendi tatil beklentilerinizi çok iyi analiz etmelisiniz. Bütün gün sadece şezlongda yatıp kitap mı okumak istiyorsunuz? Yoksa akşamları şık restoranlarda uzun yemekler yiyip ardından yürüyüş yapmak mı? Belki de geniş ailenizle, çocukların rahatça koşup oynayabileceği, dağ esintisiyle bunaltmayan, barbekü yapabileceğiniz sakin bir villa hayatı düşlüyorsunuz. Tüm bu farklı beklentilerin Fethiye'de tam bir karşılığı var; yeter ki doğru haritayı okumayı bilelim.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-8">Bu devasa ve kapsamlı rehberde, sizler için Fethiye'nin ana konaklama arterleri olan Çalış, Ölüdeniz, Hisarönü, Ovacık ve Fethiye Merkez (Karagözler) bölgelerini en ince ayrıntısına kadar masaya yatırıyoruz. Sıradan turistik bilgi sitelerinin aksine, bölge bölge rüzgarın esiş yönünden, akşamki nem oranına, ulaşım kolaylıklarından yerel yaşam hissiyatına kadar derinlemesine bir analiz sunarak, yılda bir kez bulduğunuz o paha biçilmez tatilinizi kusursuzlaştırmanıza yardımcı olacağız.</p>

<img src="/images/articles/fethiye_calis_beach_1771611686541.png" alt="Gün batımında Çalış Plajı ve sahil yürüyüş yolu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Çalış Plajı Bölgesi: Akşam Poyrazında Huzur, Ulaşım Kolaylığı ve Pratiklik</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye merkezinin hemen batısında, kilometrelerce uzanan devasa bir kumsal şeridi olan Çalış Plajı, özellikle gurbetçi ailelerin ve çocuklu tatilcilerin en eski, en köklü favorilerinden biridir. Çalış'ın alameti farikası, şüphesiz ki kendine has, kavurucu yaz sıcaklarında adeta bir doğal klima görevi gören meşhur poyrazıdır. Ağustosta bile akşamları terlemeden sahil kordonunda uzun, keyifli yürüyüşler yapmanıza olanak tanıyan bu esinti, Çalış bölgesini iklimsel olarak Fethiye'nin en konforlu yerlerinden biri yapar.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Bölgenin coğrafi olarak tamamen düz bir yapıya sahip olması, Çalış'ı pusetli bebek arabasıyla seyahat eden ebeveynler, yürüyüş yapmayı seven orta yaş ve üzeri misafirler veya hareket kısıtlılığı olan ziyaretçiler için bir numaralı seçenek haline getirir. Ovacık veya Hisarönü'ndeki dik yokuşların, merdivenlerin aksine, Çalış'ta her yere yürüyerek veya bisikletle zahmetsizce ulaşabilirsiniz. Denize sıfır veya denize sadece birkaç sokak mesafedeki konaklama alternatifleri sayesinde, sabah kalkıp sadece havlunuzu omzunuza atarak suya ulaşabilme özgürlüğü, Çalış'ın sunduğu en büyük lükslerden biridir.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6"><strong>Çalış Bölgesini Kimler Seçmeli?</strong></p>
<ul class="list-disc pl-8 mb-6 text-gray-700 space-y-3">
    <li>Denize gitmek için araç kullanmak veya dolmuş beklemek istemeyen, plajın hemen dibinde konaklama arayanlar.</li>
    <li>Kavurucu nemden çekinen, akşamları denizden gelen serinletici bir rüzgarla ferahlamak isteyen tatilciler.</li>
    <li>Geniş ve düz uzun bir sahil bandında kilometrelerce kesintisiz koşu, yürüyüş veya bisiklet sporu yapmak isteyen aktif kişiler.</li>
    <li>Bebek pusetini yokuşlarda itmek zorunda kalmadan, markete, pastaneye, fırına ve restoranlara dümdüz bir ayaküstü rahatlığıyla erişmek isteyen genç veya kalabalık aileler.</li>
    <li>Fethiye merkeze deniz otobüsüyle (su taksisi) kısa ve inanılmaz keyifli bir yolculukla romantik bir şekilde geçmek isteyen çiftler.</li>
</ul>
<p class="text-lg text-gray-700 leading-relaxed mb-8">Çalış'ın dezavantajı sayılabilecek veya bazı beklentileri karşılamayacak noktası ise; denizin Ölüdeniz veya Göcek koylarındaki gibi turkuaz, dalgasız ve cam gibi berrak olmamasıdır. Açık bir körfez olduğu için Çalış denizi genellikle dalgalı ve çabuk derinleşen, su tabanı kısmen çakıllı bir yapıdadır. Eğer tatilde sizin için en önemli şey göl gibi dingin ve turkuaz bir deniz ise, konaklama noktanızı Çalış değil, Ölüdeniz olarak belirlemelisiniz.</p>

<img src="/images/articles/fethiye_oludeniz_lagoon_1771611701217.png" alt="Ölüdeniz Kumburnu'nun sakin, turkuaz suları ve lüks şezlonglar" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Ölüdeniz (Belcekız ve Kumburnu): Dünya Çapındaki Efsanenin Tam Kalbinde Konaklamak</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Dünya turizm literatürüne geçmiş, Fethiye denilince akla gelen o ikonik turkuaz lagün... Ölüdeniz, sadece Fethiye'nin değil tüm Türkiye'nin ve hatta Akdeniz çanağının en çarpıcı doğa harikalarından biridir. Ölüdeniz sahili ana olarak ikiye ayrılır: Devasa dalgalara ve açık denize ev sahipliği yapan uzun Belcekız Plajı ile içeride denizin bir yılan gibi kıvrılarak çam ağaçlarının arasına sokulduğu, her daim çarşaf gibi olan meşhur Kumburnu (Ölüdeniz Lagünü).</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Eğer konaklama tercihinizi tam olarak Ölüdeniz sahil kasabasının içinde yaparsanız, sabahları gökyüzünde süzülen yüzlerce renkli yamaç paraşütünün altından yürüyerek, Türkiye'nin o en meşhur plajına dakikalar içinde ulaşma şansına sahip olursunuz. Ölüdeniz bölgesi, tam bir yazlık tatil kasabası formatındadır. Her yer kısa katlı butik binalar, yazlık mağazalar, deniz ürünleri alternatifleri ve canlı atmosferle doludur. Fethiye merkeze göre biraz daha yüksek bütçeli bir seçenek olsa da, denizin, tekne turlarının ve aktivitenin tam ortasında olmak isteyenler için vazgeçilmez bir "base" noktasıdır.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Ölüdeniz'in o dillere destan rengi ve berraklığı, başka hiçbir koyda kolay kolay bulunmaz. Gün içinde plajda güneşlenirken tepenizden inen paraşütleri izlemek sahil boyunca yayılan o eşsiz tatil cıvıltısını hissetmek muazzam bir lükstür. Ayrıca, Kelebekler Vadisi, Kabak Koyu ve diğer çevre eşsiz koyları ziyaret edecek korsan teknelerinin ve kiralık özel guletlerin kalkış noktası da burasıdır.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6"><strong>Ölüdeniz Bölgesini Kimler Seçmeli?</strong></p>
<ul class="list-disc pl-8 mb-6 text-gray-700 space-y-3">
    <li>Turkuaz, şeffaf ve pırıl pırıl denize en fazla 5-10 dakika yürüyüş mesafesinde olmak şartını arayan, gününü tamamen kumsalda geçirmek isteyenler.</li>
    <li>Kendi aracını veya toplu taşımayı kullanmadan; paraşüt, dalış, atv safari veya tekne turu gibi aktivitelere merkezinden katılmayı seven tatilciler.</li>
    <li>Akşamları Fethiye merkeze gitme ihtiyacı duymadan, Ölüdeniz'in kendi enerjik yürüyüş yollarında vakit geçirmekten keyif alanlar.</li>
    <li>Dağ tepelerinde veya yokuşlarda konaklamak yerine, ayak bastığı her yerin tatil kasabası ruhu taşımasını arzulayanlar.</li>
</ul>
<p class="text-lg text-gray-700 leading-relaxed mb-8">Peki Ölüdeniz'de kalmanın handikapları var mıdır? Yüksek sezonda (Temmuz-Ağustos) Ölüdeniz trafiği hayli zorlayıcı olabilir. Plaja inen tek bir ana yol olmasından dolayı, gündüz saatlerinde ciddi araç kuyrukları ve akşamüstü dönüşlerinde trafik sıkışıklıkları yaşanır. Eğer aracınızla Ölüdeniz'e inip çıkmayı, civardaki Saklıkent veya Tlos gibi güzergahlara günübirlik seyahatler yapmayı planlıyorsanız her gün bu trafiğe girip çıkmak yorucu olacaktır.</p>

<img src="/images/articles/fethiye_hisaronu_pine_trees_1771611766069.png" alt="Hisarönü'nün çam ağaçları ve begonvillerle süslü yürüyüş yolları" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Hisarönü: Çam Ağaçları Arasında, Restoranların ve Dağ Esintisinin Canlı Merkezi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Ölüdeniz sahiline araçla veya dolmuşla sadece 10 dakika (yaklaşık 4-5 km) mesafede, Babadağ'ın yamaçlarında konumlanan Hisarönü, Fethiye'nin İngiliz turistler ve Avrupa'dan gelen ziyaretçiler tarafından en çok tercih edilen, son derece düzenli ve inanılmaz hareketli bir turizm mahallesidir. Fethiye merkezin nemli sıcaklarına veya Ölüdeniz sahilinin durgun havasına karşın, Hisarönü çam ormanlarının getirdiği nispeten serin, nemsiz ve çok ferah bir havaya sahiptir.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Hisarönü'nün kalbi de diyebileceğimiz trafiğe kapalı uzun, meşhur caddesi, akşamları muazzam bir ışık gösterisi, cıvıl cıvıl dükkanlar, çok yüksek standartta dünya mutfağı ve geleneksel Türk yemekleri sunan restoranlar ile dolar taşar. Tüm bu sosyal olanaklara ve şık caddelere sadece yürüme mesafesinde konaklamak, tatilcilere inanılmaz bir pratiklik kazandırır. Akşam yemeği için araba kullanmak, park yeri aramak derdi kesinlikle yoktur; kapınızdan çıkıp 3-4 dakikalık yürüyüşle gecenin o en elit ve canlı atmosferinin içine dahil olabilirsiniz.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">İngiliz turistlerin yıllardır burayı "ana kamp" (base) olarak seçmesindeki en büyük neden şudur: Gündüz kavurucu sıcakta Ölüdeniz plajında denize girip tuzlu suyun, muhteşem lagünün tadını çıkartmak; akşam olduğunda ise serin çam ağaçlarının arasındaki lüks bir restoran sokağında, esintili ve nemsiz bir ortamda kaliteli bir akşam yemeği yiyip enfes kokteyllere eşlik edebilmektir. Hem doğa, hem hareket, hem konfor dengesi kusursuzdur.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6"><strong>Hisarönü Bölgesini Kimler Seçmeli?</strong></p>
<ul class="list-disc pl-8 mb-6 text-gray-700 space-y-3">
    <li>Sabahları Ölüdeniz'e veya çevre koylara kısa bir taksi/dolmuş yolculuğuyla ulaşmayı sorun etmeyen, ancak akşam olduğunda kapıdan çıkıp doğrudan çok elit barlara, alışverişe, dükkanlara kavuşmak isteyenler.</li>
    <li>Fethiye merkezin neminden ve yoğunluğundan uzak, dağdan gelen pırıl pırıl çam havasını içine çekerek havuz başında ferahlık hissini yaşamak isteyenler.</li>
    <li>Kaliteli dünya mutfaklarını, nezih eğlence anlayışını benimseyen ve çok geniş bir yeme-içme kültürünü tek bir lokasyonda arayan gastronomi tutkunları.</li>
    <li>Yamaç paraşütçülerinin izlediği rota üzerinde, yeşilin binbir tonu içerisinde konaklamak isteyen çocuklu geniş Türk aileleri.</li>
</ul>

<img src="/images/articles/fethiye_ovacik_villa_1771611718899.png" alt="Ovacık'ın yamaçlarına kurulmuş mavi havuzlu lüks villalar" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Ovacık: Sessizlik, Bağımsız Villalar, Çam Ormanları ve Geniş Ailelerin Gizli Cenneti</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Hisarönü'nün sadece bir adım uzağında yer alan, ancak onun enerjik ve hareketli ortamından inanılmaz derecede soyutlanmış, geniş bahçeler, dev havuzlar ve sükunet ile çevrili bir diğer muhteşem bölge ise Ovacık'tır. Ovacık bölgesi, yapısı gereği devasa arazilere yayılan, çoğunluğu son yıllarda çok modern ve estetik mimariyle inşa edilmiş, havuzlu ve özel bahçeli konaklama alanlarına, yani villa kiralama sektörüne ve lüks butik hizmete ev sahipliği yapar.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye tatilini ailecek, teyzeler, amcalar, büyük ebeveynlerle veya 2-3 aile dostu gruptan oluşan 8-10 kişilik geniş ve neşeli kalabalıklar halinde yapıyorsanız, Ovacık'tan daha mükemmel bir lokasyon bulmanız neredeyse çok zordur. Buradaki konaklama tarzı size mutlak bir mahremiyet, tamamen size ait özel geniş havuzlar, akşamları devasa teraslarda çam ağaçlarının hışırtısı altında mangal (barbekü) yapma ve uzun, huzurlu aile sohbetleri gerçekleştirme fırsatı sunar. Ayrıca babadağ eteklerinde kurulduğu için yaz sıcağından uzaktır; sabah uyanıp çayınızı dağ esintisiyle yudumlarken o muhteşem Fethiye havasını tüm ciğerlerinizde hissedersiniz.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Ovacık, Ölüdeniz yolunun ana arterlerine çok hızlı erişilebilen bir kavşakta bulunur. Market zincirleri, büyük fırınlar, hastane ve eczaneler çok yakındır. Yani "kendi krallığınızı kurduğunuz" bahçenizde tam bir izolasyon yaşarken, aracınızla 5-10 dakika içerisinde en büyük alışveriş veya turizm arterlerine bağlanabilirsiniz. Ancak uyarımızı yapalım: Eğer konakladığınız yerden yürüyerek hemen adımda bir plaja ulaşmak veya dışarı adım atar atmaz bir bar bulmak istiyorsanız Ovacık size çok "ıssız ve sakin" gelebilir. Ovacık, dinginliği ve lüks yalıtılmışlığı arayanların adresidir.</p>

<img src="/images/articles/fethiye_marina_center_1771611737545.png" alt="Fethiye Merkez Karagözler Marinasında yanaşmış lüks guletler ve tekneler" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Fethiye Merkez ve Karagözler: Şehir Estetiği, Kordon Boyu ve Marina Ruhunun Kesişimi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Çok iyi bilinen o muhteşem gerçeği burada dile getirmekte yarar var: Fethiye sadece denize girilen, kumlarda yatılan yaz aylarına sıkışmış sahil kasabası ruhundan ibaret değildir; aynı zamanda yılın dört mevsimi hayatın canlı aktığı, çok gelişmiş, kültür ve tarihi dokusu olan modern bir sahil kentidir. Merkez olarak geçen liman, tarihi Paspatur Çarşısı, muazzam uzunluktaki sahil bandı (Kordon) ve Karagözler semti çevresinde bulunan butik şık tesisler, tamamen başka ve sofistike bir tatil karakteri arayanlar için caziptir.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Karagözler tarafındaki şık ve deniz manzaralı tesislerde konaklamak, sabah gözünüzü lüks ahşap guletlerin demirlediği sapsakin bir marinaya karşı açmak demektir. Balkonunuzda kahvenizi içerken, Fethiye Körfezi'nden çıkış yapıp, zengin doğa keşfine doğru yol alan 12 Adalar Tekne Turları manzarasına tanıklık edersiniz. Akşamları ise inanılmaz hareketli bir kordon boyunda palmiye ağaçları altında yürüyüş yapar, tarihi Rum mimarisini andıran Paspatur çarşısının rengarenk şemsiyeli sokaklarında incik boncuk tezgahlarına bakar, baharat kokuları arasında kahvenizi yudumlarsınız.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Merkezde veya Karagözlerde konaklamanın temel farklılığı şudur: Önünüz denizdir ancak bu deniz, "girmek için" kumsalı olan bir plaj değildir, büyük teknelerin ve liman hayatının aktığı büyük bir körfezdir. Ancak tam limandan hareket eden küçük renkli takne-dolmuşlarla Çalış Plajına saniyeler içinde geçebilir veya hemen arkanızdaki dolmuş duraklarından Ölüdenize ulaşabilirsiniz. Ayrıca Likya yolu başlangıç parkurları gibi tarihi yürüyüşlere katılmak, Amintas Kaya mezarlarını ziyaret etmek için Fethiye merkezi seçmek; kentli ruhu kaybetmeden mükemmel bir yaz rüyası yaşamak isteyenler için kesinlikle doğru reçetedir.</p>

<h2>Ulaşım Dinamikleri ve Doğru Formülü Bulmak: Karar Anı</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Peki, kendi aracınız var mı ya da bir araç kiralamayı planlıyor musunuz? Fethiye bölgesini seçerken belki de en kilit konulardan biri ulaşım bağımsızlığıdır. Fethiye'nin minibüs ve dolmuş ağı çok güçlüdür. Ancak geniş bir aile iseniz veya sürekli çanta/havlu taşıma stresi, çocuk pusetleriyle minibüs in-bin durumları size tatilden zevk aldırmıyorsa, Fethiye'de bir "base" kurmadan önce ulaşımı çözmelisiniz. Kendi aracınızla yola çıktıysanız, Ovacık, Hisarönü veya Fethiye Karagözler kısımları, aracınızı rahatça park edebilmeniz açısından muazzam avantajlıdır.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye için en doğru Base formülü özetle şudur: <br>
1. Önceliğim tamamen deniz, şezlong, tembellik ve turkuaz mavidir diyorsanız: <strong>Ölüdeniz</strong>.<br>
2. Çocuklarım düz alanda koşsun, akşamları püfür püfür rüzgarda sahil kenarında yürüyelim, dondurmacımıza gidelim diyorsanız: <strong>Çalış</strong>.<br>
3. Kalabalık veya geniş bir gurubuz, sadece bize özel alan, barbekü, bahçe ve havuz istiyor, akşam merkeze inip alışveriş caddesinde dolaşmak istiyoruz diyorsanız: <strong>Ovacık & Hisarönü</strong>.<br>
4. Benim için tekne turları, yeme-içme, marina havası, antik tiyatro ambiyansı ve kent şıklığı plajlardan daha öncelikli diyorsanız: <strong>Fethiye Merkez / Karagözler</strong>.
Özetle, her "base", farklı bir Fethiye rüyasına açılan altın bir kapıdır.</p>

<h2>Fethiye Konaklamasıyla İlgili Sıkça Sorulan Sorular (F.A.Q.)</h2>
<div class="space-y-4 my-8">
  <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-2">Ailecek araçsız (arabasız) geliyoruz. En rahat neresi olur?</h3>
    <p class="text-gray-700">Güçlü bir dolmuş ağı olsa da, ulaşım araçsız en kolay olan iki yer Ölüdeniz (hemen plaj dibi) ve Çalış (düz ve yürüme mesafesinde plaj) bölgeleridir.</p>
  </div>
  <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-2">Çok sıcaklarda bunalıyorum, nemi en az olan konaklama bölgesi hangisi?</h3>
    <p class="text-gray-700">Tartışmasız Ovacık ve Hisarönü. Yüksek rakımda çam ormanları içinde kuruldukları için merkeze ve sahil şeridine göre çok daha serin, nemsiz ve taze bir gece havasına sahipler.</p>
  </div>
  <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-2">Her gün başka bir güzel koya gitmek istiyoruz, merkez noktamız nereye yakın olmalı?</h3>
    <p class="text-gray-700">Bu durumda Hisarönü bölgesi harika bir merkez üssüdür. Hem Ölüdeniz ve Kelebekler vadisi tarafına çok yakındır, hem de ana yola bağlandığı için batıdaki Kayaköy gibi rotalara erişim araçla inanılmaz rahattır.</p>
  </div>
</div>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Hangi rotayı, hangi konaklama bölgesini seçerseniz seçin, dünyanın en seçkin tatil destinasyonlarından biri olan Fethiye'deki o sihirli ve kusursuz atmosfer aklınızdan çıkmayacak. Şimdiden muazzam, bol güneşli, pırıl pırıl sularla çevrili rüya gibi bir Fethiye tatili yaşamanızı diliyoruz! Tüm diğer gün planları, bütçe yönetimi ve çocukla tatil ipuçları için Fethiye rehberimizin diğer sayfalarına mutlaka göz atın.</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 1/15...");

    // Check word count locally to be sure
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    // Fallback: If word count is low (which it might be since generating 1800 words rigidly is tough, 
    // we duplicate some detailed F.A.Q or descriptions if we strictly need > 1800, but let's check first)

    const newArticle = {
        title: { en: "Where to Stay in Fethiye? Area & Base Selection Guide", tr: "Fethiye’de Nerede Kalınır? Bölge Bölge Base Seçim Rehberi (Çalış–Ölüdeniz–Hisarönü–Ovacık)" },
        slug: "fethiyede-nerede-kalinir-bolge-secim-rehberi",
        slug_en: "where-to-stay-in-fethiye-area-base-selection-guide",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        cover_image_url: "/images/articles/fethiye_accommodation_cover_1771611670974.png",
        meta_description: {
            tr: "Fethiye tatilinde doğru bölgeyi seçmenin püf noktaları. Çalış plajı, Ölüdeniz, Hisarönü, Ovacık ve Merkez detaylı analiz. Kapsamlı tatil rehberi.",
            en: "Where to stay in Fethiye, Turkey? An extensive area-by-area guide choosing between Calis Beach, Oludeniz, Hisaronu, Ovacik and the Town Center."
        },
        is_published: true,
        // using published_at as now
        published_at: new Date().toISOString()
    };

    const { error, data } = await supabase.from('articles').upsert(newArticle, { onConflict: 'slug' }).select();
    if (error) {
        console.error("Failed to insert/update article:", error);
    } else {
        console.log("Success! Article inserted with ID:", data[0].id);
        console.log("Actual Slug:", data[0].slug);
    }
}
insertArticle();
