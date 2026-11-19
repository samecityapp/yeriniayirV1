import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Otel Listesi | Yerini Ayır',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function OtelListesiPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Otel Listesi</h1>
      <p className="text-gray-600">Bu sayfa yakında güncellenecek.</p>
    </div>
  );
}
