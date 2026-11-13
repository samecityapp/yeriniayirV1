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
