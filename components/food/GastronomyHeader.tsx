'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown } from 'lucide-react';
import { FoodLocation } from '@/lib/food/types';

interface GastronomyHeaderProps {
  currentLocation: FoodLocation | null;
  onOpenLocationPicker: () => void;
  lang?: 'tr' | 'en';
}

export function GastronomyHeader({
  currentLocation,
  onOpenLocationPicker,
  lang = 'tr',
}: GastronomyHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE5DF] transition-all select-none">
      <div className="max-w-2xl mx-auto px-3.5 min-[375px]:px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* LOGO */}
        <Link href={`/${lang}`} className="flex items-center gap-1.5 flex-shrink-0 focus:outline-none">
          <span className="text-base min-[375px]:text-lg sm:text-xl font-black tracking-tight text-[#181210] flex items-center">
            YERİNİ<span className="text-[#C42B1C] ml-0.5">AYIR</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF1EE] text-[#A61E11] border border-[#F2D5CE] ml-1">
            Gastronomi
          </span>
        </Link>

        {/* BÖLGE / KONUM BUTONU */}
        <button
          onClick={onOpenLocationPicker}
          className="min-w-0 max-w-[58vw] sm:max-w-[280px] min-h-[36px] flex items-center gap-1.5 px-2.5 min-[375px]:px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] active:bg-[#F3E8E2] border border-[#E6D9D0] hover:border-[#D9A79B] text-xs font-bold text-[#181210] transition active:scale-[0.97] shadow-xs group"
          aria-label={currentLocation?`${currentLocation.name} — Konum Seç`:"Konum Seç"}
        >
          <MapPin size={13} className="text-[#C42B1C] flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="truncate">
            {currentLocation ? currentLocation.name : 'Konum Seç'}
          </span>
          <ChevronDown size={14} className="text-[#6E5A53] flex-shrink-0 group-hover:text-[#181210] transition-colors" />
        </button>
      </div>
    </header>
  );
}
