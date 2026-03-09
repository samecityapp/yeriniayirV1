import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>İstanbul'un Büyülü Coğrafyası: Mükemmel Tatil İçin Doğru "Base" (Konaklama Merkezi) Neresi Olmalı?</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">İki kıtayı birbirine bağlayan, üç büyük imparatorluğa başkentlik yapmış, 16 milyonu aşkın nüfusuyla dünyanın en dinamik ve ikonik metropollerinden biri olan İstanbul'a seyahat planlamak heyecan verici olduğu kadar kafa karıştırıcı da olabilir. Dev bir okyanusu andıran bu kozmopolit şehir, coğrafi olarak öylesine geniş bir alana yayılmıştır ki, "İstanbul'da otel tuttum" demek aslında hiçbir şey ifade etmez. Hangi İstanbul'da otel tuttunuz? Tarihin, padişahların ve Bizans'ın fısıltılarının olduğu Sultanahmet'te mi, sabaha kadar uyumayan ve gençliğin nabzının attığı Beyoğlu'nda mı, yoksa İstanbulluların gerçek günlük hayatını yaşadığı yavaş ve keyifli Kadıköy'de mi?</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Özellikle İstanbul'a ilk kez gelen misafirler için en ölümcül seyahat hatası, sadece "manzarası güzelmiş" veya "fiyatı uygunmuş" diyerek haritadaki konumunu hiç incelemedikleri bir oteli rezerve etmektir. Yanlış bir bölgede konaklamak, gününüzün en değerli 3-4 saatini trafik çilesiyle yollarda harcamanıza, akşamları güvenle sokaklarında yürüyemeyeceğiniz bir lokasyona hapsolmanıza ve en nihayetinde şehre karşı önyargılı olmanıza sebep olabilir. İstanbul tıpkı dev bir yapboz gibidir; doğru bölgeyi "base" (merkez) olarak seçmek, bu yapbozu kusursuzca birleştirmenizi sağlayacak kilit taşıdır.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-8">Bu devasa rehberimizde, Avrupa ve Anadolu (Asya) yakalarındaki en kritik konaklama merkezlerini mercek altına alıyor, her bir bölgenin avantajlarını, handikaplarını, ulaşım bağlantılarını ve hangi turist profiline (aile, yalnız gezgin, lezzet avcısı, ilk kez gelen) tam olarak uyduğunu anlatıyoruz. Seyahatinizin kaderini değiştirecek bu rehberi okumadan asla İstanbul otel rezervasyonunuzu tamamlamayın!</p>

<img src="/images/articles/istanbul_sultanahmet_square_placeholder.png" alt="Sultanahmet Meydanı ve Ayasofya'nın masalsı sabah görünümü" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Sultanahmet ve Sirkeci: Tarihin Tam Kalbinde Uyanmak (İlk Kez Gelenler İçin "Güvenli Liman")</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Tarih kitaplarında okuduğunuz o efsanevi İstanbul silüeti tam olarak Sultanahmet Meydanı ve Tarihi Yarımada'yı (Old City) temsil eder. Eğer İstanbul'a hayatınızda ilk kez adım atıyorsanız ve öncelikli hedefiniz Ayasofya, Sultanahmet Camii (Blue Mosque), Topkapı Sarayı, Yerebatan Sarnıcı ve Kapalıçarşı gibi dünyaca ünlü başyapıtları görmekse, konaklamanız gereken yer tartışmasız Sultanahmet veya komşusu Sirkeci semtleridir.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Bu bölgede konaklamanın en büyük lüksü "zaman tasarrufu" ve "yürünebilirlik"tir. Otelinizden adımınızı attığınız anda birkaç yüz metre yürüyerek binlerce yıllık abidelere ulaşabilirsiniz. Ayrıca T1 Kabataş-Bağcılar hattı tam bu bölgenin içinden geçer. T1 tramvayıyla Galata Köprüsü, Karaköy ve Kabataş'a, Marmaray (Sirkeci İstasyonu) ile dakikalar içinde Boğaz'ın altından geçerek Anadolu yakasına (Üsküdar-Kadıköy) ışınlanabilirsiniz.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Sultanahmet'in akşamları ve gece hayatı ise oldukça durağandır. Birkaç klasik turistik restoran haricinde, gece saat 10'dan sonra sokaklar sessizliğe ve huzura bürünür. Bu durum, sabaha kadar eğlenmek isteyen genç ruhlar için sıkıcı olabilir ancak çocuklu aileler, balayı çiftleri ve erken uyuyup sabah şehre zinde karışmak isteyen gezginler için harika bir güvencedir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6"><strong>Sultanahmet/Sirkeci Bölgesini Kimler Seçmeli?</strong></p>
<ul class="list-disc pl-8 mb-6 text-gray-700 space-y-3">
    <li>İstanbul'a hayatında ilk defa gelenler ve turistik ana noktaları hedefleyenler.</li>
    <li>Müzeleri, sarayları ve camileri trafik stresi olmadan sadece yürüyerek keşfetmek isteyen tarih aşıkları.</li>
    <li>Bebek pusetini ana caddelerde rahat sürmek ve kısa mesafede oteline dönebilmek isteyen aileler.</li>
    <li>Gece hayatı, gürültülü kulüpler ve kaotik sokaklar aramayan; sessiz, huzurlu ve klasik bir İstanbul rüyası yaşamak isteyen misafirler.</li>
