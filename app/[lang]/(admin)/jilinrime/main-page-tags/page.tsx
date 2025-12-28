'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tag, PriceTag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { getLocalizedText } from '@/lib/localization';

export default function MainPageTagsPage() {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [priceTags, setPriceTags] = useState<PriceTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newPriceTag, setNewPriceTag] = useState({ label: '', minPrice: 0, maxPrice: 0 });

  const loadData = async () => {
    setIsLoading(true);
    try {
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

      if (tagsData) {
        setAllTags(tagsData.map(t => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          icon: t.icon || 'Tag',
          isFeatured: t.is_featured || false
        })));
      }

      if (priceTagsData) {
        setPriceTags(priceTagsData.map(p => ({
          id: p.id,
          label: p.label,
          slug: p.slug,
          minPrice: p.min_price,
          maxPrice: p.max_price
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFeatureToggle = async (tagId: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({ is_featured: isFeatured })
        .eq('id', tagId);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error updating tag:', error);
      alert('Etiket güncellenirken hata oluştu');
    }
  };

  const handleAddPriceTag = async () => {
    if (!newPriceTag.label || newPriceTag.maxPrice <= newPriceTag.minPrice) {
      alert('Lütfen geçerli bir etiket ve fiyat aralığı girin.');
      return;
    }

    try {
      const slug = newPriceTag.label
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const { error } = await supabase
        .from('price_tags')
        .insert([{
          label: newPriceTag.label,
          slug: slug,
          min_price: newPriceTag.minPrice,
          max_price: newPriceTag.maxPrice
        }]);

      if (error) throw error;
      setNewPriceTag({ label: '', minPrice: 0, maxPrice: 0 });
      loadData();
    } catch (error) {
      console.error('Error adding price tag:', error);
      alert('Fiyat etiketi eklenirken hata oluştu');
    }
  };

  const handleDeletePriceTag = async (id: string) => {
    if (!confirm('Bu fiyat aralığını silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('price_tags')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting price tag:', error);
      alert('Fiyat etiketi silinirken hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="ml-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ana Sayfa Kısayol Etiketleri</h1>
        <p className="text-gray-600">Ana sayfada görünecek kısayol etiketlerini ve fiyat aralıklarını yönetin</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-2">Popüler Özellikler</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ana sayfada görünecek özellik etiketlerini buradan seçin. Bu etiketler, "Etiket Yönetimi" sayfasından eklenir.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allTags.map(tag => (
            <div key={tag.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Switch
                id={tag.id}
                checked={tag.isFeatured || false}
                onCheckedChange={(checked) => handleFeatureToggle(tag.id, checked)}
              />
              <Label htmlFor={tag.id} className="font-medium cursor-pointer flex-1">
                {getLocalizedText(tag.name)}
              </Label>
            </div>
          ))}
        </div>
        {allTags.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>Henüz etiket eklenmemiş. Önce "Etiket Yönetimi" sayfasından etiket ekleyin.</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-2">Fiyat Aralığı Etiketleri</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ana sayfada görünecek fiyat aralıklarını buradan yönetin (en fazla 5 tane önerilir).
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border mb-6">
          <h3 className="font-semibold mb-4">Yeni Fiyat Aralığı Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="price-label">Etiket Adı</Label>
              <Input
                id="price-label"
                value={newPriceTag.label}
                onChange={e => setNewPriceTag(v => ({...v, label: e.target.value}))}
                placeholder="örn: 2000 TL Altı"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-min">Min Fiyat (TL)</Label>
              <Input
                id="price-min"
                type="number"
                value={newPriceTag.minPrice}
                onChange={e => setNewPriceTag(v => ({...v, minPrice: parseInt(e.target.value) || 0}))}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-max">Maks Fiyat (TL)</Label>
              <Input
                id="price-max"
                type="number"
                value={newPriceTag.maxPrice}
                onChange={e => setNewPriceTag(v => ({...v, maxPrice: parseInt(e.target.value) || 0}))}
                className="h-11"
              />
            </div>
            <Button onClick={handleAddPriceTag} className="h-11">
              <PlusCircle className="mr-2 h-4 w-4"/> Ekle
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Mevcut Fiyat Aralıkları ({priceTags.length})</h3>
          <ul className="space-y-2">
            {priceTags.map(pt => (
              <li key={pt.id} className="p-4 flex justify-between items-center border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <span className="font-semibold text-lg">{pt.label}</span>
                  <span className="text-sm text-gray-500 ml-3">
                    ({new Intl.NumberFormat('tr-TR').format(pt.minPrice)} TL - {new Intl.NumberFormat('tr-TR').format(pt.maxPrice)} TL)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePriceTag(pt.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </li>
            ))}
          </ul>
          {priceTags.length === 0 && (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
              <p>Henüz fiyat aralığı eklenmemiş</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
