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
