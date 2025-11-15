'use client';


type MobileHotelInfoProps = {
  hotelName: string;
  price: number;
  rating: number;
  location: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
};

export function MobileHotelInfo({
  hotelName,
  price,
  rating,
  location,
  googleMapsUrl,
  websiteUrl,
  instagramUrl,
}: MobileHotelInfoProps) {
  const locationCity = location.split(',')[0].trim();

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 mx-5 mt-2">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight text-center">
        {hotelName}
      </h1>

      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 text-center">
          <p className="text-xs font-medium text-gray-600 mb-0.5">Konum</p>
          <p className="text-base font-bold text-gray-900">{locationCity}</p>
        </div>
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 text-center">
          <p className="text-xs font-medium text-gray-600 mb-0.5">GNK Skor</p>
          <p className="text-base font-bold text-gray-900 mb-1">{rating.toFixed(1)}<span className="mx-0.5">/</span>10</p>
          <div className="flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3.5 h-3.5 ${star <= rating / 2 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 text-center">
          <p className="text-xs font-medium text-gray-600 mb-0.5">Fiyat</p>
          <p className="text-base font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
        </div>
      </div>

      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center h-[52px] bg-white shadow-lg rounded-2xl text-gray-900 font-normal transition-all text-[16px]"
        >
          <svg className="w-5 h-5 mr-2 text-gray-900" fill="currentColor" viewBox="0 0 24 24" strokeWidth="0">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Instagram
        </a>
      )}
    </div>
  );
}
