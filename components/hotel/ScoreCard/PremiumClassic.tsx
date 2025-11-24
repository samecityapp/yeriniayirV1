import { Star, StarHalf } from 'lucide-react';

interface PremiumClassicProps {
  score?: number;
}

const PremiumClassic = ({ score = 8.5 }: PremiumClassicProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100 flex flex-col items-center justify-center text-center max-w-xs">
      <h3 className="text-lg font-medium text-zinc-500 mb-2 uppercase tracking-wider">
        GNK Skor
      </h3>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-5xl font-extrabold text-zinc-900">{score}</span>
        <span className="text-2xl font-semibold text-zinc-400">/10</span>
      </div>
      <div className="flex items-center gap-1 text-yellow-500">
        <Star className="w-6 h-6 fill-current" />
        <Star className="w-6 h-6 fill-current" />
        <Star className="w-6 h-6 fill-current" />
        <Star className="w-6 h-6 fill-current" />
        <StarHalf className="w-6 h-6 fill-current" />
      </div>
    </div>
  );
};

export default PremiumClassic;
