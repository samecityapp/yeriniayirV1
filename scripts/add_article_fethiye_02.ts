import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye ile İlk Tanışma: Adım Adım, Eksiksiz ve Benzersiz Rotalar</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Uzun çalışma saatleri, bitmeyen kış ayları ve gurbette geçen yoğun tempolu bir yılın ardından, yaz tatili yaklaştığında kalbimiz hep o eşsiz Ege ve Akdeniz kıyılarımız için çarpmaya başlar. Türkiye'nin tatil cenneti Fethiye ise, ilk kez gidenler için sadece sıradan bir sahil kasabası değil, bambaşka bir dünyaya atılan harikulade bir adımdır. Turkuaz suları, devasa çam ormanlarıyla kaplı dağları, binlerce yıllık antik kentleri ve heyecan verici doğa sporlarıyla Fethiye, size bir tatilden çok daha fazlasını, tam anlamıyla bir "yaşam stili" sunar.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">İlk kez Fethiye'ye adım atacak olan ziyaretçilerimizin en çok yaşadığı tatlı telaş şudur: "O kadar çok koy, o kadar çok plaj ve yapılacak inanılmaz aktivite var ki, nereden başlamalıyım?" Gerçekten de, devasa bir lagün olan Ölüdeniz, nefes kesici yüksekliğiyle Babadağ, gizemli Kayaköy derken zamanın nasıl aktığını anlamak mümkün değildir. İşte bu nedenle, kıymetli izin günlerinizi nerede ne yapacağınızı düşünerek geçirmemeniz, her anı dolu dolu, yorulmadan ama hiçbir güzelliği de kaçırmadan yaşamanız için size özel modüler bir rota hazırladık.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-8">Bu rehberde, 3 günlük kısa ve etkili bir Fethiye keşfi yapacaklardan, 7 günlük tam kapsamlı bir dinlenme ve keşif tatili planlayanlara kadar herkes için kusursuz bir akış bulacaksınız. İster sadece masmavi suların tadını çıkarmak isteyin, ister tarih ve doğa ile bütünleşin; bu esnek plan, muazzam Fethiye tatilinizin altın anahtarı olacak.</p>

<img src="/images/articles/fethiye_itinerary_cover_1771612043153.png" alt="Fethiye koylarının ve sahil şeridinin havadan nefes kesici görünümü" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Gün 1: Efsaneye Giriş ve Ölüdeniz Büyüsü</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Sabah: Kumburnu Lagününde Dingin Başlangıç</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye'deki ilk gününüze, şüphesiz ki buranın en ikonik lokasyonu olan Ölüdeniz Lagünü (Kumburnu) ile başlamalısınız. Fethiye rotasını yapan her misafirimizin bu eşsiz güzelliği henüz kalabalıklar basmadan, sular ayna gibi pürüzsüzken görebilmesi için sabah saat 08:30 - 09:00 civarında sahilde olmasını öneriyoruz. Çam ağaçlarının suya değdiği o sığ, dalgasız ve muazzam turkuaz suda sabah yüzüşü yapmak, yılın tüm yorgunluğunu anında sıfırlayacaktır. Kumların parmak uçlarınızdan kayıp gidişi, sıcacık Akdeniz güneşinin bedeninizi ısıtması, daha ilk saniyede "İyi ki Türkiye'deyim" dedirtecektir size. Etrafınızda sadece ağaçların hışırtısı ve kuş sesleri varken, suyun bu denli berrak ve sıcak olması benzersiz bir doğa lütfudur.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Öğle Vakti: Belcekız ve Gökyüzü Şöleni</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Lagünden çıkıp biraz haraketli ana plaja, yani Belcekız'a doğru yürüdüğünüzde sahilin enerjisi bambaşka bir kimliğe bürünür. Burada açık denizin getirdiği o inanılmaz ferahlığı hissederken, başınızı yukarı kaldırdığınızda gökyüzünü rengarenk süsleyen yüzlerce yamaç paraşütünü izleyebilirsiniz. Denizin canlı mavisiyle gökyüzünün sonsuzluğunun birleştiği bu anlarda, şezlongunuza uzanıp en sevdiğiniz soğuk içeceğinizi yudumlarken, neden dünyanın başka ucundan kopup da Fethiye'ye geldiğinizi çok daha iyi anlayacaksınız. Dalgaların yumuşak ritmi, gökten yavaşça süzülen paraşütçülerin o tatlı çığlıkları, sahil kasabası ruhunun tam kalbinde olduğunuzu hissettirir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Öğleden Sonra & Akşam: Babadağ ve Zirvede Günbatımı</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Öğleden sonra güneşin en keskin etkisi kırıldığında, sıra Fethiye'nin en büyük simgelerinden birine doğru yolculuğa çıkmaya geliyor: Babadağ! Dünyanın en elit yamaç paraşütü merkezlerinden biri olan bu devasa dağa çıkmak için modern ve son derece güvenli Teleferik (Cable Car) hattını kullanacağız. Cam kabin yukarı doğru tırmanırken, aşağıda kalan Ölüdeniz manzarasının ne kadar gerçeküstü olduğuna inanamayacaksınız. Deniz bir tablo gibi altınızda küçülürken, bulutların arasına karışmak size paha biçilemez bir özgürlük hissi verecektir.</p>

