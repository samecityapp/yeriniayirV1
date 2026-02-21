import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye’de Araçsız (Arabasız) Tatil Rüyası: Özgürlük, Rahatlık ve Konforun Formülü</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Yurt dışında yaşayan ve Türkiye'ye tatile geldiğinde direksiyon sallamaktan, park yeri aramaktan veya kilometrelerce bilmediği yollarda stres yapmaktan yorulan misafirlerimiz için Fethiye, sadece eşsiz doğal güzellikleriyle değil, sunduğu inanılmaz pratik ulaşım altyapısıyla da kelimenin tam anlamıyla bir tatil cennetidir. Avrupa'nın her noktasında alışık olduğunuz o tıkır tıkır işleyen pratik toplu taşıma mantığının, sıcak Akdeniz güneşi, muazzam körfez manzaraları ve güler yüzlü Türk insanıyla birleştiğini hayal edin. Evet, Fethiye'de araba kiralama zorunluluğu, yakıt masrafı veya trafik çilesi olmadan da, hayatınızın en dinlendirici ve her gizli köşeyi layıkıyla keşfettiğiniz kusursuz tatilini yapmanız son derece mümkündür.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Yurt dışından gelen birçok misafirimiz başlangıçta haklı olarak şu endişeleri taşır: "Acaba arabamız olmadan sadece seçtiğimiz otelde veya belirli bir sahilde mi hapsoluruz?", "O hep fotoğraflarını gördüğümüz Kelebekler Vadisi'ne, Göcek koylarına, yüksek rakımlı Saklıkent'e nasıl gidebiliriz?" Aslında Fethiye'nin coğrafyası, yerel ulaşım ağları olan sık aralıklı dolmuşlar, deniz üzerinden kuğu gibi süzülen su taksileri ve harika kordon boyunca kilometrelerce uzanan yürüyüş bantları ile öylesine entegre edilmiştir ki, aracınızın olmaması burada bir handikap değil, aksine stres atmak ve manzaraya doymak için harika bir fırsata dönüşür.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Bu devasa ve kapsamlı rehberimizde, Fethiye tatiliniz boyunca şoförlük yapmayı reddeden, yön bulma ve navigasyon stresi çekmek istemeyen, trafikte tatil enerjisini tüketmektense dolmuş köşelerinde manzarayı seyretmeyi veya teknede kitap okumayı seçen değerli misafirlerimiz için "Araçsız Mükemmel Fethiye Tatili"nin sırlarını tamamen deşifre ediyoruz. Havalimanından pırıl pırıl indiğiniz o ilk andan, evinize yenilenmiş ve neşeyle döneceğiniz son saniyeye kadar ihtiyacınız olan tüm ulaşım dinamikleri ve gizli formüller bu yazıda detaylıca yer buluyor.</p>

