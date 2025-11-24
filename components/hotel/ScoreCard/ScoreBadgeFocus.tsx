import { Star, StarHalf, Award } from 'lucide-react';

interface ScoreBadgeFocusProps {
  score?: number;
}

const ScoreBadgeFocus = ({ score = 8.5 }: ScoreBadgeFocusProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-zinc-100 flex items-center justify-between max-w-sm">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-zinc-800">Mükemmel</h3>
        </div>
        <p className="text-sm text-zinc-500">GNK misafir puanı</p>
        <div className="flex items-center gap-1 mt-3 text-yellow-500">
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <StarHalf className="w-5 h-5 fill-current" />
        </div>
      </div>

      <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center shadow-lg ring-4 ring-yellow-500/30">
        <span className="text-4xl font-black text-white tracking-tighter">{score}</span>
      </div>
    </div>
  );
};

export default ScoreBadgeFocus;