</ul>

<img src="/images/articles/istanbul_karakoy_galata_streets_placeholder.png" alt="Galata Kulesi manzaralı şık Karaköy sokakları ve kafeleri" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Karaköy, Galata ve Pera (Beyoğlu): Modern İstanbul, Bohem Ruh ve Yüksek Enerji</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Tarihi Yarımada'yı (Sultanahmet'i) Galata Köprüsü ile Haliç'in karşı yakasına bağladığımızda, Karşı Yaka'nın (eskilerin deyişiyle Pera'nın) sokaklarına çıkarız. Karaköy, Galata ve Tepebaşı (Pera) hattı; İstanbul'un Avrupa ile buluştuğu, asırlardır ticaretin, sanatın, kahve kültürünün ve kozmopolit yaşamın merkezi olmuş bölgesidir. Son on yılda inanılmaz bir değişim gösteren Karaköy ve Galata bölgesi, bugün İstanbul'un en "trend", en estetik, tasarım butikleri ve sanat galerileriyle dolu, Michelin yıldızlı şef restoranlarını barındıran kalbidir.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Bir tarafta Cenevizlilerden kalan ihtişamlı Galata Kulesi, diğer tarafta kruvaziyer gemilerinin yanaştığı lüks Galataport projesi ile Karaköy, size hem tarihi hem de İstanbul'un siber-modern yüzünü aynı anda sunar. Burada konaklamak demek, sabah şık bir üçüncü nesil kahvecide espresso içip, öğlen İstanbul Modern Müzesi'ne gitmek, akşamüstü Galata'nın dik arnavut kaldırımlı sokaklarında tasarımcı mağazalarını gezmek ve geceyi muazzam bir Boğaz manzaralı çatı barında noktalamak demektir.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Taksim Meydanı ve İstiklal Caddesi de bu ekosistemin bir parçasıdır. Ancak Taksim son yıllarda aşırı turistik bir yapıya dönüştüğü ve kalabalık oranı çok arttığı için, biz Fethiye rehberindeki "Ovacık" tavsiyemiz misali; kalabalıktan bir nebze izole ama her yere 5 dakika uzaklıktaki Karaköy/Galata alt aksını konaklama için çok daha prestijli ve güvenli buluyoruz.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6"><strong>Karaköy ve Galata Bölgesini Kimler Seçmeli?</strong></p>
<ul class="list-disc pl-8 mb-6 text-gray-700 space-y-3">
    <li>Klasik müze gezisini tamamlamış, İstanbul'un sokak modasını, modern sanat galerilerini (İstanbul Modern vb.) ve tasarım yönünü keşfetmek vizyoner gezginler.</li>
    <li>Gastronomiye önem veren, Michelin rehberine giren yeni nesil Türk ve dünya mutfağı restoranlarına yürüyüş mesafesinde olmak isteyen gurmeler.</li>
    <li>Şehrin hem gündüz ritmini hem de enerjik ama seçkin gece hayatını, Rooftop (Teras) barlarını deneyimlemek isteyen çiftler ve arkadaş grupları.</li>
    <li>Vapur (Karaköy İskelesi), Tramvay (T1 Karaköy) ve Metro (M2 Şişhane) gibi kilit ulaşım ağlarının hepsinin kesişim noktasında olmayı aklına koyan "pratik" planlayıcılar.</li>
</ul>

<img src="/images/articles/istanbul_kadikoy_moda_ferry_placeholder.png" alt="Kadıköy Moda sahilinde denize nazır vapur yolculuğu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Kadıköy ve Moda: Anadolu Yakasının "Cool" Gençliği ve İstanbul'un Gerçek (Yerel) Ruhu</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Avrupa yakasının turistik koşturmacasından uzak, İstanbulluların gerçekten yaşadığı, nefes aldığı, hafta sonları sosyalleştiği bir merkez arıyorsanız, vapurla karşıya (Anadolu Yakasına) geçip Kadıköy'e demirlemelisiniz. Kadıköy ve nezih alt mahallesi Moda, İstanbul'un en yeşil, en çağdaş, hayvan dostu ve kültürel dokusu en yüksek bölgesidir. Burada konakladığınızda turist hissi yaşamazsınız, anında şehre entegre olmuş bir İstanbullu kimliğine bürünürsünüz.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Kadıköy tarafı özellikle yeme-içme (gastronomi) ve "pub" kültürü konusunda Avrupa yakasını dahi geride bırakmıştır. Tarihi Kadıköy Çarşısı'nda balık, meze ve sokak lezzetlerini tadabilir, Moda sokaklarındaki butik kahvecilerde, antikacılarda kitap okuyabilir ve kilometrelerce uzanan yeşil Moda sahil parkında çimlere yayılıp Marmara Denizi batan güneşi eşliğinde piknik yapabilirsiniz. Üstelik otel ve yeme-içme fiyatları, Sultanahmet veya Karaköy gibi tamamen turist odaklı Avrupa yakası semtlerine kıyasla çok daha dengeli ve ekonomiktir.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">"Peki ya turistik yerler? Her gün karşıya geçmek zor olmaz mı?" Kadıköy iskelesinden kalkan tarihi şehir hatları vapurları ile Eminönü veya Karaköy'e geçmek sadece harika bir Boğaz turu deneyimi yaşatmakla kalmaz, aynı zamanda tam 20 dakika gibi kısa bir sürede sizi Avrupa Yakası'nın göbeğine ulaştırır. Kıtalar arası yolculuk her sabahınızın muhteşem bir rutini haline gelir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6"><strong>Kadıköy ve Moda Bölgesini Kimler Seçmeli?</strong></p>
<ul class="list-disc pl-8 mb-6 text-gray-700 space-y-3">
    <li>Turist tuzağı bölgelerden kaçarak kaliteden ödün vermeden "daha ucuza" daha yerel bir deneyim yaşamak isteyen bütçe (budget) dostu gezginler.</li>
    <li>Dünyanın en ilginç toplu taşıması olan "Vapur" ile her sabah bir kıtadan diğerine martılara simit atarak geçme deneyimini arzulayan romantikler.</li>
    <li>Geniş parklara, yeşil sahil şeritlerine, evcil hayvanların özgürce dolaştığı sokaklara ve rahat giyimli ("casual") bir atmosfere aşık genç kafalar.</li>
    <li>Sokak lezzetlerini, Kadıköy Çarşısındaki lahmacuncuları, meşhur Moda dondurmacılarını ve salaş balık mekanlarını kovalayan gezginler.</li>
</ul>

<img src="/images/articles/istanbul_besiktas_bosphorus_placeholder.png" alt="Beşiktaş sırtlarından Boğaziçi Köprüsü ve sahil manzarası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Beşiktaş, Ortaköy ve Nişantaşı: Boğaz Manzarası, Lüks ve Şehir Şıklığının Zirvesi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Konaklama portföyümüzün son durağında İstanbul'un elit, çok daha Avrupa-vari, saraylara (Dolmabahçe ve Çırağan) ev sahipliği yapan şeridi var: Beşiktaş - Ortaköy sahil hattı ve yukarıda Nişantaşı - Şişli bölgesi. Eğer bütçeniz yüksekse, lüks 5 yıldızlı dünya markası otellerin konforunu, eşsiz Boğaz manzaralı manzaraları ve üst düzey alışveriş konseptini arıyorsanız bu bölgeler tartışmasız olarak ilk adresiniz olmalıdır.</p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Beşiktaş merkezi inanılmaz enerjik bir öğrenci ve yaşam hub'ı iken, sahil şeridine (Ortaköy ve Bebek tarafına) doğru ilerlediğinizde İstanbul'un en ihtişamlı sahil silüetine kavuşursunuz. Nişantaşı ise lüks markaların devasa vitrinlerinin, şık kafelerin, Paris veya Milano estetiğine sahip caddelerin İstanbul'daki karşılığıdır. Özellikle geniş arap turistler, moda ikonları ve balayı çiftlerinin Fethiye de tekne turu lüksünü İstanbul Boğazı'nda kiralık özel yatlarla yaşadığı segment tam olarak burada ikamet eder.</p>

<h2>Karar Anı: Seyahat Profilinize Göre Doğru Bölge Formülü</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Eğer Fethiye'de doğru plajı seçmek tatilinizi nasıl kurtarıyorsa, İstanbul'da da doğru konaklamayı seçmek sizi zaman, nakit ve enerji kaybından o kadar kurtarır.
<br>1- İstanbul'a ilk defa (First time) geliyorum, müzeleri yürüyerek gezeceğim diyorsanız: <strong>Sultanahmet / Sirkeci</strong> (Mutlak Tavsiye)
<br>2- Müzeleri geçtim, ben trend restoranlar, cool kafeler, tasarım sokaklar, tasarım oteller ve Ceneviz tarihi istiyorum diyorsanız: <strong>Karaköy / Galata</strong>
<br>3- Turistleri boşver, bana İstanbullunun yaşadığı sokak kültürünü, muhteşem vapur yolculuğunu, Moda parkını ve salaş balıkçıları verin diyorsanız: <strong>Kadıköy / Moda (Asya Yakası)</strong>
<br>4- Lüks beş yıldızlı devasa zincir otellerde kalıp, alışveriş yapıp Boğaz manzaralı teraslarda kahvaltı edeceğim, bütçe sorun değil diyorsanız: <strong>Nişantaşı / Beşiktaş / Ortaköy Hattı</strong></p>

<h2>Sıkça Sorulan Sorular (F.A.Q.)</h2>
<div class="space-y-4 my-8">
  <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-2">Havalimanından konaklama bölgesine ulaşım en kolay neresi?</h3>
    <p class="text-gray-700">Yeni İstanbul Havalimanı'ndan (IST), Havaİst otobüsleriyle direkt olarak Beyazıt (Sultanahmet'e çok yakın) veya Taksim (Karaköy bağlantılı) meydanlarına geçiş çok kolaydır. Sabiha Gökçen Havalimanı (SAW) uçuşu kullanacaksanız ise en mantıklı ve en az trafikli konaklama bölgesi kesinlikle Kadıköy olacaktır (Metro direkt Kadıköy merkeze kadar gelir).</p>
  </div>
  <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-2">Sultanahmet'te kalırsak akşamları yemek için çok mu kısıtlı kalırız?</h3>
    <p class="text-gray-700">Çok kısıtlı kalmazsınız ama yerel lezzetlerden ziyade tamamen turistlere yönelik hazırlanmış standart kebapçı-restoran formatı ile karşılaşırsınız ve geceleri saat 10 civarı çoğunlukla sessizliğe gömülür. Akşam yemeklerinde çeşit arayanlara Karaköy-Kadıköy eksenini öneririz.</p>
  </div>
  <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-2">Arabamızla geliyoruz, İstanbul'da otopark açısından en rahat neresi?</h3>
    <p class="text-gray-700">Tarihi Yarımada (Sultanahmet-Sirkeci) araç trafiğine kapalı alanlara sahiptir ve dar sokaklarda park yeri bulmak tam bir kabustur. Kadıköy ile Karaköy de otoparkı inanılmaz kısıtlı yerlerdir. Aracınızla geliyorsanız otelinizin "Özel Otoparkı (Valet Parking)" olduğundan mutlaka %100 emin olmalısınız. İstanbul'da genel kural: Metro, Tramvay ve Vapur her zaman araçtan 50 kat daha hızlıdır.</p>
  </div>
