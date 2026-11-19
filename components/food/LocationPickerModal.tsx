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
import { findNearestPublishedRegion } from '@/lib/food/maps';
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
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // Modal açıldığında inputa odaklan
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      setGpsMessage(null);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setGpsLoading(false);
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
    if (gpsLoading) return;

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsMessage('Tarayıcınız konum servisini desteklemiyor. Aşağıdaki listeden seçebilirsiniz.');
      return;
    }

    setGpsLoading(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isOpenRef.current) return;
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;

        const match = findNearestPublishedRegion(
          { lat: latitude, lng: longitude },
          readyRegions,
          FOOD_DISCOVERY.nearbySuggestionRadiusMeters
        );

        if (match) {
          const distLabel = match.insideBoundary
            ? 'Bölge içindesiniz'
            : `~${(match.distanceMeters / 1000).toFixed(1)} km`;
          setGpsMessage(`Konumunuza en yakın bölge: ${match.location.name} (${distLabel})`);
          onSelectLocation(match.location);
          onClose();
        } else {
          setGpsMessage(
            `Konumunuza yakın aktif bir rehber bulunamadı (${readyRegions.length} bölgeden arama kutusuyla veya listeden seçebilirsiniz).`
          );
        }
      },
      (error) => {
        if (!isOpenRef.current) return;
        setGpsLoading(false);
        if (error.code === 1) {
          setGpsMessage('Konum izni verilmedi. Aşağıdaki listeden bölge seçebilirsiniz.');
        } else if (error.code === 3) {
          setGpsMessage('Konum belirleme zaman aşımına uğradı. Aşağıdaki listeden seçebilirsiniz.');
        } else {
          setGpsMessage('Konum bilgisi alınamadı. Lütfen listeden bir bölge seçin.');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#181210]/60 backdrop-blur-sm transition-opacity duration-200 p-0 sm:p-4"
      onClick={onClose}
    >
      <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Konum seçimi"
        className="w-full sm:max-w-md bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-[#EFE5DF] flex flex-col max-h-[88vh] supports-[height:100dvh]:max-h-[88dvh] overflow-hidden animate-in slide-in-from-bottom duration-250 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobil Tutamaç */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-[#DFD0C8] rounded-full" />
        </div>

        {/* Modal Başlığı */}
        <div className="px-4 sm:px-5 pt-3 pb-3 border-b border-[#EFE5DF] flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-black text-[#181210] tracking-tight">
              Konum Seç
            </h3>
            <p className="text-[11px] text-[#68554E] font-medium">
              Keşfetmek istediğiniz bölgeyi arayın veya listeden seçin
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF6F2] hover:bg-[#EFE5DF] text-[#181210] flex items-center justify-center flex-shrink-0 transition"
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Arama Inputu */}
        <div className="p-3.5 sm:p-4 border-b border-[#EFE5DF]">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A756D]" />
            <input
              ref={inputRef}
              type="text"
              maxLength={80}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="İl, ilçe veya semt ara (Taksim & İstiklal, Asmalımescit & Pera, Yeniköy, Göktürk, Galata, Beşiktaş Çarşı, Karaköy, Cihangir, Nişantaşı, Fenerbahçe, Kalamış, Üsküdar, Kuzguncuk, Çengelköy, Feneryolu, Kadıköy, Kaleiçi, Konyaaltı Sahil, Lara, Kaş Merkez, Kalkan Merkez, Alanya Merkez, Side, Kemer, Akyaka & Akçapınar, Yanıklar, Göcek, Fethiye Merkez, Çalış, Ölüdeniz, Bodrum Merkez, Yalıkavak, Gümüşlük, Türkbükü, Bitez, Turgutreis, Ortakent & Yahşi, Gündoğan, Gümbet, Torba, Akyarlar, Marmaris Merkez, Datça Merkez, Alsancak, Bostanlı, Karşıyaka, Bornova, Göztepe & Güzelyalı, Mavişehir, Alaçatı, Urla, Sığacık, Foça, Şanlıurfa Merkez, Mardin Merkez, Diyarbakır Merkez, Hatay Merkez, İskenderun Merkez, Adana Merkez, Mersin Merkez, Kızılay, Tunalı Hilmi, Bahçelievler & 7. Cadde, Gaziosmanpaşa, Çayyolu & Park Caddesi, Ümitköy & Beysukent, Ayrancı, Çukurambar, Aydın Merkez, Balıkesir Merkez, Ayvalık Merkez, Cunda, Bursa Merkez, Çanakkale Merkez, Edirne Merkez, Eskişehir Merkez, Denizli Merkez, Rize Merkez, Trabzon Merkez)"
              className="w-full pl-10 pr-9 py-2.5 bg-[#FAF6F2] hover:bg-[#F5EFEA] focus:bg-white border border-[#E6D9D0] focus:border-[#C42B1C] rounded-xl text-sm font-semibold text-[#181210] placeholder:text-[#8A756D] focus:outline-none focus:ring-2 focus:ring-[#C42B1C]/20 transition"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A756D] hover:text-[#181210]"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Konumumu Kullan Butonu */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            className="w-full mt-2.5 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FFF3F0] hover:bg-[#FFE6E0] text-[#A61E11] border border-[#F5CEC6] text-xs font-bold transition active:scale-[0.98] disabled:opacity-50"
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
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-4">
          {/* Arama Sonuçları */}
          {query.trim() !== '' ? (
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-[#8A756D] mb-2">
                Arama Sonuçları ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-[#8A756D] text-xs font-medium">
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
                        className={`w-full flex items-center justify-between gap-2.5 sm:gap-3 p-3 rounded-2xl text-left transition ${
                          isSelected
                            ? 'bg-[#C42B1C] text-white shadow-md shadow-[#C42B1C]/20'
                            : isAvailable
                            ? 'bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#181210] border border-[#EAE0D8]'
                            : 'bg-[#FAF6F2]/60 text-[#8A756D] border border-[#EFE5DF] cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#EFE5DF] text-[#B82516]'
                          }`}>
                            <MapPin size={15} />
                          </div>
                          <div className="min-w-0">
                            {/* TAG'LER KALDIRILDI: SADECE TEMİZ ŞEHİR / BÖLGE İSMİ */}
                            <div className="text-sm font-black leading-tight text-[#181210] break-words">
                              <span className={isSelected ? 'text-white' : 'text-[#181210]'}>
                                {loc.displayName}
                              </span>
                            </div>
                            <div className={`text-[11px] mt-0.5 font-medium line-clamp-2 break-words ${isSelected ? 'text-[#FFE4DE]' : 'text-[#68554E]'}`}>
                              {loc.characterSubtitle || loc.scopeNote || 'Gastronomi rehberi'}
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-white text-[#C42B1C] flex items-center justify-center">
                              <Check size={14} />
                            </div>
                          ) : isAvailable ? (
                            <ChevronRight size={16} className="text-[#8A756D]" />
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFE5DF] text-[#68554E]">
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
                <div className="text-[10px] font-black uppercase tracking-wider text-[#8A756D] mb-2.5">
                  Yayındaki Doğrulanmış Bölgeler (İl · İlçe · Semt)
                </div>
                <div className="space-y-3">
                  {groupedReadyRegions.map(([groupLabel, locs]) => (
                    <div key={groupLabel} className="space-y-2">
                      <div className="text-[11px] font-extrabold tracking-wide text-[#A61E11] px-1">
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
                            className={`w-full flex items-center justify-between gap-2.5 sm:gap-3 p-3.5 rounded-2xl text-left border transition active:scale-[0.99] ${
                              isSelected
                                ? 'bg-[#C42B1C] text-white border-[#C42B1C] shadow-md shadow-[#C42B1C]/20'
                                : 'bg-white hover:bg-[#FAF6F2] text-[#181210] border-[#EAE0D8] shadow-xs'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-[#FFF3F0] text-[#C42B1C]'
                              }`}>
                                <MapPin size={17} />
                              </div>
                              <div className="min-w-0">
                                <div className={`text-sm font-black leading-tight break-words ${isSelected ? 'text-white' : 'text-[#181210]'}`}>
                                  {loc.displayName}
                                </div>
                                <div className={`text-[11px] mt-0.5 font-medium line-clamp-2 break-words ${isSelected ? 'text-[#FFE4DE]' : 'text-[#68554E]'}`}>
                                  {loc.characterSubtitle || loc.scopeNote || 'Gastronomi rehberi'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isSelected ? (
                                <div className="w-6 h-6 rounded-full bg-white text-[#C42B1C] flex items-center justify-center">
                                  <Check size={14} />
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-[#B82516] flex items-center gap-0.5">
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
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#8A756D] mb-2">
                    Sıradaki Bölgeler (İl · İlçe · Semt)
                  </div>
                  <div className="space-y-1.5">
                    {comingSoonRegions.map((loc) => (
                      <div
                        key={loc.id}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FAF6F2]/70 border border-[#EFE5DF] text-[#68554E]"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-[#3F332E] truncate">
                            {loc.city && loc.district && loc.neighborhood
                              ? `${loc.city} · ${loc.district} · ${loc.neighborhood}`
                              : loc.displayName}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFE5DF] text-[#68554E] flex-shrink-0">
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
