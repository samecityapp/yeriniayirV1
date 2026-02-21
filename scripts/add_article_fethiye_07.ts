import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye'de Gün Batımı İzlenecek En İyi 5 Nokta: Romantik ve Epik Bir Rehber</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Yaz tatilinin ritmi sadece sabahın o yakıcı güneşi ve deniz tuzuyla değil; as asıl ruhu, akşamüstü ufuk cizgisinin kızıla boyandığı, rüzgarın serinlemeye başladığı ve gökyüzünün bir ressam paletine dönüştüğü o altın saatlerde (Golden Hour) atar. Akdeniz ve Ege'nin kusursuzca kesiştiği Fethiye kıyıları, coğrafi konumu ve güneşe dönük yamaçlarıyla tüm Türkiye'nin ve dahi Avrupa'nın en eşsiz "Gün Batımı (Sunset)" pencerelerinden biridir. Denizden yüzlerce metre yüksekteki sarp dağ zirvelerinden, denizin şırıl şırıl tamamen sıfır noktasına kadar; Fethiye'de her akşam güneş aynı denize ancak yüzlerce farklı manzarayla batar.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Özellikle balayı tatiline gelen yeni evli çiftler, fotoğraf / sinema tutkunları (Instagrammers) veya koca bir yılın devasa ofis yorgunluğunu sadece uzaklara bakarak atmak isteyen herkes için Fethiye'nin gün batımı lokasyonları kelimenin tam anlamıyla paha biçilemez bir terapidir. Ancak her gün batımı noktası aynı değildir; kimisine sadece cip safari ile ulaşılırken, kimisine elinizde bir dondurmayla yürüyerek gidebilirsiniz. Kimisi inanılmaz rüzgarlı ve yalnızken, kimisi kalabalık barların müziği eşliğindedir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Eğer Fethiye'ye gelip de akşamüstü saatlerinizi sadece otel odasında duş alarak geçiriyorsanız, bu tatilin o muhteşem doğa şöleni olan yarısını resmen ıskalıyorsunuz demektir. Fethiye'deki tatil akşamlarınızı bir Hollywood filmi sahnesine çevirecek, nerede oturup nerede tam olarak kahvenizi yudumlamanız gerektiğini anlatan, tablo ve listelerle bezenmiş bu en devasa SEO rehberiyle karşınızdayız. Hazırsanız Fethiye'nin o meşhur kızıl gökyüzüne doğru adım adım çıkıyoruz!</p>

<img src="/images/articles/sunset_placeholder_cover.png" alt="Fethiye ufuk çizgisinde denizin kızıla boyandığı muazzam gün batımı ve yelkenli silüeti" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Gün Batımı Noktaları İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#calis_plaji" class="hover:text-blue-900 transition-colors">1. Klasik ve Efsanevi: Çalış Plajı (Kordon Yürüyüşü)</a></li>
        <li><a href="#babadag_zirve" class="hover:text-blue-900 transition-colors">2. Bulutların Üzerinden: Babadağ Teleferik 1700m Seyir Terası</a></li>
        <li><a href="#sövalye_adasi" class="hover:text-blue-900 transition-colors">3. Tamamen İzole ve Seçkin: Şövalye Adası (Şimal Manzarası)</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Hangi Tepe Bana Göre? Lokasyon Karşılaştırma Tablosu</a></li>
        <li><a href="#gemiler_adasi" class="hover:text-blue-900 transition-colors">4. Antik Kalıntıların Gölgesinde: Gemiler (Aya Nikola) Koyu Dağı</a></li>
        <li><a href="#askik_tepesi" class="hover:text-blue-900 transition-colors">5. Şehrin Işıkları Aşıklar Tepesi (Fethiye Merkez)</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Golden Hour Tüyoları: Fotoğraf ve Zamanlama Tavsiyeleri (Liste)</a></li>
    </ul>
</div>

