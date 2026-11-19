import { getStaticRegionVenuePayload } from '@/lib/food/regionDiscovery';
import type { FoodLocation, VisitorFoodVenue } from '@/lib/food/types';
import { getPublishedV3Snapshot, V3_LOCATIONS } from './registry';
import type { V3PublicVenue } from './types';

export interface GeoPilotFaq {
  question: { tr: string; en: string };
  answer: { tr: string; en: string };
}

export interface GeoPilotEditorialContent {
  venueId: string;
  regionSlug: 'moda' | 'kadikoy';
  primaryCategorySlug: string;
  culinaryIdentity: { tr: string; en: string };
  orderingGuide: { tr: string; en: string };
  microLocationContext: { tr: string; en: string };
  selectionComparison: { tr: string; en: string };
  faqs: [GeoPilotFaq, GeoPilotFaq, GeoPilotFaq];
}

export interface WalkableNeighborStop {
  id: string;
  name: string;
  categoryLabel: string;
  categorySlug: string;
  neighborhood: string;
  distanceMeters: number;
  isPilotVenue: boolean;
  mapsUri: string;
}

export interface ResolvedGeoPilotVenue {
  venueId: string;
  regionSlug: 'moda' | 'kadikoy';
  location: FoodLocation;
  visitorVenue: VisitorFoodVenue;
  snapshotVenue: V3PublicVenue;
  primaryCategorySlug: string;
  primaryCategoryLabel: string;
  editorial: GeoPilotEditorialContent;
  walkableStops: WalkableNeighborStop[];
  regionVerifiedAt: string;
}

