import { Star, StarHalf } from 'lucide-react';

interface GildedEdgeProps {
  score?: number;
}

const GildedEdge = ({ score = 8.5 }: GildedEdgeProps) => {
  return (
    <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-700 max-w-xs shadow-xl">
      <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full w-full">
        <h3 className="text-base font-medium text-zinc-600 mb-2">GNK Değerlendirmesi</h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-800">
            {score}
          </span>
          <span className="text-xl font-semibold text-zinc-400">/10</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <StarHalf className="w-5 h-5 fill-current" />
        </div>
      </div>
    </div>
  );
};

export default GildedEdge;