<h2 id="calis_plaji">1. En Klasik Efsane: Şövalye Adasına Karşı Çalış Plajı Uzun Sahil Kordonu</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Sıfır Mesafe, Düz Yürüyüş ve Rengarenk Bir Gökyüzü Resitali</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Yıllardır turist rehberlerinde ve uluslararası turizm forumlarında Fethiye ve gün batımı kelimeleri yan yana geldiğinde, haritada işaretlenen ilk kırmızı nota kesinlikle ve her zaman <strong>Çalış Plajıdır</strong>. <a href="/guide/fethiyede-nerede-kalinir-bolge-secim-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Otelinizi Çalış bölgesinden seçmişseniz</a> dünyanın en şanslı tatilcilerinden birisiniz. Fethiye merkezin hemen batısında yer alan ve kilometrelerce upuzun (tamamen dümdüz ve asla yokuşu olmayan) bir kumsala sahip olan Çalış Plajı, coğrafi olarak yüzünü tam olarak doğrudan güneşin okyanusa (denize) battığı Batı ufuk çizgisine dönmüştür.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Akşamüstü saat 19:00 sularında Çalış plajındaki o efsanevi trafiğe kapalı sahil yürüyüş yoluna inin. Etrafta sıra sıra dizilmiş çok kaliteli balık restoranları, şık kafe-barlar ve dondurmacılar göreceksiniz. Güneş tam karşımızdaki ucu açık denizden, Fethiye Körfezi'nin hemen ağzını kapatan o gizemli <strong>Şövalye Adasının</strong> karanlık silüetinin hemen arkasından batmaya başlar. Güneşin batışı sırasında koca gökyüzü önce yoğun bir parlayan sarıya, ardından turuncuya ve en sonunda tarif edilemez kırık bir kırmızılıkla mürdüm rengine bürünür.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Sadece deniz kenarına çektiğiniz o basit plastik bir sandalyede akşam yemeğinizi veya soğuk kokteylinizi yudumlarken bu yanan kızıl gökyüzünü ve önünden film karesi gibi hızla geçen beyaz yelkenlileri izlemek ömre bedeldir. Rüzgar burada serindir (Çalış bölgesinin kendine has ve rüzgar sörfü yaptıracak kadar ünlü termal esintisi vardır), terletmeden harika bir akşam yaşatır. Sessizce denize giren son turistlerin suyla dansı ve bu kızıllık, her akşam hiç sekmeden bu plajda ücretsiz bir sinema gösterisi gibi izleyicilerine sunulur.</p>

<img src="/images/articles/sunset_placeholder_1.png" alt="Çalış plajından Şövalye Adasına doğru batan devasa turuncu güneş ve kızıl gökyüzü manzarası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="babadag_zirve">2. Bulutların Tam Üzerinden: Babadağ Teleferik 1700m Seyir Terası</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Lüks, Yükseklik ve Gökyüzünde İzole Bir Adrenalin Deneyimi</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Deniz seviyesindeki düzlükler size yetmiyorsa, güneşi batan ufukla tamamen aynı hizadan göz göze gelerek izlemek istiyorsanız ve yükseklik hissi sizi büyülüyorsa, çıkacağınız yegane mabed <strong>Babadağ zirveleri</strong> olacaktır. Yakın zamanda faaliyete geçen devasa ve üstün Avrupa teknoloji harikası Babadağ Teleferik (Cable Car) ile 1700 metre ve hatta telesiyej ile 1900 metrelik zirve istasyonlarına uçarcasına süzülürsünüz.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Burası <a href="/guide/fethiye-babadag-paragliding-guide" class="text-blue-600 hover:text-blue-800 underline transition-colors">Yamaç paraşütçülerinin meşhur atlayış noktasıdır.</a> Ancak atlamayacak olsanız dahi, sadece ahşap seyir teraslarına çıkmak için bu yolculuğu deneyimlemelisiniz. 1700 metre istasyonundaki devasa uçurum kenarı restoranlarında masanıza bir duble Türk kahvesi, çay veya kaliteli şarabınızı sipariş edip ufka doğru sandalyenizi çevirin. Aşağıda tüm Fethiye, <a href="/guide/oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Ölüdeniz Mavi Lagününün o kıvrımlı muazzam haritası</a> ayaklarınızın altında adeta bir maket gibi durur. Ancak asıl şölen güneş denize değdiği an yaşanır. Bulutların üzerinden veya bazen bulutların tam içinden süzülen kızıl güneş ışıkları dağı kızıla boyar. Çok sarp ve çok rüzgarlıdır. Buradaki güneşi uğurlama ritüeli tamamen sessiz, doğanın kudretiyle yüz yüze kalınan, rüzgar uğultusu dışında ses olmayan lüks ve inanılmaz derecede premium bir andır.</p>