<img src="/images/articles/babadag_cable_car_1771612154662.png" alt="Babadağ teleferiğinden görünen inanılmaz Ölüdeniz manzarası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<p class="text-lg text-gray-700 leading-relaxed mb-8">Zirvedeki eşsiz seyir teraslarında, bulutların üzerinde yürüyormuş hissine kapılacaksınız. Eğer maceracı bir ruhunuz varsa lisanslı ve çok deneyimli pilotlar eşliğinde yamaç paraşütü (tandem) deneyimini hayatınızın "en"leri arasına mutlaka eklemelisiniz. Paraşüt yapmasanız bile, 1700 veya 1900 metre rakımdaki tesislerin restoranlarında, serin ve taze dağ havası eşliğinde muhteşem bir günbatımı izlerken elit bir akşam yemeği yemek, ruhunuzu besleyecek bir lükstür. Günün yorgunluğunu kızıl bir ufka karşı atarken kahvenizi yudumladığınız an, tüm tatilin en unutulmaz karelerinden biri olarak hafızanıza kazınacaktır.</p>

<h2>Gün 2: Körfezin Saklı Cennetlerinde Lüks Bir Tekne Turu</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>12 Adalar Rotasında Mavi Yolculuk</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye tatilinin ikinci günü her zaman suya, sonsuz maviye ve teknelere ayrılır. Etraftaki koylar karadan ulaşılamayacak kadar bakir ve güzel olduğundan, bir tam günü tekne turuna ayırmak zaruridir. Fethiye kordonundan kalkan ve "12 Adalar Turu" olarak bilinen rota, özellikle sakinlik, nezih bir ortam ve çarşaf gibi koylarda yüzmek isteyen misafirlerimiz için mükemmel bir seçimdir. İri kıyım ahşap guletler sizi sarsmadan, son derece konforlu bir şekilde yeşilin ve mavinin en çarpıcı tonlarının içine doğru götürecektir. Akdeniz güneşinde parlayan güvertede uzanmak, tertemiz oksijeni içinize çekmek kendinizi bir rüyanın içinde hissetmenizi sağlayacaktır.</p>

