export type LocalizedString = {
  tr: string;
  en?: string;
  de?: string;
  ar?: string;
  ru?: string;
  [key: string]: string | undefined;
};

export type Hotel = {
  id: string;
  name: LocalizedString | string;
  location: LocalizedString | string;
  slug?: string;
  gnkScore: number;
  price: number;
  currency?: string;
  about?: LocalizedString | string;
  tags?: string[];
  amenities?: string[];
  coverImageUrl?: string;
  galleryImages?: string[];
  aboutFacility?: LocalizedString | string;
  rules?: LocalizedString | string;
  coordinates?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
  videoUrl?: string;
  video_url?: string;
  video_thumbnail_url?: string;
  website_url?: string;
  instagram_url?: string;
  google_maps_url?: string;
  description: LocalizedString | string;
  breakfast_description?: LocalizedString | string;
  breakfast_images?: string[];
  faqs?: { question: string; answer: string }[];
};

export type Group = {
  id: string;
  title: string;
  isPublished: boolean;
  hotelIds: string[];
  domains?: string[];
};

export type Tag = {
  id: string;
  name: LocalizedString;
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
  name: LocalizedString | string;
  image?: string;
  image_url?: string;
  description: LocalizedString | string;
  google_rating?: number;
  googleRating?: number;
  review_count?: string;
  reviewCount?: string;
  order_suggestion?: LocalizedString | string;
  orderSuggestion?: LocalizedString | string;
  display_order?: number;
  notes?: RestaurantNote[];
}

export interface RestaurantNote {
  id?: string;
  restaurant_id?: string;
  emoji: string;
  text: LocalizedString | string;
  display_order?: number;
}

export interface RestaurantCategory {
  id?: string;
  title: LocalizedString | string;
  display_order?: number;
  restaurants?: Restaurant[];
  places?: Restaurant[];
}

export interface Article {
  id: string;
  title: LocalizedString | string;
  slug: string;
  slug_en?: string;
  cover_image_url?: string;
  meta_description?: LocalizedString | string;
  content?: LocalizedString | string;
  location?: string;
  is_published?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  language?: 'tr' | 'en' | string;
}

export interface IncludedItem {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  isCustom?: boolean; // To identify manually added items vs defaults
}

export interface Offer {
  id: string;
  slug: string;
  hotel_name: string;
  price: string;
  region: string;
  included_items?: IncludedItem[] | null;
  promo_text?: string;
  created_at: string;
  updated_at: string;
}
