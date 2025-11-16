'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MapPin, Star, ListFilter as Filter, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Hotel, Tag, PriceTag } from '@/lib/types';
import HotelListSkeleton from '@/components/skeletons/HotelListSkeleton';
import * as LucideIcons from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
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
            about: h.about || h.description
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
              const nameMatch = hotel.name.toLocaleLowerCase('tr-TR').includes(searchLower);
              const locationMatch = hotel.location.toLocaleLowerCase('tr-TR').includes(searchLower);
              const aboutMatch = hotel.about?.toLocaleLowerCase('tr-TR').includes(searchLower);
              const tagMatch = hotel.tags?.some(tagSlug => {
                const tag = allTags.find(t => t.slug === tagSlug);
                return tag?.name.toLocaleLowerCase('tr-TR').includes(searchLower);
              });
              return nameMatch || locationMatch || aboutMatch || tagMatch;
          });
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
        case 'name': return a.name.localeCompare(b.name);
        default: return b.gnkScore - a.gnkScore;
      }
    });
    setFilteredHotels(processedHotels);
  }, [query, allHotels, selectedTags, sortBy, isLoading, priceTags]);

  const handleTagChange = (tagSlug: string) => {
    setSelectedTags(currentTags => 
      currentTags.includes(tagSlug)
        ? currentTags.filter(slug => slug !== tagSlug)
        : [...currentTags, tagSlug]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSortBy('score');
  };

  const getSearchTitle = () => {
    const priceQuery = priceTags.find(pt => pt.slug === query);
    if (priceQuery) return `${priceQuery.label} Oteller`;

    const tagQuery = allTags.find(t => t.slug === query);
    if (tagQuery) return `${tagQuery.name} Oteller`;

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
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">Otel Özellikleri</h3>
        <div className="space-y-2">
          {allTags.map(tag => {
            const iconName = tag.icon || 'Tag';
            const Icon = (LucideIcons as any)[iconName] || LucideIcons.Tag;
            return (
              <label key={tag.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.slug)}
                  onChange={() => handleTagChange(tag.slug)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{tag.name}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">Sıralama</h3>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
          <option value="score">GNK Puanına Göre</option>
          <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
          <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
          <option value="name">İsme Göre (A-Z)</option>
        </select>
      </div>
      {selectedTags.length > 0 && (
          <button onClick={clearFilters} className="w-full text-sm text-blue-600 hover:underline">
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
            className="lg:hidden inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
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
                              alt={hotel.name}
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
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">{hotel.name}</h3>
                              <div className="text-right ml-4 flex-shrink-0">
                                <div className="text-lg font-bold text-gray-900 whitespace-nowrap">{hotel.price.toLocaleString('tr-TR')} ₺</div>
                                <div className="text-xs text-gray-500">gecelik</div>
                              </div>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm mb-3">
                              <MapPin className="w-4 h-4 mr-1.5" />
                              <span>{hotel.location}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                              {hotel.about || 'Bu muhteşem otel, konforlu konaklama deneyimi sunar.'}
                            </p>
                            {hotel.tags && (
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                {hotel.tags.slice(0, 4).map(tagSlug => {
                                  const tagInfo = allTags.find(t => t.slug === tagSlug);
                                  if (!tagInfo) return null;
                                  const iconName = tagInfo.icon || 'Tag';
                                  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Tag;
                                  return (<span key={tagSlug} className="flex items-center text-xs text-gray-600"><Icon className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>{tagInfo.name}</span>)
                                })}
                              </div>
                            )}
                          </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-xl">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                  <p className="text-gray-500 mb-6">Filtrelerinize uygun otel bulunamadı.</p>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}