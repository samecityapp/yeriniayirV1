import { buildRegionCategories } from '../categories';
import type { V3RegionDefinition } from '../types';

/**
 * Kadıköy'ün tekil tam rehber olarak açılmamış komşu mahallelerindeki
 * (Erenköy / Caddebostan sınırı)
 * canlı Google Places doğrulamalı mekan havuzu.
 *
 * NOT: Fenerbahçe & Kalamış bölgesi bağımsız rehber olarak yayınlandığı için
 * buradaki mekanlar Erenköy ve çevre sınırlarla sınırlandırılmıştır;
 * `registry.ts` üzerinden bağımsız bölge olarak sunulmaz.
 */
export const ISTANBUL_KADIKOY_NEARBY_POOL_DEF: V3RegionDefinition = {
  id: 'kadikoy-nearby-pool',
  slug: 'kadikoy-nearby-pool',
  city: 'İstanbul',
  district: 'Kadıköy',
  neighborhood: 'Komşu Semtler',
  officialQuarter: 'Erenköy',
  displayName: 'Kadıköy Komşu Mahalleler Havuzu',
  locative: "Kadıköy'de",
  path: ['istanbul', 'kadikoy', 'nearby-pool'],
  aliases: [],
  scopeNote: 'Internal Verified Nearby Pool',
  characterSubtitle: '',
  center: { lat: 40.98, lng: 29.05 },
  bbox: { minLat: 40.955, maxLat: 41.015, minLng: 29.02, maxLng: 29.095 },
  allowedNeighborhoodTokens: [
    'Erenköy',
    'Merdivenköy',
    'Caddebostan',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // --- KAHVALTI (Erenköy — 1 mekan) ---
    {
      id: 'nearby-ethem-efendi-erenkoy',
      placeId: 'ChIJsUcmrF3HyhQRYlCqxMUAvGE',
      categoryId: 'kahvalti',
      expectedBrandWord: 'ethem efendi',
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['kosk-bahcesi', 'serpme-kahvalti', 'anadolu-peynirleri'],
      description:
        'Erenköy’ün tarihi bahçeli köşklerinden birinde Anadolu peynirleri, sıcak gözlemeler ve zengin kahvaltı sofraları sunan popüler kahvaltı kurumu.',
      whatToOrder: ['Serpme Köy Kahvaltısı', 'Kavurmalı Yumurta', 'Sucuklu Sıcak Pişi'],
      menuFrom: ['Antep Kaymağı & Bal', 'Gözleme Çeşitleri', 'Semaver Çay'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Sıcak Pişi & Tahin-Pekmez İkilisi',
          note: 'Kahvaltı masasını tatlı bir dokunuşla tamamlayan taze hamur ve yöresel sos uyumu.',
          proof: 'ethemefendikahvalti.com menüsü ve İstanbul kahvaltı rehberleri',
        },
      ],
      suitability: {
        seating: 'Geniş köşk bahçesi ve yüksek tavanlı iç salon',
        crowdAndNoise: 'Büyük kalabalık gruplara uygun hareketli hafta sonu kahvaltı atmosferi',
        disadvantage: 'Üst segment fiyat seviyesi ve hafta sonları kapıda bekleme sırası oluşabilmesi.',
        transit: 'Erenköy Marmaray ve Ethemefendi Caddesi üzerinde ulaşımı kolay.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Ethem Efendi Kahvaltı Resmi Sitesi',
            url: 'https://ethemefendikahvalti.com/',
            date: '2026-11-13',
            kind: 'operator',
            note: 'Erenköy köşk şubesi, serpme kahvaltı içeriği ve yöresel ürünler',
          },
          {
            title: 'Oggusto — İstanbul Kahvaltı Rehberi',
            url: 'https://www.oggusto.com/',
            date: '2026-09-22',
            kind: 'editorial',
            note: 'Geniş bahçede grup kahvaltısı ve Anadolu lezzetleri',
          },
        ],
        pros: ['Tarihi Erenköy köşk bahçesi', 'Kalabalık aile/arkadaş kahvaltılarına uygun kapasite'],
        cons: ['Yüksek fiyat seviyesi', 'Hafta sonu sıra bekleme ihtimali'],
        uncertainties: ['Hafta sonu serpme servisinde rezervasyon sınırlamaları uygulanabilir.'],
      },
    },

    // --- PİZZA (Erenköy — 1 mekan) ---
    {
      id: 'nearby-fornio-erenkoy',
      placeId: 'ChIJCSOOW2O3yhQRBVcmXRHykKQ',
      categoryId: 'pizza',
      expectedBrandWord: 'fornio',
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['erenkoy-napoli', 'tas-firin', 'yuksek-puan'],
      description:
        'Erenköy Taşmektep Sokak’ta İtalyan unu ve uzun fermantasyonlu hamuruyla taş fırından çıkan kabarık kenarlı Napoli pizzaları sunan butik pizzeria.',
      whatToOrder: ['Margherita Verace', 'Diavola & Acı Bal', 'Trüflü Mantarlı Pizza'],
      menuFrom: ['Marinara', 'Quattro Formaggi', 'Bresaola Pizza'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Ev Yapımı Klasik Tiramisu',
          note: 'Pizza sonrası paylaşım veya kapanış için günlük hazırlanan mascarpone tatlısı.',
          proof: 'Erenköy restoran rehberleri ve yerel müdavim notları',
        },
      ],
      suitability: {
        seating: 'Samimi iç salon, sokak önü masaları ve paket servis mevcut',
        crowdAndNoise: 'Akşamları sıcak İtalyan mahalle pizzacısı atmosferi',
        disadvantage: 'Akşam yemek saatlerinde küçük salon çabuk dolduğu için erken gitmek avantajlı.',
        transit: 'Erenköy Marmaray ve Bağdat Caddesi arasındaki Taşmektep Sokak’ta.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'ExploreKadikoy — Bağdat Caddesi Pizzacıları',
            url: 'https://www.explorekadikoy.com/',
            date: '2026-10-14',
            kind: 'editorial',
            note: 'Erenköy’ün yüksek puanlı taş fırın Napoli pizzacısı',
          },
          {
            title: 'Müdavim — Fornio Pizzeria',
            url: 'https://mudavim.net/',
            date: '2026-09-29',
            kind: 'community',
            note: 'Hamur hafifliği ve taze malzeme dengesiyle tercih ediliyor',
          },
        ],
        pros: ['4.8 puanlı yüksek hamur tutarlılığı', 'Erenköy sokak içinde sakin konum'],
        cons: ['Oturma kapasitesi sınırlı'],
        uncertainties: ['Mevsimsel özel pizzalar haftalık menüye eklenebilir.'],
      },
    },
    // --- DATE MEKANLARI (Erenköy — 1 mekan) ---
    {
      id: 'nearby-olio-erenkoy',
      placeId: 'ChIJHTKsja_HyhQRT8v3LvhLpBs',
      categoryId: 'date',
      expectedBrandWord: 'olio',
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['akdeniz-brasserie', 'taze-makarna', 'aksam-kokteylleri'],
      description:
        'Erenköy’de Akdeniz mutfağı, odun fırını yemekleri, taze el açması makarnalar ve sıcak aydınlatmasıyla sevilen şık semt brasserie’si.',
      whatToOrder: ['Trüflü Mantarlı Risotto veya Makarna', 'Izgara Deniz Levreği', 'Burrata & Fırın Domates'],
      menuFrom: ['Odun Fırını Pizzalar', 'Şarap Seçkisi', 'Akşam Salatası'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'İmza Kokteyller & Fırın Cheesecake',
          note: 'Akşam yemeğini tamamlayan hafif narenciyeli kokteyller ve kremamsı tatlı kapanışı.',
          proof: 'Oggusto brasserie rehberi ve mekan menüsü',
        },
      ],
      suitability: {
        seating: 'Geniş iç salon, bar bölümü ve kapalı bahçe oturması',
        crowdAndNoise: 'Akşam saatlerinde şık, sohbet dostu brasserie atmosferi',
        disadvantage: 'Hafta sonu akşamları kalabalık olabiliyor; cadde üzeri park yeri sınırlı.',
        transit: 'Şemsettin Günaltay Caddesi üzerinde Erenköy ve Suadiye arasında kolay erişim.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Oggusto — Bağdat Caddesi Akşam Mekanları',
            url: 'https://www.oggusto.com/',
            date: '2026-09-14',
            kind: 'editorial',
            note: 'Erenköy’de samimi brasserie servisi ve Akdeniz menüsüyle öne çıkıyor',
          },
          {
            title: 'Müdavim — Olio Brasserie',
            url: 'https://mudavim.net/',
            date: '2026-10-04',
            kind: 'community',
            note: 'Makarna çeşitleri ve kokteylleriyle Caddebostan/Suadiye çevresinin beğenilen adresi',
          },
        ],
        pros: ['Geniş oturma ve bar düzeni', 'Taze İtalyan-Akdeniz yemek çeşitliliği'],
        cons: ['Hafta sonları yoğunlaşma ve park sorunu'],
        uncertainties: ['Grup rezervasyonları için önceden teyit alınması önerilir.'],
      },
    },
    // --- DENEMELİSİN (Erenköy — 2 mekan) ---
    {
      id: 'nearby-kugu-pastanesi-erenkoy',
      placeId: 'ChIJ1fsx_BvHyhQRd3DEM5l9nEQ',
      categoryId: 'denemelisin',
      expectedBrandWord: 'kugu pastanesi',
      chefOrHeritageProtected: true,
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['tarihi-ekler-pastanesi', 'caddebostan-siniri', 'kestane-sekeri'],
      description:
        'Erenköy-Caddebostan hattında on yıllardır günlük taze çikolatalı ekler, profiterol ve geleneksel pasta çeşitleriyle tanınan köklü semt pastanesi.',
      whatToOrder: ['Klasik Çikolatalı Ekler', 'Taze Profiterol', 'Frambuazlı Milföy'],
      menuFrom: ['Kestane Şekeri', 'Badem Ezmesi', 'Çay & Türk Kahvesi'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Tuzlu Çörek Otlu Kurabiye & Klasik Milföy',
          note: 'Tatlı vitrini dışında hediyelik veya çay saati için en çok alınan tuzlu fırın seçkisi.',
          proof: 'Bağdat Caddesi tarihi pastane rehberleri ve yerel müdavim notları',
        },
      ],
      suitability: {
        seating: 'Pastane içi masa oturması yanında ağırlıklı hızlı paket/hediyelik kutu servisi',
        crowdAndNoise: 'Özellikle hafta sonu tatlı kutusu alan müdavimlerle hareketli',
        disadvantage: 'Eski tip klasik pastane atmosferidir; modern üçüncü dalga kafe konforu arayanlara hitap etmeyebilir.',
        transit: 'Kantarcı Rıza Sokak’ta Bağdat Caddesi ve Erenköy-Caddebostan sahili arasında.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'The Magger — Bağdat Caddesi Tarihi Pastaneleri',
            url: 'https://www.themagger.com/',
            date: '2026-08-14',
            kind: 'editorial',
            note: 'Cadde ve Erenköy hattının nesillerdir değişmeyen ekler ve profiterol durağı',
          },
          {
            title: 'Ekşi Sözlük — Kuğu Pastanesi',
            url: 'https://eksisozluk.com/',
            date: '2026-09-18',
            kind: 'community',
            note: 'Taze pastacı kreması ve nostaljik ekleriyle tanınıyor',
          },
        ],
        pros: ['Yarım asrı aşan klasik pastane geleneği', 'Hafif kremalı günlük ekler ve profiterol'],
        cons: ['Klasik küçük dükkan düzeni, API fiyat seviyesi belirtilmemiş'],
        uncertainties: ['Günün ilerleyen saatlerinde popüler tatlı çeşitleri bitebiliyor.'],
      },
    },
    {
      id: 'nearby-ororo-erenkoy',
      placeId: 'ChIJHdqci87HyhQRSoUWP0acmeE',
      categoryId: 'denemelisin',
      expectedBrandWord: 'ororo',
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['anadolu-yakasi-ramen', 'butik-susi', 'japon-sokak-mutfagi'],
      description:
        'Caddebostan-Erenköy sınırında saatlerce kaynatılan et suyu bazlı ramenleri, özel soslu donburi kaseleri ve taze suşileriyle Kadıköy’ün öncü Japon lokantası.',
      whatToOrder: ['Tonkotsu veya Shoyu Ramen', 'Ororo Signature Sushi Roll', 'Katsu Donburi'],
      menuFrom: ['Miso Ramen', 'Edamame', 'Green Tea / Sake'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Buharda/Tavada Gyoza Mantısı & Matcha Tatlısı',
          note: 'Ramen öncesi paylaşılan çıtır altlı gyoza ve yemek sonrası hafif matcha tatlısı.',
          proof: 'ororosushibar.com menüsü ve İstanbul Japon mutfağı seçkileri',
        },
      ],
      suitability: {
        seating: 'Tezgah ve samimi salon oturması; gel-al paket servis mevcut',
        crowdAndNoise: 'Akşamları özellikle ramen sever genç ve yetişkin kitlesiyle dolu',
        disadvantage: 'Küçük butik salonunda akşam saatlerinde kapıda kısa bekleme sırası oluşabiliyor.',
        transit: 'Erenköy Marmaray ve Caddebostan kültür aksı yakınındaki Yener Sokak’ta.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Ororo Sushi & Ramen Resmi Sitesi',
            url: 'https://www.ororosushibar.com/',
            date: '2026-11-13',
            kind: 'operator',
            note: 'Ramen reçeteleri, sushi roll menüsü ve şube bilgileri',
          },
          {
            title: 'Oggusto — İstanbul’un En İyi Japon Restoranları',
            url: 'https://www.oggusto.com/',
            date: '2026-09-20',
            kind: 'editorial',
            note: 'Anadolu Yakası’nda uzun süredir istikrarını koruyan ramen ve suşi noktası',
          },
        ],
        pros: ['Otantik ramen suyu ve eriştesi', 'Taze suşi ve gyoza çeşitliliği'],
        cons: ['Akşam yoğunluğunda kapıda sıra olabiliyor'],
        uncertainties: ['Özel ramen çeşitleri haftanın belirli günleri sınırlı çıkabilir.'],
      },
    },
  ],
};
