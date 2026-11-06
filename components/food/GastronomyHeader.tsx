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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all select-none">
      <div className="max-w-2xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* LOGO */}
        <Link href={`/${lang}?view=gastronomi`} className="flex items-center gap-1.5 focus:outline-hidden">
          <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950 flex items-center">
            YERİNİ<span className="text-blue-600 ml-0.5">AYIR</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 ml-1">
            Gastronomi
          </span>
        </Link>

        {/* BÖLGE / KONUM BUTONU */}
        <button
          onClick={onOpenLocationPicker}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200/80 border border-slate-200/90 text-xs font-bold text-slate-800 transition active:scale-97 shadow-2xs group"
          aria-label={currentLocation?`${currentLocation.name} — Konum Seç`:"Konum Seç"}
        >
          <MapPin size={13} className="text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="truncate max-w-[130px] sm:max-w-none">
            {currentLocation ? currentLocation.name : 'Konum Seç'}
          </span>
          <ChevronDown size={14} className="text-slate-400 flex-shrink-0 group-hover:text-slate-600 transition-colors" />
        </button>
      </div>
    </header>
  );
}
