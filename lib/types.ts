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
  name: LocalizedString;
  location: LocalizedString | string;
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
  description: LocalizedString;
  breakfast_description?: LocalizedString;
  breakfast_images?: string[];
};

export type Group = {
  id: string;
  title: string;
  isPublished: boolean;
  hotelIds: string[];
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
