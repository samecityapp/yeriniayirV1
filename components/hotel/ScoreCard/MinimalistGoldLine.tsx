import { Star, StarHalf } from 'lucide-react';

interface MinimalistGoldLineProps {
  score?: number;
}

const MinimalistGoldLine = ({ score = 8.5 }: MinimalistGoldLineProps) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-zinc-50/50 flex flex-col items-center justify-center text-center max-w-xs">
       <div className="flex items-baseline gap-1">
        <span className="text-6xl font-black text-zinc-900 tracking-tight">{score}</span>
        <span className="text-2xl font-medium text-zinc-300">/10</span>
      </div>
      <div className="w-16 h-1 bg-yellow-500 rounded-full my-4"></div>
      <div className="flex items-center gap-2 text-yellow-500">
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <StarHalf className="w-5 h-5 fill-current" />
        <span className="text-sm font-medium text-zinc-600 ml-1">(Harika)</span>
      </div>
    </div>
  );
};

export default MinimalistGoldLine;
