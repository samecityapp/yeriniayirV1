/** Public asset catalogue only. Rights/provenance records stay on the server. */
export type IllustrationCategory = 'coffee' | 'burger' | 'pizza' | 'breakfast' | 'dessert' | 'regional' | 'gastronomy';

type IllustrationFamilyKey = IllustrationCategory | 'date' | 'denemelisin' | 'balik';

const ILLUSTRATION_FAMILIES: Record<IllustrationFamilyKey, readonly string[]> = {
  coffee: [
    'kahve-ana-matisse',
    'kahve-ana-knolling',
    'kahve-ana-triptik',
    'kahve-ana-riso',
    'kahve-yedek-makro',
    'kahve-yedek-kesit',
    'kahve-yedek-golge',
  ],
  burger: [
    'hamburger-ana-matisse',
    'hamburger-ana-knolling',
    'hamburger-ana-triptik',
    'hamburger-ana-riso',
    'hamburger-yedek-makro',
    'hamburger-yedek-kesit',
    'hamburger-yedek-golge',
  ],
  pizza: [
    'pizza-ana-matisse',
    'pizza-ana-knolling',
    'pizza-ana-triptik',
    'pizza-ana-riso',
    'pizza-yedek-makro',
    'pizza-yedek-kesit',
    'pizza-yedek-golge',
  ],
  breakfast: [
    'kahvalti-ana-matisse',
    'kahvalti-ana-knolling',
    'kahvalti-ana-triptik',
    'kahvalti-ana-riso',
    'kahvalti-yedek-makro',
    'kahvalti-yedek-kesit',
    'kahvalti-yedek-golge',
  ],
  date: [
    'date-ana-matisse',
    'date-ana-knolling',
    'date-ana-triptik',
    'date-ana-riso',
    'date-yedek-makro',
    'date-yedek-kesit',
    'date-yedek-golge',
  ],
  denemelisin: [
    'denemelisin-ana-matisse',
    'denemelisin-ana-knolling',
    'denemelisin-ana-triptik',
    'denemelisin-ana-riso',
    'denemelisin-yedek-makro',
    'denemelisin-yedek-kesit',
    'denemelisin-yedek-golge',
  ],
  balik: [
    'balik-ana-matisse',
    'balik-ana-knolling',
    'balik-ana-triptik',
    'balik-ana-riso',
    'balik-yedek-makro',
    'balik-yedek-kesit',
    'balik-yedek-golge',
  ],
  dessert: ['dessert'],
  regional: ['regional'],
  gastronomy: ['gastronomy'],
};

export const CATEGORY_ILLUSTRATIONS: Record<IllustrationCategory, readonly string[]> = {
  coffee: ILLUSTRATION_FAMILIES.coffee,
  burger: ILLUSTRATION_FAMILIES.burger,
  pizza: ILLUSTRATION_FAMILIES.pizza,
  breakfast: ILLUSTRATION_FAMILIES.breakfast,
  dessert: ILLUSTRATION_FAMILIES.dessert,
  regional: ILLUSTRATION_FAMILIES.regional,
  gastronomy: ILLUSTRATION_FAMILIES.gastronomy,
};

