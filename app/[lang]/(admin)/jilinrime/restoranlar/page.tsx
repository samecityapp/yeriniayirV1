'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Restaurant, RestaurantCategory, RestaurantNote } from '@/lib/types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { turkeyLocations } from '@/data/turkeyLocations';
import { getLocalizedText } from '@/lib/localization';

export default function RestaurantsAdminPage() {
  const [categories, setCategories] = useState<RestaurantCategory[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    description: '',
    google_rating: 0,
    review_count: '',
    order_suggestion: '',
    display_order: 0,
    notes: [] as { emoji: string; text: string }[]
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchRestaurants();
    }
  }, [selectedLocation]);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('restaurant_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
      if (data && data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function fetchRestaurants() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          *,
          notes:restaurant_notes(*)
        `)
        .eq('location', selectedLocation)
        .order('display_order');

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      if (!selectedLocation || !selectedCategory) {
        alert('Lütfen konum ve kategori seçin');
        return;
      }

      const restaurantData = {
        category_id: selectedCategory,
        location: selectedLocation,
        name: formData.name,
        image_url: formData.image_url,
        description: formData.description,
        google_rating: formData.google_rating,
        review_count: formData.review_count,
        order_suggestion: formData.order_suggestion,
        display_order: formData.display_order
      };

      let restaurantId: string;

      if (editingRestaurant) {
        const { error } = await supabase
          .from('restaurants')
          .update(restaurantData)
          .eq('id', editingRestaurant.id);

        if (error) throw error;
        restaurantId = editingRestaurant.id!;

        await supabase
          .from('restaurant_notes')
          .delete()
          .eq('restaurant_id', restaurantId);
      } else {
        const { data, error } = await supabase
          .from('restaurants')
          .insert([restaurantData])
          .select()
          .single();

        if (error) throw error;
        restaurantId = data.id;
      }

      for (let i = 0; i < formData.notes.length; i++) {
        const note = formData.notes[i];
        await supabase
          .from('restaurant_notes')
          .insert([{
            restaurant_id: restaurantId,
            emoji: note.emoji,
            text: note.text,
            display_order: i
          }]);
      }

      resetForm();
      fetchRestaurants();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Kayıt sırasında hata oluştu');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu restoranı silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Silme işlemi başarısız');
    }
  }

  function handleEdit(restaurant: Restaurant) {
    setEditingRestaurant(restaurant);
    setSelectedCategory(restaurant.category_id || '');
    setFormData({
      name: getLocalizedText(restaurant.name),
      image_url: restaurant.image_url || '',
      description: getLocalizedText(restaurant.description),
      google_rating: restaurant.google_rating || 0,
      review_count: restaurant.review_count || '',
      order_suggestion: getLocalizedText(restaurant.order_suggestion),
      display_order: restaurant.display_order || 0,
      notes: restaurant.notes?.map(n => ({ emoji: n.emoji, text: getLocalizedText(n.text) })) || []
    });
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      name: '',
      image_url: '',
      description: '',
      google_rating: 0,
      review_count: '',
      order_suggestion: '',
      display_order: 0,
      notes: []
    });
    setEditingRestaurant(null);
    setShowForm(false);
  }

  function addNote() {
    setFormData({
      ...formData,
      notes: [...formData.notes, { emoji: '', text: '' }]
    });
  }

  function updateNote(index: number, field: 'emoji' | 'text', value: string) {
    const newNotes = [...formData.notes];
    newNotes[index][field] = value;
    setFormData({ ...formData, notes: newNotes });
  }

  function removeNote(index: number) {
    const newNotes = formData.notes.filter((_, i) => i !== index);
    setFormData({ ...formData, notes: newNotes });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Restoran Yönetimi</h1>

      <div className="mb-6 flex gap-4">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        >
          <option value="">Konum Seçin</option>
          {turkeyLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {selectedLocation && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Restoran Ekle
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingRestaurant ? 'Restoran Düzenle' : 'Yeni Restoran Ekle'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{getLocalizedText(cat.title)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Restoran Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Resim URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Google Puanı</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.google_rating}
                    onChange={(e) => setFormData({ ...formData, google_rating: parseFloat(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Yorum Sayısı</label>
                  <input
                    type="text"
                    value={formData.review_count}
                    onChange={(e) => setFormData({ ...formData, review_count: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="örn: 2.4k"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ne Sipariş Etmeli</label>
                <input
                  type="text"
                  value={formData.order_suggestion}
                  onChange={(e) => setFormData({ ...formData, order_suggestion: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sıralama</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Notlar</label>
                  <button
                    onClick={addNote}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Not Ekle
                  </button>
                </div>
                {formData.notes.map((note, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Emoji"
                      value={note.emoji}
                      onChange={(e) => updateNote(index, 'emoji', e.target.value)}
                      className="w-20 border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Not metni"
                      value={note.text}
                      onChange={(e) => updateNote(index, 'text', e.target.value)}
                      className="flex-1 border rounded px-3 py-2"
                    />
                    <button
                      onClick={() => removeNote(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Kaydet
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedLocation && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{selectedLocation} - Restoranlar</h2>
          {loading ? (
            <p className="text-gray-500">Yükleniyor...</p>
          ) : restaurants.length === 0 ? (
            <p className="text-gray-500">Bu konum için henüz restoran eklenmemiş.</p>
          ) : (
            <div className="space-y-4">
              {restaurants.map(restaurant => (
                <div key={restaurant.id} className="border rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{getLocalizedText(restaurant.name)}</h3>
                    <p className="text-sm text-gray-600 mt-1">{getLocalizedText(restaurant.description)}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>⭐ {restaurant.google_rating}</span>
                      <span>📝 {restaurant.review_count} yorum</span>
                      <span>🍽️ {getLocalizedText(restaurant.order_suggestion)}</span>
                    </div>
                    {restaurant.notes && restaurant.notes.length > 0 && (
                      <div className="mt-2 text-sm text-gray-500">
                        {restaurant.notes.length} not var
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => restaurant.id && handleDelete(restaurant.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
