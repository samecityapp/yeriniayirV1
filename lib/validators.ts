import { z } from "zod";

export const hotelSchema = z.object({
  name: z.string().min(3, "Otel adı en az 3 karakter olmalıdır").max(200, "Otel adı en fazla 200 karakter olabilir"),
  location: z.string().min(2, "Lokasyon belirtilmelidir"),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz").max(1000000, "Geçersiz fiyat"),
  rating: z.number().min(0, "Puan 0'dan küçük olamaz").max(10, "Puan 10'dan büyük olamaz"),
  image_url: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
  description: z.string().max(2000, "Açıklama en fazla 2000 karakter olabilir").optional(),
  about: z.string().max(5000, "Hakkında metni çok uzun").optional(),
  about_facility: z.string().max(5000, "Tesis hakkında metni çok uzun").optional(),
  rules: z.string().max(5000, "Kurallar metni çok uzun").optional(),
  video_url: z.string().url("Geçerli bir video URL'si giriniz").optional().or(z.literal("")),
  website_url: z.string().url("Geçerli bir website URL'si giriniz").optional().or(z.literal("")),
  instagram_url: z.string().url("Geçerli bir Instagram URL'si giriniz").optional().or(z.literal("")),
  google_maps_url: z.string().url("Geçerli bir Google Maps URL'si giriniz").optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  gallery_images: z.array(z.string().url()).max(20, "En fazla 20 galeri görseli eklenebilir").optional(),
});

export const articleSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır").max(300, "Başlık en fazla 300 karakter olabilir"),
  slug: z.string().min(3, "Slug en az 3 karakter olmalıdır").max(300, "Slug en fazla 300 karakter olabilir").regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  content: z.string().min(50, "İçerik en az 50 karakter olmalıdır").max(50000, "İçerik çok uzun"),
  excerpt: z.string().max(500, "Özet en fazla 500 karakter olabilir").optional(),
  featured_image: z.string().url("Geçerli bir görsel URL'si giriniz").optional().or(z.literal("")),
  location: z.string().min(2, "Lokasyon belirtilmelidir").optional(),
  is_published: z.boolean().default(false),
});

export const restaurantSchema = z.object({
  name: z.string().min(2, "Restoran adı en az 2 karakter olmalıdır").max(200, "Restoran adı en fazla 200 karakter olabilir"),
  category: z.string().min(2, "Kategori belirtilmelidir"),
  cuisine_type: z.string().min(2, "Mutfak tipi belirtilmelidir").optional(),
  description: z.string().max(2000, "Açıklama en fazla 2000 karakter olabilir").optional(),
  address: z.string().min(5, "Adres en az 5 karakter olmalıdır").optional(),
  phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, "Geçerli bir telefon numarası giriniz").optional().or(z.literal("")),
  website_url: z.string().url("Geçerli bir website URL'si giriniz").optional().or(z.literal("")),
  google_maps_url: z.string().url("Geçerli bir Google Maps URL'si giriniz").optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  rating: z.number().min(0).max(10).optional().nullable(),
  price_range: z.string().max(50).optional(),
  opening_hours: z.string().max(500).optional(),
  images: z.array(z.string().url()).max(15, "En fazla 15 görsel eklenebilir").optional(),
});

export const groupSchema = z.object({
  title: z.string().min(3, "Grup başlığı en az 3 karakter olmalıdır").max(200, "Grup başlığı en fazla 200 karakter olabilir"),
  is_published: z.boolean().default(false),
});

export const tagSchema = z.object({
  name: z.string().min(2, "Etiket adı en az 2 karakter olmalıdır").max(100, "Etiket adı en fazla 100 karakter olabilir"),
  slug: z.string().min(2, "Slug en az 2 karakter olmalıdır").max(100, "Slug en fazla 100 karakter olabilir").regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  icon: z.string().max(50).default("Tag"),
  is_featured: z.boolean().default(false),
});

export const priceTagSchema = z.object({
  label: z.string().min(2, "Etiket adı en az 2 karakter olmalıdır").max(100, "Etiket adı en fazla 100 karakter olabilir"),
  slug: z.string().min(2, "Slug en az 2 karakter olmalıdır").max(100, "Slug en fazla 100 karakter olabilir").regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  min_price: z.number().min(0, "Minimum fiyat 0'dan küçük olamaz"),
  max_price: z.number().min(0, "Maximum fiyat 0'dan küçük olamaz").optional().nullable(),
});

export const searchTermSchema = z.object({
  term: z.string().min(2, "Arama terimi en az 2 karakter olmalıdır").max(200, "Arama terimi en fazla 200 karakter olabilir"),
  slug: z.string().min(2, "Slug en az 2 karakter olmalıdır").max(200, "Slug en fazla 200 karakter olabilir").regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
});

export type HotelInput = z.infer<typeof hotelSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type RestaurantInput = z.infer<typeof restaurantSchema>;
export type GroupInput = z.infer<typeof groupSchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type PriceTagInput = z.infer<typeof priceTagSchema>;
export type SearchTermInput = z.infer<typeof searchTermSchema>;
