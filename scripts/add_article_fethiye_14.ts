import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye Bütçe Planlayıcı: Pahalı Bir Lüks mü, Yoksa Ucuz Kaçış Mı? Tam Maliyet Rehberi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Masmavi Akdeniz kıyılarında harika bir yaz tatili hayal edildiğinde akla ilk gelen soru denizinin sıcaklığı değil; genellikle "Fatura ne kadar olacak?" endişesidir. Türkiye'nin tatil pazarında Fethiye, çok ilginç ve eşsiz bir turizm ekonomik skalasına sahiptir. Bir yanda yan komşusu olan ve jet-set'in (Dünya zenginlerinin) dev mega yatlarla demirlediği Göcek varken, hemen güneydeki Kaş ve Bodrum el yakan dudak uçuklatan o meşhur şişirilmiş Lahmacun fiyatlarıyla manşetlere çıkar. Peki Fethiye bu zengin denklemin tam olarak neresindedir? Bir aile Fethiye'de servet harcamadan o rüya gibi Akdeniz tatilini %100 yapabilir mi?</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye'nin turistik ruhu; ne Bodrum'un o aşırı gösterişçi 'Show' kültürüdür, ne de sadece sırt çantalı gezginlerin (Backpacker) bedava çadır kurduğu o eski antik çağ viranesidir. Fethiye kelimenin tam anlamıyla <strong>"Bütçe Esnekliğinin (Budget Flexibility) Başkenti"dir.</strong> Eğer isterseniz <a href="/guide/fethiyede-nerede-kalinir-bolge-secim-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Faralya'daki kayalıkların</a> ucunda geceliği binlerce dolara uçurum manzaralı (Infinity pool) sonsuzluk havuzlu özel balayı odasında kalabilirsiniz; isterseniz de Çalış plajı arkasındaki halk pazarından taze balığınızı çok ucuza kendi kiralık (Self-catering) evinizin mangalında pişirebilirsiniz. Her iki bütçe türündeki tatilci de o aynı harika güneşe ve turkuaz suya ücretsiz bakar!</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Eğer tatil masraflarınızın sürpriz faturası (Hidden Costs) tatil dönüşü canınızı yakmasın, paranızın karşılığını "Lüks mü yoksa Akıllı Turizm mi?" yönünde optimize etmek istiyorsanız bu maliyet analizi tam merheminizdir. Bir kahve Fethiye'de kaça içilir? Dolmuşlar ulaşımda sizi taksi kazığından ne kadar kurtarır ve <a href="/guide/fethiye-tekne-turu-secme-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">o meşhur dev Tekne turları pazarlığı</a> nasıl yapılır? Türkiye ve uluslararası arama algoritmalarına %100 hükmeden bu mükemmel SEO Bütçe Planlayıcı haritamızla (Fethiye Budget Guide) o hesap makinelerini gururla sıfırlıyoruz!</p>