<img src="/images/articles/sunset_placeholder_2.png" alt="Babadağ zirvesinden 1700 metreden aşağıda Ölüdeniz Lagünü ve ufka süzülen yamaç paraşütlü gün batımı" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="karsilastirma">Doğru Seçim İçin Lokasyon Karşılaştırma Algoritması (Tablo Analizi)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">"Akşam yemeği mi, elit bir kahve mi, yoksa parti tepesi mi?" sorunuzun cevabı olan, Türkiye tatilinizi kurtaracak o muazzam seçici gün batımı rotası performans tablomuz:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Lokasyon ve Kriter</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Erişim Tipi (Ulaşım Zorluğu)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Genel Tesis / Yeme İçme Olanakları</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Kimler İçin İdealdir? (Visitor Type)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">1. Çalış Plajı</td>
        <td class="py-4 px-6 text-sm text-gray-700">Tamamen düm düz yürüyüş yolları. Araç veya efor asla gerektirmez. Pusetle çok uygundur.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yüzlerce pub, elit sahil balıkçısı, ekonomik esnaf kafesi ve dev uzun dondurmacılar.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Akşam yemeğini ucuza, romantik ve denize sıfır deniz sesi eşliğinde yiyen <a href="/guide/fethiye-butce-planlayici" class="text-blue-600 hover:text-blue-800 underline">bütçe koruyan aileler</a>.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">2. Babadağ Zirvesi (1700m)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Sadece merkezden kalkan dağ teleferiğiyle (ücretli) çıkılır. Yükseklik korkusu olanlara asla önerilmez.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Son derece kaliteli "Fine-Dining" şık konseptli, lüks uluslararası mutfak ve dev şarap kavı.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Balayı Çiftleri (Honeymooners), hayatlarında o çok özel bir olgu arayan lüks deneyimciler.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">3. Şövalye Adası</td>
        <td class="py-4 px-6 text-sm text-gray-700">Fethiye marinadan her saat başı binen ücretli deniz tekne motoru servisi (Water Taxi) ile 15dk sürer.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Adada dev tesisler yoktur, birkaç özel elit butik restoran/otel hizmeti ile şarap terasları sükunetlidir.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Gizlilik ve sessizlik arayan kitleler, kalabalıktan hiç haz etmeyen yalnız veya yorgun romantik kaçaklar.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">4. Aşıklar Tepesi (Kese)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Fethiye merkez çarşı arkasından kısa ama biraz yoğun bir merdiven yokuşu araba ile toprak sürüşüdür.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Bazı çay bahçeleri olmakla birlikte, genelde kendi kahveni termosla aldığın halka açık çok doğal bir seyir kayalığıdır.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yolda yürürken "şehrin ışıklarına yukarıdan bakalım" diyen gençler, spontane çok ucuz gezginler (Backpackerlar).</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="sövalye_adasi">3. Tamamen İzole ve Seçkin (Exclusive): Şövalye Adası (Şimal) Sükuneti</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye körfezinin o incecik boğaz ağzını bir tıkaç gibi kapatan, üzerinde karayolu, hiçbir araba ve asfalt olmayan, ince ip gibi uzayan tam efsanevi o kara parçasıdır <strong>Şövalye Adası</strong>. Limandan bindiğiniz o küçük, yerel deniz taksileri (Water Taxi) sizi yaklaşık on dakikalık ufak mavi bir dalga yolculuğuyla adanın iskelelerine ücretsiz veya cüzi miktarla atar. Ön cephesi Fethiye şehrinin (marina) gece ışıklarına bakarken, adanın tam arka yüzü sonu görünmeyen açık Akdeniz ve Rodos güzergahıdır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Kalabalıklardan nefret eden, araç kornası veya dev restoranların çatal kaşık seslerinden bunalmış ve <strong>%100 sessizlik (Isolation)</strong> talep eden son derece elit tatilcilerimiz için adanın arka tarafında kalan nezih restoranların ahşap oymalı terasları bir cennettir. Ayaklarınızın altında denizin kayalara o yumuşak dalga vuruş sesi varken, güneş hemen karşınızdaki bomboş tuzlu denizin ardında usulca sönerken sipariş vereceğiniz sızma zeytinyağlı taze o Ege ahtapotu, bir insanın hayatta kendisine verebileceği inanılmaz derecede nadide en güzel lüks hediyelerden biridir.</p>

