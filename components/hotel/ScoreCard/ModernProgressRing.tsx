import { Star, StarHalf } from 'lucide-react';

interface ModernProgressRingProps {
  score?: number;
}

const ModernProgressRing = ({ score = 8.5 }: ModernProgressRingProps) => {
  const percentage = score * 10;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md flex items-center gap-6 max-w-sm">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-100"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-yellow-500 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-zinc-900">{score}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-zinc-800 mb-1">GNK Skoru</h3>
        <div className="flex items-center gap-1 mb-2 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <StarHalf className="w-4 h-4 fill-current" />
        </div>
        <p className="text-sm font-medium text-zinc-500">Çok İyi</p>
      </div>
    </div>
  );
};

export default ModernProgressRing;
