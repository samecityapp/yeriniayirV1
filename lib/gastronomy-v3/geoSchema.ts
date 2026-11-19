import type { FoodLocation, VisitorFoodVenue } from '@/lib/food/types';
import {
  buildGeoPublicUrl,
  TR_SITE_ORIGIN,
  EN_SITE_ORIGIN,
  type GeoActiveCategoryMeta,
} from './geoCatalog';
import { getPilotEditorial, type ResolvedGeoPilotVenue } from './geoPilot';
import type { V3PublicVenue } from './types';

function inferVenueSchemaType(categorySlug: string, name: string): string {
  const lowerName = name.toLocaleLowerCase('tr');
  if (lowerName.includes('dondurma') || lowerName.includes('sorbe') || lowerName.includes('gelato')) {
    return 'IceCreamShop';
  }
  if (categorySlug === 'kahve') {
    return 'CafeOrCoffeeShop';
  }
  if (
    lowerName.includes('pastane') ||
    lowerName.includes('croissant') ||
    lowerName.includes('bakery') ||
    lowerName.includes('sourdough')
  ) {
    return 'Bakery';
  }
  if (lowerName.includes('şarap') || lowerName.includes('wine bar')) {
    return 'BarOrPub';
  }
  return 'Restaurant';
}

function inferCuisineLabel(categorySlug: string, name: string, lang: 'tr' | 'en'): string {
  const lower = name.toLocaleLowerCase('tr');
  if (categorySlug === 'pizza') return 'Pizza / Neapolitan';
  if (categorySlug === 'hamburger') return 'Burger';
  if (categorySlug === 'kahve') {
    return lower.includes('türk kahvesi') ? 'Turkish Coffee' : 'Specialty Coffee';
  }
  if (categorySlug === 'kahvalti') return lang === 'en' ? 'Breakfast & Bakery' : 'Kahvaltı & Fırın';
  if (categorySlug === 'balik-deniz-urunleri') return lang === 'en' ? 'Seafood' : 'Balık & Deniz Ürünleri';
  if (categorySlug === 'date-mekanlari') return lang === 'en' ? 'Bistro & Wine Dining' : 'Akşam Mutfağı & Bistro';
  return lang === 'en' ? 'Turkish & Local Cuisine' : 'Yerel Mutfak';
}

function inferPriceRangeFromTips(beforeYouGo: readonly string[]): string | undefined {
  for (const tip of beforeYouGo) {
    if (tip.startsWith('Bütçe seviyesi')) {
      if (tip.includes('Yüksek')) return '₺₺₺';
      if (tip.includes('Ekonomik')) return '₺';
      if (tip.includes('Orta')) return '₺₺';
    }
  }
  return undefined;
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildDirectoryCollectionJsonLd(args: {
  pageUrl: string;
  name: string;
  description: string;
  lang: 'tr' | 'en';
  items: Array<{ name: string; url: string; description?: string }>;
}) {
  const origin = args.lang === 'en' ? EN_SITE_ORIGIN : TR_SITE_ORIGIN;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${args.pageUrl}#collection`,
    url: args.pageUrl,
    name: args.name,
    description: args.description,
    inLanguage: args.lang === 'en' ? 'en' : 'tr-TR',
    publisher: {
      '@id': `${origin}/#organization`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: args.items.length,
      itemListElement: args.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: item.url,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
      })),
    },
  };
}

export function buildSelectionCollectionJsonLd(args: {
  pageUrl: string;
  name: string;
  description: string;
  lang: 'tr' | 'en';
  location: FoodLocation;
  dateModified: string;
  venues: VisitorFoodVenue[];
  snapshotVenuesById: Map<string, V3PublicVenue>;
  activeCategorySlug?: string;
}) {
  const origin = args.lang === 'en' ? EN_SITE_ORIGIN : TR_SITE_ORIGIN;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${args.pageUrl}#selection`,
    url: args.pageUrl,
    name: args.name,
    description: args.description,
    inLanguage: args.lang === 'en' ? 'en' : 'tr-TR',
    dateModified: args.dateModified,
    publisher: {
      '@id': `${origin}/#organization`,
    },
    about: {
      '@type': 'Place',
      name: args.location.displayName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: args.location.district || args.location.neighborhood,
        addressRegion: args.location.city,
        addressCountry: 'TR',
      },
      ...(args.location.center
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: args.location.center.lat,
              longitude: args.location.center.lng,
            },
          }
        : {}),
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: args.venues.length,
      itemListElement: args.venues.map((venue, idx) => {
        const snap = args.snapshotVenuesById.get(venue.id);
        const catSlug = args.activeCategorySlug || venue.categorySlugs[0] || 'denemelisin';
        const hasPilot = Boolean(getPilotEditorial(venue.id));
        const detailUrl = hasPilot
          ? buildGeoPublicUrl(`/mekan/${venue.id}`, args.lang)
          : undefined;
        const mapsUri =
          snap?.mapsUri || venue.ratings?.[0]?.attribution?.mapsUri || undefined;
        const priceRange = snap ? inferPriceRangeFromTips(snap.beforeYouGo) : undefined;

        return {
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': inferVenueSchemaType(catSlug, venue.name),
            '@id': detailUrl || mapsUri || `${args.pageUrl}#${venue.id}`,
            name: venue.name,
            ...(detailUrl ? { url: detailUrl } : {}),
            ...(venue.tagline ? { description: venue.tagline } : {}),
            servesCuisine: inferCuisineLabel(catSlug, venue.name, args.lang),
            ...(priceRange ? { priceRange } : {}),
            address: {
              '@type': 'PostalAddress',
              streetAddress: venue.address || venue.neighborhood,
              addressLocality: args.location.district || args.location.neighborhood,
              addressRegion: args.location.city,
              addressCountry: 'TR',
            },
            ...(snap?.coordinates
              ? {
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: snap.coordinates.lat,
                    longitude: snap.coordinates.lng,
                  },
                }
              : {}),
            ...(mapsUri ? { hasMap: mapsUri } : {}),
          },
        };
      }),
    },
  };
}