<img src="/images/articles/fethiye_carfree_cover_1771612595054.png" alt="Fethiye'nin yemyeşil dağ yollarında süzülen yerel renkli dolmuşlar ve Akdeniz manzarası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Yerel Kültürün Samimi Bir Parçası: Fethiye Dolmuş Sistemi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Sıradan Bir Taşıma Değil, Her Koya Ulaştıran Tatil Konforu</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Türkiye'nin sahil yöreleri ve tatil köylerine özgü o meşhur "dolmuş" kültürü, Fethiye'de çok daha organize, modern ve tıkır tıkır işleyen çok daha şık bir düzlemde hizmet verir. Fethiye Merkez, Çalış Plajı, yüksek rakımlı Hisarönü, villalar bölgesi Ovacık ve efsanevi Ölüdeniz sahili arasında yazın yüksek sezonunda (özellikle Haziran, Temmuz, Ağustos aylarında) neredeyse her 5 dakikada bir hareket eden klimalı, yenilenmiş modern minibüsler mevcuttur. Eğer yaz tatili için konaklama "merkezinizi" Hisarönü gibi bir ara geçiş noktası veya Çalış Plajı gibi düz bir alan olarak belirlediyseniz, Fethiye'nin en meşhur turistik noktalarına aktarmasız, yorulmadan ve Avrupa standartlarına göre inanılmaz ucuz fiyatlara, çok büyük bir kolaylıkla erişebilirsiniz.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Unutmayın ki Fethiye'de dolmuşlar sadece "A noktasından B noktasına gitmek" demek değildir; aynı zamanda Fethiye'nin dağlık ve denize dik inen zorlu virajlarından yavaşça dönerken camdan içeri giren o inanılmaz ferah çam esintisiyle bölgeyi "geniş bir pencereden" seyretme lüksüdür. Kendi aracınızda navigasyona, dar yollara ve trafiğe odaklanmak zorundayken, dolmuşta eşinizle dostunuzla neşeyle sohbet edebilir, kulaklığınızı takıp müziğinizi dinleyebilir ve aşağıda uzanan turkuaz suları oldukça yüksek bir rakımdan hiç yorulmadan fotoğraflayabilirsiniz. Özellikle Ölüdeniz ile Hisarönü rotasındaki keskin virajlar, araç kullanmaya alışık olmayanlar için hayli stresli ve yorucu olabilirken, o yolları ezbere bilen yılların deneyimine sahip dolmuş kaptanlarıyla bu seyahatler son derece güvenli ve keyifli bir dağ seyri molasına dönüşür.</p>

<img src="/images/articles/fethiye_dolmus_1771612509658.png" alt="Pembe begonviller altında Akdeniz esintili Fethiye durağı ve yerel taşıma" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Körfezi Suyla Geçmenin Romantizmi: Fethiye Su Taksileri (Water Taxis)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Deniz Üzerinde Ulaşımın En Keyifli, En Trafiksiz Hali</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye Merkez (Paspatur ve Marina bölgesi) ile ucu bucağı görünmeyen uzun kumsallı Çalış Plajı, birbirine karadan harita üzerinde büyük ve uzun bir hilal çizerek bağlanır. Merkezden Çalış'a veya Çalış'tan Merkeze karayoluyla dolmuşla gitmek elbette çok kolay ve mümkündür ancak araçsız tatilin asıl yıldızı, şüphesiz ki deniz seviyesinde yolculuk vadeden o şirin "Su Taksileri"dir. Fethiye kordonundan kalkıp, Fethiye Körfezi'nin o harika, dalgasız ve sakin sularını yararak tam manasıyla kuğu gibi süzülüp Çalış Plajı iskelesine yanaşan bu küçük geleneksel tekneler, ulaşımı sıradan bir zorunluluktan harika bir tatil aktivitesine ve romantik bir serüvene çevirir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Rüzgarın durumuna göre ortalama 30 ile 40 dakika süren bu su ve güverte rotası boyunca iskelelerde demirli devasa lüks teknelerin, milyarlık yatların arasından usulca geçer, arkanızda yükselen muazzam büyüklükteki ormanlık Babadağ eteklerini sular üzerinden seyredersiniz. Özellikle akşamüstü güneşin kızıl bir tepsiye dönüştüğü altın saatlerde (Golden Hour) Fethiye merkezden Çalış istikametine doğru yapılan bu seyahatler, misafirlere gerçekten paha biçilemez ve tamamen ücretsiz bir görsel şölen sunar. Otobüs veya taksi ücretine oldukça yakın, oldukça mütevazı bilet fiyatlarıyla her gün tarifeli olarak gerçekleştirilen bu tekne yolculuğu, Avrupa'dan gelen yabancı turistlerin Fethiye'de açık ara en çok sevdiği romantik ulaşım seçeneklerinden biridir.</p>

