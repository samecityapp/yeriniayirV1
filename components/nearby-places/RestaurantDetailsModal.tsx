import { Restaurant } from '@/lib/types';
import { getLocalizedText } from '@/lib/localization';
import { Utensils, MessageSquare, X } from 'lucide-react';

type RestaurantDetailsModalProps = {
  restaurant: Restaurant;
  lang?: 'tr' | 'en';
  onClose: () => void;
};

export function RestaurantDetailsModal({ restaurant, lang = 'tr', onClose }: RestaurantDetailsModalProps) {
  const orderSuggestionText = restaurant.order_suggestion || restaurant.orderSuggestion;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">{getLocalizedText(restaurant.name, lang)}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center text-blue-800 mb-2">
              <Utensils size={20} className="mr-2" />
              <h3 className="font-semibold">{lang === 'tr' ? 'Ne Sipariş Etmeli?' : 'What to Order?'}</h3>
            </div>
            <p className="text-blue-900 font-medium">{orderSuggestionText ? getLocalizedText(orderSuggestionText, lang) : ''}</p>
          </div>
          {restaurant.notes && restaurant.notes.length > 0 && (
            <div>
              <div className="flex items-center text-gray-800 mb-3">
                <MessageSquare size={20} className="mr-2" />
                <h3 className="font-semibold">{lang === 'tr' ? 'Müdavimleri Ne Diyor?' : 'What do Regulars Say?'}</h3>
              </div>
              <div className="space-y-3">
                {restaurant.notes.map((note, idx) => (
                  <div key={note.id || idx} className="bg-gray-100 rounded-lg p-3 flex items-start">
                    <span className="mr-3 text-lg">{note.emoji}</span>
                    <p className="text-gray-700 text-sm">{getLocalizedText(note.text, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