<img src="/images/articles/fethiye_boat_tour_12islands_1771612241603.png" alt="Fethiye'nin muazzam koylarında geleneksel ahşap gulet ile tekne turu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<p class="text-lg text-gray-700 leading-relaxed mb-6">Tersane Adası, Yassıcalar, Kızıl Ada gibi birbirinden farklı dokuya sahip duraklarda denize girerken, tuzlu suların bedeninizi ne kadar arındırdığını fark edeceksiniz. Doğal yaşamın tüm renklerini barındıran bu adalarda şnorkelle su altını izleyebilir, veya tekneden suya serinletici atlayışlar yapabilirsiniz. Turlarda misafirlere taze pişirilmiş, tamamen Türk mutfağını yansıtan sağlıklı Akdeniz ürünleri servis edilir; zeytinyağlı mezeler, harika çoban salataları ve taze deniz ürünleri ile dolu neşeli ve huzur dolu bir yolculuk geçirirsiniz.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Akşam: Çalış Plajı'nda Ege Rüzgarı ve Altın Işık</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-8">12 Adalar yorgunluğunu üzerinizden atmak ve sakin, püfür püfür rüzgarlı bir gece geçirmek için akşamı Fethiye'nin en nezih noktalarından biri olan Çalış bölgesinde değerlendirebilirsiniz. Çalış, Fethiye'nin belki de en iyi günbatımına sahip sahil bandıdır. Denizden esen tazeleyici rüzgar eşliğinde kordonda yürüyüş yapın; dalgaların sesi eşliğinde sahil boyu uzanan şık restoranlardan birinde sevdiklerinizle o meşhur Türk mezelerinin tadına bakın. Acılı ezme, haydari, kalamar ve taze balık eşliğinde masanızdaki sohbetler çok daha unutulmaz hale gelecektir.</p>

<h2>Gün 3: Gizemli Köyler ve Kent Ruhunun Keşfi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Sabah: Kayaköy'ün Sessiz ve Büyülü Sokakları</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Üçüncü gün, rotamızı yalnızca denize değil, bölgenin çok zengin ve mistik tarihine çeviriyoruz. Sabahın ilk ışıklarıyla, kahvaltının ardından, Hisarönü civarından kolayca ulaşabileceğiniz Kayaköy'e (Hayalet Köy) doğru çam ormanları içinden geçen ferahlatıcı bir kısa yolculuk yapıyoruz. Bir yamaca yaslanmış, eski taş evlerin yüzlercesinin çatısız ve ıssız bir şekilde mükemmel korunarak günümüze kaldığı bu terk edilmiş tarihi Rum köyü, kelimenin tam anlamıyla büyüleyicidir.</p>

<img src="/images/articles/kayakoy_ghost_village_1771612093844.png" alt="Karaköy'ün çam ormanlarıyla kaplı eşsiz dokusu ve tarihi taş evleri" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<p class="text-lg text-gray-700 leading-relaxed mb-6">Taş döşeli dar sokaklarda gezerken incir ve nar ağaçlarının gölgesinde soluklanacak, eski kiliselere çıkan yollarda fotoğraf çektirmeye doyamayacaksınız. Terk edilmişliğin verdiği o tarifsiz sükunet, insanı kendi iç dünyasına da bir yolculuğa çıkarıyor. Kayaköy ziyaretinin ardından köyün girişinde yer alan otantik alanlarda taze yapılmış ve sıcak sacdan henüz inmiş gözleme ve ev yapımı bol köpüklü ayran molası vermek Fethiye'nin en güzel klasiklerinden biridir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Öğleden Sonra: Amintas ve Tarihi Körfez Manzarası</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Taş evlerin mistik havasından sıyrılıp, merkez bölgeye, yani kentin atan nabzına doğru geçiyoruz. Şehre tepeden bakan ve dağların eteklerine binlerce yıl evvel kazınmış olan Amintas Kaya Mezarları'nı ziyaret etmek tarihi anlamda ruhu çok doyurucudur. Sizi binlerce yıl öncesinin ihtişamlı krallıklarına, kudretli Likya dönemine götüren bu görkemli eserlerin yanından merkeze bakmak ve tüm Fethiye körfezini ayaklarınızın altında görmek çok iddialı ve şairane bir deneyim sunar.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Akşam: Paspatur Çarşısı ve Marina Esintisi</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-8">Güneş batmaya başlarken Fethiye merkeze inin ve Eski Eserler ile modern yaşantının harmanlandığı o harika Kordon boyunda deniz havasını soluyarak ağır ağır yürüyün. Daha sonra ufak bir manevra ile yönünüzü Paspatur'a, yani şehrin kalbi "Eski Şehir" çarşısına çevirin. Dar sokaklarının üstünü süsleyen asma gölgelikler, rengarenk uçuşan uçuşan şemsiyeler, el dokuması şık Türk halıları, otantik lambalar, özel deri butikler ve envaiçeşit lokumcularıyla Paspatur sizi hemen o nostaljik atmosferinin içine sımsıcak saracaktır.</p>