<img src="/images/articles/calis_water_taxi_1771612477826.png" alt="Sakin denizde Çalış Plajı istikametine giden Türk tipi ahşap su taksisi" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Adımlarla Keşfedilen Fethiye: Uzun Yürüyüş Rotaları ve Kordon Etkisi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Motor Gürültüsü Yerine Sadece Ege Rüzgarını Seçenlere Özgürlük</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Ailecek sadece yürüyerek bir kentte kaybolmayı seviyorsanız şanslısınız. Fethiye Merkez (Karagözler mevkiinden) başlayıp koca bir şehir merkezini kat ederek Çalış Plajı'nın ta en sonuna, Karataş mevkiine kadar kesintisiz devam eden Avrupa standartlarında, olağanüstü devasa bir sahil yürüyüş kordonu mevcuttur. Onlarca kilometre süren bu kordon tamamen yayalara, paten kayanlara ve bisikletlilere ayrılmıştır; otomobil stresi, korna sesi, fren sesi veya egzoz gazından arasına çekilen bariyerlerle tamamen izole edilmiştir. Sabahın çok erken saatlerinde, henüz güneş yakmazken tatlı tatlı esen rüzgarda deniz kenarında koşu yapmayı, veya bir mahalle kafesinden aldığı taze Türk kahvesini yudumlayarak sakin bir yürüyüşle deniz kenarında güneşin doğuşunu izlemeyi seven enerjik misafirlerimiz için burası tam bir yeryüzü cennetidir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Yürüyüş rotaları sadece şehrin merkezindeki bu düz ve pürüzsüz sahil bandıyla da sınırlı kalmaz. Fethiye aynı zamanda, dünyaca ünlü ve son derece prestijli Likya Yolu'nun o muazzam, nefes kesici başlangıç rotalarına ev sahipliği yapar. Hisarönü veya hemen bitişiğindeki çam ormanlarıyla kaplı Ovacık'ta konakladığınızı farz edin; otelinizden sabahın taze havasında sadece sırt çantanızla ve iyi bir çift harika spor ayakkabınızla çıkıp, devasa çam ağaçlarının içinden, araçların asla ama asla giremediği dar patikalardan, masmavi Akdeniz'e kilometrelerce yukarıdan bakan büyüleyici doğa yollarına doğrudan adım atabilirsiniz. İşte bu deneyim, herhangi bir kiralık aracın size asla sunamayacağı kadar saf ve eşsiz bir tatil rüyasıdır.</p>

<img src="/images/articles/fethiye_pedestrian_promenade_1771612494348.png" alt="Fethiye'nin palmiye ağaçlarıyla çevrili uzun, huzurlu ve geniş yaya kordonu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Denizdeki Asıl Ulaşım "Hileleri": Özel ve Butik Tekne Turları</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Asfalt Yollara Gerek Yok, En Kısa Çözüm Mavi Sularda</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Kendinize tatil dönemi için şu soruyu sorun: "Zaten oldukça sıcak olan Türkiye kıyılarında tatilde araç kiralamanın ve kullanmanın asıl amacı nedir?" Genellikle hiç kimsenin bilmediği o uzak, arabasız gidilemeyecek ıssız ve çok izole doğal güzellikteki lüks koyları keşfetmektir. Fethiye'de ise o eşsiz tabloluk koylardan bazılarına (örneğin meşhur Kelebekler Vadisi, ulaşılmaz Şövalye Adası veya 12 Adalar bölgeleri) zaten araba ile, tekerlek üstünde gitmeniz coğrafi harita yapısı gereği mümkün dahi değildir. Bu durum, araba ve cip kiralayan tatilcilerle hiçbir araç kiralamayan misafirleri Fethiye sahillerinde eşit bir düzeye çeker. Arabasız dahi olsanız, merkez kordondan veya direk Ölüdeniz plaj kumluğundan kalkan her biri farklı bir temaya (korsan, aile, lüks gulet, sessiz) sahip koylardaki tekne turları sayesinde Fethiye'nin en uzak, en bakir rotalarına neredeyse VIP kalitesinde ulaşırsınız.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Üstelik bu günübirlik lüks tekne turlarında yol bulma stresi, "nereye park edeceğim" ücret düşüncesi, hararet veya yakıt problemi yoktur. Sabah kalkar, şortunuzla şezlongunuzdan kalkıp kordondaki geniş güverteli kocaman ahşap guletinize biner ve muazzam organik zeytinyağlı taze deniz ürünleri yemeklerinin, sınırsız turkuaz renginin, bedeninize vuran serin çam rüzgarının keyfini tüm gün boyu çıkartırsınız. Bu benzersiz nedenle Fethiye, tüm Ege ve Akdeniz Türkiye sahilleri genelinde arabasız (car-free) konaklayan misafirlerin dünyadaki efsane koylara ve doğa harikalarına en kolay adapte olduğu, en ucuz şekilde en rahat ulaşabildiği en özel tatil merkezlerinin tam zirvesinde yer alır.</p>

