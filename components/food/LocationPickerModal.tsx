'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  Navigation, 
  Check, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { FoodLocation } from '@/lib/food/types';
import type { createRealFoodProvider } from '@/lib/food/realProvider';
import { haversineMeters } from '@/lib/food/text';
import { useModalFocus } from '@/lib/food/useModalFocus';
import { FOOD_DISCOVERY } from '@/lib/food/config';

interface LocationPickerModalProps {
  provider: ReturnType<typeof createRealFoodProvider>;
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: FoodLocation) => void;
  currentLocationId?: string;
}

export function LocationPickerModal({
  provider: foodDiscoveryProvider,
  isOpen,
  onClose,
  onSelectLocation,
  currentLocationId,
}: LocationPickerModalProps) {
  const modalRef=useModalFocus(isOpen,onClose);
  const [query, setQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Modal açıldığında inputa odaklan
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      setGpsMessage(null);
      return () => clearTimeout(timer);
      setGpsMessage(null);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return foodDiscoveryProvider.searchLocations(query);
  }, [query, foodDiscoveryProvider]);

  const readyRegions = useMemo(() => {
    return foodDiscoveryProvider.getReadyRegions();
  }, [foodDiscoveryProvider]);

  const comingSoonRegions = useMemo(() => {
    return foodDiscoveryProvider.searchLocations('').filter((l) => l.status === 'coming_soon');
  }, [foodDiscoveryProvider]);

  const groupedReadyRegions = useMemo(() => {
    const groups = new Map<string, FoodLocation[]>();
    for (const loc of readyRegions) {
      const groupKey =
        loc.city && loc.district
          ? `${loc.city.toLocaleUpperCase('tr')} · ${loc.district.toLocaleUpperCase('tr')}`
          : 'DOĞRULANMIŞ BÖLGELER';
      const arr = groups.get(groupKey) || [];
      arr.push(loc);
      groups.set(groupKey, arr);
    }
    return Array.from(groups.entries());
  }, [readyRegions]);

  // GPS ile Konumumu Kullan
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }

    setGpsLoading(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;

        // En yakın hazır bölgeyi bul
        let nearestLoc: FoodLocation | null = null;
        let minDistance = Infinity;

        for (const loc of readyRegions) {
          if (loc.center) {
            const dist = haversineMeters({ lat: latitude, lng: longitude }, loc.center);
            if (dist < minDistance) {
              minDistance = dist;
              nearestLoc = loc;
            }
          }
        }

        if (nearestLoc && minDistance <= FOOD_DISCOVERY.nearbySuggestionRadiusMeters) {
          const km = (minDistance / 1000).toFixed(1);
          setGpsMessage(`Konumunuza en yakın bölge: ${nearestLoc.name} (~${km} km)`);
          onSelectLocation(nearestLoc);
          onClose();
        } else {
          setGpsMessage(
            "Konumunuza yakın aktif bir rehber henüz bulunmuyor. Şu an Kuşadası, Kadıköy, Moda, Yeldeğirmeni, Caddebostan ve Suadiye rehberleri yayındadır."
          );
        }
      },
      (error) => {
        setGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsMessage('Konum izni verilmedi. Aşağıdaki listeden seçebilirsiniz.');
        } else {
          setGpsMessage('Konum bilgisi alınamadı. Lütfen listeden bir bölge seçin.');
        }
      },
      { timeout: 8000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-200 p-0 sm:p-4"
      onClick={onClose}
    >
      <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Konum seçimi"
        className="w-full sm:max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-250 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobil Tutamaç */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Başlığı */}
        <div className="px-5 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-950 tracking-tight">
              Konum Seç
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Keşfetmek istediğiniz bölgeyi arayın veya listeden seçin
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Arama Inputu */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="İl, ilçe veya semt ara (Kuşadası, İstanbul, Kadıköy, Moda)"
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Konumumu Kullan Butonu */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            className="w-full mt-2.5 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-xs font-bold transition active:scale-98 disabled:opacity-50"
          >
            <Navigation size={14} className={gpsLoading ? 'animate-spin' : ''} />
            <span>{gpsLoading ? 'Konum belirleniyor...' : 'Konumumu Kullan (En Yakın Bölge)'}</span>
          </button>

          {gpsMessage && (
            <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900 text-[11px] font-medium flex items-start gap-1.5 leading-snug">
              <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{gpsMessage}</span>
            </div>
          )}
        </div>

        {/* Liste Alanı */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh]">
          {/* Arama Sonuçları */}
          {query.trim() !== '' ? (
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Arama Sonuçları ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                  &quot;{query}&quot; için bölge bulunamadı. Lütfen başka bir arama yapın.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {searchResults.map((loc) => {
                    const isSelected = loc.id === currentLocationId;
                    const isAvailable = loc.status !== 'coming_soon';

                    return (
                      <button
                        key={loc.id}
                        onClick={() => {
                          if (isAvailable) {
                            onSelectLocation(loc);
                            onClose();
                          }
                        }}
                        disabled={!isAvailable}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : isAvailable
                            ? 'bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-150'
                            : 'bg-slate-50/50 text-slate-400 border border-slate-100 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            <MapPin size={15} />
                          </div>
                          <div>
                            {/* TAG'LER KALDIRILDI: SADECE TEMİZ ŞEHİR / BÖLGE İSMİ */}
                            <div className="text-sm font-black leading-tight text-slate-900">
                              <span className={isSelected ? 'text-white' : 'text-slate-950'}>
                                {loc.displayName}
                              </span>
                            </div>
                            <div className={`text-[11px] mt-0.5 font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                              {loc.characterSubtitle || loc.scopeNote || 'Gastronomi rehberi'}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center">
                              <Check size={14} />
                            </div>
                          ) : isAvailable ? (
                            <ChevronRight size={16} className="text-slate-400" />
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
                              Yakında
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Varsayılan: İl · İlçe · Semt Hiyerarşisiyle Hazır Bölgeler */
            <div className="space-y-5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                  Yayındaki Doğrulanmış Bölgeler (İl · İlçe · Semt)
                </div>
                <div className="space-y-3">
                  {groupedReadyRegions.map(([groupLabel, locs]) => (
                    <div key={groupLabel} className="space-y-2">
                      <div className="text-[11px] font-extrabold tracking-wide text-blue-700 px-1">
                        {groupLabel}
                      </div>
                      {locs.map((loc) => {
                        const isSelected = loc.id === currentLocationId;
                        return (
                          <button
                            key={loc.id}
                            onClick={() => {
                              onSelectLocation(loc);
                              onClose();
                            }}
                            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border transition active:scale-99 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                              }`}>
                                <MapPin size={17} />
                              </div>
                              <div>
                                <div className={`text-sm font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-950'}`}>
                                  {loc.displayName}
                                </div>
                                <div className={`text-[11px] mt-0.5 font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                  {loc.characterSubtitle || loc.scopeNote || 'Gastronomi rehberi'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isSelected ? (
                                <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center">
                                  <Check size={14} />
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
                                  Seç <ArrowRight size={13} />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {comingSoonRegions.length > 0 && (
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Sıradaki Bölgeler (İl · İlçe · Semt)
                  </div>
                  <div className="space-y-1.5">
                    {comingSoonRegions.map((loc) => (
                      <div
                        key={loc.id}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-500"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-slate-700 truncate">
                            {loc.city && loc.district && loc.neighborhood
                              ? `${loc.city} · ${loc.district} · ${loc.neighborhood}`
                              : loc.displayName}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 flex-shrink-0">
                          Yakında
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
