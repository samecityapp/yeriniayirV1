import { LocalizedString } from '@/lib/types';

export interface VerifiedSourceRef {
  publisher: string;
  author?: string;
  title: string;
  url: string;
  date: string;
  note?: string;
}

export interface PremiumRestaurantDetail {
  id: string;
  name: LocalizedString | string;
  tagline?: LocalizedString | string;
  location: LocalizedString | string;
  neighborhood: string;
  address: string;
  mapsUrl: string;
  imageUrl: string;
  galleryUrls?: string[];
  categoryName: string;
  badgeText?: string;
  googleRatingSignal?: {
    rating: number;
    reviewCount: string;
    note: string;
  };
  
  // 1. Ne Sipariş Etmeli? (İmza Lezzet)
  orderSuggestion: {
    title: string;
    description: string;
    tags?: string[];
  };

  // 2. Neden Gitmeli? (Seçim Gerekçesi)
  whyGo: {
    summary: string;
    reasons: string[];
  };

  // 3. Sana Uygun mu? (Ziyaretçi Uyumu)
  visitorFit: {
    bestFor: string[];
    notIdealFor: string[];
    vibeText: string;
  };

  // 4. Ayrıca Bunları da Dene (Yan lezzetler - Yalnızca gerçekten varsa gösterilir!)
  alsoTry?: {
    items: {
      name: string;
      description: string;
    }[];
  };

  // 5. Gitmeden Bil (Kritik tüyolar, oturma, tempo)
  knowBeforeYouGo: {
    tips: string[];
  };

  // Doğrulanmış Kaynaklar (Kullanıcı isterse açar)
  sources?: VerifiedSourceRef[];

  // Prototype / Demo etiketleri
  isDemoData?: boolean;
  dataSourceLabel?: string;
}