<h2>Gece Hayatında Olası Araç Sıkıntısı: Yürüyerek Aşılan Hisarönü Avantajı</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Geceleri Trafiksiz, Tam Bağımsızlık ve Huzur</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Ailecek yapılan veya 2-3 ailenin birleştiği o kalabalık kiralık villa tatillerinde en büyük gerginliklerden biri "akşam yemeğe kim araba kullanacak", "şarabı kim içecek kim alkol almayacak", "gece o kalabalıkta koca cipi veya arabayı nereye park edeceğiz" sorunsalıdır. Eğer Fethiye tatilinizde en başından itibaren aracınız yoksa ve özellikle de konaklama tercihinizi (Base area) Hisarönü gibi bir yeme-içme-eğlence merkezine sadece 5 dakikalık yürüme mesafesinde bir otel veya villaya kurduysanız, tatilinizin akşam saatleri kelimenin tam anlamıyla stressiz geçecek demektir. Direksiyon hesabı yapmadan Ege akşamlarının o sınırsız keyfini çıkarabilirsiniz.</p>

<img src="/images/articles/hisaronu_walking_street_1771612528191.png" alt="Araç trafiğine kapalı Hisarönü merkezinde ışıklı sokaklar ve rahat restoran alanları" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<p class="text-lg text-gray-700 leading-relaxed mb-6">Hisarönü ve Paspatur (Tarihi Fethiye Eski Çarşı) bölgeleri devasa uzunlukta geniş yaya alanlarına ve sağlı sollu sayısız otantik restorana, publara ve butiklere sahiptir. Dağların eteğindeki otelinizden akşam serinliğinde yürüyerek çıkar, sevdiklerinizle dilediğinizce mükemmel akşamlar geçirip harika yöresel karışım alkollü/alkolsüz kokteyllerin tadına bakar ve gece yarısı dahi olsa hiç ulaşım stresi çekmeden, sadece ay ışığı eşliğinde yürüyerek çok kısa sürede yatağınıza dönersiniz. Tatilde böylesine esnek bir yeme-içme zaman çizelgesi yaratmak, trafiksiz ve çok kolay erişilebilir, araba zorunluluğunu kafadan ortadan kaldıran planlar yapmak gurbetçi ruhunuzu ve yorgun bedeninizi inanamayacağınız kadar dinlendirecektir.</p>

<h2>Saklıkent Kanyonu ve Uzak Tarihi Rotalar İçin Arabasız Alternatifler</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4"><strong>Tarih, Doğa ve Şelalelere Ulaşım Seçenekleri Nasıl Çözülür?</strong></p>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Elbette koca bir Fethiye coğrafyası sadece sahil veya deniz kenarıyla kısıtlanamaz. Merkezden yaklaşık 45 ile 60 dakika kadar karayolu uzaklığındaki büyüleyici bir doğa harikası olan, kilometrelerce devasa yüksek kayalıklar arasından buz gibi akan meşhur Saklıkent Kanyonu'na ya da dev heybetiyle o Likya Federasyonu'nun dağlık efsane şehri Tlos antik kentine eğer kendi aracınız yoksa gitmek isterseniz dolmuş aktarmaları (2-3 araç değiştirmek gerektiği için) sıcakta biraz yorucu olabilir. Ancak araç eksikliğinin burada da mükemmel, ucuz ve lüks bir alternatifi vardır: Ege bölgesine has tam donanımlı, yerel otantik, profesyonel rehberli lüks klimalı transferlerle yapılan butik safari veya günübirlik cip turları.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Çok cüzi ve kabul edilebilir bilet miktarlarına daha kahvaltıdan hemen sonra otelinizin lobi kapısından sizi tam saatinde alan, İngilizce/Türkçe konuşan profesyonel lisanslı rehberlerle bu uzak antik bölgeleri ve köyleri karış karış gezdiren, öğle saatindeki yemeğini muazzam doğa içindeki lüks nehir kenarı köşklerinde özenle ayarlayan A Sınıfı seyahat organizasyonları sayesinde; kiralık araçla yaşayacağınız ne lastik patlaması, ne uçurum yolları, ne de yanlış yola sapıp kaybolma stresi yaşarsınız. Özel ve çok bilgili rehberinizle adım attığınız bu devasa antik Tlos veya Letoon kentlerinde, sıradan harita okuyan turistlerin asla göremediği küçücük kalıntıların büyük hikayelerini öğrenebilir, Fethiye'nin arkasındaki o görkemli ve devasa tarihi gücü hiç zahmetsiz ama derinlikli bir biçimde, en arka koltukta uykunuzu alarak tecrübe edebilirsiniz.</p>