export function buildPilotVenueJsonLd(
  resolved: ResolvedGeoPilotVenue,
  lang: 'tr' | 'en'
) {
  const { snapshotVenue, visitorVenue, location, editorial, regionVerifiedAt } = resolved;
  const pageUrl = buildGeoPublicUrl(`/mekan/${snapshotVenue.id}`, lang);
  const priceRange = inferPriceRangeFromTips(snapshotVenue.beforeYouGo);
  const schemaType = inferVenueSchemaType(editorial.primaryCategorySlug, snapshotVenue.name);

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${pageUrl}#place`,
    url: pageUrl,
    name: snapshotVenue.name,
    description: `${snapshotVenue.description} ${editorial.culinaryIdentity[lang]}`,
    servesCuisine: inferCuisineLabel(editorial.primaryCategorySlug, snapshotVenue.name, lang),
    ...(priceRange ? { priceRange } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: snapshotVenue.address,
      addressLocality: location.district || location.neighborhood,
      addressRegion: location.city,
      addressCountry: 'TR',
    },
    ...(snapshotVenue.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: snapshotVenue.coordinates.lat,
            longitude: snapshotVenue.coordinates.lng,
          },
        }
      : {}),
    hasMap: snapshotVenue.mapsUri,
    sameAs: [snapshotVenue.mapsUri],
    containedInPlace: {
      '@type': 'Place',
      name: location.displayName,
      url: buildGeoPublicUrl(`/${location.path.join('/')}`, lang),
    },
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: lang === 'en' ? 'Recommended Dishes' : 'Ne Sipariş Etmeli?',
          hasMenuItem: snapshotVenue.whatToOrder.map((dish) => ({
            '@type': 'MenuItem',
            name: dish,
          })),
        },
        ...(visitorVenue.alsoTry?.items?.length
          ? [
              {
                '@type': 'MenuSection',
                name: lang === 'en' ? 'Also Try' : 'Ayrıca Bunları da Dene',
                hasMenuItem: visitorVenue.alsoTry.items.map((item) => ({
                  '@type': 'MenuItem',
                  name: item.name,
                  ...(item.description ? { description: item.description } : {}),
                })),
              },
            ]
          : []),
      ],
    },
    isPartOf: {
      '@type': 'WebPage',
      '@id': pageUrl,
      dateModified: regionVerifiedAt,
      inLanguage: lang === 'en' ? 'en' : 'tr-TR',
    },
  };
}

export function buildRegionOverviewFaqs(args: {
  location: FoodLocation;
  activeCategories: GeoActiveCategoryMeta[];
  venues: VisitorFoodVenue[];
  lang: 'tr' | 'en';
}): Array<{ question: string; answer: string }> {
  const { location, activeCategories, venues, lang } = args;
  const catNames = activeCategories.map((c) => c.title || c.label).join(', ');
  const sampleVenues = venues
    .slice(0, 5)
    .map((v) => v.name)
    .join(', ');

  if (lang === 'en') {
    return [
      {
        question: `Which food categories are covered in ${location.displayName}?`,
        answer: `${location.displayName} includes ${venues.length} verified independent stops across ${activeCategories.length} categories: ${catNames}. Categories without qualifying spots are omitted rather than padded.`,
      },
      {
        question: `How are venues in ${location.name} selected?`,
        answer: `Every stop in the ${location.name} guide passes multi-step boundary, chain-exclusion, operational-status, and independent quality gates focused on ${location.characterSubtitle || location.scopeNote || 'local culinary identity'}.`,
      },
      {
        question: `What are some verified places featured in ${location.name}?`,
        answer: `Notable entries inside ${location.displayName} include ${sampleVenues}, each published with street-level location notes, ordering guidance, and official Google Maps directions.`,
      },
    ];
  }

  return [
    {
      question: `${location.name} gastronomi rehberinde hangi kategoriler yer alır?`,
      answer: `${location.displayName} seçkisinde ${activeCategories.length} aktif kategoride (${catNames}) toplam ${venues.length} doğrulanmış bağımsız mekan yer alır; nitelikli aday bulunmayan kategoriler boş dolgu eklenmeden gizlenir.`,
    },
    {
      question: `${location.name} mekanları hangi doğrulama kurallarına göre seçilir?`,
      answer: `Tüm duraklar sıkı semt sınır doğrulaması, sıfır zincir/franchise politikası, operasyonel durum ve çoklu kaynak kalite eşiğinden geçirilerek ${location.characterSubtitle || location.scopeNote || 'mahalle mutfak kimliği'} odağında listelenir.`,
    },
    {
      question: `${location.locative} öne çıkan doğrulanmış duraklardan bazıları hangileridir?`,
      answer: `${location.displayName} seçkisinde ${sampleVenues} gibi mekanlar; sokak seviyesi konum tarifi, ne sipariş edileceği, ayrıca denenecek ürünler ve Gitmeden Bil notlarıyla sunulur.`,
    },
  ];
}
