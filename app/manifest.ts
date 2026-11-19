import { MetadataRoute } from 'next';
import { isHotelSurfaceEnabled } from '@/lib/hotelLaunchGate';

export default function manifest(): MetadataRoute.Manifest {
  const hotelEnabled = isHotelSurfaceEnabled();
  return {
    name: 'Yerini Ayır',
    short_name: 'Yerini Ayır',
    description: hotelEnabled
      ? "Erdem'in Seçtiği Oteller - Türkiye'nin konaklama rehberi"
      : 'Türkiye genelinde 21 il ve 92 bölgede doğrulanmış yerel gastronomi ve şehir lezzet rehberi',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10b981',
    categories: ['travel', 'lifestyle'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
    ],
  };
}