<img src="/images/articles/lycian_coastal_hike_1771612544023.png" alt="Likya yolunda dağların eteğinden masmavi sulara bakan huzurlu doğa patikası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2>Araçsız Fethiye Tatilini Mükemmelleştirecek Özel Stratejiler (F.A.Q.)</h2>
<div class="space-y-6 my-10">
  <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-3 text-xl">Havalimanı iniş transferini taksi olmadan nasıl güvenle aşabilirim, araba çok mu şart mıdır?</h3>
    <p class="text-gray-700 leading-relaxed">Fethiye için ana durak olan Dalaman Uluslararası Havalimanı, Fethiye merkeze karayolu ile yaklaşık 45 bazen 50 dakika uzaklıktadır ve araç kiralamak transfer için kesinlikle zorunlu değildir. Havalimanından çantanızı alıp dışarı indiğiniz an Türkiye'nin en modern ve profesyonel, son model klimalı havalimanı servisleri (Yerel Havaş ve Belediye destekli Muttaş otobüsleri) Fethiye merkeze uçak iniş saatlerine endeksli olarak çok ucuz fiyata sürekli ulaşım sağlar. Konfor ve hız arayanlar aileler ise çok uygun bedellere internetten VIP özel (Mercedes Vito vb.) transfer ayarlayarak uçak kapısından şoför ile inip, tatil lüksüne hiç araç veya kiralama stresine girmeden otel kapısına kadar çok elit ve konforlu bir geçiş yapabilirler.</p>
  </div>
  <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-3 text-xl">Küçük çocuğumuz var ve geniş tekerlekli puset (bebek arabası) kullanıyoruz, araçsız in bindi ile zorlanmaz mıyız?</h3>
    <p class="text-gray-700 leading-relaxed">Fethiye Merkez ana yürüyüş bandı, yatların olduğu Karagözler ve özellikle Çalış plaj bölgesi, bir dağ ucundan diğer kumsal uca tamamen düz, asfaltsız veya çok rahat yürünen parke taşı döşeli inanılmaz pürüzsüz yayvan yürüyüş bantlarına sahiptir. Eğer ailecek araçsız ve iki çocuk pusetiyle geliyorsanız, Ölüdeniz yokuşları veya dik Hisarönü sırtları yerine muhakkak düz ayak ve kumsal olan Çalış veya Karagözler sahil merkez noktalarında (Base area) konumlanmalısınız. Su taksileri ve yerel büyük gövdeli modern minibüslerin neredeyse tümü pusetlere de engelsiz çok kolay pürüzsüz bir erişim standartı sağladıkları için hiçbir Avrupa şehrini aratmaz, çok çok rahat edebileceğiniz ender Türk tatil ilçelerinden biri kesinlikle Fethiye ovasıdır.</p>
  </div>
    <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
    <h3 class="font-bold text-gray-900 mb-3 text-xl">Gece çok geç saatlerde Hisarönü barlardan veya plaj publarından dönerken ulaşım halen var mıdır?</h3>
    <p class="text-gray-700 leading-relaxed">Kocaman bir Evet! Yazın Temmuz ve Ağustos adlı o en kalabalık ve en yüksek sezonunda, Fethiye'nin en büyük can damarı olan Ölüdeniz-Hisarönü-Fethiye Merkez doğrultusunda durmaksızın sabaha kadar ring yapan 24 saat nöbetçi gece minibüsleri oldukça yaygındır ve turistler için hayat kurtarır. Bunun dışında Fethiye, gerçekten Avrupa kalitesinin üzerinde çalışan çok dürüst, hepsi denetimli ve çok temiz sarı renki yerel taksi durağı sistemine sahiptir. Eğer gece barlardan müziğin ardından saat 3'te mekana veda etmeyi ve geç dönmeyi seviyorsanız, Fethiye'nin hiçbir köşesinde ıssız kalmazsınız, sokaklarda kolaylıkla bir veya birkaç lisanslı yetkili sarı taksi bulabilir, tamamen güvenli, uygun fiyatlı biçimde ailecek otelinize çekilebilirsiniz.</p>
  </div>
