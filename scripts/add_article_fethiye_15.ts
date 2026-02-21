import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleContentStr = `
<h2>Fethiye'nin En İyi Instagram ve Fotoğraf Noktaları: Profesyonel İçerik Üretici (Influencer) Rotası</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Kabul edelim; artık yaz tatillerinin başarı kriteri sadece ne kadar dinlendiğinizle değil, o muazzam tatili dijital dünyada (Instagram, TikTok, Reels) arkadaşlarınıza veya takipçilerinize ne kadar "Epik ve Destansı" (Cinematic) yansıtabildiğinizle de ölçülüyor. Fethiye; sarp dağlarının denize o dikine indiği akılalmaz coğrafyasıyla, metrelerce yükseklikten denizin dibine kadar uzanan "Renk Kontrastları" sayesinde tüm Türkiye'nin ve hatta Avrupa'nın tartışmasız en 'Fotojenik' (Instagrammable) turizm merkezlerinden 1 numaralı olanıdır. Dünyaca ünlü seyahat dergilerinin kapaklarını süsleyen o uçsuz bucaksız Mavi Lagün veya uçurum kenarındaki salıncak fotoğraflarının hepsi işte bu kusursuz Ege-Akdeniz birleşim hattında çekilir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Ancak elinizdeki iPhone (Mükemmel Kamera) veya Drone (DJI) tek başına bir işe yaramaz. Mükemmel "Travel (Seyahat)" karelerini yakalamak için, ışığın o sihirli olduğu doğru açıda (Golden Hour vs Blue Hour) doğru tepede olmanız gerekir. Sıradan turistlerin gittiği kalabalık <a href="/guide/fethiyede-en-iyi-plaj-ve-koy-secimi" class="text-blue-600 hover:text-blue-800 underline transition-colors">Ölüdeniz Belcekız kumsalında</a> veya güneşin çoktan tepeye dikildiği korkunç ışıkta o mucizevi efsane pozu (Viral olacak o içeriği) asla ve asla çıkaramazsınız. Kamera lensinizi Fethiye'de sıradan şezlonglara değil, medeniyetin ve vahşi doğanın kusursuz birleştiği o çok spesifik, sarp gizli koordinatlara çevirmeniz gerekir.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-8">Eğer tatilden dönerken galerinizde sıradan deniz 'Selfieleri' değil, uluslararası seyahat Bloggerlarının (Travel Influencer) imza attığı o kartpostallık "Masterpiece (Başyapıt)" görsellerle dönmek istiyorsanız bu liste tam aradığınız sihirli haritadır. Kelebekler Vadisi'ne o meşhur yüksek uçurum kenarı açısından nerede bakılır? Şemsiyeli sokak ve tarihi harabelerde ışık oyunu saati nedir? En kusursuz arama motoru optimizasyonuna sahip (SEO Focus) Fethiye Fotoğraf Lokasyonları (Content Creator Map) rehberimizle "Action" diyoruz!</p>

<img src="/images/articles/photo_placeholder_cover.png" alt="Kelebekler Vadisine devasa uçurumdan bakan sarp kayalıkta poz veren bir gezgin ve deniz" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 mb-10 shadow-sm">
    <h3 class="font-extrabold text-blue-900 text-xl mb-4">Hızlı Erişim: Fotoğraf ve İçerik Noktaları (Table of Contents)</h3>
    <ul class="list-disc pl-6 space-y-3 text-blue-700 font-medium text-lg">
        <li><a href="#kelebekler_vadisi_tepesi" class="hover:text-blue-900 transition-colors">1. O Büyük Klasik İkon: Kelebekler Vadisi Uçurum (Seyir) Zirvesi</a></li>
        <li><a href="#paspatur_semsiye" class="hover:text-blue-900 transition-colors">2. Şehrin Rengi ve Dokusu: Paspatur Eski Çarşı "Şemsiyeli Sokak"</a></li>
        <li><a href="#karsilastirma" class="hover:text-blue-900 transition-colors">Işık Rehberi Tablosu: Hangi Fotoğraf Saat Kaçta Çekilir? (Zamanlama)</a></li>
        <li><a href="#babadag_teleferik" class="hover:text-blue-900 transition-colors">3. Paragliding Okyanusu: Babadağ 1700m Seyir Terası Sonsuzluk Pozu</a></li>
        <li><a href="#kayakoy_hayalet" class="hover:text-blue-900 transition-colors">4. Tasavvuf ve Gizem: Kayaköy (Ghost Town) Harabelerindeki Kontrast</a></li>
        <li><a href="#tuyolar" class="hover:text-blue-900 transition-colors">Content Creator'lara (İçerik Üreticilerine) Fethiye Ekipman SEO Tüyoları</a></li>
    </ul>
</div>

<h2 id="kelebekler_vadisi_tepesi">İkonik 1. Numara: Kelebekler Vadisi (Butterfly Valley) Seyir Tepesi</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Google'a Fethiye yazdığınızda veya devasa uluslararası seyahat sayfalarında karşınıza çıkan milyonlarca beğeni almış (Viral olmuş) o fotoğrafı hepimiz biliyoruz: Uçsuz bucaksız, 400 metreden denize o dümdüz kılıç gibi inen dev sarp duvarlarının arasında kalan turkuaz renkli ıssız kumsala yükseklerden kuşbakışı bakan bir turist arka cephesi... İşte bu yer, <strong>Faralya Köyündeki Kelebekler Vadisi Zirvesidir (Seyir Tepesi)</strong>. Bu manzaraya asla tur tekneleriyle aşağıdan ulaşamazsınız; <a href="/guide/fethiye-butce-planlayici" class="text-blue-600 hover:text-blue-800 underline transition-colors">kendi aracınızla</a> veya dolmuşla Ovacık dağlarından Faralya istikametine virajları dönerek "Göklerden" ulaşmak zorundasınız.</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Yol kenarındaki kayalıklara (veya manzaralı butik yörük kafelerine) geldiğinizde aşağıya (uçuruma doğru) kameranızı uzattığınız an vizörden giren o dev V (V-Shape) şeklindeki kanyon ve vadinin turkuaz suyu bir mucizedir. <strong>Kritik Uyarı:</strong> Son yıllarda sosyal medya hevesiyle bu kanyonun o sarp taşlarına (Güvenlik şeridini izinsiz geçerek) aşırı uca kadar tırmanan yeteneksiz turistlerin düşme vakaları (Fatal Accidents) çok artmıştır! Mükemmel pozu güvenli bir uçurum kafesinin terasından (veya çok güvenli geniş asfalttan) uçuruma o ölümcül yaklaşımı yapmadan da Geniş Açı Lensiyle (Wide Angle Lens - x0.5) mükemmel olarak kadrajınıza çok güvenle alabilirsiniz.</p>

<img src="/images/articles/photo_placeholder_1.png" alt="Faralya köyünden 400 metre yüksekten uçurumdan Kelebekler vadisi kumsalını kuşbakışı çeken devasa dağ manzarası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="paspatur_semsiye">2. Şehir Hayatı (Urban Vibe) Dokusu: Fethiye Paspatur ve Şemsiyeli Sokak</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Sürekli deniz, tuz ve orman (Nature Photography) çekmekten galeriniz biraz "Yeşil Mavi" ağırlıklı standart kalıba girdiyse, tatilinize o Akdeniz'in şirin İtalyan (Amalfi) kasaba dokusunu renklendirmek için rotanızı tam <strong>Fethiye Merkez Tarihi Çarşısı olan Paspatur'a</strong> çevirmelisiniz. Paspatur, arnavut kaldırımlı dar eski korsan sokaklarının, duvarlarından inanılmaz begonviller fışkıran ahşap Osmanlı mimarili konakların olduğu efsanevi eski şehirdir (Old Town).</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Çok özel olarak bu dar sokakların birinde, kafelerin üzerine baştan sona gökyüzünü kapatacak şekilde asılmış rengarenk "Şemsiyeler Sokağı (Umbrella Street)" vardır. Bu nokta, özellikle <a href="/guide/fethiyede-cocukla-tatil-kisabir-rehber" class="text-blue-600 hover:text-blue-800 underline transition-colors">çocuklu tatilcilerin</a>, çiftlerin ve renk sever içerik üreticilerinin (Food & Travel Bloggers) ana stüdyosu gibidir. Sabah erken saatte (9-10 suları) güneydoğudan vuran hafif ışıkla bu sokağa daldığınızda; şemsiyelerin o pastel renkleri (Gölge ve Işık oyunlarıyla) zemindeki tarihi taşlara öyle bir düşer ki devasa ve muazzam organik bir fotoğraf stüdyosu elde edersiniz.</p>

<h2 id="karsilastirma">Işık Haritası (Lighting Algorithm): En Kusursuz Fotoğraf Hangi Saatte Çekilir? (Tablo)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-4">Milyonluk o kameraları elinize aldığınızda en devasa lens değil, 'Güneşin Açısı' kaliteyi belirler. Doğru mekana yanlış ışıkta giderseniz o içerik çöp (Burned/Under-exposed) olur. İşte profesyonel saat cetvelimiz:</p>

<div class="overflow-x-auto my-8">
  <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead class="bg-blue-100">
      <tr>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Lokasyon ve İçerik Noktası</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">En İyi ('Golden') Işık Saati</th>
        <th class="py-4 px-6 text-left text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b">Işığın Açısal Nedeni (Photography Reason)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">1. Kelebekler Vadisi Seyir Tepesi</td>
        <td class="py-4 px-6 text-sm text-gray-700">Sabah Erken (08:30 - 10:30) Arası veya Tam Zirve Öğle (13:00)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Güneş arkanızdan kanyona vurmalı ki, o denizin dibindeki inanılmaz 10 metrelik 'Turkuaz (Cam)' berraklık yansısın. Akşamüstü kanyon duvarı tamamen 'Kapkara' gölge yapar.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">2. Mavi Lagün (Ölüdeniz Kumburnu Sahili)</td>
        <td class="py-4 px-6 text-sm text-gray-700">Öğle Saati (12:00 - 15:00) veya Drone çekimi için (Tam Dik Açı)</td>
        <td class="py-4 px-6 text-sm text-gray-700">O beyaz dev kum tabanının denizden tropikal renk patlaması (Maldiv efekti) yapması için güneşin %100 tam tepede hiçbir gölgesiz parlak yansıması şarttır.</td>
      </tr>
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-4 px-6 text-sm font-bold text-gray-900">3. Çalış Plajı ve Şövalye Adası</td>
        <td class="py-4 px-6 text-sm text-gray-700">Golden Hour (19:30 - 20:30 Arası) <a href="/guide/fethiyede-en-iyi-gun-batimi-noktalari-sunset" class="text-blue-600 hover:text-blue-800 underline">Güneş Batarken</a></td>
        <td class="py-4 px-6 text-sm text-gray-700">Güneş batı ufkunda o denize tam değdiği saniyede devasa bir portakal (Orange filter) kızıllığı yaratır. Ters gölge (Silhouette) tarzı efsane pozu veren yegane tek saat dilimidir.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="babadag_teleferik">3. Sky-High İllüzyonu: Babadağ Seyir Terasları ve 'Sonsuzluk (Infinity)' Yansımaları</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Bir diğer efsanevi "Vay canına (WOW)" pozu, deniz seviyesinden fersah fersah yukarıda (Zirvelerde) atılır. Hiç efor sarf etmeden inanılmaz lüks Teleferik (Cable Car) ile o ulaştığınız <strong>Babadağ 1700m veya 1900m zirveleri</strong> sadece <a href="/guide/fethiye-babadag-paragliding-guide" class="text-blue-600 hover:text-blue-800 underline transition-colors">Yamaç paraşütleri atlamak için</a> değil, sosyal medya içerikleri için dizayn edilmiş dünya ovası bir sahnedir. Zirvedeki restoranların mimarisi, uçurumun tam kenarına inşa edilmiş dev uzun "Sonsuzluk Şeffaf Cam Terastır" (Infinity Glass Deck).</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Siz uçurum kenarındaki bu dekoratif dev tahta salıncaklara oturup gökyüzüne doğru (Arkadan) çekildiğinizde; o devasa Ölüdeniz lagünü, okyanus ufku ve bulutlar birleşip sanki 'Tanrıların Dağında (Mount Olympus)' bir lüks tahtta oturuyormuşsunuz efsane algısını kurgular. Eğer bir Drone (DJI vb.) uçurursanız ve de <a href="/guide/fethiyeye-ne-zaman-gidilir-hava-durumu" class="text-blue-600 hover:text-blue-800 underline transition-colors">Havanın Eylül (Bulutsuz) dönemindeyseniz</a>; kadrajınıza sadece siz değil etrafınızdan sessizce kanat açıp süzülen 10'larca rengarenk o büyük paraşüt bezleri de eklenerek adeta bir festival tablosu yaratır.</p>

<img src="/images/articles/photo_placeholder_2.png" alt="Babadağ zirvesi cam teraslarında oturan bir turistin arkasından uçan yamaç paraşütlü bulutlu gökyüzü manzarası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />

<h2 id="kayakoy_hayalet">4. Tarihi Melankoli (Dramatic Vibes): Kayaköy Hayalet Kasabası (Ghost Town)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">"Deniz mavisi iyi güzel ama benim Instagram kitleme (Profilime) biraz hikaye, eski yıkıntı, "Vintage" bir estetik lazım" diyen seçici (Niche) içerikçiler ve sanat akımı tutkunları için Fethiye'nin en dev silahı The Ghost Town yani <strong>Kayaköy (Karmylassos)</strong> dağ yamacıdır. Eski Rum mübadele yıllarında tamamen boşaltılıp terk edilen; çatıları olmayan ve sarımtırak kireçtaşı yamaçtan aşağı labirent gibi akan yüzlerce harap antik ev kalıntısı!</p>

<p class="text-lg text-gray-700 leading-relaxed mb-6">Günün erken çok sessiz sabah saatlerinde veya ışığın çok acı (Sert) olduğu saatlerde (Contrast Photography) siyah kırık beyaz/krem taşların üstüne çıkıp, o kapısız bomboş odaların dev pencerelerinden ufku çektiğinizde; içeriğiniz doğrudan bir İtalyan Rönesans (Filmnoir) filmi melankolizmine (Gizli Drama'ya) evrilir. Kadın içerik üreticileri için çok lüks kırmızı uzun dökümlü tek parça elbiselerle (Maxi Dress) bu kuru taş duvarların arasına o tepeye çıkıp 'Rüzgarda Uçuşan (Flowing Dress)' pozlarına imza atmak, seyahat estetiğinde alabileceğiniz en yüksek milyonluk Etkileşim (Engagement Rate) vuruşlarından birini Fethiyede size anlık kazandırır.</p>

<h2 id="tuyolar">Bir Fotoğrafçının (İçerik Üreticinin) Fethiye SEO Ekipman Sırları (Survival Checklist)</h2>
<p class="text-lg text-gray-700 leading-relaxed mb-6">Bin millik yoldan geldiğiniz o Fethiye'deki o 1 saniyelik deklanşörü veya Reels çekimini zayi ve heba etmemek için Fethiyeli Prodüktörlerin gizli listesi:</p>

<ul class="list-none space-y-5 my-8 bg-blue-50/50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm">
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">🔭</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Polarize Filtrelerin (CPL) Efsanevi Zorunluluğu: Suyun Dibini Görmek</span>
            <span class="text-gray-700 text-base leading-relaxed">Ölüdeniz veya Kelebeklere uçaçaksınız; eğer denizin o turkuaz berraklığını (Akvaryum içini) çekmek isterseniz güneş dev yansıma (Reflection) yani parlama ve beyaz ışık patlaması (Glare) yapar. Kameranıza (Telefon dahil) takacağınız lüks ufacık (20 dolarlık) bir "Circular Polarizer (CPL)" lens filtresi, suyun yüzeyindeki o ışık patlaklığını anında bıçak gibi yok eder, Fethiye'nin su altındaki şnorkelciyi kumları tamamen transparan gösterir. İçeriğinizi profesyonellere fark attıran en devasa ucuz altın sırlardan birincisidir.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">💨</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Drone Rüzgar Terapisi ve Kayıp Riski (Babadağ Uyarısı)</span>
            <span class="text-gray-700 text-base leading-relaxed">DJI veya kaliteli bir Drone uçağınız varsa, özellikle Fethiye'deki <a href="/guide/likya-yolu-fethiye-baslangic-parkurlari-rota" class="text-blue-600 hover:text-blue-800 underline">Kelebekler Vadisi zirveleri (Ovacık - Faralya)</a> veya Babadağ 1700mt tepelerinden uçarken 'Aşağıdan yukarı vuran Termal Rüzgarlara (Updraft Winds)' çok ağır muhatap kalırsınız. Sinyali kaybettiğiniz an Drone cihazı rüzgarın gücüyle sarp dağlara çarpar ve sonsuza dek Akdeniz uçurumlarında kaybolur. Dronu denize çok paralel değil, yüksek irtifada "Rüzgar Uyarılarını (Wind Warning) Gördüğünüz Saniye" derhal sport moda alıp ana kayaya güvenle acilen çekin.</span>
        </div>
    </li>
    <li class="flex items-start bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="text-blue-600 font-bold text-2xl mr-4 mt-1">☀️</span>
        <div>
            <span class="text-gray-900 font-bold text-lg block mb-1">Objektif (Lens) Buğusu Cehennemi (Condensation Trap)</span>
            <span class="text-gray-700 text-base leading-relaxed">Otelinizdeki veya kiralık özel klimanız Temmuz-Ağustos ayında -18 derece buz gibi de üfürüyorken; sabaha karşı o dışarıdaki 35 derece olan Mükemmel Fethiye neme, o soğuk odadan (buzdolabından) kameraları direkt çıkarttığınız o an; bütün pahalı dev lensleriniz ve telefonunuz saniyeler içinde kalın su/beyaz buğusu tutar (Fogging). O efsane manzaraya vardığınızda ilk 25 dakika silseniz dahi çekim yapamazsınız. Buna mani olmak için otelinizden o harikalar diyarına çıkmadan en az yarım saat evvel, çekim çantasını klimalı odadan alıp o kavurucu normal banyoya / sıcak açık dış odaya asıl Fethiye ısısına alışsın diye güvenle uyum süreci (Acclimatization) için mutlak dev bırakın!</span>
        </div>
    </li>
</ul>

<p class="text-lg text-gray-700 leading-relaxed mb-6 border-t border-gray-200 pt-8">Şezlonglarda güneşlenirken dinlenen bedeninize inat; kadrajınızla ve yarattığınız (Çektiğiniz) o efsane videolarla Fethiye sınırlarını aşıp dijital dünyanın kalbinde, tüm dost yelpazenize ölümsüz bir Likya vizyonu sunmak artık sizin o elinizdedir. 15 Makale 100 günlük dev maratonluk Fethiye algısının finalinde şunu asla unutmamanız gerekir: Fotoğraflar çok lüks, sosyal medya algoritması (Likes) mükemmel olsa dahi; Fethiye'nin rüzgarı telefonunuzla kameranızdan öte asıl asıl sizin zihninize, içinize o kokusuyla kaydolmalıdır! En viral uçurum yansıma pozlarında ve en iyi ışıklarda, mutlu ve organik çok lüks pozlarla muazzam vizyoner iyi tatiller dileriz!</p>
`;

