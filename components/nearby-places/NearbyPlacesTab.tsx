'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { CategoryFilters } from './CategoryFilters';
import { RestaurantCard } from './RestaurantCard';
import { Restaurant, RestaurantCategory } from '@/lib/types';
import { sapancaPlaces } from '@/data/sapancaPlaces';
import { bodrumPlaces } from '@/data/bodrumPlaces';

const RestaurantDetailsModal = dynamic(() =>
  import('./RestaurantDetailsModal').then(mod => ({ default: mod.RestaurantDetailsModal }))
);

interface NearbyPlacesTabProps {
  location: string;
  coordinates?: { lat: number; lng: number };
}

export function NearbyPlacesTab({ location, coordinates }: NearbyPlacesTabProps) {
  const [categories, setCategories] = useState<RestaurantCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, [location]);

  async function fetchRestaurants() {
    try {
      setLoading(true);

      if (location.toLowerCase().includes('sapanca') || location.toLowerCase().includes('kırkpınar')) {
        const normalizedCategories = sapancaPlaces.map(cat => ({
          ...cat,
          restaurants: cat.places || cat.restaurants || []
        }));
        setCategories(normalizedCategories);
        if (normalizedCategories.length > 0) {
          setActiveCategory(normalizedCategories[0].title);
        }
        setLoading(false);
        return;
      }

      if (location.toLowerCase().includes('bodrum')) {
        const normalizedCategories = bodrumPlaces.map(cat => ({
          ...cat,
          restaurants: cat.places || cat.restaurants || []
        }));
        setCategories(normalizedCategories);
        if (normalizedCategories.length > 0) {
          setActiveCategory(normalizedCategories[0].title);
        }
        setLoading(false);
        return;
      }

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('restaurant_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('restaurants')
        .select(`
          *,
          notes:restaurant_notes(*)
        `)
        .eq('location', location)
        .order('display_order');

      if (restaurantsError) throw restaurantsError;

      const categoriesWithRestaurants: RestaurantCategory[] = (categoriesData || []).map(cat => {
        const categoryRestaurants = (restaurantsData || [])
          .filter((r: any) => r.category_id === cat.id)
          .map((r: any) => ({
            ...r,
            notes: (r.notes || []).sort((a: any, b: any) => a.display_order - b.display_order)
          }));

        return {
          ...cat,
          restaurants: categoryRestaurants
        };
      }).filter(cat => cat.restaurants && cat.restaurants.length > 0);

      setCategories(categoriesWithRestaurants);

      if (categoriesWithRestaurants.length > 0) {
        setActiveCategory(categoriesWithRestaurants[0].title);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Bu konum için henüz restoran önerisi eklenmedi.</p>
      </div>
    );
  }

  const activePlaces = categories.find(cat => cat.title === activeCategory)?.restaurants || [];

  return (
    <>
      <CategoryFilters
        categories={categories.map(cat => cat.title)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {activePlaces.map(place => (
          <RestaurantCard
            key={place.id}
            restaurant={place}
            onViewDetails={() => setSelectedRestaurant(place)}
          />
        ))}
      </div>
      {selectedRestaurant && (
        <RestaurantDetailsModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </>
  );
}
