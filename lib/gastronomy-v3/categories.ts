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
    title: 'Bölgeye Özgü Denemelisin',
    emoji: '⭐',
    isMustTry: false,
  },
];

export function buildRegionCategories(opts?: {
  mode?: 'standard' | 'culinary_heritage';
  customCategories?: V3CategoryDef[];
  extraCategories?: V3CategoryDef[];
}): V3CategoryDef[] {
  if (opts?.mode === 'culinary_heritage') {
    return opts.customCategories ? [...opts.customCategories] : [];
  }
  return [...STANDARD_TOURIST_CATEGORIES, ...(opts?.extraCategories || [])];
}
