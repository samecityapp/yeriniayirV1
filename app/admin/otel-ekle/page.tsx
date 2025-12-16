'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Hotel, Tag, LocalizedString } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/ImageUpload';
import { GalleryUpload } from '@/components/GalleryUpload';
import VideoUpload from '@/components/VideoUpload';
import LocationSelect from '@/components/LocationSelect';
import { getLocalizedText } from '@/lib/localization';
import { LocalizedInput } from '@/components/admin/LocalizedInput';
import { LocalizedTextarea } from '@/components/admin/LocalizedTextarea';

// Helper for slug generation
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const FIXED_FAQ_QUESTIONS = [
  'Giriş ve çıkış saatleri neler?',
  'Tesisin kahvaltı saatleri?',
  'Otopark var mı?',
  'Denize Uzaklığı Nedir?',
  'Engelliler için uygun mu?',
  'Çocuk Kabul Ediyor musunuz?',
  'Bu otele gelmek için en iyi zaman ne zaman?',
  'Bölgede mutlaka görülmesi gereken yerler nereler?',
  'Tesiste spor olanağı var mı? Gym, Yoga, Pilates?',
  'Evcil hayvan kabul ediyor musunuz?'
];

// Helper for localized data parsing
const tryParseLocalized = (val: any): LocalizedString => {
  if (!val) return { tr: '', en: '', de: '' };

  // If it's already an object
  if (typeof val === 'object') {
    return {
      tr: val.tr || '',
      en: val.en || '',
      de: val.de || ''
    };
  }

  // If it's a string, try to parse it as JSON
  if (typeof val === 'string') {
    // Check if it looks like a JSON object
    if (val.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(val);

        // Handle double-stringified JSON (recursive check)
        if (typeof parsed === 'string' && parsed.trim().startsWith('{')) {
          return tryParseLocalized(parsed);
        }

        // If parsed successfully into an object
        if (typeof parsed === 'object' && parsed !== null) {
          return {
            tr: parsed.tr || '',
            en: parsed.en || '',
            de: parsed.de || ''
          };
        }
      } catch (e) {
        // Not a valid JSON, verify fallback below
      }
    }
    // Fallback: treat as plain string for default language (tr)
    return { tr: val, en: '', de: '' };
  }

  return { tr: String(val), en: '', de: '' };
};