<img src="/images/articles/sunset_placeholder_3.png" alt="Sessiz ve araç trafiğine kapalı Şövalye Adasının teraslarından denize vuran son altın ışık yansımaları" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="gemiler_adasi">4. Antik Roma Kalıntılarının Tarihi Gölgesinde: Gemiler Koyu (Aya Nikola)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Tarih ile gizemi ve doğayı bir yudumda içmek isteyen ruhlar için rotamız Fethiye yarımadasının hemen ormanlık arka tarafına, <a href="/guide/kelebekler-vadisi-rehberi-fethiye-ulasim" class="text-blue-600 hover:text-blue-800 underline transition-colors">Kaya Köy (Ghost Town) yokuşundan</a> biraz aşağıda dev virajlarla süzülen <strong>Gemiler Koyu'dur (Gemile / St. Nicholas Bay).</strong> Gündüz teknelerin yoğunlukla yanaştığı bu sahil orman koyu, akşam sularında kitleler döndüğünde sadece size ve kuşlara kalır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Tam Karşınızdaki dev kayalık ada, eski dönem korsanların ve erken Bizans kiliselerinin (St. Nicholas) yüzlerce yıllık yıkık, taştan kalıntılarıyla ve çok gizli tünellerle donatılmıştır. Sahildeki devasa sığla ve çam ağaçlarının dibindeki ufak taşlık kumsala havlunuzu atın. Güneş o terk edilmiş tarihi adanın arkasından inanılmaz bir gölge şovu ve silüet yaparak gizemle batar. Sanki binlerce yıl öncesinde bir korsan rotasında denizi süzüyormuşsunuz o çok güçlü hissi verir. Bu tepe ve koy, fotoğraf (Silhouette Photography) tutkunları için tartışmasız altın değerindeki yegane vuruş noktasıdır.</p>

<h2 id="askik_tepesi">5. Şehrin Gündelik Işıkları (City View): Fethiye Merkez Aşıklar Tepesi (Kese Rampa)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Hep doğaya ve ıssızlığa veya deniz dalgasına baktık, peki ya yavaş yavaş ve usulca aydınlanan çok güzel bir şehir dokusunun ışıklarına bakarak batan güneşi hissetmeye ne dersiniz? Fethiye merkez çarşının, tarihi Fethiye Kalesi kalıntılarının hemen birkaç yüz metre arkasında yükselen ve halk arasında <strong>Aşıklar Tepesi (Ya da Kese Tepesi)</strong> olarak bilinen büyük panaromik bir rampa vardır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Buraya ulaşım çarşıdan çok kuvvetli bir rampa çıkışıyla veya aracınızla mümkündür. Zirvesinde dev tesislere yer yoktur; genelde açık tepedir. Aracınızı park edip (veya kamp sandalyenizi kurup) tepeden aşağıya derin bir nefesle baktığınızda; Fethiye Körfezinin dev ovalığı, marinadaki teknelerin küçücük bir kibrit kutusunu andıran milyonlarca lüks ışığı (Marina Lights), ve tepenin ardından süzülen kızıllık... Çarşıdan aldığınız taze bir simit eşliğinde sıcak termostan içilen dev bir akşam çayı ile bu lokasyon; lüks değil, sıcak bir Akdeniz ilçesindeki 'Yerel Hayata (Local Vibe)' en saf şekilde dokunup huzur bulmak isteyenler için muazzamdır.</p>