<img src="/images/articles/fethiye_old_town_market_1771612076844.png" alt="Fethiye Paspatur çarşısının renkli şemsiyeleri ve dar taş sokakları" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
    <p class="font-bold text-gray-900 mb-2 text-xl">💡 3 Günlük Rota Özeti</p>
    <p class="text-gray-700">Eğer Fethiye'ye haftalık yoğun çalışma temponuzdan sadece bir hafta sonu veya üç günlük kısa ama verimli bir kaçamak için geliyorsanız, rotanız tam olarak burada zirvede tamamlanır. Denizi, gökyüzünü, lüks tekne gezisini, doğayı ve eşsiz Türk tarihini muazzam bir akış ile deneyimlemiş olursunuz. <b>Ama Fethiye'nin rüyası burada bitmez, tatiliniz 5 gün ise yola devam ediyoruz!</b></p>
</div>

<h2>Gün 4: Kelebekler Vadisi ve Alternatif Koy Seferleri</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Sadece internet resimlerinde gördüğünüz ve dünyanın en iyi fotoğraf noktalarından biri sayılan o meşhur derin vadiye, yani <strong>Kelebekler Vadisi'ne</strong> gitmeden 5 günlük bir rota düşünülemez. Bu devasa doğal oluşuma karadan inmek, uzman dağcılar dışındaki ziyaretçiler için fiziken mümkün değildir; bu nedenle Ölüdeniz sahilinden kalkan özel dolmuş teknelerle vadiye muazzam ve çok heyecanlı bir deniz yolculuğu yapılır. Su üzerinden vadiye yaklaşırken, devasa iki kayanın arasından açılan kanyon görüntüsü nefesinizi kesecektir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Vadinin sadece sahilinde kalmayıp iç kısımlarına doğru derinlemesine muhteşem orman içine yürüyüş yapmak ailecek harika zaman geçirilebilecek çok nezih ve şık, kumlu alanlara sahip Kıdrak Koyu gibi elit çevre plajlarda şezlong ve deniz keyfi yaparak tamamlayabilirsiniz.</p>

<h2>Gün 5: Saklıkent Kanyonu'nda Heyecanın Dorukları</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye tatili sadece tuzlu sular, şezlonglar ve sıcak kumsallar demek değildir. Beşinci günde rotamızı plaj lüksünden alıp, biraz daha görkemli iç kesimlere, Tlos Antik Kenti yönüne ve ardından dağların sakladığı muhteşem <strong>Saklıkent Milli Park Alanı'na</strong> doğru kırıyoruz. Toros dağlarının bağrında yüzyıllar boyu akan kar sularının taşı oya oya açtığı bu muazzam kanyon, devasa yüksekliği ve ağustos sıcağında dahi kemiklerinizi sızlatacak kadar dondurucu soğukluktaki suyuyla muazzam bir ferahlama ve terapi noktasıdır.</p>

<img src="/images/articles/saklikent_gorge_fethiye_1771612140736.png" alt="Devasa kayalıklar arasında akan Saklıkent kanyonu suları ve ahşap yürüme yolları" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<p class="text-lg text-gray-700 leading-relaxed mb-6">Saklıkent'in girişinde yer alan, dev kayalıklara asılı kaygan ahşap platformlarda ihtiyatla yürürken vadinin heybetine bir kez daha hayran kalacaksınız. Cesaret eden maceraperest bedenler, buz gibi suya girip nehrin hızlı akıntısına karşı yürüyerek, bedeni saran çamur banyoları ile kanyonun hiç güneş görmeyen derinliklerini keşfedebilir. Kanyon macerasından yorulduğunuzda ise tam çıkışta, buz gibi suyun akış yönü üzerine kurulmuş harika yer sofrası tarzı otantik ahşap köşklerde oturup harika bir doğa manzarası eşliğinde alabalık, yöresel peynirler ve taze yeşillik salataları yemek, ruhunuzu ve bedeninizi eşzamanlı dinlendirecek elit bir deneyim olacaktır.</p>

