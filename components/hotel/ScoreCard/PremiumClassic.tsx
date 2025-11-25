import { Star, StarHalf } from 'lucide-react';

interface PremiumClassicProps {
  score?: number;
}

const PremiumClassic = ({ score = 8.5 }: PremiumClassicProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-zinc-100 flex flex-col items-center justify-center text-center">
      <h3 className="text-sm font-medium text-zinc-500 mb-1 uppercase tracking-wider">
        GNK SKOR
      </h3>
      <div className="flex items-baseline gap-0.5 mb-2">
        <span className="text-4xl font-extrabold text-zinc-900">{score}</span>
        <span className="text-xl font-semibold text-zinc-400">/10</span>
      </div>
      <div className="flex items-center gap-0.5 text-yellow-500">
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <StarHalf className="w-5 h-5 fill-current" />
      </div>
    </div>
  );
};

export default PremiumClassic;
