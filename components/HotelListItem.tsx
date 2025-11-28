import { MapPin, Star } from 'lucide-react';
import { getLocalizedText } from '@/lib/localization';
import { LocalizedString } from '@/lib/types';

type Hotel = { id: string; name: string | LocalizedString; location: string; gnkScore: number; price: string; [key: string]: any; };
type HotelListItemProps = { hotel: Hotel; };

export function HotelListItem({ hotel }: HotelListItemProps) {
  const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400', 'bg-purple-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex transform hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className={`w-1/3 flex-shrink-0 flex items-center justify-center ${randomColor}`}>
        <h3 className="text-white text-3xl font-bold opacity-80">GNK</h3>
      </div>
      <div className="p-5 flex-grow">
        <h3 className="font-bold text-xl text-gray-800 mb-1">{getLocalizedText(hotel.name)}</h3>
        <div className="flex items-center text-gray-500 mb-3">
          <MapPin size={14} className="mr-1.5 flex-shrink-0" />
          <p className="text-sm truncate">{getLocalizedText(hotel.location)}</p>
        </div>
        <div className="flex items-center mb-4">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-sm font-bold">{hotel.gnkScore}</span>
          <span className="text-blue-700 font-semibold text-sm ml-2">İyi</span>
          <span className="text-gray-500 text-sm ml-2">(435 yorum)</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {hotel.price} TRY
        </div>
      </div>
    </div>
  );
}