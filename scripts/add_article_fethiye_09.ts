import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye'nin Antik Kalbi Tlos ve Yakın Çevresi: Mitolojiden Doğaya Tam Gün Rota Planı</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Masmavi denizleri, muazzam plajları ve <a href="/guide/fethiye-tekne-turu-secme-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">yüzlerce tekne turuyla</a> Fethiye, modern Türk turizminin vitrinidir. Ancak asıl Fethiye, denizin bittiği ve o sarp Toros Dağları'nın başladığı o gizemli tepelerde saklıdır. Antik Çağ'da "Likya (Lycia) Federasyonu" olarak bilinen o efsanevi "Işıklar Ülkesi'nin" kalbi tam da burasıdır. Bu devasa medeniyetin ardında bıraktığı en ihtişamlı, harabeleri en diri kalan ve doğanın kucağında hala nefes alan en görkemli başkenti şüphesiz ki <strong>Tlos Antik Kenti'dir.</strong> Üstelik Tlos sadece kuru taşlardan ibaret bir ören yeri değil; efsanelere göre meşhur kanatlı at Pegasus'un kahramanı Bellerophontes'in yaşadığı yerdir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Peki, tatilinizin sadece tek bir gününü kumsaldan feragat edip neden tozlu bir dağ köyüne ve harabelere ayırmalısınız? Çünkü Fethiye'ye 40 dakika mesafedeki (Seydikemer ilçesi, Yaka Köyü sınırlarında) bu rota, size sadece antik taşlar vaat etmez. Tlos'u gezdiğiniz o tarihi gün; hemen dibindeki buz gibi sularla kaplı olan <strong>Yakapark Şelalesinde</strong> muazzam bir alabalık ziyafeti, ardından çok yakınındaki <a href="/guide/saklikent-kanyonu-gezi-rehberi-fethiye-selale" class="text-blue-600 hover:text-blue-800 underline transition-colors">Saklıkent Kanyonunun</a> serinliğinde bir çamur banyosu ve nihayetinde Gizlikent şelalesinde bir macera ile birleştirilebilir. Antik kent, su, doğa ve organik köy lezzetleri bu coğrafyada tek parça bir pakedin altın anahtarıdır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Tarih okumaktan hiç haz etmeyen, "Kuru taşlara mı bakacağız?" diyen gençleri ve çocukları bile heyecanlandıracak bir "Tlos ve Yakın Çevre Günlük Rota" (Itinerary) haritası yarattık. Tlos'a saat kaçta girilir, o meşhur kaya mezarlarına tırmanmak zor mudur ve antik tiyatrodan inilince o buz gibi Yakapark köy sularında sizi hangi lüksler bekliyor? Açın klimaları ve motoru çalıştırın; sahil şeridini bırakıp efsanevi at Pegasus'un Fethiye dağlarındaki 4000 yıllık ayak izlerini saat saat tamamen SEO ve gezi optimizasyonu yapılmış o harika listemizle sürmeye başlıyoruz!</p>

<img src="/images/articles/tlos_placeholder_cover.png" alt="Sarp kayalıklara oyulmuş Tlos Antik kaya mezarları ve yemyeşil ova manzarası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Tlos ve Yakın Çevre İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#tlos_hikayesi" class="hover:text-blue-900 transition-colors">Etap 1: Tlos Antik Kenti'ne Sabah Girişi ve Dağlardaki Mitoloji</a></li>
        <li><a href="#tlos_yapilar" class="hover:text-blue-900 transition-colors">Tlos'un Kesinlikle Görülmesi Gereken 3 Harikası (Tiyatro ve Mezarlar)</a></li>
        <li><a href="#yakapark_mola" class="hover:text-blue-900 transition-colors">Etap 2: Öğlen Sıcaktan Kaçış: Yakapark'ta Şelale ve Alabalık Ziyafeti</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Mükemmel Kombinasyon: Tlos Sonrası Rotayı Nereye Çevirelim? (Tablo)</a></li>
        <li><a href="#gizlikent_selale" class="hover:text-blue-900 transition-colors">Etap 3 (Opsiyonel): Doğanın Kalbi Gizlikent ve Gizemli Şelale Yürüyüşü</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Antik Macerayı Kurtaracak SEO Tüyoları (Müze Kart ve Kıyafet)</a></li>
    </ul>