const PILOT_EDITORIAL_LIST: readonly GeoPilotEditorialContent[] = [
  {
    venueId: 'moda-gg-pizza',
    regionSlug: 'moda',
    primaryCategorySlug: 'pizza',
    culinaryIdentity: {
      tr: 'Şair Nefi Sokak üzerindeki küçük mutfağında uzun soğuk fermantasyonlu ekşi maya hamurunu odun fırınında pişiren GG Pizza Moda, Caferağa’daki Napoli ekolü pizza duraklarının ön sırasındadır. Kabarık kenarlı hafif hamur yapısı ve sade malzeme dengesi odak noktasındadır.',
      en: 'Tucked on Sair Nefi Street in Caferaga, GG Pizza Moda bakes slow cold-fermented sourdough bases in a wood-fired oven. Its light, blistered crust and restrained topping ratios define a neighborhood-scale Neapolitan kitchen.',
    },
    orderingGuide: {
      tr: 'İlk masada sade hamur dokusunu ölçmek için Margherita Napoli iyi bir başlangıç oluşturur; yanında füme et ve trüf aromalı çeşit veya burrata peynirli seçenekle hamurun sıcaklığına göre farklı yoğunluklar denenebilir. Masada sunulan sarımsaklı zeytinyağı hamur kenarları için ayrılır; kapanışta mascarpone kremalı ev yapımı tiramisu paylaşılabilir.',
      en: 'Begin with the Margherita Napoli to gauge the fermentation and bake, then pair it with a smoked-meat truffle pie or burrata option for richer contrast. Aromatic garlic olive oil sits on the table specifically for finishing the charred crust, followed by house mascarpone tiramisu.',
    },
    microLocationContext: {
      tr: 'Caferağa içinde Şair Nefi Sokak No:10 adresinde, Moda Tramvay hattının Damga Sokak ve Şifa duraklarına kısa yürüyüş mesafesinde yer alır. İç salon küçük, dış masa sayısı sınırlıdır ve paket servisi yapılmadığı için yalnızca yerinde akşam yemeği planıyla gidilmelidir.',
      en: 'Located at Sair Nefi Sokak No:10 near the Damga Sokak and Sifa tram stops in Moda. Indoor capacity and sidewalk tables are limited, and takeout is not offered, making on-site dining essential.',
    },
    selectionComparison: {
      tr: 'Aynı sokaktaki yüksek hidratasyonlu zanaat çeşitleri öne çıkaran Artisan Craft ile karşılaştırıldığında GG Pizza Moda klasik Napoli hamuru ve ev yapımı tiramisu kapanışıyla ayrışır; İtalyan sokak pizzası tarzındaki il Sud Moda ise daha hızlı dilim akışına uygundur.',
      en: 'While nearby Artisan Craft leans toward experimental high-hydration toppings and il Sud serves casual street slices, GG Pizza Moda focuses on classic wood-fired Neapolitan dough paired with house tiramisu.',
    },
    faqs: [
      {
        question: { tr: 'GG Pizza Moda’da paket servis veya eve teslim var mı?', en: 'Does GG Pizza Moda offer takeout or delivery?' },
        answer: { tr: 'Hayır, hamur sıcaklığını ve dokusunu korumak için yalnızca salonda ve sınırlı dış masalarda servis verir.', en: 'No, it operates strictly for dine-in service in its small indoor room and limited outdoor tables.' },
      },
      {
        question: { tr: 'Hafta sonu akşamları bekleme yaşanır mı?', en: 'Should visitors expect a wait on weekend evenings?' },
        answer: { tr: 'Evet, küçük salon kapasitesi nedeniyle özellikle hafta sonu akşam saatlerinde kapıda sıra ve masa beklemesi oluşabilir.', en: 'Yes, due to limited seating in a tight dining room, weekend dinner hours frequently involve waiting at the door.' },
      },
      {
        question: { tr: 'Pizza dışında masaya ne eklenebilir?', en: 'What pairs well besides pizza?' },
        answer: { tr: 'Kenarlar için sunulan aromatik sarımsaklı zeytinyağı ve yemek sonrası ev yapımı tiramisu sıkça tercih edilir.', en: 'House garlic olive oil for the crusts and homemade mascarpone tiramisu after dinner.' },
      },
    ],
  },
  {
    venueId: 'moda-red-bunny',
    regionSlug: 'moda',
    primaryCategorySlug: 'hamburger',
    culinaryIdentity: {
      tr: 'Ferit Tek Sokak’ta yer alan Red Bunny Burger Moda, tereyağlı yumuşak ekmeği, porsiyon tutarlılığı ve kendi ürettiği imza soslarıyla Caferağa’daki bağımsız burger üreticileri arasında öne çıkar.',
      en: 'Set on Ferit Tek Street in Caferaga, Red Bunny Burger Moda pairs buttered buns with house-made signature sauces and consistent portion execution as an independent neighborhood burger kitchen.',
    },
    orderingGuide: {
      tr: 'Ana siparişte ev soslu Red Bunny Signature Burger ile karamelize soğanlı smash seçenek arasında seçim yapılabilir; hamburgerden ayrı paylaşımlık olarak baharatlı ev pane soğan halkaları ve ranch sos tamamlayıcı bir yan ürün sunar.',
      en: 'Order the house-sauced Red Bunny Signature Burger or Caramelized Onion Smash as the centerpiece, and add house-battered spicy onion rings with ranch dip to share on the side.',
    },
    microLocationContext: {
      tr: 'Caferağa, Ferit Tek Sokak Yonca Apt No:60D konumunda, Moda merkez akslarının iç sokağındadır. Genç ve mahalle ağırlıklı sakin bir oturma düzeni vardır ancak mutfak kapasitesi kompakt olduğundan kalabalık gruplarda siparişler biraz bekleyebilir.',
      en: 'Found at Ferit Tek Sokak No:60D inside the quieter residential streets of Caferaga. Seating favors smaller tables, and the compact kitchen means larger group orders can take extra prep time.',
    },
    selectionComparison: {
      tr: 'Dalga Sokak’taki 2Bites Moda daha çok double smash ve trüflü mayonez çizgisindeyken, Moda Bostanı’ndaki Soho Smash hızlı yüksek tempolu servis sunar; Red Bunny özel ev sosları ve sakin iç sokağıyla ayrılır.',
      en: 'Compared with 2Bites Moda (double smash and truffle mayo) and high-turnover Soho Smash, Red Bunny distinguishes itself with house-crafted sauces and a calmer side-street room.',
    },
    faqs: [
      {
        question: { tr: 'Red Bunny Burger Moda’da burger dışı sıcak yan ürün hangisidir?', en: 'Which side dish stands out alongside the burgers?' },
        answer: { tr: 'Ev yapımı pane harcıyla hazırlanan baharatlı çıtır soğan halkaları ve ranch sos ayrı porsiyon olarak öne çıkar.', en: 'House-battered spicy crispy onion rings served with ranch dressing.' },
      },
      {
        question: { tr: 'Büyük gruplarla gitmeye uygun mu?', en: 'Is it well suited for large groups?' },
        answer: { tr: 'Butik mutfak ve küçük dükkan düzeni nedeniyle küçük gruplar ve ikili-üçlü masalar için daha rahattır.', en: 'Due to a compact kitchen and intimate shop layout, smaller tables of two to four are much easier to accommodate.' },
      },
      {
        question: { tr: 'Ekmek ve köfte yapısı nasıldır?', en: 'What style of bun and patty is served?' },
        answer: { tr: 'Tereyağlı yumuşak ekmek içinde mühürlü köfte veya smash seçenekleri sunulur.', en: 'Soft buttered buns paired with seared or smashed beef patties.' },
      },
    ],
  },
  {
    venueId: 'moda-vermilion',
    regionSlug: 'moda',
    primaryCategorySlug: 'kahve',
    culinaryIdentity: {
      tr: 'Rızapaşa Sokak’taki Vermilion Coffee, seçilmiş micro-lot çekirdekleri berrak demleme reçeteleriyle hazırlayan saf nitelikli kahve barıdır; kahve dışındaki tatlılar yalnız ikincil eşlikçi rolündedir.',
      en: 'Operating on Rizapasa Street, Vermilion Coffee is a dedicated specialty coffee bar focused on single-origin micro-lot filter brews and precise espresso extraction rather than heavy cafe menus.',
    },
    orderingGuide: {
      tr: 'Çekirdek karakterini doğrudan hissetmek için Tek Köken V60 veya süt dengesi yüksek Piccolo Latte öne çıkar; yaz sıcaklarında cold brew tercih edilir. Asiditeli demlemelerin yanında tuzlu karamelli cookie veya San Sebastian tatlısıyla denge kurulabilir.',
      en: 'Order a Single-Origin V60 pour-over or a concise Piccolo Latte to highlight bean clarity; cold brew fits warm afternoons. Salt-caramel cookies or San Sebastian cheesecake balance brighter filter roasts.',
    },
    microLocationContext: {
      tr: 'Dr. Esat Işık Caddesi paralelinde Rızapaşa Sokak No:27/A üzerinde, Moda İlkokulu ve tramvay durağına birkaç dakikalık yürüme mesafesindedir. Ana caddeden bir sokak içeride olması sakin sokak oturması sağlar; ancak iç masa sayısı sınırlıdır.',
      en: 'Situated one block off Dr. Esat Isik Avenue at Rizapasa Sokak No:27/A near the Moda Primary School tram stop. Its tucked-away sidewalk seating stays peaceful, though indoor tables are scarce.',
    },
    selectionComparison: {
      tr: 'Moda’da kavurma tesisi ölçeğindeki Walter’s veya yüksek akışlı espresso barı Montag yerine sessiz sokak masasında tek köken el demlemesi arayanlar için Vermilion Coffee ayırt edici bir seçenektir.',
      en: 'Where Walter’s emphasizes roastery scale and Montag focuses on brisk espresso counter service, Vermilion Coffee offers a quieter sidewalk pause around hand-poured single-origin lots.',
    },
    faqs: [
      {
        question: { tr: 'Vermilion Coffee çalışmak veya kalabalık oturmak için uygun mu?', en: 'Is Vermilion Coffee suited for laptop work or big groups?' },
        answer: { tr: 'İç masa sayısı az olduğundan kalabalık gruplara uygun değildir; kısa kahve molası ve ikili sohbetler için idealdir.', en: 'Indoor tables are limited, making it far better for quiet coffee breaks in pairs than for large groups.' },
      },
      {
        question: { tr: 'Burada tatlı yerine kahve odaklı mı servis veriliyor?', en: 'Is the menu primarily coffee-focused?' },
        answer: { tr: 'Evet, ana odak micro-lot V60, espresso ve cold brew üzerindedir; cookie gibi ürünler yan eşlikçidir.', en: 'Yes, specialty V60 filter, espresso, and cold brew lead the bar, with cookies as secondary pairings.' },
      },
      {
        question: { tr: 'Konumu tramvay hattına yakın mı?', en: 'Is it close to the Kadikoy-Moda tram line?' },
        answer: { tr: 'Moda İlkokulu çevresindeki tramvay durağına yalnızca birkaç dakikalık yürüyüş mesafesindedir.', en: 'Yes, it lies a couple of minutes on foot from the Moda Ilkokulu tram stop.' },
      },
    ],
  },
  {
    venueId: 'moda-montag',
    regionSlug: 'moda',
    primaryCategorySlug: 'kahve',
    culinaryIdentity: {
      tr: 'İstanbul nitelikli kahve kavurmacılığının köklü markalarından Montag’ın Bademaltı Sokak’taki şubesi olan Montag Espresso Bar, sade tezgahı ve tutarlı Ida Blend espresso reçeteleriyle bilinen demleme odaklı bir duraktır.',
      en: 'Located on Bademalti Street, Montag Espresso Bar represents one of Istanbul’s pioneering specialty coffee roasters, built around a streamlined bar, the Ida Blend espresso profile, and batch or V60 filter brews.',
    },
    orderingGuide: {
      tr: 'Sütlü kahvede Flat White (Ida Blend) veya kısa sütsüz denge için Cortado seçilirken sade filtre sevenler V60 tek köken ya da hazır batch brew alabilir. Günlük tuzlu seçenek arandığında focaccia sandviç ve bademli tart eşlik eder.',
      en: 'Go for the Ida Blend Flat White or a tight Cortado, or switch to a single-origin V60 and daily batch brew. Savory focaccia sandwiches and almond tarts serve as light bar accompaniments.',
    },
    microLocationContext: {
      tr: 'Caferağa Bademaltı Sokak No:22/A’da, Moda Caddesi ile Mühürdar aksının kesişimine birkaç adım mesafede yer alır. İç tezgah ve kaldırım tabureleri hızlı al-götür temposuna göre düzenlenmiştir; uzun bilgisayar oturumları için uygun değildir.',
      en: 'Set at Bademalti Sokak No:22/A steps from Moda Caddesi and the Muhurdar corridor. Limited counter seats and sidewalk stools favor quick neighborhood coffee stops over long laptop sessions.',
    },
    selectionComparison: {
      tr: 'Çalışma alanı arayışındaki ziyaretçiler için Rawsters Moda daha geniş alan sunarken, Montag hızlı tempolu kavurucu barında tutarlı Flat White ve batch brew almak isteyenlerin durağıdır.',
      en: 'For laptop seating Rawsters Moda offers more space; Montag focuses squarely on brisk roastery-bar execution for takeaway or sidewalk espresso.',
    },
    faqs: [
      {
        question: { tr: 'Montag Espresso Bar’da gel-al kahve almak pratik mi?', en: 'Is Montag Espresso Bar geared toward takeaway coffee?' },
        answer: { tr: 'Evet, kaldırım tabureleri ve tezgah düzeni hızlı espresso ve filtre kahve servisine göre kurgulanmıştır.', en: 'Yes, both the espresso bar workflow and sidewalk stools are built for brisk takeaway and quick stops.' },
      },
      {
        question: { tr: 'Hangi espresso harmanı kullanılıyor?', en: 'Which espresso blend is featured?' },
        answer: { tr: 'Ida Blend bazlı Flat White ve sütlü-sütsüz espresso çeşitlerinin yanında tek köken filtreler bulunur.', en: 'The roaster’s Ida Blend anchors espresso drinks alongside rotating single-origin filter coffees.' },
      },
      {
        question: { tr: 'Kahvenin yanında tuzlu atıştırmalık var mı?', en: 'Are savory snacks available alongside coffee?' },
        answer: { tr: 'Günlük hazırlanan focaccia sandviçler ve bademli tart tezgah eşlikçisi olarak sunulur.', en: 'Daily focaccia sandwiches and almond tarts are offered at the counter.' },
      },
    ],
  },
  {
    venueId: 'moda-aida',
    regionSlug: 'moda',
    primaryCategorySlug: 'date-mekanlari',
    culinaryIdentity: {
      tr: 'Ressam Şeref Akdik Sokak’taki iki katlı konakta hizmet veren Aida Vino E Cucina, el yapımı İtalyan makarnaları, taş fırın ekmeği ve yerli-yabancı şarap kavıyla Moda’nın ağırbaşlı akşam yemeği ve date adreslerindendir.',
      en: 'Set inside a historic Caferaga townhouse on Ressam Seref Akdik Street, Aida Vino E Cucina pairs house-rolled Italian pasta and hearth bread with a curated domestic and Italian wine cellar.',
    },
    orderingGuide: {
      tr: 'Paylaşımlı burrata başlangıcının ardından taze trüflü tagliatelle veya ossobuco / ızgara ahtapot ana tabakları seçilebilir; yemek kavdan kadeh veya şişe şarap eşleşmeleriyle tamamlanır. Kapanışta masa paylaşımına uygun fındıklı mascarponeli tiramisu öne çıkar.',
      en: 'Start with burrata for the table before ordering fresh truffle tagliatelle or ossobuco / grilled octopus matched with cellar wines. End with the hazelnut mascarpone tiramisu.',
    },
    microLocationContext: {
      tr: 'Caferağa, Ressam Şeref Akdik Sokak No:10 üzerinde Moda tramvay durağına kısa yürüyüş mesafesindedir. Loş aydınlatmalı tam masa servisli bir konak salonu sunar; yüksek bütçe segmentindedir ve rezervasyonsuz akşam masası bulmak oldukça zordur.',
      en: 'Located at Ressam Seref Akdik Sokak No:10 near the tram line. Candlelit table service occupies an intimate mansion setting; pricing sits in the higher tier and reservations are practically mandatory.',
    },
    selectionComparison: {
      tr: 'Viktor Levi’nin açık arka bahçe ortamı ve Irregular Moda’nın daha deneysel bistro çizgisi karşısında Aida, klasik konak salonunda İtalyan mutfağı ve akşam buluşması arayanlar için ayrılır.',
      en: 'Compared with Viktor Levi’s leafy garden courtyard and Irregular’s contemporary bistro plate style, Aida centers on classic Italian dining inside an intimate townhouse room.',
    },
    faqs: [
      {
        question: { tr: 'Aida Vino E Cucina’da rezervasyon şart mı?', en: 'Are reservations necessary at Aida Vino E Cucina?' },
        answer: { tr: 'Akşam servisinde tam masa düzeniyle çalıştığı için önceden rezervasyon yaptırmak gerekir; kapıdan boş masa bulmak zordur.', en: 'Yes, advance booking is strongly advised as walk-in tables are rarely available during dinner.' },
      },
      {
        question: { tr: 'Menü hangi mutfağa odaklanıyor?', en: 'What culinary focus drives the menu?' },
        answer: { tr: 'El yapımı makarnalar, et ve deniz ürünü ana yemekleri ile yerli-İtalyan şarap eşleşmelerine odaklanır.', en: 'Handmade pastas, slow-cooked mains, grilled seafood, and Italian/Turkish wine pairings.' },
      },
      {
        question: { tr: 'Fiyat ve bütçe beklentisi nedir?', en: 'What budget level should guests plan for?' },
        answer: { tr: 'Moda seçkisindeki özel akşam yemeği mekanları arasında üst / yüksek bütçe kategorisindedir.', en: 'It sits in the upper / fine-evening budget tier within the Moda guide.' },
      },
    ],
  },
  {
    venueId: 'moda-viktor-levi',
    regionSlug: 'moda',
    primaryCategorySlug: 'date-mekanlari',
    culinaryIdentity: {
      tr: 'Asırlık Bozcaada ve Marmara bağcılığı geleneğinden gelen Viktor Levi Şarap Evi, Moda’daki ağaçlıklı gizli arka bahçesiyle İstanbul’un en köklü mahalle şarap bahçelerinden biri olarak konumlanır.',
      en: 'Rooted in a century-old Marmara and Bozcaada winemaking lineage, Viktor Levi Wine House anchors its Moda address around a quiet, tree-shaded interior courtyard garden.',
    },
    orderingGuide: {
      tr: 'Kendi üretimleri olan kırmızı veya beyaz şarapların yanına peynir ve füme et tabağı ile başlamak standarttır; akşam yemeği olarak devam etmek isteyenler için bademli tavuk, fırın somon veya keşkekli dana gibi tabaklar bulunur.',
      en: 'Pair house-bottled reds or whites with a cheese and charcuterie board, or step up to full dinner plates like almond-crusted chicken, baked salmon, or slow-braised beef over wheat keskek.',
    },
    microLocationContext: {
      tr: 'Moda Caddesi ile Damga Sokak arasında merkezi konumda, sokak gürültüsünden kopan geniş avlu bahçeye sahiptir. Yalnız oturmalı servis verir (paket yoktur) ve hafta sonu bahçe masaları önceden dolar.',
      en: 'Positioned centrally between Moda Caddesi and Damga Street yet shielded by its deep courtyard garden. Service is dine-in only, and weekend garden tables fill early via bookings.',
    },
    selectionComparison: {
      tr: 'Aynı kategorideki İtalyan restoranı Aida’ya göre daha çok bahçe sohbeti ve şarap odaklı bir atmosfer sunarken, WAYANA’daki modern tapas tarzı küçük tabak konseptinden tarihi şaraphane kimliğiyle ayrılır.',
      en: 'While WAYANA focuses on modern wine-bar tapas and Aida centers on indoor Italian dining, Viktor Levi stands out for its sprawling outdoor garden and heritage house wines.',
    },
    faqs: [
      {
        question: { tr: 'Viktor Levi’nin öne çıkan oturma alanı neresi?', en: 'What is the signature seating area at Viktor Levi?' },
        answer: { tr: 'Tarihi ön binanın arkasında gizlenen, ağaçlar altındaki geniş taş avlu bahçedir.', en: 'Its expansive stone courtyard garden shaded by trees behind the historic street-facing house.' },
      },
      {
        question: { tr: 'Şarap dışında tam akşam yemeği yenebilir mi?', en: 'Can visitors have a full dinner beyond wine and cheese?' },
        answer: { tr: 'Evet, bademli tavuk, fırın somon ve keşkekli dana gibi sıcak ana yemekler sunulur.', en: 'Yes, full dinner mains including baked salmon, almond chicken, and beef over keskek are served.' },
      },
      {
        question: { tr: 'Yalnız içki ve peynir tabağı almak mümkün mü?', en: 'Is it appropriate just for wine and a sharing board?' },
        answer: { tr: 'Evet, kendi üretimi kadeh veya şişe şarapların yanında peynir ve füme et tabağı çok tercih edilir.', en: 'Yes, house wines paired with cheese and charcuterie platters are a primary draw.' },
      },
    ],
  },
  {
    venueId: 'moda-guten-morgen',
    regionSlug: 'moda',
    primaryCategorySlug: 'kahvalti',
    culinaryIdentity: {
      tr: 'Fırıldak Sokak’ta kendi ekşi maya ekmeğini ve kavurduğu kahvesini aynı çatıda buluşturan Guten Morgen Coffee & Sourdough, klasik serpme formatı yerine tartine ve fırın tezgahı sabah kültürünü temsil eder.',
      en: 'Located on Firildak Street, Guten Morgen Coffee & Sourdough pairs in-house sourdough baking with specialty coffee in a streamlined tartine and bakery breakfast format.',
    },
    orderingGuide: {
      tr: 'Sabah açılışında avokadolu poşe yumurta tartine veya beyaz peynir-domatesli ekşi maya tost net bir tercih oluşturur; tezgah üstünden tarçınlı rulo (cinnamon roll) ve filtre kahveyle güne devam edilir.',
      en: 'Order the poached-egg avocado tartine or white cheese sourdough toast, and grab a cinnamon roll with filter coffee from the bakery counter afterward.',
    },
    microLocationContext: {
      tr: 'Caferağa içinde Moda Caddesi’ne paralel Fırıldak Sokak No:19’dadır. Hem sokak masaları hem gel-al fırın tezgahı çalıştırır; hafta sonu sabah saatlerinde dış ve iç masalarda kısa sıra beklenebilir.',
      en: 'Found at Firildak Sokak No:19 running parallel to Moda Caddesi. Offers indoor seating, sidewalk tables, and a walk-up bakery window; weekend mornings draw a queue.',
    },
    selectionComparison: {
      tr: 'Tabak ağırlıklı Rafine Moda, milföy hamurlu Happy Croissants ve sıcak pişi odaklı Pişi Mutfak ile karşılaştırıldığında Guten Morgen ekşi maya ekmek çeşitleri ve fırın-kahve dengesiyle yer alır.',
      en: 'Whereas Rafine focuses on plated cuisine, Happy Croissants on laminated pastry, and Pisi Mutfak on traditional fried dough, Guten Morgen anchors Moda’s sourdough tartine niche.',
    },
    faqs: [
      {
        question: { tr: 'Guten Morgen’de Türk serpme kahvaltısı var mı?', en: 'Does Guten Morgen serve a traditional multi-plate Turkish spread?' },
        answer: { tr: 'Hayır, ekşi maya tostlar, yumurtalı tartine tabakları, granola ve tarçınlı rulo gibi fırın ürünleri üzerine kuruludur.', en: 'No, it specializes in sourdough tartines, toasted sandwiches, granola bowls, and viennoiserie.' },
      },
      {
        question: { tr: 'Oturmadan fırından hamur işi ve kahve alınabilir mi?', en: 'Can customers grab pastry and coffee to go without waiting for a table?' },
        answer: { tr: 'Evet, gel-al fırın tezgahından ekmek, tarçınlı rulo ve kahve doğrudan alınabilir.', en: 'Yes, the walk-in bakery counter handles takeaway loaves, cinnamon rolls, and coffee.' },
      },
      {
        question: { tr: 'En yoğun saatleri ne zamandır?', en: 'When is the busiest window?' },
        answer: { tr: 'Hafta içi sabahları daha sakin akarken hafta sonu kahvaltı saatlerinde masa beklemek gerekebilir.', en: 'Weekday mornings stay calm, while Saturday and Sunday breakfast hours frequently fill all tables.' },
      },
    ],
  },
  {
    venueId: 'moda-basta',
    regionSlug: 'moda',
    primaryCategorySlug: 'denemelisin',
    culinaryIdentity: {
      tr: 'Sakız Sokak köşesindeki Basta Street Food Bar, Fransız şef tekniğini ve uzun pişirme yöntemlerini Türk sokak dürüm formatına uyarlayarak Moda ile Çarşı geçişinde özgün bir sokak yemeği standardı kurmuştur.',
      en: 'On Sakiz Street at the threshold between Moda and Carsi, Basta Street Food Bar channels French culinary training and slow-braising technique into modern Turkish street wraps.',
    },
    orderingGuide: {
      tr: 'Ağır ateşte pişen kuzu dürüm ve kaburga dürüm başrolü üstlenir; yanına humus eşlikçisi ve baharatlı kıymalı puf eklenebilir. Dürüm kadar ikonik olan yanık üstlü Basta usulü fırın sütlaç ise mutlaka ayrı porsiyon olarak denenmelidir.',
      en: 'Go for the slow-cooked lamb or beef rib wrap alongside creamy hummus, then finish with Basta’s caramelized baked rice pudding—a dish nearly as famous as the wraps themselves.',
    },
    microLocationContext: {
      tr: 'Caferağa Sakız Sokak No:1 adresinde yer alır. Yalnız sınırlı yüksek tabureler ve dükkan önü alanı bulunduğu için uzun oturmalı akşam yemeği değil, hızlı ayaküstü veya gel-al formatına uygundur; yoğun saatlerde kapıda sıra oluşur.',
      en: 'Located at Sakiz Sokak No:1. Designed for brisk counter stools and takeaway rather than lingering sit-down dinners, with frequent sidewalk queues during peak afternoon and evening hours.',
    },
    selectionComparison: {
      tr: 'Moda’nın gece kokoreç durağı Reks veya tatlı uzmanları Yaşar Usta / Moda da Nata arasında Basta modern şef mutfağı tekniğini sokak formatına indiren tek örnek olarak seçkidedir.',
      en: 'Among Moda’s must-try institutions like late-night Reks Kokorec or sweet specialists Yasar Usta and Moda da Nata, Basta stands out as Kadikoy’s chef-driven street wrap pioneer.',
    },
    faqs: [
      {
        question: { tr: 'Basta Street Food Bar’da geniş oturma alanı var mı?', en: 'Does Basta have comfortable sit-down dining space?' },
        answer: { tr: 'Hayır, çok sınırlı yüksek tabure ve dış alan sunar; ağırlıklı olarak hızlı yemek ve gel-al içindir.', en: 'No, seating is limited to a few high stools and street spots; it is designed for quick or takeaway eating.' },
      },
      {
        question: { tr: 'Dürüm dışında burayı özel kılan ürün hangisidir?', en: 'What signature item stands out beyond the wraps?' },
        answer: { tr: 'Yoğun kıvamı ve karamelize üstüyle ünlenen Basta usulü fırın sütlaç tek başına dahi sipariş edilir.', en: 'The dense, deeply caramelized house baked rice pudding (firin sutlac).' },
      },
      {
        question: { tr: 'Hangi et seçenekleri hazırlanıyor?', en: 'Which main wrap fillings are offered?' },
        answer: { tr: 'Uzun pişen kuzu ve kaburga dürümlerin yanında tavuk ve vejetaryen dürüm çeşitleri de bulunur.', en: 'Slow-cooked lamb and rib wraps sit alongside chicken and vegetarian options.' },
      },
    ],
  },
  {
    venueId: 'moda-yasar-usta',
    regionSlug: 'moda',
    primaryCategorySlug: 'denemelisin',
    culinaryIdentity: {
      tr: '1970’lerden gelen aile reçeteleriyle Bahariye–Moda girişinde hizmet veren Yaşar Usta’nın Sorbe ve Dondurması, sentetik aroma ve kıvam artırıcı kullanmadan mevsim meyvelerinden sorbe üreten köklü bir yazlık ritüeldir.',
      en: 'Carrying forward a family craft dating back to the 1970s near the Bahariye-Moda junction, Yasar Usta produces additive-free seasonal fruit sorbets and milk-based gelatos.',
    },
    orderingGuide: {
      tr: 'Karadut veya vişne sorbesini mevsime göre kavun-şeftali gibi taze meyveli çeşitlerle ya da tahinli-cevizli sütle aynı çıtır külahta dengelemek müdavimlerin alıştığı sıradır.',
      en: 'Pair bright black mulberry or sour cherry sorbet in the same crispy cone with seasonal melon/peach or roasted tahini-walnut dairy ice cream.',
    },
    microLocationContext: {
      tr: 'Caferağa General Asım Gündüz Caddesi No:92/A adresinde, Bahariye’den Moda’ya yürüyüş hattının başındadır. İçeride oturma salonu yoktur; pencereden gel-al veya sokak kenarında yürüyüş dondurması olarak tüketilir.',
      en: 'Positioned at General Asim Gunduz Caddesi No:92/A right where Bahariye transitions into Moda. There is no indoor seating—order at the window for a walking cone.',
    },
    selectionComparison: {
      tr: 'Portekiz tatlısı Moda da Nata ve butik el yapımı çikolata durağı Moda Çikolatacısı yanında Yaşar Usta yarım asırlık mevsim meyvesi sorbe uzmanlığıyla ayrılır.',
      en: 'Alongside Portuguese custard specialist Moda da Nata and handmade chocolatier Moda Cikolatacisi, Yasar Usta anchors Moda’s heritage seasonal sorbet tradition.',
    },
    faqs: [
      {
        question: { tr: 'Yaşar Usta’da içeride oturup servis alma imkanı var mı?', en: 'Is there indoor seating inside Yasar Usta?' },
        answer: { tr: 'Hayır, pencereden al-götür veya yürüyüş sırasında dondurma servisi esasına göre çalışır.', en: 'No, it serves exclusively from a street-front counter for walking cones and takeaway packs.' },
      },
      {
        question: { tr: 'Vegan veya süt içermeyen seçenekler mevcut mu?', en: 'Are dairy-free or fruit-only options available?' },
        answer: { tr: 'Evet, karadut, vişne, kavun ve şeftali gibi meyve sorbeleri gerçek mevsim meyvesiyle hazırlanır.', en: 'Yes, seasonal fruit sorbets such as black mulberry, sour cherry, melon, and peach are naturally dairy-free.' },
      },
      {
        question: { tr: 'Konumu Bahariye ve Moda yürüyüşüne nasıl bağlanır?', en: 'How does it fit into a Moda walk?' },
        answer: { tr: 'Bahariye Caddesi sonunda General Asım Gündüz Caddesi üzerinde Moda merkezine geçiş noktasıdır.', en: 'It sits directly on General Asim Gunduz Caddesi connecting Bahariye Street with central Moda.' },
      },
    ],
  },
  {
    venueId: 'carsi-cotti-cotti',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'pizza',
    culinaryIdentity: {
      tr: 'Osmanağa Söğütlüçeşme aksındaki Cotti Cotti Kadıköy, hafif sindirilebilir uzun fermente hamuru ve klasik İtalyan malzemelerini birleştiren bağımsız pizzacıdır.',
      en: 'Along Sogutlucesme Caddesi in Osmanaga, Cotti Cotti Kadikoy specializes in airy, long-fermented dough topped with classic and gourmet Italian ingredients.',
    },
    orderingGuide: {
      tr: 'Peynir severler için dört peynirli veya füme kaburgalı seçenekler ile klasik Margherita öne çıkar; paylaşımlık başlangıç olarak sıcak focaccia ve sarımsaklı zeytinyağı masayı açar.',
      en: 'Choose four-cheese or smoked-rib pizza alongside a classic Margherita, opening the table with hot focaccia and garlic olive oil.',
    },
    microLocationContext: {
      tr: 'Osmanağa Söğütlüçeşme Caddesi No:166 üzerinde, Altıyol Boğa Heykeli’ne birkaç dakikalık yürüme mesafesindedir. Hem oturmalı salon hem gel-al imkanı sunar; cadde yoğunluğu nedeniyle otopark bulunmaz.',
      en: 'At Sogutlucesme Caddesi No:166 minutes from the Altiyol Bull Statue. Both dine-in tables and takeaway are available, though street parking is virtually unavailable.',
    },
    selectionComparison: {
      tr: 'Tarihi Çarşı içinde hızlı İtalyan usulü Pizz’Italia ve sokak pizzacısı Il Pellicano’ya karşı Cotti Cotti Osmanağa yakasında oturmalı akşam pizzası adresi olarak ayrılır.',
      en: 'While Pizz’Italia and Il Pellicano sit deep inside the market alleys for fast casual pies, Cotti Cotti provides seated dining closer to the Altiyol transit hub.',
    },
    faqs: [
      {
        question: { tr: 'Cotti Cotti Kadıköy’e toplu taşımayla nasıl gidilir?', en: 'How is Cotti Cotti accessible by transit?' },
        answer: { tr: 'Altıyol ve Söğütlüçeşme aksı üzerinde olduğu için metrobüs, Marmaray ve Kadıköy tramvay duraklarına yakındır.', en: 'It sits along Sogutlucesme Caddesi within easy walking distance of Metrobus, Marmaray, and Kadikoy tram stops.' },
      },
      {
        question: { tr: 'Ön başlangıç olarak ne önerilir?', en: 'What starter works well before pizza?' },
        answer: { tr: 'Fırından taze çıkan focaccia ve sarımsaklı zeytinyağı paylaşım için uygun bir açılıştır.', en: 'Warm house focaccia served with garlic olive oil for sharing.' },
      },
      {
        question: { tr: 'Gel-al servis mümkün mü?', en: 'Can orders be picked up for takeaway?' },
        answer: { tr: 'Evet, salon oturmasının yanında gel-al sipariş imkanı da sağlanır.', en: 'Yes, both dine-in and pickup service are available.' },
      },
    ],
  },
  {
    venueId: 'carsi-musqa',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'hamburger',
    culinaryIdentity: {
      tr: 'Bahariye ve Serasker Sokak arasındaki Musqa Burger, el yapımı patates ekmeği ve yüksek ısıda dışı karamelize edilirken içi sulu bırakılan et köfteleriyle Osmanağa’nın öne çıkan butik burgercisidir.',
      en: 'Between Bahariye and Serasker Street in Osmanaga, Musqa Burger crafts house-made potato buns paired with high-heat seared beef patties.',
    },
    orderingGuide: {
      tr: 'Musqa Signature Burger ve Double Cheddar Smash iki temel ekseni oluşturur; ayrı porsiyon halinde cheddarlı çıtır tavuk strips veya trüflü patates masada sık paylaşılır.',
      en: 'Focus on the Musqa Signature Burger or Double Cheddar Smash, and add cheddar crispy chicken strips or truffle fries as separate shareable sides.',
    },
    microLocationContext: {
      tr: 'Osmanağa Serasker Caddesi No:90A adresinde Bahariye’ye paralel konumlanır. Küçük iç oturma alanına ek olarak hızlı paket ve gel-al düzeni işler; yoğun akşam saatlerinde ayakta sıra beklenebilir.',
      en: 'Located at Serasker Caddesi No:90A parallel to Bahariye. Features a tight indoor room tuned for quick turnover and takeaway; evening peaks can bring standing waits.',
    },
    selectionComparison: {
      tr: 'Kızarmış tavuk odaklı Salt Fried Chicken Kadıköy ve klasik sokak burgeri ATM Burger yanında Musqa ev yapımı patates ekmeği ve smash tekniğiyle ayrılır.',
      en: 'Next to fried-chicken specialist Salt Fried Chicken and longtime staple ATM Burger, Musqa sets itself apart with homemade potato buns and crisp smash searing.',
    },
    faqs: [
      {
        question: { tr: 'Musqa Burger ekmeği hazır mı yoksa kendi yapımı mı?', en: 'What kind of bun does Musqa Burger use?' },
        answer: { tr: 'Yumuşak dokulu ve burger suyunu tutan el yapımı patates ekmeği kullanılmaktadır.', en: 'Soft house-made potato buns crafted to hold juicy seared patties.' },
      },
      {
        question: { tr: 'Tavuk severler için alternatif bulunuyor mu?', en: 'Is there a chicken option on the menu?' },
        answer: { tr: 'Evet, burgerin yanında veya ayrı atıştırmalık olarak cheddarlı çıtır tavuk strips sipariş edilebilir.', en: 'Yes, cheddar crispy chicken strips can be ordered alongside or instead of beef.' },
      },
      {
        question: { tr: 'Kalabalık saatlerde bekleme olur mu?', en: 'Does it get crowded in the evening?' },
        answer: { tr: 'Mekan iç hacmi küçük olduğu için akşam saatlerinde kısa bekleme ve yüksek al-götür temposu görülür.', en: 'Because the dining space is compact, peak dinner hours often involve short waits.' },
      },
    ],
  },
  {
    venueId: 'carsi-malavita',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'kahve',
    culinaryIdentity: {
      tr: 'Bahariye’nin Piri Çavuş Sokağı içinde yıllardır çizgisini koruyan Malavita Coffee Shop, ana cadde gürültüsünden bir adım geride temiz espresso ve filtre demlemeleri sunan mahalle kahvecisidir.',
      en: 'Stepping back one block from bustling Bahariye into Piri Cavus Street, Malavita Coffee Shop delivers balanced espresso and pour-over brews beneath quiet street trees.',
    },
    orderingGuide: {
      tr: 'Flat White, V60 filtre kahve ve Cortado barın en istikrarlı tercihleridir; sabah ya da öğle arasında limonlu ev yapımı kek veya pesto mozzarella sandviç tamamlayıcıdır.',
      en: 'Order a Flat White, V60 filter, or Cortado, and pair morning or afternoon breaks with homemade lemon cake or a pesto mozzarella sandwich.',
    },
    microLocationContext: {
      tr: 'Osmanağa Piri Çavuş Sokak No:32 adresinde Süreyya Operası’na birkaç dakikalık yürüme mesafesindedir. İç masaların yanında ağaç altı sokak oturma düzeni bulunur; gölgelik dış masalar gün içinde erken dolabilir.',
      en: 'Set at Piri Cavus Sokak No:32 a couple of minutes from Sureyya Opera House. Tree-shaded sidewalk tables outside fill early as locals look to escape Bahariye crowds.',
    },
    selectionComparison: {
      tr: 'Tarihi Türk kahvesi kurumu Fazıl Bey ve bahçeli Archa arasında Malavita sakin sokakta gündelik üçüncü dalga kahve sohbeti arayanlara hitap eder.',
      en: 'Unlike heritage Turkish-coffee anchor Fazil Bey or garden cafe Archa, Malavita specializes in unhurried third-wave street coffee tucked behind Bahariye.',
    },
    faqs: [
      {
        question: { tr: 'Malavita Coffee Shop Bahariye kalabalığından uzak mı?', en: 'Is Malavita quieter than main Bahariye Avenue?' },
        answer: { tr: 'Evet, paralel ara sokakta yer aldığı için ana cadde trafiğinden uzak, sakin bir akışı vardır.', en: 'Yes, its side-street position shelters it from the pedestrian bustle of Bahariye.' },
      },
      {
        question: { tr: 'Kahve yanına tatlı mı tuzlu mu daha çok tercih ediliyor?', en: 'What food pairings are popular with coffee?' },
        answer: { tr: 'Ev yapımı limonlu kek ve pesto mozzarella sandviç en sık istenen günlük eşlikçilerdir.', en: 'Homemade lemon cake and pesto mozzarella sandwiches are both daily favorites.' },
      },
      {
        question: { tr: 'Dış mekanda oturma alanı mevcut mu?', en: 'Does it offer outdoor seating?' },
        answer: { tr: 'Evet, ağaç altındaki sokak masaları en çok rağbet gören oturma alanıdır.', en: 'Yes, shaded street tables under the trees are its signature seats.' },
      },
    ],
  },
  {
    venueId: 'carsi-fazil-bey',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'kahve',
    culinaryIdentity: {
      tr: '1923 yılında kurulan Fazıl Bey’in Türk Kahvesi, Kadıköy Tarihi Çarşı’sında kendi öğütücü taş değirmenleriyle çektiği taze çekirdekten geleneksel ve damla sakızlı Türk kahvesi pişiren bir kültür mirasıdır.',
      en: 'Founded in 1923 inside Kadikoy’s historic market, Fazil Bey’s Turkish Coffee grinds fresh beans in-house to brew classic, mastic, and cardamom-spiced Turkish coffee.',
    },
    orderingGuide: {
      tr: 'İlk kez uğrayanlar için damla sakızlı veya geleneksel bol köpüklü Türk kahvesi, alternatif aroma arayanlar için kakuleli fincan öne çıkar. İkram çifte kavrulmuş lokumun yanı sıra tezgah önünden eve taze çekilmiş kahve paketi alınabilir.',
      en: 'Order the mastic or classic frothy Turkish coffee—or opt for aromatic cardamom—always accompanied by double-roasted Turkish delight; freshly ground take-home packs are ground to order.',
    },
    microLocationContext: {
      tr: 'Caferağa Serasker Caddesi No:1/A girişinde, Kadıköy İskele’ye birkaç dakikalık yürüme mesafesindedir. Ekonomik bütçe segmentinde yer alır; sokak masaları hafta sonları tamamen dolabildiğinden kısa bekleme yaşanabilir.',
      en: 'Located at Serasker Caddesi No:1/A minutes from Kadikoy Pier. Pricing sits in the budget-friendly tier, and weekend afternoon sidewalk tables regularly fill with shoppers and locals.',
    },
    selectionComparison: {
      tr: 'Aynı listedeki üçüncü dalga espresso barları Malavita, Gua ve Unique yanında Fazıl Bey Kadıköy Çarşısı’ndaki asırlık Türk kahvesi deneyiminin ana adresidir.',
      en: 'While Malavita, Gua, and Unique cover modern espresso and pour-over, Fazil Bey anchors the century-old traditional Turkish coffee heritage of Kadikoy Market.',
    },
    faqs: [
      {
        question: { tr: 'Fazıl Bey’den eve götürmelik çekilmiş kahve alınabilir mi?', en: 'Can guests buy freshly ground coffee beans for home?' },
        answer: { tr: 'Evet, dükkân girişindeki tezgâhtan Türk kahvesi olarak taze çekilmiş paketler satışa sunulur.', en: 'Yes, freshly ground Turkish coffee bags are sold directly from the front counter.' },
      },
      {
        question: { tr: 'Klasik sade dışında hangi aromalı çeşitler var?', en: 'What varieties exist beyond plain Turkish coffee?' },
        answer: { tr: 'Damla sakızlı ve kakuleli Türk kahvesi çeşitleri düzenli olarak pişirilmektedir.', en: 'Mastic-resin and cardamom Turkish coffee are signature menu options alongside classic roasts.' },
      },
      {
        question: { tr: 'Bütçe düzeyi nasıldır?', en: 'How are prices positioned?' },
        answer: { tr: 'Ekonomik bütçe düzeyinde yer alır ve kahve yanında lokum ikramıyla servis edilir.', en: 'It stays in the budget-friendly tier, served traditionally with Turkish delight.' },
      },
    ],
  },
  {
    venueId: 'carsi-ala-meyhane',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'date-mekanlari',
    culinaryIdentity: {
      tr: 'Kadıköy Tarihi Çarşı içinde Güneşlibahçe aksında konumlanan Ala Kadıköy Meyhane, klasik meyhane mezelerini özenli tabaklama, sıcak aydınlatma ve sohbete alan açan müzik düzeyiyle sunan modern akşam buluşma mekânıdır.',
      en: 'Set inside Kadikoy’s historic market district near Guneslibahce Street, Ala Kadikoy Meyhane reinterprets classic meze dining with composed plates, warm lighting, and conversation-friendly acoustics.',
    },
    orderingGuide: {
      tr: 'Topik, fava ve Girit ezmesi gibi soğuk mezelerin yanına lakerda veya deniz börülcesi eklenebilir; sıcaklarda ızgara ahtapot ve yaprak ciğer öne çıkar. Kapanışta masaya paylaşılan tahinli helva sufle gelenekselleşmiş bir tatlıdır.',
      en: 'Begin with cold mezze staples like topik, fava, Cretan herb dip, and cured bonito (lakerda), followed by hot grilled octopus or seared liver and warm tahini halva soufflé.',
    },
    microLocationContext: {
      tr: 'Caferağa Yasa Caddesi No:58/A çevresinde Kadıköy İskele, Vapur ve Metro duraklarına birkaç adım uzaklıktadır. Rezervasyonlu tam masa servisi uygulanır; çarşı içinde otopark mümkün değildir ve bütçe seviyesi yüksektir.',
      en: 'Steps from Kadikoy Pier and the metro at Yasa Caddesi No:58/A. Operates by reservation for full table service; car access inside the market alleys is absent and pricing sits in the higher tier.',
    },
    selectionComparison: {
      tr: 'Şarap odaklı Porta Rossa ve Bordo Şaraphane ile köklü meyhane Güneşin Sofrası arasında Ala Kadıköy modern meze sofrası ve dengeli akustik arayan akşam buluşmaları için seçilmiştir.',
      en: 'Set alongside wine bars Porta Rossa and Bordo and traditional tavern Gunesin Sofrasi, Ala Kadikoy excels for curated modern meze dinners with controlled acoustic levels.',
    },
    faqs: [
      {
        question: { tr: 'Ala Kadıköy Meyhane’de müzik gürültüsü sohbete engel olur mu?', en: 'Is the music too loud for conversation?' },
        answer: { tr: 'Hayır, müzik seviyesi akşam yemeklerinde masa sohbetini boğmayacak dengede tutulur.', en: 'No, acoustic levels are kept balanced specifically so dinner conversation remains comfortable.' },
      },
      {
        question: { tr: 'Özel araçla gelmek uygun mu?', en: 'Is parking available nearby?' },
        answer: { tr: 'Tarihi Çarşı yaya bölgesinde bulunduğu için vapur, metro veya tramvayla gelmek çok daha rahattır.', en: 'Since it sits inside pedestrian market streets, arriving by ferry, metro, or tram is far simpler than driving.' },
      },
      {
        question: { tr: 'Tatlı kapanışı için öne çıkan tabak nedir?', en: 'Which dessert completes the meze dinner?' },
        answer: { tr: 'Meyveli dondurma ile sunulan sıcak tahinli helva sufle en sık paylaşılan tatlıdır.', en: 'Warm tahini halva soufflé served with fruit ice cream.' },
      },
    ],
  },
  {
    venueId: 'carsi-morn',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'kahvalti',
    culinaryIdentity: {
      tr: 'Yoğurtçu Parkı Caddesi’nde yer alan Morn Kadıköy, taze bagel çeşitleri, brioche ekmekler ve ekşi maya bazlı modern brunch tabaklarını dengeli kahve programıyla birleştiren ferah bir sabah durağıdır.',
      en: 'Located along Yogurtcu Parki Avenue, Morn Kadikoy pairs house-baked bagels, brioche dishes, and sourdough brunch plates with a structured coffee bar.',
    },
    orderingGuide: {
      tr: 'Tuzlu tarafta somonlu veya baconlı bagel ve brioche ekmekte çırpılmış yumurta; tatlı tarafta ise portakallı kakuleli tart ile iced matcha kombini sıkça tercih edilir.',
      en: 'For savory plates choose the smoked salmon or bacon bagel and soft-scrambled eggs on brioche; follow with orange-cardamom tart and an iced matcha.',
    },
    microLocationContext: {
      tr: 'Osmanağa Yoğurtçu Parkı Caddesi No:62/A üzerinde sahil parkı ve Bahariye aksına yürüme mesafesindedir. Geniş iç salon ve dış masaları dinamik bir brunch ortamı sunar; hafta sonu öğle öncesi bekleme listesi oluşabilir.',
      en: 'Positioned at Yogurtcu Parki Caddesi No:62/A near the coastal park and Bahariye. Offers an airy indoor room and sidewalk tables, though weekend late-morning waits are common.',
    },
    selectionComparison: {
      tr: 'Kruvasan odaklı Brekkie ve unlu mamül tezgahlı Lil Bake / Pikta ile kıyaslandığında Morn özellikle bagel tabakları ve ferah Yoğurtçu Parkı salonuyla öne çıkar.',
      en: 'Alongside croissant hub Brekkie and bakery-driven Lil Bake and Pikta, Morn fills Kadikoy’s dedicated bagel and plated-brunch niche.',
    },
    faqs: [
      {
        question: { tr: 'Morn Kadıköy’de hafta sonu masa bulmak zor mu?', en: 'Should guests expect weekend waitlists at Morn?' },
        answer: { tr: 'Evet, hafta sonu brunch saatlerinde yoğun ilgi nedeniyle kısa bekleme listesi açılabilmektedir.', en: 'Yes, peak weekend brunch hours frequently run a short waitlist.' },
      },
      {
        question: { tr: 'Bagel dışında kahvaltı alternatifleri neler?', en: 'What options exist besides bagels?' },
        answer: { tr: 'Brioche üzerinde yumurta tabakları, shakshuka, yulaf kasesi ve pancake seçenekleri bulunur.', en: 'Brioche egg plates, shakshuka, oat bowls, and pancakes.' },
      },
      {
        question: { tr: 'Çalışan veya yürüyüş sonrası uğrayanlar için konumu nasıl?', en: 'How is its location relative to Moda and the waterfront?' },
        answer: { tr: 'Yoğurtçu Parkı sahil yürüyüş yolunun hemen karşısında, Moda ve Altıyol’a yürüme mesafesindedir.', en: 'Directly facing Yogurtcu Park by the waterfront within an easy walk of both Moda and Altiyol.' },
      },
    ],
  },
  {
    venueId: 'carsi-ciya-sofrasi',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'denemelisin',
    culinaryIdentity: {
      tr: 'Şef Musa Dağdeviren’in Güneşlibahçe Sokak’ta kurduğu Çiya Sofrası, Anadolu ve Mezopotamya’nın unutulmaya yüz tutmuş yöresel tencere yemeklerini, meyveli ekşili kebaplarını ve mevsimsel ot kavurmalarını belgeleyen simge bir mutfak kurumudur.',
      en: 'Led by chef Musa Dagdeviren on Guneslibahce Street, Ciya Sofrasi is a landmark culinary institution preserving disappearing Anatolian and Mesopotamian home-style stews, fruit-infused kebabs, and regional wild-herb dishes.',
    },
    orderingGuide: {
      tr: 'Menü her gün tezgâhtaki taze tencere yemeklerine göre şekillenir: kuzu incikli analı kızlı, nar ekşili veya erikli kebap, perde pilavı ve mevsim salataları birer küçük porsiyonla denenebilir. Kapanışta mutlaka tatlı tezgâhından cevizli kireçte kabak tatlısı ve demirhindi şerbeti eklenmelidir.',
      en: 'Build a multi-dish tasting from the daily stew counter—lamb-shank anali kizli soup, pomegranate or plum kebabs, perde pilavi, and regional herb salads—and conclude with lime-cured crisp pumpkin dessert in walnuts and house tamarind sherbet.',
    },
    microLocationContext: {
      tr: 'Kadıköy Balık Pazarı içinde Güneşlibahçe Sokak’ta Vapur İskelesi’ne birkaç dakikalık yürüme mesafesindedir. İki katlı iç salonu ve sokak masaları gün boyu hem yerel müdavimler hem gastronomi meraklılarıyla doludur.',
      en: 'Located inside Kadikoy Fish Market on Guneslibahce Street, minutes from the ferry pier. Multi-floor indoor rooms and market-street seating stay busy from lunch through dinner.',
    },
    selectionComparison: {
      tr: 'Aynı listedeki asırlık Rumeli-Osmanlı lokantası Yanyalı Fehmi ile birlikte Kadıköy Çarşı mutfağının iki ana tarihsel direğinden biridir; Çiya özellikle Güneydoğu/Anadolu yöresel arşivine odaklanır.',
      en: 'Paired with century-old Rumeli/Ottoman kitchen Yanyali Fehmi, Ciya Sofrasi represents the Anatolian and Southeastern culinary archive of Kadikoy Market.',
    },
    faqs: [
      {
        question: { tr: 'Çiya Sofrası’nda yemekler nasıl seçiliyor?', en: 'How does ordering work at Ciya Sofrasi?' },
        answer: { tr: 'Günlük pişen sıcak tencere yemekleri ve zeytinyağlılar doğrudan açık tezgâhtan görülüp istenen porsiyonda tabağa seçilebilir.', en: 'Daily stews and cold regional dishes can be viewed directly at the serving counter and ordered in tasting portions alongside menu classics.' },
      },
      {
        question: { tr: 'Tatlı ve içecek olarak ne öne çıkıyor?', en: 'What traditional desserts and drinks are available?' },
        answer: { tr: 'Kireçte bekletilmiş çıtır Antakya usulü kabak/patlıcan tatlıları ve demirhindi gibi Osmanlı şerbetleri ünlüdür.', en: 'Crisp Antakya-style lime-cured pumpkin, walnut, and eggplant preserves paired with traditional tamarind sherbet.' },
      },
      {
        question: { tr: 'Günün hangi saatinde yoğunluk olur?', en: 'When does it experience the heaviest queues?' },
        answer: { tr: 'Öğle yemeği ve hafta sonu akşam saatlerinde hem masalarda hem tencere tezgâhında bekleme yaşanabilir.', en: 'Weekday lunches and weekend afternoons/evenings often involve queues both for tables and at the stew counter.' },
      },
    ],
  },
  {
    venueId: 'carsi-baylan',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'denemelisin',
    culinaryIdentity: {
      tr: '1923 temelli Baylan Pastanesi’nin Kadıköy Muvakkıthane Caddesi’ndeki tarihi şubesi, dondurma-karamel-krokan-şanti katmanlarından oluşan imza tatlısı Kup Griye’nin yaratıldığı ve İstanbul pastane hafızasını yaşatan asırlık bir kurumdur.',
      en: 'Continuing the 1923 Baylan heritage on Muvakkithane Avenue, Baylan Kadikoy is the birthplace of the iconic Kup Griye dessert and one of Istanbul’s enduring historic patisserie institutions.',
    },
    orderingGuide: {
      tr: 'İlk ziyaret için klasik kadehte Kup Griye veya nostaljik Adisebaba / Rokoko pasta seçimi temel adımı oluşturur; vitrinden Mont Blanc, kestane şekeri ya da sıcak tuzlu kruvasan ve paskalya çöreği eşleştirilebilir.',
      en: 'Start with the original Kup Griye sundae or vintage Adisebaba and Rokoko cakes, or pair afternoon tea and coffee with chestnut Mont Blanc, candied chestnuts, or savory croissants.',
    },
    microLocationContext: {
      tr: 'Caferağa Muvakkıthane Caddesi No:9A adresinde Kadıköy İskele’ye birkaç adım mesafededir. Beyaz masa örtülü nostaljik salonu ve arka avlusu hızlı self-servis kafeler yerine klasik pastane servisi akışında işler.',
      en: 'Situated at Muvakkithane Caddesi No:9A steps from Kadikoy Pier. Its white-tablecloth parlor and sheltered courtyard garden preserve classic seated patisserie service rather than brisk takeaway flow.',
    },
    selectionComparison: {
      tr: 'Aynı listedeki Şekerci Cafer Erol şekerleme-lokum geleneğini temsil ederken, Baylan masa servisli tarihi pasta ve Kup Griye salonu kimliğiyle ayrılır.',
      en: 'While nearby Cafer Erol focuses on historic confectionery and Turkish delight, Baylan anchors Kadikoy’s seated European-Istanbul patisserie cafe tradition.',
    },
    faqs: [
      {
        question: { tr: 'Baylan Kadıköy’de dış bahçe veya avlu var mı?', en: 'Does Baylan Kadikoy have outdoor seating?' },
        answer: { tr: 'Evet, iç pastane salonunun arkasında sakin bir avlu bahçesi bulunur; hafta sonu doluluk oranı yüksektir.', en: 'Yes, a sheltered back courtyard garden sits behind the classic interior dining parlor.' },
      },
      {
        question: { tr: 'Kup Griye içeriğinde neler yer alır?', en: 'What is inside Baylan’s famous Kup Griye?' },
        answer: { tr: 'Vanilya ve karamel dondurma, şanti, karamel sos ve bademli krokan dokusundan oluşur.', en: 'Layers of vanilla and caramel ice cream, whipped cream, caramel sauce, and crunchy almond croquant.' },
      },
      {
        question: { tr: 'Pastaneden kutulu paket tatlı alınabilir mi?', en: 'Can boxed pastries and chocolates be purchased to go?' },
        answer: { tr: 'Evet, girişteki tezgâhtan trüf çikolata, kestane şekeri ve pastalar kutulanarak alınabilir.', en: 'Yes, the front counter packages truffles, candied chestnuts, and whole or sliced cakes for takeaway.' },
      },
    ],
  },
  {
    venueId: 'carsi-yanyali-fehmi',
    regionSlug: 'kadikoy',
    primaryCategorySlug: 'denemelisin',
    culinaryIdentity: {
      tr: '1919’dan bu yana Kadıköy Çarşı’sında ocak ve tencere başında hizmet veren Yanyalı Fehmi Lokantası, Rumeli ve Osmanlı mutfak repertuarını yaşatan İstanbul’un en köklü esnaf lokantalarından biridir.',
      en: 'Serving in Kadikoy Market since 1919, Yanyali Fehmi Lokantasi is a century-old esnaf lokantasi preserving Rumeli and Ottoman home-style stews and roasted meat classics.',
    },
    orderingGuide: {
      tr: 'İnce patlıcan dilimlerine sarılı meşhur Yanya köftesi, elbasan tava ve hünkar beğendi lokantanın temel üçlüsüdür; yanında zeytinyağlı enginar veya kereviz, tatlı kapanışta ise tezgâhtan fırın sütlaç ve kaymaklı kemalpaşa seçilir.',
      en: 'Pair the eggplant-wrapped Yanya Meatballs with Elbasan Tava or Hunkar Begendi, add olive-oil braised artichokes, and close with baked rice pudding or clotted-cream kemalpasa.',
    },
    microLocationContext: {
      tr: 'Osmanağa Yağlıkçı İsmail Sokak No:1 adresinde, İskele ile Altıyol yürüyüş yolunun ortasındadır. İki katlı geleneksel salonunda öğle vakitleri hızlı ve yoğun esnaf lokantası temposu yaşanır; bazı tencere çeşitleri akşam saatlerinde erken tükenebilir.',
      en: 'Located at Yaglikci Ismail Sokak No:1 midway between Kadikoy Pier and Altiyol. Its two-story hall draws a lively midday crowd, and popular stews can sell out later in the evening.',
    },
    selectionComparison: {
      tr: 'Tarihi Çarşı içinde yöresel Anadolu mutfağını temsil eden Çiya Sofrası ve döner odaklı Tatar Salim yanında Yanyalı Fehmi klasik Osmanlı-Rumeli esnaf lokantası çizgisini korur.',
      en: 'Alongside Çiya Sofrasi’s Anatolian archive and Tatar Salim’s dedicated doner, Yanyali Fehmi anchors Kadikoy’s classic Ottoman-Rumeli esnaf lokantasi tradition.',
    },
    faqs: [
      {
        question: { tr: 'Yanyalı Fehmi Lokantası’nda tüm çeşitleri bulmak için ne zaman gitmek daha uygun?', en: 'When is the best window to find the full stew selection?' },
        answer: { tr: 'Tencere çeşitlerinin tamamını görebilmek için öğle yemeği saatleri ve erken akşam saatleri akşam geç vaktinden daha avantajlıdır.', en: 'Midday lunch and early evening hours offer the broadest variety before popular trays run low late at night.' },
      },
      {
        question: { tr: 'En meşhur imza yemeği hangisidir?', en: 'Which dish is Yanyali Fehmi best known for?' },
        answer: { tr: 'Kızartılmış ince patlıcan şeritlerine sarılı Yanya köftesi ve yoğurt soslu elbasan tava mekanla özdeşleşmiştir.', en: 'Yanya meatballs wrapped in tender eggplant slices alongside baked yogurt Elbasan Tava.' },
      },
      {
        question: { tr: 'Yemek sonrası hangi tatlılar önerilir?', en: 'Which classic desserts are served at the counter?' },
        answer: { tr: 'Geleneksel fırın sütlaç ve kaymaklı kemalpaşa tatlısı esnaf yemeğinin klasik kapanışıdır.', en: 'Traditional oven-baked sutlac (rice pudding) and kemalpasa dessert with clotted cream.' },
      },
    ],
  },
];

