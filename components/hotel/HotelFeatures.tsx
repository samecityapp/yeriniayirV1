'use client';

import * as LucideIcons from 'lucide-react';

interface HotelFeaturesProps {
  tags?: Array<{ name: string; slug: string; icon?: string }>;
  isMobile?: boolean;
}

export function HotelFeatures({ tags, isMobile = false }: HotelFeaturesProps) {
  if (isMobile) {
    return (
      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-4">Otel Özellikleri</h2>
        {tags && tags.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {tags.map((tag, index) => {
              const IconComponent = (LucideIcons as any)[tag.icon || 'Tag'] || LucideIcons.Tag;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 p-3 bg-white shadow-lg rounded-2xl"
                >
                  <IconComponent className="w-5 h-5 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-gray-600 font-medium text-[14px] leading-snug">{tag.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 font-medium text-sm">Otel özellikleri henüz eklenmemiş.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <h2 className="text-[20px] font-semibold text-gray-900 mb-4">Otel Özellikleri</h2>
      {tags && tags.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {tags.map((tag, index) => {
            const IconComponent = (LucideIcons as any)[tag.icon || 'Tag'] || LucideIcons.Tag;
            return (
              <div
                key={index}
                className="flex items-center gap-2.5 p-3 bg-white shadow-lg rounded-2xl"
              >
                <IconComponent className="w-5 h-5 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-gray-600 font-medium text-[14px] leading-snug">{tag.name}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 font-medium text-sm">Otel özellikleri henüz eklenmemiş.</p>
        </div>
      )}
    </div>
  );
}
