import { Star, StarHalf } from 'lucide-react';

interface SophisticatedDarkProps {
  score?: number;
}

const SophisticatedDark = ({ score = 8.5 }: SophisticatedDarkProps) => {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center text-center max-w-xs">
      <h3 className="text-sm font-semibold text-zinc-400 mb-1 uppercase tracking-widest">
        Misafir Puanı
      </h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-6xl font-black text-white tracking-tighter">{score}</span>
        <span className="text-xl font-medium text-zinc-500">/10</span>
      </div>
      <div className="flex items-center gap-1 text-yellow-400/90">
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <StarHalf className="w-5 h-5 fill-current" />
      </div>
    </div>
  );
};

export default SophisticatedDark;