<img src="/images/articles/budget_placeholder_cover.png" alt="Fethiye restoranında masa üstünde hesap fişi ve deniz manzaralı kokteyller konsepti" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Bütçe Hesaplama İçindekiler (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#ulasim_kalemi" class="hover:text-blue-900 transition-colors">1. Ulaşım Giderleri: Havalimanı, Taksi vs. Dolmuş Minibüs Ekonomisi</a></li>
        <li><a href="#yeme_icme_bütce" class="hover:text-blue-900 transition-colors">2. Yeme ve İçme: Şık Restoranlardan Sokak Lezzetlerine (Döner vs Balık)</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Gecelik Bütçe Matrisi: Konaklama Fiyat Algoritması (Tablo Analizi)</a></li>
        <li><a href="#aktivite_ucretleri" class="hover:text-blue-900 transition-colors">3. Eğlence ve Aktiviteler: Tekne Turları ve Yamaç Paraşütü Maliyetleri</a></li>
        <li><a href="#gizli_ucretler" class="hover:text-blue-900 transition-colors">4. Şezlong ve Giriş Ücretleri (Milli Parklar Gizli Giderleri)</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Kazıklanmamak İçin Fethiye SEO Para Kurtarma Tüyoları (Checklist)</a></li>
    </ul>
</div>

<h2 id="ulasim_kalemi">1. Ulaşım (Transport) Giderleri: Havalimanı Transferinden Dolmuş Kültürüne</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Dalaman Havalimanına indikten sonra (veya otogarda) tatil bütçenizin o ilk büyük sınavı başlar. Havalimanından (Dalaman) Fethiye merkeze uzaklık takriben 45-50 dakika sürer. Eğer çıkışta sizi karşılayan o ticari <strong>Özel Taksi (Yellow Cabs) veya VIP Transfer Minibüslerine</strong> binerseniz, lüks ve konforlu bir yolculuk geçirirsiniz ancak bütçenizden tek yön için "Yüksek oranlı" bir payı doğrudan transfer ücretine vermiş olursunuz. Oysa havalimanı çıkış kapısındaki o devlet destekli devasa <strong>Muttaş veya Havaş sarı (kamu) otobüslerine</strong> binerek sadece onda biri fiyatına Fethiye ana otogara klimalı ve süper bir bütçe (Budget-Friendly) dostuyla anında varabilirsiniz.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye içerisindeki ulaşım ağı ise bir efsanedir! Taksiye (özellikle Fethiye merkezden uzak dağdaki <a href="/guide/tlos-antik-kenti-yakapark-gizlikent-fethiye-selale-rotasi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Saklıkent</a> gibi yerlere) hiç ihtiyacınız yoktur. Fethiye'de <strong>'Dolmuş' (Paylaşımlı Yerel Minibüsler)</strong> kültürü o kadar gelişmiştir ki; üzerinde "Çalış - Merkez" veya "Fethiye - Ovacık - Ölüdeniz" yazan o yeşil beyaz büyük dolmuşlarla kişi başı sadece birkaç Bozuk Para ödeyerek şehrin en uzak köşesine inanılmaz ucuza lüks şekilde (yerel halkla birlikte) gidebilirsiniz. Ulaşımda "Rent A Car (Araç kiralama)" elbette lükstür (benzin maliyeti yüksektir) ancak Fethiye'yi taksiyle gezmeye çalışırsanız, tatil kasanız anında iflas edebilir!</p>

<h2 id="yeme_icme_bütce">2. Yeme ve İçme Yelpazesi: Elit Restorandan Esnaf Dönercisine (Food Costs)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Mideniz, Ege ve Akdeniz lezzetlerine aç ancak cüzdanınız kısıtlı mı? Şanslısınız ki burası Bodrum veya Çeşme değildir. Fethiye restoran sektörü her kesime (İngiliz zenginlerden - Yerli üniversite öğrencisine kadar) hitap eden ve 3 gruba ayrılan muazzam büyük bir skala sunar:</p>

<ul class="list-disc pl-8 space-y-4 text-lg text-gray-700 mb-8">
  <li><strong class="text-gray-900 border-b border-gray-200">A) Balık Pazarı ve Lüks Marina Deneyimi (High-End):</strong> Fethiye merkezindeki (Paspatur) Balık Pazarı mükemmeldir; taze Deniz Levreklerini balıkçıdan kilogramla çiğ alır, hemen yanındaki restorana verip pişirtir, ve üzerine mezeler-rakı dahil ederseniz, burası Avrupa'daki (Yunan adaları) "Fine-Dining (Şık Yemek)" standardındadır. Faturası (Bill) tatlı bir lüks sınıfındadır (Ortalamanın epey üstü).</li>
  <li><strong class="text-gray-900 border-b border-gray-200">B) Çalış Sahil ve Hisarönü Barları (Mid-Range):</strong> İngiliz porsiyonları (Büyük İngiliz kahvaltıları, pub tarzı dev burgerler veya tepsilerce Karışık Kebaplar). Fiyatlar tam orta sınıftır. <a href="/guide/fethiyede-nerede-kalinir-bolge-secim-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Tüm turist kitlelerin %80'i</a> buralarda doyar. İki kişinin yemek ve kadeh şarabı için cüzdanda ufak bir sarsıntı yaratır ama asla iflas ettirmez.</li>
  <li><strong class="text-gray-900 border-b border-gray-200">C) Fethiye Çarşı Esnaf Lokantaları (Budget / Et Döner - Pide):</strong> Gerçek bütçe (Backpacker) dostu sihir burada başlar! Arka sokaklara çarşı içine 2 dakika saparsanız, inanılmaz taze ev yemekleri yapan 'Sulu Yemek Esnaf Lokantaları' ve Odun ateşinde Karadeniz pidesi yapan yerlerde iki kişi karnınızı muazzam ucuza ve aşırı lezzetli bir biçimde Avrupa fiyatlarının onda birine tıka basa sağlıklı şekilde doyurursunuz!</li>
