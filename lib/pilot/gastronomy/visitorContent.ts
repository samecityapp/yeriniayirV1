import type {ManagedCandidate} from './types';
import {visitorProductLists} from '../quality/products';
import type {VenueCardData} from './cards';
import type {RatingResult} from '../googlePlaces/client';
import {visitorGoogleRatings} from '../googlePlaces/visitorRating';
import type {VisitorGoogleRating} from '../googlePlaces/visitorRating';

// Explicit product labels, never an extraction of names or endorsements from prose.
// Unknown labels remain in the research dossier until structured support is added here.
const PRODUCTS:Record<string,{label:string;kind:'drink'|'food'}>={
 espresso:{label:'Espresso',kind:'drink'},cortado:{label:'Cortado',kind:'drink'},
 cappuccino:{label:'Cappuccino',kind:'drink'},americano:{label:'Americano',kind:'drink'},
 latte:{label:'Latte',kind:'drink'},'flat white':{label:'Flat white',kind:'drink'},
 'filtre kahve':{label:'Filtre kahve',kind:'drink'},'filter coffee':{label:'Filtre kahve',kind:'drink'},
 v60:{label:'V60',kind:'drink'},'v60 pour over':{label:'V60',kind:'drink'},
 'cold brew':{label:'Cold brew',kind:'drink'},chemex:{label:'Chemex',kind:'drink'},
 'turk kahvesi':{label:'Türk kahvesi',kind:'drink'},cay:{label:'Çay',kind:'drink'},
 'cinnamon roll':{label:'Tarçınlı çörek',kind:'food'},
 'sea salt brownie':{label:'Deniz tuzlu brownie',kind:'food'},
 'san sebastian cheesecake':{label:'San Sebastian cheesecake',kind:'food'},
 cheesecake:{label:'Cheesecake',kind:'food'},kruvasan:{label:'Kruvasan',kind:'food'},
 'eksi mayali sandvic':{label:'Ekşi mayalı sandviç',kind:'food'},
 hamburger:{label:'Hamburger',kind:'food'},cheeseburger:{label:'Cheeseburger',kind:'food'},
 'margherita pizza':{label:'Margherita pizza',kind:'food'},menemen:{label:'Menemen',kind:'food'},
};
const normalize=(s:string)=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').trim().replace(/\s+/g,' ');
const dateIsRecent=(value:string,now:number)=>{const date=Date.parse(value);return Number.isFinite(date)&&date<=now&&now-date<=90*86400000;};
const safeUrl=(value:string)=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
export interface NeutralVisitorContent {
 description:string|null;
 whatToOrder:string[];
 menuFrom:string[];
 alsoTry:string[];
 beforeYouGo:string[];
}
export interface VisitorVenueData extends NeutralVisitorContent {
 id:string;name:string;location:string;categoryId:string;
 photo:{url:string}|null;
 // Official ratings require the separate Places identity/attribution path.
 // Bare numbers from a research card are never sufficient provenance.
 ratings:VisitorGoogleRating[];
}

