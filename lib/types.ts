export type Hotel = {
  id: string;
  name: string;
  location: string;
  gnkScore: number;
  price: number;
  about?: string;
  tags?: string[];
  amenities?: string[];
  coverImageUrl?: string;
  galleryImages?: string[];
  aboutFacility?: string;
  rules?: string;
  coordinates?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
  videoUrl?: string;
  video_url?: string;
  video_thumbnail_url?: string;
  website_url?: string;
  instagram_url?: string;
  google_maps_url?: string;
};

export type Group = {
  id: string;
  title: string;
  isPublished: boolean;
  hotelIds: string[];
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  isFeatured?: boolean;
  icon?: string;
};

export type PriceTag = {
  id: string;
  label: string;
  slug: string;
  minPrice: number;
  maxPrice: number;
};

export type SearchTerm = {
  id: string;
  term: string;
  slug: string;
};

export interface Restaurant {
  id?: string;
  category_id?: string;
  location?: string;
  name: string;
  image?: string;
  image_url?: string;
  description: string;
  google_rating?: number;
  googleRating?: number;
  review_count?: string;
  reviewCount?: string;
  order_suggestion?: string;
  orderSuggestion?: string;
  display_order?: number;
  notes?: RestaurantNote[];
}

export interface RestaurantNote {
  id?: string;
  restaurant_id?: string;
  emoji: string;
  text: string;
  display_order?: number;
}

export interface RestaurantCategory {
  id?: string;
  title: string;
  display_order?: number;
  restaurants?: Restaurant[];
  places?: Restaurant[];
}