<h2 id="tuyolar">En Doğru Poza Ulaşmak İçin Hayat Kurtaran SEO "Golden Hour" Tüyoları</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">O çok değerli anı zehir zemberek bir strese döndürmemek ve dünyanın öbür ucundan yorgun argın geldiğinizde doğru noktada, mükemmel saniyede olmak için size özel "Survivor" kontrol listemizle planları kapatıyoruz:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">⏰</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Dakiklik Kritiği (Zamanlama Hatası - Olanı Kaçırmayın)</span>
            <span class="text-gray-700 text-base leading-relaxed">Özellikle Babadağ Seyir terasları gibi yüksek noktalara <a href="/guide/fethiye-butce-planlayici" class="text-blue-600 hover:text-blue-800 underline">kendi kiralık aracınızla</a> çıkacaksanız ve telefonunuzdaki hava durumu programı 'Güneş 20:05'te batacak' şeklinde uyarı veriyorsa, bölgedeki dev dağların coğrafi yapısı (zirveler) nedeniyle güneş o net asıl ışığını 19:40'larda kaybetmeye (ufkun ardına girmeye) çoktan başlamış olur. Tatilci hatası yapıp son 5 dakika kala tepeye telaşla varmaktansa; planı her zaman gün batımından (Sunset) en az ama en az "1 Tam Saat Önce" (Örn: 19:00'da) masanıza veya tepenize çoktan yerleşmiş, kahvesini yudumluyor şekilde dev rahat bir marjda kurun.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">❄️</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Rüzgar (Ürpertici Termal Isı Düşmesi) Uyarısı (The Sunset Chill)</span>
            <span class="text-gray-700 text-base leading-relaxed">Güzel ve sıcak ülkemiz Türkiye'de, Temmuz ayında fırın gibi bir sıcağında plajdan (Kumdan) üstünüzde ter varken, şort/askılıyla akşam 19:30 sularında yavaş yavaş yükselirseniz; güneş ufka değdiği saniyede aniden çıkan o Fethiye'nin meşhur akşam Batı meltemi terinizi saniyeler içinde buz gibi kurutur. Hele bir de denize çıkmış veya Babadağ gibi 1700 metrelik zirveye tırmanmışsanız dişleriniz takırdamaya %100 oranında başlar. Sırt çantasının dibindeki ince bir hırka veya yazlık omuz şalı, o romantik kızıl anı hastalanmadan titremeksizin "Lüks İçerisinde" bitirmenizin dünyadaki en ucuz ama en dev tek kuralıdır.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📸</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Rezervasyon Stresi (Masa Savaşları)</span>
            <span class="text-gray-700 text-base leading-relaxed">Özellikle <a href="/guide/fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota" class="text-blue-600 hover:text-blue-800 underline">Avrupadan ve gurbetten gelen misafirlerimizin</a> tatil yaptığı Çalış plajındaki ön sıra deniz dibi masalar veya Babadağ Cam terasındaki uçurum (Infinity Edge) restoran masaları, tatil şirketlerince ve zeki müşteriler tarafından aylar öncesinden ayırtılır (Booked). "Nasıl olsa bir sahil, gidip otururuz" derseniz, gün batımı saati geldiğinde restoranın en arka karanlık tuvalet / kolon köşesinde, masaların arasından çırpınarak ufka bakmaya mahvolsanız. Premium lokasyonlardaki (Şövalye, Babadağ) akşam yemekleri için sabah uyandığınızda lobiden veya internetten kesinlikle ve acımasızca "Front Row (Ön Cam Kenarı)" isteğiyle masa ayırtın!</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Dünya üzerindeki yüzlerce monoton, yağmurlu ve o gri büyük şehrin binaları ve betonu arasında tüm bir yıl boğulup yorulduktan sonra; Fethiye'de önünüze açılıp size inanılmaz gülücükler sunan sonsuz kızıl ufka karşı geçirilen o kısa yarım saatlik sessizlik ritüeli, aslında sadece basit bir doğa olayı değil, beyninizin ve ruhunuzun tüm toksinlerden de şifa ile arındığı eşsiz bir meditasyondur. Çalış Plajında dalga sesi dinlemek ile Babadağ'da bulutlara hükmetmek arasında sadece ama sadece siz, sevdanız ve kişisel ruhsal lüks beklentiniz vardır. Elinizde taptaze sıcacık bir çay eşliğinde batan dev güneşi uğurlarken, yarının Akdeniz'de dünden çok daha mucizevi olacağına inancınız eksik olmasın. Sevgi dolu, renkli, fotoğraflık ufkular!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 7/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Best 5 Sunset Spots in Fethiye", tr: "Fethiye'de Gün Batımı İzlenecek En İyi 5 Nokta (Efsanevi Rehber)" },
        slug: "fethiyede-en-iyi-gun-batimi-noktalari-sunset",
        slug_en: "best-sunset-viewpoints-spots-fethiye",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/sunset_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye'de gün batımı nerede izlenir? Çalış plajı, Babadağ 1700m seyir terası, Şövalye adası ve Gemiler koyu için tablolu tam SEO akşamüstü romantik rehberi.",
            en: "Where to watch the best sunset in Fethiye? Detailed SEO guide for Calis beach, Babadag 1700m, and Sovalye island sunsets with tables and tips."
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