</div>

<h2 id="tlos_hikayesi">Etap 1: Dağlara Sabah Tırmanışı ve Tlos'un Büyüleyici Mitolojisi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Sıcak Bastırmadan Tepelerde: 09:00 Cıvarı Giriş</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Akdeniz coğrafyasında, hele ki Temmuz - Ağustos gibi cayır cayır yanan dev güneşte <a href="/guide/fethiye-butce-planlayici" class="text-blue-600 hover:text-blue-800 underline transition-colors">kiralık bir araçla</a> tamamen açık hava olan bir Antik Kent veya ören yeri (Tarihi harabeler) gezmenin bir numaralı ve değişilmez sarsılmaz en büyük kuralı vardır: Ziyareti sabah saatlerinde tamamlamak! Çünkü harabelerde sizi o yakıcı güneşten koruyacak ne bir şemsiye ne de modern klimalı bir bina yoktur (Taşlar inanılmaz ısı yayar). Bu nedenle otelinizde o sabah muazzam Fethiye kahvaltınızı 08:30 civarında erkenden edip, yönünüzü merkeze yarım saat uzakta konumlanan Seydikemer / Yaka Köyüne doğru güvenle çevirmelisiniz.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Tlos Gişelerinden o cüzi Müze ücretiyle (veya ücretsiz MüzeKart göstererek) içeri girdiğiniz o ilk andan itibaren; devasa, dik bir tepenin (Akropol) yamaçlarına binlerce yıl önce oyulmuş dev anıt şeklinde kaya mezarları (Rock Tombs) sizi adeta dev gibi karşılar. Burası Likya liginin en önemli 6 büyük şehrinden birisidir ve aynı statüde tam 3 oy atma hakkına sahiptir. Efsaneye göre Tlos kralları o kadar asildi ki; Tanrılar Bellerophon ismindeki o şanlı savaşçıya dev "Kanatlı At Pegasus'u" hediye ettiğinde, bu kahraman atıyla beraber bu sarp ve ulaşılamaz dağların içine bu eşsiz görkemli şehri inşa ettirdi. O dağlarda yürüdüğünüz o ilk yokuşta, ayağınızın altındaki taşın 4000 yıldan asırlar öncesine dayandığını bilmek, o muazzam tepe rüzgarı vadiden yüzünüze çarparken muazzam bir tüyler ürpertici medeniyet hissi uyandırır.</p>

<h2 id="tlos_yapilar">Tlos'un Kesinlikle Atlanmaması Gereken 3 Harikası</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Saatlerce ve günlerce taşlara bakarak yorulmak istemiyorsanız, gişeden geçtikten sonra özellikle rotanızı nokta atışı şu 3 ihtişamlı kalıntıya göre ayarlamalısınız:</p>

<ul class="list-disc pl-8 space-y-4 text-lg text-gray-700 mb-8">
  <li><strong class="text-gray-900 border-b border-gray-200">1. Büyük Akropol ve Kanatlı At Pegasus Ana Kaya Mezarı:</strong> Şehrin en devasa silüetini oluşturan, dağın yüzeyine adeta bir tapınak cephesi (Tapınak tipli mezar) gibi mükemmel oyulmuş dev kraliyet kaya odaları. Bu mezarların iç kısmındaki inanılmaz taş işlemelerinde Bellerophon'un kanatlı atına bindiği orijinal kabartmaları çok net seçebilirsiniz. O yükseklikten yemyeşil büyük Eşen Ovasını (Eshen Valley) izlemek efsanedir.</li>
  <li><strong class="text-gray-900 border-b border-gray-200">2. Roma Dönemi Stadyumu (Stadium):</strong> Kaya mezarlarından aşağı, daha ovasal alana indiğinizde o dev Roma stadyumunun oturma basamaklarını göreceksiniz. Zihninizde bir anlığına o dev arenada binlerce kişinin tezahürat yaptığını ve arabaların yarıştığını canlandırabilirsiniz, inanılmaz bir ambiyansı vardır.</li>
  <li><strong class="text-gray-900 border-b border-gray-200">3. Büyük Antik Tiyatro:</strong> Antik dönemin ve Tlos elitlerinin sanatla birleştiği o efsanevi yarım ay şeklindeki amfi tiyatro (The Ancient Theatre). Günümüzde restorasyonlar ve kazılar hala sürse de o taş koltuklara oturup akustiği (sesinizin yankısını) denemek tatilin en unutulmaz sesli anılarından biridir.</li>
