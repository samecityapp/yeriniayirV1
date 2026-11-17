import type { V3CategoryDef } from './types';

export const STANDARD_TOURIST_CATEGORIES: V3CategoryDef[] = [
  {
    id: 'pizza',
    slug: 'pizza',
    label: 'Pizza',
    title: 'Pizza',
    emoji: '🍕',
    isMustTry: false,
  },
  {
    id: 'hamburger',
    slug: 'hamburger',
    label: 'Hamburger',
    title: 'Hamburger',
    emoji: '🍔',
    isMustTry: false,
  },
  {
    id: 'kahve',
    slug: 'kahve',
    label: 'Kahve',
    title: 'Kahve',
    emoji: '☕',
    isMustTry: false,
  },
  {
    id: 'date',
    slug: 'date-mekanlari',
    label: 'Date',
    title: 'Date Mekanları',
    emoji: '🍷',
    isMustTry: false,
  },
  {
    id: 'kahvalti',
    slug: 'kahvalti',
    label: 'Kahvaltı',
    title: 'Kahvaltı',
    emoji: '🍳',
    isMustTry: false,
  },
  {
    id: 'denemelisin',
    slug: 'denemelisin',
    label: 'Denemelisin',
    title: 'Mutlaka Denemelisin',
    emoji: '⭐',
    isMustTry: false,
  },
];

export const COASTAL_SEAFOOD_CATEGORY: V3CategoryDef = {
  id: 'balik',
  slug: 'balik-deniz-urunleri',
  label: 'Balıkçılar',
  title: 'Balıkçılar & Deniz Ürünleri',
  emoji: '🐟',
  isMustTry: false,
};

export const ANTALYA_KOFTE_PIYAZ_CATEGORY: V3CategoryDef = {
  id: 'kofte-piyaz',
  slug: 'kofte-piyaz',
  label: 'Köfte & Piyaz',
  title: 'Şiş Köfte & Tahinli Piyaz',
  emoji: '🧆',
  isMustTry: false,
};

export function buildAntalyaFireCategory(label: string, title: string): V3CategoryDef {
  return {
    id: 'ates-firin',
    slug: 'kebap-pide-doner',
    label,
    title,
    emoji: '🥙',
    isMustTry: false,
  };
}

export const GAZIANTEP_HERITAGE_CATEGORIES: V3CategoryDef[] = [
  {
    id: 'kebap',
    slug: 'kebap',
    label: 'Kebap & Küşleme',
    title: 'Küşleme, Simit Kebabı & Ocakbaşı',
    emoji: '🥩',
    isMustTry: false,
  },
  {
    id: 'beyran',
    slug: 'beyran',
    label: 'Beyran & Paça',
    title: 'Geleneksel Sabah Beyranı & Kelle Paça',
    emoji: '🍲',
    isMustTry: false,
  },
  {
    id: 'baklava',
    slug: 'baklava',
    label: 'Baklava & Şöbiyet',
    title: 'Taş Fırın Baklava & Şöbiyet',
    emoji: '🥮',
    isMustTry: false,
  },
  {
    id: 'katmer',
    slug: 'katmer',
    label: 'Katmer',
    title: 'Sabah Taş Fırın Katmeri',
    emoji: '🥞',
    isMustTry: false,
  },
  {
    id: 'yoresel',
    slug: 'antep-mutfagi',
    label: 'Antep Mutfağı',
    title: 'Yuvalama, Ev Yemekleri & Tarihi Konaklar',
    emoji: '🏛️',
    isMustTry: false,
  },
  {
    id: 'kahvalti',
    slug: 'kahvalti',
    label: 'Kahvaltı',
    title: 'Yöresel Kahvaltı Sofraları',
    emoji: '🍳',
    isMustTry: false,
  },
  {
    id: 'kahve',
    slug: 'kahve',
    label: 'Kahve & Menengiç',
    title: 'Tarihi Kahvehaneler, Menengiç & Nitelikli Kahve',
    emoji: '☕',
    isMustTry: false,
  },
  {
    id: 'denemelisin',
    slug: 'denemelisin',
    label: 'Denemelisin',
    title: 'Mutlaka Denemelisin',
    emoji: '⭐',
    isMustTry: false,
  },
];

export const SANLIURFA_HERITAGE_CATEGORIES: V3CategoryDef[] = [
  {
    id: 'ciger',
    slug: 'ciger',
    label: 'Sabah Ciğeri',
    title: 'Sabah & Akşam Kuzu Ciğer Ocakları',
    emoji: '🔥',
    isMustTry: false,
  },
  {
    id: 'kebap',
    slug: 'kebap',
    label: 'Haşhaş & Zırh Kebabı',
    title: 'Patlıcanlı, Haşhaş, Keme & Zırh Kebabı',
    emoji: '🥩',
    isMustTry: false,
  },
  {
    id: 'tirit',
    slug: 'tirit-paca',
    label: 'Tirit & Paça',
    title: 'Sabah Tiridi, Kelle Paça & Kemik Suyu',
    emoji: '🍲',
    isMustTry: false,
  },
  {
    id: 'tatli',
    slug: 'sillik-kadayif',
    label: 'Şıllık & Kadayıf',
    title: 'Şıllık Tatlısı, Billuriye, Taş Kadayıf & Künefe',
    emoji: '🥮',
    isMustTry: false,
  },
  {
    id: 'yoresel',
    slug: 'urfa-mutfagi',
    label: 'Urfa Mutfağı',
    title: 'Tarihi Konaklar, Taş Fırın Lahmacun, Çiğköfte & Ev Yemekleri',
    emoji: '🏛️',
    isMustTry: false,
  },
  {
    id: 'kahvalti',
    slug: 'kahvalti',
    label: 'Kahvaltı',
    title: 'Salçalı Yumurta, Sahan Kaymağı & Yöresel Kahvaltı',
    emoji: '🍳',
    isMustTry: false,
  },
  {
    id: 'kahve',
    slug: 'kahve',
    label: 'Mırra & Kahve',
    title: 'Tarihi Han Kahvehaneleri, Mırra, Menengiç & Nitelikli Kahve',
    emoji: '☕',
    isMustTry: false,
  },
  {
    id: 'denemelisin',
    slug: 'denemelisin',
    label: 'Denemelisin',
    title: 'Mutlaka Denemelisin',
    emoji: '⭐',
    isMustTry: false,
  },
];