const familyAliases: Record<string, IllustrationFamilyKey> = {
  denemelisin: 'denemelisin',
  coffee: 'coffee',
  kahve: 'coffee',
  'nitelikli-kahve': 'coffee',
  'nitelikli-kahve-karakoy': 'coffee',
  'nitelikli-kahve-galata': 'coffee',
  'nitelikli-kahve-cihangir': 'coffee',
  'nitelikli-kahve-nisantasi': 'coffee',
  'nitelikli-kahve-kusadasi': 'coffee',
  'modern-cafe-bistro-taksim': 'coffee',
  'kultur-sanat-kahve': 'coffee',
  'nitelikli-kahve-firin-gokturk': 'coffee',
  'kahve-pastane-lara': 'coffee',
  burger: 'burger',
  hamburger: 'burger',
  'burger-steak-lara': 'burger',
  'gurme-burger-konyaalti': 'burger',
  pizza: 'pizza',
  'pizza-italyan': 'pizza',
  'pizza-italyan-kusadasi': 'pizza',
  'pizza-italyan-kaleici': 'pizza',
  'tas-firin-pizza-lara': 'pizza',
  breakfast: 'breakfast',
  kahvalti: 'breakfast',
  'kahvalti-firin': 'breakfast',
  'kahvalti-brunch': 'breakfast',
  'kahvalti-brunch-cihangir': 'breakfast',
  'brunch-kahvalti-nisantasi': 'breakfast',
  'kahvalti-bostan': 'breakfast',
  'kahvalti-cengelkoy': 'breakfast',
  'bogaz-kahvalti-manzara': 'breakfast',
  'bogaz-kahvalti-cafe-bebek': 'breakfast',
  'bogaz-kahvalti-cafe-yenikoy': 'breakfast',
  'koy-kahvalti-kusadasi': 'breakfast',
  'koy-kahvaltisi-gozleme-konyaalti': 'breakfast',
  dessert: 'dessert',
  tatli: 'dessert',
  'sillik-kadayif': 'dessert',
  'tatli-pastane': 'dessert',
  'tatli-pastane-cihangir': 'dessert',
  'tatli-cikolata': 'dessert',
  'tatli-baklava-cikolata': 'dessert',
  'tarihi-tatli-cikolata-beyoglu': 'dessert',
  'tarihi-tatli-muhallebi-taksim': 'dessert',
  'tarihi-tatli-pastane-nisantasi': 'dessert',
  'tarihi-tatli-badem-bebek': 'dessert',
  'tarihi-borek-tatli-yenikoy': 'dessert',
  'butik-tatli-dondurma-gokturk': 'dessert',
  'san-sebastian-tatli': 'dessert',
  'tarihi-firin-tatli': 'dessert',
  'tarihi-pastane-borek': 'dessert',
  'tarihi-tatli-helva': 'dessert',
  pastane: 'dessert',
  'borek-kahve-tatli-kaleici': 'dessert',
  'kruvasan-pastane-kahve-konyaalti': 'dessert',
  regional: 'regional',
  yoresel: 'regional',
  'yoresel-yemek': 'regional',
  'yoresel-lezzetler': 'regional',
  lokanta: 'regional',
  'tarihi-lokantalar': 'regional',
  kebap: 'regional',
  'kebap-doner': 'regional',
  ciger: 'regional',
  tirit: 'regional',
  'tirit-paca': 'regional',
  'urfa-mutfagi': 'regional',
  'tarihi-doner-kebap-taksim': 'regional',
  'tarihi-lokanta-kofte': 'regional',
  'tarihi-lokanta-borek': 'regional',
  'tarihi-lokanta-beyoglu': 'regional',
  'kebap-et-ocakbasi-gokturk': 'regional',
  'kofte-piyaz-kaleici': 'regional',
  'yaprak-doner-kaleici': 'regional',
  'pide-kebap-kaleici': 'regional',
  'lahmacun-kebap-lara': 'regional',
  'odun-atesi-pide-konyaalti': 'regional',
  'lahmacun-kebap-konyaalti': 'regional',
  balik: 'balik',
  'balik-deniz-urunleri': 'balik',
  'lokanta-balik': 'balik',
  'balik-bogaz-lokanta': 'balik',
  'balik-deniz-bistro-bebek': 'balik',
  'balik-deniz-yenikoy': 'balik',
  'ege-balik-kusadasi': 'balik',
  meyhane: 'gastronomy',
  'meyhane-aksam-bistro': 'gastronomy',
  'mahalle-bistro-meyhane': 'gastronomy',
  'tarihi-meyhane-galata': 'gastronomy',
  'tarihi-meyhane-asmalimescit': 'gastronomy',
  bistro: 'gastronomy',
  'aksam-bistro': 'gastronomy',
  'bistro-dunya': 'gastronomy',
  'dunya-bistro-nisantasi': 'gastronomy',
  'dunya-mutfagi-galata': 'gastronomy',
  'bogaz-teras-bistro-beyoglu': 'gastronomy',
  'manzara-fine-dining-taksim': 'gastronomy',
  'gurme-bistro-brasserie-bebek': 'gastronomy',
  'mahalle-bistro-ocakbasi-yenikoy': 'gastronomy',
  'dunya-bistro-italyan-gokturk': 'gastronomy',
  'date-gunbatimi-kusadasi': 'date',
  'ozel-gun-kaleici': 'date',
  'ozel-gun-falez-lara': 'date',
  'ozel-gun-7mehmet-konyaalti': 'date',
  'makarna-restoran': 'gastronomy',
  date: 'date',
  'date-mekanlari': 'date',
  bakery_breakfast: 'breakfast',
  'firin-kahvalti': 'breakfast',
  street_local: 'regional',
  'sokak-mahalle': 'regional',
  chef_dinner: 'gastronomy',
  'sef-aksam': 'gastronomy',
  dessert_gelato: 'dessert',
  'tatli-gelato': 'dessert',
  'tarihi-baklava-antep': 'dessert',
  'kusleme-kebap-antep': 'regional',
  'beyran-paca-antep': 'regional',
  'katmer-kahvalti-antep': 'dessert',
  'antep-ev-mutfagi-antep': 'regional',
  'tarihi-kahvehane-antep': 'coffee',
  baklava: 'dessert',
  katmer: 'dessert',
  beyran: 'regional',
  'antep-mutfagi': 'regional',
  'mardin-mutfagi': 'regional',
  'kebap-corba': 'regional',
  'suryani-sarabi-teras': 'date',
  'suryani-sarabi-ve-teras': 'date',
  'kahiye-ve-tatli': 'dessert',
  'diyarbakir-mutfagi': 'regional',
  'paca-corba': 'regional',
  'burma-kadayif': 'dessert',
  'hatay-mutfagi': 'regional',
  'tepsi-kebabi': 'regional',
  'humus-meze': 'regional',
  'kunefe-tatli': 'dessert',
  'iskenderun-doner': 'regional',
  'kebap-ocakbasi': 'regional',
  'adana-kebabi': 'regional',
  'sirdan-sokak': 'regional',
  'bicibici-tatli': 'dessert',
  tantuni: 'regional',
  'kerebic-kunefe': 'dessert',
};

