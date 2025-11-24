import PremiumClassic from '@/components/hotel/ScoreCard/PremiumClassic';
import SophisticatedDark from '@/components/hotel/ScoreCard/SophisticatedDark';
import GildedEdge from '@/components/hotel/ScoreCard/GildedEdge';
import ScoreBadgeFocus from '@/components/hotel/ScoreCard/ScoreBadgeFocus';
import MinimalistGoldLine from '@/components/hotel/ScoreCard/MinimalistGoldLine';
import ModernProgressRing from '@/components/hotel/ScoreCard/ModernProgressRing';
import BoldTypography from '@/components/hotel/ScoreCard/BoldTypography';

export default function ScoreDesignsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GNK Skor Tasarımları</h1>
          <p className="text-gray-600">7 farklı tasarım seçeneği</p>
        </div>

        <div className="space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl p-8 shadow-sm w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Premium Classic</h2>
              <p className="text-gray-600 mb-6">Mobilden İlham Alan Lüks - Yumuşak gölge ve altın sarısı yıldızlarla temiz, şık tasarım</p>
              <div className="flex justify-center">
                <PremiumClassic score={8.5} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl p-8 shadow-sm w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Sophisticated Dark</h2>
              <p className="text-gray-600 mb-6">Karanlık Mod Şıklığı - Premium ve ciddi hava, lüks segment oteller için mükemmel</p>
              <div className="flex justify-center">
                <SophisticatedDark score={8.5} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl p-8 shadow-sm w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Gilded Edge</h2>
              <p className="text-gray-600 mb-6">Altın Çerçeveli Zarafet - İnce degrade altın çerçeve ile mücevher görünümü</p>
              <div className="flex justify-center">
                <GildedEdge score={8.5} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl p-8 shadow-sm w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Score Badge Focus</h2>
              <p className="text-gray-600 mb-6">Rozet Stili Odak - Puanı madalyon içine alarak kahramanlaştırır, ödül hissi</p>
              <div className="flex justify-center">
                <ScoreBadgeFocus score={8.5} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl p-8 shadow-sm w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Minimalist Gold Line</h2>
              <p className="text-gray-600 mb-6">Sade ve Güçlü - Az çoktur felsefesi, altın çizgi kaliteyi simgeler</p>
              <div className="flex justify-center">
                <MinimalistGoldLine score={8.5} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl p-8 shadow-sm w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">6. Modern Progress Ring</h2>
              <p className="text-gray-600 mb-6">Dinamik İlerleme - Başarı göstergesi ile görsel tatmin, modern arayüz</p>
              <div className="flex justify-center">
                <ModernProgressRing score={8.5} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl p-8 shadow-sm w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">7. Bold Typography & Asymmetry</h2>
              <p className="text-gray-600 mb-6">Cesur ve Modern - Asimetrik büyük tipografi, dergi kapağı estetiği</p>
              <div className="flex justify-center">
                <BoldTypography score={8.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
