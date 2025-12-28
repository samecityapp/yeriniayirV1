'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MapPin, Star, ListFilter as Filter, SlidersHorizontal, AlertCircle, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Hotel, Tag, PriceTag } from '@/lib/types';
import { getLocalizedText } from '@/lib/localization';
import HotelListSkeleton from '@/components/skeletons/HotelListSkeleton';
import * as LucideIcons from 'lucide-react';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const locationQuery = searchParams.get('location') || '';

  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [priceTags, setPriceTags] = useState<PriceTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('score');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: hotelsData } = await supabase
          .from('hotels')
          .select('*')
          .is('deleted_at', null);

        const { data: tagsData } = await supabase
          .from('tags')
          .select('*')
          .is('deleted_at', null)
          .order('name', { ascending: true });

        const { data: priceTagsData } = await supabase
          .from('price_tags')
          .select('*')
          .is('deleted_at', null)
          .order('min_price', { ascending: true });

        if (hotelsData) {
          const mappedHotels: Hotel[] = hotelsData.map(h => ({
            id: h.id,
            name: h.name,
            location: h.location,
            price: h.price,
            gnkScore: parseFloat(h.rating) || 0,
            coverImageUrl: h.image_url,
            tags: h.tags || [],
            amenities: h.amenities || [],
            galleryImages: h.gallery_images || [],
            about: h.about || getLocalizedText(h.description),
            description: h.description || h.name
          }));
          setAllHotels(mappedHotels);
        }

        if (tagsData) {
          const mappedTags = tagsData.map(t => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            icon: t.icon || 'Tag',
            isFeatured: t.is_featured || false
          }));
          setAllTags(mappedTags);
        }

        if (priceTagsData) {
          const mappedPriceTags = priceTagsData.map(p => ({
            id: p.id,
            label: p.label,
            slug: p.slug,
            minPrice: p.min_price,
            maxPrice: p.max_price
          }));
          setPriceTags(mappedPriceTags);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    let processedHotels = [...allHotels];

    if (typeof window !== 'undefined' && window.gtag && (query || locationQuery)) {
      window.gtag('event', 'search_query', {
        search_term: query || locationQuery,
        location: locationQuery || '',
        query_type: locationQuery ? 'location' : query ? 'keyword' : 'all'
      });
    }

    if (locationQuery) {
      const locationLower = locationQuery.toLocaleLowerCase('tr-TR');
      processedHotels = processedHotels.filter(hotel =>
        getLocalizedText(hotel.location).toLocaleLowerCase('tr-TR').includes(locationLower)
      );
    } else {
      const priceQuery = priceTags.find(pt => pt.slug === query);
      if (priceQuery) {
        processedHotels = processedHotels.filter(hotel => {
          return hotel.price >= priceQuery.minPrice && hotel.price <= priceQuery.maxPrice;
        });
      } else {
        const tagQuery = allTags.find(t => t.slug === query);
        if (tagQuery) {
          processedHotels = processedHotels.filter(hotel =>
            hotel.tags?.includes(tagQuery.slug)
          );
        } else if (query) {
          const searchLower = query.toLocaleLowerCase('tr-TR');
          processedHotels = processedHotels.filter(hotel => {
            const nameMatch = getLocalizedText(hotel.name).toLocaleLowerCase('tr-TR').includes(searchLower);
            const locationMatch = getLocalizedText(hotel.location).toLocaleLowerCase('tr-TR').includes(searchLower);
            const aboutText = getLocalizedText(hotel.about);
            const aboutMatch = aboutText ? aboutText.toLocaleLowerCase('tr-TR').includes(searchLower) : false;
            const tagMatch = hotel.tags?.some(tagSlug => {
              const tag = allTags.find(t => t.slug === tagSlug);
              return tag ? getLocalizedText(tag.name).toLocaleLowerCase('tr-TR').includes(searchLower) : false;
            });
            return nameMatch || locationMatch || aboutMatch || tagMatch;
          });
        }
      }
    }

    if (selectedTags.length > 0) {
      processedHotels = processedHotels.filter(hotel =>
        selectedTags.every(selectedTagSlug =>
          hotel.tags?.includes(selectedTagSlug)
        )
      );
    }
    processedHotels.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return getLocalizedText(a.name).localeCompare(getLocalizedText(b.name));
        default: return b.gnkScore - a.gnkScore;
      }
    });
    setFilteredHotels(processedHotels);
  }, [query, locationQuery, allHotels, selectedTags, sortBy, isLoading, priceTags, allTags]);

  const handleTagChange = (tagSlug: string) => {
    setSelectedTags(currentTags =>
      currentTags.includes(tagSlug)
        ? currentTags.filter(slug => slug !== tagSlug)
        : [...currentTags, tagSlug]
    );

    if (typeof window !== 'undefined' && window.gtag) {
      const tag = allTags.find(t => t.slug === tagSlug);
      window.gtag('event', 'filter_applied', {
        filter_type: 'tag',
        filter_value: tag ? getLocalizedText(tag.name) : tagSlug
      });
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSortBy('score');
  };

  const getSearchTitle = () => {
    if (locationQuery) {
      return `${locationQuery} Otelleri`;
    }

    const priceQuery = priceTags.find(pt => pt.slug === query);
    if (priceQuery) return `${priceQuery.label} Oteller`;

    const tagQuery = allTags.find(t => t.slug === query);
    if (tagQuery) return `${getLocalizedText(tagQuery.name)} Oteller`;

    if (query) {
      const decodedQuery = decodeURIComponent(query);
      return `"${decodedQuery}" için Arama Sonuçları`;
    }
    return 'Tüm Oteller';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  const FilterPanel = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-gray-900 mb-2 tracking-tight">Otel Özellikleri</h3>
        <div className="space-y-0.5">
          {allTags.map(tag => {
            const iconName = tag.icon || 'Tag';
            const Icon = (LucideIcons as any)[iconName] || LucideIcons.Tag;
            const isSelected = selectedTags.includes(tag.slug);
            return (
              <label key={tag.id} className="flex items-center gap-2 cursor-pointer group py-1 px-1.5 rounded-md hover:bg-gray-50 transition-colors">
                <div className={`relative flex items-center justify-center w-4 h-4 rounded border-2 transition-all ${isSelected
                  ? 'bg-gray-900 border-gray-900'
                  : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleTagChange(tag.slug)}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <Icon className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{getLocalizedText(tag.name)}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-gray-900 mb-2 tracking-tight">Sıralama</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 bg-white hover:border-gray-300 focus:border-gray-900 focus:ring-0 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3cpath%20d%3D%22M7%207l3-3%203%203m0%206l-3%203-3-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em] bg-[right_0.4rem_center] bg-no-repeat pr-8"
        >
          <option value="score">Yerini Ayır Puanına Göre</option>
          <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
          <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
          <option value="name">İsme Göre (A-Z)</option>
        </select>
      </div>
      {selectedTags.length > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2 px-3 text-xs font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Filtreleri Temizle
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{getSearchTitle()}</h1>
            <p className="text-gray-600">{filteredHotels.length} otel bulundu</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40 hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filtrele
          </button>
        </div>

        {showFilters && (
          <div className="lg:hidden bg-white p-6 rounded-xl shadow-sm mb-6">
            <FilterPanel />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-4">Filtreler</h2>
              <FilterPanel />
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <HotelListSkeleton key={idx} />
                ))
              ) : filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <Link key={hotel.id} href={`/otel/${hotel.id}`} className="block">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-72 h-56 md:h-auto flex-shrink-0 relative overflow-hidden">
                          <Image
                            src={hotel.coverImageUrl || 'https://placehold.co/400x300/e2e8f0/64748b?text=GNK'}
                            alt={getLocalizedText(hotel.name)}
                            fill
                            sizes="(max-width: 768px) 100vw, 288px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1.5" />
                            <span className="font-bold text-gray-900">{hotel.gnkScore.toFixed(1)}/10</span>
                          </div>
                        </div>
                        <div className="flex-1 p-5 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">{getLocalizedText(hotel.name)}</h3>
                            <div className="text-right ml-4 flex-shrink-0">
                              <div className="text-lg font-bold text-gray-900 whitespace-nowrap">{hotel.price.toLocaleString('tr-TR')} ₺</div>
                              <div className="text-xs text-gray-500">gecelik</div>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm mb-3">
                            <MapPin className="w-4 h-4 mr-1.5" />
                            <span>{getLocalizedText(hotel.location)}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                            {getLocalizedText(hotel.about) || 'Bu muhteşem otel, konforlu konaklama deneyimi sunar.'}
                          </p>
                          {hotel.tags && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                              {hotel.tags.slice(0, 4).map(tagSlug => {
                                const tagInfo = allTags.find(t => t.slug === tagSlug);
                                if (!tagInfo) return null;
                                const iconName = tagInfo.icon || 'Tag';
                                const Icon = (LucideIcons as any)[iconName] || LucideIcons.Tag;
                                return (<span key={tagSlug} className="flex items-center text-xs text-gray-600"><Icon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />{getLocalizedText(tagInfo.name)}</span>)
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {locationQuery
                      ? `${getSearchTitle()} Bulunamadı`
                      : 'Sonuç Bulunamadı'}
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    {locationQuery
                      ? 'Henüz bu konumdan otel önerimiz bulunmuyor. Ancak diğer harika otellerimize göz atabilirsiniz.'
                      : 'Arama kriterlerinize uygun otel bulunamadı. Filtreleri temizleyerek veya farklı bir arama yaparak tekrar deneyebilirsiniz.'}
                  </p>

                  <div className="flex justify-center gap-4">
                    {locationQuery ? (
                      <Link
                        href="/search"
                        className="px-8 py-3 bg-[#FF385C] hover:bg-[#D90B3E] text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        Tüm Otelleri Gör
                      </Link>
                    ) : (
                      selectedTags.length > 0 && (
                        <button
                          onClick={clearFilters}
                          className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                          Filtreleri Temizle
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}