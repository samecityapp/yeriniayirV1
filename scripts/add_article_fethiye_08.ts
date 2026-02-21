import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Saklıkent Kanyonu Gezi Rehberi: Fethiye'nin Buz Gibi Doğal Klimasında Bir Tam Gün</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Akdeniz'in o dillere destan yakıcı yaz tepesinde, özellikle Temmuz ve Ağustos aylarında hava sıcaklıkları Fethiye sahillerinde gölgede 40-42 dereceleri zorlarken, bedeninizi deniz tuzu ve krem değil de "buz gibi tatlı sularla" şoklamak isteyeceğiniz bir an mutlaka gelecektir. İşte tam o anda, Fethiye merkeze yaklaşık bir saatlik sürüş mesafesinde bulunan, efsanevi Toros dağlarının sarp kayalıklarını bir kılıç gibi ikiye yaran devasa doğa anıtı <strong>Saklıkent Kanyonu (Saklikent Gorge / Milli Parkı)</strong> imdadınıza yetişir. Türkiye'nin ve Avrupa'nın yürünebilir en büyük ve en uzun kanyonlarından biri olan bu benzersiz jeolojik oluşum, sadece serinliğiyle değil, ihtişamıyla ve yürüyenlere sunduğu ufak doz adrenalinle milyonlarca turistin seyahat listelerinde altın harflerle taht kurmuştur.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Turkuaz renkli denizleri arkada bırakıp <a href="/guide/kelebekler-vadisi-rehberi-fethiye-ulasim" class="text-blue-600 hover:text-blue-800 underline transition-colors">dağların derinliklerine</a> saklanmış bu kanyona giden yolda aklınızda belirecek pek çok gizem vardır: İçerisinden nehir mi geçiyor yoksa gölet mi var? Kanyonda gerçekten buz gibi suya girmek zorunlu mu? <a href="/guide/fethiyede-cocukla-tatil-kisabir-rehber" class="text-blue-600 hover:text-blue-800 underline transition-colors">Küçük bebekli veya engelli aileler</a> de bu zorlu parkuru görebilir mi? Karın doyurmak için etrafta tesis bulunuyor mu, yoksa dağ başında aç mı kalınır? Özellikle yabancı turist dostlarımız veya memlekete ilk defa kendi aracıyla gelen kitleler için Saklıkent, sadece sıradan bir turistik tabela değil, aynı zamanda minik bir "Outdoor Macerası" anlamına gelir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Eğer tatil programınızın deniz-kum-güneş üçgeninden biraz kopmasını, dev şelalerin ve serin suların arasında eşsiz anılarla dolmasını ve ailenizle eğlenceli bir çamur banyosu deneyimi yaşamayı istiyorsanız, bu rehber tam size göre hazırlandı. Saklıkent Milli Parkına arabanızla ne zaman varmalısınız, vadinin asıl yürüyüş etapları ne kadar sürer ve bu doğa şölenine dahil olurken yanınıza almanız (ve asla almamanız) gereken şeyler nelerdir? Arama motorlarını domine den devasa, tablo odaklı ve SEO algoritmalı Saklıkent tam gün akış rehberimizle "Buz Gibi" bir yolculuğa başlıyoruz!</p>

<img src="/images/articles/saklikent_placeholder_cover.png" alt="Toros dağlarının sarp kayalarını ikiye yaran Saklıkent kanyonundan fışkıran beyaz tatlı nehir suyu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Saklıkent Kanyonu İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#ulasim" class="hover:text-blue-900 transition-colors">Fethiye'den Milli Park Tesisine Nasıl Gidilir? (Gidiş Stratejisi)</a></li>
        <li><a href="#giris_ahsap_yol" class="hover:text-blue-900 transition-colors">Etap 1: Ahşap Yürüyüş Yolu (Bebeklilere ve Engelsizlere Özel)</a></li>
        <li><a href="#buz_su_gecisi" class="hover:text-blue-900 transition-colors">Etap 2: Macera Başlıyor (Buz Gibi Nehri Çığlıklarla Geçmek)</a></li>
        <li><a href="#ic_kanyon_trekking" class="hover:text-blue-900 transition-colors">Etap 3: Dev Kanyonun Karanlığına Yürüyüş ve Çamur Banyosu</a></li>
        <li><a href="#yeme_icme_su_ustu" class="hover:text-blue-900 transition-colors">Dinlenme Ritüeli: Şırıl Şırıl Akan Su Üstü Köşklerinde Öğle Yemeği</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Kanyon Seçimleri: Saklıkent mi Yoksa Gizlikent mi? (Dev Tablo)</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Kanyonu Güvenli Geçmenin 'Outdoor' Tüyoları (Acil Durum Listesi)</a></li>
    </ul>