</div>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Değerli vatandaşlarımız, memleketinizin güzelliklerini her yıl büyük bir özlemle yeniden ve sevgiyle keşfetmeye hiçbir zaman doymayan Ege tutkunu büyük sevdalılar! Fethiye'ye geldiğinizde direksiyon başındaki aracın koca bir tatilde artık bir "ihtiyaç veya kurtarıcı" değil, aslında atılması gereken büyük ve paslı ağır bir stres olduğunu bizzat kendiniz fark edecek, otoparklardan çıkışta "İyi ki ama iyi ki bu sene araba kiralamadık, park derdi çekmedik ya da trafikte saatlerce şoför kavgasının çilesine girmedik" diyeceksiniz. Klimalı veya camı açık yerel neşeli dolmuşlarda, pencerelerinden dev sığla çam ormanlarını büyük bir iştahla ciğerlerinize çekerek koklayarak geçeceğiniz, gün batımı yürüyüşte ayaklarınıza sadece kızgın Akdeniz kumlarının ve tuzunun değeceği, koca yelkenli teknelere sadece havullarınızla ve o anki rahat terliklerinizle doluşup engin mavilere kafa üstü kulaç atacağınız; dinlenmenin paha biçilemez zirvelerinde bir eşsiz tatil serüveni sizleri Fethiye kıyılarında çok büyük bir dürüstlük ve içtenlikle bekliyor! Türkiye'nin kalbine, araçsız gerçek bir Akdeniz rüyası yaşamaya şimdiden hazır olun!</p>
`;

async function insertArticle() {
  console.log("Starting script to insert article 3/15...");
  const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
  console.log("Estimated Word Count:", words);

  // Dynamic replacement of cover image string
  const finalContent = articleContentStr.replace('fethiye_carfree_cover_xxx.png', 'fethiye_carfree_cover_1771612595054.png');

  const newArticle = {
    title: { en: "Car-Free Fethiye Holiday Guide", tr: "Fethiye’de Araçsız (Arabasız) Tatil Rüyası: Özgürlük, Rahatlık ve Konforun Formülü" },
    slug: "fethiyede-aracsiz-arabasiz-tatil-plani-dolmus-taksi-yuruyus",
    slug_en: "car-free-fethiye-holiday-guide-transportation",
    content: { tr: finalContent },
    location: { tr: "Fethiye" },
    cover_image_url: "/images/articles/fethiye_carfree_cover_1771612595054.png",
    meta_description: {
      tr: "Fethiye'de araba kiralamadan harika bir tatil yapmak mümkün. Dolmuşlar, su taksileri ve yürüyüş yollarıyla eşsiz rotalara ulaşım rehberi.",
      en: "Discover how to enjoy a completely car-free holiday in Fethiye. Full transportation guide including water taxis, local dolmus, and walking trails."
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