</ul>

<img src="/images/articles/budget_placeholder_1.png" alt="Fethiye balık pazarında devasa karidesler ve lüks meze sofrası ile yemek yiyen yabancı turistler" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="karsilastirma">Konaklama Algoritması: Yatak Seçiminiz Bütçenizi Nasıl %300 Etkiler? (Tablo)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Oteli sadece uyumak için mi kullanacaksınız yoksa gün boyu havuzundan (ve açık büfesinden) çıkmayacak mısınız? Cüzdanı rahatlatan konaklama sınıflandırma metriğimiz (Gecelik Baz):</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Konaklama Türü Seçimi</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Bütçe Skalası (Fiyat Sınıfı)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Ne Kazanırsınız? (Avantajları)</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Gizli (Extra) Maliyetler Neler?</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">1. Mega Resort (Ultra Her Şey Dahil)</td>
        <td class="py-4 px-6 text-sm text-gray-700">En Pahalı Sınıf ($$$$)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Yemek, içki, sınırsız animasyon, dondurma masrafı sıfır (Hiç para harcanmaz).</td>
        <td class="py-4 px-6 text-sm text-gray-700">Hiç dışarı çıkmadığınız için bölgedeki tekne turlarına (Ölüdeniz vs) ayrıca ücret verip gidemezsiniz.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">2. Kiralık Müstakil Villa (Örn: Ovacık)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Orta-Üst Sınıf ($$$ - Kişi sayısına (4-6) bölünürse çok ucuzlar)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Size özel (Private) sessiz havuz, kalabalık geniş ailelerle bölüşülen muazzam uygun fiyata şans.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Kahvaltı, et/mangal ve yemek alışverişleri hep cepten ekstraya süpermarket (Market bill) gideridir.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">3. Merkez & Çalış (Oda + Kahvaltı Pansion)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Bütçe Dostu Ucuzluk ($ - $$)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Sadece yatacak harika temiz yer; tüm bütçe <a href="/guide/fethiye-tekne-turu-secme-rehberi" class="text-blue-600 hover:text-blue-800 underline">dev tekne turlarına</a> veya cip safarilere aktarılır.</td>
        <td class="py-4 px-6 text-sm text-gray-700">Öğle ve Akşam yemekleri mecburen dışarıdaki (Çarşı) restoranlarda bütçe zorlanarak yenilir.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="aktivite_ucretleri">3. Eğlence Sınırları: Dalış, Tekne ve O Meşhur Yamaç Paraşütü Fiyat Algısı</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Fethiye sadece düz bir "Şezlongda bronzlaşma" şehri değildir. O otelden mutlaka çıkıp adrenalin veya o sonsuz deniz rüzgarını alacağınız etkinliklere ödeme yapmak zorundasınız. <a href="/guide/fethiye-tekne-turu-secme-rehberi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Tekne Turları (12 Adalar veya Ölüdeniz Korsan Gemileri)</a> genelde Fethiye'deki <strong>En Ucuz ve En Değerli (Best Value for Money)</strong> tam günlük tatil etkinliğidir. Gemiye ödediğiniz o cüzi tek sabit bilete genellikle öğle yemeği (Tavuk-Makarna-Salata vs) tamamen dahildir. 7 saat boyunca adaları dolaşır ve cebinizden ekstra tek kuruş sadece içecek hariç (içkiler ekstradır) para çıkmaz, ailenize muazzam ucuz ve dev lüks bir anı bırakır.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Ancak iş dünyanın en ünlü hava sporu olan <strong><a href="/guide/fethiye-babadag-paragliding-guide" class="text-blue-600 hover:text-blue-800 underline transition-colors">Babadağ (1700m) Yamaç Paraşütüne (Paragliding)</a></strong> geldiğinde, işin rengi tamamen değişir. Bu ekstrem, hayatınızda bir kez yaşayacağınız üst düzey sivil havacılık sporu; özel bir profesyonel pilot, sigorta, dağ ulaşımı maliyetlerini içerdiğinden (ve tamamen Döviz - USD/Euro kurlarına kote olduğundan) tatil bütçenize tek seferde sağlam devasa bir delik açar. Eğer uçmayı (Skydiving / Paragliding) takıntı haline getirdiyseniz, bir aydan önceden acentanızla mutlaka nakit (Cash Discount) iskontosu için pazarlık yapın ve atlayış videosu (GoPro Photo) paketlerinin ana atlayış fiyatından hariç tutularak ekstra (Bazen çok pahalıya) satıldığını o havada şoklanarak öğrenmemek için mutlaka önceden kurala bağlayın!</p>

