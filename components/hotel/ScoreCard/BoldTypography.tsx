import { Star, StarHalf } from 'lucide-react';

interface BoldTypographyProps {
  score?: number;
}

const BoldTypography = ({ score = 8.5 }: BoldTypographyProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden max-w-xs">
      <span className="absolute -top-6 -right-4 text-[10rem] font-black text-zinc-50 select-none pointer-events-none">
        {Math.floor(score)}
      </span>

      <div className="relative z-10">
        <h3 className="text-base font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          GNK Puanı
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-7xl font-black text-zinc-900 tracking-tighter leading-none">
            {score}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex gap-1 text-yellow-500">
             <Star className="w-5 h-5 fill-current" />
             <Star className="w-5 h-5 fill-current" />
             <Star className="w-5 h-5 fill-current" />
             <Star className="w-5 h-5 fill-current" />
             <StarHalf className="w-5 h-5 fill-current" />
          </div>
          <span className="text-sm font-bold text-zinc-700">Harika</span>
        </div>
      </div>
    </div>
  );
};

export default BoldTypography;
