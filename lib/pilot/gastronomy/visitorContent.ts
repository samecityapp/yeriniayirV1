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
  },

  // ==========================================
  // REGION 11: ÜSKÜDAR MERKEZ
  // ==========================================
  // Tarihi Esnaf Lokantaları & Meşhur Köfteciler
  'uskudar-lokanta-kanaat': {
    description: "1933'ten bu yana Selman-ı Pak Caddesi'nde hizmet veren, vitrinindeki onlarca çeşit zeytinyağlı, tencere yemeği ve geleneksel tatlılarıyla İstanbul'un en köklü esnaf lokantalarından biri.",
    whatToOrder: ['Kuzu Elbasan Tava', 'Zeytinyağlı Enginar'],
    menuFrom: ['Hünkar Beğendi', 'İçli Köfte', 'Zeytinyağlı Yaprak Sarma', 'Özbek Pilavı', 'Aşure', 'Kazandibi'],
    alsoTry: ['Manda sütünden yapılan meşhur kaymaklı ekmek kadayıfı'],
    beforeYouGo: [
      'Yemekler açık büfe tezgahından görerek seçilir ve masaya servis edilir.',
      'Öğle saatlerinde yoğunluk yüksektir; erken gitmek tüm çeşitleri bulmak adına avantaj sağlar.'
    ]
  },
  'uskudar-lokanta-filizler': {
    description: "Salacak sahil yolunda, doğrudan Kız Kulesi ve Tarihi Yarımada siluetine bakan geniş salonu ve terasıyla klasik ızgara köfte ve Boğaz manzarası sunan simge restoran.",
    whatToOrder: ['Filizler Özel Izgara Köfte', 'Piyaz'],
    menuFrom: ['Kaşarlı Köfte', 'Kuzu Şiş', 'Günün Çorbası', 'Gavurdağı Salatası', 'Fırın Sütlaç'],
    alsoTry: ['Izgara köftenin yanında servis edilen acı sos ve taze köy ekmeği'],
    beforeYouGo: [
      'Özellikle gün batımı ve akşam saatlerinde Kız Kulesi manzaralı masalar hızla dolar.',
      'Geniş aile grupları ve iş yemekleri için uygundur; otopark/vale hizmeti bulunur.'
    ]
  },
  'uskudar-lokanta-kofteci': {
    description: "Uncular Caddesi üzerinde samimi dükkanında, katkısız dana etiyle hazırlanan sulu ızgara köfteleri ve tereyağlı pilavıyla Üsküdarlıların vazgeçilmez yerel köftecisi.",
    whatToOrder: ['Porsiyon Izgara Köfte', 'Zeytinyağlı Piyaz'],
    menuFrom: ['Kaşarlı Köfte', 'Mercimek Çorbası', 'Tereyağlı Pirinç Pilavı', 'Kemalpaşa Tatlısı', 'Yayık Ayranı'],
    alsoTry: ['Izgara biber ve domatesle servis edilen hafif baharatlı köfte tabağı'],
    beforeYouGo: [
      'Geleneksel ve samimi bir mahalle esnaf köftecisidir; servis hızlıdır.',
      'Öğle saatlerinde dükkan içinde kısa süreli sıra oluşabilir.'
    ]
  },
  'uskudar-lokanta-deryadeniz': {
    description: "Üsküdar Tarihi Balıkçılar Çarşısı girişinde, günlük taze deniz ürünleri, çıtır hamsi tavası ve balık çorbasıyla tanınan köklü halk balık lokantası.",
    whatToOrder: ['Mevsimsel Çıtır Hamsi Tava', 'Balık Çorbası'],
    menuFrom: ['İstavrit Tava', 'Izgara Levrek', 'Mezgit Tava', 'Roka Salatası', 'Helva'],
    alsoTry: ['Mevsimine göre sunulan palamut veya lüfer ızgara'],
    beforeYouGo: [
      'Balıkçılar Çarşısı atmosferinde hızlı, lezzetli ve uygun fiyatlı balık deneyimi sunar.',
      'Alkol servisi bulunmayan geleneksel bir balık esnaf lokantasıdır.'
    ]
  },

  // Kız Kulesi & Boğaz Manzaralı Kahvaltı
  'uskudar-kahvalti-katibim': {
    description: "Salacak kıyısında, Kız Kulesi'nin tam karşısında yer alan geniş bahçesi ve Boğaz manzaralı terasında zengin serpme kahvaltı ve Türk mutfağı sunan tarihi mekan.",
    whatToOrder: ['Katibim Serpme Kahvaltı', 'Sahanda Sucuklu Yumurta'],
    menuFrom: ['Menemen', 'Gözleme Çeşitleri', 'Peynir Tabağı', 'Demlik Çay', 'Mıhlama'],
    alsoTry: ['Boğaz esintisi eşliğinde simit ve tulum peynirli kahvaltı tabağı'],
    beforeYouGo: [
      'Hafta sonu sabahları doğrudan sahil tarafındaki manzaralı masalar erken dolar.',
      'Geniş açık ve kapalı alanlara sahiptir, toplu buluşmalar için elverişlidir.'
    ]
  },
  'uskudar-kahvalti-payedar': {
    description: "Sultantepe Kurşunlu Medrese Sokak'ta, tarihi Osmanlı ahşap konağı atmosferinde huzurlu iç avlusu, serpme kahvaltısı ve geleneksel Türk kahveleriyle öne çıkan mekan.",
    whatToOrder: ['Payedar Avlu Kahvaltısı', 'Fırında Eritme Peynirli Ekmek'],
    menuFrom: ['Menemen', 'Kavurmalı Yumurta', 'Sıcak Pişi Tabağı', 'Filtre Kahve', 'Kumda Türk Kahvesi'],
    alsoTry: ['Geleneksel fincanlarda sunulan damla sakızlı Türk kahvesi'],
    beforeYouGo: [
      'Sakin ve tarihi sokak dokusu içerisinde dinlendirici bir kahvaltı ve kahve ortamı sunar.',
      'Tarihi avlu masaları hafta sonları yoğun ilgi görür.'
    ]
  },
  'uskudar-kahvalti-cappadocia': {
    description: "Uncular Caddesi'nde modern kafe tasarımı, taze fırın ürünleri, kruvasan sandviçleri ve özenli kahvaltı tabaklarıyla gençlerin ve mahalle sakinlerinin uğrak noktası.",
    whatToOrder: ['Füme Etli Kruvasan Sandviç', 'Karamelli Latte'],
    menuFrom: ['Avokadolu Poşe Yumurta', 'Ekşi Mayalı Tost', 'Granola Kasesi', 'Americano', 'San Sebastian Cheesecake'],
    alsoTry: ['Günlük fırından çıkan tereyağlı sade ve bademli kruvasanlar'],
    beforeYouGo: [
      'Kahvaltı ve çalışma için konforlu oturma düzeni ve priz imkanı bulunur.',
      'Marmaray ve vapur iskelesine birkaç dakikalık yürüme mesafesindedir.'
    ]
  },
  'uskudar-kahvalti-nuuva': {
    description: "Uncular Caddesi üzerinde şık ve ferah iç mekanı, artizan ekşi maya ekmekleri, gurme kahvaltı kaseleri ve nitelikli kahveleriyle dikkat çeken üçüncü nesil fırın-kafe.",
    whatToOrder: ['Nuuva Ekşi Mayalı Kahvaltı Tabağı', 'Flat White'],
    menuFrom: ['Çırpılmış Yumurtalı Brioche', 'Füme Hindili Sandviç', 'Orman Meyveli Bowl', 'Filtre Kahve', 'Limonlu Tart'],
    alsoTry: ['Kendi fırınlarında taş tabanlı fırında pişen taze ekşi mayalı köy ekmeği'],
    beforeYouGo: [
      'Hafif ve dengeli kahvaltı alternatifleri arayanlar için idealdir.',
      'Kahve çekirdekleri haftalık taze kavrumlardan seçilir.'
    ]
  },

  // Tarihi Tatlıcılar, Helva & Dondurma
  'uskudar-tatli-hafizmustafa': {
    description: "1864'ten beri geleneksel Türk tatlıcılığını yaşatan, vitrinindeki rengarenk lokumları, tepsiler dolusu tereyağlı baklavaları ve sütlü tatlılarıyla dünya çapında tanınan tarihi tatlıcı.",
    whatToOrder: ['Fıstıklı Havuç Dilim Baklava', 'Trileçe'],
    menuFrom: ['Fıstıklı Sarma Baklava', 'Kazandibi', 'Tavukgöğsü', 'Güllü Lokum', 'Geleneksel Türk Kahvesi'],
    alsoTry: ['Hakiki manda kaymağı eşliğinde sunulan ılık fıstıklı baklava'],
    beforeYouGo: [
      'Üsküdar meydan ve vapur iskelesine çok yakındır; hediyelik lokum ve paketleme servisi çok gelişmiştir.',
      'Turistik ve yerel yoğunluk sebebiyle günün her saati hareketlidir.'
    ]
  },
  'uskudar-tatli-helvaciali': {
    description: "1900 yılından günümüze gelen İnegöl geleneğiyle, sıcak irmik helvası üzerine maraş dondurması ve bol antep fıstığıyla sunulan porsiyon helva konseptinin öncüsü.",
    whatToOrder: ['Dondurmalı İrmik Helvası', 'Cevizli İrmik Helvası'],
    menuFrom: ['Fıstıklı İrmik Helvası', 'Tahinli Sıcak Helva', 'Kestane Şekeri', 'Osmanlı Şerbeti', 'Çay'],
    alsoTry: ['Sıcak helva ile soğuk maraş dondurmasının yarattığı zıt lezzet dengesi'],
    beforeYouGo: [
      'Tatlılar tek kişilik kaselerde pratik ve hızlı şekilde servis edilir.',
      'Ayaküstü veya kısa molalar için Selman-ı Pak Caddesi üzerindedir.'
    ]
  },
  'uskudar-tatli-haciserif': {
    description: "Denizli Babadağ kökenli asırlık şekerleme ve helva ustası Hacı Şerif'in, dondurmalı sıcak helvası, çikolatalı lokumları ve meyve tatlılarıyla bilinen Üsküdar şubesi.",
    whatToOrder: ['Dondurmalı Sıcak İrmik Helvası', 'Çikolata Kaplı Lokum'],
    menuFrom: ['Cevizli İncir Tatlısı', 'Tahin Helvası', 'Krokan Çeşitleri', 'Türk Kahvesi'],
    alsoTry: ['Geleneksel yöntemle dövülmüş taze tahin helvası'],
    beforeYouGo: [
      'Tadım ikramları eşliğinde kutulu paket veya kasede sıcak servis tercih edilebilir.',
      'Çarşı içinde alışveriş molası için ideal bir uğrak noktasıdır.'
    ]
  },
  'uskudar-tatli-boluluhasanusta': {
    description: "Geleneksel sütlü tatlı tariflerini modern hijyenle buluşturan, fırın sütlacı, kazandibisi ve tavukgöğsüyle Türkiye çapında güven kazanan tatlı durağının Üsküdar merkezi.",
    whatToOrder: ['Fırın Sütlaç', 'Geleneksel Kazandibi'],
    menuFrom: ['Tavukgöğsü', 'Profiterol', 'Keşkül', 'Maraş Usulü Dondurma', 'Demleme Çay'],
    alsoTry: ['Üzeri nar gibi kızarmış, kıvamı yerinde soğuk fırın sütlaç'],
    beforeYouGo: [
      'Hafif sütlü tatlı sevenler için hızlı ve istikrarlı bir lezzet seçeneğidir.',
      'Selman-ı Pak Caddesi üzerinde rahat oturma alanına sahiptir.'
    ]
  },

  // Kültür & Sanat Kafeleri / Nitelikli Kahve
  'uskudar-kahve-nevmecan': {
    description: "Şemsipaşa sahilinde tarihi un fabrikasının dönüştürülmesiyle kurulan; kubbeli devasa kütüphanesi, sanat galerisi, bahçesi ve Boğaz manzarasıyla İstanbul'un en özel kültür mekanlarından.",
    whatToOrder: ['Nevmekan Özel Filtre Kahve', 'Havuçlu Tarçınlı Kek'],
    menuFrom: ['Latte', 'Türk Kahvesi', 'Cheesecake Çeşitleri', 'Simit & Kaşar', 'Bitki Çayları'],
    alsoTry: ['Kütüphanenin sessiz çalışma kubbesinde kitap okurken yudumlanan sıcak çay'],
    beforeYouGo: [
      'Girişte ve kütüphane salonunda sessizlik kuralına özen gösterilir.',
      'Öğrenciler ve araştırmacılar için popülerdir; hafta içi gündüz saatleri daha sakindir.'
    ]
  },
  'uskudar-kahve-heeps': {
    description: "Mimar Sinan Mahallesi'nde yer alan, minimal iskandinav iç mekanı, tek kökenli (single-origin) çekirdekleri ve titiz espresso demlemeleriyle Üsküdar'ın öne çıkan nitelikli kahvecisi.",
    whatToOrder: ['V60 Ethiopia Pour-over', 'Cortado'],
    menuFrom: ['Flat White', 'Cold Brew', 'Muzlu Ekmek (Banana Bread)', 'Limonlu Cookie', 'Matcha Latte'],
    alsoTry: ['Baristanın o gün önerdiği natürel işlenmiş Afrika çekirdeğinden V60 demleme'],
    beforeYouGo: [
      'Marmaray istasyonuna 2 dakika yürüme mesafesinde sakin bir ara sokaktadır.',
      'Laptop ile çalışma ve kaliteli kahve molası için elverişli bir ortam sunar.'
    ]
  },
  'uskudar-kahve-kadim': {
    description: "Hakimiyet-i Milliye Caddesi üzerinde, tarihi dokuyu yansıtan otantik iç mimarisi, sedirli oturma köşeleri ve zengin kahve menüsüyle Üsküdar'ın nostaljik buluşma noktası.",
    whatToOrder: ['Kumda Geleneksel Türk Kahvesi', 'Kadim Spesiyal Pasta'],
    menuFrom: ['Menengiç Kahvesi', 'Dibek Kahvesi', 'Filtre Kahve', 'Karaköy Poğaçası', 'Tiramisu'],
    alsoTry: ['Özel bakır cezvede közde ağır ağır pişen bol köpüklü Türk kahvesi'],
    beforeYouGo: [
      'Tarihi ve mistik atmosferi sevenler için ferah ve sıcak bir ortam sunar.',
      'Üsküdar meydanındaki camilere ve toplu taşımaya çok yakın mesafededir.'
    ]
  },
  'uskudar-kahve-arvav': {
    description: "Doğancılar Caddesi üzerinde, geniş oturma alanları, taze demlenmiş kahveleri, lezzetli tatlıları ve kutu oyunları koleksiyonuyla gençlerin buluştuğu enerjik sosyal kafe.",
    whatToOrder: ['Iced Salted Caramel Latte', 'Lotuslu Cheesecake'],
    menuFrom: ['Americano', 'Chai Tea Latte', 'Frambuazlı Brownie', 'Sıcak Çikolata', 'Filtre Kahve'],
    alsoTry: ['Arkadaş grubuyla kutu oyunu oynarken tercih edilen buzlu espresso içecekleri'],
    beforeYouGo: [
      'Grup buluşmaları, kutu oyunları ve keyifli sohbetler için geniş masalar mevcuttur.',
      'Doğancılar Parkı civarındadır, cadde üzerinden kolayca ulaşılır.'
    ]
  },

  // ==========================================
  // REGION 12: KARAKÖY (Beyoğlu)
  // ==========================================
  // Tarihi Lokantalar & Özgün Lezzetler
  'karakoy-lokanta-karakoylokantasi': {
    description: "1900'lerin başında inşa edilmiş tarihi Liman Han'da çini karolarla kaplı ikonik salonu, öğlenleri zengin zeytinyağlı esnaf sofrası ve akşamları modern meyhane kimliğiyle Karaköy'ün simge mekanı.",
    whatToOrder: ['Karaköy Hünkar Beğendi', 'Ahtapot Izgara'],
    menuFrom: ['Enginar Kalbi', 'Zeytinyağlı Kereviz', 'Topik', 'Fava', 'Levrek Simit', 'Köz Patlıcan'],
    alsoTry: ['Geleneksel usulde servis edilen manda kaymaklı sıcak irmik helvası'],
    beforeYouGo: [
      'Öğle servisinde esnaf lokantası konseptindedir; akşamları meyhaneye dönüşür ve günler öncesinden rezervasyon önerilir.',
      'Karaköy vapur iskelesine ve Galataport\'a çok kısa yürüme mesafesindedir.'
    ]
  },
  'karakoy-lokanta-mahkeme': {
    description: "Tarihi Ceneviz Mahkemesi sokağında, restore edilmiş tarihi handa nostaljik avlusu, geleneksel Türk tencere yemekleri ve akşamları fasıllı meyhane sofrasıyla dikkat çeken mekan.",
    whatToOrder: ['Kuzu Gerdan', 'Mahkeme Mezeleri Tabağı'],
    menuFrom: ['Zeytinyağlı Enginar', 'Kuru Patlıcan Dolması', 'Yaprak Ciğer', 'Girit Ezmesi', 'Pirinç Pilavı'],
    alsoTry: ['Odun ateşinde ağır ağır pişen kemikli kuzu tandır'],
    beforeYouGo: [
      'Perşembe Pazarı\'nın tarihi sokak dokusunu hissettiren özgün bir atmosfer sunar.',
      'Akşam saatlerinde canlı Türk sanat müziği ve meze eşliğinde yoğun ilgi görür.'
    ]
  },
  'karakoy-lokanta-corbaevi': {
    description: "Mumhane Caddesi üzerinde günün her saati kaynayan 20'den fazla geleneksel çorba çeşidi, taze ekmekleri ve samimi ortamıyla İstanbul'un en meşhur çorbacısı.",
    whatToOrder: ['Karaköy Kelle Paça', 'Beyran Çorbası'],
    menuFrom: ['Mercimek Çorbası', 'Ezogelin', 'Yayla Çorbası', 'Tavuk Suyu', 'İşkembe', 'Ayran'],
    alsoTry: ['Bol sarımsak ve sirkeli sos eşliğinde servis edilen sıcak kelle paça'],
    beforeYouGo: [
      '7 gün 24 saat kesintisiz hizmet verir; gece eğlencesi sonrası ve sabah erken saatlerde çok popülerdir.',
      'Küçük ve hareketli bir esnaf dükkanıdır, oturma düzeni sıktır.'
    ]
  },
  'karakoy-lokanta-namli': {
    description: "Mumhane Caddesi'nde şarküteri reyonundan seçtiğiniz özel peynirler, füme etler, sıcak sahanda sucuklu yumurta ve zeytinyağlılarıyla gurme kahvaltı ve öğle yemeği klasiği.",
    whatToOrder: ['Gurme Şarküteri Tabağı', 'Hellimli Sahanda Sucuk'],
    menuFrom: ['Eski Kaşar', 'Pastırma', 'Menemen', 'Zeytinyağlı Dolma', 'Kavurmalı Yumurta', 'Taze Portakal Suyu'],
    alsoTry: ['Reyondan seçtiğiniz füme et ve peynirlerle hazırlanan sıcak ızgara tost'],
    beforeYouGo: [
      'Kahvaltı malzemeleri açık tezgahtan tartılarak seçilir.',
      'Hafta sonları öğle saatlerine kadar yoğun kuyruklar oluşabilir.'
    ]
  },

  // 3. Nesil Nitelikli Kahve & Tasarım Kafeler
  'karakoy-kahve-coffeesapiens': {
    description: "Kılıç Ali Paşa Mescidi Sokak'ta mikro kavurma (micro-roastery) yöntemiyle dünyanın farklı çekirdeklerini işleyen, İstanbul 3. nesil kahve akımının öncülerinden butik espresso barı.",
    whatToOrder: ['Evolution Blend Espresso', 'V60 Kenya Pour-over'],
    menuFrom: ['Cortado', 'Flat White', 'Cold Brew', 'Filtre Kahve', 'Havuçlu Cevizli Kek'],
    alsoTry: ['Kendi reçeteleri olan tatlı-asidik dengeli soğuk demleme (cold drip) kahve'],
    beforeYouGo: [
      'İç mekan oldukça kompakt ve samimidir; bar taburelerinde taze demlenen kahveleri izlemek keyiflidir.',
      'Çekirdek kahve satışı ve demleme ekipmanı desteği mevcuttur.'
    ]
  },
  'karakoy-kahve-mums': {
    description: "Tarihi Fransız Geçidi'nin büyülü pasaj atmosferinde ev yapımı reçelleri, İsveç usulü tarçınlı çöreği (kanelbulle), ferah kahvaltıları ve özenli kahveleriyle huzurlu kafe.",
    whatToOrder: ['Taze Fırından Kanelbulle', 'Mum\'s Eggs Benedict'],
    menuFrom: ['Pancake Tabağı', 'Avokadolu Tost', 'Latte', 'Americano', 'Ekşi Mayalı Sandviç'],
    alsoTry: ['Sıcak servis edilen tereyağlı ve bol tarçınlı İsveç çöreği kanelbulle'],
    beforeYouGo: [
      'Fransız Geçidi içindeki dış masalarda oturmak nostaljik pasaj havasını yaşatır.',
      'Hafta sonu brunch için erken saatlerde gitmek masa bulmayı kolaylaştırır.'
    ]
  },
  'karakoy-kahve-pim': {
    description: "Yüksek tavanlı ferah tasarımı, rengarenk graffitili sokak köşesi, zengin dünya mutfağı ve lezzetli tatlılarıyla Karaköy'ün en popüler çalışma ve sosyalleşme kafelerinden.",
    whatToOrder: ['Pim Gurme Burger', 'Orman Meyveli Tart'],
    menuFrom: ['Falafel Kasesi', 'Tavuklu Sezar Salata', 'Filtre Kahve', 'Iced Latte', 'Cheesecake'],
    alsoTry: ['Kendi fırınlarında hazırlanan çıtır tart hamurlu taze tatlılar'],
    beforeYouGo: [
      'Geniş iç oturma alanı laptop ile çalışanlar ve kalabalık arkadaş buluşmaları için oldukça elverişlidir.',
      'Kemankeş mahallesinin en canlı sokak kesişimindedir.'
    ]
  },
  'karakoy-kahve-karabatak': {
    description: "Kara Ali Kaptan Sokak'ta sarmaşıklarla bezeli dış masaları, antika avusturya kahve dükkanı dekorasyonu ve Julius Meinl kahveleriyle Karaköy'ün kahve dönüşümünü başlatan simge mekan.",
    whatToOrder: ['Viyana Usulü Melange Kahve', 'Karamelli Brownie'],
    menuFrom: ['Espresso', 'Cappuccino', 'Taze Kruvasan', 'Mozaik Pasta', 'Bitki Çayları'],
    alsoTry: ['Geleneksel porselen fincanda ve yanında minik su bardağıyla sunulan Melange kahve'],
    beforeYouGo: [
      'Sarmaşıklar altındaki sokak masalarında vakit geçirmek semtin en karakteristik deneyimlerindendir.',
      'Nostaljik havasıyla fotoğraf meraklılarının sıkça uğradığı bir noktadır.'
    ]
  },

  // Tarihi Baklavacılar & Artizan Çikolata
  'karakoy-tatli-gulluoglu': {
    description: "1843'ten bu yana Gaziantep usulü baklavacılık sanatını yaşatan Nadir Güllü'nün yönetiminde, 40 kat incecik yufkası ve saf sade yağıyla hazırlanan çıtır baklavalarıyla dünya çapında efsanevi tatlıcı.",
    whatToOrder: ['Fıstıklı Nadir Dolama', 'Kare Baklava'],
    menuFrom: ['Cevizli Baklava', 'Fıstıklı Şöbiyet', 'Bülbül Yuvası', 'Kaymaklı Baklava', 'Su Böreği', 'Demleme Çay'],
    alsoTry: ['Çıtır çıtır ses çıkaran, taze fırından yeni çıkmış ılık fıstıklı kare baklava'],
    beforeYouGo: [
      'Tepsi siparişleri ve hediyelik vakumlu paketler için geniş reyon bulunur.',
      'Kemankeş Caddesi üzerindeki yeni büyük binasında oturma ve çay alanı mevcuttur.'
    ]
  },
  'karakoy-tatli-hane': {
    description: "Kılıç Ali Paşa Mescidi Sokak'ta eritilmiş Belçika çikolatasıyla hazırlanan sıcak porsiyon tatlıları, taze meyveli waffle kaseleri ve artizan çikolata çeşitleriyle tatlı severlerin gözdesi.",
    whatToOrder: ['Hane Spesiyal Çikolata Kasesi', 'Sıcak Çikolatalı Fondü'],
    menuFrom: ['Çilekli Muzlu Waffle', 'Profiterol', 'Sıcak Belçika Çikolatası', 'Americano', 'Türk Kahvesi'],
    alsoTry: ['Taze muz, çilek ve çıtır krep parçaları üzerine dökülen sıcak sütlü çikolata kasesi'],
    beforeYouGo: [
      'Öğleden sonra ve akşam saatlerinde kapıda kısa sıralar oluşabilir.',
      'Çikolata oranı yoğun olduğu için kahve veya su ile dengelemek tavsiye edilir.'
    ]
  },
  'karakoy-tatli-koskeroglu': {
    description: "Kemeraltı Caddesi'nde Tophane sınırında Antep fıstıklı geleneksel şerbetli tatlıları, çıtır fıstık sarması ve sıcak katmeriyle yarım asrı aşkın süredir lezzet sunan köklü baklavacı.",
    whatToOrder: ['Antep Fıstıklı Katmer', 'Fıstıklı Havuç Dilim'],
    menuFrom: ['Fıstıklı Dürüm Baklava', 'Kuru Baklava', 'Cevizli Sarma', 'Dondurma', 'Türk Çayı'],
    alsoTry: ['Hakiki kaymakla taş tabanlı fırında sıcacık pişirilip fıstıkla kaplanan Antep katmeri'],
    beforeYouGo: [
      'Tophane tramvay durağına çok yakındır, paket servis hizmeti hızlıdır.',
      'Katmer sipariş üzerine taze açılıp sıcak servis edilir.'
    ]
  },
  'karakoy-tatli-hafizmustafa': {
    description: "Galataport kordonunda Boğaz ve Tarihi Yarımada siluetine karşı, saray tipi lokumları, narlı fıstıklı sütlü tatlıları ve şerbetleriyle İstanbul'un 160 yıllık lezzet mirasçısı.",
    whatToOrder: ['Fıstıklı Saray Baklavası', 'Manda Kaymaklı İncir Tatlısı'],
    menuFrom: ['Sütlü Nuriye', 'Trileçe', 'Lokum Çeşitleri', 'Geleneksel Osmanlı Şerbeti', 'Türk Kahvesi'],
    alsoTry: ['Özel tasarım kutularda sunulan fıstıklı ve narlı çifte kavrulmuş lokumlar'],
    beforeYouGo: [
      'Galataport deniz kıyısında yürüyüş yaparken tatlı ve kahve molası vermek için idealdir.',
      'Havaalanı ve yurt dışına hediyelik paketleme seçenekleri sunulur.'
    ]
  },

  // Şef Restoranları, Modern Meyhane & Akşam
  'karakoy-bistro-neolokal': {
    description: "Tarihi Salt Galata binasında Şef Maksut Aşkar liderliğinde, Anadolu'nun unutulmaya yüz tutmuş geleneksel lezzetlerini çağdaş tekniklerle yorumlayan Michelin yıldızlı gastronomi durağı.",
    whatToOrder: ['Neolokal Tadım Menüsü', 'Ördek Katmer'],
    menuFrom: ['Siyez Bulgurlu Meze', 'Ahtapot & Tarhana', 'Kerevizli Humus', 'Geleneksel Kuzu Tandır', 'Özel Eşleşmeli İçecekler'],
    alsoTry: ['Tarihi Yarımada ışıklarına bakan cam kenarında sunulan Anadolu mirası tadım menüsü'],
    beforeYouGo: [
      'Michelin yıldızlı bir fine-dining restoranıdır; haftalar öncesinden rezervasyon gereklidir.',
      'Salt Galata\'nın anıtsal mimarisi ve kütüphanesi içinde yer alır.'
    ]
  },
  'karakoy-bistro-murver': {
    description: "Novotel Karaköy'ün terasında, açık odun ateşinde pişirme felsefesiyle yerel deniz ürünleri ve tütsülenmiş etleri Boğaz manzarasıyla birleştiren Michelin tavsiyeli restoran.",
    whatToOrder: ['Közde Ahtapot', 'Odun Ateşinde Kuzu Kol'],
    menuFrom: ['Tütsülenmiş Dana Kaburga', 'Kaya Levrek', 'Yanık Soğanlı Meze', 'Fırın Pancar', 'İmza Kokteyller'],
    alsoTry: ['Açık ızgarada doğrudan odun alevinde pişirilen çıtır karamelize köz ahtapot'],
    beforeYouGo: [
      'Tarihi Yarımada ve Haliç panoramasına sahip teras için rezervasyon şarttır.',
      'Açık mutfak düzeni sayesinde canlı pişirme tekniklerini izleyebilirsiniz.'
    ]
  },
  'karakoy-bistro-mukellef': {
    description: "The Haze Hotel terasında Şef Arda Türkmen imzasıyla modern mezeleri, sıcak ot kavurmaları ve Galata Kulesi manzaralı terasıyla Karaköy'ün en canlı akşam meyhanelerinden.",
    whatToOrder: ['Vişneli Yaprak Sarma', 'Mükellef Sıcak Meze Tepsisi'],
    menuFrom: ['Topik', 'Girit Ezme', 'Pastırmalı Humus', 'Çıtır Kalamar', 'Günün Izgara Balığı', 'Kavun & Peynir'],
    alsoTry: ['Zeytinyağında sotelenmiş taze Ege otları ve fıstıklı sıcak mezeler'],
    beforeYouGo: [
      'Akşam saatlerinde DJ müzikleri ve hareketli meyhane ortamı öne çıkar.',
      'Teras katında gün batımı manzaralı masalar için erken rezervasyon tavsiye edilir.'
    ]
  },
  'karakoy-bistro-balikci': {
    description: "Tarihi Grifin Han'ın terasında 100 yılı aşkın süredir Haliç ve Tarihi Yarımada manzarasına karşı, kağıtta levrek ve taze mevsim balıkları sunan tarihi balık lokantası.",
    whatToOrder: ['Kağıtta Levrek', 'Balık Çorbası'],
    menuFrom: ['Tuzda Balık', 'Tereyağlı Karides', 'Kalamar Tava', 'Roka Salatası', 'Fırında Helva'],
    alsoTry: ['Özel baharat ve sebzelerle fırın kağıdında buğulama pişen sulu levrek fleto'],
    beforeYouGo: [
      'Tersane Caddesi üzerinde tarihi bir hanın üst katındadır; nostaljik atmosferi benzersizdir.',
      'Alkol servisi bulunmayan klasik bir tarihi balık sofrası deneyimi sunar.'
    ]
  },

  // ==========================================
  // REGION 13: GALATA (Beyoğlu)
  // ==========================================
  // Galata Kulesi & Nitelikli Kahve / Tasarım Kafe
  'galata-kahve-federal': {
    description: "Küçük Hendek Caddesi'nde Avustralya kahve kültürünü İstanbul'a getiren Sam Çeviköz imzalı, mikro kavrum özel harmanları ve Galata Kulesi'ne komşu sokak masalarıyla popüler espresso barı.",
    whatToOrder: ['Federal Cold Drip', 'Flat White'],
    menuFrom: ['Avokadolu Poşe Yumurta', 'Granola Bowl', 'Cortado', 'Banana Bread', 'San Sebastian'],
    alsoTry: ['Saatlerce damla damla demlenen buzlu Federal Cold Drip kahvesi'],
    beforeYouGo: [
      'Galata Kulesi\'ne birkaç adım mesafededir; sokak masaları gün boyu hareketlidir.',
      'Kendi kavurdukları taze çekirdek kahveleri paket olarak satın alabilirsiniz.'
    ]
  },
  'galata-kahve-mavra': {
    description: "Tarihi Doğan Apartmanı'nın tam karşısında tasarım atölyesiyle kafeyi birleştiren, nostaljik dekorasyonu, lezzetli ev yapımı tartları ve samimi mahalle dokusuyla Galata'nın ruhunu yaşatan mekan.",
    whatToOrder: ['Mavra Filtre Kahve', 'Ev Yapımı Çilekli Tart'],
    menuFrom: ['Latte', 'Türk Kahvesi', 'Kiş Çeşitleri', 'Brownie', 'Taze Sıkma Portakal'],
    alsoTry: ['Doğan Apartmanı manzarasına karşı kahve eşliğinde çıtır tereyağlı sebzeli kiş'],
    beforeYouGo: [
      'Serdar-ı Ekrem Caddesi\'nin en güzel noktasında dinlenmek ve insanları izlemek için idealdir.',
      'Akşam saatlerinde sakin ve keyifli bir bistro atmosferi sunar.'
    ]
  },
  'galata-kahve-privato': {
    description: "Tımarcı Sokak'ta Galata Kulesi silueti altında, Gürcistan ve Anadolu'nun yerel köylerinden toplanan şekersiz ev yapımı reçelleri ve zengin köy kahvaltısıyla ünlü nostaljik kafe.",
    whatToOrder: ['Köy Kahvaltısı Serpme Tabağı', 'Fırında Sıcak Hellim'],
    menuFrom: ['Ev Yapımı Reçeller', 'Menemen', 'Gözleme', 'Demlik Çay', 'Türk Kahvesi'],
    alsoTry: ['Geleneksel usulde hazırlanan incir ve ceviz reçelli taze lor peyniri tabağı'],
    beforeYouGo: [
      'Geleneksel kahvaltı için özellikle sabah ve öğle saatlerinde erken gitmek tavsiye edilir.',
      'Sakin ara sokakta huzurlu bir oturma ortamına sahiptir.'
    ]
  },
  'galata-kahve-sirinfirin': {
    description: "Büyük Hendek Caddesi'nde fırından yeni çıkmış tereyağlı kruvasanları, taze poğaçaları, cheesecake ve özenli kahveleriyle Galata sakinlerinin sabah kahvaltısı ve tatlı durağı.",
    whatToOrder: ['Taze Çikolatalı Kruvasan', 'Karamelli Latte'],
    menuFrom: ['Ekşi Mayalı Tost', 'Havuçlu Kek', 'Filtre Kahve', 'Americano', 'Çilekli Tart'],
    alsoTry: ['Sabah erken saatte fırından sıcacık çıkan tereyağlı çıtır kruvasan'],
    beforeYouGo: [
      'Galata Kulesi meydanına çok yakındır, ayaküstü kahve ve hamur işi için pratiktir.',
      'Dışarıdaki küçük masalarda cadde hareketliliğini seyredebilirsiniz.'
    ]
  },

  // Meşhur San Sebastian Cheesecake & Fırınlar
  'galata-tatli-viyana': {
    description: "Büyük Hendek Caddesi'nde, Galata Kulesi manzarasına karşı eritilmiş sıcak Belçika çikolatası dökülerek servis edilen akışkan San Sebastian cheesecake akımının Türkiye'deki öncüsü.",
    whatToOrder: ['Sıcak Belçika Çikolatalı San Sebastian', 'Viyana Melange'],
    menuFrom: ['Klasik San Sebastian', 'Lotus Kremalı Cheesecake', 'Espresso', 'Iced Latte', 'Sıcak Çikolata'],
    alsoTry: ['Karamelize yanık üst tabaka ile akışkan sıcak sütlü çikolatanın birleştiği meşhur San Sebastian'],
    beforeYouGo: [
      'Sosyal medyada dünyaca ünlü olduğu için günün her saati kapısında yoğun sıra olabilir.',
      'Galata Kulesi\'nin hemen dibindeki masalarda fotoğraf çekmek çok popülerdir.'
    ]
  },
  'galata-tatli-hafizmustafa': {
    description: "Şahkapısı Sokak'ta tarihi Galata Kulesi girişinde, 1864'ten gelen saray tatlıcılığı geleneğiyle Antep fıstıklı baklavaları, taze lokumları ve sütlü tatlılarıyla yerli ve yabancı misafirlerin uğrağı.",
    whatToOrder: ['Fıstıklı Şöbiyet', 'Trileçe'],
    menuFrom: ['Havuç Dilim Baklava', 'Kazandibi', 'Fıstıklı Lokum', 'Osmanlı Çayı', 'Geleneksel Türk Kahvesi'],
    alsoTry: ['Hakiki maraş dondurması eşliğinde sıcak fıstıklı şöbiyet tabağı'],
    beforeYouGo: [
      'Galata Kulesi meydanındadır; hediyelik lokum ve paketleme servisi çok hızlıdır.',
      'Kule ziyareti öncesi veya sonrası geleneksel bir tatlı molası için elverişlidir.'
    ]
  },
  'galata-tatli-freddo': {
    description: "Büyük Hendek Caddesi üzerinde İtalyan tarzı taze kremalı dondurmaları, artizan cheesecake çeşitleri ve ferahlatıcı espresso içecekleriyle bilinen butik tatlıcı.",
    whatToOrder: ['Freddo San Sebastian', 'İtalyan Dondurması (Gelato)'],
    menuFrom: ['Profiterol Kasesi', 'Tiramisu', 'Iced Americano', 'Affogato', 'Çikolatalı Sufle'],
    alsoTry: ['Sıcak espressonun vanilyalı İtalyan dondurması üzerine döküldüğü taze Affogato'],
    beforeYouGo: [
      'Kuleye çıkan cadde üzerinde hızlı ve lezzetli bir tatlı/dondurma alternatifi sunar.',
      'Özellikle yaz aylarında serinletici soğuk kahve ve gelato kombinasyonları revaçtadır.'
    ]
  },
  'galata-tatli-vaacoffee': {
    description: "Galata Kulesi'ne komşu samimi ortamında, taze çekirdek kahveleri, yoğun kıvamlı çikolatalı San Sebastian dilimleri ve lezzetli tatlılarıyla 4.9 kullanıcı memnuniyetine sahip özel kafe.",
    whatToOrder: ['VAA San Sebastian Cheesecake', 'Cortado'],
    menuFrom: ['Filtre Kahve', 'Flat White', 'Brownie', 'Muzlu Ekmek', 'Limonlu Cheesecake'],
    alsoTry: ['Özel eritilmiş bitter çikolata sosuyla zenginleştirilen kremsi San Sebastian dilimi'],
    beforeYouGo: [
      'Yüksek puanlı ve samimi bir butik kafedir; oturma kapasitesi sınırlıdır.',
      'Kule manzarasına birkaç adım mesafede sakin bir kahve molası verir.'
    ]
  },

  // Kule Çevresi Tarihi Teraslar & Akşam Sofrası
  'galata-meyhane-guney': {
    description: "1964 yılından bu yana Galata Kulesi meydanında kesintisiz hizmet veren, tarihi taş binasında zengin Türk ve dünya mutfağı, ızgara etleri ve kule manzaralı dış masalarıyla semtin en köklü restoranı.",
    whatToOrder: ['Güney Özel Kuzu Pirzola', 'Kule Mezeleri Tabağı'],
    menuFrom: ['Deniz Mahsullü Makarna', 'Gavurdağı Salatası', 'Fırın Güveç', 'Izgara Somon', 'Sıcak Sufle'],
    alsoTry: ['Galata Kulesi\'nin heybetli gölgesinde akşam saatlerinde sunulan kuzu pirzola tabağı'],
    beforeYouGo: [
      'Galata Kulesi meydanının tam kalbindedir; kule manzaralı dış masalar hızla dolar.',
      'Hem gündüz öğle yemeği hem de akşam romantik buluşmalar için uygundur.'
    ]
  },
  'galata-meyhane-firuzende': {
    description: "Anemon Galata Oteli'nin teras katında, Galata Kulesi'ne dokunacak kadar yakın panoramik Boğaz, Haliç ve Tarihi Yarımada manzarasıyla İstanbul'un en büyüleyici manzara restoranlarından.",
    whatToOrder: ['Firuzende Izgara Dana Bonfile', 'Vişneli Meze Tabağı'],
    menuFrom: ['Ahtapot Izgara', 'Kuzu İncik', 'Avokadolu Karides', 'Tiramisu', 'İmza Kokteyller'],
    alsoTry: ['Kulenin gece aydınlatması eşliğinde servis edilen ağır ateşte fırınlanmış kuzu incik'],
    beforeYouGo: [
      'Kule manzaralı cam kenarı masalar için günler öncesinden rezervasyon şarttır.',
      'Evlilik teklifleri ve özel kutlamalar için şehrin en popüler mekanları arasındadır.'
    ]
  },
  'galata-meyhane-galatada24': {
    description: "Serdar-ı Ekrem Caddesi'nde Georges Hotel'in terasında, Boğaz ve Adalar manzarasına karşı Ege ve Akdeniz mutfağının modern meze kültürünü şık bir atmosferde buluşturan teras restoran.",
    whatToOrder: ['Galatada Meze Seçkisi', 'Kömür Ateşinde Levrek'],
    menuFrom: ['Girit Ezmesi', 'Karides Saganaki', 'Ahtapot Carpaccio', 'Fırın Kuzu Kol', 'Özel Kokteyller'],
    alsoTry: ['Teras manzarasında gün batımı eşliğinde sunulan Ege otlu ılık deniz mahsulleri tabağı'],
    beforeYouGo: [
      'Butik otel terası konseptinde zarif ve seçkin bir akşam yemeği ortamı sunar.',
      'Özellikle bahar ve yaz aylarında açık hava terası için rezervasyon gereklidir.'
    ]
  },
  'galata-meyhane-barnathan': {
    description: "19. yüzyıldan kalma tarihi Barnathan Apartmanı'nın çatısında, Galata Kulesi'nin hemen yanı başında eşsiz kule ve Haliç manzarası eşliğinde kahvaltı, akşam yemeği ve kokteyller sunan teras mekan.",
    whatToOrder: ['Barnathan Spesiyal Burger', 'Çıtır Karides'],
    menuFrom: ['Meze Tabağı', 'Izgara Antrikot', 'Trüflü Patates', 'San Sebastian', 'İmza İçecekler'],
    alsoTry: ['Kulenin kubbesini en yakından gören teras masasında gün batımı kokteyli'],
    beforeYouGo: [
      'Tarihi apartmanın restore edilmiş mimarisi ve avlusu da görülmeye değerdir.',
      'Teras katında gün batımı ve akşam saatlerinde yoğunluk oluştuğundan rezervasyon önerilir.'
    ]
  },

  // Şık Galata Bistroları & Dünya Mutfağı
  'galata-bistro-ilcortile': {
    description: "Ecole St. Pierre Hotel'in tarihi manastır ve yetimhane avlusunda, Napoli tarzı odun fırını pizzaları, el yapımı taze makarnaları ve dingin Akdeniz atmosferiyle saklı bir İtalyan vahası.",
    whatToOrder: ['Margherita Verace Pizza', 'Trüflü Tagliolini'],
    menuFrom: ['Burrata con Pomodorini', 'Carpaccio di Manzo', 'Risotto ai Funghi', 'Tiramisu Tradizionale'],
    alsoTry: ['48 saat mayalanmış Napoli usulü hamurla odun fırınında pişen taze burrata peynirli pizza'],
    beforeYouGo: [
      'Tarihi avlu bahçesi şehrin gürültüsünden tamamen izole ve romantiktir.',
      'Akşam servislerinde rezervasyon yaptırılması tavsiye edilir.'
    ]
  },
  'galata-bistro-dukkan': {
    description: "Tatar Beyi Sokak'ta taş duvarlı tarihi binasında taze günlük makarnaları, gurme sandviçleri, glütensiz seçenekleri ve samimi bistro ortamıyla Galata sakinlerinin favori lezzet noktası.",
    whatToOrder: ['El Yapımı Pesto Soslu Fettuccine', 'Füme Etli Sıcak Sandviç'],
    menuFrom: ['Günün Çorbası', 'Kinoa Salatası', 'Filtre Kahve', 'Limonlu Tart', 'Ev Yapımı Buzlu Çay'],
    alsoTry: ['Günlük taze açılan makarnanın üzerine eklenen taze fesleğenli ve çam fıstıklı pesto sos'],
    beforeYouGo: [
      'Glütensiz ve sağlıklı beslenme alternatifleri açısından oldukça zengin bir menüye sahiptir.',
      'Karaköy ve Şişhane arasındaki sakin ara sokaktadır, samimi oturma düzeni vardır.'
    ]
  },
  'galata-bistro-otantik': {
    description: "Camekan Sokak üzerinde taş binasında, geleneksel Türk mutfağının gözlemelerini, ev mantılarını ve Anadolu lezzetlerini otantik sunumlarla buluşturan samimi mahalle bistrosu.",
    whatToOrder: ['Kayseri Usulü El Mantısı', 'Kıymalı Kaşarlı Gözleme'],
    menuFrom: ['Mercimek Çorbası', 'Zeytinyağlı Sarma', 'Çoban Salatası', 'Demleme Çay', 'Yayık Ayranı'],
    alsoTry: ['Sıcak sac üzerinde taze açılıp tereyağıyla yağlanan çıtır köy gözlemesi'],
    beforeYouGo: [
      'Galata Kulesi\'ne çıkan taş merdivenlerin hemen yanındadır.',
      'Hızlı, doyurucu ve geleneksel bir öğle veya akşam yemeği için idealdir.'
    ]
  },
  'galata-bistro-snog': {
    description: "Galip Dede Caddesi'nde tarihi binanın en üst katında, Galata Kulesi'ne bakan samimi balkonu, kaliteli müzikleri, gurme kokteylleri ve atıştırmalıklarıyla Galata'nın gizli çatı barı.",
    whatToOrder: ['Snog İmza Kokteyl', 'Tapas Atıştırmalık Tabağı'],
    menuFrom: ['Mini Burgerler', 'Peynir Tabağı', 'Çıtır Tavuk Sepeti', 'Bira Çeşitleri', 'Şarap Seçkisi'],
    alsoTry: ['Galata Kulesi ışıklarına bakan küçük balkonda gün batımında yudumlanan imza kokteyl'],
    beforeYouGo: [
      'Balkon kısmı oldukça kompakt olduğundan erken saatlerde gitmek yer bulmak adına önemlidir.',
      'Canlı ve samimi bir müzik eşliğinde keyifli bir akşam sohbeti ortamı sunar.'
    ]
  },

  // --- CİHANGİR ---
  'cihangir-kahvalti-kahve6': {
    description: "Anahtar Sokak'ta gizli yemyeşil avlusu, zengin serpme kahvaltısı, taze otlu omletleri ve sakin Cihangir sabahı atmosferiyle semtin en sevilen kahvaltı adresi.",
    whatToOrder: ['Kahve 6 Serpme Kahvaltı', 'Otlu Peynirli Menemen'],
    menuFrom: ['Köy Kahvaltısı', 'Kavurmalı Yumurta', 'Zeytin Ezmeli Tost', 'Ev Yapımı Reçeller', 'Demleme Çay'],
    alsoTry: ['Gizli iç bahçede asma yaprakları altında sıcak simit ve taze demlenmiş çay eşliği'],
    beforeYouGo: [
      'Hafta sonu sabahları bahçede masa bulmak için erken gitmek önerilir.',
      'Huzurlu, kedi dostu ve sakin bir avlu havası vardır.'
    ]
  },
  'cihangir-kahvalti-journey': {
    description: "Akarsu Yokuşu'nda ferah iki katlı ahşap mekanında, yerel üreticilerden temin edilen organik malzemelerle hazırlanan yaratıcı brunch seçenekleri ve ev yapımı ekşi mayalı lezzetler.",
    whatToOrder: ['Avokadolu Poşe Yumurta', 'Ekşi Mayalı Fırın Tost'],
    menuFrom: ['Granola Kasesi', 'Pankek Tabağı', 'Keçi Peynirli Salata', 'Taze Sıkma Portakal Suyu', 'Filtre Kahve'],
    alsoTry: ['Fırından yeni çıkmış sıcak ekşi mayalı ekmek üzerine poşe yumurta ve taze yeşillikler'],
    beforeYouGo: [
      'Üst katı çalışmak veya kitap okumak için çok sakindir.',
      'Geniş brunch menüsü gün boyu servis edilmektedir.'
    ]
  },
  'cihangir-kahvalti-susam': {
    description: "Susam Sokak'ın başında retro ahşap dekorasyonu, rahat koltukları, zengin kahvaltı tabakları ve akşamları loş bir bistroya dönüşen nostaljik mahalle klasiği.",
    whatToOrder: ['Susam Klasik Kahvaltı', 'Füme Etli Avokadolu Omlet'],
    menuFrom: ['Sahanda Yumurta', 'Sucuklu Hellimli Tost', 'Ev Yapımı Limonata', 'Türk Kahvesi', 'Demleme Çay'],
    alsoTry: ['Susam Sokak manzaralı pencere önü masasında keyifli bir hafta sonu kahvaltısı'],
    beforeYouGo: [
      'Hem sabah kahvaltısı hem de akşamüstü sohbetleri için samimi bir buluşma yeridir.',
      'Köpek ve kedi dostu mahalle havası hakimdir.'
    ]
  },
  'cihangir-kahvalti-kaktus': {
    description: "Cihangir Caddesi üzerinde yazarların, sanatçıların ve semt sakinlerinin buluştuğu, sahanda taze köy yumurtaları ve nostaljik Cihangir ruhuyla yaşayan efsanevi mahalle kafesi.",
    whatToOrder: ['Kaktüs Köy Kahvaltısı', 'Sahanda Sucuklu Yumurta'],
    menuFrom: ['Kaşarlı Tost', 'Menemen Çeşitleri', 'Taze Portakal Suyu', 'Filtre Kahve', 'Demleme Çay'],
    alsoTry: ['Dışarıdaki kaldırım masalarında Cihangir akışını izlerken sahanda yumurta ve çay keyfi'],
    beforeYouGo: [
      'Kaldırım masaları günün her saati hareketlidir.',
      'Yıllardır Cihangir entelektüel çevrelerinin en popüler uğrak noktasıdır.'
    ]
  },
  'cihangir-kahve-kronotrop': {
    description: "Firuzağa Meydanı'na çıkan Turnacıbaşı Caddesi'nde, Türkiye'de üçüncü nesil kahve dalgasının ilk öncülerinden biri olan ve mikrolot çekirdekleri ustalıkla kavuran özel kahve barı.",
    whatToOrder: ['Single-Origin V60 Pour Over', 'Cortado'],
    menuFrom: ['Espresso', 'Flat White', 'Cold Brew', 'Filtre Kahve', 'Muzlu Ekmek'],
    alsoTry: ['Etiyopya veya Kolombiya tek kökenli çekirdeklerden taze hazırlanan V60 filtre kahve'],
    beforeYouGo: [
      'Kahve çekirdeklerini çekilmiş veya tane olarak paket halinde satın alabilirsiniz.',
      'Ayaküstü espresso veya hızlı kahve molası için semtin en güvenilir adresidir.'
    ]
  },
  'cihangir-kahve-norm': {
    description: "Güneşli Sokak'ın sakin köşesinde, minimalist İskandinav tasarımı, özenle seçilmiş kahve çekirdekleri ve taze fırın ürünleriyle kahve tutkunlarının favorisi.",
    whatToOrder: ['Flat White', 'Batch Brew Filtre Kahve'],
    menuFrom: ['Espresso', 'Cappuccino', 'Soğuk Demleme Kahve', 'Kruvasan', 'Tarçınlı Çörek'],
    alsoTry: ['Mükemmel mikro-köpükle hazırlanan kadifemsi flat white ve taze tereyağlı kruvasan'],
    beforeYouGo: [
      'Sessiz ve dingin bir çalışma ya da kitap okuma ortamı sunar.',
      'Baristalar çekirdek profilleri konusunda oldukça bilgilendiricidir.'
    ]
  },
  'cihangir-kahve-geyik': {
    description: "Akarsu Yokuşu'nda gündüzleri kendi kavurdukları nitelikli kahveleri sunan, akşamları ise sokağa taşan canlı bir kokteyl bara dönüşen Cihangir'in en popüler sosyalleşme noktası.",
    whatToOrder: ['Nitro Cold Brew', 'Double Espresso'],
    menuFrom: ['Americano', 'Latte', 'V60 Demleme', 'Artisan Çerezler', 'İmza Kokteyller'],
    alsoTry: ['Sıcak yaz günlerinde soğuk ve yoğun gövdeli taze çekilmiş nitro cold brew'],
    beforeYouGo: [
      'Özellikle 17:00 sonrasında kalabalıklaşır ve sokak boyunca sohbetler başlar.',
      'Gündüz kahve içip çalışmak için içerideki ahşap masalar tercih edilebilir.'
    ]
  },
  'cihangir-kahve-21': {
    description: "Coşkun Sokak üzerinde sakin ve yeşil bir köşede, butik espressoları, samimi sokak masaları ve ev yapımı tatlılarıyla gerçek bir Cihangir mahalle kahvecisi.",
    whatToOrder: ['Karamelli Latte', 'Filtre Kahve'],
    menuFrom: ['Espresso', 'Cortado', 'Mocha', 'Havuçlu Kek', 'Limonlu Cheesecake'],
    alsoTry: ['Sokak kenarındaki küçük masada taze filtre kahve eşliğinde kitap okumak'],
    beforeYouGo: [
      'Turistik kalabalıktan uzak, mahallelinin kendi arasında vakit geçirdiği sakin bir noktadır.',
      'Güleryüzlü ve sıcak bir esnaf kahve deneyimi sunar.'
    ]
  },
  'cihangir-bistro-demeti': {
    description: "Şıraselviler Caddesi'nde tarihi binanın üst katında, eşsiz Boğaz ve Adalar manzarasına karşı klasik meyhane kültürünü incelikli mezelerle buluşturan köklü bir Cihangir klasiği.",
    whatToOrder: ['Levrek Marin', 'Girit Ezmesi'],
    menuFrom: ['Ahtapot Izgara', 'Tereyağlı Karides', 'Fava', 'Közde Patlıcan', 'Mevsim Balıkları'],
    alsoTry: ['Güneş batarken terasta Boğaz manzarasına karşı ılık ahtapot ızgara ve taze mezeler'],
    beforeYouGo: [
      'Manzaralı balkon veya pencere kenarı masalar için günler öncesinden rezervasyon şarttır.',
      'Gürültüden uzak, sakin ve sohbet odaklı bir meyhane atmosferi vardır.'
    ]
  },
  'cihangir-bistro-jash': {
    description: "Cihangir Caddesi üzerinde nostaljik bir İstanbul evinde, geleneksel Ermeni ve eski İstanbul lezzetlerini antika objeler ve piyano melodileri eşliğinde sunan benzersiz bir restoran.",
    whatToOrder: ['Geleneksel Topik', 'Vişneli Yaprak Sarma'],
    menuFrom: ['Lakerda', 'Ermeni Pilakisi', 'Dalak Dolması', 'Paçanga Böreği', 'Kuzu İncik'],
    alsoTry: ['Özel baharat ve tahin dengesiyle ustalıkla hazırlanan ev yapımı topik'],
    beforeYouGo: [
      'Haftanın bazı akşamlarında canlı piyano veya akordeon dinletileri eşlik eder.',
      'Tarihi bir İstanbul salonunda yemek yiyor hissi uyandıran çok özel bir ambiyansı vardır.'
    ]
  },
  'cihangir-bistro-surbalik': {
    description: "Defterdar Yokuşu'nda Boğaz'a tepeden bakan geniş terasında, taze günlük deniz ürünleri, profesyonel servis ve şık balık sofralarıyla Cihangir'in en prestijli deniz mahsulleri adresi.",
    whatToOrder: ['Tuzda Levrek', 'Izgara Kalamar'],
    menuFrom: ['Balık Çorbası', 'Kalamar Tava', 'Karides Güveç', 'Ahtapot Salata', 'Günlük Lüfer / Levrek'],
    alsoTry: ['Alev eşliğinde masada kırılarak açılan tuzda pişmiş sulu deniz levreği'],
    beforeYouGo: [
      'Geniş Boğaz panoramasına sahip teras katı için rezervasyon yaptırmanız tavsiye edilir.',
      'İş yemekleri ve özel kutlamalar için oldukça uygundur.'
    ]
  },
  'cihangir-bistro-rosemarine': {
    description: "Akarsu Yokuşu'nda saklı geniş yemyeşil bahçesinde, Akdeniz esintili gurme mutfağı, taze makarnaları ve zengin içecek menüsüyle günün her saati keyifli bir buluşma mekanı.",
    whatToOrder: ['El Yapımı Trüflü Tagliatelle', 'Izgara Bonfile'],
    menuFrom: ['Somon Izgara', 'Kinoa Salatası', 'Burger Çeşitleri', 'Tiramisu', 'Kokteyl Seçkisi'],
    alsoTry: ['Ağaçların altındaki ferah avluda taze el açması trüflü tagliatelle'],
    beforeYouGo: [
      'Semtin en geniş ve ferah bahçelerinden birine sahiptir.',
      'Akşam yemeklerinde romantik ışıklandırmasıyla samimi bir bistro ortamına bürünür.'
    ]
  },
  'cihangir-tatli-savoy': {
    description: "1950 yılından bu yana Sıraselviler Caddesi'nde hizmet veren, İstanbul'un en köklü ve zarif pastanelerinden biri olarak milföyleri, gofretleri ve pasta çeşitleriyle semtin simgesi.",
    whatToOrder: ['Tarihi Savoy Milföy Pasta', 'El Yapımı Çikolatalı Gofret'],
    menuFrom: ['Profiterol', 'Ekler Çeşitleri', 'Tuzlu Kurabiyeler', 'Badem Ezmesi', 'Çilekli Tart'],
    alsoTry: ['Çıtır ince tereyağlı katları ve ipeksi pastacı kremasıyla ünlü taze Savoy milföyü'],
    beforeYouGo: [
      'Hediye paketleri ve özel günler için kutu çikolata & gofretleri çok meşhurdur.',
      'Giriş katındaki pastane masalarında çay veya kahve eşliğinde tatlınızı yiyebilirsiniz.'
    ]
  },
  'cihangir-tatli-cuppa': {
    description: "Yeni Yuva Sokak'ta sakin atmosferi, sağlıklı atıştırmalıkları, taze pişirilen kekleri ve ev yapımı ekşi mayalı tatlılarıyla Cihangir'in en tatlı butik duraklarından biri.",
    whatToOrder: ['Taze Havuçlu Tarçınlı Kek', 'Ev Yapımı Çikolatalı Brownie'],
    menuFrom: ['Limonlu Cheesecake', 'Glutensiz Kurabiyeler', 'Taze Meyveli Tart', 'Limonata', 'Filtre Kahve'],
    alsoTry: ['Cevizli ve taze zencefilli havuçlu kek yanına demli bir filtre kahve'],
    beforeYouGo: [
      'Kompakt ve huzurlu bir oturma alanına sahiptir.',
      'Taze sıkma meyve suları ve detoks içecekleri de oldukça popülerdir.'
    ]
  },
  'cihangir-tatli-faw': {
    description: "Taktaki Yokuşu'nda artisan fırıncılık konseptiyle her sabah taze çıkan çıtır tereyağlı kruvasanları, dolgulu çörekleri ve zengin kahve menüsüyle semtin yeni gözdesi.",
    whatToOrder: ['Bademli Kruvasan', 'Çikolatalı Babka'],
    menuFrom: ['Sade Kruvasan', 'Fıstıklı Danimarka Çöreği', 'Limonlu Tart', 'Flat White', 'Cold Brew'],
    alsoTry: ['Fransız tereyağıyla saatlerce katlanıp fırınlanan badem kremalı çıtır kruvasan'],
    beforeYouGo: [
      'Kruvasanlar günlük sınırlı sayıda fırından çıktığı için öğleden önce gitmek avantajlıdır.',
      'Sıcak take-away kahve ve kruvasan ikilisi yürüyüş için idealdir.'
    ]
  },
  'cihangir-tatli-misspizza': {
    description: "Havyar Sokak'ta 2004 yılından bu yana odun ateşinde incecik İtalyan hamuruyla pişen gurme pizzaları ve otantik tiramisusuyla İstanbul'un en ikonik butik pizzacısı.",
    whatToOrder: ['Pizza Margherita', 'Pizza Funghi & Tartufo'],
    menuFrom: ['Pizza Pesto', 'Pizza Gorgonzola', 'Roka Salatası', 'Ev Yapımı Tiramisu', 'İtalyan Gazozu'],
    alsoTry: ['Odun fırınından dumanı üstünde çıkan çıtır çıtır trüflü mantarlı pizza ve ardından taze tiramisu'],
    beforeYouGo: [
      'Mekan oldukça kompakt ve samimidir; akşam saatlerinde sıra oluşabilir.',
      'Rezervasyon yaptırmak veya erken saatte gitmek tavsiye edilir.'
    ]
  },

  // --- BEYOĞLU ---
  'beyoglu-meyhane-asmalicavit': {
    description: "Asmalı Mescit Caddesi üzerinde Cavit Bey'in ustalığıyla yarım asırlık klasik meyhane geleneğini yaşatan, enfes mezeleri ve köftesiyle edebiyatçıların ve gurmelerin değişmez adresi.",
    whatToOrder: ['Kıymalı Muska Böreği', 'Asmalı Cavit Köftesi'],
    menuFrom: ['Lakerda', 'Patlıcan Salatası', 'Beyin Salatası', 'Fava', 'Kalamar Tava'],
    alsoTry: ['Masaya sıcak sıcak gelen çıtır çıtır kıymalı muska böreği ve taze palamut lakerdası'],
    beforeYouGo: [
      'Meyhanenin klasik ahşap salonunda yer bulabilmek için önceden rezervasyon şarttır.',
      'Sakin ve derin sohbetlerin yapıldığı geleneksel bir meyhane ortamı vardır.'
    ]
  },
  'beyoglu-meyhane-yakup2': {
    description: "Asmalımescit Sokak'ta şairlerin, yazarların ve gazetecilerin buluşma noktası olan Yakup 2, zengin meze tepsisi ve yılların değişmeyen samimiyetiyle Beyoğlu'nun yaşayan tarihi.",
    whatToOrder: ['Yakup Meze Tepsisi', 'Sıcak Ot Kavurması'],
    menuFrom: ['Cevizli Biber', 'Levrek Marin', 'Paçanga Böreği', 'Ahtapot Izgara', 'Kuzu Şiş'],
    alsoTry: ['Masaya gelen geniş ahşap tepsiden seçilen zeytinyağlı mezeler ve közde ılık ot kavurma'],
    beforeYouGo: [
      'Hafta sonu akşamları çok hareketlidir; özellikle arka bahçe masaları popülerdir.',
      'Beyoğlu kültür hayatının önemli tanıklarından biridir.'
    ]
  },
  'beyoglu-meyhane-refik': {
    description: "Sofyalı Sokak'ta 1954 yılından bu yana Refik Arslan'ın kurduğu gelenekle hizmet veren, Arnavut ciğeri ve klasik mezeleriyle Asmalı Mescit'in en eski ve saygın meyhanesi.",
    whatToOrder: ['Arnavut Ciğeri', 'Közde Patlıcan Ezme'],
    menuFrom: ['Tarama', 'Borani', 'Kalamar Tava', 'Yaprak Ciğer', 'Mevsim Balığı'],
    alsoTry: ['Kırmızı soğan piyazı eşliğinde lokum kıvamında servis edilen taze Arnavut ciğeri'],
    beforeYouGo: [
      'Tarihi dokusu ve duvardaki eski Beyoğlu fotoğraflarıyla nostaljik bir atmosfer sunar.',
      'Akşam yemeği için erken gitmek veya rezervasyon yaptırmak tavsiye edilir.'
    ]
  },
  'beyoglu-meyhane-galatameyhanesi': {
    description: "Orhan Adlı Apaydın Sokak'ta tarihi ahşap binasında, akordeon ve keman nağmeleri eşliğinde geleneksel Çilingir sofrasını en zarif şekilde yaşatan Asmalı Mescit efsanesi.",
    whatToOrder: ['Rum Usulü Ahtapot Salata', 'Sıcak Güveçte Karides'],
    menuFrom: ['Haydari', 'Girit Ezmesi', 'Şakşuka', 'Sigara Böreği', 'Izgara Çipura'],
    alsoTry: ['Akordeon melodileri eşliğinde taze zeytinyağlı mezeler ve güveçte cızırdayan tereyağlı karides'],
    beforeYouGo: [
      'Canlı akustik fasıl ve eski İstanbul şarkıları masalar arasında icra edilir.',
      'Özel kutlamalar ve nostaljik bir akşam için idealdir.'
    ]
  },
  'beyoglu-lokanta-haciabdullah': {
    description: "1888 yılında Sultan II. Abdülhamid'in fermanıyla kurulan, Atıf Yılmaz Caddesi'ndeki görkemli mekanında zeytinyağlıları, kompostoları ve hünkarbeğendisiyle Osmanlı mutfağının başyapıtı.",
    whatToOrder: ['Hünkarbeğendi', 'Kuzu İncik'],
    menuFrom: ['Elbasan Tava', 'Zeytinyağlı Enginar', 'Kuru Fasulye & Pilav', 'Karışık Meyve Kompostosu', 'Fırın Sütlaç'],
    alsoTry: ['Ağır ateşte lokum gibi pişen kuzu eti ve köz patlıcan beğendisi ile taze vişne kompostosu'],
    beforeYouGo: [
      'Alkolsüz tarihi bir esnaf lokantasıdır; vitrindeki dev zeytinyağlı kavanozları mutlaka görülmelidir.',
      'Öğle saatlerinde yoğun esnaf ve lezzet tutkunu akınına uğrar.'
    ]
  },
  'beyoglu-lokanta-helvetia': {
    description: "Asmalı Mescit'in Genel Yazıcı Sokağı'nda ev sıcaklığındaki samimi atmosferinde, her gün taze pişirilen zengin zeytinyağlı çeşitleri ve sebze yemekleriyle vejetaryenlerin ve mahallelinin gözdesi.",
    whatToOrder: ['Karışık 5\'li Zeytinyağlı Tabağı', 'Fırında Mücver'],
    menuFrom: ['Zeytinyağlı Pırasa', 'Mercimek Köftesi', 'Pazı Kavurma', 'Kereviz Salatası', 'Yoğurtlu Semizotu'],
    alsoTry: ['Günün taze pişmiş sebze yemeklerinden oluşturulan rengarenk zeytinyağlı karma tabak'],
    beforeYouGo: [
      'Masalar kompakt ve samimidir; ev yemeği arayanlar için hızlı ve çok ekonomiktir.',
      'Yemekler günlük çıktığından akşam saatlerinde popüler çeşitler tükenebilir.'
    ]
  },
  'beyoglu-lokanta-kalkanoglu': {
    description: "1856 yılında Trabzon'da başlayıp Ayhan Işık Sokak'ta devam eden, özel Trabzon tereyağı ve kemik suyuyla bakır kazanda demlenen pilavı ve yumuşacık kavurmasıyla tarihi lezzet durağı.",
    whatToOrder: ['Kavurmalı Kuru Fasulyeli Pilav', 'Yayık Ayranı'],
    menuFrom: ['Sade Tereyağlı Pilav', 'Kuru Fasulye', 'Kavurma', 'Ev Turşusu', 'Hoşaf'],
    alsoTry: ['Tane tane dökülen tereyağlı pilavın üzerine bol kuru fasulye ve lif lif ayrılan kuzu kavurma'],
    beforeYouGo: [
      'Porsiyonlar oldukça doyurucudur; yanında buz gibi açık yayık ayranı tavsiye edilir.',
      'Tarihi fotoğraflarla süslü nostaljik bir dükkandır.'
    ]
  },
  'beyoglu-lokanta-nizampide': {
    description: "Kalyoncu Kulluğu Caddesi'nde yarım asırlık Karadeniz pidesi ustalığı, çıtır tereyağlı kenarları ve fındıklı fırın sütlacıyla İstiklal Caddesi'nin en meşhur pide salonu.",
    whatToOrder: ['Kıymalı Kaşarlı Karadeniz Pidesi', 'Giresun Fındıklı Fırın Sütlaç'],
    menuFrom: ['Kavurmalı Yumurtalı Pide', 'Kuşbaşılı Pide', 'Trabzon Peynirli Pide', 'Günün Çorbası', 'Yayık Ayranı'],
    alsoTry: ['Fırından yeni çıkmış sıcak kapalı kavurmalı pidenin ucunu kesip tereyağı batırma keyfi'],
    beforeYouGo: [
      'Günün her saati hızlı ve kesintisiz servis sunar.',
      'Yemek sonrası üzeri bol fındıklı fırın sütlacı mutlaka denenmelidir.'
    ]
  },
  'beyoglu-bistro-mikla': {
    description: "The Marmara Pera'nın terasında Mehmet Gürs'ün Yeni Anadolu Mutfağı felsefesiyle Michelin yıldızına layık görülen, Haliç ve Boğaz panoramasına sahip dünya çapında bir gastronomi zirvesi.",
    whatToOrder: ['Tadım Menüsü (Yeni Anadolu Mutfağı)', 'Balık Ekmek Yorumu'],
    menuFrom: ['Mantar Mantı', 'Kuzu Gerdan', 'Lakerda İnovasyonu', 'Antep Fıstıklı Helva Yorumu', 'İmza Ege Kokteylleri'],
    alsoTry: ['360 derece İstanbul silüetine karşı şefin yerel Anadolu malzemeleriyle hazırladığı imza tadım menüsü'],
    beforeYouGo: ['Michelin yıldızlı üst segment bir restorandır; haftalar öncesinden rezervasyon gereklidir.', 'Şık giyim kuralı (smart casual) uygulanmaktadır.']
  },
  'beyoglu-bistro-360istanbul': {
    description: "Tarihi Mısır Apartmanı'nın çatı katında tarihi Yarımada'dan Boğaz'a uzanan 360 derecelik panoraması, yaratıcı füzyon mutfağı ve seçkin bar kültürüyle Beyoğlu'nun simge çatısı.",
    whatToOrder: ['Ördek Konfi', '360 İmza Kokteyl'],
    menuFrom: ['Somon Tartar', 'Izgara Levrek', 'Dana Madalyon', 'Suşi Çeşitleri', 'Çikolatalı Sufle'],
    alsoTry: ['Mısır Apartmanı terasında gün batımı ışıklarında şehrin panaromasına karşı imza kokteyller'],
    beforeYouGo: [
      'Hafta sonu akşamları kulüp ve canlı DJ performanslarına dönüşür.',
      'Manzaralı masalar için önceden rezervasyon yapılması tavsiye edilir.'
    ]
  },
  'beyoglu-bistro-lebiderya': {
    description: "Kumbaracı Yokuşu'nun tepesinde tarihi binanın 6. katında, Boğaz ve Tarihi Yarımada'yı kucaklayan cam cephesi, modern Türk füzyon bistrosu ve romantik atmosferiyle unutulmaz bir deneyim.",
    whatToOrder: ['Vişneli Dana Yanak', 'Fıstıklı Humus'],
    menuFrom: ['Levrek Ceviche', 'Izgara Ahtapot', 'Trüflü Risotto', 'Peynir Tabağı', 'Karaköy Kokteylleri'],
    alsoTry: ['Boğaz manzaralı terasta ağır ateşte pişmiş yumuşacık vişneli dana yanak'],
    beforeYouGo: [
      'Romantik akşam yemekleri ve özel buluşmalar için şehrin en popüler noktalarındandır.',
      'Kumbaracı Yokuşu üzerinden asansörle çıkılmaktadır.'
    ]
  },
  'beyoglu-bistro-litera': {
    description: "Yeni Çarşı Caddesi'nde Goethe Enstitüsü binasının en üst katında, Tarihi Yarımada, Haliç ve Boğaz'ı aynı anda gören büyüleyici manzarası ve seçkin dünya mutfağıyla prestijli bir akşam mekanı.",
    whatToOrder: ['Izgara Somon', 'Litera Özel Kokteyli'],
    menuFrom: ['Dana Bonfile', 'Deniz Mahsüllü Fettuccine', 'Caprese Salata', 'Fırın Kuzu İncik', 'Cheesecake'],
    alsoTry: ['Topkapı Sarayı ve Boğaz Köprüsü ışıkları eşliğinde akşamüstü şarabı ve peynir tabağı'],
    beforeYouGo: [
      'Huzurlu, kaliteli müzikli ve şık bir atmosfer arayanlar için çok elverişlidir.',
      'Teras alanı özellikle yaz ve bahar aylarında yoğun ilgi görür.'
    ]
  },
  'beyoglu-tatli-incipastanesi': {
    description: "1944 yılında Luka Singos tarafından kurulan, özel çıtır şu hamuru ve akışkan bitter çikolata sosuyla Türkiye'ye profiterolü tanıtan Beyoğlu'nun efsanevi tatlı mabedi.",
    whatToOrder: ['Meşhur İnci Profiterolü', 'Uludağ Tatlısı'],
    menuFrom: ['Ekler', 'Milföy Pasta', 'Acıbadem Kurabiyesi', 'Limonata', 'Demleme Çay'],
    alsoTry: ['Bol koyu çikolata sosuna batırılmış taze krema dolgulu klasik İnci profiterol tabağı'],
    beforeYouGo: [
      'Mis Sokak\'taki yerinde hızlı bir tatlı molası için idealdir.',
      'Paket olarak alıp İstiklal yürüyüşünde tüketmek de çok yaygındır.'
    ]
  },
  'beyoglu-tatli-mandabatmaz': {
    description: "Olivia Geçidi'nde 1967'den beri Cemil Filik'in özel pişirme tekniğiyle hazırlanan, üzerinde 'manda batsa batmaz' denilen yoğun kadifemsi köpüğüyle İstanbul'un en meşhur Türk kahvecisi.",
    whatToOrder: ['Geleneksel Mandabatmaz Türk Kahvesi', 'Damla Sakızlı Türk Kahvesi'],
    menuFrom: ['Sade Kahve', 'Orta Şekerli Kahve', 'Şekerli Kahve', 'Su', 'Maden Suyu'],
    alsoTry: ['Kaldırımdaki minik taburelere oturup bakır cezvede ağır ağır pişirilen bol köpüklü taze kahve'],
    beforeYouGo: [
      'Küçük bir pasaj girişinde taburelerde servis yapılır; salaş ve çok otantiktir.',
      'Taze çekilmiş özel kahve paketlerini hediyelik olarak alabilirsiniz.'
    ]
  },
  'beyoglu-tatli-hacibekir': {
    description: "1777 yılında kurulan, İstiklal Caddesi'ndeki tarihi dükkanında fıstıklı lokumları, akide şekerleri ve badem ezmeleriyle saray mutfağından bugüne uzanan eşsiz tatlı mirası.",
    whatToOrder: ['Güllü & Fıstıklı Lokum', 'Tarihi Tarçınlı Akide Şekeri'],
    menuFrom: ['Narlı Lokum', 'Badem Ezmesi', 'Kestane Şekeri', 'Helva Çeşitleri', 'Gül Şerbeti'],
    alsoTry: ['Geleneksel cam kavanozlardan doldurulan taze tarçınlı ve naneli akide şekerleri'],
    beforeYouGo: [
      'Tarihi mağaza aynı zamanda bir müze havasındadır; hediyelik lokum kutuları için en prestijli yerdir.',
      'Üst katındaki kafede Türk kahvesi eşliğinde lokum tadımı yapabilirsiniz.'
    ]
  },
  'beyoglu-tatli-beyoglucikolatacisi': {
    description: "İstiklal Caddesi üzerinde nostaljik vitrininde koca kalıplar halinde sergilenen, bol Karadeniz fındıklı kırma çikolatasıyla İstiklal yürüyüşlerinin vazgeçilmez tatlı ritüeli.",
    whatToOrder: ['Kırma Fındıklı Sütlü Çikolata', 'Bitter Fındıklı Tablet'],
    menuFrom: ['Fıstıklı Çikolata', 'Portakallı Çikolata', 'Madlen Çikolata', 'Drajeler', 'Hediyelik Spesiyal Kutular'],
    alsoTry: ['Özel parlak gümüş kağıda sarılmış taze fındık dolu kırma sütlü Beyoğlu çikolatası'],
    beforeYouGo: [
      'İstiklal Caddesi üzerinde gezerken çantada taşımak ve atıştırmak için harika bir klasiktir.',
      'Kilo işi taze kırılıp paketlenir.'
    ]
  },

  // --- TAKSİM ---
  'taksim-kebap-zubeyir': {
    description: "Bekar Sokak'ta katlı tarihi binasında kor kömürlü dev ocakbaşının etrafında, sulu kuzu pirzolası ve zırh kıymasıyla İstanbul'un en saygın et mabetlerinden biri.",
    whatToOrder: ['Kuzu Pirzola (Taraklık)', 'Zübeyir Zırh Kebabı'],
    menuFrom: ['Közde Patlıcan', 'Gavurdağı Salatası', 'Çöp Şiş', 'Köz Sarımsak', 'Künefe'],
    alsoTry: ['Ocakbaşı ustasının elinden çıkan nar gibi kızarmış sulu kuzu kaburga ve köz sarımsak'],
    beforeYouGo: [
      'Ocakbaşı tezgahında oturmak için günler öncesinden rezervasyon şarttır.',
      'Etler kömür ateşinde gözünüzün önünde pişirilir.'
    ]
  },
  'taksim-kebap-durumzade': {
    description: "Kurabiye Sokak'ta odun ateşinde ısıtılan özel çıtır lavaşları, taze kıyılmış sumaklı maydanozu ve sulu kebaplarıyla Anthony Bourdain'in dünyaya tanıttığı efsanevi sokak dürümcüsü.",
    whatToOrder: ['Adana Dürüm', 'Kuzu Çöp Şiş Dürüm'],
    menuFrom: ['Urfa Dürüm', 'Tavuk Şiş Dürüm', 'Ayran', 'Şalgam Suyu', 'Közlenmiş Biber'],
    alsoTry: ['Özel baharatlı sosla mangalda kızartılan çift lavaşlı çıtır Adana dürüm'],
    beforeYouGo: [
      'Küçük ve samimi bir sokak dükkanıdır; gece geç saatlere kadar açıktır.',
      'Hızlı, doyurucu ve unutulmaz bir Taksim klasiğidir.'
    ]
  },
  'taksim-kebap-kizilkayalar': {
    description: "Sıraselviler Caddesi girişinde özel domatesli sarımsaklı buhar sosunda yumuşatılan ekmeği ve baharatlı köftesiyle Taksim gecelerinin simgesi haline gelen ıslak hamburgerin mucidi.",
    whatToOrder: ['Orijinal Islak Hamburger', 'Kaşarlı Islak Hamburger'],
    menuFrom: ['Döner Sandviç', 'Dilli Kaşarlı Tost', 'Ev Yapımı Limonata', 'Ayran', 'Portakal Suyu'],
    alsoTry: ['Buhar tezgahından yeni çıkmış sıcacık soslu ıslak hamburger ve yanına soğuk ayran'],
    beforeYouGo: [
      'Taksim Meydanı metro çıkışının hemen karşısındadır.',
      'Günün 24 saati hareketli, ayakta veya taburede hızlı tüketim konseptindedir.'
    ]
  },
  'taksim-kebap-bambi': {
    description: "Sıraselviler Caddesi üzerinde yıllardır Taksim'in nabzını tutan, dönerli dürümleri, kaşarlı tostları ve taze atom meyve kokteylleriyle bilinen köklü büfe durağı.",
    whatToOrder: ['Et Döner Dürüm', 'Bambi Atom Meyve Suyu'],
    menuFrom: ['Kaşarlı Dürüm Döner', 'Tavuk Döner', 'Kavurmalı Kaşarlı Tost', 'Limonata', 'Muzlu Süt'],
    alsoTry: ['İncecik lavaşa sarılmış sıcak et dönerin ardından taze sıkılmış enerji dolu atom kokteyli'],
    beforeYouGo: [
      'Taksim Meydanı\'nda gece acıkanların ilk sığınağıdır.',
      'Hızlı servis ve paket servis imkanı vardır.'
    ]
  },
  'taksim-tatli-hafizmustafa': {
    description: "Taksim Meydanı'na bakan görkemli şubesinde 1864'ten beri Antep fıstıklı baklavaları, taze trileçeleri ve sütlü tatlılarıyla dünyanın dört bir yanından gelenlerin gözde tatlı sarayı.",
    whatToOrder: ['Hafız Mustafa Fıstıklı Baklava', 'Fıstıklı Trileçe'],
    menuFrom: ['Künefe', 'Kazandibi', 'Fırın Sütlaç', 'Nar Şerbeti', 'Osmanlı Kahvesi'],
    alsoTry: ['Çıtır çıtır taze tereyağlı fıstık sarma yanına dumanı üstünde geleneksel Türk kahvesi'],
    beforeYouGo: [
      'Taksim Meydanı manzaralı üst katında oturup tatlınızı afiyetle yiyebilirsiniz.',
      'Özel hediyelik kutularda baklava ve lokum paketleme servisi mevcuttur.'
    ]
  },
  'taksim-tatli-saray': {
    description: "İstiklal Caddesi girişinde 1935 yılında kurulan Saray Muhallebicisi'nin ilk adresi; manda sütüyle pişirilen geleneksel kazandibisi, tavukgöğsü ve su böreğiyle yaşayan bir anıt.",
    whatToOrder: ['Geleneksel Manda Sütlü Kazandibi', 'Gerçek Tavukgöğsü'],
    menuFrom: ['Fırın Sütlaç', 'Keşkül', 'Profiterol', 'Kıymalı Su Böreği', 'Demleme Çay'],
    alsoTry: ['Altı nar gibi kızarmış nefis yanık aromalı manda sütlü kazandibi'],
    beforeYouGo: [
      'Kahvaltıda taze çıtır su böreği ve sahanda yumurta da servis edilmektedir.',
      'İstiklal Caddesi\'nin en nostaljik ve güvenilir lezzet duraklarındandır.'
    ]
  },
  'taksim-tatli-jadore': {
    description: "Emir Nevruz Sokak'ta dantelli perdeleri, Fransız şansonları ve yoğun sıcak eritilmiş çikolatasıyla dillere destan 'Oh la la Beatrice' tatlısının doğduğu romantik çikolata butiği.",
    whatToOrder: ['Oh la la Beatrice', 'Sıcak Bitter Çikolata'],
    menuFrom: ['Çikolatalı Sufle', 'Kestane Püreli Pasta', 'Krep Çeşitleri', 'Filtre Kahve', 'Kırmızı Orman Meyveli Çay'],
    alsoTry: ['Pankek, taze çilek ve muzun üzerine bolca dökülen sıcak ev yapımı eritme Belçika çikolatası'],
    beforeYouGo: [
      'Kompakt ve minik bir kafedir; kapısında tatlı kuyrukları oluşabilir.',
      'Romantik ve loş bir Avrupa pastanesi ambiyansına sahiptir.'
    ]
  },
  'taksim-tatli-mado': {
    description: "Sıraselviler Caddesi girişinde hakiki Maraş keçi sütü dondurmasını kesme bloklar halinde sunan, sıcak baklava ve künefeyle buluşturan Taksim'in köklü dondurma köşesi.",
    whatToOrder: ['Kesme Maraş Dondurması', 'Dondurmalı Sıcak Fıstıklı Baklava'],
    menuFrom: ['Künefe', 'Su Böreği', 'Profiterol', 'Salepli Sıcak İçecek', 'Filtre Kahve'],
    alsoTry: ['Bıçakla kesilen yoğun kıvamlı sade Maraş dondurması ve sıcak şerbetli çıtır baklava'],
    beforeYouGo: [
      'Kış aylarında gerçek dağ salebiyle hazırlanan sıcak salep çok popülerdir.',
      'Geniş oturma salonunda ferah bir mola verebilirsiniz.'
    ]
  },
  'taksim-bistro-divan': {
    description: "Divan İstanbul'un lobi katında Michelin Rehberi tavsiyeli menüsüyle Türk ve Akdeniz mutfağının inceliklerini kusursuz zarafetle sunan Elmadağ'ın gastronomi ikonu.",
    whatToOrder: ['Ağır Ateşte Pişmiş Dana Kaburga', 'Divan Usulü Deniz Mahsulleri Çorbası'],
    menuFrom: ['Kuzu Sırtı', 'Trüflü Risotto', 'Ege Otlu Börek', 'Divan Klasiği Rokoko', 'İmza Şarap Kavı'],
    alsoTry: ['Yemek sonrasında Divan\'ın efsanevi tatlısı el yapımı çikolata soslu dondurmalı Rokoko'],
    beforeYouGo: [
      'Michelin tavsiyeli seçkin bir restorandır; rezervasyon yapılması önerilir.',
      'Zarif iş yemekleri ve özel kutlamalar için ideal bir atmosfer sunar.'
    ]
  },
  'taksim-bistro-izaka': {
    description: "CVK Park Bosphorus Hotel'in devasa çatı terasında Tarihi Yarımada'dan Boğaz Köprüsü'ne uzanan eşsiz manzarası, Akdeniz ve Uzak Doğu füzyon lezzetleriyle lüks bir gastronomi deneyimi.",
    whatToOrder: ['Izaka İmza Suşi Tabağı', 'Fırınlanmış Kuzu İncik'],
    menuFrom: ['Deniz Levreği Izgara', 'Trüflü Carpaccio', 'Tapas Seçkisi', 'İmza Kokteyller', 'San Sebastian'],
    alsoTry: ['Boğaz panoramasına karşı gün batımında usta şeflerin elinden çıkan taze suşi ve kokteyl eşliği'],
    beforeYouGo: [
      'Şehrin en geniş Boğaz manzaralı teraslarından birine sahiptir.',
      'Akşam saatlerinde DJ performansları eşliğinde seçkin bir gece kulübü havasına bürünür.'
    ]
  },
  'taksim-bistro-safran': {
    description: "InterContinental Hotel'in çatı katında nefes kesen Boğaz manzarasına karşı canlı klasik Türk müziği eşliğinde Osmanlı saray mutfağının en nadide tariflerini sunan lüks restoran.",
    whatToOrder: ['Saray Usulü Mutancana', 'Kuzu Karski'],
    menuFrom: ['Zeytinyağlı Vişneli Yaprak Sarma', 'Kavun İçi Dolma', 'Perdeli Pilav', 'Gül Şerbeti', 'Baklava Tabağı'],
    alsoTry: ['Kuru meyveler ve bademle zenginleştirilen Osmanlı saray ziyafetlerinin başrolü dana mutancana'],
    beforeYouGo: [
      'Pencere kenarı Boğaz manzaralı masalar için önceden rezervasyon yaptırılmalıdır.',
      'Geleneksel fasıl melodileri eşliğinde otantik ve asil bir akşam yemeği ortamı sunar.'
    ]
  },
  'taksim-bistro-topaz': {
    description: "Gümüşsuyu'nda Boğaz sularına tepeden bakan cam cephesinde, Akdeniz ve modern Türk mutfağını gurme tabaklarla buluşturan, seçkin şarap kavıyla tanınan bir fine dining klasiği.",
    whatToOrder: ['Tadım Menüsü (Modern Akdeniz)', 'Izgara Deniz Tarağı'],
    menuFrom: ['Ahtapot Carpaccio', 'Dana Bonfile Madalyon', 'Trüflü Ev Makarnası', 'Peynir Seçkisi', 'Limonlu Tart'],
    alsoTry: ['Boğaz Köprüsü ışıkları altında şefin mevsimsel malzemelerle hazırladığı gurme tadım menüsü'],
    beforeYouGo: [
      'İnönü Caddesi üzerinde yer alır; vale hizmeti sunulmaktadır.',
      'Romantik yemekler ve iş yemekleri için semtin en prestijli adreslerindendir.'
    ]
  },
  'taksim-cafe-arakafe': {
    description: "Tosbağa Sokak'ta usta fotoğrafçı Ara Güler'in siyah-beyaz İstanbul kareleriyle bezeli, sakin avlusu, zengin makarna ve salata menüsüyle İstiklal'in en huzurlu kültür kafesi.",
    whatToOrder: ['Kremalı Tavuklu Penne', 'Ara Kafe Ev Yapımı Limonata'],
    menuFrom: ['Günün Kişi', 'Tulum Peynirli Salata', 'Köfte Tabağı', 'Filtre Kahve', 'Havuçlu Tarçınlı Kek'],
    alsoTry: ['Ara Güler\'in tarihi İstanbul fotoğrafları altında sakin bir öğle yemeği ve taze limonata'],
    beforeYouGo: [
      'İstiklal Caddesi\'nin kalabalığından kaçıp nefes almak için ideal bir vahadır.',
      'Duvarlardaki fotoğraf sergisi adeta mini bir müze niteliğindedir.'
    ]
  },
  'taksim-cafe-limonlubahce': {
    description: "Yeni Çarşı Caddesi'nde gizli bir geçitten inilen, limon ağaçları ve sarmaşıklarla çevrili yemyeşil saklı bahçesinde gurme atıştırmalıklar ve imza kokteyller sunan cennet köşesi.",
    whatToOrder: ['Limonlu Bahçe Burger', 'Naneli Ev Yapımı Soğuk Çay'],
    menuFrom: ['Keçi Peynirli Salata', 'Füme Somonlu Wrap', 'Makarna Çeşitleri', 'Brownie', 'İmza Kokteyller'],
    alsoTry: ['Yaz sıcağında limon ağaçlarının gölgesinde buz gibi taze nane ve limonlu özel buzlu çay'],
    beforeYouGo: [
      'Mekana dar bir merdivenden inilerek girilir; dışarıdan tahmin edilemeyecek kadar geniş bir bahçesi vardır.',
      'Gündüz sakin bir çalışma ortamı, akşam ise canlı bir bahçe barına dönüşür.'
    ]
  },
  'taksim-cafe-49cukurcuma': {
    description: "Turnacıbaşı Caddesi'nde tarihi tuğla duvarlı otantik mekanında, taş fırında pişen çıtır gurme pizzaları, yerel peynirleri ve zengin şarap seçkisiyle Çukurcuma'nın simgesi.",
    whatToOrder: ['Pizza Bresaola & Roka', 'Pizza 49'],
    menuFrom: ['Pizza Margherita', 'Dört Peynirli Pizza', 'Tulum Peynirli Roka Salatası', 'Tiramisu', 'Ev Şarabı'],
    alsoTry: ['Taş fırından yeni çıkmış incecik çıtır hamurlu trüf aromalı mantarlı pizza'],
    beforeYouGo: [
      'Akşam saatlerinde çok popülerdir; masalar hızla dolabilir.',
      'Antikacılar sokağında keyifli bir yürüyüş sonrası dinlenmek için birebirdir.'
    ]
  },
  'taksim-cafe-geziistanbul': {
    description: "Taksim Meydanı'na ve Gezi Parkı'na bakan konumuyla 1987'den bu yana Avusturya ve Fransız pastacılık ekolünü yaşatan, taze pastaları, kahvaltıları ve brasserie lezzetleriyle bir meydan klasiği.",
    whatToOrder: ['Sacher Torte', 'Viyana Kahvesi'],
    menuFrom: ['Kruvasan Kahvaltı Tabağı', 'Elmalı Strudel', 'Dana Şnitzel', 'Filtre Kahve', 'Limonata'],
    alsoTry: ['Hakiki kayısı marmeladı ve yoğun çikolata kaplamalı Viyana klasiği Sacher Torte'],
    beforeYouGo: [
      'Geniş meydan manzaralı terasında oturup Taksim\'in ritmini izleyebilirsiniz.',
      'El yapımı çikolata ve pasta paketleri çok rağbet görür.'
    ]
  },

  // --- NİŞANTAŞI ---
  'nisantasi-kahve-petra': {
    description: "Topağacı'nın sakin köşesinde 1930'lar retro tasarımı, özenle kavrulmuş tek kökenli çekirdekleri ve zanaatkar espresso profilleriyle kahve tutkunlarının değişmez buluşma noktası.",
    whatToOrder: ['Acme Espresso Blend', 'Batch Brew Filtre Kahve'],
    menuFrom: ['Cortado', 'Flat White', 'Cold Brew', 'Avokadolu Tost', 'Tarçınlı Çörek'],
    alsoTry: ['Tek kökenli mikro-lot çekirdekten taze demlenen çiçeksi ve meyvemsi filtre kahve'],
    beforeYouGo: [
      'Hafta sonu sabahları hareketlidir; taze çekirdek kahveleri paket olarak alabilirsiniz.',
      'Kaldırımdaki minik masalarında Topağacı mahalle akışını izlemek çok keyiflidir.'
    ]
  },
  'nisantasi-kahve-moc': {
    description: "Şakayık Sokak'ta dev kahve kavurma makinesi, iki katlı endüstriyel mekanı ve Avustralya tarzı nitelikli kahve çeşitleriyle Nişantaşı'nın 3. dalga öncüsü.",
    whatToOrder: ['Cold Drip (Soğuk Damlama)', 'Flat White'],
    menuFrom: ['Espresso', 'Chili Mocca', 'V60 Pour Over', 'Kruvasan Sandviç', 'Havuçlu Kek'],
    alsoTry: ['Özel kulelerde saatlerce damla damla demlenen yoğun aromalı buz gibi cold drip kahve'],
    beforeYouGo: [
      'Üst katı laptop ile çalışmak veya toplantı yapmak için çok elverişlidir.',
      'Geniş oturma alanı günün her saati canlıdır.'
    ]
  },
  'nisantasi-kahve-spada': {
    description: "Avukat Süreyya Ağaoğlu Sokak'ta minimalist modern mimarisi, ödüllü çekirdek kavrumları ve sakin ortamıyla Teşvikiye'nin en rafine butik kahvecisi.",
    whatToOrder: ['Spada İmza Flat White', 'Aeropress Filtre Kahve'],
    menuFrom: ['Espresso', 'Cortado', 'Buzlu Latte', 'Muzlu Ekmek (Banana Bread)', 'Granola'],
    alsoTry: ['İpeksi süt dokusuyla hazırlanan dengeli flat white ve taze ısıtılmış muzlu ekmek'],
    beforeYouGo: [
      'Sessiz, sakin ve kaliteli bir kahve molası arayanlar için idealdir.',
      'Baristalar kahve tadım notaları konusunda oldukça bilgilidir.'
    ]
  },
  'nisantasi-kahve-cupofjoy': {
    description: "Şair Nigar Sokak'ta saklı ferah avlusu, organik çiğ (raw) tatlıları ve özel kavrulmuş kahveleriyle Nişantaşı'nın en neşeli kaçış noktası.",
    whatToOrder: ['V60 Single Origin', 'Şekersiz Raw Brownie'],
    menuFrom: ['Americano', 'Matcha Latte', 'Badem Sütlü Cappuccino', 'Chia Puding', 'Glutensiz Kurabiye'],
    alsoTry: ['Bitkisel süt alternatifleriyle hazırlanan buzlu matcha latte ve ev yapımı raw brownie'],
    beforeYouGo: [
      'Açık hava avlusu bahar ve yaz aylarında çok popülerdir.',
      'Sağlıklı, glutensiz ve vegan atıştırmalık seçenekleri çok zengindir.'
    ]
  },
  'nisantasi-kahvalti-kruvasan': {
    description: "Avukat Süreyya Ağaoğlu Sokak'ta her sabah fırından yayılan buram buram tereyağı kokusu, çıtır Fransız kruvasanları ve zengin şarküteri kahvaltı tabaklarıyla bir Teşvikiye fenomeni.",
    whatToOrder: ['Çırpılmış Yumurtalı & Füme Kaburgalı Kruvasan', 'Kruvasan Benedict'],
    menuFrom: ['Bademli Kruvasan', 'Nutellalı Çilekli Kruvasan', 'Ekşi Mayalı Tost', 'Taze Portakal Suyu', 'Filtre Kahve'],
    alsoTry: ['Fırından yeni çıkmış sıcak tereyağlı kruvasan arasında poşe yumurta ve ev yapımı hollandez sos'],
    beforeYouGo: [
      'Hafta sonu sabahları uzun kuyruklar oluşabilir; erken saatte gitmek avantajlıdır.',
      'Take-away olarak sıcak kruvasan paketletip Teşvikiye Parkı\'nda yemek çok yaygındır.'
    ]
  },
  'nisantasi-kahvalti-grandma': {
    description: "Ahmet Fetgari Sokak'ta anne eli değmiş hissi veren artisan ekşi mayalı ekmekleri, renkli taze salataları ve fırından çıkan sıcak hamur işleriyle huzurlu bir brunch mekanı.",
    whatToOrder: ['Ekşi Mayalı Avokadolu Poşe Yumurta', 'Fırınlanmış Çıtır Kiş'],
    menuFrom: ['Granola Kasesi', 'Pancake Tabağı', 'Otlu Peynirli Omlet', 'Ev Yapımı Limonata', 'Flat White'],
    alsoTry: ['Kendi fırınlarında taş tabanda pişen ekşi mayalı ekmek üzerinde avokado püresi ve poşe yumurta'],
    beforeYouGo: [
      'Pazar brunchları için Teşvikiye\'nin en popüler adreslerinden biridir.',
      'Tezgahtaki günlük zeytinyağlıları ve tartları mutlaka inceleyin.'
    ]
  },
  'nisantasi-kahvalti-delicatessen': {
    description: "Mim Kemal Öke Caddesi'nde zengin şarküteri dolabı, seçkin peynir kavı, taze ekşi mayalı sandviçleri ve gurme kahvaltı tabaklarıyla Nişantaşı elitlerinin klasik durağı.",
    whatToOrder: ['Gurme Şarküteri & Peynir Kahvaltı Tabağı', 'Füme Somonlu Bagel'],
    menuFrom: ['Trüflü Çırpılmış Yumurta', 'Granola', 'Fırın Tost', 'Taze Sıkma Meyve Suyu', 'Espresso'],
    alsoTry: ['Yerli ve ithal artisan peynirlerle donatılmış zengin şarküteri kahvaltı tepsisi'],
    beforeYouGo: [
      'Girişindeki şarküteri bölümünden gurme ürünler satın alabilirsiniz.',
      'Günün her saati şık ve sakin bir brasserie atmosferine sahiptir.'
    ]
  },
  'nisantasi-kahvalti-breadbutter': {
    description: "Mim Kemal Öke Caddesi'nde küçük, sevimli ve sıcak mekanında fırından taze çıkan ev kekleri, pancake\'leri ve tereyağlı çıtır ekmekleriyle samimi bir mahalle fırın-kafesi.",
    whatToOrder: ['Akçaağaç Şuruplu Fluffy Pancake', 'Sahanda Sucuklu Köy Yumurtası'],
    menuFrom: ['Avokadolu Tost', 'Ev Yapımı Reçeller', 'Kruvasan', 'Filtre Kahve', 'Demleme Çay'],
    alsoTry: ['Kabarmış yumuşacık sıcak pancake katları üzerine taze orman meyveleri ve akçaağaç şurubu'],
    beforeYouGo: [
      'İç mekan oldukça butiktir; hafta sonu kahvaltı saatlerinde sıra beklenebilir.',
      'Rahatlatıcı ev atmosferinde keyifli bir sabah başlangıcı sunar.'
    ]
  },
  'nisantasi-bistro-juno': {
    description: "Mim Kemal Öke Caddesi'nde samimi ahşap dekorasyonu, ince hamurlu çıtır pizzaları, taze el yapımı makarnaları ve zengin barıyla Nişantaşı'nın en sevilen mahalle bistrosu.",
    whatToOrder: ['Trüflü Yaban Mantarlı Pizza', 'Dana Kaburga Ragu Fettuccine'],
    menuFrom: ['Caprese Salata', 'Izgara Somon', 'Mini Burger Tabağı', 'Tiramisu', 'İmza Kokteyller'],
    alsoTry: ['Odun fırını lezzetinde incecik hamurla hazırlanan taze mozzarella ve trüflü mantar pizza'],
    beforeYouGo: [
      'Akşamüstü aperitivo ve akşam yemekleri için semt sakinlerinin değişmez buluşma yeridir.',
      'Rezervasyon yaptırmanız tavsiye edilir.'
    ]
  },
  'nisantasi-bistro-spago': {
    description: "The St. Regis Hotel'in çatı katında iki Michelin yıldızlı dünyaca ünlü şef Wolfgang Puck'ın imzasını taşıyan, Maçka Parkı ve Boğaz manzaralı ultra lüks fine dining restoranı.",
    whatToOrder: ['Füme Somonlu İkonik Pizza', 'Ağır Ateşte Pişmiş Dana Yanak'],
    menuFrom: ['Akdeniz Levrek Izgara', 'Kral Yengeç Salata', 'Trüflü Risotto', 'Çikolatalı Sufle', 'Özel Kokteyl Kavı'],
    alsoTry: ['Şef Wolfgang Puck\'ın dünya çapında ünlü çıtır havyarlı ve füme somonlu imza pizzası'],
    beforeYouGo: [
      'Michelin Rehberi tavsiyeli seçkin bir restorandır; günler öncesinden rezervasyon şarttır.',
      'Şık giyim kuralı (smart elegant) uygulanır; manzaralı teras barı gün batımında büyüleyicidir.'
    ]
  },
  'nisantasi-bistro-glens': {
    description: "Abdi İpekçi Caddesi üzerinde Glens Palas'ın görkemli atmosferinde, Akdeniz ve İtalyan mutfağını sofistike sunumlarla buluşturan Michelin seçkisi şık brasserie.",
    whatToOrder: ['Glens İmza Bonfile', 'Deniz Mahsullü Risotto'],
    menuFrom: ['Burrata Salatası', 'Fırınlanmış Kuzu Sırtı', 'Linguine Alle Vongole', 'Profiterol', 'Sommelier Şarap Seçkisi'],
    alsoTry: ['Taze manda burratası eşliğinde fesleğenli domates carpaccio ve fırınlanmış taze bonfile'],
    beforeYouGo: [
      'Abdi İpekçi Caddesi\'nin lüks alışveriş temposunun kalbinde yer alır.',
      'Akşam yemeklerinde canlı DJ ritimleri ve loş aydınlatmayla seçkin bir ambiyans kazanır.'
    ]
  },
  'nisantasi-bistro-beymen': {
    description: "Abdi İpekçi Caddesi üzerinde Beymen mağazasının ön cephesinde, cemiyet hayatının ve modaseverlerin yıllardır vazgeçemediği zarif Fransız brasserie klasiği.",
    whatToOrder: ['Cafe de Paris Soslu Bonfile', 'Brasserie Usulü Dana Şnitzel'],
    menuFrom: ['Fransız Soğan Çorbası', 'Kinoa & Somon Salata', 'Kulüp Sandviç', 'Krem Karamel', 'Seçkin Şampanya Menüsü'],
    alsoTry: ['Bakır tavada özel sosuyla cızırdayan ince bonfile dilimleri ve yanında sınırsız kibrit patates'],
    beforeYouGo: [
      'Caddeye bakan açık hava masaları semtin en popüler "görmek ve görülmek" noktasıdır.',
      'Öğle yemekleri ve akşamüstü kahveleri için daima hareketlidir.'
    ]
  },
  'nisantasi-tatli-divan': {
    description: "Mim Kemal Öke Caddesi köşesinde Türk pastacılığının zirvesi olarak Rokoko pastası, madlen çikolataları ve fıstıklı makaronlarıyla Nişantaşı'nın asil lezzet mabedi.",
    whatToOrder: ['Divan İkonik Rokoko', 'El Yapımı Madlen Çikolata'],
    menuFrom: ['Ekler', 'Badem Ezmesi', 'Çilekli Tart', 'Profiterol', 'Geleneksel Türk Kahvesi'],
    alsoTry: ['Dondurulmuş beze katları ve yoğun sıcak eritilmiş çikolata sosuyla servis edilen meşhur Rokoko'],
    beforeYouGo: [
      'Özel kutlamalar, doğum günleri ve hediyelik çikolata için semtin en prestijli adresidir.',
      'Şık kafesinde oturup tatlınızı servis alabilirsiniz.'
    ]
  },
  'nisantasi-tatli-vakko': {
    description: "Abdi İpekçi Caddesi'nde Fransız pastacılık zarafetini el yapımı çikolatalarla buluşturan, artisan kruvasanları ve kusursuz tatlı sunumlarıyla bir lüks yaşam simgesi.",
    whatToOrder: ['Vakko Chocolate Spesiyal', 'Paris-Brest'],
    menuFrom: ['Millefeuille (Milföy)', 'Fıstıklı Tart', 'Makaron Çeşitleri', 'Artisan Dondurma', 'İmza Çay Harmanları'],
    alsoTry: ['İsviçre çikolatası uzmanlığıyla hazırlanan fındık kremalı ve çıtır pralinli Vakko spesiyal çikolatalar'],
    beforeYouGo: [
      'Görsel estetiği çok yüksek, zarif ve fotojenik bir salona sahiptir.',
      'Özel gün hediyeleri için şık ambalajlı ürünler tercih edilir.'
    ]
  },
  'nisantasi-tatli-tatbak': {
    description: "Akkavak Sokak'ta 1960'tan beri Gaziantep mutfak mirasını yaşatan, çıtır altın sarısı fıstıklı baklavasıyla Michelin Bib Gourmand listesine giren yaşayan bir efsane.",
    whatToOrder: ['Havuç Dilim Baklava (Kaymaklı)', 'Kare Fıstıklı Baklava'],
    menuFrom: ['Fıstık Sarma', 'Şöbiyet', 'Çıtır Lahmacun', 'Köz Patlıcanlı Kebap', 'Açık Ayran'],
    alsoTry: ['Fırından taze çıkmış çıtır ılık havuç dilim baklavanın arasına hakiki Maraş kaymağı koydurmak'],
    beforeYouGo: [
      'Gaziantep usulü orijinal taş fırın lezzetleri sunar; Vedat Milor\'un en yüksek not verdiği yerlerdendir.',
      'Öğle saatlerinde hem çıtır lahmacun hem de baklava için kapısında sıra olabilir.'
    ]
  },
  'nisantasi-tatli-pelit': {
    description: "Rumeli Caddesi girişinde yarım asrı aşkın süredir çikolatalı pastaları, taze tartları ve kestane şekerleriyle nesiller boyu Nişantaşı ailelerinin tatlı tercihi.",
    whatToOrder: ['Kestaneli Çikolatalı Pasta', 'Valonia Çikolata Seçkisi'],
    menuFrom: ['Profiterol', 'Çilekli Ekler', 'Tuzlu Pastane Kurabiyesi', 'Fıstıklı Draje', 'Filtre Kahve'],
    alsoTry: ['Hakiki Bursa kestaneleri ve zengin Belçika çikolatasıyla hazırlanan taze katlı pasta'],
    beforeYouGo: [
      'Geniş vitrininde günlük yüzlerce taze pasta çeşidi sergilenir.',
      'Çay ve kahve eşliğinde nostaljik bir pastane molası için çok uygundur.'
    ]
  },

  // --- BEBEK ---
  'bebek-kahve-bebekkahve': {
    description: "Bebek Parkı'nın yanı başında ulu çınar ağaçlarının gölgesinde, Boğaz dalgalarına sıfır tahta masaları ve demli çayıyla 1945'ten beri İstanbul'un en ikonik sahil kahvehanesi.",
    whatToOrder: ['Közde Türk Kahvesi', 'Demleme Çay & Taze Simit'],
    menuFrom: ['Beyaz Peynirli Kaşarlı Tost', 'Menemen', 'Sahanda Yumurta', 'Limonata', 'Ayran'],
    alsoTry: ['Sabah erken saatte Boğaz martıları eşliğinde taze fırın simidi, beyaz peynir ve közde demli çay'],
    beforeYouGo: [
      'Deniz kenarındaki ön sıra masalar için sabah saatlerinde gitmek avantaj sağlar.',
      'Salaş, otantik ve şehrin en prestijli buluşma noktalarından biridir.'
    ]
  },
  'bebek-kahve-mangerie': {
    description: "Cevdet Paşa Caddesi üzerinde tarihi binanın üçüncü katındaki saklı terasında, kesintisiz Boğaz manzarasına karşı yaratıcı ve zengin gurme kahvaltısıyla bir Bebek klasiği.",
    whatToOrder: ['Mangerie Pancake', 'Füme Somonlu Yumurta'],
    menuFrom: ['Avokadolu Poşe Yumurta', 'Bacon & Cheddar Omlet', 'Granola Kasesi', 'Filtre Kahve', 'Ev Yapımı Buzlu Çay'],
    alsoTry: ['Boğaz esintili balkonda çıtır çıtır kabarmış tereyağlı pancake ve taze orman meyveleri'],
    beforeYouGo: [
      'Girişi bir apartman kapısındandır ve asansörle 3. kata çıkılır.',
      'Hafta sonu brunch saatlerinde kapısında sıra olabilir; erken gitmek tavsiye edilir.'
    ]
  },
  'bebek-kahve-lucca': {
    description: "Cevdet Paşa Caddesi'nin kalbinde gündüzleri sofistike bir brasserie, akşamüstünden itibaren dünya standartlarında miksoloji kokteylleriyle İstanbul cemiyet hayatının küresel buluşma noktası.",
    whatToOrder: ['Lucca Satsuma Kokteyli', 'Tavuk Ciğeri Parfe'],
    menuFrom: ['Ördek Ragu Pappardelle', 'Trüflü Patates Kızartması', 'Mini Burger Seçkisi', 'Burrata', 'Şarap Kavı'],
    alsoTry: ['Bodrum satsuma mandalinasıyla hazırlanan dünyaca ünlü Lucca Style Satsuma kokteyli'],
    beforeYouGo: [
      'Özellikle perşembe, cuma ve cumartesi akşamları rezervasyonsuz yer bulmak zordur.',
      'Gündüzleri açık hava sokak masalarında keyifli bir kahve veya hafif öğle yemeği sunar.'
    ]
  },
  'bebek-kahve-cupofjoy': {
    description: "Yasemin Pasajı'nın sakin avlusunda Türkiye'nin ilk üçüncü dalga kahve öncüsü olarak açılan, taze kavrum single-origin çekirdekleri ve samimi baristalarıyla butik kahve mabedi.",
    whatToOrder: ['Flat White', 'Single Origin V60 Pour Over'],
    menuFrom: ['Cortado', 'Cold Brew', 'Glutensiz Brownie', 'Raw İncirli Bar', 'Matcha Latte'],
    alsoTry: ['Kusursuz kadife süt köpüğüyle hazırlanan taze kavrum double shot flat white'],
    beforeYouGo: [
      'Cevdet Paşa Caddesi üzerindeki Yasemin Pasajı içerisindedir; cadde gürültüsünden izoledir.',
      'Take-away alıp Bebek Sahili boyunca yürüyüşe çıkmak semtin en popüler ritüelidir.'
    ]
  },
  'bebek-tatli-bademezmesi': {
    description: "1904 yılında Mudanyalı Mehmet Halil Bey tarafından kurulan, asırlık mermer tezgahlarda katkısız saf badem ve pancar şekeriyle dövülen badem ezmesiyle dünyanın en seçkin tatlı miraslarından biri.",
    whatToOrder: ['Tarihi Bebek Badem Ezmesi', 'Fıstık Ezmesi'],
    menuFrom: ['Acıbadem Kurabiyesi', 'Çikolata Kaplı Badem Ezmesi', 'Ceviz Ezmesi', 'Hediyelik Ahşap Kutu Seçkisi'],
    alsoTry: ['Ağızda eriyen taze dövülmüş ipeksi badem ezmesi ve duble fıstıklı yeşil ezme'],
    beforeYouGo: [
      'Tarihi küçük dükkan aynı aile tarafından 4 kuşaktır özenle işletilmektedir.',
      'Şık hediyelik kutuları İstanbul\'un en prestijli ikramlıklarından biridir.'
    ]
  },
  'bebek-tatli-minidondurma': {
    description: "1968 yılından beri Cevdet Paşa Caddesi'nde sadece 4 metrekarelik küçücük dükkanında, gerçek meyve ve manda sütüyle yapılan sakızlı, karadutlu ve güllü dondurmalarıyla bir Boğaz efsanesi.",
    whatToOrder: ['Karadutlu & Sakızlı Dondurma', 'Kestaneli & Bitter Çikolatalı Külah'],
    menuFrom: ['Kavunlu Dondurma', 'Güllü Lokumlu Dondurma', 'Tahinli Dondurma', 'Limonlu Sorbe', 'Vişneli Dondurma'],
    alsoTry: ['Ege karadutlarından yapılan koyu mor doğal dondurma ve Çeşme damla sakızlı yoğun sütlü külah'],
    beforeYouGo: [
      'Dükkan oldukça küçüktür; özellikle yaz akşamları sahil boyunca uzun kuyruklar oluşur.',
      'Tamamen doğal meyvelerle günlük taze üretilir.'
    ]
  },
  'bebek-tatli-abbaswaffle': {
    description: "1983 yılında Bebek'te minik bir büfede başlayarak Türkiye'yi Belçika waffle hamuruyla tanıştıran, sıcak çıtır petek hamuru ve bol taze meyvesiyle gece tatlı krizlerinin başrolü.",
    whatToOrder: ['Abbas Klasik Çikolatalı & Çilekli Waffle', 'Kestane Püreli Waffle'],
    menuFrom: ['Muzlu Fındıklı Waffle', 'Kivi & Beyaz Çikolatalı Waffle', 'Dondurmalı Waffle', 'Taze Limonata'],
    alsoTry: ['Demir döküm ızgaradan yeni çıkmış sıcacık çıtır waffle üzerine eritme çikolata, çilek ve Antep fıstığı'],
    beforeYouGo: [
      'Gece geç saatlere kadar açıktır; Bebek sahil yürüyüşlerinin vazgeçilmez tatlısıdır.',
      'Malzemeleri tezgaha bakarak dilediğiniz gibi kişiselleştirebilirsiniz.'
    ]
  },
  'bebek-tatli-baylan': {
    description: "Cevdet Paşa Caddesi'nde Boğaz kıyısındaki modern üç katlı cam mekanında, 1923'ten bugüne uzanan Kup Griye, Adisababa ve Trüf pastalarıyla Türk pastacılık tarihinin en zarif temsilcisi.",
    whatToOrder: ['Efsanevi Kup Griye', 'Adisababa'],
    menuFrom: ['Monte Carlo Pastası', 'Trüf Kek', 'Karamelli Makaron', 'Geleneksel Türk Kahvesi', 'Demleme Çay'],
    alsoTry: ['Karamel sosu, vanilyalı dondurma, krema şanti ve çıtır badem krokanla servis edilen meşhur Kup Griye'],
    beforeYouGo: [
      'Deniz sıfır teras katında oturup Boğaz gemi trafiğini izleyebilirsiniz.',
      'Özel gün kutlamaları ve zarif ikramlar için ideal bir atmosfer sunar.'
    ]
  },
  'bebek-balik-poseidon': {
    description: "Cevdet Paşa Caddesi'nde deniz kıyısında dalgaların hemen üstündeki konumuyla, günlük taze Boğaz balıkları, zengin zeytinyağlı mezeleri ve seçkin şarap kavıyla romantik bir deniz mabedi.",
    whatToOrder: ['Tuzda Levrek', 'Izgara Kalamar & Ahtapot'],
    menuFrom: ['Balık Çorbası', 'Karides Güveç', 'Levrek Marin', 'Lakerda', 'Günün Boğaz Balığı'],
    alsoTry: ['Alevler içinde masada kırılarak sunulan sulu deniz levreği ve çıtır ızgara ahtapot bacağı'],
    beforeYouGo: [
      'Suya sıfır masalar için mutlaka önceden rezervasyon yaptırılmalıdır.',
      'Deniz üzerinde yemek yiyormuş hissi uyandıran büyüleyici bir konuma sahiptir.'
    ]
  },
  'bebek-balik-chilai': {
    description: "Cevdet Paşa Caddesi'nde Boğaz'a sıfır cam cephesi, lüks şık dekorasyonu, sushi barı ve Akdeniz deniz mahsulleriyle modern sahil gastronomi deneyimi.",
    whatToOrder: ['Chilai İmza Sushi Tabağı', 'Fırınlanmış Deniz Levreği'],
    menuFrom: ['Ahtapot Carpaccio', 'Trüflü Karides', 'Somon Izgara', 'İmza Kokteyller', 'Çikolatalı Sufle'],
    alsoTry: ['Boğaz sularına bakan açık terasta taze sarılmış gurme sushi roll ve imza sahil kokteylleri'],
    beforeYouGo: [
      'Gündüz deniz manzaralı ferah bir bistro, akşam ise DJ müzikleriyle canlı bir mekana dönüşür.',
      'Vale hizmeti mevcuttur.'
    ]
  },
  'bebek-balik-bebekotel': {
    description: "The Stay bünyesinde 1950'lerden bu yana Türk sinemasının ve cemiyet hayatının simgesi olan Bebek Oteli'nin terasında, Boğaz'ın en seçkin sahil manzarasına karşı servis edilen taze deniz lezzetleri.",
    whatToOrder: ['Izgara Boğaz Lüferi', 'Deniz Mahsullü Risotto'],
    menuFrom: ['Ahtapot Salatası', 'Istakozlu Makarna', 'Kalamar Tava', 'Somon Tartar', 'Koleksiyon Şarap Seçkisi'],
    alsoTry: ['Boğaz akıntısına sıfır masalarda günlük avlanan çıtır derili sulu Boğaz balığı'],
    beforeYouGo: [
      'Şehrin en prestijli ve seçkin Boğaz teraslarından biridir; rezervasyon tavsiye edilir.',
      'Teras barı gün batımı saatlerinde çok rağbet görür.'
    ]
  },
  'bebek-balik-bebekbalikci': {
    description: "1974'ten beri Bebek Koyu'nun kıyısında devlet adamlarını, dünya yıldızlarını ve gurmeleri ağırlayan, klasik usulde pişirilen günlük deniz balıklarıyla şehrin en köklü balık restoranı.",
    whatToOrder: ['Kalkan Balığı Tava', 'Taze Boğaz Lakerdası'],
    menuFrom: ['Balık Köftesi', 'Fava', 'Deniz Börülcesi', 'Izgara Çipura', 'Sıcak İncir Tatlısı'],
    alsoTry: ['Bakır tavada nar gibi kızartılmış mısır unlu çıtır Boğaz kalkanı ve yanında taze roka salatası'],
    beforeYouGo: [
      'Geleneksel ve üst düzey servis kalitesine sahiptir.',
      'Pencere kenarı deniz masaları için önceden rezervasyon önerilir.'
    ]
  },
  'bebek-bistro-divan': {
    description: "Cevdet Paşa Caddesi üzerinde Boğaz sularına nazır geniş açık hava terasında, Divan mutfak ekolünün Akdeniz ve dünya klasikleriyle harmanlandığı lüks sahil brasserie'si.",
    whatToOrder: ['Ağır Ateşte Pişmiş Dana İncik', 'Divan Şnitzel'],
    menuFrom: ['Deniz Mahsüllü Linguine', 'Izgara Somon', 'Sezar Salata', 'Divan Rokoko', 'Kokteyl Menüsü'],
    alsoTry: ['Boğaz esintisinde taze el açması deniz mahsüllü linguine ve ardından klasik Divan Rokoko tatlısı'],
    beforeYouGo: [
      'Geniş deniz kıyısı terası özellikle hafta sonları iş ve aile yemekleri için çok popülerdir.',
      'Servis kalitesi ve konforu üst düzeydedir.'
    ]
  },
  'bebek-bistro-taps': {
    description: "Cevdet Paşa Caddesi'nin Aşiyan yönündeki görkemli köşesinde, Boğaz manzaralı terası, zengin dünya mutfağı lezzetleri ve gurme burgerleriyle sahilin en popüler rahat gastronomi durağı.",
    whatToOrder: ['Taps Özel Gurme Burger', 'Çıtır Tavuk Sepeti'],
    menuFrom: ['Dana Bonfile Izgara', 'Taş Fırın Pizza Çeşitleri', 'Meksika Fajita', 'Nachos', 'Fıçı İçecek Seçkisi'],
    alsoTry: ['Karamelize soğan ve cheddar soslu sulu gurme dana burger ve yanında baharatlı elma dilim patates'],
    beforeYouGo: ['Arkadaş buluşmaları ve maç izleme saatlerinde canlı ve enerjik bir atmosfer sunar.', 'Üst kat terasından Boğaz manzarası oldukça geniştir.']
  },
  'bebek-bistro-kirinti': {
    description: "Cevdet Paşa Caddesi üzerinde geniş porsiyonları, dinamik atmosferi, zengin dünya mutfağı menüsü ve wrap çeşitleriyle gençlerin ve ailelerin Bebek'teki neşeli adresi.",
    whatToOrder: ['Kırıntı Fajita Tabağı', 'BBQ Soslu Dana Kaburga Burger'],
    menuFrom: ['Tavuklu Sezar Salata', 'Quesadilla', 'Kremalı Mantarlı Makarna', 'Cheesecake', 'Milkshake'],
    alsoTry: ['Dumanı üstünde cızırdayarak masaya gelen taze tortillalı et fajita tabağı'],
    beforeYouGo: [
      'Porsiyonlar oldukça cömert ve doyurucudur.',
      'Bebek sahilinde hızlı, rahat ve keyifli bir öğle veya akşam yemeği için çok pratiktir.'
    ]
  },
  'bebek-bistro-midpoint': {
    description: "Cevdet Paşa Caddesi sahil hattında her damak tadına hitap eden geniş dünya menüsü, rahat oturma alanları ve Boğaz manzaralı masalarıyla günün her saati hareketli bir buluşma mekanı.",
    whatToOrder: ['Cafe de Paris Soslu Tavuk', 'Midpoint Burger'],
    menuFrom: ['Izgara Somon', 'Penne Arabbiata', 'Hellim Salata', 'Sıcak Çikolatalı Kek', 'Taze Limonata'],
    alsoTry: ['Özel tereyağlı aromatik sosunda servis edilen ince dilim tavuk göğsü ve patates kızartması'],
    beforeYouGo: [
      'Günün her saati kesintisiz servis sunar.',
      'Sahil yürüyüşü molasında ferah bir içecek veya yemek için daima yer bulunabilen geniş bir alana sahiptir.'
    ]
  },

  // --- YENİKÖY ---
  'yenikoy-kahve-yenikoykahvesi': {
    description: "Yeniköy sırtlarında Kürkçü Faik Sokak'ta asırlık çınar ağaçlarının gölgesinde, Boğaz'ın panoramik sularına bakan tahta masaları ve nostaljik çay ocağıyla semtin simge adresi.",
    whatToOrder: ['Közde Türk Kahvesi', 'Geleneksel Serpme Köy Kahvaltısı'],
    menuFrom: ['Sahanda Sucuklu Yumurta', 'Menemen', 'Taze Kaşarlı Tost', 'Demleme Rize Çayı', 'Ev Yapımı Limonata'],
    alsoTry: ['Boğaz esintisine karşı çınar gölgesinde bakır cezvede közde pişmiş köpüklü Türk kahvesi'],
    beforeYouGo: [
      'Yeniköy sahilinden merdivenlerle çıkılan dik ve sakin bir yokuş üzerindedir.',
      'Hafta sonu sabahları ön sıra manzaralı masalar çok talep görür.'
    ]
  },
  'yenikoy-kahve-sutisyalisi': {
    description: "Köybaşı Caddesi üzerinde tarihi Abdullah Ağa Yalısı'nda, doğrudan Boğaz dalgalarına sıfır iskelesi ve meşhur manda sütlü geleneksel tatlarıyla eşsiz bir kahvaltı ve buluşma mekanı.",
    whatToOrder: ['Manda Kaymağı & Bal', 'Sütiş Menemen'],
    menuFrom: ['Su Böreği', 'Kıymalı Kol Böreği', 'Özel Çiftlik Peynirleri', 'Fırın Sütlaç', 'Kazandibi'],
    alsoTry: ['Deniz kenarı masalarda çıtır sıcacık su böreği, taze manda kaymağı ve petek bal'],
    beforeYouGo: [
      'Tarihi yalı mimarisi ve deniz manzarası oldukça etkileyicidir.',
      'Hafta sonu kahvaltı saatlerinde sıra oluşabilir.'
    ]
  },
  'yenikoy-kahve-kup': {
    description: "Köybaşı Caddesi üzerinde samimi avlusu ve üçüncü dalga kahvecilik uzmanlığıyla taze kavrulan nitelikli çekirdekleri Yeniköylülerle buluşturan modern butik kafe.",
    whatToOrder: ['Cortado', 'Single Origin Filtre Kahve'],
    menuFrom: ['Flat White', 'Cold Brew', 'Havuçlu Tarçınlı Kek', 'Bademli Kruvasan', 'Matcha Latte'],
    alsoTry: ['Taze çekilmiş Etiyopya çekirdekleriyle demlenen meyvemsi gövdeli V60 pour over'],
    beforeYouGo: [
      'Yeniköy sahil yürüyüşü molasında kahve almak için mükemmel bir duraktır.',
      'Sakin ve dinlendirici bir atmosfere sahiptir.'
    ]
  },
  'yenikoy-kahve-sedir': {
    description: "Köybaşı Caddesi sahil hattında denize nazır sedir oturma düzeni, sıcak semt sohbetleri ve zengin kahvaltı tabaklarıyla Yeniköy sahilinin en huzurlu dinlenme noktalarından biri.",
    whatToOrder: ['Sedir Serpme Kahvaltı', 'Ev Yapımı Mantı'],
    menuFrom: ['Sahanda Beyaz Peynirli Yumurta', 'Gözleme Çeşitleri', 'Tost', 'Demleme Çay', 'Salep'],
    alsoTry: ['Boğaz sularına birkaç adım mesafede taze peynirli çıtır sac gözlemesi ve ince belli bardakta demli çay'],
    beforeYouGo: [
      'Geniş ve rahat sedir oturma alanları uzun sohbetler için idealdir.',
      'Boğaz sahilinde salaş ve samimi bir atmosfer sunar.'
    ]
  },
  'yenikoy-firin-borekci': {
    description: "1895 yılından beri aynı tarihi taş fırında odun ateşiyle pişen çıtır çıtır Sarıyer ve kol börekleriyle İstanbul'un yaşayan en kıymetli fırın miraslarından biri.",
    whatToOrder: ['Pudra Şekerli Küt Böreği', 'Kıymalı Kuş Üzümlü Kol Böreği'],
    menuFrom: ['Peynirli Su Böreği', 'Ispanaklı Börek', 'Tahinli Çörek', 'Acıbadem Kurabiyesi', 'Demli Çay'],
    alsoTry: ['Fırından yeni çıkmış sıcacık kıymalı börek ve üzerine pudra şekeri serpilmiş efsanevi çıtır küt böreği'],
    beforeYouGo: [
      'Sabah saatlerinde börekler fırından sıcacık çıkar; erken gitmek tavsiye edilir.',
      'Take-away alıp hemen karşıdaki sahil banklarında deniz havasıyla yemek bir Yeniköy klasiğidir.'
    ]
  },
  'yenikoy-firin-pan': {
    description: "Köybaşı Caddesi'nde geleneksel ekşi maya tekniklerini Fransız fırıncılığıyla buluşturan, artisan kruvasanları ve nefis ekmekleriyle ünlü çağdaş mahalle fırını.",
    whatToOrder: ['Bademli Çikolatalı Kruvasan', 'Ekşi Mayalı Zeytinli Ekmek'],
    menuFrom: ['Kardemomlu Çörek', 'Tereyağlı Kruvasan', 'Limonlu Tart', 'Granola', 'Filtre Kahve'],
    alsoTry: ['İçi yumuşacık badem kremasıyla doldurulmuş fırından yeni çıkmış kat kat tereyağlı çıtır kruvasan'],
    beforeYouGo: [
      'Kruvasan ve ekşi mayalı özel ekmekler öğleden sonra tükenebilir.',
      'Semtin en popüler modern artisan fırınıdır.'
    ]
  },
  'yenikoy-firin-mua': {
    description: "İtalyan gelato ustalığını Türkiye'nin en kaliteli yerel mevsim meyveleri ve katkısız sütüyle birleştiren, Yeniköy sahilinin vazgeçilmez butik dondurmacısı.",
    whatToOrder: ['Manda Sütlü Sade & Fıstıklı Gelato', 'Datça Bademli Dondurma'],
    menuFrom: ['Bodrum Mandalinası Sorbe', 'Bitter Çikolatalı Gelato', 'Karadutlu Dondurma', 'İncirli Gelato', 'Kahveli Gelato'],
    alsoTry: ['Kavrulan taze Antep fıstığının saf lezzetini sunan yoğun kıvamlı fıstıklı gelato'],
    beforeYouGo: [
      'Mevsimine göre lezzetler sürekli güncellenir; katkı maddesi veya yapay aroma içermez.',
      'Sahil yürüyüşü yapanların önünde kuyruk oluşturduğu uğrak noktadır.'
    ]
  },
  'yenikoy-firin-emekmanti': {
    description: "1965'ten bu yana Köybaşı Caddesi'nde incecik el açması hamuru, bol yoğurdu ve cızırdayan biberli tereyağıyla İstanbul'un en meşhur mantı duraklarından biri.",
    whatToOrder: ['Klasik Haşlama Emek Mantısı', 'Çıtır Kızarmış Mantı'],
    menuFrom: ['Zeytinyağlı Yaprak Sarma', 'Çiğ Börek', 'Gözleme', 'Ev Baklavası', 'Ayran'],
    alsoTry: ['Altın sarısı tereyağı ve sumak pul biber eşliğinde servis edilen tül inceliğindeki taze el açması mantı'],
    beforeYouGo: [
      'Porsiyonlar oldukça doyurucudur ve servis çok hızlıdır.',
      'Mantı severlerin yıllardır vazgeçemediği köklü bir lezzet mabedidir.'
    ]
  },
  'yenikoy-balik-takanik': {
    description: "Köybaşı Caddesi üzerinde yılların deneyimiyle en taze mevsim balıklarını kurutmadan sulu sulu ızgara yapan, samimi ortamı ve dürüst lezzetleriyle Yeniköy'ün en sevilen balıkçısı.",
    whatToOrder: ['Mevsimine Göre Izgara Lüfer', 'Çıtır Hamsi Tava'],
    menuFrom: ['Kalamar Tava', 'Tereyağlı Karides Güveç', 'Balık Çorbası', 'Mısır Ekmeği', 'Tahin Helvası'],
    alsoTry: ['Mısır ununa bulanarak kızgın tavada altın gibi kızartılmış çıtır çıtır Karadeniz hamsisi'],
    beforeYouGo: [
      'Salaş, samimi ve kaliteli balık arayanların ilk tercihidir.',
      'Akşam saatlerinde oldukça hareketlidir; rezervasyon önerilir.'
    ]
  },
  'yenikoy-balik-iskele': {
    description: "Yeniköy vapur iskelesinin hemen bitişiğinde deniz kazıkları üzerine kurulu ahşap yapısıyla, Boğaz akıntısına sıfır masalarda klasik balık ve meze keyfi yaşatan tarihi sahil lokantası.",
    whatToOrder: ['Kalkan Tava', 'Taze Boğaz Lakerdası'],
    menuFrom: ['Deniz Börülcesi', 'Ahtapot Salatası', 'Izgara Levrek', 'Fava', 'Sıcak İncir Tatlısı'],
    alsoTry: ['Tuz ve zeytinyağında dinlendirilmiş pamuk gibi taze Boğaz torik lakerdası ve yanında kırmızı soğan'],
    beforeYouGo: [
      'Deniz kenarındaki cam kenarı masalar için erken rezervasyon şarttır.',
      'Geleneksel servis adabına sahip nezih bir Boğaz restoranıdır.'
    ]
  },
  'yenikoy-balik-sandal': {
    description: "Köybaşı Caddesi'nin şık sahil şeridinde günlük avlanan taze deniz balıkları, özenli Ege mezeleri ve sıcak deniz mahsulleriyle modern sahil balıkçılığı sunan seçkin adres.",
    whatToOrder: ['Izgara Ahtapot Bacağı', 'Tuzda Levrek'],
    menuFrom: ['Karides Söğüş', 'Levrek Marin', 'Kalamar Izgara', 'Roka Salatası', 'Fırında Helva'],
    alsoTry: ['Köz kokulu dışı hafif çıtır içi yumuşacık servis edilen zeytinyağlı ızgara ahtapot'],
    beforeYouGo: [
      'Hem iş yemekleri hem de aile buluşmaları için çok uygundur.',
      'Hafta sonu akşamları rezervasyonsuz yer bulmak zordur.'
    ]
  },
  'yenikoy-balik-azur': {
    description: "Boğaz'ın incisi Yeniköy kıyısında dünya denizlerinden ve yerel sulardan getirilen en taze kabukluları, sashimi ve crudo tabaklarını çağdaş sunumlarla harmanlayan Michelin tavsiyeli deniz gastronomi merkezi.",
    whatToOrder: ['Azur Crudo & Sashimi Tabağı', 'Istakozlu Tagliolini'],
    menuFrom: ['Kral Yengeç Bacağı', 'İstiridye Seçkisi', 'Trüflü Deniz Tarağı', 'Izgara Lagos', 'Özel Kav Seçkisi'],
    alsoTry: ['Taze narenciye ve sızma zeytinyağı marinasyonuyla hazırlanan imza levrek crudo'],
    beforeYouGo: [
      'Gelişmiş deniz ürünleri mutfağı ve şık ambiyansı için mutlaka önceden rezervasyon yapılmalıdır.',
      'Kıyafet kuralı smart-casual düzeyindedir.'
    ]
  },
  'yenikoy-bistro-apartiman': {
    description: "Şef Burçak Kazdal'ın yerel üreticilerden temin edilen mevsimlik malzemelerle hazırladığı yaratıcı tabakları, sıcak mahalle ruhu ve Michelin Bib Gourmand ödülüyle Yeniköy'ün en özel gastronomi durağı.",
    whatToOrder: ['Mevsimlik Şef Tadım Tabağı', 'Ağır Pişmiş Dana Kaburga'],
    menuFrom: ['El Yapımı Taze Makarna', 'Fırınlanmış Pancar & Keçi Peyniri', 'Günün Tartari', 'Doğal Şarap Seçkisi', 'Mevsim Tatlısı'],
    alsoTry: ['Kendi fırınlarında pişen ekşi mayalı ekmek eşliğinde taze çiftlik otları ve mevsimlik mezeler'],
    beforeYouGo: [
      'Menü mevsimlere ve yerel hasada göre düzenli olarak değişir.',
      'Samimi ve butik bir alana sahip olduğundan rezervasyon tavsiye edilir.'
    ]
  },
  'yenikoy-bistro-fiko': {
    description: "Köybaşı Caddesi üzerinde ünlü kebap ustası Fiko'nun özel marinasyonlu kanatları, zırh kıyması Adana kebabı ve şık modern dekorasyonuyla İstanbul'un en popüler gurme ocakbaşı adresi.",
    whatToOrder: ['Fiko Özel Kanat', 'Zırh Kıyması Fiko Adana Kebap'],
    menuFrom: ['Çöp Şiş', 'Küşleme', 'Fındık Lahmacun', 'Gavurdağı Salatası', 'Fıstıklı Katmer'],
    alsoTry: ['Özel baharat sosuyla kömür ateşinde nar gibi kızaran efsanevi sulu Fiko Kanat'],
    beforeYouGo: [
      'Akşam saatlerinde çok popüler ve hareketlidir; rezervasyonsuz yer bulmak neredeyse imkansızdır.',
      'Vale hizmeti mevcuttur.'
    ]
  },
  'yenikoy-bistro-gazebo': {
    description: "Köybaşı Caddesi üzerinde Boğaz sularının hemen kenarındaki geniş bahçesi ve şık terasında, Akdeniz ve dünya mutfağından seçkin lezzetlerle gün boyu kesintisiz keyif sunan sahil lounge'u.",
    whatToOrder: ['Izgara Somon Teriyaki', 'Gazebo Gurme Burger'],
    menuFrom: ['Burrata Salatası', 'Deniz Mahsüllü Risotto', 'Penne Arrabiata', 'Özel Kokteyl Menüsü', 'Cheesecake'],
    alsoTry: ['Boğaz gün batımına karşı çıtır patates kızartması ve trüflü mayonezli gurme dana burger'],
    beforeYouGo: [
      'Geniş terasında deniz kenarı masalar gün batımında çok keyiflidir.',
      'Rahat ve şık bir sahil ambiyansı sunar.'
    ]
  },
  'yenikoy-bistro-saithalim': {
    description: "19. yüzyıldan kalma görkemli Sait Halim Paşa Yalısı'nın rıhtımında, Boğaz sularına sıfır tarihi atmosferde Osmanlı ve Akdeniz lezzetlerini birleştiren prestijli açık hava restoranı.",
    whatToOrder: ['Ağır Ateşte Kuzu İncik', 'Yalı Usulü Levrek'],
    menuFrom: ['Enginarlı Ahtapot Salatası', 'Vişneli Yaprak Sarma', 'Trüflü Risotto', 'Yalı Çikolatalı Sufle', 'İmza Kokteyller'],
    alsoTry: ['Tarihi yalı rıhtımında dalgaların sesine karşı ağır ateşte lokum gibi pişmiş safranlı kuzu incik'],
    beforeYouGo: [
      'Yaz aylarında rıhtım açık hava servisi verir; kışın tarihi salonlar kullanılır.',
      'Özel gün kutlamaları ve seçkin akşam yemekleri için önceden rezervasyon şarttır.'
    ]
  },

  // --- GÖKTÜRK ---
  'gokturk-kahve-yasemin': {
    description: "Arcadium Life Çarşısı'nda ev sıcaklığındaki zarif bahçesi, günlük taze pişen artisan tartları, quiche'leri ve özenli brunch sunumlarıyla Göktürk'ün en sevilen buluşma noktası.",
    whatToOrder: ['Yasemin Özel Kahvaltı Tabağı', 'Fıstıklı Orman Meyveli Pasta'],
    menuFrom: ['Pırasalı Keçi Peynirli Quiche', 'Avokadolu Çırpılmış Yumurta', 'Limonlu Merengli Tart', 'Filtre Kahve', 'Ev Yapımı Buzlu Çay'],
    alsoTry: ['Günlük çıkan taze tereyağlı sıcak quiche ve yanında ince dilimlenmiş avokadolu poşe yumurta'],
    beforeYouGo: [
      'Hafta sonu kahvaltı ve brunch saatlerinde yoğun talep görür.',
      'Açık hava bahçe alanı çocuklu aileler ve evcil hayvan sahipleri için çok konforludur.'
    ]
  },
  'gokturk-kahve-boter': {
    description: "Belediye Caddesi üzerinde minimalist İskandinav tasarımı, taze kavrulan mikro lot çekirdekleri ve dumanı üstünde tarçınlı çörekleriyle semtin öncü üçüncü dalga kahvecisi.",
    whatToOrder: ['Boter Cinnamon Roll', 'Single Origin Flat White'],
    menuFrom: ['Cortado', 'V60 Pour Over', 'Matcha Latte', 'Bademli Kruvasan', 'Cold Brew'],
    alsoTry: ['Fırından sıcacık çıkan bol tarçınlı ve krem peynir soslu taze el yapımı cinnamon roll'],
    beforeYouGo: [
      'Kahve çekirdekleri haftalık olarak taze kavrulur; paket kahve alımı yapılabilir.',
      'Sessiz ve konsantrasyona uygun çalışma alanına sahiptir.'
    ]
  },
  'gokturk-kahve-minoa': {
    description: "Larus Palas'ın altında binlerce seçkin sanat ve edebiyat kitabıyla çevrili büyüleyici atmosferinde, gurme kahve ve sağlıklı hafif yemekler sunan bağımsız kitap kafe.",
    whatToOrder: ['Trüflü Mantarlı Tost', 'Minoa Filtre Kahve Harmanı'],
    menuFrom: ['Granola Kasesi', 'Kinoa Salatası', 'Havuçlu Cevizli Kek', 'Cortado', 'Bitki Çayları'],
    alsoTry: ['Geniş kütüphane rafları arasında taze demlenmiş aromatik pour-over kahve ve ev yapımı havuçlu kek'],
    beforeYouGo: [
      'Geniş kitap koleksiyonunu incelerken vakit geçirmek için ideal bir kültür vahasıdır.',
      'Açık hava terası kahve molaları için oldukça ferahtır.'
    ]
  },
  'gokturk-kahve-manifesto': {
    description: "Arcadium Life içerisinde dünya kahve kuşağından özenle seçilen yeşil çekirdekleri yerinde profillendiren, tutkulu baristalarıyla semtin en popüler kahve duraklarından biri.",
    whatToOrder: ['Cold Drip', 'Double Shot Americano'],
    menuFrom: ['Latte', 'Espresso Tonic', 'Glutensiz Kurabiye', 'Çikolatalı Brownie', 'Chai Tea Latte'],
    alsoTry: ['Buz üzerinde yavaş damıtmayla 12 saatte hazırlanan yoğun aromalı cold drip kahve'],
    beforeYouGo: [
      'Take-away alıp yakındaki yürüyüş parkurlarına gitmek için çok elverişlidir.',
      'Hızlı ve güleryüzlü servis sunar.'
    ]
  },
  'gokturk-bistro-enzo': {
    description: "İstanbul Caddesi Arcadium Life'ta gerçek Napoli odun fırınında 450 derecede pişen çıtır kenarlı pizzaları ve taze el açması makarnalarıyla otantik bir İtalyan trattoria deneyimi.",
    whatToOrder: ['Pizza Margherita Verace', 'Trüflü Mantarlı Tagliolini'],
    menuFrom: ['Burrata Caprese', 'Lazanya Al Forno', 'Carpaccio di Manzo', 'Klasik Tiramisu', 'İtalyan Şarapları'],
    alsoTry: ['San Marzano domates sosu ve manda mozzarellasıyla taş tabanda kabaran çıtır kenarlı napoli pizza'],
    beforeYouGo: [
      'Makarnalar günlük olarak mutfakta taze taze açılır.',
      'Aile yemekleri ve romantik akşamlar için sakin ve sıcak bir ambiyansı vardır.'
    ]
  },
  'gokturk-bistro-bite': {
    description: "Larus Palas'ta yüksek tavanlı modern endüstriyel mimarisi, sulu gurme burgerleri ve zengin dünya mutfağı seçkisiyle Göktürk'ün en dinamik buluşma mekanı.",
    whatToOrder: ['Bite Gurme Burger', 'Ağır Ateşte Pişmiş Dana Kaburga Tacos'],
    menuFrom: ['Trüflü Parmesanlı Patates', 'Çıtır Tavuk Kanat', 'Füme Somonlu Salata', 'Churros', 'Craft Bira Seçkisi'],
    alsoTry: ['Karamelize soğan, trüf mayonez ve erimiş cheddar peyniriyle hazırlanan sulu kuru dinlendirilmiş dana burger'],
    beforeYouGo: [
      'Hafta sonu akşamları genç ve enerjik bir kalabalık ağırlar.',
      'Açık cadde terası keyifli bir sokak manzarasına sahiptir.'
    ]
  },
  'gokturk-bistro-noir': {
    description: "Arcadium Life'ta Fransız ve Akdeniz brasserie kültürünü yansıtan şık kadife koltukları, geniş şarap kavı ve usta şef dokunuşlu etleriyle semtin seçkin fine-dining bistro'su.",
    whatToOrder: ['Ördek Konfi', 'Dana Bonfile Cafe de Paris'],
    menuFrom: ['Fransız Soğan Çorbası', 'Keçi Peynirli Roka Salatası', 'Somon Izgara', 'Krem Karamel', 'İmza Kokteyller'],
    alsoTry: ['Dışı çıtır içi lif lif ayrılan fırınlanmış ördek bacağı ve yanında kremamsı patates püresi'],
    beforeYouGo: [
      'Şık ve nezih akşam yemekleri için önceden rezervasyon yaptırılması önerilir.',
      'Zengin bir kadeh şarap kavına sahiptir.'
    ]
  },
  'gokturk-bistro-sushico': {
    description: "Belediye Caddesi'nde Uzak Doğu mutfağının en taze sushi roll'larını, çıtır ördek ve sıcak wok spesiyallerini Göktürk sakinleriyle buluşturan kaliteli Asya durağı.",
    whatToOrder: ['Philadelphia Roll', 'Çıtır Zencefilli Tavuk'],
    menuFrom: ['Edamame', 'Dana Etli Noodle', 'Karidesli Dim Sum', 'Crispy Duck', 'Kızarmış Muz Tatlısı'],
    alsoTry: ['Taze somon, avokado ve krem peynir dolgulu çıtır tempura kaplamalı özel roll seçkisi'],
    beforeYouGo: [
      'Hızlı paket servis ve ferah salon oturma alanı sunar.',
      'Uzak Doğu lezzetleri arayanlar için Göktürk\'ün en istikrarlı adresidir.'
    ]
  },
  'gokturk-kebap-kosebasi': {
    description: "İstanbul Caddesi üzerinde geleneksel Adana kebap kültürünü modern sunumlar ve yüksek servis standardıyla birleştiren, Türkiye'nin uluslararası üne sahip kebap klasiği.",
    whatToOrder: ['Zırh Kıyması Köşebaşı Kebap', 'Toros Salatası'],
    menuFrom: ['Çöp Şiş', 'İçli Köfte', 'Gavurdağı Salatası', 'Fıstıklı Kebap', 'Ilık Fıstıklı Katmer'],
    alsoTry: ['Erkek kuzu etinden zırhla kıyılan baharat dengesi kusursuz sulu Adana kebap ve nar ekşili Toros salatası'],
    beforeYouGo: [
      'Geniş ve konforlu salonu iş ve aile yemekleri için çok uygundur.',
      'Hafta sonları rezervasyon yapılması tavsiye edilir.'
    ]
  },
  'gokturk-kebap-gunaydin': {
    description: "Arcadium Life Çarşısı'nda usta kasapların özel dinlendirilmiş etlerini kömür ızgarasında mükemmel pişirdiği, et severlerin güvenilir adresi.",
    whatToOrder: ['Dana Lokum Bonfile', 'Günaydın Kasap Köfte'],
    menuFrom: ['Kuzu Pirzola', 'Antrikot Izgara', 'Kaşarlı Köfte', 'Fırınlanmış Patates', 'Fıstıklı Havuç Dilim Baklava'],
    alsoTry: ['Kuru dinlendirilmiş (dry-aged) kömür ateşinde mühürlenmiş yumuşacık dana lokum dilimleri'],
    beforeYouGo: [
      'Yan tarafındaki kasap reyonundan çiğ et alışverişi de yapılabilir.',
      'Porsiyonlar doyurucu ve et kalitesi birinci sınıftır.'
    ]
  },
  'gokturk-kebap-bedriusta': {
    description: "Göktürk Caddesi'nde dumanı tüten dev ocakbaşı tezgahı, taş fırından cızırdayarak çıkan lahmacunları ve çıtır mezeleriyle samimi kebap şöleni.",
    whatToOrder: ['Köz Patlıcanlı Kebap', 'Çıtır Antep Lahmacun'],
    menuFrom: ['Kuzu Şiş', 'Alinazik Kebap', 'Çiğ Köfte', 'Közde Biber Domates', 'Künefe'],
    alsoTry: ['Közlenmiş patlıcan yatağında servis edilen tereyağlı yoğurtlu sulu kuzu kıyma kebabı'],
    beforeYouGo: [
      'Ocakbaşı tezgahında oturup ustayı izleyerek yemek yemek ayrı bir keyiftir.',
      'Hızlı ve samimi bir esnaf kebapçısı ruhunu korur.'
    ]
  },
  'gokturk-kebap-sedatusta': {
    description: "Çamlık Caddesi üzerinde salaş dükkanında kömür mangalında pişen efsane lavaş dürümleri, sıcak ikramları ve değişmeyen lezzetiyle Göktürk'ün en popüler dürümcüsü.",
    whatToOrder: ['Özel Soslu Adana Dürüm', 'Kuzu Ciğer Şiş Dürüm'],
    menuFrom: ['Urfa Dürüm', 'Tavuk Şiş Dürüm', 'Ezme Salata', 'Közlenmiş Sarımsak & Biber', 'Açık Köpüklü Ayran'],
    alsoTry: ['Taze açılmış sıcak lavaşa sarılı kimyonlu ve sumaklı soğanlı sulu kuzu ciğer dürüm'],
    beforeYouGo: [
      'Hızlı bir öğle veya akşam yemeği için son derece pratiktir.',
      'Fiyat-performans dengesi oldukça yüksektir.'
    ]
  },
  'gokturk-tatli-pelit': {
    description: "İstanbul Caddesi üzerinde onlarca yıllık pastacılık geleneği, çikolata ustalığı ve zengin pasta büfesiyle kutlamaların ve tatlı molalarının vazgeçilmez adresi.",
    whatToOrder: ['Pelit Klasik Profiterol', 'Kestaneli Pasta'],
    menuFrom: ['Millefeuille (Milföy)', 'Trüf Çikolata Kutusu', 'Krokanlı Pasta', 'El Yapımı Macaron', 'Demli Çay'],
    alsoTry: ['Bol kakao aromalı yoğun ılık çikolata sosuyla kaplanmış taze kremalı profiterol topları'],
    beforeYouGo: [
      'Özel gün pastaları ve hediyelik çikolata seçiminde semtin bir numaralı tercihidir.',
      'Geniş oturma salonunda çay saati çok popülerdir.'
    ]
  },
  'gokturk-tatli-dondurmaci': {
    description: "Belediye Caddesi'nde saf inek ve keçi sütüyle, katkı maddesiz taze meyvelerle hazırlanan artisan dondurmalarıyla yaz kış önünde kuyruk oluşan mahalle efsanesi.",
    whatToOrder: ['Gerçek Karadutlu Dondurma', 'Hakiki Sakızlı Dondurma'],
    menuFrom: ['Belçika Çikolatalı Dondurma', 'Kavunlu Sorbe', 'Bal Badem Dondurma', 'Antep Fıstıklı Külah', 'Limon Sorbe'],
    alsoTry: ['Çeşme sakızı aromasıyla uzayan yoğun kıvamlı geleneksel sakızlı dondurma'],
    beforeYouGo: [
      'Dondurmalarda glikoz şurubu veya renklendirici kullanılmaz.',
      'Özellikle yaz akşamlarında açık havada uzun yürüyüşlerin vazgeçilmez durağıdır.'
    ]
  },
  'gokturk-tatli-divan': {
    description: "Arcadium Life'ta Divan pastane mirasının efsanevi Rokoko tatlısı, el yapımı pralinleri ve enfes fırın ürünleriyle lüks tatlı zevkini temsil eden zarif dükkan.",
    whatToOrder: ['Divan Rokoko', 'Pralin & Truffle Çikolata Seçkisi'],
    menuFrom: ['Ekler Çeşitleri', 'Frambuazlı Cheesecake', 'Kruvasan', 'Filtre Kahve', 'Sıcak Çikolata'],
    alsoTry: ['Karamelli beze ve dondurma katmanlarıyla servis edilen sıcak çikolata soslu klasik Divan Rokoko'],
    beforeYouGo: [
      'Hediye paketleri ve şık ambalajlı ikramlıklar için çok uygundur.',
      'Zarif ve sessiz bir pastane kahve deneyimi sunar.'
    ]
  },
  'gokturk-tatli-butterfly': {
    description: "Larus Palas'ta saf kakao çekirdeklerinden üretilen bean-to-bar artisan çikolataları, sıcak çikolatalı sufleleri ve gurme çikolata kaplı lezzetleriyle tatlı tutkunlarının mabedi.",
    whatToOrder: ['Taze Çikolatalı Sufle', 'Single Origin Madagaskar Çikolatası'],
    menuFrom: ['Portakal Çubuklu Bitter Çikolata', 'Çikolatalı Sorbe', 'Tuzlu Karamelli Çikolata', 'Sıcak Bitter Çikolata', 'Espresso'],
    alsoTry: ['Sipariş üzerine taze pişirilen fırından dumanı tüten akışkan çikolatalı sıcak sufle'],
    beforeYouGo: [
      'Türkiye\'nin en kaliteli butik çikolata üreticilerinden biridir.',
      'Çikolata atölyesi standartlarında katkısız ve saf ürünler sunar.'
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
