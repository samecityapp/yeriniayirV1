import { ImageResponse } from 'next/server';
import { db } from '@/lib/db';
import { getLocalizedText } from '@/lib/localization';

export const runtime = 'edge';
export const alt = 'Yerini Ayır Otel Detay';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  try {
    const hotel = await db.hotels.getById(params.id);

    if (!hotel) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#18181b',
              color: '#fff',
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 'bold' }}>
              Otel Bulunamadı
            </div>
          </div>
        ),
        { ...size }
      );
    }

    const hotelName = getLocalizedText(hotel.name);
    const hotelLocation = getLocalizedText(hotel.location);
    const mainImage = hotel.galleryImages && hotel.galleryImages.length > 0
      ? hotel.galleryImages[0]
      : hotel.coverImageUrl || null;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background Image */}
          {mainImage && (
            <img
              src={mainImage}
              alt={hotelName}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

          {/* Dark Overlay */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '80px',
              textAlign: 'center',
            }}
          >
            {/* Hotel Name */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 30,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
                maxWidth: '1000px',
                lineHeight: 1.2,
              }}
            >
              {hotelName}
            </div>

            {/* Location */}
            <div
              style={{
                fontSize: 36,
                color: '#e4e4e7',
                marginBottom: 40,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              {hotelLocation}
            </div>

            {/* Rating Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '20px 40px',
                borderRadius: 16,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: '#18181b',
                }}
              >
                {hotel.gnkScore?.toFixed(1) || 'N/A'}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: '#52525b',
                  fontWeight: 600,
                }}
              >
                Yerini Ayır Puanı
              </div>
            </div>

            {/* Logo/Brand */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                right: 60,
                fontSize: 42,
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              Yerini Ayır
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    // Fallback error image
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#18181b',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold' }}>
            Yerini Ayır
          </div>
        </div>
      ),
      { ...size }
    );
  }
}