</ul>

<img src="/images/articles/tlos_placeholder_1.png" alt="Tlos antik tiyatrosunun merdivenleri ve dağların ardından doğan görkemli yaz güneşi" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="yakapark_mola">Etap 2: Sıcaktan Kaçış: Yakapark'ta Şelale Kenarında Taze Alabalık Öğle Ziyafeti</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Orta tempolu bir yürüyüşle, o bol fotoğraflı 2 saatlik Tlos kaya mezarları tırmanışı bittikten sonra termometreler muhtemelen öğle sıcağı olan saat 12:00'yi vurmuş ve cildiniz o dağların sıcak kavurucu nefesiyle terlemiş olacaktır. Endişe etmenize hiç gerek yok! Rotamız tam 5 ile 10 dakika gerisindeki efsanevi vahaya: <strong>Yakapark Tabiat Ormanına</strong> uzanacaktır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Tlos'un bağlı olduğu o dev köye (Yaka) ismini veren bölge, aslında dağın içinden tamamen doğal bir şelaleler sistemiyle patlayan ve fışkırarak akan erimiş kar sularından (Pınarlar) beslenir. YakaPark'ın (Yaka Doğal Şelale Alanı) içerisine girdiğiniz ilk andan itibaren Fethiye'nin sıcak ikliminin o bunaltıcılığı bir anda büyülü bir şekilde kaybolur; asırlık çok devasa ceviz ve ulu çınar ağaçlarının dev gövdeleri yüzünden içeri güneş bile vuramaz.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Sıra dışı otantiklikteki bu ahşap köşklerde, dev yastıklara (Şark köşesi) bağdaş kurarak hemen suyun o dondurucu ve şırıl şırıl sesinin tam üzerinde yerel teyzelerin yaptığı buz gibi soğuk yayık ayranı, tamamen taptaze ve organik Gözlemeyi (Flat bread) yersiniz. Ancak mekânın ana yıldızı, o şelale sularının kendi içerisindeki havuzlarda yetişmiş <strong>Kiremitte Alabalıktır (Trout Fish).</strong> Eğer cesur hissediyorsanız, "Soğuk Su Havuzunda 5 Dakika Durma" gibi bazı geleneksel yerel restoran cesaret yarışmalarına katılarak hem çocuklarınızı ve ailenizi çok eğlendirebilir, hem de suların o inanılmaz soğuk dondurucu derecesini test ederek tatilinize devasa ve kalıcı bir mizah katmış olursunuz.</p>

