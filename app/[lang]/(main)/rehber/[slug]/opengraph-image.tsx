import { ImageResponse } from 'next/server';
import { db } from '@/lib/db';
import { getLocalizedText } from '@/lib/localization';

export const runtime = 'edge';
export const alt = 'GNK Gezi Rehberi';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  try {
    const article = await db.articles.getBySlug(params.slug);

    if (!article) {
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
              Makale Bulunamadı
            </div>
          </div>
        ),
        { ...size }
      );
    }

    const articleTitle = getLocalizedText(article.title);
    const articleLocation = getLocalizedText(article.location);
    const coverImage = article.cover_image;

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
          {coverImage && (
            <img
              src={coverImage}
              alt={articleTitle}
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
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: '80px',
            }}
          >
            {/* Category Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                padding: '12px 24px',
                borderRadius: 8,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                GNK Gezi Rehberi
              </div>
            </div>

            {/* Article Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 20,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
                maxWidth: '1000px',
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {articleTitle}
            </div>

            {/* Location */}
            {articleLocation && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 32,
                  color: '#e4e4e7',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                <div>📍</div>
                <div>{articleLocation}</div>
              </div>
            )}

            {/* Logo */}
            <div
              style={{
                position: 'absolute',
                top: 60,
                right: 60,
                fontSize: 48,
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              GNK
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
            GNK Gezi Rehberi
          </div>
        </div>
      ),
      { ...size }
    );
  }
}
