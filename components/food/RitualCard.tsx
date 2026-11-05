'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FoodRitual } from '@/lib/food/types';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';

interface RitualCardProps {
  ritual: FoodRitual;
  lang?: 'tr' | 'en';
}

export function RitualCard({ ritual, lang = 'tr' }: RitualCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section 
      aria-label="Bölge Ritüeli"
      className="relative w-full bg-gradient-to-br from-white via-slate-50/70 to-blue-50/30 rounded-3xl border border-blue-200/60 shadow-[0_4px_24px_-6px_rgba(37,99,235,0.08)] overflow-hidden transition-all duration-200 my-6"
    >
      {/* ÜST VURGU BANDI: "Buranın Ritüelleri" Rozeti */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-150/60 bg-white/70 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Compass size={14} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
            Buranın Ritüelleri
          </span>
        </div>

        {ritual.badgeText && (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
            {ritual.badgeText}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {/* BAŞLIK & ÖZET */}
        <div className="mb-4">
          <div className="text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
            {ritual.headline}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
            {ritual.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-2">
            {ritual.summary}
          </p>
        </div>

        {/* EN İYİ ZAMAN & DOĞRULANMIŞ NOT */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {ritual.bestTime && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              <Clock size={13} className="text-blue-600" />
              <span>En İyi Zaman: {ritual.bestTime}</span>
            </div>
          )}
          {ritual.verifiedNote && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Doğrulanmış Deneyim</span>
            </div>
          )}
        </div>

        {/* DURAKLAR (STEP BY STEP RİTÜEL ADIMLARI) */}
        <div className="space-y-3 pt-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Ritüel Durakları ({ritual.stops.length} Adım)
          </div>

          <div className="space-y-2.5">
            {ritual.stops.map((stop) => (
              <div 
                key={stop.order}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                  {stop.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-slate-900 leading-tight">
                    {stop.venueName}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    {stop.action}
                  </div>
                  {stop.note && (
                    <div className="text-[11px] text-blue-700/90 mt-1.5 font-semibold bg-blue-50/50 p-1.5 rounded-lg">
                      💡 {stop.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETAYLI İPUÇLARI VE AÇILIR BİLGİ */}
        {ritual.tips && ritual.tips.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200/60">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-blue-600 transition py-1"
            >
              <span>Yerel Müdavim İpuçları</span>
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {isExpanded && (
              <div className="mt-2 space-y-1.5 text-xs text-slate-600 animate-in fade-in duration-150">
                {ritual.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 text-slate-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