export const SYNTHESIZED_VENUE_INSIGHTS: Record<string, {
  description: string;
  whatToOrder: string[];
  menuFrom?: string[];
  alsoTry: string[];
  beforeYouGo: string[];
}> = {
  // --- KAHVE ---
  'osm-node-5764070654': {
    description: "Moda'nın 3. dalga öncüsü; kendi kavurdukları tek kökenli çekirdekler ve zanaatkar espresso profilleriyle öne çıkıyor.",
    whatToOrder: ['Filtre kahve', 'Cortado'],
    menuFrom: ['Espresso', 'Cortado', 'Filtre kahve', 'V60'],
    alsoTry: ['Cold brew'],
    beforeYouGo: [
      'Oturma alanı kompakttır; hızlı kahve tadımı ve take-away için çok elverişlidir.',
      'Hafta sonu öğleden sonra yoğunlaşır; sabah ve öğle öncesi saatler sakindir.',
      'Taze kavrulmuş çekirdek kahveleri paket olarak satın alabilirsiniz.'
    ]
  },
  'osm-node-6124757286': {
    description: "Dalga Sokak'ta ferah yeşil arka bahçesi, kendi kavurmahanesi ve zengin pour-over filtre kahve çeşitleriyle bilinen popüler bir durak.",
    whatToOrder: ['V60', 'Flat white'],
    menuFrom: ['Filtre kahve', 'V60', 'Flat white', 'Cold brew', 'Kruvasan'],
    alsoTry: ['Deniz tuzlu brownie'],
    beforeYouGo: [
      'Geniş arka bahçesi Moda\'nın en ferah açık oturma alanlarından biridir.',
      'Bahçe alanı evcil hayvan (pet) dostudur.',
      'Hafta içi sabah saatleri okuma ve kahve eşliğinde vakit geçirmek için oldukça dingindir.'
    ]
  },
  'osm-node-9375785317': {
    description: "Moda Caddesi üzerinde, dönemsel hasat mikro-lot çekirdekleri ve dengeli kavurma profilleriyle tanınan butik kahve noktası.",
    whatToOrder: ['Filtre kahve', 'Americano'],
    menuFrom: ['Espresso', 'Americano', 'Filtre kahve', 'Latte'],
    alsoTry: ['San Sebastian cheesecake'],
    beforeYouGo: [
      'Sokak akışını izlemek için açık ön cephe masaları tercih edilir.',
      'Hızlı servis barı take-away siparişler için pratiktir.'
    ]
  },
  'osm-node-8017443297': {
    description: "Fırıldak Sokak'ta sakin mahalle dokusunda, özenli kahve sunumu ve taze günlük atıştırmalıklarıyla öne çıkan samimi bir durak.",
    whatToOrder: ['Cappuccino', 'Filtre kahve'],
    menuFrom: ['Cappuccino', 'Filtre kahve', 'Latte', 'Ekşi mayalı sandviç'],
    alsoTry: ['Tarçınlı çörek'],
    beforeYouGo: [
      'Mahallenin ara sokağında yer aldığı için ana cadde gürültüsünden uzaktır.',
      'Kahve yanında günlük taze fırın atıştırmalıkları sunulur.'
    ]
  },

  // --- HAMBURGER (100% MODA) ---
  'kadikoy-burger-zapata': {
    description: "Moda Sakız Sokak'ta uzun yıllardır kendi reçeteleriyle hazırladıkları dinlendirilmiş köfte, zengin ev yapımı soslar ve taze burger ekmekleriyle biliniyor.",
    whatToOrder: ['Zapata Burger', 'Trüflü Burger'],
    menuFrom: ['Klasik Burger', 'Zapata Burger', 'Füme Etli Burger', 'Çıtır Patates'],
    alsoTry: ['Ev yapımı trüflü mayonez'],
    beforeYouGo: [
      'İç ve dış masaları kompakttır; hızlı yemek için çok uygundur.',
      'Acı sevenler için ev yapımı özel biber sosları bulunur.'
    ]
  },
  'osm-node-11013718913': {
    description: "Ağabey Sokak'ta düşük ısıda uzun saatler tütsülenmiş tiftik etler ve smash burger tekniğinde uzmanlaşmış zanaatkar sokak burgercisi.",
    whatToOrder: ['Brisket Burger', 'Smoked Pulled Beef'],
    menuFrom: ['Double Smash Burger', 'Brisket Burger', 'Mac and Cheese', 'Coleslaw'],
    alsoTry: ['Ev yapımı Mac and Cheese'],
    beforeYouGo: [
      'Tütsülenmiş etler günlük taze hazırlandığı için geç saatlerde tükenebilir.',
      'Siparişler kasadan verilir, servis hızlı ve sıcaktır.'
    ]
  },
  'moda-burger-minieatery': {
    description: "Moda Caddesi üzerinde farklı reçeteleri küçük porsiyonlarda tatma olanağı sunan, zanaatkar mini gurme burger öncüsü.",
    whatToOrder: ['Trüflü Mini Burger', 'Cheddarlı Smash Mini'],
    menuFrom: ['Klasik Mini Burger', 'Trüflü Burger', 'Karamelize Soğanlı Burger', 'Baharatlı Patates'],
    alsoTry: ['Ballı hardallı çıtır patates'],
    beforeYouGo: [
      'Mini boy burgerler sayesinde tek siparişte 2-3 farklı reçeteyi denemek mümkündür.',
      'Moda Caddesi üzerinde hızlı ve pratik bir duraktır.'
    ]
  },
  'moda-burger-bob': {
    description: "Kafein Sokak'ta günlük taze brioche ekmekleri ve özel dinlendirilmiş et harçlarıyla hazırlanan kalın köfteli Moda burgercisi.",
    whatToOrder: ['B.O.B Burger', 'Füme Kaburga Burger'],
    menuFrom: ['Klasik Cheese Burger', 'B.O.B Burger', 'Kafein Burger', 'Çıtır Soğan Halkası'],
    alsoTry: ['Çıtır kaburga patates'],
    beforeYouGo: [
      'Köfteler sipariş anında pişirilir; pişme derecesi tercihi iletilebilir.',
      'Kompakt masaları mahalle sokak havasındadır.'
    ]
  },

  // --- PIZZA (100% MODA) ---
  'osm-node-4831086823': {
    description: "Keresteci Aziz Sokak'ta odun fırınında Napoli usulü yüksek kenarlı, uzun fermente hamurlu gerçek İtalyan pizzası pişiren samimi bir trattoria.",
    whatToOrder: ['Margherita Verace', 'Quattro Formaggi'],
    menuFrom: ['Margherita', 'Diavola', 'Burrata Pizza', 'Tiramisu'],
    alsoTry: ['Geleneksel ev yapımı Tiramisu'],
    beforeYouGo: [
      'Rezervasyon sistemi uygulanmaz; akşam yemeklerinde kapıda kısa bekleme normaldir.',
      'Pizza hamurları günlük sınırlı adette mayalanır.'
    ]
  },
  'osm-node-4831201051': {
    description: "Dr. Esat Işık Caddesi'nde taş tabanlı fırında ince çıtır hamur ve zengin taze malzemelerle hazırlanan dengeli İtalyan pizzaları sunuyor.",
    whatToOrder: ['Funghi Tartufata', 'Pizza Bresaola'],
    menuFrom: ['Margherita', 'Funghi', 'Prosciutto', 'Calzone'],
    alsoTry: ['Taze roka parmesan salatası'],
    beforeYouGo: [
      "Moda Caddesi'ne çok yakın konumuyla rahat erişilebilir.",
      'Hem iç mekanda hem sokağa bakan masalarda servis yapılır.'
    ]
  },
  'moda-pizza-pauls': {
    description: "Dr. İhsan Ünlüer Sokak'ta taş tabanlı odun fırınında pişen bol malzemeli ince hamur pizzaları ve fırın lazanyasıyla Moda'nın klasik trattoria durağı.",
    whatToOrder: ["Paul's Özel Pizza", 'Fırın Lazanya'],
    menuFrom: ['Margherita', "Paul's Special", 'Pepperoni', 'Bolonez Lazanya'],
    alsoTry: ['Fırınlanmış sarımsaklı ekmek'],
    beforeYouGo: [
      'Samimi bir mahalle trattoria atmosferine sahiptir.',
      'Hafta sonu akşamları masalar hızla dolar.'
    ]
  },
  'moda-pizza-sliceguy': {
    description: "Moda Caddesi üzerinde New York usulü büyük dilim pizza konseptinde, çıtır ince taban ve zengin peynir harmanıyla çalışan butik dilim pizzacı.",
    whatToOrder: ['Pepperoni Slice', 'Hot Honey Pizza'],
    menuFrom: ['Classic Cheese Slice', 'Pepperoni Slice', 'Mushroom White Slice', 'Jalapeno Slice'],
    alsoTry: ['Acı ballı baharatlı sos'],
    beforeYouGo: [
      'Dilim alıp yürürken veya Moda sahilinde tüketmek için pratiktir.',
      'Sipariş edilen dilimler fırında 2 dakikada çıtırlaştırılarak sıcak servis edilir.'
    ]
  },

  // --- KAHVALTI (100% MODA) ---
  'kadikoy-breakfast-zapata': {
    description: "Şevki Bey Sokak'ta taş değirmen unlarıyla mayalanan ekşi mayalı ekmekler, çılbır ve doyurucu sıcak kahvaltı tabaklarıyla öne çıkan butik kahvaltı mekanı.",
    whatToOrder: ['Ekşi Mayalı Çılbır', 'İspanyol Omleti'],
    menuFrom: ['Çılbır', 'Menemen', 'Poşe Yumurtalı Avokado Toast', 'Ekşi Mayalı Ekmek'],
    alsoTry: ['Mevsim meyveli ev yapımı reçeller'],
    beforeYouGo: [
      'Mahalle arasındaki sakin açık masaları kahvaltı için keyiflidir.',
      'Ekşi mayalı artisan ekmekleri somun olarak da satın alabilirsiniz.'
    ]
  },
  'moda-breakfast-180': {
    description: "Dr. Esat Işık Caddesi'nde fırından yeni çıkmış ekşi mayalı simitler, poşe yumurtalı kaseler ve doyurucu kahvaltı alternatifleriyle bilinen popüler brunch noktası.",
    whatToOrder: ['Poşe Yumurtalı Avokado Bowl', 'İngiliz Kahvaltı Tabağı'],
    menuFrom: ['Menemen', 'Scrambled Eggs', 'Granola Kasesi', 'Ev Yapımı Kiş'],
    alsoTry: ['Taze demlenmiş cold drip kahve'],
    beforeYouGo: [
      'Hafta sonu brunch saatlerinde (11:00-13:30) yoğunluk oluşabilir; 09:30-10:30 arası sakindir.',
      'Dış mekan masaları cadde akışını izlemek için uygundur.'
    ]
  },
  'moda-breakfast-naan': {
    description: "Moda Caddesi'nde taş fırından çıkan artisan ekşi mayalı ekmekleri, zengin kahvaltı tepsileri ve fırın lezzetleriyle Moda'nın simge kahvaltı fırını.",
    whatToOrder: ['Naan Kahvaltı Tabağı', 'Ekşi Mayalı Croque Monsieur'],
    menuFrom: ['Çılbır', 'Menemen', 'Füme Etli Sandviç', 'Ekşi Mayalı Ekmek Sepeti'],
    alsoTry: ['Taze fırın bademli kruvasan'],
    beforeYouGo: [
      'Yüksek tavanlı iç oturma alanı ferahtır.',
      'Günlük ekşi mayalı ekmek çeşitleri tezgâhtan somun olarak satın alınabilir.'
    ]
  },
  'moda-breakfast-munchies': {
    description: "Moda Caddesi üzerinde sıcak mini pancake kuleleri, taze meyveler, el yapımı soslar ve tuzlu kahvaltı tabakları sunan tatlı-tuzlu kahvaltı durağı.",
    whatToOrder: ['Karışık Kahvaltı Pancake Tabağı', 'Tuzlu Krep'],
    menuFrom: ['Pancake Kulesi', 'Çikolatalı Krep', 'Sahanda Yumurta', 'Peynir Tabağı'],
    alsoTry: ['Ev yapımı tuzlu karamel sos'],
    beforeYouGo: [
      'Porsiyonlar paylaşımlı tüketime uygundur.',
      'Hafta sonu sabah saatlerinde sıra oluşabilir.'
    ]
  },

  // --- TATLI & PASTANE (100% MODA) ---
  'kadikoy-dessert-asuman': {
    description: "Şair Nefi Sokak'ta kaliteli Belçika çikolatası, taze çilek ve çıtır bisküvi katmanlarıyla hazırlanan modern kavanoz tatlılarının Kadıköy'deki öncüsü.",
    whatToOrder: ['Asuman (İmza Tatlı)', 'Ferhunde'],
    menuFrom: ['Asuman', 'Ferhunde', 'Mualla', 'Sıcak Çikolata'],
    alsoTry: ['Bitter fındıklı zanaatkar tablet çikolata'],
    beforeYouGo: [
      'Özellikle akşam saatlerinde yoğun talep görür; kapıda dijital sıra numarası verilir.',
      'Tatlılar sipariş anında taze monte edilir.'
    ]
  },
  'kadikoy-dessert-cikolatadukkani': {
    description: "Yeni Fikir Sokak'ta taze eritilmiş sıcak çikolata kasesinde çilek ve bisküvi deneyimini Moda sokak kültürüne kazandıran butik çikolata durağı.",
    whatToOrder: ['Asuman Tipi Çikolata Kasesi', 'Çilekli Fondü'],
    menuFrom: ['Sıcak Çikolata', 'Çikolatalı Çilek', 'El Yapımı Trüf'],
    alsoTry: ['Yoğun kakao sıcak çikolata'],
    beforeYouGo: [
      'Mekan oldukça butiktir; ayakta veya cephedeki taburelerde hızlı tüketim konseptindedir.',
      'Take-away kutularda alıp Moda sahilinde tüketmek yaygındır.'
    ]
  },
  'moda-dessert-aliusta': {
    description: "1969'dan bu yana Moda Caddesi'nin sonunda mevsim meyveleri ve saf sütle katkısız geleneksel dondurma üreten Moda'nın yaşayan simgesi.",
    whatToOrder: ['Fıstıklı Dondurma', 'Sakızlı Dondurma'],
    menuFrom: ['Fıstık', 'Sakız', 'Kestane', 'Karadut', 'Kavun', 'Çikolata'],
    alsoTry: ['Karadutlu ve kestaneli dondurma ikilisi'],
    beforeYouGo: [
      'Yaz akşamlarında ve hafta sonları kuyruk oluşabilir; servis akıcıdır.',
      'Dondurmayı külahla alıp Moda İskelesi boyunca yürümek klasik mahalle ritüelidir.'
    ]
  },
  'moda-dessert-dem': {
    description: "Şair Nefi Sokak'ta dünyanın farklı bölgelerinden 60'tan fazla çay çeşidi, taze fırın kekleri ve el yapımı tatlılarıyla bilinen butik çay evi ve pastane.",
    whatToOrder: ['Earl Grey Poşe Armut', 'Beyaz Çay Seçkisi'],
    menuFrom: ['Scone', 'San Sebastian Cheesecake', 'Matcha Kek', 'Çay Menüsü'],
    alsoTry: ['Sıcak ev yapımı scone ve reçel'],
    beforeYouGo: [
      'Sakin arka bahçesi kitap okuma ve sohbet için uygundur.',
      'Çaylar masada kum saati eşliğinde demlenir.'
    ]
  },

  // --- DATE MEKANLARI (100% MODA) ---
  'kadikoy-date-aida': {
    description: "Ressam Şeref Akdik Sokak'taki üç katlı tarihi Moda konağında, canlı piyano ezgileri, loş aydınlatma ve otantik İtalyan mutfağıyla romantik akşam yemekleri sunuyor.",
    whatToOrder: ['Trüflü El Yapımı Tagliolini', 'Osso Buco'],
    menuFrom: ['Tagliolini al Tartufo', 'Gnocchi', 'Risotto ai Funghi', 'Tiramisu'],
    alsoTry: ['İtalyan şarap kavı seçkisi'],
    beforeYouGo: [
      'Akşam servisi için önceden rezervasyon yaptırılması tavsiye edilir.',
      'Sakin, loş ve müzikli atmosferi ikili buluşmalar ve kutlamalar için çok elverişlidir.'
    ]
  },
  'moda-date-rita': {
    description: "Şair Nefi Sokak'ta üç katlı restore edilmiş tarihi köşkte modern gastropub mutfağı, imza kokteylleri ve loş terasıyla Moda'nın gözde date mekanı.",
    whatToOrder: ['Şef Kokteylleri', 'Izgara Ahtapot'],
    menuFrom: ['Izgara Ahtapot', 'Trüflü Patates', 'Dana Yanak', 'İmza Kokteyl Menüsü'],
    alsoTry: ["'Rita' imza kokteyli"],
    beforeYouGo: [
      'Hafta sonu akşamları için rezervasyon önerilir.',
      'Üst kat teras masaları sakin akşam buluşmaları için elverişlidir.'
    ]
  },
  'moda-date-fauna': {
    description: "Küçük Moda Sokak'ta butik mutfağında günlük taze açılan zanaatkar el yapımı makarnaları ve rafine İtalyan tabaklarıyla gastronomi tutkunlarının tercihi.",
    whatToOrder: ['Kuzu Gerdanlı Makarna', 'Enginarlı Risotto'],
    menuFrom: ['Taze Makarnalar', 'Mevsim Çorbası', 'Dana Kaburga', 'Şef Tatlısı'],
    alsoTry: ['Günlük mevsim sebzeli taze ravioli'],
    beforeYouGo: [
      'Masa sayısı sınırlıdır; mutlaka önceden rezervasyon yapılmalıdır.',
      'Yemekler özenle hazırlandığı için acele etmeden, sakin bir akşam yemeği planlanmalıdır.'
    ]
  },
  'moda-date-kayikhane': {
    description: "Moda sahil şeridinde tarihi Moda İskelesi ve deniz manzarasına karşı gün batımı eşliğinde akşam yemeği sunan seçkin sahil buluşma noktası.",
    whatToOrder: ['Deniz Mahsullü Risotto', 'Günün Taze Balığı'],
    menuFrom: ['Izgara Levrek', 'Karides Güveç', 'Meze Seçkisi', 'Şarap Menüsü'],
    alsoTry: ['Gün batımında kadeh eşliğinde soğuk mezeler'],
    beforeYouGo: [
      'Deniz kenarı açık masalar için gün batımı saatine rezervasyon önerilir.',
      'Akşamları akustik canlı dinletiler olabilir.'
    ]
  },

  // =========================================================================
  // YELDEĞİRMENİ (RASİMPAŞA, KADIKÖY)
  // =========================================================================

  // Kahvaltı & Fırın
  'yeldegirmeni-breakfast-kuff': {
    description: "Karakolhane Caddesi üzerinde tarihi Yeldeğirmeni dokusunda sahanda sıcaklar, taze pişiler ve doyurucu kahvaltı tabakları sunan dinamik mahalle buluşma noktası.",
    whatToOrder: ['Döküm Tavada Menemen', 'Sıcak Pişi & Peynir'],
    menuFrom: ['Küff Kahvaltı Tabağı', 'Otlu Omlet', 'Ev Yapımı Reçeller'],
    alsoTry: ['Köz patlıcanlı kahvaltı salatası'],
    beforeYouGo: [
      'Hafta sonu sabah saatlerinde sıra oluşabilir.',
      'Yeldeğirmeni mural sokaklarına yürüme mesafesindedir.'
    ]
  },
  'yeldegirmeni-breakfast-garda': {
    description: "Tarihi Haydarpaşa Garı demiryolu ruhunu yansıtan atmosferinde Ege tipi kahvaltı tabakları, ev yapımı reçeller ve sahanda yumurta çeşitleri sunuyor.",
    whatToOrder: ['Garda Ege Kahvaltısı', 'Kavurmalı Sahanda Yumurta'],
    menuFrom: ['Köy Peyniri Tabağı', 'Ev Yapımı Çilek Reçeli', 'Sıcak Çay Servisi'],
    alsoTry: ['Zeytin ezmeli kızarmış ekmek'],
    beforeYouGo: [
      'İç mekan nostaljik tren ve demiryolu hatıralarıyla dekore edilmiştir.',
      'Sakin sabah saatlerinde keyifli bir mahalle kahvaltısı sunar.'
    ]
  },
  'yeldegirmeni-breakfast-nayn': {
    description: "İskele Sokak'ta taş değirmen unlarıyla günlük ekşi mayalı artizan ekmekler, taze kruvasanlar ve hafif kahvaltı alternatifleri üreten butik fırın.",
    whatToOrder: ['Bademli Kruvasan', 'Ekşi Mayalı Çırpılmış Yumurta'],
    menuFrom: ['Kruvasan Sandviç', 'Köy Ekmeği Dilimleri', 'Granola Kasesi'],
    alsoTry: ['Taze fırından çıkan zeytinli kekikli somun'],
    beforeYouGo: [
      'Kruvasanlar sabah saatlerinde taze çıkar; öğleden sonraya tükenme ihtimali yüksektir.',
      'Sınırlı sayıda dış oturma masası bulunur.'
    ]
  },
  'yeldegirmeni-breakfast-muutto': {
    description: "Şef dokunuşlu çağdaş sokak lezzetleri ve ekşi mayalı lavaş dürümleriyle Yeldeğirmeni'nde yaratıcı kahvaltı ve öğle alternatifleri sunuyor.",
    whatToOrder: ['Ekşi Mayalı Kahvaltı Dürümü', 'Tiftik Etli Çıtır Tabak'],
    menuFrom: ['Şef Dürümü', 'Füme Kaburga', 'Yoğurtlu Soslar'],
    alsoTry: ['Sumaklı ev yapımı patates cipsi'],
    beforeYouGo: [
      'Sokak lezzetleri konseptinde hızlı ve samimi servis sunar.',
      'Öğle saatlerinde yoğunluk olabilir.'
    ]
  },

  // Kahve
  'yeldegirmeni-coffee-montag': {
    description: "Yurttaş Sokak'ta kendi kavurduğu seçkin tek köken çekirdekleri V60 pour-over ve espresso tabanlı içeceklerle sunan çağdaş kahve kavurucusu.",
    whatToOrder: ['Ethiopia Yirgacheffe V60', 'Flat White'],
    menuFrom: ['Espresso', 'Cortado', 'Cold Brew', 'Filtre Kahve'],
    alsoTry: ['Kendi kavurdukları perakende çekirdek seçkisi'],
    beforeYouGo: [
      'Sakin müzikler eşliğinde çalışma ve okuma için elverişlidir.',
      'Filtre kahve demlemelerinde çekirdek profilleri sorulabilir.'
    ]
  },
  'yeldegirmeni-coffee-benazio': {
    description: "Karakolhane Caddesi üzerinde samimi oturma düzeni, dengeli espresso harmanları ve taze günlük tatlılarıyla bilinen Yeldeğirmeni klasiği.",
    whatToOrder: ['Cortado', 'Soğuk Demleme (Cold Brew)'],
    menuFrom: ['Americano', 'Caffe Latte', 'V60 Drip', 'Brownie'],
    alsoTry: ['Filtre kahve yanında ev yapımı cevizli brownie'],
    beforeYouGo: [
      'Karakolhane Caddesi hareketliliğini izleyen cephe masaları popülerdir.',
      'Günün her saatinde hızlı kahve molası için uygundur.'
    ]
  },
  'yeldegirmeni-coffee-village': {
    description: "Recaizade Sokak'ta kitap raflarıyla çevrili sessiz ortamında taze demlenmiş filtre kahve ve çay çeşitleri sunan kültür-kafe durağı.",
    whatToOrder: ['Günün Filtre Kahvesi', 'Chai Tea Latte'],
    menuFrom: ['Latte', 'Bitki Çayları', 'Cookie', 'Kek'],
    alsoTry: ['Zencefilli ev yapımı kurabiye'],
    beforeYouGo: [
      'Uzun süreli okuma ve bilgisayarla çalışma için sakin bir alandır.',
      'İçeride zengin bir kitaplık seçkisi mevcuttur.'
    ]
  },
  'yeldegirmeni-coffee-hang': {
    description: "İskele Sokak'ta mikro partiler halinde kavrulan nitelikli çekirdekleri taze öğütümle pour-over ve sütlü kahvelerle buluşturan butik roastery.",
    whatToOrder: ['Honduras V60', 'Iced Americano'],
    menuFrom: ['Espresso Tonic', 'Cappuccino', 'Single Origin Filtre'],
    alsoTry: ['Mevsimlik soğuk kahve kombinasyonları'],
    beforeYouGo: [
      'Çekirdek profilleri hakkında baristalardan tadım bilgisi alınabilir.',
      'Dış cephedeki ahşap taburelerde hızlı tüketim tercih edilir.'
    ]
  },

  // Hamburger & Sokak Lezzetleri
  'yeldegirmeni-burger-bready': {
    description: "Recaizade Sokak'ta tiftiklenmiş dana kaburga, özel soslar ve yumuşak tereyağlı brioche ekmekleriyle hazırlanan gurme burgerler sunuyor.",
    whatToOrder: ['Truffle Smash Burger', 'Tiftik Kaburga Brioche'],
    menuFrom: ['Cheeseburger', 'Çıtır Tavuk Sandviç', 'Baharatlı Patates'],
    alsoTry: ['Trüf mayonezli çıtır patates'],
    beforeYouGo: [
      'Mekan butik ölçeklidir; paket servis ve hızlı tüketim için de elverişlidir.',
      'Siparişler taze ve sıcak hazırlanır.'
    ]
  },
  'yeldegirmeni-burger-kup': {
    description: "Karakolhane Caddesi'nde el yapımı kıyma köftesi, karamelize soğan ve taze malzemelerle hazırlanan doyurucu gastro burgerler sunuyor.",
    whatToOrder: ['Kup Klasik Burger', 'Füme Etli Burger'],
    menuFrom: ['Double Burger', 'Cheddarlı Patates', 'Ev Yapımı Soslar'],
    alsoTry: ['Çıtır soğan halkaları eşliğinde özel acı sos'],
    beforeYouGo: [
      'Sipariş üzerine taze pişirildiği için yoğun saatlerde 10-15 dakika hazırlanma süresi olabilir.',
      'Porsiyonlar doyurucu ölçektedir.'
    ]
  },
  'yeldegirmeni-burger-durumcuemre': {
    description: "Misak-ı Milli Sokak'ta mangal ateşinde zırh kıymasıyla hazırlanan kebaplar ve lavaş dürümleriyle mahallenin köklü esnaf lezzet noktası.",
    whatToOrder: ['Zırh Kıyması Adana Dürüm', 'Közde Tavuk Şiş Dürüm'],
    menuFrom: ['Urfa Dürüm', 'Çöp Şiş', 'Köz Biber & Domates', 'Açık Ayran'],
    alsoTry: ['Közlenmiş sarımsak ve acılı ezme garnitürü'],
    beforeYouGo: [
      'Hızlı ve pratik bir esnaf sokak lezzeti deneyimidir.',
      'Öğle saatlerinde mahalle esnafı tarafından yoğun ziyaret edilir.'
    ]
  },
  'yeldegirmeni-burger-no22': {
    description: "Karakolhane üzerinde sokak lezzetleri, çıtır sosisliler ve özel soslu atıştırmalık tabaklarıyla genç ve dinamik bir mola noktası.",
    whatToOrder: ['No:22 Gurme Sosisli', 'Cheddarlı Çıtır Tavuk'],
    menuFrom: ['Hot Dog', 'Patates Kovası', 'Soğuk İçecekler'],
    alsoTry: ['Ballı hardallı çıtır tavuk parçaları'],
    beforeYouGo: [
      'Ayakta ve küçük dış masalarda hızlı tüketime uygundur.',
      'Sokak lezzeti atıştırmalığı olarak tercih edilir.'
    ]
  },

  // Tatlı & Pastane
  'yeldegirmeni-dessert-kafeka': {
    description: "Misak-ı Milli Sokak'ta akışkan kıvamlı San Sebastian cheesecake'i ve günlük ev yapımı tatlılarıyla Yeldeğirmeni'nin sevilen tatlı durağı.",
    whatToOrder: ['San Sebastian Cheesecake', 'Fıstıklı Brownie'],
    menuFrom: ['Lotus Cheesecake', 'Tiramisu', 'Magnolia', 'Filtre Kahve'],
    alsoTry: ['Sıcak Belçika çikolatası sosu ilavesiyle cheesecake'],
    beforeYouGo: [
      'Akşamüstü saatlerinde taze çıkan dilimler hızla tükenebilir.',
      'Kahve yanı tatlı molası için samimi bir iç mekânı vardır.'
    ]
  },
  'yeldegirmeni-dessert-cikolataci': {
    description: "Karakolhane üzerinde eritme sıcak çikolatalı meyve kupları, el yapımı trüfler ve çikolatalı kahve eşleşmeleri sunan butik dükkan.",
    whatToOrder: ['Çikolatalı Çilek Kupası', 'Sıcak Eritme Çikolata'],
    menuFrom: ['Trüf Çikolata', 'Çikolatalı Waffle Dilimi', 'Filtre Kahve'],
    alsoTry: ['Portakallı bitter el yapımı tablet çikolata'],
    beforeYouGo: [
      'Paket kutularda hediye çikolata seçeneği mevcuttur.',
      'Küçük ve butik bir işletmedir.'
    ]
  },
  'yeldegirmeni-dessert-naynpatisserie': {
    description: "İskele Sokak'ta Fransız pastacılık teknikleriyle hazırlanan çıtır eklerler, tartlar ve meyveli pötifurlar sunan artizan pastane köşesi.",
    whatToOrder: ['Karamelli Paris-Brest', 'Meyveli Çıtır Tart'],
    menuFrom: ['Vanilyalı Ekler', 'Limonlu Mereng Tart', 'Kruvasan'],
    alsoTry: ['Taze vanilya çekirdekli pastacı kremasıyla hazırlanan ekler'],
    beforeYouGo: [
      'Günlük sınırlı porsiyonlarda taze üretilir.',
      'Özel tatlılar erken saatlerde tükenebilir.'
    ]
  },
  'yeldegirmeni-dessert-zumrut': {
    description: "Karakolhane'nin en eski tatlıcılarından biri olarak geleneksel çıtır tulumba tatlısı, fırın sütlaç ve şerbetli klasik lezzetler sunuyor.",
    whatToOrder: ['Çıtır Sıcak Tulumba', 'Fırın Sütlaç'],
    menuFrom: ['Şekerpare', 'Kemalpaşa', 'Profiterol', 'Demleme Çay'],
    alsoTry: ['Geleneksel demleme çay eşliğinde sıcak çıtır tulumba'],
    beforeYouGo: [
      'Nostaljik ve samimi bir mahalle tatlıcısı atmosferindedir.',
      'Paket kutu satışı yaygındır.'
    ]
  },

  // =========================================================================
  // KADIKÖY MERKEZ & TARİHİ ÇARŞI
  // =========================================================================

  // Tarihi Lokantalar & Çarşı
  'kadikoymerkez-lokanta-ciya': {
    description: "Anadolu'nun unutulmaya yüz tutmuş geleneksel tencere yemeklerini, yabani otlarını ve mevsimsel çorbalarını aslına sadık kalarak sunan gastronomi durağı.",
    whatToOrder: ['Perde Pilavı', 'Şıhıl Mahşi'],
    menuFrom: ['Kuru Patlıcan Dolması', 'Gavurdağı Salatası', 'Kelle Paça Çorbası'],
    alsoTry: ['Mevsimsel yabani ot yemekleri ve Zahter salatası'],
    beforeYouGo: [
      'Hafta sonları öğle ve akşam saatlerinde yoğun ilgi görür.',
      'Güneşli Bahçe Sokak üzerinde Çiya Kebap ile karşılıklı konumdadır.'
    ]
  },
  'kadikoymerkez-lokanta-yanyali': {
    description: "1919 yılından bu yana Tarihi Balıkçılar Çarşısı girişinde Osmanlı saray ve Türk mutfağı reçetelerini tencere yemekleriyle yaşatan asırlık lokanta.",
    whatToOrder: ['Yanya Köftesi', 'Kuzu Elbasan Tava'],
    menuFrom: ['Tas Kebabı', 'İncik Haşlama', 'Zeytinyağlı Enginar', 'Krem Karamel'],
    alsoTry: ['Geleneksel usul kuzu etli ve patlıcanlı Yanya köftesi'],
    beforeYouGo: [
      '1919 yılından bu yana hizmet veren asırlık Osmanlı-Türk mutfağı temsilcisidir.',
      'Tarihi Balıkçılar Çarşısı girişinde yer alır.'
    ]
  },
  'kadikoymerkez-lokanta-borsam': {
    description: "Güneşli Bahçe Sokak'ta odun ateşli taş fırında çıtır çıtır pişen ince hamurlu lahmacunları ve sıcak pideleriyle Kadıköy'ün değişmez lezzet klasiği.",
    whatToOrder: ['Çıtır Taşfırın Lahmacun', 'Kaşarlı Pide'],
    menuFrom: ['Kıymalı Pide', 'Kuşbaşılı Pide', 'Açık Köpüklü Ayran'],
    alsoTry: ['Bol maydanoz, limon ve sumaklı taze soğan eşliğinde sıcak lahmacun'],
    beforeYouGo: [
      'Odun ateşinde pişen lahmacunlar hızlı ve sıcacık servis edilir.',
      'Ayakta ya da taburelerde hızlı tüketim için çok popülerdir.'
    ]
  },
  'kadikoymerkez-lokanta-ciyakebap': {
    description: "Güneydoğu Anadolu'nun zırh kıymasıyla hazırlanan kebaplarını, mevsimsel ızgara çeşitlerini ve nar ekşili mezelerini sunan köklü kebap ustası.",
    whatToOrder: ['Ali Nazik Kebabı', 'Fıstıklı Kebap'],
    menuFrom: ['Urfa Kebap', 'Adana Kebap', 'Çöp Şiş', 'Fındık Lahmacun'],
    alsoTry: ['Közlenmiş sarımsak ve patlıcan eşliğinde zırh kıyması kebap'],
    beforeYouGo: [
      'Çiya Sofrası’nın hemen çaprazında kebap ve ızgara odaklı şubesidir.',
      'Güneydoğu Anadolu kebap kültürünün Kadıköy’deki en güçlü adreslerindendir.'
    ]
  },

  // Balık & Deniz Ürünleri
  'kadikoymerkez-balik-hamsipub': {
    description: "Güneşli Bahçe Sokak boyunca uzanan hareketli sokak masalarında mevsim balıkları, çıtır hamsi tava ve taze deniz mezeleri sunan samimi balık pubı.",
    whatToOrder: ['Tava Hamsi', 'Levrek Simit'],
    menuFrom: ['Kalamar Tava', 'Karides Güveç', 'Mezgit Çıtır', 'Mevsim Salatası'],
    alsoTry: ['Özel tarator soslu kalamar tava'],
    beforeYouGo: [
      'Kadıköy Çarşısı’nda samimi ve hareketli bir sokak masası deneyimi sunar.',
      'Akşam saatlerinde erken yer bulmak avantaj sağlar.'
    ]
  },
  'kadikoymerkez-balik-kadinimet': {
    description: "Kadıköy Balıkçılar Çarşısı'nın kalbinde taze balık tezgahlarının yanı başında günlük deniz ürünleri ve geleneksel Ege mezeleri sunan balık lokantası.",
    whatToOrder: ['Izgara Lüfer', 'Tereyağlı Karides'],
    menuFrom: ['Deniz Levreği', 'Kalamar Izgara', 'Ahtapot Salatası', 'Balık Çorbası'],
    alsoTry: ['Balık tezgahından taze seçilen günlük ızgara balık çeşitleri'],
    beforeYouGo: [
      'Balıkçılar Çarşısı tezgahlarının hemen yanında tarihi dokudadır.',
      'Balığınızı tezgahtan seçip restoranda pişirtebilirsiniz.'
    ]
  },
  'kadikoymerkez-balik-midyeciyasin': {
    description: "Kadıköy Çarşı aksında taze temizlenmiş iç harcı, tane karabiberi ve limonla servis edilen sıcak tencere midyeleriyle ünlü sokak lezzeti durağı.",
    whatToOrder: ['Sıcak Baharatlı Midye Dolma', 'Çıtır Midye Tava'],
    menuFrom: ['Klasik Midye Dolma', 'Soslu Midye', 'Tarator Soslu Kova'],
    alsoTry: ['Taze sıkılmış limonla sıcak tencereden yeni çıkan midye dolma'],
    beforeYouGo: [
      'Kadıköy Çarşı turunda hızlı ayaküstü atıştırmalık klasiğidir.',
      'Midyeler günlük ve taze temizlenerek hazırlanır.'
    ]
  },
  'kadikoymerkez-balik-denizati': {
    description: "Muvakkithane Caddesi üzerinde vapur iskelelerine yakın konumu, kiremitte deniz mahsulleri ve geniş meze dolabıyla hizmet veren klasik deniz restoranı.",
    whatToOrder: ['Kiremitte Deniz Mahsulleri', 'Kalamar Tava'],
    menuFrom: ['Levrek Izgara', 'Karides Söğüş', 'Köpoğlu', 'Roka Salatası'],
    alsoTry: ['Fesleğenli ve zeytinyağlı marine levrek'],
    beforeYouGo: [
      'Rıhtım ve Muvakkithane aksında köklü bir deniz ürünleri durağıdır.',
      'Geniş ve rahat oturma alanlarına sahiptir.'
    ]
  },

  // Tarihi Tatlıcılar
  'kadikoymerkez-dessert-baylan': {
    description: "1923'ten bu yana Cumhuriyet aydınlarının buluştuğu tarihi Muvakkithane Caddesi binasında Kup Griye ve nostaljik pastacılık mirasını yaşatan simge mekan.",
    whatToOrder: ['Kup Griye (Coupe Jacques)', 'Trüf Pasta'],
    menuFrom: ['Adisababa', 'Monşer', 'Milföy Pasta', 'Türk Kahvesi'],
    alsoTry: ['Karamel soslu ve bademli klasik Kup Griye'],
    beforeYouGo: [
      '1923’ten bu yana edebiyat ve kültür insanlarının tarihi buluşma adresidir.',
      'Nostaljik atmosferi ve vitrin çikolatalarıyla Kadıköy simgesidir.'
    ]
  },
  'kadikoymerkez-dessert-cafererol': {
    description: "1807 yılına uzanan köklü şekerci geleneği, rengarenk akide şekerleri, badem ezmeleri ve zarif tatlı vitrinleriyle Kadıköy Çarşı'nın yaşayan efsanesi.",
    whatToOrder: ['Gül Yapraklı Lokum', 'Badem Ezmesi'],
    menuFrom: ['Akide Şekeri', 'Kestane Şekeri', 'Dondurmalı İrmik', 'Çikolata Kaplı Portakal'],
    alsoTry: ['Geleneksel tarçınlı ve bergamotlu akide şekerleri'],
    beforeYouGo: [
      '1807 yılına uzanan köklü geçmişi ve görkemli vitrin süslemeleriyle ünlüdür.',
      'Özel günlerde ve bayramlarda uzun kuyruklar oluşabilir.'
    ]
  },
  'kadikoymerkez-dessert-haciserif': {
    description: "Muvakkithane Caddesi'nde sıcacık dökülen tereyağlı irmik helvasını Maraş dondurması eşliğinde sunan ve geleneksel lokumlar üreten tatlı durağı.",
    whatToOrder: ['Dondurmalı İrmik Helvası', 'Tahinli Sıcak Helva'],
    menuFrom: ['Antep Fıstıklı Lokum', 'Meyve Kurusu Helvalar', 'Çikolatalı Lokum'],
    alsoTry: ['İçi Maraş dondurmalı sıcak fıstıklı irmik helvası'],
    beforeYouGo: [
      'Sıcak helva ve soğuk dondurma tezatı meşhurdur.',
      'Ayaküstü paket veya küçük oturma masalarında tüketilebilir.'
    ]
  },
  'kadikoymerkez-dessert-saray': {
    description: "Rıhtım Caddesi üzerinde geleneksel manda sütüyle yapılan fırın sütlaç, gerçek tavukgöğsü kazandibi ve klasik Türk sütlü tatlıları sunan asırlık marka.",
    whatToOrder: ['Tavukgöğsü Kazandibi', 'Fırın Sütlaç'],
    menuFrom: ['Su Muhallebisi', 'Profiterol', 'Aşure', 'Keşkül'],
    alsoTry: ['Gerçek manda sütü ve pirinç sübyesiyle hazırlanan fırın sütlaç'],
    beforeYouGo: [
      'Rıhtım meydanında Kadıköy vapur iskelelerine çok yakın konumdadır.',
      'Geleneksel sütlü tatlıların yanı sıra su böreği de mevcuttur.'
    ]
  },

  // Meyhane & Akşam
  'kadikoymerkez-meyhane-viktorlevi': {
    description: "1914 yılında kurulan, asırlık ahşap konağın yemyeşil saklı bahçesinde ve tarihi mahzeninde özel fıçı şarapları eşliğinde akşam yemekleri sunan efsanevi mekan.",
    whatToOrder: ['Özel Mahzen Şarabı Seçkisi', 'Peynir Tabağı'],
    menuFrom: ['Dana Antrikot', 'Sıcak Şarap (Kışın)', 'Kalamar Izgara', 'Bruschetta'],
    alsoTry: ['Tarihi ahşap konak bahçesinde ev yapımı nar şarabı'],
    beforeYouGo: [
      '1914’te kurulan mekan, yemyeşil saklı avlusu ve tarihi mahzeniyle meşhurdur.',
      'Hafta sonu akşamları için önceden rezervasyon şarttır.'
    ]
  },
  'kadikoymerkez-meyhane-piraye': {
    description: "Serasker Caddesi'nde taş plak kayıtları eşliğinde edebiyat atmosferi, taze Ege mezeleri ve sıcak deniz mahsulleri sunan nostaljik meyhane.",
    whatToOrder: ['Fava & Kurutulmuş Domates', 'Girit Ezmesi'],
    menuFrom: ['Levrek Marin', 'Sıcak Ot Kavurma', 'Köpoğlu', 'Kalamar Tava'],
    alsoTry: ['Taş plak tınıları eşliğinde tereyağlı ılık ahtapot'],
    beforeYouGo: [
      'Taş plak müzikleri ve nostaljik iç avlusu edebiyatseverlerin uğrak noktasıdır.',
      'Nazım Hikmet ve Piraye hatıralarıyla dekore edilmiştir.'
    ]
  },
  'kadikoymerkez-meyhane-guneslibahce': {
    description: "Kadıköy Balık Pazarı'nın en canlı sokağında açık hava masaları, taze meze çeşitleri ve ızgara balıklarla çarşının akşam ritmini yansıtan klasik meyhane.",
    whatToOrder: ['Güveçte Tereyağlı Karides', 'Rum Pilakisi'],
    menuFrom: ['Haydari', 'Atom', 'Pastırmalı Humus', 'Mezgit Tava'],
    alsoTry: ['Fırınlanmış ılık tahinli helva ikramı'],
    beforeYouGo: [
      'Kadıköy Balık Pazarı’nın tam kalbinde açık sokak masalarına sahiptir.',
      'Canlı çarşı atmosferini izleyerek keyifli bir akşam geçirilir.'
    ]
  },
  'kadikoymerkez-meyhane-agapia': {
    description: "Süreyya Operası karşısındaki tarihi konakta Ege ve Rum mutfağının geleneksel mezelerini, taze deniz mahsullerini ve sıcak bir meyhane atmosferini buluşturan özel adres.",
    whatToOrder: ['Agapia Meze Tabağı', 'Fıstıklı Sıcak Humus'],
    menuFrom: ['Girit Kabağı', 'Cevizli Muhammara', 'Ahtapot Izgara', 'Yaprak Ciğer'],
    alsoTry: ['Zeytinyağlı taze enginar kalbi ve deniz börülcesi'],
    beforeYouGo: [
      'Süreyya Operası karşısındaki tarihi konakta samimi bir atmosfere sahiptir.',
      'Hafta sonları canlı akustik melodiler eşlik edebilir; rezervasyon önerilir.'
    ]
  },

  // =========================================================================
  // KOŞUYOLU (KADIKÖY)
  // =========================================================================

  // Kahvaltı & Bahçe Brunch
  'kosuyolu-breakfast-cevizagaci': {
    description: "Muhittin Üstündağ Caddesi üzerinde devasa pasta vitrini, taze hamur işleri ve zengin serpme kahvaltısıyla Koşuyolu'nun simgeleşmiş buluşma noktası.",
    whatToOrder: ['Serpme Köy Kahvaltısı', 'Fırından Sıcak Su Böreği'],
    menuFrom: ['Menemen', 'Pişi Tabağı', 'Petek Bal & Kaymak', 'Simit Tabağı'],
    alsoTry: ['Ev yapımı reçeller ve taze fıstıklı çikolata çeşitleri'],
    beforeYouGo: [
      'Hafta sonu sabah ve öğle saatlerinde oldukça kalabalık olabilir.',
      'Geniş bahçe ve kapalı kat alanlarına sahiptir.'
    ]
  },
  'kosuyolu-breakfast-kirpi': {
    description: "Koşuyolu Parkı yanında yeşillikler içindeki gizli bahçesinde huzurlu serpme kahvaltı, sıcak pişiler ve zengin dünya mutfağı alternatifleri sunuyor.",
    whatToOrder: ['Kirpi Kahvaltı Tabağı', 'Sıcak Pişi & Çemen'],
    menuFrom: ['Kavurmalı Yumurta', 'Otlu Peynirli Omlet', 'Pankek Tabağı'],
    alsoTry: ['Fırınlanmış patates dilimleri ve ev yapımı soslar'],
    beforeYouGo: [
      'Yeşillikler içindeki bahçesi hafta sonu aile kahvaltıları için çok tercih edilir.',
      'Koşuyolu Parkı’nın hemen bitişiğindedir.'
    ]
  },
  'kosuyolu-breakfast-radika': {
    description: "Kalfa Çeşmesi Sokak'ta Cunda ve Ege kasabalarını anımsatan samimi bahçesinde Girit böreği, acuka ve ev reçelleriyle hazırlanan Ege kahvaltısı sunuyor.",
    whatToOrder: ['Girit Böreği & Acuka', 'Ege Serpme Kahvaltısı'],
    menuFrom: ['Biberli Lor', 'Bozcaada Domates Reçeli', 'Sahanda Çırpılmış Yumurta'],
    alsoTry: ['Zeytinyağlı taze kekikli köy zeytinleri'],
    beforeYouGo: [
      'Pötikare masa örtüleriyle sakin bir bahçe atmosferi sunar.',
      'Akşamları ise Ege meyhanesi konseptine dönüşür.'
    ]
  },
  'kosuyolu-breakfast-flan': {
    description: "Muhittin Üstündağ Caddesi'nde Fransız pastacılık teknikleriyle üretilen taze tereyağlı kruvasanlar, ekşi mayalı sandviçler ve nitelikli kahve sunan butik fırın.",
    whatToOrder: ['Hindi Fümeli Kruvasan', 'Antep Fıstıklı Kruvasan'],
    menuFrom: ['Ekşi Mayalı Tost', 'Çırpılmış Yumurtalı Brioche', 'Meyveli Tart', 'Filtre Kahve'],
    alsoTry: ['Taze demlenmiş V60 filtre kahve eşliğinde sıcak bademli kruvasan'],
    beforeYouGo: [
      'Kruvasanlar günlük taze pişirilir; öğleden sonra erken tükenebilir.',
      'Koşuyolu Parkı manzaralı ferah oturma masaları mevcuttur.'
    ]
  },

  // Kahve & Çalışma Alanları
  'kosuyolu-coffee-kaffeeschutz': {
    description: "Koşuyolu Caddesi üzerinde Alman kahve geleneği ve kendi profillerinde kavurduğu taze çekirdeklerle hazırlanan nitelikli filtre kahveler sunan huzurlu mekan.",
    whatToOrder: ['Single Origin V60', 'Flat White'],
    menuFrom: ['Cortado', 'Cold Brew', 'Alman Pastası', 'Kruvasan Sandviç'],
    alsoTry: ['Kendi kavurma atölyelerinden taze çekilmiş yöresel çekirdekler'],
    beforeYouGo: [
      'Sessiz ve sakin müzikleriyle bilgisayarla çalışmak ve kitap okumak için idealdir.',
      'Geniş bir iç ve dış oturma alanı bulunur.'
    ]
  },
  'kosuyolu-coffee-cremma': {
    description: "Muhittin Üstündağ Caddesi'nde antik mimari detaylara sahip ferah salonunda nitelikli espresso içecekleri ve imza tatlılar sunan popüler buluşma noktası.",
    whatToOrder: ['Cortado', 'Cremma İmzalı Cheesecake'],
    menuFrom: ['Espresso Tonic', 'Iced Latte', 'San Sebastian', 'Brownie'],
    alsoTry: ['Yumuşak içimli soğuk demleme Cold Brew'],
    beforeYouGo: [
      'Estetik iç mimarisi ve yüksek tavanıyla ferah bir çalışma ortamı sağlar.',
      'Öğleden sonra saatlerinde hareketlilik artar.'
    ]
  },
  'kosuyolu-coffee-blak': {
    description: "Mehmet Akfan Sokak'ta minimalist tasarımı, özenli tek köken çekirdekleri ve samimi mahalle atmosferiyle kaliteli kahve deneyimi sunan butik kafe.",
    whatToOrder: ['Ethiopia Pour-Over', 'Iced Americano'],
    menuFrom: ['Cappuccino', 'Latte', 'Glutensiz Kurabiye', 'Filtre Kahve'],
    alsoTry: ['Zencefilli ve tarçınlı ev yapımı fırın kurabiyesi'],
    beforeYouGo: [
      'Mahalle arasında sakin bir kahve molası için elverişlidir.',
      'Dış cephedeki ahşap banklarda sokak dokusu hissedilir.'
    ]
  },
  'kosuyolu-coffee-viyana': {
    description: "Koşuyolu Caddesi üzerinde Viyana usulü kremalı kahveler, melange çeşitleri ve sıcak Belçika çikolatasıyla servis edilen San Sebastian cheesecake sunuyor.",
    whatToOrder: ['Viyana Melange', 'San Sebastian Cheesecake'],
    menuFrom: ['Einspänner', 'Sıcak Çikolatalı Tatlı', 'Filtre Kahve', 'Kruvasan'],
    alsoTry: ['Akışkan sıcak çikolata sosuyla taze dilimlenmiş San Sebastian'],
    beforeYouGo: [
      'Tatlı ve kahve eşleşmesi için Koşuyolu’nun en bilinen duraklarındandır.',
      'Akşam saatlerinde tatlı molası için sıra oluşabilir.'
    ]
  },

  // Akşam Yemeği & Bistro
  'kosuyolu-bistro-kaen': {
    description: "Asmadalı Sokak'ta modern tasarımı, taze balık seçimleri ve yaratıcı roll çeşitleriyle Anadolu Yakası'nın en yüksek puanlı Japon ve sushi restoranı.",
    whatToOrder: ['Kaen Special Roll', 'Crispy Maguro Tempura'],
    menuFrom: ['Sashimi Tabağı', 'Dragon Roll', 'Edamame', 'Miso Çorbası'],
    alsoTry: ['Trüf yağlı ve somonlu sıcak roll kombinasyonları'],
    beforeYouGo: [
      'Akşam yemekleri için rezervasyon yaptırılması önemle tavsiye edilir.',
      'Nezih ve modern bir gastronomi akşamı sunar.'
    ]
  },
  'kosuyolu-bistro-monkey': {
    description: "Muhittin Üstündağ Caddesi'nde keyifli bahçesi, zengin içecek seçkisi, trüflü pizzaları ve çıtır atıştırmalıklarıyla semtin popüler gastro-pub durağı.",
    whatToOrder: ['Monkey Gurme Şinitzel', 'Trüf Mantarlı Pizza'],
    menuFrom: ['Çıtır Tavuk Sepeti', 'Craft İçecekler', 'Hamburger', 'Baharatlı Patates'],
    alsoTry: ['Ev yapımı özel dip soslarla servis edilen çıtır atıştırmalıklar'],
    beforeYouGo: [
      'Arkadaş buluşmaları ve keyifli akşamüstü sohbetleri için çok uygundur.',
      'Hafta sonu akşamları bahçe masaları hızla dolar.'
    ]
  },
  'kosuyolu-bistro-birtat': {
    description: "Kalfa Çeşmesi Sokak'ta 1956'dan gelen ocakbaşı mirasını zırh kıyması kebapları, sıcak mezeleri ve nostaljik meyhane kültürüyle yaşatan köklü işletme.",
    whatToOrder: ['Zırh Kıyması Kebap', 'Közde Patlıcan Ezme'],
    menuFrom: ['Gavurdağı Salatası', 'Kuzu Şiş', 'İçli Köfte', 'Çiğ Börek'],
    alsoTry: ['Tandırda ağır ağır pişen sıcak kuzu incik'],
    beforeYouGo: [
      'Koşuyolu’nun en köklü akşam sofrası klasiklerinden biridir.',
      'Özellikle kalabalık gruplar için önceden rezervasyon gerekir.'
    ]
  },
  'kosuyolu-bistro-kipos': {
    description: "Cenap Şahabettin Sokak'ta meyve ağaçlarıyla çevrili sakin bahçesinde Ayvalık ve Cunda mutfağının taze balıklarını ve deniz mezelerini sunan balık restoranı.",
    whatToOrder: ['Tuzda Levrek', 'Cunda Usulü Sıcak Ahtapot'],
    menuFrom: ['Girit Ezmesi', 'Kalamar Izgara', 'Karides Güveç', 'Deniz Börülcesi'],
    alsoTry: ['Zeytinyağlı sıcak enginar kalbi ve deniz mahsullü börek'],
    beforeYouGo: [
      'Huzurlu ve romantik bir bahçe akşamı için elverişlidir.',
      'Taze balık çeşitleri günlük tezgaha göre değişir.'
    ]
  },

  // Pizza & İtalyan
  'kosuyolu-pizza-rosario': {
    description: "Kalfa Çeşmesi Sokak'ta İtalyan şef yönetiminde odun ateşli taş fırında pişen ince çıtır hamurlu Napoli pizzaları ve taze ev yapımı makarnalar sunuyor.",
    whatToOrder: ['Pizza Margherita D.O.P.', 'Trüflü Dört Peynirli Pizza'],
    menuFrom: ['Tagliatelle al Funghi', 'Carpaccio di Manzo', 'Tiramisu Klasik'],
    alsoTry: ['İtalya usulü ev yapımı taze domates soslu gnocchi'],
    beforeYouGo: [
      'İstanbul’un en köklü ve otantik İtalyan restoranlarından biridir.',
      'Hafta sonu akşamları için rezervasyon yapılması tavsiye edilir.'
    ]
  },
  'kosuyolu-pizza-locale': {
    description: "Muhittin Üstündağ Caddesi'nde hafif mayalanmış ince hamuru, taze füme kaburga ve zengin peynir çeşitleriyle hazırlanan lezzetli pizzalar sunuyor.",
    whatToOrder: ['Füme Kaburgalı Pizza', 'Pizza Tartufo'],
    menuFrom: ['Dört Peynirli Pizza', 'Nutellalı Tatlı Pizza', 'Akdeniz Salatası'],
    alsoTry: ['Yemek sonrası fırından sıcak çıkan Nutellalı ve çilekli kapalı pizza'],
    beforeYouGo: [
      'Rahat ve modern bir ortamda hızlı ve kaliteli pizza deneyimi sunar.',
      'Paket servis ve yerinde tüketim için çok popülerdir.'
    ]
  },
  'kosuyolu-pizza-papajohns': {
    description: "Koşuyolu Caddesi üzerinde taze günlük açılan hamuru, özel sarımsak sosu ve bol malzemeli kalın kenar Amerikan tarzı pizzalarıyla tanınan pizza durağı.",
    whatToOrder: ['Super Papa', 'Special Garlic Soslu Çıtır Kenar'],
    menuFrom: ['Pepperoni Pizza', 'Tavuklu Barbekü Pizza', 'Peynirli Ekmek'],
    alsoTry: ['Orijinal tereyağlı ve sarımsaklı dip sos eşliğinde çıtır pizza kenarları'],
    beforeYouGo: [
      'Geç saatlere kadar açık ve hızlı servis imkanı sağlar.',
      'Aileler ve gruplar için ekonomik menü seçenekleri bulunur.'
    ]
  },
  'kosuyolu-pizza-pizzav': {
    description: "Şeyh Galip Sokak'ta yirmiden fazla zengin pizza çeşidi, doyurucu porsiyonları ve sıcak aile ortamıyla Koşuyolu ve Acıbadem hattının sevilen pizzacısı.",
    whatToOrder: ['Pizza V Special', 'Kavurmalı Taşfırın Pizza'],
    menuFrom: ['Dört Mevsim Pizza', 'Calzone', 'Sezar Salata', 'Fırın Patates'],
    alsoTry: ['Özel baharat karışımlı çıtır patates dilimleri'],
    beforeYouGo: [
      'Doyurucu porsiyonları ve samimi servisiyle mahallenin güvenilen pizzacısıdır.',
      'Geniş masalarıyla çocuklu aileler için elverişlidir.'
    ]
  },

  // =========================================================================
  // ACIBADEM (KADIKÖY & ÜSKÜDAR)
  // =========================================================================

  // Çikolata & Tatlı
  'acibadem-dessert-asuman': {
    description: "Çeçen Sokak'ta Belçika çikolatasıyla hazırlanan sıcak kupları, imza çilekli tatlıları ve şık butik atmosferiyle İstanbul'un en popüler çikolata durağı.",
    whatToOrder: ['Asuman İmzalı Çikolata Kupası', 'Ferhunde'],
    menuFrom: ['Oya', 'Mualla', 'Leman', 'Sıcak Çikolata', 'Espresso'],
    alsoTry: ['Fıstıklı ve krokanlı el yapımı trüf tabletleri'],
    beforeYouGo: [
      'Öğleden sonra ve akşam saatlerinde yoğun ilgi görür.',
      'Paket çikolata ve hediyelik kutular için de elverişlidir.'
    ]
  },
  'acibadem-dessert-foodlab': {
    description: "Betül Sokak'ta taze çilekli mereng pastası, San Sebastian cheesecake ve katmanlı lezzet kuplarıyla Acıbadem'in en yüksek puanlı tatlı atölyesi.",
    whatToOrder: ['Çilekli Mereng Pasta', 'Bask Cheesecake'],
    menuFrom: ['Yaban Mersinli Mereng', 'Belçika Çikolatalı Brownie', 'Filtre Kahve'],
    alsoTry: ['Taze orman meyveli çıtır mereng kupası'],
    beforeYouGo: [
      'Pastalar günlük sınırlı porsiyonlarda taze hazırlanır.',
      'Küçük ve samimi oturma alanına sahiptir.'
    ]
  },
  'acibadem-dessert-veronika': {
    description: "Acıbadem Caddesi'nde kat kat açılan çıtır tereyağlı kruvasanları, taze Belçika çikolatası ve tatlı dolgularıyla buluşturan artizan tatlı durağı.",
    whatToOrder: ['Çikolata Dolgulu Kruvasan', 'Antep Fıstıklı Rolls'],
    menuFrom: ['Kruvasan Sandviç', 'Karamelli Tart', 'Latte', 'Cortado'],
    alsoTry: ['Sıcak espresso yanında taze fırından çıkan tereyağlı kruvasan'],
    beforeYouGo: [
      'Kruvasanlar sabah ve öğle saatlerinde taze pişirilir.',
      'Cadde üzeri hareketli bir kahve-tatlı molası sunar.'
    ]
  },
  'acibadem-dessert-kukis': {
    description: "Acıbadem Caddesi'nin köklü buluşma noktası olarak tereyağlı kurabiyeleri, vitrin pastaları ve zengin unlu mamulleriyle semtin klasikleşmiş lezzet durağı.",
    whatToOrder: ['Kukis Klasik Kurabiye Seçkisi', 'Çilekli Milföy Pasta'],
    menuFrom: ['Profiterol', 'Acıbadem Kurabiyesi', 'Ekler', 'Demleme Çay'],
    alsoTry: ['Fırından yeni çıkan sıcak acıbadem kurabiyesi'],
    beforeYouGo: [
      'Acıbadem metrosuna yürüme mesafesinde merkezi konumdadır.',
      'Günün her saatinde canlı ve hareketlidir.'
    ]
  },

  // Nitelikli Kahve & Kafe
  'acibadem-coffee-bakku': {
    description: "Muhtarbey Sokak'ta sakin atmosferi, özenli tek köken çekirdekleri ve yüksek çalışma konforuyla semt sakinlerinin gözde üçüncü nesil kahvecisi.",
    whatToOrder: ['Ethiopia Yirgacheffe V60', 'Flat White'],
    menuFrom: ['Cortado', 'Cold Brew', 'Ev Yapımı Havuçlu Kek', 'Cookie'],
    alsoTry: ['Hafif kavrum aromatik pour-over filtre kahveler'],
    beforeYouGo: [
      'Laptopla çalışma ve sakin okuma için çok uygundur.',
      'Huzurlu bir sokak cephesi masalarına sahiptir.'
    ]
  },
  'acibadem-coffee-espressino': {
    description: "Acıbadem Caddesi üzerinde İtalyan espresso reçeteleri, evcil hayvan dostu sıcak ortamı ve taze atıştırmalıklarıyla öne çıkan mahalle kafesi.",
    whatToOrder: ['Espressino Klasik', 'Iced Americano'],
    menuFrom: ['Caffe Latte', 'Cappuccino', 'Tost Çeşitleri', 'Cheesecake'],
    alsoTry: ['Kakao ve süt köpüğü katmanlı özel Espressino'],
    beforeYouGo: [
      'Evcil hayvan dostu ve samimi bir işletmedir.',
      'Cadde üzerinde keyifli dış masaları mevcuttur.'
    ]
  },
  'acibadem-coffee-solvi': {
    description: "Acıbadem Caddesi'nde İskandinav esintili minimalist iç mekanı, taze kavrum kahveleri ve ferah çalışma düzeniyle dikkat çeken çağdaş kahve dükkanı.",
    whatToOrder: ['SØLVI Single Origin Drip', 'Cortado'],
    menuFrom: ['Espresso Tonic', 'Chai Latte', 'Kruvasan', 'Granola'],
    alsoTry: ['Mevsimlik soğuk demleme kahve harmanları'],
    beforeYouGo: [
      'Geniş ve aydınlık iç mekanıyla verimli çalışma imkanı sağlar.',
      'Metro çıkışına oldukça yakın konumdadır.'
    ]
  },
  'acibadem-coffee-feinka': {
    description: "Eczacı Necip Akar Sokak'ta sakin bahçesi, nitelikli demlemeleri ve lezzetli taze tatlılarıyla samimi bir üçüncü dalga kahve sığınağı.",
    whatToOrder: ['Guatemala Pour-Over', 'Flat White'],
    menuFrom: ['Latte', 'Cold Drip', 'Limonlu Kek', 'Fıstıklı Brownie'],
    alsoTry: ['Ev yapımı hafif ekşi limonlu kek eşliğinde filtre kahve'],
    beforeYouGo: [
      'Acıbadem Caddesi kalabalığından bir sokak içeride sakindir.',
      'Günün her saatinde rahatça dinlenilebilir.'
    ]
  },

  // Kebap & Döner
  'acibadem-kebap-hacibasar': {
    description: "Acıbadem Caddesi üzerinde puf lavaşları, zırh kıyması kebapları ve Antep fıstıklı sıcak baklavalarıyla Güneydoğu mutfağını yaşatan köklü restoran.",
    whatToOrder: ['Zırh Kıyması Acıbadem Kebabı', 'Közde Patlıcanlı Kebap'],
    menuFrom: ['Fındık Lahmacun', 'Çöp Şiş', 'Gavurdağı Salatası', 'Havuç Dilimi Baklava'],
    alsoTry: ['Yemek sonrasında semaver çayı eşliğinde çıtır sıcak baklava'],
    beforeYouGo: ['Geniş salonu ve vale hizmetiyle aile yemeklerine uygundur.', 'Lavaş ve mezeler masaya sıcacık ikram edilir.']
  },
  'acibadem-kebap-intiba': {
    description: "Şehit Emin Çölen Sokak'ta marine edilmiş yaprak etten meşe odunu ateşinde pişen tescilli döneri ve taze pidesiyle ünlü döner ustası.",
    whatToOrder: ['İntiba Yaprak Döner', 'Tereyağlı İskender'],
    menuFrom: ['Döner Dürüm', 'Açık Ayran', 'Köz Biber & Domates', 'Fırın Sütlaç'],
    alsoTry: ['İnce kıyım yaprak et döner yanında özel yayık ayran'],
    beforeYouGo: ['Öğle saatlerinde yoğun servis trafiği yaşanır.', 'Hızlı, doyurucu ve yüksek standartlı bir et döner klasiğidir.']
  },
  'acibadem-kebap-canak': {
    description: "Acıbadem Caddesi'nde Gaziantep mutfağının otantik tencere yemekleri, Ali Nazik kebabı ve çıtır taş fırın katmeriyle bilinen gastronomi adresi.",
    whatToOrder: ['Ali Nazik Kebabı', 'Çıtır Antep Katmeri'],
    menuFrom: ['Kuru Dolma', 'İçli Köfte', 'Küşleme', 'Lahmacun'],
    alsoTry: ['Bol kaymaklı ve Antep fıstıklı sıcak fırın katmeri'],
    beforeYouGo: ['Geleneksel Gaziantep tariflerini aslına uygun sunar.', 'Akşam yemekleri için rezervasyon önerilir.']
  },
  'acibadem-kebap-birbicer': {
    description: "Acıbadem Caddesi üzerinde mangal ateşinde pişen taze kuzu ciğer şişleri, zırh kebabı ve zengin ezme mezeleriyle tanınan Adana usulü kebapçı.",
    whatToOrder: ['Kuzu Ciğer Şiş', 'Zırh Adana Dürüm'],
    menuFrom: ['Közde Tavuk Kanat', 'Ezme Salata', 'Sumaklı Soğan', 'Şalgam'],
    alsoTry: ['Közlenmiş sarımsak ve sıcak lavaş eşliğinde kuzu ciğer'],
    beforeYouGo: ['Samimi bir esnaf kebapçısı lezzetindedir.', 'Siparişler taze ve hızlı servis edilir.']
  },

  // Bistro & Ev Yemekleri
  'acibadem-bistro-charla': {
    description: "Acıbadem Caddesi'nde modern dekorasyonu, sağlıklı dünya mutfağı tabakları ve özenli kahvaltı sunumlarıyla semtin en şık kafe-restoranı.",
    whatToOrder: ['Ağır Ateşte Osso Buco', 'Izgara Somon Kinoa Kasesi'],
    menuFrom: ['Truffle Burger', 'Fettuccine Alfredo', 'Burrata Salata', 'İmza Tatlılar'],
    alsoTry: ['Taze otlu kinoa yatağında fırınlanmış Norveç somonu'],
    beforeYouGo: ['Şık akşam yemekleri ve hafta sonu brunchları için idealdir.', 'Rezervasyon yaptırılması tavsiye edilir.']
  },
  'acibadem-bistro-draft': {
    description: "Acıbadem Caddesi üzerinde geniş terası, çıtır pub lezzetleri, gravyerli sosisleri ve rahat sosyalleşme ortamıyla bilinen popüler gastro-pub.",
    whatToOrder: ['Gravyerli Sosis & Patates', 'Draft Gurme Burger'],
    menuFrom: ['Çıtır Nachos', 'Buffalo Wings', 'Fish and Chips', 'Craft İçecekler'],
    alsoTry: ['Ev yapımı hardallı sos eşliğinde ızgara sosis tabağı'],
    beforeYouGo: ['Akşamüstü arkadaş buluşmaları ve maç yayınları için tercih edilir.', 'Açık teras alanı oldukça ferahtır.']
  },
  'acibadem-bistro-lagom': {
    description: "Sarayardı Caddesi'nde günlük zeytinyağlılar, taze anne yemekleri ve hafif tatlılarıyla samimi ve huzurlu bir mahalle lokantası deneyimi sunuyor.",
    whatToOrder: ['Zeytinyağlı Enginar', 'Fırın Güveçte Kuzu'],
    menuFrom: ['Mercimek Çorbası', 'Kıymalı Ispanak', 'Ev Yapımı Yoğurt', 'Günün Keki'],
    alsoTry: ['Taze mevsim sebzeleriyle günlük pişen zeytinyağlı tabağı'],
    beforeYouGo: ['Ayrılık Çeşmesi metro durağına yürüme mesafesindedir.', 'Hafif ve ev tadında sağlıklı öğle yemekleri için çok sevilir.']
  },
  'acibadem-bistro-aum': {
    description: "Acıbadem Caddesi'nde ekşi mayalı kahvaltılıklar, taze günlük fırın hamur işleri ve samimi kafe ortamıyla hizmet veren yerel lezzet köşesi.",
    whatToOrder: ['Ekşi Mayalı Kahvaltı Tabağı', 'Fırın Kiş & Salata'],
    menuFrom: ['Peynirli Poğaça', 'Zeytinli Açma', 'Çilekli Tart', 'Filtre Kahve'],
    alsoTry: ['Ispanaklı ve keçi peynirli sıcak fırın kiş'],
    beforeYouGo: ['Sabah saatlerinde taze çıkan unlu mamulleriyle hareketlidir.', 'Hızlı kahvaltı ve kahve molası için elverişlidir.']
  },

  // Region 6: Feneryolu (16 verified venues)
  // Nitelikli Kahve & Kafe
  'feneryolu-coffee-orlando': {
    description: "Gazi Muhtar Paşa Sokağı'nda özenle seçilmiş single-origin çekirdekleri, dingin atmosferi ve güler yüzlü baristalarıyla semtin en yüksek puanlı kahve durağı.",
    whatToOrder: ['Flat White', 'V60 Ethiopia Yirgacheffe'],
    menuFrom: ['Cortado', 'Cold Brew', 'San Sebastian Cheesecake', 'Fıstıklı Kurabiye'],
    alsoTry: ['Taze çekilmiş çekirdeklerle hazırlanan V60 pour-over filtre kahve'],
    beforeYouGo: [
      'Sessiz ve sakin ortamıyla kitap okumak veya bilgisayarla çalışmak için çok uygundur.',
      'Feneryolu Marmaray istasyonuna kısa yürüme mesafesindedir.'
    ]
  },
  'feneryolu-coffee-barneys': {
    description: "Sokağın canlı köşesinde samimi kafe ortamı, zengin espresso bazlı kahveleri ve ev yapımı tatlılarıyla mahallenin sevilen buluşma noktası.",
    whatToOrder: ['Iced Latte', 'Yaban Mersinli Tart'],
    menuFrom: ['Cappuccino', 'Americano', 'Havuçlu Tarçınlı Kek', 'Kruvasan Sandviç'],
    alsoTry: ['Günün taze fırınlanan ev yapımı meyveli tartı'],
    beforeYouGo: [
      'Dış masalarında oturup mahalle akışını izlemek oldukça keyiflidir.',
      'Öğleden sonraları kahve molaları için hareketlenir.'
    ]
  },
  'feneryolu-coffee-kaffabuna': {
    description: "Kuyubaşı Sokak'ta kahve kökenlerine sadık kalarak kavrulan nitelikli çekirdekleri, butik iç mekanı ve samimi mahalle ruhuyla öne çıkıyor.",
    whatToOrder: ['Aeropress Filtre Kahve', 'Lotus Cheesecake'],
    menuFrom: ['Espresso Macchiato', 'Flat White', 'Brownie', 'Fıstıklı Cookie'],
    alsoTry: ['Haftalık değişen mikro-lot Afrika ve Latin Amerika çekirdekleri'],
    beforeYouGo: [
      'Samimi ve kompakt bir mahalle kahvecisidir.',
      'Kendi kavurdukları paket çekirdek kahveleri ev için satın alabilirsiniz.'
    ]
  },
  'feneryolu-coffee-fenway': {
    description: "Mustafa Mazhar Bey Sokağı'nda ferah bahçe alanı, kendi kavurduğu özel harmanları ve taze fırın tatlılarıyla bilinen geniş kahve noktası.",
    whatToOrder: ['Cold Brew', 'Yaban Mersinli Cheesecake'],
    menuFrom: ['Flat White', 'V60 Filtre Kahve', 'Çikolatalı Brownie', 'Kruvasan'],
    alsoTry: ['Uzun demleme yöntemiyle hazırlanan yoğun aromalı cold brew'],
    beforeYouGo: [
      'Geniş oturma alanı ve priz imkanıyla uzaktan çalışanların gözdesidir.',
      'Hafta sonu bahçesi oldukça canlıdır.'
    ]
  },

  // Kahvaltı & Fırın
  'feneryolu-kahvalti-kameriye': {
    description: "Gazi Muhtar Paşa Korusu içindeki yemyeşil asırlık ağaçlar altında, zengin serpme kahvaltısı ve taş fırın sıcak hamur işleriyle doğayla iç içe bir vaha.",
    whatToOrder: ['Kameriye Serpme Kahvaltı', 'Taş Fırın Kıymalı Pide'],
    menuFrom: ['Menemen', 'Sahanda Sucuklu Yumurta', 'Sigara Böreği', 'Demlik Çay'],
    alsoTry: ['Taş fırından yeni çıkmış sıcak puf ekmek ve peynir tabağı'],
    beforeYouGo: [
      'Geniş yeşil bahçesiyle özellikle aileler ve hafta sonu kahvaltıları için çok popülerdir.',
      'Hafta sonu erken gitmek veya sıra beklemeyi göze almak önerilir.'
    ]
  },
  'feneryolu-kahvalti-safranbolu': {
    description: "1940'tan beri geleneksel fırıncılık mirasını sürdüren, taze çıtır simitleri, Boşnak börekleri ve ekşi mayalı taş fırın ekmekleriyle mahallenin köklü lezzet kalesi.",
    whatToOrder: ['Çıtır Boşnak Böreği', 'Sıcak Sokak Simiti & Çay'],
    menuFrom: ['Su Böreği', 'Tahinli Çörek', 'Ekşi Mayalı Ekmek', 'Peynirli Poğaça'],
    alsoTry: ['Kıymalı ve patatesli ince çıtır yufkalı taze Boşnak böreği'],
    beforeYouGo: [
      'Sabah erken saatlerde fırından yeni çıkan sıcak börek ve simit kuyrukları oluşur.',
      'Paket alıp sahilde veya evde kahvaltı yapmak için birebirdir.'
    ]
  },
  'feneryolu-kahvalti-salkim': {
    description: "Mustafa Mazhar Bey Caddesi'nde taze günlük kahvaltı tabakları, ev yapımı zeytinyağlı mezeleri ve anne eli değmiş sıcak lezzetleriyle huzurlu bir mahalle köşesi.",
    whatToOrder: ['Salkım Kahvaltı Tabağı', 'Ev Yapımı Günlük Meze Tabağı'],
    menuFrom: ['Otlu Peynirli Omlet', 'Anne Köftesi', 'Zeytinyağlı Yaprak Sarma', 'Ev Keki'],
    alsoTry: ['Taze otlu krep ve ev yapımı reçeller eşliğinde sabah kahvaltısı'],
    beforeYouGo: [
      'Hafif, temiz ve sağlıklı ev yemekleri ve sakin kahvaltı arayanların favorisidir.',
      'Taze günlük mezeleri paket olarak da alınabilir.'
    ]
  },
  'feneryolu-kahvalti-ekmek-firini': {
    description: "Feneryolu sokaklarında yıllardır taze sıcak taş fırın ekmekleri, odun ateşinde pişen gevrek simitleri ve klasik kahvaltılık unlu mamulleri sunan nostaljik fırın.",
    whatToOrder: ['Odun Ateşinde Taş Fırın Simiti', 'Taze Kaşarlı Açma'],
    menuFrom: ['Karaköy Poğaçası', 'Zeytinli Açma', 'Çavdar Ekmeği', 'Kepekli Ekmek'],
    alsoTry: ['Sabah ilk parti fırından çıkan gevrek susamlı sıcak simit'],
    beforeYouGo: [
      'Geleneksel mahalle fırını konseptindedir, hızlı al-götür kahvaltı için çok pratiktir.',
      'Marmaray yolunda sabah atıştırmalığı için ideal konumdadır.'
    ]
  },

  // Tatlı & Pastane
  'feneryolu-tatli-merveilleux': {
    description: "Hamdibey Sokağı'nda Fransız pastacılık teknikleriyle hazırlanan zarif eklerler, tereyağlı kruvasanlar ve düşük şekerli imza çikolatalı tatlılar sunan butik lezzet noktası.",
    whatToOrder: ['İmza Fransız Merveilleux', 'Paris-Brest Praliné'],
    menuFrom: ['Tereyağlı Kruvasan', 'Çilekli Tart', 'Çikolatalı Ekler', 'Flat White'],
    alsoTry: ['Karamelize fındık kremalı çıtır choux hamurlu Paris-Brest'],
    beforeYouGo: [
      'Tatlıların günlük üretimi sınırlı olduğundan popüler çeşitler öğleden sonra tükenebilir.',
      'Şık ve sakin dekorasyonuyla keyifli bir tatlı molası sunar.'
    ]
  },
  'feneryolu-tatli-sec-baklava': {
    description: "Bağdat Caddesi Feneryolu kesiminde Gaziantep usulü birinci sınıf çıtır havuç dilimi, fıstıklı sarma ve taze şerbetli tatlılarıyla cadde klasiği.",
    whatToOrder: ['Fıstıklı Havuç Dilimi Baklava', 'Maraş Dondurması'],
    menuFrom: ['Fıstık Sarma', 'Şöbiyet', 'Kuru Baklava', 'Su Böreği'],
    alsoTry: ['Sıcak servis edilen bol Antep fıstıklı çıtır havuç dilimi'],
    beforeYouGo: [
      'Bağdat Caddesi üzerinde kolay ulaşılabilir bir konumdadır.',
      'Özel gün tatlı siparişleri ve paket hediye kutuları için sıkça tercih edilir.'
    ]
  },
  'feneryolu-tatli-kuba': {
    description: "Feneryolu Sokağı üzerinde taze meyveli pastaları, el yapımı kurabiyeleri, profiterolü ve sıcak çay eşliğinde nostaljik mahalle pastanesi sıcaklığı.",
    whatToOrder: ['Çikolatalı Çilekli Rulo Pasta', 'Klasik Profiterol'],
    menuFrom: ['Marlenka', 'Ekler', 'Tuzlu Kuru Pasta', 'Demlik Çay'],
    alsoTry: ['Yoğun çikolata soslu taze kremalı profiterol tabağı'],
    beforeYouGo: [
      'Tren istasyonuna yakınlığıyla buluşma ve tatlı molası noktasıdır.',
      'Doğum günü ve özel kutlama pastaları sipariş edilebilir.'
    ]
  },
  'feneryolu-tatli-kerem': {
    description: "Feneryolu'nun köklü mahalle pastanelerinden biri olarak taze tartoletleri, badem ezmeleri ve geleneksel tatlılarıyla mahalle kültürünü yaşatıyor.",
    whatToOrder: ['Meyveli Tartolet', 'Çikolatalı Mozaik Pasta'],
    menuFrom: ['Balkan Çöreği', 'Acıbadem Kurabiyesi', 'Trileçe', 'Limonata'],
    alsoTry: ['Geleneksel tarife sadık kalınarak yapılan çıtır acıbadem kurabiyesi'],
    beforeYouGo: [
      'Yıllardır aynı sokakta hizmet veren samimi bir esnaf pastanesidir.',
      'Çay yanı atıştırmalık kurabiyeleri çok sevilir.'
    ]
  },

  // Makarna & Yerel Mutfak
  'feneryolu-bistro-spello': {
    description: "Gazi Muhtar Paşa Sokağı'nda günlük taze açılan el yapımı İtalyan makarnaları, trüflü sosları ve gurme smash burgerleriyle semtin en popüler yeni nesil mutfağı.",
    whatToOrder: ['Trüf Mantarlı Taze Tagliatelle', 'Spello Smash Burger'],
    menuFrom: ['Cacio e Pepe', 'Ravioli di Zucca', 'Çıtır Patates', 'Tiramisu'],
    alsoTry: ['Gözlerinizin önünde hazırlanan el yapımı taze dolgulu ricotta ravioli'],
    beforeYouGo: [
      'Kompakt ve şık bir mekandır, akşam saatlerinde yoğun olabileceğinden erken gitmek önerilir.',
      'Makarnalar günlük taze hamurdan açılmaktadır.'
    ]
  },
  'feneryolu-bistro-lamora': {
    description: "İnce ve kabarık kenarlı Napoli usulü taş fırın pizzaları, kaliteli mozzarella peyniri ve otantik İtalyan lezzetleriyle Feneryolu'nun pizza adresi.",
    whatToOrder: ['Pizza Margherita con Bufala', 'Quattro Formaggi'],
    menuFrom: ['Pizza Bresaola', 'Penne Arrabiata', 'Burrata Salata', 'Panna Cotta'],
    alsoTry: ['İtalyan unundan 48 saat fermente hamurla pişen Bufala Margherita'],
    beforeYouGo: [
      'Feneryolu Marmaray istasyonunun hemen yakınındaki şirin terasında keyifle yemek yenebilir.',
      'Gazi Muhtar Paşa hattının sakin atmosferine eşlik eder.'
    ]
  },
  'feneryolu-bistro-nur-kebap': {
    description: "Bağdat Caddesi üzerinde taş fırında çıtır pişen lahmacunları, zırh kıyması Adana kebapları ve dürümleriyle lezzet standardını yıllardır koruyan kebapçı.",
    whatToOrder: ['Çıtır Fındık & Antep Lahmacun', 'Zırh Adana Kebap'],
    menuFrom: ['Urfa Kebap', 'Çöp Şiş', 'Gavurdağı Salatası', 'Künefe'],
    alsoTry: ['İncecik çıtır hamurlu ve bol malzemeli fırın lahmacun'],
    beforeYouGo: [
      'Cadde üzerinde hızlı, lezzetli ve doyurucu bir akşam ya da öğle yemeği için idealdir.',
      'Öğle saatlerinde yoğun esnaf ve çevre sakinlerini ağırlar.'
    ]
  },
  'feneryolu-bistro-nakkas': {
    description: "Bağdat Caddesi ile Boztepe Sokağı kesişiminde zengin kebap çeşitleri, mezeleri ve geniş oturma alanıyla aile yemeklerinin köklü durağı.",
    whatToOrder: ['Nakkaş Özel Karışık Kebap', 'Fıstıklı Kebap'],
    menuFrom: ['Kuzu Şiş', 'Ali Nazik', 'Köz Patlıcan Salatası', 'Katmer'],
    alsoTry: ['Közlenmiş patlıcan yatağında servis edilen sıcak tereyağlı Ali Nazik'],
    beforeYouGo: [
      'Geniş kapalı ve bahçe alanıyla kalabalık grup ve aile buluşmaları için çok müsaittir.',
      'Hafta sonu akşamları için rezervasyon önerilir.'
    ]
  },

  // Region 7: Caddebostan (16 verified venues)
  // Nitelikli Kahve & Kafe
  'caddebostan-coffee-klar': {
    description: "Ömerpaşa Sokağı'nda İskandinav sadeliği, özenle demlenen üçüncü nesil filtre kahveleri ve artizan tatlılarıyla kahve severlerin vazgeçilmez durağı.",
    whatToOrder: ['Flat White', 'V60 Kenya Nyeri'],
    menuFrom: ['Cortado', 'Cold Brew', 'San Sebastian Cheesecake', 'Çikolatalı Cookie'],
    alsoTry: ['Narenciye ve çiçeksi notalara sahip V60 pour-over tek köken kahve'],
    beforeYouGo: [
      'Sessiz ve sakin çalışma ortamıyla laptop ile çalışanların tercihidir.',
      'Caddebostan Kültür Merkezi\'ne birkaç adım mesafededir.'
    ]
  },
  'caddebostan-coffee-orbis': {
    description: "Plaj Yolu Sokağı üzerinde ferah açık oturma alanı, taze kavrulmuş çekirdekleri ve dinamik barista enerjisiyle gün boyu canlı bir kahve noktası.",
    whatToOrder: ['Iced Americano', 'Muzlu Fındıklı Ekmek'],
    menuFrom: ['Latte', 'Aeropress', 'Fıstıklı Kruvasan', 'Limonlu Kek'],
    alsoTry: ['Günün taze fırınlanan sıcak muzlu cevizli ekmeği (banana bread)'],
    beforeYouGo: [
      'Caddebostan Sahili\'ne yürüyüşe çıkmadan önce kahve almak için mükemmel konumdadır.',
      'Dış mekan masaları arkadaş sohbetleri için çok sevilir.'
    ]
  },
  'caddebostan-coffee-nou': {
    description: "Plaj Yolu'nda estetik tasarımı, dengeli espresso harmanları ve sağlıklı kahvaltı kurgularıyla genç ve dinamik bir Caddebostan klasiği.",
    whatToOrder: ['Iced Vanilla Latte', 'Çilekli French Toast'],
    menuFrom: ['Cappuccino', 'Cold Brew', 'Acai Bowl', 'Avokadolu Tartine'],
    alsoTry: ['Brioche ekmeğine hazırlanan ev yapımı reçelli taze French Toast'],
    beforeYouGo: [
      'Hafta sonu öğle saatlerinde oturma alanı hareketlenir.',
      'Hem kahve hem de hafif atıştırmalıklar için çok yönlü bir menüye sahiptir.'
    ]
  },
  'caddebostan-coffee-meetlab': {
    description: "Selin Sokak'ta laboratuvar hassasiyetiyle demlenen nitelikli kahveleri, modern minimal dekoru ve samimi mahalle dokusuyla öne çıkan üçüncü nesil kafe.",
    whatToOrder: ['Cortado', 'Lotus Biscoff Cheesecake'],
    menuFrom: ['Espresso Tonic', 'Flat White', 'Brownie', 'Fıstıklı Kurabiye'],
    alsoTry: ['Ferahlatıcı espresso ve tonik suyunun buluştuğu buzlu Espresso Tonic'],
    beforeYouGo: [
      'İç mekandaki konforlu koltuklar kahve eşliğinde kitap okumak için idealdir.',
      'Çekirdek kahve çeşitleri paket olarak satın alınabilir.'
    ]
  },

  // Kahvaltı, Brunch & Fırın
  'caddebostan-brunch-cafecadde': {
    description: "1994'ten bu yana Bağdat Caddesi'nin simgesi haline gelen, yemyeşil kış bahçesi, zengin serpme kahvaltısı ve efsaneleşmiş buluşma atmosferi.",
    whatToOrder: ['Cadde Klasik Kahvaltı Tabağı', 'Otlu Peynirli Omlet'],
    menuFrom: ['Menemen', 'Eggs Benedict', 'Pankek Tabağı', 'Taze Sıkma Portakal Suyu'],
    alsoTry: ['Brioche ekmeğinde füme somonlu ve poşe yumurtalı Eggs Benedict'],
    beforeYouGo: [
      'Bağdat Caddesi üzerinde yılların en köklü buluşma adresidir.',
      'Hafta sonu geniş kış bahçesinde yer bulmak için rezervasyon önerilir.'
    ]
  },
  'caddebostan-brunch-sourandsweet': {
    description: "Plaj Yolu'nda uzun fermantasyonlu ekşi mayalı taş fırın ekmekleri, çıtır tereyağlı kruvasanları ve gurme ekmek üstü kahvaltı tabakları.",
    whatToOrder: ['Ekşi Mayalı Avokadolu Poşe Yumurta', 'Bademli Kruvasan'],
    menuFrom: ['Çırpılmış Yumurtalı Brioche', 'Granola Bowl', 'Ekşi Mayalı Baget', 'Filtre Kahve'],
    alsoTry: ['Taze dilimlenmiş ekşi mayalı ekmek üzerine avokado ezmesi ve poşe köy yumurtası'],
    beforeYouGo: [
      'Ekşi mayalı ekmekler öğleden sonra tükenebilir, erken saatte taze almak faydalıdır.',
      'Sahile inerken unlu mamul alışverişi için idealdir.'
    ]
  },
  'caddebostan-brunch-fiyonk': {
    description: "Şimşek Sokak'ta günlük taze pişen artizan börekleri, kruvasan sandviçleri ve renkli kahvaltı sofralarıyla mahallenin gizli fırın vahası.",
    whatToOrder: ['Kruvasan Kahvaltı Sandviçi', 'Fiyonk Serpme Kahvaltı'],
    menuFrom: ['Sahanda Göz Yumurta', 'Pişi Tabağı', 'Nutellalı Kruvasan', 'Demlik Çay'],
    alsoTry: ['Taze mozzarella, kurutulmuş domates ve fesleğenli sıcak kruvasan sandviç'],
    beforeYouGo: [
      'Samimi bir butik fırın konseptindedir.',
      'Caddeye paralel sakin sokakta huzurlu kahvaltı arayanlar için çok uygundur.'
    ]
  },
  'caddebostan-brunch-kasabim': {
    description: "İskele Sokak'ta sabah saatlerinden itibaren taze pişen sıcak puf pideleri, özel marinasyonlu yaprak döneri ve doyurucu esnaf lezzetleri.",
    whatToOrder: ['Tırnak Pidede Yaprak Döner', 'Yayık Ayran'],
    menuFrom: ['İskender', 'Döner Dürüm', 'Mercimek Çorbası', 'Fırın Sütlaç'],
    alsoTry: ['Közlenmiş domates ve biber eşliğinde porsiyon yaprak döner'],
    beforeYouGo: [
      'Öğle ve akşam saatlerinde hızlı, lezzetli ve doyurucu bir alternatif sunar.',
      'Barlar Sokağı girişinde merkezi bir konumdadır.'
    ]
  },

  // Tatlı, Dondurma & Pastane
  'caddebostan-dessert-paseo': {
    description: "Ömerpaşa Sokağı'nda tamamen doğal taze meyveler, İtalyan teknikleri ve katkısız sütle hazırlanan Kadıköy'ün en beğenilen artizan gelato durağı.",
    whatToOrder: ['Piedmont Fındıklı Gelato', 'Bodrum Mandalinası Sorbe'],
    menuFrom: ['Madagaskar Vanilya', 'Antep Fıstığı', 'Bitter Çikolata', 'Mango Sorbe'],
    alsoTry: ['Taze kavrulmuş İtalyan fındıklarından yapılan yoğun kıvamlı fındıklı dondurma'],
    beforeYouGo: [
      'Mevsim meyvelerine göre sorbe çeşitleri sürekli yenilenir.',
      'Caddebostan sahil yürüyüşü öncesi külah dondurma almak için ilk tercihtir.'
    ]
  },
  'caddebostan-dessert-girandola': {
    description: "İskele Sokak'ta gerçek İtalyan reçeteleriyle katkısız günlük hazırlanan, kazandibili ve balkabaklı imza çeşitleriyle cadde müdavimlerinin klasiği.",
    whatToOrder: ['Balkabaklı Dondurma', 'Yoğun Bitter Çikolata'],
    menuFrom: ['Kazandibili Gelato', 'Tuzlu Karamel', 'Orman Meyveli Sorbe', 'Kahveli Gelato'],
    alsoTry: ['Fırınlanmış balkabağı ve tarçın notalarıyla hazırlanan imza sonbahar dondurması'],
    beforeYouGo: [
      'Akşam saatlerinde sahile inenlerin uğrak noktası olduğu için hareketlidir.',
      'Glutensiz ve vegan meyve sorbeleri mevcuttur.'
    ]
  },
  'caddebostan-dessert-divan': {
    description: "Bağdat Caddesi üzerinde 1956'dan gelen saray pastacılığı mirası, efsanevi rokoko pastası, el yapımı pralinleri ve şık pastane salonu.",
    whatToOrder: ['Divan İmzası Rokoko Pastası', 'Pralin Çikolata'],
    menuFrom: ['Profiterol', 'Çikolatalı Ekler', 'Macaron Çeşitleri', 'Filtre Kahve'],
    alsoTry: ['Sıcak eritilmiş çikolata sosu eşliğinde servis edilen dondurmalı Rokoko pastası'],
    beforeYouGo: [
      'Özel kutlama pastaları ve prestijli hediye çikolatalar için ideal adrestir.',
      'Bağdat Caddesi alışveriş molalarında çay-pasta keyfi için çok ferahtır.'
    ]
  },
  'caddebostan-dessert-pelit': {
    description: "1957'den bu yana değişmeyen reçeteleriyle enfes çikolatalı yaş pastaları, tereyağlı kuru pastaları ve klasik İstanbul tatlı geleneğini yaşatan köklü adres.",
    whatToOrder: ['Çikolatalı Çilekli Yaş Pasta', 'El Yapımı Trüf Çikolata'],
    menuFrom: ['Kestaneli Pasta', 'Madlen Çikolata', 'Tuzlu Kandil Simiti', 'Demlik Çay'],
    alsoTry: ['Hakiki Belçika çikolatası ve taze çileklerle hazırlanan imza yaş pasta'],
    beforeYouGo: [
      'Göztepe Parkı ile Caddebostan aksı arasında kolay ulaşılır bir noktadadır.',
      'Taze günlük pastaları vitrinde zengin çeşitlilik sunar.'
    ]
  },

  // Bistro, İtalyan & Restoran
  'caddebostan-bistro-ilpadrino': {
    description: "1990'dan beri İtalyan Ticaret Odası ödüllü otantik taş fırın pizzaları, ev yapımı taze makarnaları ve sıcak Akdeniz atmosferiyle Caddebostan efsanesi.",
    whatToOrder: ['Pizza İl Padrino', 'Tortellini ai Funghi Porcini'],
    menuFrom: ['Carpaccio di Manzo', 'Lasagna Bolognese', 'Tiramisu Tradizionale', 'Chianti Şarap'],
    alsoTry: ['Porçini mantarlı ve hafif krema soslu el açımı taze tortellini'],
    beforeYouGo: [
      'İstanbul\'un en köklü İtalyan restoranlarından biridir.',
      'Akşam yemekleri için rezervasyon yapılması şiddetle önerilir.'
    ]
  },
  'caddebostan-bistro-sakibalik': {
    description: "İskele Sokak'ta günlük taze deniz balıkları, fesleğenli levrek marin mezesi ve deniz mahsulleri güveciyle samimi bir Ege balık lokantası.",
    whatToOrder: ['Izgara Günlük Kaya Levreği', 'Fesleğenli Levrek Marin'],
    menuFrom: ['Kalamar Tava', 'Tereyağlı Karides Güveç', 'Girit Ezmesi', 'Helva'],
    alsoTry: ['Taze otlar ve zeytinyağı ile marine edilen çıtır kalamar tava'],
    beforeYouGo: [
      'İskele Sokağı\'nın keyifli akşam enerjisini yaşamak için açık masaları idealdir.',
      'Hafta sonu akşamları mezeler erken saatte taze dizilir.'
    ]
  },
  'caddebostan-bistro-havelka': {
    description: "Yıllardır Caddebostan gençliğinin ve mahalle sakinlerinin buluştuğu, zengin burgerleri, çıtır atıştırmalık kovaları ve canlı bar atmosferiyle popüler mekan.",
    whatToOrder: ['Havelka Gurme Burger', 'Çıtır Combo Sepeti'],
    menuFrom: ['Buffalo Wings', 'Quesadilla', 'Mozzarella Sticks', 'Fıçı İçecekler'],
    alsoTry: ['Cheddar peynirli ve karamelize soğanlı çift köfteli gurme burger'],
    beforeYouGo: [
      'Arkadaş grubuyla maç izlemek veya akşamüstü atıştırmalığı için çok uygundur.',
      'Hafta sonu geceleri oldukça canlıdır.'
    ]
  },
  'caddebostan-bistro-theirishpub': {
    description: "Caddebostan Kültür Merkezi bünyesinde otantik pub ahşap dekorasyonu, zengin fıçı çeşitleri, fish & chips lezzeti ve kültür-sanat sonrası buluşma noktası.",
    whatToOrder: ['Geleneksel Fish and Chips', 'Pub Nachos Supreme'],
    menuFrom: ['Bangers and Mash', 'Baharatlı Patates', 'Dana Burger', 'Guinness & Craft İçecekler'],
    alsoTry: ['Çıtır malt kaplamalı mezgit filetosu ve ev yapımı tartar soslu Fish & Chips'],
    beforeYouGo: [
      'CKM\'deki tiyatro ve sinema gösterimleri sonrasında sohbet için popülerdir.',
      'Canlı spor karşılaşmaları yayınlanır.'
    ]
  },

  // Region 8: Suadiye (16 verified venues)
  // Nitelikli Kahve & Kafe
  'suadiye-coffee-glann': {
    description: "Ayşeçavuş Caddesi'nde üçüncü nesil nitelikli çekirdekleri, dingin çalışma köşeleri ve özenli demleme teknikleriyle Suadiye'nin en yüksek puanlı kahvecisi.",
    whatToOrder: ['Flat White', 'V60 Panama Geisha'],
    menuFrom: ['Cortado', 'Cold Brew', 'Fıstıklı Brownie', 'Yaban Mersinli Muffin'],
    alsoTry: ['Taze öğütülmüş tek köken çekirdeklerle hazırlanan V60 pour-over filtre kahve'],
    beforeYouGo: [
      'Sessiz ve konforlu ortamıyla çalışmak için idealdir.',
      'Suadiye Marmaray durağına yürüme mesafesindedir.'
    ]
  },
  'suadiye-coffee-matters': {
    description: "Pembe Gül Sokak'ta şık mimarisi, taze kavrum espresso çeşitleri ve gurme kruvasanlarıyla caddenin sevilen buluşma noktası.",
    whatToOrder: ['Iced Spanish Latte', 'Fıstıklı Kruvasan'],
    menuFrom: ['Americano', 'Cappuccino', 'San Sebastian Cheesecake', 'Cookie'],
    alsoTry: ['Karamelize fıstık kreması dolgulu çıtır fırın kruvasan'],
    beforeYouGo: [
      'Günün her saati enerjik ve hareketli bir kitleye sahiptir.',
      'Açık hava oturma alanı cadde akışını izlemek için elverişlidir.'
    ]
  },
  'suadiye-coffee-voi': {
    description: "Mücahit Sokak'ta sağlıklı ve glutensiz alternatifler, organik matcha latte ve fit tariflerle modern yaşam tarzına uygun bir kahve deneyimi.",
    whatToOrder: ['Iced Matcha Latte', 'Şekersiz Fit Brownie'],
    menuFrom: ['Cold Drip', 'Flat White', 'Acai Bowl', 'Chia Puding'],
    alsoTry: ['Yulaf sütü ve seremoniyel Japon matchasıyla hazırlanan buzlu Matcha Latte'],
    beforeYouGo: [
      'Fit beslenmeyi sevenler ve spor sonrası mola verenler için zengin alternatifler barındırır.',
      'Geniş bahçe alanı oldukça ferahtır.'
    ]
  },
  'suadiye-coffee-drip': {
    description: "Noter Sokak'ta Türkiye'nin soğuk damıtma (cold drip) öncülerinden biri olarak saatler süren özel demlemeleri ve zengin aromalı çekirdekleri sunuyor.",
    whatToOrder: ['Kyoto Style Cold Drip', 'Havuçlu Kek'],
    menuFrom: ['Aeropress', 'Chemex', 'Flat White', 'Çikolatalı Mozaik'],
    alsoTry: ['12 saatlik özel damıtma kulesinden süzülen yoğun aromalı Kyoto usulü Cold Drip'],
    beforeYouGo: [
      'Kahvenin lezzet profilini derinlemesine deneyimlemek isteyenlerin adresidir.',
      'Baristalar çekirdek profilleri konusunda bilgilendiricidir.'
    ]
  },

  // Kahvaltı, Fırın & Brunch
  'suadiye-brunch-bazlama': {
    description: "Noter Sokak'ta sınırsız Ege kahvaltısı, sıcacık anne bazlamaları, ev yapımı onlarca çeşit reçeli ve pişi servisiyle kahvaltı efsanesi.",
    whatToOrder: ['Ege Serpme Kahvaltı', 'Sıcacık Bazlama & Pişi'],
    menuFrom: ['Sahanda Yumurta', 'Menemen', 'İzmir Tulumu', 'Reçel Çeşitleri'],
    alsoTry: ['Masaya aralıksız sıcak servis edilen tereyağlı çıtır pişiler ve cevizli incir reçeli'],
    beforeYouGo: [
      'Hafta sonları kapıda yoğunluk oluşabilir, erken saatlerde gitmek tavsiye edilir.',
      'Sınırsız ikram konseptiyle oldukça doyurucudur.'
    ]
  },
  'suadiye-brunch-lepain': {
    description: "Bağdat Caddesi üzerinde ahşap ortak masaları, Belçika usulü ekşi mayalı ekmekleri, organik reçelleri ve zarif brunch tabakları.",
    whatToOrder: ['Avokadolu Somonlu Tartine', 'Organik Ekmek Sepeti'],
    menuFrom: ['Eggs Benedict', 'Granola Parfe', 'Belçika Waffle', 'Cafe au Lait'],
    alsoTry: ['Geleneksel kaselerde servis edilen Cafe au Lait ve fındık ezmesi'],
    beforeYouGo: [
      'Sakin ve dingin bir kahvaltı atmosferi arayanlar için idealdir.',
      'Organik fırın ekmekleri paket olarak satın alınabilir.'
    ]
  },
  'suadiye-brunch-grandma': {
    description: "Bağdat Caddesi'nde ekşi mayalı köy ekmekleri, taze fırın kişleri ve zengin unlu mamulleriyle samimi anne fırını konsepti.",
    whatToOrder: ['Grandma Kahvaltı Tabağı', 'Ispanaklı Keçi Peynirli Kiş'],
    menuFrom: ['Poşe Yumurtalı Ekmek Üstü', 'Zeytinli Ekmek', 'Çikolatalı Babka', 'Filtre Kahve'],
    alsoTry: ['Yoğun çikolatalı ve cevizli taze fırınlanmış dilim Babka'],
    beforeYouGo: [
      'Cadde üzerinde geniş ve aydınlık bir oturma alanına sahiptir.',
      'Sabah kahvaltısından akşamüstü kahvesine kadar günün her anı aktiftir.'
    ]
  },
  'suadiye-brunch-beyazfirin': {
    description: "Suadiye Park içinde 180 yılı aşkın lezzet geçmişi, puf börekleri, zengin kahvaltı sofraları ve fırın lezzetleriyle nesillerin tercihi.",
    whatToOrder: ['Suadiye Serpme Kahvaltı', 'Çıtır Kıymalı Puf Böreği'],
    menuFrom: ['Menemen', 'Simit Tabağı', 'Limonlu Mereng', 'Demlik Çay'],
    alsoTry: ['Özel reçeteli çıtır puf böreği ve ezine peyniri eşliğinde çay saati'],
    beforeYouGo: [
      'Suadiye Park içerisindeki geniş bahçesi aileler için çok konforludur.',
      'Günün her saati taze pastane mamulleri bulunur.'
    ]
  },

  // Tatlı, Gelato & Pastane
  'suadiye-dessert-nazar': {
    description: "Şaşkınbakkal-Suadiye aksında yılların değişmeyen reçetesi, ipeksi bitter çikolata sosu ve çıtır şu hamuruyla profiterolün kült adresi.",
    whatToOrder: ['Klasik Çikolata Soslu Profiterol', 'Taze Limonata'],
    menuFrom: ['Ekler', 'Supangle', 'Kazandibi', 'Tavukgöğsü'],
    alsoTry: ['Özel kıvamlı bitter çikolata sosuyla kaplanmış taze kremalı profiterol tabağı'],
    beforeYouGo: [
      'Nostaljik mahalle tatlıcısıdır, tatlılar günlük taze hazırlanır.',
      'Paket porsiyon olarak alıp evde tüketmek için de çok tercih edilir.'
    ]
  },
  'suadiye-dessert-tatlimanna': {
    description: "Suadiye Cami Sokağı'nda Belçika çikolatasıyla hazırlanan gurme profiterolleri, dondurmalı kaseleri ve hafif tatlılarıyla butik durak.",
    whatToOrder: ['Belçika Çikolatalı Anna Profiterol', 'Magnolia'],
    menuFrom: ['Beyaz Çikolatalı Profiterol', 'San Sebastian', 'Çilekli Kup', 'Espresso'],
    alsoTry: ['Sıcak akışkan sütlü ve bitter çikolata karışımıyla hazırlanan imza profiterol'],
    beforeYouGo: [
      'Sessiz bir ara sokakta sakin tatlı kaçamağı için elverişlidir.',
      'Çikolata sosunun yoğunluğu ve kalitesi öne çıkar.'
    ]
  },
  'suadiye-dessert-godiva': {
    description: "Bağdat Caddesi üzerinde lüks Belçika çikolatası sanatı, taze çilekli çikolata kaseleri ve imza sıcak çikolata içecekleri.",
    whatToOrder: ['Çikolatalı Taze Çilek Kasesi', 'Godiva Sıcak Çikolata'],
    menuFrom: ['Trüf Pralinler', 'Çikolatalı Fondü', 'Çikolatalı Waffle', 'Americano'],
    alsoTry: ['Eritilmiş sıcak Godiva çikolatasına batırılmış taze dağ çilekleri'],
    beforeYouGo: [
      'Özel hediye çikolata kutuları ve lüks tatlı molası için cadde klasiğidir.',
      'İç ve dış oturma alanı oldukça şıktır.'
    ]
  },
  'suadiye-dessert-manolya': {
    description: "Yıllardır Suadiye sakinlerinin özel günlerini tatlandıran, taze çilekli pastaları, el yapımı çikolataları ve fırın sütlacıyla güvenilir mahalle pastanesi.",
    whatToOrder: ['Çilekli Manolya Özel Yaş Pasta', 'Fırın Sütlaç'],
    menuFrom: ['Profiterol', 'Badem Ezmesi', 'Pötifur', 'Tuzlu Kuru Pasta'],
    alsoTry: ['Hafif pastacı kreması ve taze çileklerle hazırlanan günlük yaş pasta dilimi'],
    beforeYouGo: [
      'Kutlama pastası siparişlerinde mahallenin en köklü adreslerindendir.',
      'Tuzlu atıştırmalık kurabiyeleri çay saatleri için çok sevilir.'
    ]
  },

  // Bistro & Dünya Mutfağı
  'suadiye-bistro-townhouse': {
    description: "Plaj Yolu'nda zarif İngiliz pub mimarisi, zengin imza kokteylleri, kemik iliği soslu burgerleri ve üst düzey gastro-pub lezzetleriyle İstanbul'un gözdesi.",
    whatToOrder: ['Townhouse Burger', 'Truffle Fries & İmza Kokteyl'],
    menuFrom: ['Dana Yanak Pappardelle', 'Crispy Calamari', 'Fish and Chips', 'Sticky Toffee Pudding'],
    alsoTry: ['Karamelize soğan ve özel peynir harmanlı fırınlanmış Townhouse burger'],
    beforeYouGo: [
      'Anadolu Yakası\'nın en popüler akşam mekanlarındandır.',
      'Akşam yemekleri için günler öncesinden rezervasyon önerilir.'
    ]
  },
  'suadiye-bistro-brasserienoir': {
    description: "Bağdat Caddesi'nin prestijli noktasında şık Fransız brasserie estetiği, ördek konfit lezzeti, deniz mahsulleri ve seçkin şarap kavı.",
    whatToOrder: ['Ördek Konfi', 'Porçini Mantarlı Risotto'],
    menuFrom: ['Dana Bonfile', 'Somon Gravlax', 'Deniz Mahsullü Linguine', 'Creme Brulee'],
    alsoTry: ['Portakal sosu eşliğinde ağır ateşte pişirilmiş taptaze ördek konfi'],
    beforeYouGo: [
      'Özel akşam yemekleri, romantik kutlamalar ve iş yemekleri için ilk sıralardadır.',
      'Giyime özen gösterilen şık bir atmosferi vardır.'
    ]
  },
  'suadiye-bistro-kirpi': {
    description: "Bağdat Caddesi üzerinde ferah bahçesi, dünya mutfağından zengin menüsü, fajitaları ve rahat sosyalleşme ortamıyla cadde müdavimlerinin tercihi.",
    whatToOrder: ['Cızırdayan Etli Fajita', 'Trüflü Parmesanlı Burger'],
    menuFrom: ['Tavuklu Sezar Salata', 'Nachos', 'Quesadilla', 'Çikolatalı Sufle'],
    alsoTry: ['Döküm tavada sıcak servis edilen guacamole ve ekşi kremalı etli fajita'],
    beforeYouGo: [
      'Kalabalık arkadaş grupları ve aile yemekleri için geniş oturma alanı sağlar.',
      'Cadde üzerindeki konumuyla günün her saati canlıdır.'
    ]
  },
  'suadiye-bistro-akali': {
    description: "Akın Sokak'ta el yapımı ekmekleri, özel reçeteli sosları, patlıcan ezmeli ve trüflü gurme burgerleriyle burger tutkunlarının kült adresi.",
    whatToOrder: ['Patlıcan Ezmeli Akali Burger', 'Trüflü Patates'],
    menuFrom: ['Avokadolu Burger', 'Karamelize Soğanlı Burger', 'Jalapeno Poppers', 'Craft İçecekler'],
    alsoTry: ['Köz patlıcan ezmesi ve çıtır dana bacon eşliğindeki imza Akali burger'],
    beforeYouGo: [
      'Butik ve enerjik bir burger mekanıdır, burgerinizin gramajını seçebilirsiniz.',
      'Hızlı ve gurme bir sokak lezzeti deneyimi vadeder.'
    ]
  },

  // ==========================================
  // REGION 9: KUZGUNCUK (Üsküdar)
  // ==========================================
  // Bostan & Köy Kahvaltısı
  'kuzguncuk-kahvalti-pita': {
    description: "İcadiye Caddesi'nde fırından yeni çıkmış sıcak pitaları, ev yapımı reçelleri, Kars kaşarı ve otantik Kuzguncuk dokusuyla semtin en sevilen kahvaltı durağı.",
    whatToOrder: ['Kavurmalı Yumurtalı Sıcak Pita', 'Kuzguncuk Serpme Kahvaltısı'],
    menuFrom: ['Kars Kaşarlı Pita', 'Sebzeli Fırın Kiş', 'Ev Yapımı Vişne Reçeli', 'Taze Demleme Çay'],
    alsoTry: ['Taş fırında kabaran ince hamurlu tulum peynirli ve cevizli sıcak pita'],
    beforeYouGo: [
      'Hafta sonu sabahları önünde kuyruk oluşabilir, erken saatlerde gitmek avantajlıdır.',
      'Sıcak ve samimi bir mahalle kahvaltısı deneyimi sunar.'
    ]
  },
  'kuzguncuk-kahvalti-saraninbahcesi': {
    description: "İcadiye Caddesi'nin üst kısmında yeşillikler içindeki gizli bahçesi, çıtır pişileri ve odun sobası nostaljisiyle doğayla iç içe serpme kahvaltı keyfi.",
    whatToOrder: ['Sıcak Anne Pişisi', 'Zengin Bahçe Serpme Kahvaltısı'],
    menuFrom: ['Menemen', 'Muhlama', 'Köy Peynirleri Tabağı', 'Fırınlanmış Patates'],
    alsoTry: ['Altın sarısı çıtır pişi eşliğinde servis edilen acuka ve böğürtlen reçeli'],
    beforeYouGo: [
      'Geniş bahçesi ve asma altı masalarıyla huzurlu bir vaha gibidir.',
      'Geniş aile kahvaltıları ve kalabalık gruplar için uygundur.'
    ]
  },
  'kuzguncuk-kahvalti-botanica': {
    description: "İcadiye Caddesi'nde botanik bitkilerle çevrili ferah avlusu, sağlıklı kahvaltı kaseleri ve taze sıkma meyve sularıyla huzurlu bir bahçe kafesi.",
    whatToOrder: ['Avokadolu Poşe Yumurtalı Ekmek', 'Botanik Granola Kasesi'],
    menuFrom: ['Ekşi Mayalı Tost', 'Hellimli Izgara Salata', 'Detoks İçecekler', 'Filtre Kahve'],
    alsoTry: ['Ekşi maya ekmek üzerine ezilmiş avokado, labne ve organik poşe yumurta'],
    beforeYouGo: [
      'Yeşillikler içinde sakin kahvaltı veya kitap okuma molası için idealdir.',
      'Ferah kış bahçesi bölümü de mevcuttur.'
    ]
  },
  'kuzguncuk-kahvalti-cinaralti': {
    description: "İcadiye Caddesi'nin girişinde asırlık ulu çınarın gölgesinde, simit, peynir ve ince belli bardakta taze çayla geleneksel Boğaz kahvaltı klasiği.",
    whatToOrder: ['Tarihi Çınaraltı Kahvaltı Tabağı', 'Kıymalı Kaşarlı Menemen'],
    menuFrom: ['Kuzguncuk Simiti', 'Beyaz Peynir & Domates', 'Sahanda Sucuklu Yumurta', 'Demlik Çay'],
    alsoTry: ['Fırından taze gelen sıcak simit eşliğinde eritme kaşarlı sahanda yumurta'],
    beforeYouGo: [
      'Semtin nabzını tutan nostaljik meydan kahvesi atmosferine sahiptir.',
      'Boğaz vapurlarının sesini dinleyerek çay içmek için birebirdir.'
    ]
  },

  // Fırın & Butik Tatlıcılar
  'kuzguncuk-firin-tarihifirin': {
    description: "1929 yılından beri İcadiye Caddesi'nde hizmet veren, tescilli Kuzguncuk mantarı kurabiyesi, siyez unlu ekmekleri ve unsuz fit lezzetleriyle yaşayan bir efsane.",
    whatToOrder: ['Kuzguncuk Mantarı Kurabiyesi', 'Prenses Çikolatalı Kurabiye'],
    menuFrom: ['Siyez Ekmeği', 'Cevizli Tarçınlı Çörek', 'Unsuz Bademli Kurabiye', 'Acıbadem Kurabiyesi'],
    alsoTry: ['Acıbadem aromalı, üzeri fındıklı ve gevrek dokulu efsanevi Kuzguncuk mantarı'],
    beforeYouGo: [
      'Semte gelen herkesin eve paket kurabiye aldığı nostaljik bir duraktır.',
      'Tarihi fırın tezgahı sabahın erken saatlerinde taptaze dolar.'
    ]
  },
  'kuzguncuk-firin-dilimpastanesi': {
    description: "Paşalimanı Caddesi sahilinde taze frambuazlı pastaları, çıtır milföyleri, profiterolü ve klasik mahalle pastanesi zarafetiyle onlarca yıllık güvenilir lezzet.",
    whatToOrder: ['Çilekli Milföy Pasta', 'Çikolatalı Soslu Profiterol'],
    menuFrom: ['Krokanlı Yaş Pasta', 'Tuzlu Kuru Pasta', 'Peynirli Su Böreği', 'Ekler Çeşitleri'],
    alsoTry: ['İnce çıtır katlar arasına taze pastacı kremasıyla hazırlanan çilekli milföy'],
    beforeYouGo: [
      'Sahil yürüyüşü ve iskele molasında tatlı veya börek almak için uğranır.',
      'Klasik Türk pastaneciliğinin Boğaz kıyısındaki samimi temsilcisidir.'
    ]
  },
  'kuzguncuk-firin-galette': {
    description: "İcadiye Caddesi üzerinde butik fırıncılık anlayışıyla hazırlanan tatlı-tuzlu tartları, ev yapımı kekleri ve zarif Fransız esintili unlu mamulleri.",
    whatToOrder: ['Mevsim Meyveli Galette', 'Limonlu Merengli Tart'],
    menuFrom: ['Fıstıklı Brownie', 'Karamelli Cheesecake', 'Zeytinli Biberiyeli Focaccia', 'Americano'],
    alsoTry: ['Kıtır tereyağlı hamur içinde fırınlanmış taze şeftalili ve bademli sıcak galette'],
    beforeYouGo: [
      'Küçük ve şık vitriniyle dikkat çeker.',
      'Kahve eşliğinde taze fırın tatlısı molası vermek için biçilmiş kaftandır.'
    ]
  },
  'kuzguncuk-firin-cikolakahve': {
    description: "İcadiye Caddesi'nde el yapımı artisan trüfleri, sıcak çikolatası ve nostaljik dükkan atmosferiyle Kuzguncuk sokaklarına mis gibi kakao kokusu yayan durak.",
    whatToOrder: ['Sıcak Eritme Belçika Çikolatası', 'Narlı Fıstıklı El Yapımı Trüf'],
    menuFrom: ['Karamelli Tablet Çikolata', 'Portakallı Çikolata', 'Türk Kahvesi', 'Mocha'],
    alsoTry: ['Yoğun kakao kreması ve taze nar taneleriyle hazırlanan spesiyal artisan çikolata'],
    beforeYouGo: [
      'Hediyelik şık çikolata kutuları hazırlatmak için çok popülerdir.',
      'İçerideki nostaljik ahşap detaylar fotoğraf tutkunlarını çeker.'
    ]
  },

  // Nitelikli Kahve & Kitap
  'kuzguncuk-kahve-nailkitabevi': {
    description: "İcadiye Caddesi ile simgeleşen iki katlı tarihi ahşap binada, binlerce kitap arasında kahve yudumlanan, sanat ve edebiyat buluşma noktası.",
    whatToOrder: ['V60 Filtre Kahve', 'Kortado & Havuçlu Tarçınlı Kek'],
    menuFrom: ['Espresso', 'Latte', 'Bitki Çayları', 'San Sebastian Cheesecake'],
    alsoTry: ['Cumbalı pencere kenarında kitap okurken yudumlanan taze demlenmiş V60 filtre kahve'],
    beforeYouGo: [
      'Üst katındaki cumba köşesi Kuzguncuk\'un en ikonik okuma ve çalışma köşesidir.',
      'Sessiz ve saygılı bir edebiyat atmosferi hakimdir.'
    ]
  },
  'kuzguncuk-kahve-glow': {
    description: "Üryanizade Sokak'ta sakin konumu, modern İskandinav tasarımı, özenle kavrulmuş single-origin kahveleri ve ferah dış oturumuyla üçüncü nesil kahve vahası.",
    whatToOrder: ['Flat White', 'Cold Brew Reserve'],
    menuFrom: ['V60 Chemex', 'Iced Americano', 'Lotuslu Cheesecake', 'Fıstıklı Cookie'],
    alsoTry: ['Meyvemsi notalara sahip taze kavrum Etiyopya çekirdeğinden hazırlanan Flat White'],
    beforeYouGo: [
      'Ana caddenin kalabalığından uzaklaşıp sakin çalışmak veya sohbet etmek için mükemmeldir.',
      'Evcil hayvan dostu sıcak bir işletmedir.'
    ]
  },
  'kuzguncuk-kahve-kosinitza': {
    description: "İcadiye Caddesi'nin girişinde tarihi sokak dokusunu yansıtan masaları, taze çekirdek kahveleri ve samimi Kuzguncuk misafirperverliği.",
    whatToOrder: ['Damla Sakızlı Türk Kahvesi', 'Karamel Macchiato'],
    menuFrom: ['Double Espresso', 'Filtre Kahve', 'Mozaik Pasta', 'Brownie'],
    alsoTry: ['Bakır cezvede köz ateşinde ağır ağır pişirilmiş damla sakızlı aromalı Türk kahvesi'],
    beforeYouGo: [
      'Sokağa bakan küçük taburelerinde semt sakinleriyle sohbet etmek olağandır.',
      'Hızlı ve keyifli bir sokak kahvesi molası için idealdir.'
    ]
  },
  'kuzguncuk-kahve-neruda': {
    description: "İcadiye Caddesi üzerinde şair ruhlu dekorasyonu, zengin pour-over demleme seçenekleri ve samimi ortamıyla kahve tutkunlarının sığınağı.",
    whatToOrder: ['Chemex Demleme Kahve', 'Yaban Mersinli Crumble'],
    menuFrom: ['Latte', 'Aeropress Kahve', 'Vegan Sütlü Cappuccino', 'Tarçınlı Rulo'],
    alsoTry: ['Taze öğütülmüş Guatemala çekirdeğiyle demlenen pürüzsüz gövdeli Chemex kahve'],
    beforeYouGo: [
      'Kültür ve sanat temalı sıcak bir mahalle kafesidir.',
      'Vegan süt ve hafif tatlı alternatifleri sunulmaktadır.'
    ]
  },

  // Boğaz Balıkçıları & Kuzguncuk Lezzetleri
  'kuzguncuk-lokanta-baymanti': {
    description: "İcadiye Caddesi'nde çıtır çıtır kızarmış Feraye mantısı, klasik Sinop ve Kayseri mantıları ve ev yapımı soslarıyla İstanbul'un en yüksek puanlı mantıcılarından.",
    whatToOrder: ['Çıtır Feraye Mantısı', 'Tereyağlı Sinop Mantısı'],
    menuFrom: ['Kayseri Mantısı', 'Çiğ Börek', 'Günün Çorbası', 'Zeytinyağlı Sarma'],
    alsoTry: ['Üzeri yoğurt ve özel cevizli tereyağı sosuyla servis edilen çıtır kızarmış Feraye mantısı'],
    beforeYouGo: [
      'Mantı porsiyonları doyurucu ve lezzet kalitesi oldukça tutarlıdır.',
      'Öğle ve akşam yemeklerinde yerel halkın ilk tercihlerindendir.'
    ]
  },
  'kuzguncuk-lokanta-balikcisi': {
    description: "Meşhur Perihan Abla Sokağı'nda tarihi ahşap konaklar arasında, taze mevsim balıkları, balık çorbası ve çıtır kalamarıyla Kuzguncuk balıkçılık geleneği.",
    whatToOrder: ['Kuzguncuk Balık Çorbası', 'Izgara Lüfer & Çıtır Hamsi'],
    menuFrom: ['Tava Mezgit', 'Kalamar Tava', 'Roka Domates Salatası', 'Fırında Sıcak Helva'],
    alsoTry: ['Közlenmiş domates ve taze balık etiyle hazırlanan zengin taneli sıcak balık çorbası'],
    beforeYouGo: [
      'Perihan Abla dizisinin çekildiği tarihi sokağın tam kalbindedir.',
      'Alkol servisi bulunmayan, samimi ve kaliteli bir aile balık lokantasıdır.'
    ]
  },
  'kuzguncuk-lokanta-metet': {
    description: "İcadiye Caddesi'nde meşe odunu közünde pişen Balıkesir kıvırcık kuzu ve dana eti döneri, tırnak pidesi ve özel tereyağıyla döner tutkunlarının vazgeçilmezi.",
    whatToOrder: ['Közde Yaprak Döner Porsiyon', 'Tereyağlı İskender Döner'],
    menuFrom: ['Döner Dürüm', 'Manda Yoğurdu', 'Günün Çorbası', 'Fırın Sütlaç'],
    alsoTry: ['Odun ateşinde ağır ağır kızarmış, incecik yaprak kesim sulu közde döner'],
    beforeYouGo: [
      'İstanbul\'un en iyi odun ateşi dönercileri arasında gösterilir.',
      'Öğle saatlerinde döner hızlı tükenebilir, saat 12:00-14:00 arası idealdir.'
    ]
  },
  'kuzguncuk-lokanta-ismetbaba': {
    description: "1951'den beri Kuzguncuk İskelesi yanında Boğaz'a sıfır konumu, Can Yücel anıları, özel böreği ve taze mezeleriyle Türk meyhane ve balıkçılık tarihinin anıt mekanı.",
    whatToOrder: ['İsmet Baba Spesiyal Böreği', 'Boğaz Levrek Izgara'],
    menuFrom: ['Lakerda', 'Közde Patlıcan Salatası', 'Ahtapot Salatası', 'Kalamar Izgara'],
    alsoTry: ['İçerisinde balık ve patates püresi bulunan mekanın alametifarikası çıtır İsmet Baba böreği'],
    beforeYouGo: [
      'Deniz kenarındaki cam kenarı masalar için günler öncesinden rezervasyon şarttır.',
      'Nostaljik, sade ve tarihi dokusu korunmuş gerçek bir Boğaz meyhanesidir.'
    ]
  },

  // ==========================================
  // REGION 10: ÇENGELKÖY (Üsküdar)
  // ==========================================
  // Tarihi Çınaraltı Kahvaltısı & Boğaz Manzarası
  'cengelkoy-kahvalti-cinaralti': {
    description: "Asırlık ulu çınarın gölgesinde, Boğaz sularına sıfır konumu, dışarıdan börek getirme serbestliği ve demlik çay keyfiyle İstanbul'un en ikonik açık hava çay bahçesi.",
    whatToOrder: ['Tarihi Çınaraltı Demlik Çay', 'Sahanda Kaşarlı Yumurta'],
    menuFrom: ['Beyaz Peynirli Tost', 'Menemen', 'Simit & Kaşar', 'Türk Kahvesi'],
    alsoTry: ['Yan fırından aldığınız sıcacık Çengelköy böreği eşliğinde demli çay keyfi'],
    beforeYouGo: [
      'Dışarıdan yiyecek getirmek serbesttir, içecekler bahçeden sipariş edilir.',
      'Hafta sonları erken saatlerde gitmek deniz kenarı masalar için önemlidir.'
    ]
  },
  'cengelkoy-kahvalti-boon': {
    description: "Kara Sokak sahilinde panoramik Boğaz manzaralı terası, modern kafe estetiği ve zengin serpme kahvaltısıyla Çengelköy'ün en popüler buluşma noktalarından.",
    whatToOrder: ['Boon Gurme Serpme Kahvaltı', 'Avokadolu Poşe Yumurta'],
    menuFrom: ['Kruvasan Sandviç', 'Krep Çeşitleri', 'Pankek Kulesi', 'Filtre Kahve'],
    alsoTry: ['Boğaz manzarasına karşı ev yapımı reçeller ve sıcacık pişilerle zengin serpme kahvaltı'],
    beforeYouGo: [
      'Üst kat teras manzarası gün batımında ve sabah kahvaltısında büyüleyicidir.',
      'Hafta sonları sıra olabileceğinden erken saatler önerilir.'
    ]
  },
  'cengelkoy-kahvalti-sutis': {
    description: "Boğaz kıyısında manda sütünden kaymağı, kendi çiftliğinden peynirleri ve geleneksel Türk kahvaltı kültürüyle Sütiş kalitesinin Çengelköy yalısındaki adresi.",
    whatToOrder: ['Manda Kaymağı & Bal', 'Sıcak Kıymalı Su Böreği'],
    menuFrom: ['Menemen', 'Sucuklu Yumurta', 'Ezine Peyniri', 'Geleneksel Demleme Çay'],
    alsoTry: ['Rize çayı eşliğinde fırından yeni çıkmış çıtır katmerli su böreği ve taze manda kaymağı'],
    beforeYouGo: [
      'Denize sıfır iskele masaları manzarayı doyasıya izleme fırsatı sunar.',
      'Geniş aile kahvaltıları için oturma alanı ferahtır.'
    ]
  },
  'cengelkoy-kahvalti-muzelik': {
    description: "Kerime Hatun Camii Sokağı'nda antika eşyalar, plaklar ve nostaljik objelerle dekore edilmiş sıcacık bahçesinde ev yapımı samimi köy kahvaltısı.",
    whatToOrder: ['Müzelik Bahçe Kahvaltısı', 'Anne Eli Ev Pişisi'],
    menuFrom: ['Otlu Peynirli Omlet', 'Ev Yapımı Çilek Reçeli', 'Acuka', 'Köy Çayı'],
    alsoTry: ['Tavada taze kızartılmış puf puf pişiler ve ev yapımı cevizli acuka'],
    beforeYouGo: [
      'Kendinizi bir zaman makinesinde hissettiren antika dekoru fotoğraf için çok özeldir.',
      'Sakin ve huzurlu bir mahalle arası kahvaltısı sunar.'
    ]
  },

  // Tarihi Çengelköy Börekçisi & İkonik Tatlılar
  'cengelkoy-borek-tarihiborekci': {
    description: "Çengelköy Caddesi'nde çıtır çıtır kıymalı, cevizli, peynirli ve patatesli börekleriyle Türkiye çapında üne kavuşan Çengelköy börek geleneğinin doğduğu merkez.",
    whatToOrder: ['Cevizli Kıymalı Çengelköy Böreği', 'Peynirli Kol Böreği'],
    menuFrom: ['Patatesli Börek', 'Ispanaklı Börek', 'Küt Böreği', 'Ayran & Çay'],
    alsoTry: ['İçinde iri ceviz parçaları ve taze kıymayla fırından sıcak çıkan meşhur Çengelköy böreği'],
    beforeYouGo: [
      'Böreği buradan paket alıp Tarihi Çınaraltı Çay Bahçesi\'nde çayla tüketmek bir Çengelköy ritüelidir.',
      'Sabahları taze tepsiler peş peşe çıkar.'
    ]
  },
  'cengelkoy-tatli-seval': {
    description: "Çengelköy Caddesi üzerinde yarım asrı aşkın süredir badem ezmesi, çilekli pastası ve geleneksel tatlılarıyla semtin hafızası niteliğindeki tarihi pastane.",
    whatToOrder: ['Çengelköy Badem Ezmesi', 'Çilekli Rulo Pasta'],
    menuFrom: ['Profiterol', 'Acıbadem Kurabiyesi', 'Tahinli Çörek', 'Tuzlu Kuru Pasta'],
    alsoTry: ['Geleneksel taş havanlarda dövülerek hazırlanan katkısız taze Çengelköy badem ezmesi'],
    beforeYouGo: [
      'Nostaljik kutularında hediyelik badem ezmesi almak için semtin bir numaralı adresidir.',
      'Yıllardır değişmeyen mahalle pastanesi sıcaklığını korur.'
    ]
  },
  'cengelkoy-tatli-cikolakahve': {
    description: "Derecik Sokağı'nda çikolata çeşmelerinden akan Belçika çikolatası, el yapımı trüfleri ve tarihi ahşap dükkan kokusuyla tatlı tutkunlarının kült durağı.",
    whatToOrder: ['Eritme Sıcak Çikolata Kasesi', 'Fesleğenli Fıstıklı Trüf'],
    menuFrom: ['Muzlu Çikolatalı Pasta', 'Karamelli Tablet', 'Türk Kahvesi', 'Kakao Şerbeti'],
    alsoTry: ['Çilek ve muz dilimleri üzerine dökülen sıcak eritilmiş Belçika sütlü çikolatası'],
    beforeYouGo: [
      'Önündeki renkli banklarda kahve yudumlamak popülerdir.',
      'Tatlı ve yoğun kakao kokusu kapıdan girmeden sokakta hissedilir.'
    ]
  },
  'cengelkoy-tatli-buandbu': {
    description: "Çengelköy Caddesi'nde taze meyvelerle günlük üretilen artisan İtalyan gelatoları, keçi sütlü dondurmaları ve çıtır külahlarıyla yaz kış kuyruk olan lezzet noktası.",
    whatToOrder: ['Belçika Çikolatalı & Antep Fıstıklı Gelato', 'Karamelize İncirli Dondurma'],
    menuFrom: ['Limonlu Sorbe', 'Manda Sütlü Sade', 'Böğürtlenli Sorbe', 'Espresso'],
    alsoTry: ['Doğal şeker ve taze meyve püresiyle hazırlanan kıvamlı fıstıklı ve böğürtlenli sorbe'],
    beforeYouGo: [
      'Sahil yürüyüşü yaparken dondurma almak için mükemmel konumdadır.',
      'Mevsimine göre taze meyveli çeşitler sürekli güncellenir.'
    ]
  },

  // Nitelikli Kahve & Kafe
  'cengelkoy-kahve-gofi': {
    description: "Şenol Sokak'ta sakin bahçesi, zengin single-origin çekirdekleri, ev yapımı tartları ve modern çalışma ortamıyla Çengelköy'ün en sevilen yeni nesil kahvecisi.",
    whatToOrder: ['V60 Hand Brew', 'Lotus Biscoff Cheesecake'],
    menuFrom: ['Flat White', 'Cortado', 'Cold Brew', 'Havuçlu Tarçınlı Kek'],
    alsoTry: ['Çiçeksi ve narenciye notalı taze kavrulmuş Etiyopya çekirdeğinden V60 demleme kahve'],
    beforeYouGo: [
      'Sessiz arka bahçesinde laptopla çalışmak veya kitap okumak için çok uygundur.',
      'Güler yüzlü baristaları çekirdek seçiminde yardımcı olur.'
    ]
  },
  'cengelkoy-kahve-pureblack': {
    description: "Albay Hüsamettin Ertürk Sokağı'nda minimalist dekorasyonu, mikro-kavrum nitelikli kahveleri ve huzurlu köşesiyle kahve tutkunlarının gizli vahası.",
    whatToOrder: ['Flat White', 'Specialty Iced Latte'],
    menuFrom: ['Aeropress', 'Americano', 'Fıstıklı Brownie', 'Bademli Kurabiye'],
    alsoTry: ['Kusursuz kadifemsi mikro köpükle hazırlanan yoğun gövdeli Flat White'],
    beforeYouGo: [
      'Çarşının kalabalığından izole, sakin bir kahve sohbeti için idealdir.',
      'Çekirdek kahve satışı da mevcuttur.'
    ]
  },
  'cengelkoy-kahve-espressolab': {
    description: "Çengelköy İskelesi'nin yanı başında doğrudan Boğaz kıyısındaki geniş açık alanı, zengin pour-over barı ve kesintisiz vapur manzaralı kahve keyfi.",
    whatToOrder: ['Cold Brew Reserve', 'Karamel Macchiato'],
    menuFrom: ['Filtre Kahve', 'Kruvasan', 'Mocha', 'San Sebastian Cheesecake'],
    alsoTry: ['Boğaz esintisi eşliğinde yudumlanan soğuk demlenmiş meyvemsi Cold Brew'],
    beforeYouGo: [
      'Doğrudan deniz kenarındaki açık masalarıyla Çengelköy iskelesini seyre dalar.',
      'Hızlı kahve ve atıştırmalık molaları için elverişlidir.'
    ]
  },
  'cengelkoy-kahve-thepawn': {
    description: "Albay Hüsamettin Ertürk Sokağı'nda sıcak ahşap dekorasyonu, satranç konsepti, leziz tatlıları ve sakin sokak masalarıyla keyifli bir kafe deneyimi.",
    whatToOrder: ['Kortado', 'Ev Yapımı San Sebastian Cheesecake'],
    menuFrom: ['Latte', 'Chai Tea Latte', 'Çikolatalı Sufle', 'Bitki Çayları'],
    alsoTry: ['İnce kavrum espresso bazı ve ipeksi süt dengesiyle servis edilen sıcak kortado'],
    beforeYouGo: [
      'Semt dokusunu izleyerek sakin bir mola vermek isteyenler için uygundur.',
      'Masa oyunları ve sohbet için sıcaktır.'
    ]
  },

  // Boğaz Balıkçıları & Çengelköy Lezzetleri
  'cengelkoy-balik-delmare': {
    description: "Kuleli Caddesi'nde 19. yüzyıldan kalma tarihi fil ambarında, lüks balık kültürü, taze deniz mahsulleri ve eşsiz Boğaz manzarasıyla fine dining deneyimi.",
    whatToOrder: ['Tuzda Levrek', 'Ahtapot Izgara & Lakerda'],
    menuFrom: ['Deniz Mahsullü Paella', 'Kalamar Tava', 'Levrek Marin', 'İncir Tatlısı'],
    alsoTry: ['Ağır ateşte kömür ızgarasında yumuşacık pişirilmiş Ege ahtapot ızgara'],
    beforeYouGo: [
      'Avrupa yakasından özel tekne servisiyle ulaşım imkanı bulunur.',
      'Özel kutlamalar ve şık akşam yemekleri için önceden rezervasyon gerekir.'
    ]
  },
  'cengelkoy-balik-rigel': {
    description: "Kaptanı Derya Seyit Ali Paşa Sokağı'nda denize sıfır masaları, zengin Akdeniz mezeleri ve taptaze mevsim balıklarıyla Çengelköy sahilinin gözdesi.",
    whatToOrder: ['Fener Kavurma', 'Kaya Levrek Izgara'],
    menuFrom: ['Avokadolu Karides', 'Girit Ezmesi', 'Kalamar Dolma', 'Fırın Helva'],
    alsoTry: ['Toprak güveçte tereyağı, sarımsak ve taze otlarla fırınlanmış fener balığı kavurma'],
    beforeYouGo: [
      'Deniz kenarındaki balkon masaları özellikle gün batımında eşsizdir.',
      'Rezervasyon yaptırılması tavsiye edilir.'
    ]
  },
  'cengelkoy-balik-salvatore': {
    description: "Tarihi Boğaz yapısında Napoli tarzı odun fırını pizzaları, el yapımı taze makarnaları ve modern Akdeniz kokteylleriyle semtin en şık İtalyan restoranı.",
    whatToOrder: ['Trüflü Mantarlı Salvatore Pizza', 'Deniz Mahsullü Tagliolini'],
    menuFrom: ['Burrata Salata', 'Carpaccio di Manzo', 'Tiramisu', 'Signature İçecekler'],
    alsoTry: ['48 saat mayalanmış hafif hamuru ve taze trüf kremasıyla fırınlanmış imza Salvatore pizza'],
    beforeYouGo: [
      'Romantik akşam yemekleri ve özel buluşmalar için Çengelköy\'ün en popüler noktalarındandır.',
      'Rezervasyonsuz yer bulmak zordur.'
    ]
  },
  'cengelkoy-balik-chacha': {
    description: "Kuleli Caddesi üzerinde samimi Boğaz manzaralı terası, taze tava mezgiti, çıtır hamsisi ve sıcak aile ortamıyla Çengelköy balıkçılık geleneği.",
    whatToOrder: ['Çıtır Hamsi Tava', 'Izgara Lüfer & Balık Çorbası'],
    menuFrom: ['Kalamar Tava', 'Roka Helva Salatası', 'Karides Güveç', 'Fırında Tahin Helvası'],
    alsoTry: ['Mısır ununa bulanarak çıtır çıtır tavalanmış mevsim hamsisi ve roka salatası'],
    beforeYouGo: [
      'Gereksiz abartıdan uzak, kaliteli ve taze balık yemek isteyenler için idealdir.',
      'Fiyat-performans dengesi oldukça başarılıdır.'
    ]
  }
};