<div class="bg-blue-50/50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
    <p class="font-bold text-gray-900 mb-2 text-xl">💡 5 Günlük Rota Özeti</p>
    <p class="text-gray-700">Fethiye için ne az ne de çok olan; en ideal, insanı asla yormayan ama hemen hemen her ana turistik ve coğrafi unsuru barındıran optimum tatil süresi tam 5 gündür. Klasik lagün denizi, eşsiz Babadağ manzaraları, harika bir buz gibi kanyon yürüyüşü ve elit tekne turları... <b>Süreyi daha esnek düşünen, iş hayatının stresinden tamamen arınmak isteyen şanslılar için 7 günlük rota ile Fethiye rüyasına devam ediyoruz!</b></p>
</div>

<h2>Gün 6 ve 7: Likya Ruhunu Özümsemek ve Baştan Aşağı Yenilenmek</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Muhteşem dolu dolu geçen 5 günün ardından, altıncı güne, doğa ve tarih severlerin dünyanın her köşesinden büyük saygı ile geldiği, dünyanın en uzun ve prestijli tarihi yürüyüş yollarından biri olarak kabul edilen <strong>Likya Yolu'nun</strong> en güzel ormanlık etaplarından biri olan Fethiye-Ölüdeniz arası parkuruna, Ovacık başlangıç noktasından hafif ve çok dinç bir sabah yürüyüşü yaparak başlayabilirsiniz. Likya ağaçlarının gölgesinden sadece 2-3 saatlik, kısa, denizi inanılmaz bir yükseklikten gören bu yormayan orman rotaları bile bedeninize, damarlarınıza muazzam bir oksijen ve zindelik zerk edecektir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Yedinci gün söz konusu olduğunda ise sizlere büyük harflerle sunduğumuz tek bir harika önerimiz var: "Artık tamamen durun, anın tadını yavaşça, telaşsızca çıkartın!" Bütçe rotasına da %100 uygun olarak seçtiğiniz çok nezih, özel yeşil alanları olan bir lüks otelin bahçesinde veya Hisarönü sırtlarında kiraladığınız devasa özel villanızın kendi büyük havuzunda sabah başlayın ve günü tam bir lüks harcamasıyla, tembellik yaparak, lüks şezlonglarda en sevdiğiniz kitabın sayfalarını çevirerek tamamlayın. Acele yok, program yok, sadece ruhunuza iyi gelen o Akdeniz esintisi var.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Öğleden sonraya doğru, güneş usulca zayıflarken arabanıza veya klimalı transfer aracınıza atlayın ve çam ormanlarıyla kaplı zarif Hisarönü veya merkez caddelerinden hediyeliklerinizi, özel dibek Türk kahvenizi, en taze lokumları ve sımsıcak Ege'nin en kaliteli sızma zeytinyağlarını alarak; ailenize, evinize, gurbetteki sevdiklerinize bu muazzam tatilin güzel anılarını götürmek için hazırlıklarınızı yüzünüzde çok derin bir gülümsemeyle tamamlayın.</p>