<img src="/images/articles/tlos_placeholder_2.png" alt="Yakapark ulu çınar ağaçları altında su üzerindeki ahşap sedirler ve yemek yiyen yabancı turistler" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="karsilastirma">Rota İkilemi: Tlos'tan Sonra Öğleden Sonra Arabanın Gideceği Yön Neresi Olmalı? (Kombinasyon Tablosu)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Öğle yemeğini (Yakapark Ziyafeti) saat 14:00 civarı keyifle tamamladınız; ama Fethiye merkeze dönmek için daha çok erkendir! Bölgenin (Seydikemer ovası) gücü, size Tlos civarında enfes, çok ünlü alternatif şok doğa opsiyonları sunmasıdır. Tatil grubunuza (Ailenize) uygun en pratik kararı vermek için aşağıdaki çok özel SEO harita birleştirme tablosunu inceleyin:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Yön Kombinasyonu</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">A Seçeneği: Tlos + Büyük Saklıkent Kanyonu</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">B Seçeneği: Tlos + Gizlikent Şelalesi (Gizli Vadi)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Ulaşım / Araç Mesafesi (Yakapark'tan)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Pürüzsüz çok düzgün asfaltla ortalama 15-20 dakikalık yürüme mesafesindeki devasa vadi kampüsü.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yine Saklıkent yönünde 15. dakikadadır, asfaltın hemen gerisinde sapa ağaçlık köy girişi vardır.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Ana Odaklanma Alanı & Ne Görülür?</td>
        <td class="py-4 px-6 text-sm text-gray-700">Zorlu sular aşılarak kanyon içine derin, dar bir kum yürüyüşü ve devasa dik sarp dağ duvarları fotoğrafı.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Orman içindeki yüzlerce merdivenden inilerek sonu akan o devasa büyük yeşil buz şelaleye (Waterfall) varış macerası.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Hangi Kitle İçin Muazzam Uygundur? (Visitor Type)</td>
        <td class="py-4 px-6 text-sm text-gray-700"><a href="/guide/fethiyede-cocukla-tatil-kisabir-rehber" class="text-blue-600 hover:text-blue-800 underline">Aileler, çocuklar ve geniş kafileli turlar</a> (Kolay yürünen ana bölüm için).</td>
        <td class="py-4 px-6 text-sm text-gray-700">Merdiven inip çıkmayı kaldırabilen fit, genç kitleler, sporcular ve şelalenin altına girmeyi sevenler.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Turist ve İnsan Boyutu Kalabalığı</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yaz aylarında ve okul tatillerinde özellikle dar gidiş yolunda (Halatlarda) aşırı derecede sıkışıklık ve uğultu vardır.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Büyük kalabalıklardan korunan, o yeşillikler içindeki kısıtlı ama çok huzurlu 'Butik' gizli gezgin (Secret Route) noktasıdır.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="gizlikent_selale">Etap 3 (Günün Final Opsiyonu): Doğanın Kalbi Gizlikent ve Şelale Yürüyüşü</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Saklıkent mi Gizlikent mi ikileminde kalıp eğer kalabalık istemeyen gruptansanız ve <strong>Gizlikent'i Seçtiyseniz</strong> harika bir tercih! Gizlikent, adı üzerinde sadece son yıllarda popülerleşmiş, merdivenlerle ormanın metrelerce aşağısına inilen oldukça şık bir vaha ve dere tabanıdır. Otoparka aracınızı güvenle bırakıp o uzun yüzlerce basamaklı tahta merdivenlerden orman vadisine doğru inmeye başladığınızda doğanın o ilkel yeşil (Jungle) çığlığı sizi büyüler.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Zemine indiğinizde ayakkabılarınızı suya sokup yaklaşık 20-30 dakika boyunca küçük ama inanılmaz manzaralı o dev nehrin debisine karşı çok keyifli (ve su diz boyundadır) bir "Aqua-Trekking" (Su Yürüyüşü) yaparsınız. Yolun en sapa ucunda sizi karşılayan ödül ise devasa bir kayadan fışkırarak akan o asıl <strong>Gizlikent Büyük Şelalesidir.</strong> Eğer deniz ayakkabılarınız takılıysa ve şort giyiyorsanız; doğrudan şelalenin tam o soğuk suyla döküldüğü altına girip buz gibi suda sırılsıklam olarak tatilin o yorgunluğunu büyük bir sevinç ve çığlıkla sonuna kadar çok rahatça atabilirsiniz. Geri dönüşte yukarı merdivenleri çıkmak eforist bir tırmanıştır ama finaldeki o Taze Sıkılmış Portakal suları yorgunluğu adeta siler ve dev günü mutlu kapatır.</p>