async function insertArticle() {
    console.log("Starting script to insert article 15/15...");
    const words = articleContentStr.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').split(' ').length;
    console.log("Estimated Word Count:", words);

    if (words < 1800) {
        console.warn("WARNING: Word count is under 1800. Adhere to guidelines before prod!");
    } else {
        console.log("Word count requirement met successfully!");
    }

    const newArticle = {
        title: { en: "Best Instagram and Photo Spots in Fethiye Route", tr: "Fethiye İçerik ve Instagram Fotoğraf Rotası: En İyi Çekim Noktaları Haritası" },
        slug: "fethiye-icerik-fotograf-rotasi-instagram",
        slug_en: "best-instagram-photo-spots-fethiye-guide",
        content: { tr: articleContentStr },
        location: { tr: "Fethiye" },
        // Temporary placeholder image URLs mapping
        cover_image_url: "/images/articles/photo_placeholder_cover.png",
        meta_description: {
            tr: "Fethiye'nin en iyi Instagram fotoğrafı nerede çekilir? Kelebekler vadisi seyir zirvesi, Babadağ sonsuzluk terası ve SEO odaklı şemsiyeli sokak ışık rehberi.",
            en: "Ultimate Fethiye Instagram and photography SEO guide list. Find the best spots: Butterfly Valley viewpoint cliff, Babadag glass terrace, and Ghost Town."
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