</div>

<h2 id="ulasim">Otantik Köylerden Dağlara: Fethiye'den Saklıkent'e Nasıl Gidilir?</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Serinliğe Ulaşmanın Erken ve Pratik Yolları</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6"><a href="/guide/fethiye-butce-planlayici" class="text-blue-600 hover:text-blue-800 underline transition-colors">Tatil için kendi özel aracınız</span>ley</span>seniz</a>, Fethiye merkezden Antalya istikametine (Seydikemer üzerinden) çıkıp tabelaları takip ettiğinizde, harika asfaltlı ve hafif Toros ormanları üzerinden 40-50 dakikalık (Yaklaşık 45 km) oldukça pürüzsüz ve rahatlatıcı bir araba sılaşık bir köy sürüşü yaparsınız. Otopark kısmında köy yerlilerinin (teyzelerin) sattığı gözlemeler, incirler ve taze sebzeler sizi otoparkın ağzında sıcacık karşılar. Eğer araç kiralamadıysanız, Fethiye merkezdeki veya <a href="/guide/oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Ölüdeniz'deki duraklardan kalkan düzenli (Dolmuş) hatlarıyla</a> ya da popüler üzeri tamamen açık üstü brandalı çılgın Cip Safarilerle (Jeep Safari Tour) bölgeye oldukça renkli ve çok ucuza ulaşım mümkündür.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Peki, aracı park ettik ve Milli Park Gişelerine geldik, asıl strateji nedir? Altın kuralı şimdiden veriyoruz: Eğer Temmuz ayındaysanız, kanyona <strong>kesinlikle sabah 09:30, en geç 10:00'da girmiş olmalısınız.</strong> Saat 11:30'dan sonra devasa ve dar kanyonun girişi olan o tek asma köprü yolunda insan seli yığılır, ve siz buz gibi suyun serinliğini sakinliğe değil insan omuzlarına çarparak yaşamak zorunda kalırsınız.</p>

<h2 id="giris_ahsap_yol">Etap 1: İhtişama Sakin Adımlarla Giriş (Ahşap Yürüyüş Yolu)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Milli Park gişesinden çok cüzzi bir ücret ödeyerek içeri girdiğinizde, kanyonun duvarlarına dışarıdan devasa demirlerle tamamen çakılmış, altından coşkun ve gürül gürül bembeyaz köpükler atan nehrin aktığı harika bir "Ahşap Asma Yoldan" (Boardwalk) 200 metre kadar yürümeye başlarsınız. Kanyonun sarp ve 300 metrelik dar kayalıkları üzerinize doğru kapanırken güneş bir anda kaybolur ve yerini çok net 15 derecelik bir buzdolabı serinliği alır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Burası en konforlu ve hiçbir efor gerektirmeyen kısımdır. Eğer anne-babalarınız veya çok küçük bebekleriniz pusetle kanyona geldiyse, sadece bu ahşap yolda yürüyüp hiçbir tehlikeye ve ıslanmaya maruz kalmadan ihtişamlı kanyon ağzında o devasa doğanın fotoğraflarını çekip güvenli alanda doğayla bütünleşebilirsiniz.</p>