<img src="/images/articles/budget_placeholder_2.png" alt="Ovacık pazarında ucuz meyve sebze alışverişi yapan eli poşetli neşeli sırt çantalı gezgin turist" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="gizli_ucretler">4. Gölgede Kalan "Gizli Ücretler": Ören Yeri ve Şezlong (Beach Club) Mafyası</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Oteliniz tam pansiyon (Tam ödenmiş) olabilir ama dışarı çıkıp <a href="/guide/fethiyede-en-iyi-plaj-ve-koy-secimi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Ölüdeniz Kumburnu'nun o sığ güzel sularına</a> yürüdüğünüzde devasa gizli sürprizler sizi bekler. Mavi Lagün, bir Milli Park olduğu için "Giriş (Turnike) Ücreti" sabittir (Araçla girmek de ayrı, sadece yürüyerek girmek ayrı olarak devlete ödenir). İçeriye girdiğinizde boş bir kumsala havlunuzu sermek hala tamamen "Bedavadır" (Ücretsiz halk plajıdır). Ancak güneşten kavrulmamak için kiralayacağınız <strong>2 Şezlong + 1 Şemsiye fiyatı</strong>, bütün günübirlik plaj turistleri için en büyük sabit görünmez 'Günlük Vergi' (Daily Expense) maliyetidir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Bunun yanına bir de <a href="/guide/tlos-antik-kenti-yakapark-gizlikent-fethiye-selale-rotasi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Tlos, Kayaköy veya Letoon gibi antik kentlerin giriş biletlerini</a> (Otopark Paralarını) eklerseniz bütçe hafiften şişebilir. Çözüm mü? TC Vatandaşı tatilcilerimiz için dijital e-Devlet veya en yakın müze gişesi (Kayaköy vs) üzerinden bir 'Müze Kart' çıkartmak, tüm tatil boyunca bu kültür (Ören yeri) otopark ve müze biletleme stresini %100 maliyetsiz şekilde ve tek çırpıda resmen ve mucizevi olarak bedavaya getirir.</p>