export function buildNeutralVisitorContent(candidate:ManagedCandidate,card:Pick<VenueCardData,'categoryId'|'areaLabel'>,now=new Date()):NeutralVisitorContent {
 const empty:NeutralVisitorContent={description:null,whatToOrder:[],menuFrom:[],alsoTry:[],beforeYouGo:[]};
 if(!candidate.identityVerified||candidate.conflicts.length||candidate.operation==='confirmed-closed'||candidate.operation==='closure-signal')return empty;
 const curated=SYNTHESIZED_VENUE_INSIGHTS[candidate.id];
 if(curated){
  return {
   description:curated.description,
   whatToOrder:[...curated.whatToOrder],
   menuFrom:curated.menuFrom?[...curated.menuFrom]:[],
   alsoTry:[...curated.alsoTry],
   beforeYouGo:[...curated.beforeYouGo],
  };
 }
 const products=candidate.evidence.filter(e=>e.usable&&e.kind==='operator'&&e.role==='menu'&&e.claimScope==='branch'&&e.branchId===candidate.id&&e.productCategory===card.categoryId&&dateIsRecent(e.checkedAt,now.getTime())&&safeUrl(e.url)).flatMap(e=>{
  const item=e.productName?PRODUCTS[normalize(e.productName)]:undefined;return item?[item]:[];
 });
 const drinks=Array.from(new Set(products.filter(p=>p.kind==='drink').map(p=>p.label))).slice(0,4);
 const foods=Array.from(new Set(products.filter(p=>p.kind==='food').map(p=>p.label))).slice(0,4);
 // No free-text source claims enter this template. Identity/category/location are app fields.
 const categoryLabels:Record<string,string>={coffee:'kahve',burger:'hamburger',pizza:'pizza',breakfast:'kahvaltı'};
 const category=categoryLabels[card.categoryId];
 const classified=candidate.productResearch?visitorProductLists(candidate.productResearch,card.categoryId):{whatToOrder:[],alsoTry:[],menuFrom:(card.categoryId==='coffee'?drinks:foods).slice(0,3)};
 return {description:category?`${card.areaLabel} bölgesinde ${category} mekanı.`:null,...classified,beforeYouGo:[]};
}

// A positive allowlist boundary: never spread the administrative DTO into visitor output.
export function toVisitorVenue(card:VenueCardData,officialGoogleResult?:RatingResult):VisitorVenueData {
 const content=card.visitorContent||{description:null,whatToOrder:[],menuFrom:[],alsoTry:[],beforeYouGo:[]};
 return {id:card.id,name:card.name,location:card.address,categoryId:card.categoryId,
  description:content.description,whatToOrder:[...content.whatToOrder],menuFrom:[...(content.menuFrom||[])],alsoTry:[...content.alsoTry],beforeYouGo:[...content.beforeYouGo],
  photo:card.photo&&safeUrl(card.photo.url)&&['CC0','public-domain','owned'].includes(card.photo.license)&&Number.isFinite(Date.parse(card.photo.verifiedAt))?{url:card.photo.url}:null,ratings:visitorGoogleRatings(card.id,officialGoogleResult)};
}
