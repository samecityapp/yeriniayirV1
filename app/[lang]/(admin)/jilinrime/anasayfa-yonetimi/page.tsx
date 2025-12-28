'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Hotel, Group } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getLocalizedText } from '@/lib/localization';

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
      } catch (e) { }
    }
    return { tr: val, en: '', de: '' };
  }

  return { tr: String(val), en: '', de: '' };
};

export default function AnasayfaYonetimiPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [groupsData, rawHotelsData] = await Promise.all([
        db.groups.getAll(),
        db.hotels.getAll()
      ]);

      // Parse localized fields for hotels
      const hotelsData = rawHotelsData.map((h: any) => ({
        ...h,
        name: tryParseLocalized(h.name),
        location: tryParseLocalized(h.location),
        description: tryParseLocalized(h.description || '')
      }));

      const groupsWithHotels = await Promise.all(
        groupsData.map(async (group) => {
          const hotelIds = await db.groups.getHotels(group.id);
          return { ...group, hotelIds };
        })
      );

      setGroups(groupsWithHotels);
      setHotels(hotelsData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert(`Veri yüklenirken hata: ${error?.message || 'Bilinmeyen hata'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleHotel = (hotelId: string) => {
    setSelectedHotelIds(current => {
      if (current.includes(hotelId)) {
        return current.filter(id => id !== hotelId);
      }
      if (current.length >= 4) {
        alert('Bir grupta maksimum 4 otel olabilir!');
        return current;
      }
      return [...current, hotelId];
    });
  };

  const handleCreateGroup = async () => {
    if (!newGroupTitle.trim()) {
      alert('Grup basligi bos olamaz!');
      return;
    }
    if (selectedHotelIds.length === 0) {
      alert('En az 1 otel secmelisiniz!');
      return;
    }

    try {
      await db.groups.create({
        title: newGroupTitle.trim(),
        isPublished: false,
        hotelIds: []
      }, selectedHotelIds);

      setNewGroupTitle('');
      setSelectedHotelIds([]);
      setIsCreating(false);
      await loadData();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Grup olusturulurken hata olustu!');
    }
  };

  const handleTogglePublish = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      try {
        await db.groups.update(groupId, { isPublished: !group.isPublished });
        await loadData();
      } catch (error) {
        console.error('Error updating group:', error);
        alert('Grup guncellenirken hata olustu!');
      }
    }
  };

  const handleDeleteGroup = async (groupId: string, title: string) => {
    if (!confirm(`"${title}" grubunu silmek istediginizden emin misiniz?`)) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Deleting group:', groupId);
      const result = await db.groups.delete(groupId);
      console.log('Delete result:', result);

      await loadData();
      alert('Grup başarıyla silindi!');
    } catch (error: any) {
      console.error('Error deleting group:', error);
      const errorMessage = error?.message || error?.toString() || 'Bilinmeyen hata';
      alert(`Grup silinirken hata oluştu: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getHotelsByIds = (hotelIds: string[]) => {
    return hotelIds.map(id => hotels.find(h => h.id === id)).filter((h): h is Hotel => h !== undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="ml-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Ana Sayfa Gruplari</h1>
          <Button onClick={() => setIsCreating(!isCreating)} size="lg">
            <Plus className="mr-2" size={18} />
            Yeni Grup Olustur
          </Button>
        </div>

        {isCreating && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Yeni Grup Olustur</h2>

            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="groupTitle">Grup Basligi</Label>
                <Input
                  id="groupTitle"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="Örn: Akdenizin Incileri"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>Oteller Secin (Maksimum 4 - Secili: {selectedHotelIds.length}/4)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
                  {hotels.map(hotel => (
                    <div
                      key={hotel.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedHotelIds.includes(hotel.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => handleToggleHotel(hotel.id)}
                    >
                      <Checkbox
                        checked={selectedHotelIds.includes(hotel.id)}
                        onCheckedChange={() => handleToggleHotel(hotel.id)}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{getLocalizedText(hotel.name)}</p>
                        <p className="text-sm text-gray-600">{getLocalizedText(hotel.location)}</p>
                      </div>
                      {hotel.coverImageUrl && (
                        <Image
                          src={hotel.coverImageUrl}
                          alt={getLocalizedText(hotel.name)}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCreateGroup} className="flex-1">
                <Save className="mr-2" size={18} />
                Grubu Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewGroupTitle('');
                  setSelectedHotelIds([]);
                }}
                className="flex-1"
              >
                Iptal
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {groups.map(group => {
            const groupHotels = getHotelsByIds(group.hotelIds);
            return (
              <div
                key={group.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{group.title}</h3>
                      <p className="text-gray-600">{groupHotels.length} otel</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={group.isPublished ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleTogglePublish(group.id)}
                      >
                        {group.isPublished ? (
                          <>
                            <Eye className="mr-2" size={16} />
                            Yayinda
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-2" size={16} />
                            Taslak
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteGroup(group.id, group.title)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {groupHotels.map(hotel => (
                      <div key={hotel.id} className="border rounded-lg overflow-hidden">
                        <div className="relative aspect-video bg-gray-200">
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
                        <div className="p-3">
                          <p className="font-semibold text-sm truncate">{getLocalizedText(hotel.name)}</p>
                          <p className="text-xs text-gray-600 truncate">{getLocalizedText(hotel.location)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {groups.length === 0 && !isCreating && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">Henuz grup olusturulmamis</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2" size={18} />
                Ilk Grubu Olustur
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
