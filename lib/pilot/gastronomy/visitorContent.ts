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

  // --- HAMBURGER ---
  'kadikoy-burger-basta': {
    description: "Şef dokunuşlu gurme sokak lezzetleri konseptinde, el yapımı yumuşak brioche ekmeği ve özel kuzu hamburgeriyle Kadıköy'ün öncü durağı.",
    whatToOrder: ['Kuzu Burger', 'Dana Füme Dürüm'],
    menuFrom: ['Kuzu Burger', 'Dana Burger', 'Humus', 'Sütlaç'],
    alsoTry: ['Şef usulü fırınlanmış baharatlı patates'],
    beforeYouGo: [
      'Oturma düzeni sokak bistro tarzındadır; akşam pik saatlerde kısa sıra oluşabilir.',
      'Take-away servisi oldukça hızlı ve pratiktir.',
      'Menüdeki şef tatlısı fırın sütlaç yemeğin klasik tamamlayıcısıdır.'
    ]
  },
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

  // --- PIZZA ---
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
  'kadikoy-pizza-nappo': {
    description: "Geleneksel Napoli hamur standartlarında, yüksek ısıda taş fırında pişen leopar desenli kenarları ve kaliteli peynir seçkisiyle tanınan pizza noktası.",
    whatToOrder: ['Marinara', 'Pizza Bufala'],
    menuFrom: ['Marinara', 'Margherita DOP', 'Melanzane', 'Tiramisu'],
    alsoTry: ['Fındık kremalı Calzone'],
    beforeYouGo: [
      'Geniş ve aydınlık oturma alanıyla grup ve aile yemeklerine uygundur.',
      'Hafta sonu akşamları yoğunlaşır; erken saatler daha sakindir.'
    ]
  },

  // --- KAHVALTI ---
  'kadikoy-breakfast-brekkie': {
    description: "Yoğurtçu Parkı karşısında Fransız usulü el yapımı kat kat tereyağlı kruvasanlar ve zengin tuzlu/tatlı kahvaltı tabaklarında uzmanlaşmış fırın-kafe.",
    whatToOrder: ['Eggs Benedict Kruvasan', 'Salted Caramel Kruvasan'],
    menuFrom: ['Scrambled Eggs Croissant', 'Avokadolu Kruvasan', 'Granola Kasesi'],
    alsoTry: ['Taze demlenmiş V60 filtre kahve'],
    beforeYouGo: [
      'Hafta sonları sabah saatlerinden itibaren sıra oluşur; hafta içi erken saatler çok daha sakindir.',
      'Kruvasanları paket olarak alıp Yoğurtçu Parkı veya sahil yürüyüşünde tüketmek popülerdir.'
    ]
  },
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
  'kadikoy-breakfast-kuff': {
    description: "Yeldeğirmeni'nin tarihi aksında, taze malzemeli sahanda sıcaklar, pişi ve doyurucu kahvaltı tepsileri sunan dinamik bir mahalle buluşma noktası.",
    whatToOrder: ['Küff Kahvaltı Tabağı', 'Döküm Tavada Menemen'],
    menuFrom: ['Menemen', 'Hellimli Sucuklu Tava', 'Pişi Tabağı', 'Filtre Kahve'],
    alsoTry: ['Taze sıcak pişi'],
    beforeYouGo: [
      'Yeldeğirmeni sanat atölyeleri ve mural sokaklarına yürüme mesafesindedir.',
      'Kahvaltı servisi gün boyu devam eder.'
    ]
  },

  // --- TATLI & PASTANE ---
  'kadikoy-dessert-baylan': {
    description: "1923'ten bugüne Kadıköy Çarşı'da yaşayan Cumhuriyet dönemi pastane mirası; tarihi salon atmosferi ve zamansız imza kuplarıyla simge bir kültür durağı.",
    whatToOrder: ['Kup Griye', 'Adisababa'],
    menuFrom: ['Kup Griye', 'Rokoko', 'Profiterol', 'Petit Four'],
    alsoTry: ['Geleneksel likörlü çikolata'],
    beforeYouGo: [
      'Üst kat salonu tarihi fotoğraflar ve edebiyatçıların buluşma köşeleriyle nostaljiktir.',
      'Öğleden sonra 5 çayı saatlerinde hareketlenir.'
    ]
  },
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

  // --- DATE MEKANLARI ---
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
  'kadikoy-date-viktorlevi': {
    description: "Damacı Sokak'ta 1914'ten bu yana sarmaşıklarla bezeli gizli iç bahçesi, tarihi taş mahzeni ve geniş yerel kavıyla Kadıköy'ün en köklü akşam buluşma mekanlarından biri.",
    whatToOrder: ['Viktor Levi Özel Rezerv', 'Peynir Tabağı'],
    menuFrom: ['Peynir Tabağı', 'Bonfile Dilimleri', 'Izgara Somon', 'Sıcak Şarap'],
    alsoTry: ['Kuru incirli cevizli sıcak fırın peynir'],
    beforeYouGo: [
      'Sarmaşıklı iç bahçe masaları romantik ambiyans için ilk tercih edilir.',
      'Hafta sonu akşamları için rezervasyon önerilir.'
    ]
  },
  'kadikoy-date-bastaneobistro': {
    description: "Sakız Gülü Sokak'ta rahat bistro atmosferinde şef dokunuşlu yaratıcı mevsimlik tabaklar ve eşleşmeli seçkiler sunan çağdaş bir akşam mekanı.",
    whatToOrder: ['Şef Tadım Tabağı', 'Dana Kaburga'],
    menuFrom: ['Dana Kaburga', 'Şef Mezesi', 'Karides Tartar', 'Mevsim Tatlısı'],
    alsoTry: ['Özel fermantasyon içecek eşleşmeleri'],
    beforeYouGo: [
      'Akşam saatlerinde loş aydınlatma ve müzik eşliğinde keyifli bir bistro ortamı oluşur.',
      'Yemekler paylaşımlı tüketime uygun porsiyonlanır.'
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