<img src="/images/articles/saklikent_placeholder_1.png" alt="Saklıkent kanyonunda sarp kayalara çakılmış, ailenin yürüdüğü ahşap asma Boardwalk yolu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="buz_su_gecisi">Etap 2: Macera Başlıyor (Buz Gibi Tatlı Nehri Çığlıklarla Geçmek)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Ahşap asma yolu bitirdiğinizde "Kanyon Meydanı" / Göze (Su Pınarı) denilen geniş çakıllı bir alana varırsınız. Okyanus kadar heybetli dağların ortasındaki bu vadinin daha iç dünyasına ilerlemek yürüyüş rotasında (Trekking) daha derinlere dalmak istiyorsanız; tam karşınızda bel hizasında inanılmaz bir debi (hız) ile akan o meşhur bembeyaz tatlı nehir suyuyla karşılaşırsınız.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Burada şortlarınız, mayolarınız ve deniz ayakkabılarınız sahneye girmelidir çünkü kanyonun içine devam edebilmek için bu suyu karşıdan karşıya (Yaklaşık 15-20 metrelik bir geçiş) ıslanarak yaya geçmek <strong>Zorunludur</strong>. Su Dağlardan tamamen eriyen karların mağaralardan çıkmış halidir ve derecesi 5-8C santigrat civarındadır (Yani resmen buzdolabı kadar Soğuktur!). Suya ayağınızı attığınızda etraftaki turistlerin çığlık atışları, kahkahaları vadide devasa bir eko yapar. Göbek hizanıza gelen bu deli suyu, güvenlik halatlarına (iplerine) tutunarak adım adım karşırıya geçtiğinizde, bacaklarınızın hissizleştiği o eğlenceli "Shock Therapy" anına inanamayacaksınız.</p>

<h2 id="ic_kanyon_trekking">Etap 3: Dev Kanyonun Karanlığına Yürüyüş ve Eğlenceli Çamur Banyoları</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Buz suyu başarıyla, çığlıklar atarak aşıp büyük adaya (kanyonun düz kumlu tabanına) ayak bastığınızda uyuşan ayaklarınız beş dakika içinde inanılmaz ısınacak ve rahatlayacaktır. Artık kanyonun daha loş, kıvrımlı ve güneşin asma yapraklarından bile zor girdiği o derin, sükunet dolu, milyon yıllık pürüzsüz kayalıklarının yavaşça arasına daldınız. Genelde buradaki kum tabanlı alanın yürüyüşü çok rahattır. (Yaklaşık 1-1,5 km kadar içeri rahatça yürünebilir).</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Yürürken hemen kenarlardaki kilden kayalardan şifa amaçlı "Sarı-Beyaz Çamur" akan küçük havuzcuklar göreceksiniz. Gençlerin, çocukların ve turist kitlelerin bu şifalı organik kili (Natural Mud) yüzlerine ve vücutlarına eğlencesine sürdüğü, fotoğraflar çektiği, dev kayaların labirentleri arasında adeta bir Indiana Jones film setinde geziyormuşsunuz hissini tam olarak alırsınız. Eğer ileri seviye donanımlı bir dağcı (Mountaineer) değilseniz ve başınızda baret yoksa; ilk derin suların (Küçük şelalerin) başladığı yer olan 2. Kilometreden sonra daha fazla içeriye devam etmeyerek; ailenizle tekrar aynı yoldan (Suda oynamaya ve ıslanmaya doymadan) bu sefer dönüş keyfini yaşarsınız.</p>

<img src="/images/articles/saklikent_placeholder_2.png" alt="Sarp ve yüksek Saklıkent kanyon kayaları arasında buz gibi suyun içinden yürüyen turistler ve çamur sürmüş gezginler" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="yeme_icme_su_ustu">Dinlenme Ritüeli: Şırıl Şırıl Akan Su Üstü Köşklerinde Balık ve Gözleme Mola Ziyafeti</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Kanyon yürüyüşünü tamamlayıp gişelerden geri ahşap yolla tekrar güvenli kapıdan dışarı ana otopark ve kafe alanına çıktığınızda (Efor ve soğuk sudan ötürü) kurtlar gibi acıktığınızı (Tükenmişlik hissiyatı) fark edeceksiniz. Saklıkent Milli Parkının hemen çevresi, asıl vadiden fışkırıp aşağı uzanan nehrin suları üzerine devasa direklerle ve ahşaplarla kurulmuş otantik Yörük çadırı veya Doğa Tesislerinde (Riverside Restaurants) yeme içme imkanlarıyla doludur.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Ayakkabılarınızı çıkartır, yere serilmiş oklava minderli ve altından suyun şırıl şırıl gürüldediği geniş tahta gölgelikli köşklere bağdaş kurarsınız. Tepenizde serin dev yapraklı ağaçlar vardır, hava merkez Fethiye'den her zaman 6 derece daha soğuk ve rahattır. Çoban salatası, Yöresel peynirli Gözleme (Turkish Flat Bread) ve en meşhur ürün olan kiremitte sarmısaklı taptaze "Alabalık" (Trout Fish) ya da güveçte tavuk yersiniz. Bacaklarınızı bazen suyun o tatlı serinliğine uzatıp bir çay yudumlamak, dünyanın hiçbir yıldızlı otel lüksünde bulunamayacak büyük, dingin bir Ege köyü ziyafetidir.</p>

