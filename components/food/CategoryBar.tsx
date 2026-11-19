'use client';

import React from 'react';
import Link from 'next/link';
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
  'kebap-corba': '🥩',
  'ciger': '🔥',
  'tirit-paca': '🍲',
  'paca-corba': '🍲',
  'sillik-kadayif': '🥮',
  'kahiye-ve-tatli': '🥮',
  'burma-kadayif': '🥮',
  'urfa-mutfagi': '🏛️',
  'mardin-mutfagi': '🏛️',
  'diyarbakir-mutfagi': '🏛️',
  'suryani-sarabi-teras': '🍷',
  'beyran': '🍲',
  'baklava': '🥮',
  'katmer': '🥞',
  'antep-mutfagi': '🏛️',
  'deniz-urunleri': '🐟',
  'balik-deniz-urunleri': '🐟',
  'kofte-piyaz': '🧆',
  'kebap-pide-doner': '🥙',
  'hatay-mutfagi': '🏛️',
  'tepsi-kebabi': '🥩',
  'humus-meze': '🥣',
  'kunefe-tatli': '🥮',
  'iskenderun-doner': '🌯',
  'kebap-ocakbasi': '🥩',
  'adana-kebabi': '🥩',
  'sirdan-sokak': '🍲',
  'bicibici-tatli': '🍧',
  'tantuni': '🌯',
  'kerebic-kunefe': '🥮',
};

interface CategoryBarProps {
  categories: FoodCategory[];
  activeCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  getCategoryHref?: (slug: string) => string;
}

export function CategoryBar({
  categories,
  activeCategorySlug,
  onSelectCategory,
  getCategoryHref,
}: CategoryBarProps) {
  return (
    <div className="select-none">
      {/* 3 SÜTUNLU KUSURSUZ KATEGORİ IZGARASI */}
      <div data-testid="category-grid" className="grid grid-cols-2 min-[360px]:grid-cols-3 gap-1.5 min-[375px]:gap-2 sm:gap-2.5">
        {[...categories].sort((a,b)=>Number(!!b.isMustTry)-Number(!!a.isMustTry)).slice(0,9).map((cat) => {
          const isActive = cat.slug === activeCategorySlug;
          const emoji = cat.emoji || CATEGORY_FALLBACK_EMOJIS[cat.slug] || '🍽️';
          const itemClassName = `min-w-0 w-full min-h-[42px] flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 px-2 rounded-2xl sm:rounded-full text-[11px] min-[375px]:text-xs sm:text-[13px] font-bold text-center transition-all duration-150 active:scale-95 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C42B1C] ${
            isActive
              ? 'bg-[#C42B1C] text-white shadow-md shadow-[#C42B1C]/25 ring-2 ring-[#C42B1C]/20'
              : 'bg-white hover:bg-[#FFF5F3] text-[#181210] hover:text-[#B82516] border border-[#EFE5DF] hover:border-[#E5C5BC] shadow-sm'
          }`;

          if (getCategoryHref) {
            return (
              <Link
                key={cat.slug}
                href={getCategoryHref(cat.slug)}
                prefetch={false}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelectCategory(cat.slug)}
                className={itemClassName}
              >
                <span className="text-sm sm:text-base leading-none flex-shrink-0">{emoji}</span>
                <span className="min-w-0 break-words leading-snug">{cat.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={cat.slug}
              aria-pressed={isActive}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={itemClassName}
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
