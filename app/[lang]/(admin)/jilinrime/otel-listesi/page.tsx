'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Hotel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Star, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalizedText } from '@/lib/localization';
import { ReportGenerator } from '@/components/admin/ReportGenerator';

// Helper for localized data parsing
const tryParseLocalized = (val: any): { tr: string; en: string; de: string } => {
  if (!val) return { tr: '', en: '', de: '' };

  if (typeof val === 'object') {
    return {
      tr: val.tr || '',
      en: val.en || '',
      de: val.de || ''
    };
  }

  if (typeof val === 'string') {
    if (val.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(val);
        // Handle double-stringified JSON (recursive check)
        if (typeof parsed === 'string' && parsed.trim().startsWith('{')) {
          return tryParseLocalized(parsed);
        }
        if (typeof parsed === 'object' && parsed !== null) {
          return {
            tr: parsed.tr || '',
            en: parsed.en || '',
            de: parsed.de || ''
          };
        }
      } catch (e) {
        // Not a valid JSON, fallback below
      }
    }
    // Fallback: treat as plain string for default language (tr)
    return { tr: val, en: '', de: '' };
  }

  return { tr: String(val), en: '', de: '' };
};

export default function OtelListesiPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      const mappedHotels: Hotel[] = (data || []).map(hotel => ({
        id: hotel.id,
        name: tryParseLocalized(hotel.name),
        location: tryParseLocalized(hotel.location),
        description: tryParseLocalized(hotel.description || ''),
        price: hotel.price || 0,
        gnkScore: hotel.rating || 0,
        coverImageUrl: hotel.image_url || '',
        tags: hotel.tags || [],
        amenities: hotel.amenities || []
      }));

      setHotels(mappedHotels);
      setFilteredHotels(mappedHotels);
    } catch (err: any) {
      console.error('Oteller yüklenirken hata:', err);
      setError(err.message || 'Oteller yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHotels(hotels);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = hotels.filter(hotel =>
        getLocalizedText(hotel.name).toLowerCase().includes(query) ||
        getLocalizedText(hotel.location).toLowerCase().includes(query)
      );
      setFilteredHotels(filtered);
    }
  }, [searchQuery, hotels]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" otelini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchHotels();
    } catch (err: any) {
      console.error('Otel silinirken hata:', err);
      alert('Otel silinirken bir hata oluştu: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="ml-4 text-gray-600">Oteller yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchHotels}>Tekrar Dene</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-900">Otel Listesi</h1>
            <Link href="/jilinrime/otel-ekle">
              <Button size="lg">
                <Plus className="mr-2" size={18} />
                Yeni Otel Ekle
              </Button>
            </Link>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Otel adı veya lokasyon ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-5 text-base"
            />
          </div>
        </div>

        {filteredHotels.length === 0 && hotels.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Henüz otel eklenmemiş</p>
            <Link href="/jilinrime/otel-ekle">
              <Button>
                <Plus className="mr-2" size={18} />
                İlk Oteli Ekle
              </Button>
            </Link>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">Aramanıza uygun otel bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredHotels.map(hotel => (
              <div
                key={hotel.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-48 h-32 md:h-auto bg-gray-200 flex-shrink-0">
                    {hotel.coverImageUrl ? (
                      <Image
                        src={hotel.coverImageUrl}
                        alt={getLocalizedText(hotel.name)}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Resim Yok
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                          {getLocalizedText(hotel.name)}
                        </h3>
                        <p className="text-sm text-gray-600">{getLocalizedText(hotel.location)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-semibold text-sm">{hotel.gnkScore.toFixed(1)}/10</span>
                        </div>
                        {hotel.price > 0 && (
                          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            {new Intl.NumberFormat('tr-TR').format(hotel.price)} TL
                          </div>
                        )}
                      </div>
                    </div>

                    {hotel.tags && hotel.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {hotel.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs"
                          >
                            {tag.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Link href={`/jilinrime/otel-ekle?id=${hotel.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="mr-1.5" size={14} />
                          Düzenle
                        </Button>
                      </Link>
                      <ReportGenerator hotelId={hotel.id} hotelName={getLocalizedText(hotel.name)} />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(hotel.id, getLocalizedText(hotel.name))}
                        className="flex-1"
                      >
                        <Trash2 className="mr-1.5" size={14} />
                        Sil
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
