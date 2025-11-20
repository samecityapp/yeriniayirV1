'use client';

interface HotelDescriptionProps {
  about: string;
  isMobile?: boolean;
}

export function HotelDescription({ about, isMobile = false }: HotelDescriptionProps) {
  if (isMobile) {
    return (
      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-4">Neden Bu Otel</h2>
        {about ? (
          <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line">
            {about}
          </p>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 font-medium text-sm">Bu bölüm henüz doldurulmamış.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Neden Bu Otel</h2>
        {about ? (
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {about}
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium">Bu bölüm henüz doldurulmamış.</p>
          </div>
        )}
      </div>
    </div>
  );
}