</div>
<p class="text-lg text-gray-700 leading-relaxed mb-6">İstanbul'daki bölge seçimi stratejinizi tamamladıysanız, bu devasa metropolü adım adım nasıl planlayacağınızı, kaç günlük rotaların sizin için ideal olduğunu anlattığımız, yormayan ve çok pratik 3-5-7 Günlük Hazır İstanbul Rotası rehberimize geçerek tatil hazırlıklarınızı profesyonelce tamamlayabilirsiniz!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 1/15...");

    // Check word count locally to be sure
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    const newArticle = {
        title: { en: "Where to Stay in Istanbul? Area & Base Selection Guide", tr: "İstanbul’da Nerede Kalınır? Bölge Bölge Base Seçim Rehberi (İlk Kez Gelenler İçin)" },
        slug: "istanbulda-nerede-kalinir-bolge-bolge-base-secim-rehberi",
        slug_en: "where-to-stay-in-istanbul-area-base-selection-guide",
        content: { tr: articleContentStr },
        location: { tr: "İstanbul" },
        cover_image_url: "/images/articles/istanbul_accommodation_cover_placeholder.png",
        meta_description: {
            tr: "İstanbul tatilinde nerede konaklamalı? Sultanahmet, Karaköy, Kadıköy ve Nişantaşı bölgelerinin avantajları ve dezavantajlarını anlatan detaylı İstanbul konaklama rehberi.",
            en: "Where to stay in Istanbul, Turkey? An extensive area-by-area guide choosing between Sultanahmet, Karakoy, Kadikoy and Nisantasi."
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
