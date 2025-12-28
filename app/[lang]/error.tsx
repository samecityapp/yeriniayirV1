'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <AlertTriangle className="w-32 h-32 text-zinc-300 stroke-[1.5]" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Bir Şeyler Ters Gitti
          </h1>
          <p className="text-lg text-zinc-500 leading-relaxed max-w-md mx-auto">
            Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya anasayfaya dönün.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white font-medium py-4 px-8 rounded-lg transition-colors duration-200"
          >
            Tekrar Dene
          </button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-zinc-400">
            veya{' '}
            <a href="/" className="text-zinc-600 hover:text-foreground font-medium underline underline-offset-4 transition-colors">
              anasayfaya dönün
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
