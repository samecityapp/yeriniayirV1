'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tag, PriceTag } from '@/lib/types';
import { getLocalizedText } from '@/lib/localization';
import { Search, MapPin, Tag as TagIcon, Hotel } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

type SearchSuggestion = {
  type: 'hotel' | 'location' | 'tag';
  value: string;
  label: string;
  icon?: string;
};

export default function SearchFilters() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [featuredTags, setFeaturedTags] = useState<Tag[]>([]);
  const [priceTags, setPriceTags] = useState<PriceTag[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allHotels, setAllHotels] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('*')
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (tagsError) {
          console.error('[SearchFilters] Tags error:', tagsError);
        }

        if (tagsData && tagsData.length > 0) {
          const mapped = tagsData.map(t => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            icon: t.icon || 'Tag',
            isFeatured: Boolean(t.is_featured)
          }));

          const featured = mapped.filter(t => t.isFeatured);

          setAllTags(mapped);
          setFeaturedTags(featured);
        }

        const { data: priceTagsData, error: priceError } = await supabase
          .from('price_tags')
          .select('*')
          .is('deleted_at', null)
          .order('min_price', { ascending: true });

        if (priceError) {
          console.error('[SearchFilters] Price tags error:', priceError);
        }

        if (priceTagsData && priceTagsData.length > 0) {
          setPriceTags(priceTagsData.map(p => ({
            id: p.id,
            label: p.label,
            slug: p.slug,
            minPrice: p.min_price,
            maxPrice: p.max_price
          })));
        }

        const { data: hotelsData } = await supabase
          .from('hotels')
          .select('id, name, location')
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (hotelsData) {
          setAllHotels(hotelsData);
        }

        setLoading(false);
      } catch (error) {
        console.error('[SearchFilters] Catch error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = debouncedQuery.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    allHotels
      .filter(hotel => getLocalizedText(hotel.name).toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(hotel => {
        newSuggestions.push({
          type: 'hotel',
          value: hotel.id,
          label: getLocalizedText(hotel.name),
          icon: 'Hotel'
        });
      });

    // Localize locations first, then deduplicate
    const normalizedLocations = Array.from(new Set(allHotels.map(h => getLocalizedText(h.location))));

    normalizedLocations
      .filter(loc => loc && loc.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(loc => {
        newSuggestions.push({
          type: 'location',
          value: loc,
          label: loc,
          icon: 'MapPin'
        });
      });

    allTags
      .filter(tag => getLocalizedText(tag.name).toLowerCase().includes(query) || tag.slug.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(tag => {
        newSuggestions.push({
          type: 'tag',
          value: tag.slug,
          label: getLocalizedText(tag.name),
          icon: tag.icon
        });
      });

    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  }, [debouncedQuery, allHotels, allTags]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'hotel') {
      router.push(`/otel/${suggestion.value}`);
    } else if (suggestion.type === 'location') {
      router.push(`/search?location=${encodeURIComponent(suggestion.value)}`);
    } else if (suggestion.type === 'tag') {
      router.push(`/search?q=${suggestion.value}`);
    }
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    }
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'hotel') return Hotel;
    if (suggestion.type === 'location') return MapPin;
    if (suggestion.icon && (LucideIcons as any)[suggestion.icon]) {
      return (LucideIcons as any)[suggestion.icon];
    }
    return TagIcon;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-full shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
        <div ref={searchRef} className="relative z-20">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Otel, konum veya özellik arayın..."
                className="w-full pl-12 pr-4 py-3 text-sm font-medium text-gray-800 bg-transparent rounded-l-full focus:outline-none placeholder:text-gray-400"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full px-6 py-2 m-1.5 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-1.5 text-sm"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Ara</span>
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden">
              <div className="overflow-y-auto max-h-96">
                {suggestions.map((suggestion, index) => {
                  const IconComponent = getSuggestionIcon(suggestion);
                  return (
                    <button
                      key={`${suggestion.type}-${suggestion.value}-${index}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-150 ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {suggestion.label}
                        </p>
                        <p className="text-xs text-gray-500 capitalize mt-0.5">
                          {suggestion.type === 'hotel' && 'Otel'}
                          {suggestion.type === 'location' && 'Konum'}
                          {suggestion.type === 'tag' && 'Özellik'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3 relative z-10">
        {featuredTags.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {featuredTags.slice(0, 5).map(tag => {
              const IconComponent = (tag.icon && (LucideIcons as any)[tag.icon]) || LucideIcons.Tag;
              return (
                <Link
                  key={tag.id}
                  href={`/search?q=${tag.slug}`}
                  className="group flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-gray-900 text-gray-700 hover:text-white rounded-full text-xs font-semibold transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-900"
                >
                  <IconComponent size={12} className="transition-transform group-hover:scale-110" />
                  {getLocalizedText(tag.name)}
                </Link>
              );
            })}
          </div>
        )}

        {priceTags.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            {priceTags.slice(0, 3).map((pt) => (
              <Link
                key={pt.id}
                href={`/search?q=${pt.slug}`}
                className="px-3 py-1.5 bg-transparent hover:bg-gray-900 text-gray-700 hover:text-white rounded-full text-xs font-semibold transition-all duration-200 border border-gray-300 hover:border-gray-900"
              >
                <span className="whitespace-nowrap">{pt.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
