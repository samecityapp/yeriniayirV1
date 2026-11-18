import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_FETHIYE_YANIKLAR_DEF: V3RegionDefinition = {
  id: 'yaniklar-fethiye-mugla',
  slug: 'yaniklar',
  city: 'Muğla',
  district: 'Fethiye',
  allowedDistricts: ['Fethiye'],
  neighborhood: 'Yanıklar',
  officialQuarter: 'Yanıklar Mahallesi (Karaot Plajı, Akgöl, Sığla Ormanı & Katrancı Koyu)',
  displayName: 'Yanıklar, Fethiye, Muğla',
  locative: "Yanıklar'da",
  path: ['mugla', 'fethiye', 'yaniklar'],
  aliases: [
    'Yanıklar',
    'Yaniklar',
    'Yanıklar Fethiye',
    'Yanıklar Köyü',
    'Karaot Plajı',
    'Karaot',
    'Akgöl Yanıklar',
    'Katrancı Koyu',
    'Katranci',
    'Pastoral Vadi',
  ],
  scopeNote: 'Yanıklar Köyü, Sığla Ormanı, Karaot Plajı, Akgöl & Katrancı Koyu Hattı · Doğrulanmış Seçki',
  characterSubtitle:
    'Sığla ormanı, narenciye bahçeleri, Karaot-Akgöl-Katrancı kıyı dokusu ve köy içi serpme kahvaltı ile yöresel mola durakları.',
  center: { lat: 36.705, lng: 29.055 },
  bbox: {
    minLat: 36.685,
    maxLat: 36.752,
    minLng: 29.028,
    maxLng: 29.075,
  },
  allowedNeighborhoodTokens: ['Yanıklar', 'Yaniklar', 'Karaot', 'Katrancı', 'Katranci', 'Akgöl', 'Akgol'],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    compactSeed({
      id: 'yaniklar-tabiat-ana',
      placeId: 'ChIJ2Wj-S_dDwBQRy28daNSt9XE',
      cat: 'kahvalti',
      name: 'Tabiat Ana Kahvaltı Bahçesi',
      brand: 'Tabiat Ana',
      area: 'Sağlık Sk., Yanıklar',
      signals: ['family_garden_breakfast', 'homemade_dairy_preserves', 'creekside_pergolas'],
      desc:
        'Yanıklar Sağlık Sokak üzerinde portakal ağaçları ve su kenarı çardaklar altında serpme köy kahvaltısı sunan köklü aile bahçesi.',
      order: ['Serpme köy kahvaltısı', 'Tereyağlı sıcak bazlama', 'Sahanda köy yumurtası'],
      menu: ['Serpme köy kahvaltısı', 'Bazlama', 'Ev yoğurdu', 'Gözleme', 'Mevsim reçelleri'],
      sec: [
        [
          'Ev yapımı reçeller ve köy tereyağı',
          'Mevsim meyvelerinden hazırlanan katkısız reçeller ile ev yapımı tereyağı ve yoğurt serpme sofranın temel eşlikçisidir.',
          'Yemek.com & Eniyikahvalti incelemeleri',
        ],
        [
          'El açması gözleme ve pişi',
          'Sıcak servis edilen hamur işleri kalabalık aile sofralarında kahvaltıya sıklıkla ekleniyor.',
          'Wanderlog & Restaurant Guru derlemeleri',
        ],
      ],
      seat: 'Portakal ve çam ağaçları altında dere kenarı çardaklar ve geniş açık bahçe oturumu',
      crowd: 'Sabah saatlerinde aile ve çocuklu gruplarla canlı; hafta sonu ve yaz sezonunda yoğunluk artıyor',
      dis: 'Yaz dönemi ve hafta sonlarında masa bulmak zorlaşabiliyor; dar köy sokağında otopark alanı çabuk doluyor',
      transit:
        'Fethiye merkezden Yanıklar yönüne giden dolmuşlarla ana yoldan inip Sağlık Sokak içine yürünebilir; özel araçla erişim daha rahat',
      sources: [
        [
          'Yemek.com Fethiye Kahvaltı Rehberi',
          'https://yemek.com/',
          'editorial',
          'Yanıklar bahçe kahvaltısı seçkisinde bahçe sebzeleri, ev yoğurdu, özel tereyağı ve serpme köy kahvaltısıyla öne çıkarılıyor.',
        ],
        [
          'Wanderlog Fethiye Kahvaltı & Brunch Listesi',
          'https://wanderlog.com/',
          'community',
          'Yeşil bahçe içinde aile işletmesi olarak sunduğu ev yapımı serpme kahvaltı ile yüksek değerlendirme alıyor.',
        ],
        [
          'Instagram (@tabiatanakahvalti)',
          'https://www.instagram.com/tabiatanakahvalti/',
          'operator',
          'Sağlık Sokak No:100A bahçe çardakları, kahvaltı sofrası ve sezon paylaşımları.',
        ],
        [
          'Google Maps Kaydı (Tabiat Ana Kahvaltı Bahçesi)',
          'https://maps.google.com/?cid=8211660623371399115',
          'maps',
          'Yanıklar Sağlık Sokak 100A konumu ve canlı operasyonel durum doğrulaması.',
        ],
      ],
      pros: [
        'Dere kenarı çardaklar ve portakal ağaçları altında ferah aile bahçesi ortamı',
        'Ev yapımı tereyağı, yoğurt, reçeller ve sıcak bazlamayla dengeli köy kahvaltısı',
      ],
      cons: [
        'Hafta sonları ve yüksek yaz sezonunda kalabalık ve yer bekleme riski',
        'Köy içi dar yolda araç park alanı yoğun saatlerde kısıtlı kalabiliyor',
      ],
      unc: ['Kış ve ara sezonlarda açık/kapalı alan çalışma günleri mevsime göre değişebiliyor.'],
    }),

    compactSeed({
      id: 'yaniklar-avocado-garden',
      placeId: 'ChIJmxVjXrRDwBQRpJalfIxIcsk',
      cat: 'kahvalti',
      brand: 'Avocado Garden',
      area: 'Esenli Sk., Yanıklar',
      signals: ['orchard_garden_breakfast', 'avocado_toast_brunch', 'calm_roadside_oasis'],
      desc:
        'Esenli Sokak üzerindeki avokado, çam ve söğüt ağaçları arasında bahçe kahvaltısı, avokadolu tost ve kahve sunan sakin durak.',
      order: ['Bahçe köy kahvaltısı', 'Avokadolu tost', 'Menemen ve taze sıkılmış meyve suları'],
      menu: ['Serpme kahvaltı', 'Avokadolu tost', 'Menemen', 'Taze meyve suyu', 'Kahve ve sütlü tatlılar'],
      sec: [
        [
          'Nitelikli kahve çeşitleri',
          'Kahvaltı sonrası ağaç gölgesinde dinlenme molası için espresso ve filtre kahve seçenekleri tercih ediliyor.',
          'Wanderlog & Yandex Harita topluluk notları',
        ],
        [
          'Ev yapımı sütlü tatlılar',
          'Günün taze tatlı ve puding çeşitleri kahve eşlikçisi olarak öne çıkıyor.',
          'Wanderlog Fethiye bahçe kafe değerlendirmeleri',
        ],
      ],
      seat: 'Avokado ve çam ağaçları altında bahçe masaları, dağ manzaralı salıncaklar ve açık oturma alanı',
      crowd: 'Ana yol kalabalığından uzak, sakin ve huzurlu; çiftler ile yol üstü kahvaltı molası verenlerle dengeli',
      dis: 'Açık bahçe ağırlıklı düzeni yağışlı havalarda kısıtlı; bahçede serbest dolaşan evcil kedi ve köpekler bulunuyor',
      transit:
        'Fethiye-Dalaman karayoluna yakın Esenli Sokak üzerinde yer alıyor; araçla kolay ulaşılırken toplu taşıma sonrası kısa yürüyüş gerektirir',
      sources: [
        [
          'Wanderlog Fethiye Seçkisi (Avocado Garden)',
          'https://wanderlog.com/',
          'editorial',
          'Yanıklar ağaçlık bahçesinde serpme kahvaltı, menemen, taze sıkılmış meyve suları ve kahve sunan sakin mola noktası olarak öneriliyor.',
        ],
        [
          'Restaurant Guru & Harita Topluluk Notları',
          'https://www.restaurantguru.com/',
          'community',
          'Avokadolu tost, bahçe kahvaltısı ve sakin ağaçlık atmosferiyle yüksek memnuniyet alıyor.',
        ],
        [
          'Instagram (@avocadogardencoffee)',
          'https://www.instagram.com/avocadogardencoffee/',
          'operator',
          'Esenli Sokak 39/2 bahçe alanı ve kahvaltı-içecek sunumları.',
        ],
        [
          'Google Maps Kaydı (Avocado Garden Coffee)',
          'https://maps.google.com/?cid=14515744317192378020',
          'maps',
          'Yanıklar Esenli Sokak 39/2 konumu, breakfast_restaurant türü ve canlı operasyonel durum doğrulaması.',
        ],
      ],
      pros: [
        'Avokado ve çam ağaçları arasında ana cadde gürültüsünden uzak huzurlu bahçe',
        'Hem klasik köy kahvaltısı hem avokadolu tost ve kahve molasına uygun esnek menü',
      ],
      cons: [
        'Yağışlı veya soğuk günlerde açık bahçe konforu azalabiliyor',
        'Bahçede dolaşan kedi ve köpekler evcil hayvan hassasiyeti olanlar için uygun olmayabilir',
      ],
      unc: ['Sezon dışı kış aylarında servis saatleri değişkenlik gösterebilir.'],
    }),

    compactSeed({
      id: 'yaniklar-huzur-sofrasi',
      placeId: 'ChIJ1Tb9y0NdwBQRO2Ec4OKqdvk',
      cat: 'denemelisin',
      secondaryCategoryIds: ['kahvalti'],
      brand: 'Huzur Sofrası',
      area: 'Dolmuş Cd., Yanıklar',
      signals: ['village_tandir_kavurma', 'dolmus_caddesi_kitchen', 'natural_village_breakfast'],
      desc:
        'Dolmuş Caddesi üzerinde yeşillikler içinde serpme köy kahvaltısının yanı sıra tandır, saç kavurma ve ev yemekleri çıkaran kır lokantası.',
      order: ['Tandır ve saç kavurma', 'Serpme köy kahvaltısı', 'El açması gözleme'],
      menu: ['Tandır', 'Saç kavurma', 'Serpme köy kahvaltısı', 'Gözleme', 'Yöresel ev yemekleri'],
      sec: [
        [
          'Ev yapımı reçel ve yöresel peynir tabağı',
          'Doğal ve taze köy ürünleriyle kurulan sabah sofrasında ev yapımı reçeller ile peynir çeşitleri öne çıkıyor.',
          'Kahvaltifiyatlari.com & Yandex Harita topluluk notları',
        ],
        [
          'Sahanda yumurta ve omlet çeşitleri',
          'Sıcak kahvaltı eşlikçileri ve taze patates kızartması aile masalarında sıkça tercih ediliyor.',
          'Restaurant Guru menü kayıtları',
        ],
      ],
      seat: 'Açık ve kapalı kır lokantası oturma alanları, yeşillikler içinde aile masaları',
      crowd: 'Kalabalıktan uzak, sakin köy atmosferi; öğle ve hafta sonu sabahları daha hareketli',
      dis: 'Yanıklar köyünün iç kesiminde (Dolmuş Caddesi hattında) kaldığı için kıyı şeridinden araçsız ulaşım zaman alır',
      transit:
        'Fethiye merkezden kalkan Yanıklar dolmuş güzergahı üzerindeki Dolmuş Caddesi No:39 önünde; özel araçlar için park alanı mevcut',
      sources: [
        [
          'Restaurant Guru Fethiye Listesi',
          'https://www.restaurantguru.com/',
          'editorial',
          'Dolmuş Caddesi üzerinde köy kahvaltısı, gözleme ve et yemekleri sunan yerel aile restoranı olarak yer alıyor.',
        ],
        [
          'Yandex Harita & Kahvaltı Rehberleri Topluluk Notları',
          'https://yandex.com.tr/harita/',
          'community',
          'Doğal köy kahvaltısının yanında tandır, saç kavurma ve sakin kır bahçesi atmosferi övülüyor.',
        ],
        [
          'Google Maps Kaydı (Huzur Sofrası Restaurant)',
          'https://maps.google.com/?cid=17975742854095200571',
          'maps',
          'Yanıklar Dolmuş Caddesi No:39 konumu ve canlı operasyonel durum doğrulaması.',
        ],
      ],
      pros: [
        'Sadece kahvaltı değil öğle ve akşam için tandır ile saç kavurma gibi sıcak ev yemekleri sunması',
        'Kıyı turistik kalabalığından tamamen uzak, köy içi sakin ve gölgeli bahçe ortamı',
      ],
      cons: [
        'Sahil bandından (Karaot/Katrancı) içeri doğru araç veya dolmuşla mesafe katetmek gerekiyor',
        'Sezon geçişlerinde sıcak tencere/tandır çeşitlerinin günlük çıkışı değişebiliyor',
      ],
      unc: ['Kış sezonunda açık günler ve öğleden sonra mutfak saatleri önceden teyit edilmeli.'],
    }),

    compactSeed({
      id: 'yaniklar-gozleme-duragi',
      placeId: 'ChIJe7dywN5DwBQRJrCV58JOuao',
      cat: 'denemelisin',
      brand: 'Gözleme Durağı',
      area: 'Sağlık Sk., Yanıklar',
      signals: ['hand_rolled_gozleme', 'village_herbs_ayran', 'saglik_sokak_local_stop'],
      desc:
        'Sağlık Sokak üzerinde köy evini andıran samimi bahçede yöresel otlu, peynirli ve kıymalı çıtır el açması gözleme sunan yerel durak.',
      order: ['Yöresel otlu ve peynirli gözleme', 'Kıymalı gözleme', 'Yayık ayran'],
      menu: ['Otlu peynirli gözleme', 'Kıymalı gözleme', 'Patatesli gözleme', 'Yayık ayran', 'Demleme çay'],
      sec: [
        [
          'Tahinli veya ballı cevizli tatlı gözleme',
          'Tuzlu gözleme çeşitlerinin ardından çay eşliğinde tatlı kapanış için tercih ediliyor.',
          'Yerel rehber ve menü kayıtları',
        ],
        [
          'Ev yapımı reçelli kahvaltılık eşlikçiler',
          'Gözleme yanında servis edilen ev yapımı reçeller ve taze çay köy molasını tamamlıyor.',
          'Yandex Harita topluluk notları',
        ],
      ],
      seat: 'Köy evi bahçesinde sade masa ve gölgelik oturma düzeni',
      crowd: 'Sakin mahalle arası durak; gün ortasında yol üstü mola verenlerle kısa süreli hareketlilik oluşabiliyor',
      dis: 'Gözleme hamuru sipariş üzerine tek tek açıldığı için yoğun saatlerde servis süresi uzayabiliyor',
      transit:
        'Yanıklar Sağlık Sokak üzerinde (No:522/1); Fethiye-Göcek ana yolundan kısa araç sürüşüyle ulaşılıyor',
      sources: [
        [
          'Wanderlog Fethiye Yeme-İçme Rehberi',
          'https://wanderlog.com/',
          'editorial',
          'Peynir, kıyma ve taze otlarla hazırlanan el açması gözlemeleriyle samimi ve bütçe dostu yerel durak olarak listeleniyor.',
        ],
        [
          'Restaurant Guru & Harita Topluluk Değerlendirmeleri',
          'https://www.restaurantguru.com/',
          'community',
          'Çıtır hamur dokusu, taze iç harçlar, ayran ve sıcak çay servisiyle yüksek ziyaretçi memnuniyeti alıyor.',
        ],
        [
          'Google Maps Kaydı (Gözleme Durağı Yanıklar)',
          'https://maps.google.com/?cid=12301950456155189286',
          'maps',
          'Yanıklar Sağlık Sokak 522/1 konumu ve canlı operasyonel durum doğrulaması.',
        ],
      ],
      pros: [
        'Sipariş üzerine elde açılan ince çıtır hamur ve yöresel otlu iç harç dengesi',
        'Gösterişsiz, samimi mahalle içi aile işletmesi atmosferi',
      ],
      cons: [
        'Tek tek taze açım yapıldığı için öğle yoğunluğunda bekleme süresi olabiliyor',
        'Menü kapsamı ağırlıklı olarak gözleme ve çay-ayran ikilisiyle sınırlı',
      ],
      unc: ['Düşük sezonda günlük açılış-kapanış saatleri değişiklik gösterebilir.'],
    }),

    compactSeed({
      id: 'yaniklar-baraqa-hoolbox',
      placeId: 'ChIJqygitFdDwBQRLRSPjOPezuw',
      cat: 'denemelisin',
      brand: 'Baraqa Hoolbox',
      area: 'Sağlık Sk., Yanıklar',
      signals: ['tiny_house_garden_bar', 'cocktails_tapas_burgers', 'evening_garden_lounge'],
      desc:
        'Sağlık Sokak üzerindeki tiny house bahçesinde akşamları imza kokteyller, tapas/taco tabakları, burgerler ve bilardo masası sunan butik restoran-bar.',
      order: ['İmza kokteyller', 'Tapas ve taco tabakları', 'Izgara burgerler'],
      menu: ['Kokteyller', 'Tapas & taco', 'Burger', 'Atıştırmalık tabaklar', 'Kahvaltı'],
      sec: [
        [
          'Bahçe kahvaltısı',
          'Oda-kahvaltı konseptiyle birlikte sabah saatlerinde hafif yöresel ürünlerle kahvaltı servisi sunuluyor.',
          'Konaklama ve restoran rehber kayıtları',
        ],
        [
          'Paylaşımlı bar atıştırmalıkları',
          'Akşam bahçe oturumunda kokteyl eşlikçisi olarak tercih ediliyor.',
          'Wanderlog & Restaurant Guru notları',
        ],
      ],
      seat: 'Doğayla iç içe tiny house bahçesinde açık hava oturma alanları ve iç mekanda bilardo masalı lounge',
      crowd: 'Kalabalıktan uzak, dinlendirici müzikli sakin akşam ve bahçe atmosferi',
      dis: 'Köy içi noktada otopark alanı sınırlı; mutfak ve bar servis saatleri sezona göre değişebildiği için önceden teyit önerilir',
      transit:
        'Yanıklar Sağlık Sokak (No:31/6) üzerinde; Çalış ve Katrancı hattından kısa araç sürüşüyle ulaşılır',
      sources: [
        [
          'Wanderlog Fethiye Seçkisi (Baraqa Hoolbox)',
          'https://wanderlog.com/',
          'editorial',
          'Tiny house bahçesinde yerel tabaklar, kokteyller ve bilardo masasıyla Yanıklar içindeki sakin gizli durak olarak öne çıkarılıyor.',
        ],
        [
          'Restaurant Guru & Gezgin Değerlendirmeleri',
          'https://www.restaurantguru.com/',
          'community',
          'Bahçe bar-restoran atmosferi, taco/tapas çeşitleri, burger seçenekleri ve kokteyllerle olumlu geri dönüşler alıyor.',
        ],
        [
          'Instagram (@baraqahoolbox)',
          'https://www.instagram.com/baraqahoolbox/',
          'operator',
          'İşletme resmi profili; Sağlık Sokak bahçe alanı, bar ve mutfak paylaşımları.',
        ],
        [
          'Google Maps Kaydı (Baraqa Hoolbox Restaurant)',
          'https://maps.google.com/?cid=17063821107050517549',
          'maps',
          'Yanıklar konumu, bar/restoran türleri ve canlı operasyonel durum doğrulaması.',
        ],
      ],
      pros: [
        'Yanıklar içinde akşam saatlerinde kokteyl ve sıcak atıştırmalık sunabilen ender bahçe mekanı',
        'Sakin tiny house bahçesi ve içerideki bilardo masasıyla rahat sosyalleşme ortamı',
      ],
      cons: [
        'Özel araç için otopark kapasitesi sınırlı',
        'Dönemsel ve sezon dışı günlerde mutfak menüsü ile bar saatleri değişkenlik gösterebiliyor',
      ],
      unc: ['Burger ve tapas çeşitlerinin günlük menüde bulunurluğu mevsime göre teyit edilmelidir.'],
    }),

    compactSeed({
      id: 'yaniklar-kokobus48',
      placeId: 'ChIJayfAaLNpwBQRWkHZa89PmZ8',
      cat: 'denemelisin',
      name: 'Kokobus48',
      brand: 'Kokobus48',
      area: 'Katrancı Kavşağı, Yanıklar',
      signals: ['bus_caravan_street_food', 'lamb_kokorec_uykuluk', 'wood_fired_samovar_tea'],
      desc:
        'Katrancı Kavşağı karşısında otobüs-karavan konseptiyle tabakta veya ekmek arasında kuzu kokoreç, uykuluk ve odun ateşinde semaver çayı sunan yol üstü lezzet durağı.',
      order: ['Kuzu kokoreç (tabakta veya ekmek arası)', 'Uykuluk', 'Kuzu çöp şiş ve ızgara köfte'],
      menu: ['Kuzu kokoreç', 'Uykuluk', 'Kuzu çöp şiş', 'Izgara köfte', 'Sucuk ekmek', 'Semaver çayı'],
      sec: [
        [
          'Odun ateşinde semaver çayı',
          'Yemek sonrası açık alanda odun ateşinde demlenen çay keyfiyle tamamlanıyor.',
          'Fethiye Rehberi işletme tanıtımı',
        ],
        [
          'Sucuk ekmek',
          'Sakatat tercih etmeyenler için hızlı ızgara alternatifi olarak sunuluyor.',
          'Fethiye Rehberi & Maptons menü özeti',
        ],
      ],
      seat: 'Karayolu kenarında otobüs-karavan önü açık hava masa ve tabure düzeni',
      crowd: 'Yol üstü uğrak noktası; akşamüstü ve gece saatlerinde hızlı servis alanlarla canlı',
      dis: 'Ana karayolu kenarı açık hava konsepti nedeniyle yağışlı/rüzgarlı havalarda oturma konforu kısıtlı; mevsimsel çalışma durumu önceden teyit edilmeli',
      transit:
        'Fethiye-Muğla karayolu üzeri Katrancı Kavşağı karşısında; özel araçla doğrudan yol kenarından kolay erişim',
      sources: [
        [
          'Fethiye Rehberi (Kokobus48)',
          'https://www.fethiyerehberi.com/',
          'editorial',
          'Yanıklar Katrancı Kavşağı karşısında kuzu kokoreç, uykuluk, çöp şiş, köfte ve odun ateşinde semaver çayı sunan otobüs konseptli işletme olarak tanıtılıyor.',
        ],
        [
          'Restaurant Guru & Sokak Lezzeti Değerlendirmeleri',
          'https://www.restaurantguru.com/',
          'community',
          'Taze kuzu kokoreç ve uykuluk çeşitleriyle yol üstü sokak lezzeti durağı olarak olumlu değerlendiriliyor.',
        ],
        [
          'Google Maps Kaydı (Kokobus48)',
          'https://maps.google.com/?cid=11500310875753496922',
          'maps',
          'Yanıklar Katrancı Kavşağı karşısı konumu ve canlı operasyonel durum doğrulaması.',
        ],
      ],
      pros: [
        'Yanıklar-Katrancı hattında taze kuzu kokoreç, uykuluk ve çöp şiş odağında özgün otobüs-karavan durağı',
        'Karayolu üzerinde kolay erişim ve odun ateşinde semaver çayı eşliği',
      ],
      cons: [
        'Bazı yerel harita dizinlerinde sezon dışı dönemde kapalı işaretlenebiliyor',
        'Ana yol kenarı açık alan düzeni soğuk ve yağışlı havalarda konforu düşürüyor',
      ],
      unc: [
        'Kış ve ara sezonlarda aktif açılış-kapanış günleri değişebildiğinden gitmeden önce telefonla teyit edilmesi gerekir.',
      ],
    }),

    // Negatif Denetim Kontrolleri (Politika Kapısı Doğrulaması)
    negControl(
      'ctrl-yaniklar-rei',
      'ChIJNXP1jQNdwBQRGOo7hnxL3YM',
      'kahvalti',
      'Rei Fethiye (Kanalbaşı Cd.): ★4.6 puanına karşın değerlendirme sayısı (<35) minimum hacim eşiğinin altında.'
    ),
    negControl(
      'ctrl-yaniklar-misa',
      'ChIJgVIHzZ5dwBQRNLjaQge9XUo',
      'kahvalti',
      'Misa Kahvalti Evi: ★4.2 puanı 4.4 taban eşiğinin altında.'
    ),
    negControl(
      'ctrl-yaniklar-morr',
      'ChIJu98xyVZDwBQRRx-MnzTTovg',
      'kahvalti',
      'MORR Garden (Esenli Sk.): ★4.3 puanı 4.4 taban eşiğinin altında.'
    ),
    negControl(
      'ctrl-yaniklar-soncare',
      'ChIJJ2XnGBBowBQRHAAdELRdhwY',
      'denemelisin',
      'Sonçare Köftecisi / Nogay Usta: ★4.1 puanı 4.4 taban eşiğinin altında.'
    ),
    negControl(
      'ctrl-yaniklar-kafi',
      'ChIJSYy1e-pDwBQRA1Ii-rhJdjQ',
      'balik',
      'Kâfi Fethiye (Deniz Sk.): ★4.2 puan ve <35 değerlendirme ile minimum eşik altında.'
    ),
    negControl(
      'ctrl-yaniklar-yesil-vadi',
      'ChIJ0zceKR9dwBQRkE9waGDovL0',
      'denemelisin',
      'Yeşil Vadi Yanıklar: Kamp/konaklama türü (campground), ★3.9 puan ve bbox kuzeydoğu sınırı dışı.'
    ),
    negControl(
      'ctrl-yaniklar-suna-village',
      'ChIJRTaHLnNFwBQR2csZi59FvlE',
      'kahvalti',
      'Suna Village: Otel/konaklama türü (hotel) ve ★4.2 puan ile eşik dışı.'
    ),
    negControl(
      'ctrl-yaniklar-pastoral-vadi',
      'ChIJE2pBReBDwBQRMoYY7IOvLY8',
      'kahvalti',
      'Pastoral Vadi Ekolojik Yaşam Çiftliği: Yeme-içme işletme türü (lodging/health) taşımadığı için Kapı 3 dışında.'
    ),
    negControl(
      'ctrl-yaniklar-yonca-lodge',
      'ChIJuTQoZIJCwBQRC94KOdwGKa0',
      'denemelisin',
      'Yonca Lodge: Otel/konaklama birincil türü (hotel/lodging) nedeniyle bağımsız restoran kapısından geçmez.'
    ),
    negControl(
      'ctrl-yaniklar-kerpic-evler',
      'ChIJGTq4SKJCwBQRC4ltBaHbN1g',
      'kahvalti',
      'Kerpiç Evler (Mezar Gediği Sk. No:64): Resmi sitesine ve tesis kayıtlarına göre otel konuklarına yönelik konaklama tesisi; dışarıdan kahvaltı sunan Asma Altı Kerpiç Evler Börek Evi ile karıştırılmamalı.'
    ),
    negControl(
      'ctrl-yaniklar-harput-dibek',
      'ChIJeU7tvXJDwBQR_xcRx2mP-ak',
      'kahve',
      'Coffee shop & Toast shop fethiyeharputdibek: Çok şubeli Harput Dibek franchise/akaryakıt istasyonu al-götür entegrasyonu (Acarlar Opet yanı); bağımsız Yanıklar nitelikli kahvecisi değil.'
    ),
    negControl(
      'ctrl-yaniklar-asmali-bahce',
      'ChIJQz8iHZRDwBQRIbJ3smsdvoE',
      'kahvalti',
      'Asmalı Bahçe Köy Kahvaltısı Fethiye: Komşu Kargı Mahallesi (Yanıklar sınır dışı kontrolü).'
    ),
    negControl(
      'ctrl-yaniklar-yoruk-muzesi',
      'ChIJGWLCNs1CwBQRs_ZntvSGNgA',
      'kahvalti',
      'Enver Yalçın Yörük Müzesi & Apart: Komşu Kargı Mahallesi (Yanıklar sınır dışı kontrolü).'
    ),
    negControl(
      'ctrl-yaniklar-ciftlik-pisiricisi',
      'ChIJ42WqiGZFwBQRwtH5P3nTLsc',
      'denemelisin',
      'Çiftlik Pişiricisi: Komşu Çiftlik Mahallesi (Yanıklar sınır dışı kontrolü).'
    ),
    negControl(
      'ctrl-yaniklar-soner-inlice',
      'ChIJI8TSPhpnwBQRGdnRuo4c0m0',
      'hamburger',
      'Soner ustanın yeri inlice: Komşu İnlice Mahallesi ve food_court türü (Yanıklar sınır dışı kontrolü).'
    ),
    negControl(
      'ctrl-yaniklar-zoi-fish',
      'ChIJ-bVdihhDwBQR5OL1Gg3-yNs',
      'balik',
      'Zoi Fish Restaurant: Foça / Çalış sahili (Yanıklar sınır dışı kontrolü).'
    ),
  ],
};