const PILOT_EDITORIAL_BY_ID = new Map(PILOT_EDITORIAL_LIST.map((p) => [p.venueId, p]));

export const PILOT_VENUE_IDS: readonly string[] = PILOT_EDITORIAL_LIST.map((p) => p.venueId);

export function isEligibleGeoPilotVenue(venueId: string): boolean {
  return PILOT_EDITORIAL_BY_ID.has(venueId);
}

export function getPilotEditorial(venueId: string): GeoPilotEditorialContent | null {
  return PILOT_EDITORIAL_BY_ID.get(venueId) || null;
}

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const x =
    sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return Math.round(2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}

export async function resolveGeoPilotVenue(venueId: string): Promise<ResolvedGeoPilotVenue | null> {
  const editorial = getPilotEditorial(venueId);
  if (!editorial) return null;

  const location = V3_LOCATIONS.find((l) => l.slug === editorial.regionSlug);
  const snapshot = getPublishedV3Snapshot(editorial.regionSlug);
  const payload = await getStaticRegionVenuePayload(editorial.regionSlug);
  if (!location || !snapshot || !payload) return null;

  const visitorVenue = payload.venues.find((v) => v.id === venueId);
  const snapshotVenue = snapshot.venues.find((v) => v.id === venueId);
  if (!visitorVenue || !snapshotVenue) return null;

  const primaryCat =
    payload.categories.find((c) => c.slug === editorial.primaryCategorySlug) ||
    payload.categories.find((c) => visitorVenue.categorySlugs.includes(c.slug));

  const catSlugByVenueId = new Map<string, string>();
  const catLabelByVenueId = new Map<string, string>();
  for (const v of payload.venues) {
    const slug = v.categorySlugs[0] || 'denemelisin';
    catSlugByVenueId.set(v.id, slug);
    catLabelByVenueId.set(v.id, v.categoryName);
  }

  const centerCoord = snapshotVenue.coordinates;
  const walkableStops: WalkableNeighborStop[] = centerCoord
    ? snapshot.venues
        .filter((other) => other.id !== snapshotVenue.id && Boolean(other.coordinates))
        .map((other) => ({
          id: other.id,
          name: other.name,
          categoryLabel: catLabelByVenueId.get(other.id) || other.categoryId,
          categorySlug: catSlugByVenueId.get(other.id) || other.categoryId,
          neighborhood: other.neighborhood,
          distanceMeters: haversineMeters(centerCoord, other.coordinates!),
          isPilotVenue: isEligibleGeoPilotVenue(other.id),
          mapsUri: other.mapsUri,
        }))
        .filter((item) => item.distanceMeters <= 450)
        .sort((a, b) => a.distanceMeters - b.distanceMeters || Number(b.isPilotVenue) - Number(a.isPilotVenue))
        .slice(0, 6)
    : [];

  return {
    venueId,
    regionSlug: editorial.regionSlug,
    location,
    visitorVenue,
    snapshotVenue,
    primaryCategorySlug: primaryCat?.slug || editorial.primaryCategorySlug,
    primaryCategoryLabel: primaryCat?.title || visitorVenue.categoryName,
    editorial,
    walkableStops,
    regionVerifiedAt: snapshot.verifiedAt,
  };
}