<img src="/images/articles/saklikent_placeholder_3.png" alt="Saklıkent nehrinin buz gibi tatlı sularının üzerine kurulmuş ahşap yemek köşklerinde oturan turistler" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="karsilastirma">Ciddi Bir Tatilci İkilemi: Orijinal Saklıkent Kanyonu mu, Yoksa Gizlikent mi? (Karşılaştırma)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Milli parka tam yaklaşırken aracınızın önünü tabelacılar kesip sizi "10 kat daha güzel olan şelaleli Gizlikent Şelalesine (Secret Gorge)" davet ederler. Gurbetçi veya lokal misafirler sıklıkla çok büyük kafa karışıklığına düşer. İşte harita üstü profesyonel analiz; karar sizin:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Temel Kıyas</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Saklıkent Kanyonu (Resmi Olan Ana Milli Park)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Gizlikent Kanyonu (Yakınlarındaki Bölgesel Şelale)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Arazi Formasyonu ve Uzunluk</td>
        <td class="py-4 px-6 text-sm text-gray-700">Türkiye'nin en efsanevi, en uzun (toplam 18km), kayaları en yüksek ve en sarp, devasa ana kanyon yarık bölgesidir.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Çok daha yeşil yapraklı, ormanlık ve kanyon yapısından ziyade dar ve kısa nehir yatağı olan alternatif kardeş vadidir.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Ulaşım - Yürüme (Fiziksel Efor)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Suyun ortasından halatlarla birazcık zorlu geçiş ister ancak ondan sonrası tamamen kumlu düz ve konforlu zemindir.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Aşağıya inmek (ve dönüş) için ormanın içinden yüzlerce ahşap basamak ve merdiven inip/çıkmak ciddi kondisyon ister.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Zirve Noktası (Ödül)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Zirvesi bitmez, sadece büyüleyici pürüzsüz dev dağ duvarlarının labirenti arasındadır. Gizemlidir, Indiana Jones hissiyatı verir.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yolculuğun ödülü, nehrin en ucundaki muazzam gürül gürül atan bir "Şelaledir (Waterfall)" ve altına soğukla girmek bedavadır.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">Turist Yoğunluğu Konumu</td>
        <td class="py-4 px-6 text-sm text-gray-700">Global olarak bir mega yıldızdır, yazın "Aşırı (Extreme) Kalabalık" kitleler barındırır. Çin'den Avrupaya her dilde uğultu vardır.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Daha sessiz, genelde doğa aşıklarının girdiği, daha huzurlu ve az bilinen (Gizli) yeşil vadi kalabalığına sahiptir.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="tuyolar">Kanyonu Güvenli ve Acısız Geçmenin 'Özel Outdoor' Tüyoları (Checklist)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Basit bir plaj değil; dünyanın en güçlü dağ yapılarından birine giriyorsunuz! Doğa her zaman o güçlü sürprizini yapar. Yanlış ayakla basmamak ve kanyon zevkini ağrılara terk etmemek için Fethiye halkının gizli altın kuralları listesi:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">🩴</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Parmak Arası Terlik Cinayeti (En Büyük Yaralanma Hatası)</span>
            <span class="text-gray-700 text-base leading-relaxed">Tatil köyünde giydiğiniz veya kumsalda kum atmadığını düşündüğünüz o dümdüz, incecik parmak arası (Flip-Flops) hafif plaj terlikleriyle o "Buz gibi halatlı sudan" asla karşıya ayak basmayın! Su o kadar soğuktur ki, beş saniye sonra sinirleriniz ayağınızı hissetmeyi bırakır; terlik kopar, gider, ve siz suyun altındaki dev kayalık çakıllara basıp çok ciddi kesik ve ayak bileği yaralanmasıyla kanyonu ağlayarak bitirirsiniz. Ya sıkı bağcıklı eski bir ıslanacak spor (Trekking) ayakkabısı alın, ya da en kötü ihtimal gişelerden kalın plastik deniz/nehir (Jelly shoes) ayakkabısı kiralayın.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">🎒</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Cüzdan, Elektronik Anahtar ve Su Geçirmez Çanta Güvenliği</span>
            <span class="text-gray-700 text-base leading-relaxed">Unutmayın, o suyu (Ana kanyon geçiş deşarjını) geçerken belinize kadar hatta şort/etek boyunuza kadar suyun içine gömüleceksiniz (İster istemez ısancaksınız). Cepte unutulan o son model akıllı telefonlar (iPhone vs.), kiralık aracın çipli elektronik son model anahtarları veya kağıt para ve banknotlar tamamen o buzlu suyun dibini boyluyor. Aracınızın anahtarını yüksek fermuarlı omuz / veya boyun hizası Dry Bag (Su Geçirmez Çanta kılıf) içine muhakkak almayı asla unutmayın.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">☀️</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Kıyafet Tercihi: Neden Bikini, Neden Çıplak Gezilmez?</span>
            <span class="text-gray-700 text-base leading-relaxed">Kanyonun içerisi (Yürüyüş etapları) plaj değildir. Güneş dik açıyla dağların arasından sadece çok kısa bir süre vurduğu için, su çok soğuk ve içerisi tamamen loştur, esintilidir. Erkekler olarak üstsüz girmeden çok basit bir tişört, kadın misafirler içinse sadece açık bir bikini yerine üstüne geçirecek ince, kuruyan (Dry-Fit) bir şort-Atlet giymek sizi hem uçan ufak sineklerden koruyacak hem de sıcak kumla bir anda üşütüp o ağır titreme krizlerine sokmayacaktır.</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Dağların buzullardan koptuğu gibi akıp gelen sularıyla şoklanmak, <a href="/guide/kelebekler-vadisi-rehberi-fethiye-ulasim" class="text-blue-600 hover:text-blue-800 underline transition-colors">tatlı sularda yürüyerek tatilinize organik bir Survivor aksiyonu eklemek</a> ve tüm gün tuzu yuttuğunuz plajların sıcağına tam bir meydan okumak... Saklıkent Kanyonu sadece fotoğrafı uzaktan çekilip geri dönülecek (günübirlikçiler) bir turistik gişe eseri değil, ailecek bağdaş kurup köy peynirli organik Ege gözlemesi yediğiniz doğanın gerçek ruhani bir yeryüzü mirasıdır. Fethiye'nin ve Antalya sınırının tam kesişimindeki bu saklı buz cehennemine girmek, bir daha Türkiye'de ve yaz mevsiminde asfalttan korkmamanızı garanti eder. Keyifli orman serinliği adımları dileriz!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 8/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Saklikent Gorge Guide: The Icy Cold Canyon", tr: "Saklıkent Kanyonu Gezi Rehberi: Buz Gibi Sularla Tam Gün" },
        slug: "saklikent-kanyonu-gezi-rehberi-fethiye-selale",
        slug_en: "saklikent-gorge-canyon-guide-fethiye",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/saklikent_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye Saklıkent kanyonu giriş ve gezi rehberi. Nehir yürüyüşü, çamur banyosu ve restoran fiyatları. Gizlikent mi Saklıkent mi kıyaslaması.",
            en: "Ultimate SEO guided Fethiye Saklikent Gorge and Canyon travel guide. Tips for hiking the icy river, mud baths, and comparing Gizlikent Waterfall."
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