<h2>Rotanızı Kusursuzlaştırın: Fethiye Rota Sıkça Sorulan Sorular (F.A.Q.)</h2>
<div class="space-y-6 my-10">
  <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
    <h3 class="font-bold text-gray-900 mb-3 text-xl">Bu 7 günlük dolu dolu hazırlanan rota aslında fiziksel olarak aşırı yorucu mu?</h3>
    <p class="text-gray-700 leading-relaxed">Hayır, kesinlikle size yorgunluk ve büyükşehirdeki gibi bir koşturmaca değil, ferah bir yaşam alanı tanıyacak şekilde çok ince ayarlanmıştır. Tatilde dinlenme çok boyutludur; bedeni dinlendirdiği kadar ufku değiştirmek ruhu dinlendirir. Rotadaki her bir günün içeriği belli bir ana temaya (deniz, kültürel tarih, maceralı doğa) odaklanır. Bu nedenle yarım gün aktivite, geri kalan yarım gün ise şezlongda veya nezih bir ortamda mutlak dinlenme esasına dayanır. Kendi ritminize göre bazı gün hedeflerini atlayıp günü plaja da çevirebilirsiniz, plan çok esnektir.</p>
  </div>
  <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
    <h3 class="font-bold text-gray-900 mb-3 text-xl">Biz deniz aşığıyız ancak kalabalıkları sevmiyoruz, en rahat edeceğimiz mevsim / aylar hangisidir?</h3>
    <p class="text-gray-700 leading-relaxed">Eğer okul çağında çocuğunuz yoksa veya yıllık izniniz temmuz ağustos aylarına sıkışmak zorunda değilse; Fethiye için muazzam altın zaman olan Mayıs sonu, bütün Haziran başı veya enfes Eylül–Ekim ayları tek bir ter damlası dahi atmadan, koylarda hiçbir sıra veya araç trafiği beklemeden, o altın rengi gün ışığında mükemmel hatıra fotoğrafları çekeceğiniz, denizin en güzel sıcaklıkta olduğu inanılmaz kusursuz, elit ve premium hisli dönemlerdir.</p>
  </div>
    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
    <h3 class="font-bold text-gray-900 mb-3 text-xl">Fethiye tatilinde bir araba kiralamamıza gerek var mı, araçsız yapabilir miyiz?</h3>
    <p class="text-gray-700 leading-relaxed">Ölüdeniz be Fethiye merkez arasında çalışan çok yoğun ve iyi organize olmuş, kliması düzgün dolmuş servisleri vardır ve bu şekilde plajlara ulaşım tamamen mümkündür. Ancak Saklıkent gibi kanyonlar, daha uzak plajlar ve serin dağ eteklerindeki restoranlar söz konusu olduğunda özgür hissetmek için ailecek bir araç kiralayarak rotamızı kendi belirlediğiniz rahat saatlerde dolaşmanız konfor açısından çok ama çok büyük bir lüks sağlayacaktır.</p>
  </div>
</div>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Değerli Türkiye sevdalıları, yurtdışında uzun yıllar geçirip "güzel bir Akdeniz rüyası" için Ege sınırlarına heyecanla hazırlık yapan gurbetteki çok özel misafirlerimiz; Fethiye'de ailece veya sevdiklerinizle geçireceğiniz bu rüya tatili, zihninizde inanılmaz berrak, enerji dolu ve her hatırladığınızda yüzünüzde tebessüm oluşturacak hatıralarla dolu olacak. Çam ormanı kokusunun en mavili tuzlu sulara, bin yıllık tarihin sınırsız Ege lüksü ile kucaklaştığı büyüleyici Fethiye'ye şimdiden, gönülden hoş geldiniz!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 2/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    // Safety check constraint manually
    if (words < 1800) {
        console.warn("WARNING: Word count is still under 1800. Needs expansion.");
    }

    const newArticle = {
        title: { en: "Fethiye First-Timers Itinerary: 3-5-7 Days", tr: "Fethiye İlk Kez Gidenler İçin: 3–5–7 Günlük Hazır Rota (Esnek Günlü Plan)" },
        slug: "fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota",
        slug_en: "fethiye-first-timers-itinerary-3-5-7-days-guide",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        cover_image_url: "/images/articles/fethiye_itinerary_cover_1771612043153.png",
        meta_description: {
            tr: "Fethiye'ye ilk defa gidenler için özenle hazırlanmış tam kapsamlı 3, 5 ve 7 günlük mükemmel tatil rotası. Ölüdeniz, Kelebekler, Saklıkent.",
            en: "An optimized and flexible 3, 5, or 7-day itinerary for your first visit to Fethiye. Unmissable spots like Oludeniz, Saklikent Gorge and Babadag."
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
