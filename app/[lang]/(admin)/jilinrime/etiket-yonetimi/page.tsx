'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Save, X, PlusCircle, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getLocalizedText } from '@/lib/localization';

export default function EtiketYonetimiPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagIcon, setNewTagIcon] = useState('Tag');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<{ name: string; icon: string }>({ name: '', icon: '' });
  const [isLoading, setIsLoading] = useState(true);

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        setTags(data.map(t => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          icon: t.icon || 'Tag',
          isFeatured: t.is_featured || false
        })));
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      alert('Etiketler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      alert('Etiket adı zorunludur.');
      return;
    }

    try {
      const slug = newTagName
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
        .from('tags')
        .insert([{
          name: newTagName.trim(),
          slug: slug,
          icon: newTagIcon.trim() || 'Tag',
          is_featured: false
        }]);

      if (error) throw error;

      setNewTagName('');
      setNewTagIcon('Tag');
      loadTags();
    } catch (error: any) {
      console.error('Error adding tag:', error);
      alert('Etiket eklenirken hata oluştu: ' + error.message);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Bu etiketi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('tags')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      loadTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Etiket silinirken hata oluştu');
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingValues({ name: getLocalizedText(tag.name), icon: tag.icon || 'Tag' });
  };

  const cancelEditing = () => {
    setEditingTagId(null);
  };

  const handleUpdateTag = async () => {
    if (!editingTagId || !editingValues.name.trim()) return;

    try {
      const slug = editingValues.name
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
        .from('tags')
        .update({
          name: editingValues.name.trim(),
          slug: slug,
          icon: editingValues.icon.trim() || 'Tag'
        })
        .eq('id', editingTagId);

      if (error) throw error;

      setEditingTagId(null);
      loadTags();
    } catch (error) {
      console.error('Error updating tag:', error);
      alert('Etiket güncellenirken hata oluştu');
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Etiket Yönetimi</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border">
        <h2 className="text-xl font-semibold mb-4">Yeni Etiket Ekle</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="new-tag-name">Etiket Adı</Label>
            <Input
              id="new-tag-name"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              placeholder="örn: SPA Merkezi"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-tag-icon">İkon Adı (Lucide)</Label>
            <Input
              id="new-tag-icon"
              value={newTagIcon}
              onChange={e => setNewTagIcon(e.target.value)}
              placeholder="örn: Sparkles"
              className="h-11"
            />
          </div>
          <Button onClick={handleAddTag} className="h-11">
            <PlusCircle className="mr-2 h-4 w-4" /> Ekle
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Lucide icon isimlerini{' '}
          <a
            href="https://lucide.dev/icons/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-700"
          >
            lucide.dev
          </a>{' '}
          adresinden bulabilirsiniz.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Mevcut Etiketler ({tags.length})</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {tags.map(tag => {
            const IconComponent = (LucideIcons as any)[tag.icon || 'Tag'] || LucideIcons.Tag;
            const isEditing = editingTagId === tag.id;
            return (
              <li key={tag.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {isEditing ? (
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-auto">
                    <div className="space-y-1">
                      <Label htmlFor={`edit-name-${tag.id}`} className="text-xs text-gray-600">Etiket Adı</Label>
                      <Input
                        id={`edit-name-${tag.id}`}
                        value={editingValues.name}
                        onChange={e => setEditingValues(v => ({ ...v, name: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`edit-icon-${tag.id}`} className="text-xs text-gray-600">İkon Adı</Label>
                      <Input
                        id={`edit-icon-${tag.id}`}
                        value={editingValues.icon}
                        onChange={e => setEditingValues(v => ({ ...v, icon: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 mr-3">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-gray-900">{getLocalizedText(tag.name)}</span>
                      <span className="text-sm text-gray-400 ml-2">({tag.icon})</span>
                      <div className="text-xs text-gray-500 mt-0.5">slug: {tag.slug}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleUpdateTag} className="h-9">
                        <Save className="mr-2 h-4 w-4" /> Kaydet
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-9">
                        <X className="mr-2 h-4 w-4" /> İptal
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => startEditing(tag)} className="h-9">
                        Düzenle
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTag(tag.id)}
                        className="h-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {tags.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">Henüz etiket eklenmemiş</p>
          </div>
        )}
      </div>
    </div>
  );
}