export const MARDIN_HERITAGE_CATEGORIES: V3CategoryDef[] = [
  {
    id: 'yoresel',
    slug: 'mardin-mutfagi',
    label: 'Yöresel Mutfak',
    title: 'Kaburga Dolması, Dobo, Sembusek & Konak Mutfağı',
    emoji: '🏛️',
    isMustTry: false,
  },
  {
    id: 'kebap',
    slug: 'kebap-corba',
    label: 'Kebap & Çorba',
    title: 'Zırh Kebabı, Ciğer Şiş & Sabah Çorbacıları',
    emoji: '🥩',
    isMustTry: false,
  },
  {
    id: 'date',
    slug: 'suryani-sarabi-teras',
    label: 'Şarap & Teras',
    title: 'Süryani Şarap Evleri & Taş Teraslar',
    emoji: '🍷',
    isMustTry: false,
  },
  {
    id: 'tatli',
    slug: 'kahiye-ve-tatli',
    label: 'Kahiye & Tatlı',
    title: 'Kahiye, Katmer, Künefe & Sütlü Tatlılar',
    emoji: '🥮',
    isMustTry: false,
  },
  {
    id: 'kahvalti',
    slug: 'kahvalti',
    label: 'Kahvaltı',
    title: 'Taş Avlu Kahvaltısı, Sıcak Çörek & Menengiç',
    emoji: '🍳',
    isMustTry: false,
  },
  {
    id: 'kahve',
    slug: 'kahve',
    label: 'Süryani & Mırra',
    title: 'Süryani Kahvesi, Mırra, Dibek & Nitelikli Kahve',
    emoji: '☕',
    isMustTry: false,
  },
  {
    id: 'denemelisin',
    slug: 'denemelisin',
    label: 'Denemelisin',
    title: 'Mutlaka Denemelisin',
    emoji: '⭐',
    isMustTry: false,
  },
];

export const DIYARBAKIR_HERITAGE_CATEGORIES: V3CategoryDef[] = [
  {
    id: 'ciger',
    slug: 'ciger',
    label: 'Sabah Ciğeri',
    title: 'Suriçi & Ocakbaşı Kuzu Ciğeri',
    emoji: '🔥',
    isMustTry: false,
  },
  {
    id: 'kebap',
    slug: 'kebap-doner',
    label: 'Kebap & Lahmacun',
    title: 'Zırh Kebabı, Odun Fırını Lahmacun & Tava',
    emoji: '🥩',
    isMustTry: false,
  },
  {
    id: 'yoresel',
    slug: 'diyarbakir-mutfagi',
    label: 'Kaburga & Yöresel',
    title: 'Kaburga Dolması, Meftune, Güveç & Tarihi Mutfak',
    emoji: '🏛️',
    isMustTry: false,
  },
  {
    id: 'tirit',
    slug: 'paca-corba',
    label: 'Paça & Çorba',
    title: 'Kelle Paça, Mumbar & Hindi Sulu Çorbacılar',
    emoji: '🍲',
    isMustTry: false,
  },
  {
    id: 'tatli',
    slug: 'burma-kadayif',
    label: 'Burma Kadayıf',
    title: 'Fıstıklı Burma Kadayıf, Katmer & Künefe',
    emoji: '🥮',
    isMustTry: false,
  },
  {
    id: 'kahvalti',
    slug: 'kahvalti',
    label: 'Kahvaltı',
    title: 'Suriçi Taş Avluları & Yöresel Serpme Kahvaltı',
    emoji: '🍳',
    isMustTry: false,
  },
  {
    id: 'kahve',
    slug: 'kahve',
    label: 'Kahve',
    title: 'Suriçi, Ofis & Cadde 75 Nitelikli Kahve Durakları',
    emoji: '☕',
    isMustTry: false,
  },
  {
    id: 'denemelisin',
    slug: 'denemelisin',
    label: 'Denemelisin',
    title: 'Mutlaka Denemelisin',
    emoji: '⭐',
    isMustTry: false,
  },
];

export function buildRegionCategories(opts?: {
  mode?: 'standard' | 'culinary_heritage';
  customCategories?: V3CategoryDef[];
  extraCategories?: V3CategoryDef[];
  coastalSeafood?: boolean;
}): V3CategoryDef[] {
  if (opts?.mode === 'culinary_heritage') {
    return opts.customCategories ? [...opts.customCategories] : [];
  }
  return [
    ...STANDARD_TOURIST_CATEGORIES,
    ...(opts?.coastalSeafood ? [COASTAL_SEAFOOD_CATEGORY] : []),
    ...(opts?.extraCategories || []),
  ];
}
