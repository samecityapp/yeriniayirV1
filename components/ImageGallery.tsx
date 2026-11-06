'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Play, Camera } from 'lucide-react';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  loading: () => <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"><p className="text-white">Video Oynatıcı Yükleniyor...</p></div>
});

type ImageGalleryProps = {
  images: string[];
  videoUrl?: string | null;
  videoThumbnailUrl?: string | null;
  onClose?: () => void;
  altPrefix?: string;
  priority?: boolean;
  lang?: 'tr' | 'en';
};

export function ImageGallery({
  images,
  videoUrl,
  videoThumbnailUrl,
  onClose,
  altPrefix = 'Yerini Ayır',
  priority = false,
  lang = 'tr',
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const labels = {
    loading: lang === 'tr' ? 'Video Oynatıcı Yükleniyor...' : 'Loading Video Player...',
    noMedia: lang === 'tr' ? 'Medya Yok' : 'No Media',
    photos: lang === 'tr' ? 'Fotoğraf' : 'Photos',
  };

  if (!images || (images.length === 0 && !videoUrl)) {
    return (
      <div className="bg-gray-100 h-96 rounded-3xl flex items-center justify-center mb-12">
        <p className="text-gray-400">{labels.noMedia}</p>
      </div>
    );
  }

  const displayImages = images.slice(0, 10);
  const totalImages = displayImages.length;

  return (
    <>
      {/* Mobile Gallery */}
      <div className="md:hidden relative w-full h-[380px] bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group mb-0">
        {videoUrl ? (
          <div className="relative w-full h-full" onClick={() => setIsVideoOpen(true)}>
            {videoThumbnailUrl ? (
              <Image
                src={videoThumbnailUrl}
                alt={`${altPrefix} video`}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : displayImages[0] ? (
              <Image
                src={displayImages[0]}
                alt={altPrefix}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        ) : displayImages[0] ? (
          <div className="relative w-full h-full" onClick={() => setSelectedImageIndex(0)}>
            <Image
              src={displayImages[0]}
              alt={altPrefix}
              fill
              sizes="100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={priority}
            />
          </div>
        ) : null}
        {totalImages > 1 && (
          <div
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setSelectedImageIndex(0)}
          >
            <Camera className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-semibold text-gray-900">
              {totalImages} {labels.photos}
            </span>
          </div>
        )}
      </div>

      {/* Desktop Gallery */}
      <div className="hidden md:grid md:grid-cols-3 gap-3 mb-0 h-[520px]">
        <div className={`${totalImages === 3 ? 'col-span-2' : 'col-span-1'} relative h-full bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group`}>
          {videoUrl ? (
            <div className="relative w-full h-full" onClick={() => setIsVideoOpen(true)}>
              {videoThumbnailUrl ? (
                <Image
                  src={videoThumbnailUrl}
                  alt={`${altPrefix} video`}
                  fill
                  sizes="(max-width: 1200px) 66vw, 800px"
                  className="object-cover"
                  priority={priority}
                />
              ) : displayImages[0] ? (
                <Image
                  src={displayImages[0]}
                  alt={altPrefix}
                  fill
                  sizes="(max-width: 1200px) 66vw, 800px"
                  className="object-cover"
                  priority={priority}
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          ) : displayImages[0] ? (
            <div className="relative w-full h-full" onClick={() => setSelectedImageIndex(0)}>
              <Image
                src={displayImages[0]}
                alt={altPrefix}
                fill
                sizes="(max-width: 1200px) 66vw, 800px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority={priority}
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 h-full">
          {displayImages[1] && (
            <div
              className="relative flex-1 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImageIndex(1)}
            >
              <Image
                src={displayImages[1]}
                alt={`${altPrefix} - 2`}
                fill
                sizes="400px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {displayImages[2] && (
            <div
              className="relative flex-1 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImageIndex(2)}
            >
              <Image
                src={displayImages[2]}
                alt={`${altPrefix} - 3`}
                fill
                sizes="400px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {totalImages > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                  <div className="flex items-center gap-2 text-white">
                    <Camera className="w-6 h-6" />
                    <span className="text-lg font-bold">+{totalImages - 4}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {displayImages[3] && (
          <div
            className="relative h-full bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => setSelectedImageIndex(3)}
          >
            <Image
              src={displayImages[3]}
              alt="Resim 4"
              fill
              sizes="400px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </div>

      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => {
            setSelectedImageIndex(null);
            onClose?.();
          }}
        >
          <button
            onClick={() => {
              setSelectedImageIndex(null);
              onClose?.();
            }}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10 bg-black/40 rounded-full p-2 backdrop-blur-sm"
          >
            <X className="w-8 h-8" />
          </button>

          {selectedImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-6 text-white hover:text-gray-300 transition-colors z-10 bg-black/40 rounded-full p-3 backdrop-blur-sm hover:bg-black/60"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {selectedImageIndex < displayImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-6 text-white hover:text-gray-300 transition-colors z-10 bg-black/40 rounded-full p-3 backdrop-blur-sm hover:bg-black/60"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          <div
            className="relative w-full h-full flex items-center justify-center px-4 sm:px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <Image
                key={`lightbox-${selectedImageIndex}`}
                src={displayImages[selectedImageIndex]}
                alt={`${altPrefix} - ${selectedImageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm">
              {selectedImageIndex + 1} / {totalImages}
            </div>
          </div>
        </div>
      )}

      {videoUrl && (
        <VideoPlayer
          videoUrl={videoUrl}
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          lang={lang}
        />
      )}
    </>
  );
}
