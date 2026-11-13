'use client';

import React from 'react';
import { FoodCategory } from '@/lib/food/types';

const CATEGORY_FALLBACK_EMOJIS: Record<string, string> = {
  'kahve': '☕',
  'firin-kahvalti': '🥐',
  'sokak-mahalle': '🥙',
  'sef-aksam': '🍷',
  'tatli-gelato': '🍰',
  'kahvalti': '🍳',
  'hamburger': '🍔',
  'pizza': '🍕',
  'tatli-pastane': '🍰',
  'date-mekanlari': '🍷',
  'denemelisin': '⭐',
  'mutlaka-denenmesi-gerekenler': '⭐',
  'kebap': '🥩',
  'beyran': '🍲',
  'baklava': '🥮',
  'katmer': '🥞',
  'deniz-urunleri': '🐟',
  'balik-deniz-urunleri': '🐟',
};

interface CategoryBarProps {
  categories: FoodCategory[];
  activeCategorySlug: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryBar({
  categories,
  activeCategorySlug,
  onSelectCategory,
}: CategoryBarProps) {
  return (
    <div className="select-none">
      {/* 3 SÜTUNLU KUSURSUZ KATEGORİ IZGARASI */}
      <div data-testid="category-grid" className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {[...categories].sort((a,b)=>Number(!!b.isMustTry)-Number(!!a.isMustTry)).slice(0,9).map((cat) => {
          const isActive = cat.slug === activeCategorySlug;
          const emoji = cat.emoji || CATEGORY_FALLBACK_EMOJIS[cat.slug] || '🍽️';

          return (
            <button
              key={cat.slug}
              aria-pressed={isActive}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`min-w-0 w-full flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-2xl sm:rounded-full text-xs sm:text-[13px] font-bold transition-all duration-150 active:scale-95 select-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              <span className="text-sm sm:text-base leading-none flex-shrink-0">{emoji}</span>
              <span className="min-w-0 break-words leading-snug">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