<h2 id="tuyolar">Bir Tatilin Kredisini Korumak: SEO Odaklı 'Kazıklanmama' Tüyoları (Checklist)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Bir turistin cebindeki son parayı almanın en kolay yolu "Cahillik" (Bölgeyi Bilmemek) durumudur. Fethiye'de zengin gibi yaşayıp fakir gibi para harcamak ve enseyi karatmamak için VIP yerel lokal uzman sırları:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">💳</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Döviz ve Kur Tabelaları Oyunu (GBP/Euro Illusions)</span>
            <span class="text-gray-700 text-base leading-relaxed">Özellikle Hisarönü (Ovacık) sokaklarında gezerken menülerin tamamen İngiliz sterlini (Pound - GBP) üzerini yazıldığını sık sık fark edersiniz. Orası tamamen İngiliz misafirlerin yaşadığı lokal bir kolonidir (Little Britain). Eğer ödemeyi cebinizdeki Türk Lirası kredi kartıyla yapacaksanız, garsonun menüdeki o Pound fiyatını o günkü çok yüksek veya abartılı bir döviz makasından (Exchange Rate) rastgele kendi kafasına göre çevirmediğinden %100 emin olmadan veya adisyon gelmeden 'Biz bunu tam olarak TL nasıl ödeyeceğiz?' (Kur fiksleme) sorusunu kesin sorun. Yoksa adisyondaki astronomik yüksek fatura (TL karşılığı) size zehir zemberek bir İngiliz şoku yaşatır.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">💧</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Markette Satılan "Soğutulmuş Suyun" Plaj Matematiği</span>
            <span class="text-gray-700 text-base leading-relaxed">Plajlara (Özellikle Beach Clublara) gitmeden evvel o can alıcı büyük sıcak günde; susadığınızda plaj şezlong servisinde satılan 1 şişe suya (Veya Gazoz kola tenekesine), arka mahalledeki Bim/A101 süpermarketindeki soğutucu dolaplardan (Local Groceries) tam 8, hatta 10 katı daha fahiş astronomik fiyat ödersiniz. Tatil çantanıza sabahtan termostatlı güzel lüks bir Su şişesi/matara alıp evden soğuk suları taşımak; 7 günlük bir aile tatilinin sadece 'Su' ve 'İçecek' maliyetinden bile bir küçük akşam yemeği servetini resmen tek kalemde bedava olarak kurtarır.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">📅</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Ayların Dev Uçurumu: Bütçenin 'Sezon' Esnekliği (The Month Trap)</span>
            <span class="text-gray-700 text-base leading-relaxed">Eğer paranız kısıtlıysa (Budget Traveler) Fethiye'ye neden Ağustosun kavurucu devasa kalabalık otel zirvesinde geliyorsunuz? Sadece Eylül'ün 15'ini (Yani okulların çocuklarda açılmasını) bile beklemeniz; her türlü otel konaklamanız, uçak (Otobüs) biletiniz ve <a href="/guide/fethiyeye-ne-zaman-gidilir-hava-durumu" class="text-blue-600 hover:text-blue-800 underline">Ölüdeniz tekne turu</a> fiyatınızı anında "Yüzde 40 (Otel bazlı)" ucuzlatacaktır. Hem deniz efsane ılıktır, hem de cebinizdeki ekstra o büyük kazanım bütçesiyle hiç durmadan istediğiniz o muazzam dış restoranlarda harika birer VIP lezzet akşamı çıkarabilirsiniz.</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Tatil tamamen sizin ruhsal bütçeniz ve rasyonel zekanızdır! Fethiye sularında denize girmek Bedavadır. <a href="/guide/fethiyede-en-iyi-gun-batimi-noktalari-sunset" class="text-blue-600 hover:text-blue-800 underline transition-colors">Çalış Plajının o dünyanın en güzel efsane altın kızıl güneşinin</a> denize batışını kordonda elinde fırın taze simidiyle izleyen öğrencinin aldığı zevk, 5 yıldızlı otelin şampanyalı kral dairesindeki batan turist zevkiyle tam olarak santimi santimine denktir! Akılcı bir ulaşım ve kalacak lüks/yerel villa dengesiyle bu altın sahillere geldiğinizde, en büyük dev rüyanızı, cebinizde dönüş yolculuğuna yetecek kadar şık bolca gülümsemeyle ve güvenli bütçe ile huzurla tamamlamanız kesinlikle çok basittir. Hesaplı, mutlu ve altın harfli Akdeniz yazları!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 14/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Fethiye Budget Planner: Travel Costs and Saving Tips", tr: "Fethiye Bütçe Planlayıcı: Tam Fiyat ve Maliyet Kalemleri Analizi" },
        slug: "fethiye-butce-planlayici",
        slug_en: "fethiye-holiday-budget-planner-costs",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/budget_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye ne kadar pahalı? 2024 ve 2025 yemek fiyatları, Dolmuş ücreti, Tekne turu ve ucuz villa otel maliyetleri hakkındaki en eksiksiz SEO tatil bütçe hesaplayıcısı.",
            en: "Ultimate SEO Fethiye holiday budget planner. Is Fethiye expensive? Guide to food prices, transport, boat trips, and saving tips for smart travelers."
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
