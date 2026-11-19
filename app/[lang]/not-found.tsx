import Link from 'next/link';
import { MapPinOff } from 'lucide-react';
import { isHotelSurfaceEnabled } from '@/lib/hotelLaunchGate';

export default function NotFound() {
  const hotelEnabled = isHotelSurfaceEnabled();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <MapPinOff className="w-32 h-32 text-zinc-300 stroke-[1.5]" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Rotanızı mı Kaybettiniz?
          </h1>
          <p className="text-lg text-zinc-500 leading-relaxed max-w-md mx-auto">
            {hotelEnabled
              ? 'Aradığınız sayfa taşınmış veya silinmiş olabilir. Sizi seçili otellere geri götürelim.'
              : 'Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Doğrulanmış yerel gastronomi seçkilerine geri dönebilirsiniz.'}
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white font-medium py-4 px-8 rounded-lg transition-colors duration-200"
          >
            Anasayfaya Dön
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-sm text-zinc-400">
            veya{' '}
            <Link
              href={hotelEnabled ? '/search' : '/gastronomi'}
              className="text-zinc-600 hover:text-foreground font-medium underline underline-offset-4 transition-colors"
            >
              {hotelEnabled ? 'otellere göz atın' : 'gastronomi dizinine göz atın'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
