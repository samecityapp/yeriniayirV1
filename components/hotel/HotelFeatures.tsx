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
    <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Otel Özellikleri</h2>
        {tags && tags.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {tags.map((tag, index) => {
              const IconComponent = (LucideIcons as any)[tag.icon || 'Tag'] || LucideIcons.Tag;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl sm:rounded-2xl hover:shadow-md transition-all group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-blue-900 font-semibold text-xs sm:text-sm leading-tight">{tag.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium">Otel özellikleri henüz eklenmemiş.</p>
          </div>
        )}
      </div>
    </div>
  );
}
