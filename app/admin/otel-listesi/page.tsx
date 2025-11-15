'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Hotel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OtelListesiPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
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
        name: hotel.name,
        location: hotel.location,
        description: hotel.description || '',
        price: hotel.price || 0,
        gnkScore: hotel.rating || 0,
        coverImageUrl: hotel.image_url || '',
        tags: hotel.tags || [],
        amenities: hotel.amenities || []
      }));

      setHotels(mappedHotels);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Otel Listesi</h1>
          <Link href="/admin/otel-ekle">
            <Button size="lg">
              <Plus className="mr-2" size={18} />
              Yeni Otel Ekle
            </Button>
          </Link>
        </div>

        {hotels.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Henüz otel eklenmemiş</p>
            <Link href="/admin/otel-ekle">
              <Button>
                <Plus className="mr-2" size={18} />
                İlk Oteli Ekle
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {hotels.map(hotel => (
              <div
                key={hotel.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                    {hotel.coverImageUrl ? (
                      <img
                        src={hotel.coverImageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Resim Yok
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {hotel.name}
                        </h3>
                        <p className="text-gray-600">{hotel.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-semibold">{hotel.gnkScore.toFixed(1)}/10</span>
                        </div>
                        {hotel.price > 0 && (
                          <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                            {new Intl.NumberFormat('tr-TR').format(hotel.price)} TL
                          </div>
                        )}
                      </div>
                    </div>

                    {hotel.tags && hotel.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm"
                          >
                            {tag.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <Link href={`/admin/otel-ekle?id=${hotel.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Edit className="mr-2" size={16} />
                          Düzenle
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(hotel.id, hotel.name)}
                        className="flex-1"
                      >
                        <Trash2 className="mr-2" size={16} />
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