export default function OtelEklePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('id');
  const isEdit = !!hotelId;

  const [name, setName] = useState<LocalizedString>({ tr: '', en: '', de: '' });
  const [location, setLocation] = useState<LocalizedString>({ tr: '', en: '', de: '' });
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [gnkScore, setGnkScore] = useState<number>(0);
  const [price, setPrice] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [about, setAbout] = useState<LocalizedString>({ tr: '', en: '', de: '' });
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [breakfastDescription, setBreakfastDescription] = useState<LocalizedString>({ tr: '', en: '', de: '' });
  const [breakfastImages, setBreakfastImages] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('*')
          .order('name', { ascending: true });

        if (!tagsError && tagsData) {
          setAllTags(tagsData as Tag[]);
        }

        if (isEdit && hotelId) {
          const { data: hotelData, error: hotelError } = await supabase
            .from('hotels')
            .select('*')
            .eq('id', hotelId)
            .maybeSingle();

          if (!hotelError && hotelData) {
            setName(tryParseLocalized(hotelData.name));
            setLocation(tryParseLocalized(hotelData.location));
            setLatitude(hotelData.latitude?.toString() || '');
            setLongitude(hotelData.longitude?.toString() || '');
            setGnkScore(hotelData.rating || 0);
            setPrice(hotelData.price?.toString() || '');
            setSelectedTags(hotelData.tags || []);
            setCoverImageUrl(hotelData.image_url || '');
            setGalleryUrls(hotelData.gallery_images || []);
            setSelectedAmenities(hotelData.amenities || []);
            setAbout(tryParseLocalized(hotelData.about || hotelData.description));
            setVideoUrl(hotelData.video_url || '');
            setVideoThumbnailUrl(hotelData.video_thumbnail_url || '');
            setWebsiteUrl(hotelData.website_url || '');
            setInstagramUrl(hotelData.instagram_url || '');
            setGoogleMapsUrl(hotelData.google_maps_url || '');
            setBreakfastDescription(tryParseLocalized(hotelData.breakfast_description));
            setBreakfastImages(hotelData.breakfast_images || []);


            // Initialize FAQs
            const existingFaqs = hotelData.faqs || [];
            const initializedFaqs = FIXED_FAQ_QUESTIONS.map(q => {
              const existing = existingFaqs.find((f: any) => f.question === q);
              return {
                question: q,
                answer: existing ? existing.answer : ''
              };
            });
            setFaqs(initializedFaqs);
          }
        } else if (!isEdit) {
          // New hotel, initialize empty FAQs
          setFaqs(FIXED_FAQ_QUESTIONS.map(q => ({ question: q, answer: '' })));
        }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isEdit, hotelId]);

  const handleToggleTag = (tagSlug: string) => {
    setSelectedTags(current =>
      current.includes(tagSlug)
        ? current.filter(t => t !== tagSlug)
        : [...current, tagSlug]
    );
  };

  const handleSave = async () => {
    if (!name.tr.trim() || !location.tr.trim()) {
      alert('Otel ismi ve konum (Türkçe) zorunludur!');
      return;
    }

    // Validate coordinates
    const lat = latitude.trim() ? parseFloat(latitude) : null;
    const lng = longitude.trim() ? parseFloat(longitude) : null;

    if (latitude.trim() && (isNaN(lat!) || lat! < -90 || lat! > 90)) {
      alert('Enlem (Latitude) -90 ile 90 arasında olmalıdır!');
      return;
    }

    if (longitude.trim() && (isNaN(lng!) || lng! < -180 || lng! > 180)) {
      alert('Boylam (Longitude) -180 ile 180 arasında olmalıdır!');
      return;
    }

    // Validate rating
    const validatedRating = Math.max(0, Math.min(10, gnkScore || 0));

    // Validate price (must be integer)
    const validatedPrice = Math.max(0, parseInt(price) || 0);

    setIsLoading(true);

    const hotelData = {
      name: name,
      slug: slugify(name.tr),
      location: location,
      latitude: lat,
      longitude: lng,
      rating: validatedRating,
      price: validatedPrice,
      tags: selectedTags,
      image_url: coverImageUrl.trim() || '',
      gallery_images: galleryUrls,
      amenities: selectedAmenities,
      about: about,
      description: about,
      video_url: videoUrl.trim() || null,
      video_thumbnail_url: videoThumbnailUrl.trim() || null,
      website_url: websiteUrl.trim() || null,
      instagram_url: instagramUrl.trim() || null,
      google_maps_url: googleMapsUrl.trim() || null,
      breakfast_description: breakfastDescription,
      breakfast_images: breakfastImages.length > 0 ? breakfastImages : null,
      faqs: faqs
    };

    try {
      if (isEdit && hotelId) {
        const { error } = await supabase
          .from('hotels')
          .update(hotelData)
          .eq('id', hotelId);

        if (error) throw error;
        alert('Otel güncellendi!');
      } else {
        const { error } = await supabase
          .from('hotels')
          .insert([hotelData]);

        if (error) throw error;
        alert('Otel eklendi!');
      }
      router.push('/admin/otel-listesi');
    } catch (error: any) {
      console.error('Kaydetme hatası:', error);
      alert('Bir hata oluştu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
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
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/otel-listesi">
              <Button variant="ghost" className="mb-2">
                <ArrowLeft className="mr-2" size={18} />
                Geri
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">
              {isEdit ? 'Otel Düzenle' : 'Yeni Otel Ekle'}
            </h1>
          </div>
          <Button onClick={handleSave} disabled={isLoading} size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2" size={18} />
            )}
            {isEdit ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <LocalizedInput
                label="Otel İsmi"
                value={name}
                onChange={setName}
                placeholder="Örn: Paloma Finesse"
                required
              />

              <div className="space-y-2">
                <Label>Konum <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <LocationSelect
                    value={location.tr}
                    onChange={(val) => setLocation({ tr: val, en: val, de: val })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Listeden seçim yapınız. (Örn: Sapanca, Bodrum)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label htmlFor="score" className="text-sm font-semibold">
                  Otel Puanı (10 Üzerinden)
                </Label>
                <Input
                  id="score"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={gnkScore}
                  onChange={(e) => setGnkScore(parseFloat(e.target.value) || 0)}
                  placeholder="0.0 - 10.0"
                  className="h-11"
                />
                <p className="text-xs text-gray-500">Örn: 9.6 gibi ondalık değerler girebilirsiniz</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold">
                  Fiyat (TL)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="1"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Örn: 8500"
                  className="h-11"
                />
                <p className="text-xs text-gray-500">Sadece tam sayı giriniz (12500 gibi)</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="mb-4">
                <Label className="text-sm font-semibold mb-2 block">
                  Harita Koordinatları
                </Label>
                <p className="text-sm text-gray-500 mb-4">
                  Google Maps'te oteli bulun, sağ tıklayın ve koordinatları kopyalayın
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm font-semibold">
                    Enlem (Latitude)
                  </Label>
                  <Input
                    id="latitude"
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Örn: 36.8969"
                    className="h-11 font-mono"
                  />
                  <p className="text-xs text-gray-500">-90 ile 90 arasında olmalı</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm font-semibold">
                    Boylam (Longitude)
                  </Label>
                  <Input
                    id="longitude"
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Örn: 30.7133"
                    className="h-11 font-mono"
                  />
                  <p className="text-xs text-gray-500">-180 ile 180 arasında olmalı</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <Label className="text-sm font-semibold mb-3 block">Otel Özellikleri</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {allTags.map(tag => {
                  const IconComponent = (LucideIcons as any)[tag.icon || 'Tag'] || LucideIcons.Tag;
                  const isSelected = selectedTags.includes(tag.slug);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.slug)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      <IconComponent size={18} />
                      <span className="text-sm font-medium">{getLocalizedText(tag.name)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-6">
              <ImageUpload
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                label="Ana Sayfa Kapak Fotoğrafı"
                description="Otel kartlarında gösterilecek ana fotoğraf"
              />
            </div>

            <div className="border-t pt-6">
              <GalleryUpload
                value={galleryUrls}
                onChange={setGalleryUrls}
                maxImages={10}
              />
            </div>

            <div className="border-t pt-6">
              <Label className="text-sm font-semibold mb-3 block">
                Otel Videosu
              </Label>
              <p className="text-sm text-gray-500 mb-4">
                Otelin tanıtım videosu (Instagram Reel formatı önerilir - 9:16)
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">
                    Video Dosyası
                  </Label>
                  <VideoUpload
                    value={videoUrl}
                    onChange={(url) => {
                      setVideoUrl(url);
                    }}
                    onRemove={() => {
                      setVideoUrl('');
                    }}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">
                    Video Kapak Fotoğrafı (Poster)
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Video yüklenmeden önce gösterilecek ön izleme görseli
                  </p>
                  <ImageUpload
                    value={videoThumbnailUrl}
                    onChange={setVideoThumbnailUrl}
                    label=""
                    description=""
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <LocalizedTextarea
                label="Neden Bu Otel"
                value={about}
                onChange={setAbout}
                placeholder="Bu oteli neden seçmeliyim? Otelin öne çıkan özellikleri..."
                rows={5}
              />
            </div>

            <div className="border-t pt-6">
              <Label className="text-sm font-semibold mb-3 block">
                Kahvaltımız
              </Label>
              <p className="text-sm text-gray-500 mb-4">
                Bu bölüm opsiyoneldir. Doldurmadığınız takdirde otel detay sayfasında görünmez.
              </p>
              <div className="space-y-4">
                <LocalizedTextarea
                  label="Kahvaltı Açıklaması"
                  value={breakfastDescription}
                  onChange={setBreakfastDescription}
                  placeholder="Otelin kahvaltısı hakkında açıklama yazın..."
                  rows={4}
                />
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Kahvaltı Fotoğrafları (Maksimum 3)
                  </Label>
                  <GalleryUpload
                    value={breakfastImages}
                    onChange={setBreakfastImages}
                    maxImages={3}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <Label className="text-sm font-semibold mb-3 block">
                Sosyal Medya ve Web Sitesi
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-semibold">
                    Otel Web Sitesi
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://www.ornekotel.com"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-sm font-semibold">
                    Instagram Profil Linki
                  </Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://www.instagram.com/ornekotel"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <Label className="text-sm font-semibold mb-3 block">
                Google Haritalar
              </Label>
              <p className="text-sm text-gray-500 mb-4">
                Google Maps'te oteli bulun, "Paylaş" butonuna tıklayın ve linki buraya yapıştırın
              </p>
              <div className="space-y-2">
                <Label htmlFor="googleMaps" className="text-sm font-semibold">
                  Google Maps Linki
                </Label>
                <Input
                  id="googleMaps"
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://www.google.com/maps/place/..."
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  Mobil cihazlarda tıklandığında Google Maps uygulamasını açar
                </p>
              </div>
            </div>


            <div className="border-t pt-6">
              <Label className="text-sm font-semibold mb-3 block">
                Sıkça Sorulan Sorular
              </Label>
              <p className="text-sm text-gray-500 mb-6">
                Aşağıdaki sorular için otelinize özel yanıtları giriniz.
              </p>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {faq.question}
                    </Label>
                    <Input
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                        setFaqs(newFaqs);
                      }}
                      placeholder="Cevabı buraya giriniz..."
                      className="h-11"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