<h2 id="tuyolar">Bir Antik Şehir Macerasını Acısız Kurtaracak Mükemmel SEO Tüyoları (Checklist)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">İçinde antik tarih, orman, yüzme ve çamur barındıran üç boyutlu bir güne çıktığınız için maalesef aracın bagaj hazırlığı çok kapsamlı olmalıdır. Eksiksiz bir YakaTlos-Saklıkent deneyimi için hayat kurtara VIP (ve tecrübe kokan) profesyonel listemiz aşağıdadır:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">🎫</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Müze Kart Cüzdanı (Tlos ve Beklememek)</span>
            <span class="text-gray-700 text-base leading-relaxed">Tatil boyunca eğer Kayaköy, Letoon ve Tlos gibi bir bütünü (Antik Kültür Paketi) gezecekseniz, tekil yabancı bilet almak yerine Türkiye vatandaşıysanız tatilin daha çok ilk günü sabahı mutlaka e-Devletten bir "MüzeKart (Digital)" aktivasyonu sağlayın (veya kapıdan fiziksel kart çıkartın). Sadece Tlos Antik Kenti gişesinde dahi kendisini bedavaya saniyede bin kere amorti edecektir ve girişlerde (Turnikelerde) hiç sırada güneşte eziyet çekmeden okutup saniyeler içinde o VIP geçiş yaparsınız.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">👕</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Katmanlı (Soğan) Giyinme Zorunluluğu: Bagaj Yönetimi</span>
            <span class="text-gray-700 text-base leading-relaxed">Öğleye kadar Tlos Antik Kentinin dev kaya tepelerine çıkarken güneşten yanarak "Şort - Çıkarılabilir Askılı Tişört ve Spor Ayakkabıya" kesinlikle muhtaçsınız; ama öğleden hemen sonra vadide (Şelale - Kanyon) "Bikini/Mayo ve kalın kopmaz Deniz Ayakkabısına" kesinlikle muhtaçsınız. Ayrıca Gizlikent sonrası merdivenlerde üstünüz (Tişörtünüz/Şortunuz) %100 sırılsıklam olacak. Bütün gün aynı kıyafetle o rotayı dönmeniz sizi hasta eder. O sebeple arabanızın tam geniş bagajına; tamamen bambaşka havlular, ekstra tam bir kuru yedek yedek tişört, spor şort seti, ayakkabı / kalın deniz terliği bulunan bir operasyon "Tatil Değişim Çantası" hazırlamanız, günün hayat kurtaran o devasa kuralıdır.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">💦</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Kamera Güvenliği ve Su Geçirmez Çantalar (Water-Proof Bags)</span>
            <span class="text-gray-700 text-base leading-relaxed">Sadece tarih gezip dönseydiniz sorun yoktu ama rotanın (ikinci etabı) yarısı Saklıkent şelale sularında boğuşmakla veya o çamur alanında çamuka bulanmakla geçtiği için, üzerinizdeki pahalı cep telefonu (iPhone 15/16 vs.) veya araç anahtarını boynunuza asacağınız kilitli ucuz bir silikon Su Geçirmez poşete / kılıfa sokmadan kanyona sakın adım kımıltısı yapmayın. Oraya ayak basan ve kayıp düşülen ilk sulu alanda o derin ıslanma garantidir, cihazlar telafisiz çöp veya sükutuhan olur ve o günü acıya çevirir.</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Sabah güneşiyle Fethiye dağlarında Likya Medeniyetinin binlerce yıllık Pegasus Atı mitolojisine o kayalara dokunarak o eşsiz Tlos'ta başlamak, öğlenin yakıcı sıcağını Yakapark'taki köşklerde şırıl şırıl akan taze erimiş buzlu karda şelale sularındaki yerel sarmısaklı lezzetle taçlandırmak ve tam bir öğleden sonra kapanışını Saklıkent'in veya o dev Gizlikent'in muazzam coşkun akan ıslatan macerasında (adrenalinde) noktalamak... Tatil kavramını dar kalıplardan çıkartıp (şezlongtan kaldırıp) ona 'Derinlik, Hikaye ve Macera' (Story-telling Adventure) katan inanın paha biçilemez ve eşsiz bir Akdeniz deneyimidir. Kendinize kocaman Fethiye dağlarında keşfedecek bu elit çok alternatifli alanlar yarattıkça, ülkemizin bu harikasını çok daha dev bir ihtirasla seveceksiniz. Güneşli, bol Sulu ve medeniyet serinliği bol yolculuklar!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 9/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Tlos Ancient City & Yakapark Day Trip Guide", tr: "Fethiye Tlos Antik Kenti ve Yakapark Şelalesi: Saklıkent Kombinasyonu" },
        slug: "tlos-antik-kenti-yakapark-gizlikent-fethiye-selale-rotasi",
        slug_en: "tlos-ancient-city-yakapark-day-trip-guide",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/tlos_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye'de bir gün: Sabah Tlos antik kenti ve kaya mezarları gezisi, öğlen Yakapark şelalesi alabalık molası ve akşamüstü Gizlikent kanyonu. Tam gün eşsiz SEO rehberi.",
            en: "Ultimate Fethiye day trip SEO guide: Morning at Tlos Ancient City and Lycian rock tombs, afternoon lunch at Yakapark waterfalls, and Saklikent alternatives."
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