const normalizeCategory = (category: string): string =>
  category
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .trim()
    .replace(/[\s/]+/g, '-');

const resolveIllustrationFamily = (category: string): IllustrationFamilyKey =>
  familyAliases[normalizeCategory(category)] || 'gastronomy';

export const illustrationCategory = (category: string): IllustrationCategory => {
  const family = resolveIllustrationFamily(category);
  if (family === 'date' || family === 'balik') return 'gastronomy';
  if (family === 'denemelisin') return 'regional';
  return family;
};

const hash = (id: string) => {
  let n = 2166136261;
  for (let i = 0; i < id.length; i++) {
    n ^= id.charCodeAt(i);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
};

export function categoryIllustration(category: string, id = '') {
  const family = ILLUSTRATION_FAMILIES[resolveIllustrationFamily(category)];
  const primaryCount = Math.min(4, family.length);
  return '/images/gastronomy/' + family[id ? hash(id) % primaryCount : 0] + '.svg';
}

/** Assigns approved primary styles (1..4) first, then backup styles (5..7) per category without adjacent repeats. */
export function assignVenueIllustrations(venues: readonly { id: string; categoryId: string }[]): Map<string, string> {
  const result = new Map<string, string>();
  const counts = new Map<IllustrationFamilyKey, number>();
  for (const venue of venues) {
    if (result.has(venue.id)) continue;
    const familyKey = resolveIllustrationFamily(venue.categoryId);
    const family = ILLUSTRATION_FAMILIES[familyKey];
    const index = counts.get(familyKey) || 0;
    counts.set(familyKey, index + 1);
    result.set(venue.id, '/images/gastronomy/' + family[index % family.length] + '.svg');
  }
  return result;
}

export const illustrationLabel = (category: string) =>
  ({
    coffee: 'Kahve',
    burger: 'Hamburger',
    pizza: 'Pizza',
    breakfast: 'Kahvaltı',
    dessert: 'Tatlı ve pastane',
    regional: 'Yöresel yemek',
    gastronomy: 'Gastronomi',
    date: 'Date mekanları',
    denemelisin: 'Denemelisin',
    balik: 'Balık ve deniz ürünleri',
  })[resolveIllustrationFamily(category)];
