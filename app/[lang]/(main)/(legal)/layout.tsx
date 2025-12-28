import Link from 'next/link';
import { FileText, Shield, Cookie, Lock } from 'lucide-react';

const legalPages = [
  {
    href: '/kullanim-kosullari',
    label: 'Kullanım Koşulları',
    icon: FileText,
  },
  {
    href: '/gizlilik-politikasi',
    label: 'Gizlilik Politikası',
    icon: Shield,
  },
  {
    href: '/cerez-politikasi',
    label: 'Çerez Politikası',
    icon: Cookie,
  },
  {
    href: '/kvkk-aydinlatma-metni',
    label: 'KVKK Aydınlatma Metni',
    icon: Lock,
  },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-8">
              <h2 className="text-sm font-semibold text-zinc-900 mb-4 px-3">
                Yasal Dökümanlar
              </h2>
              <nav className="space-y-1">
                {legalPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {page.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 p-4 bg-white rounded-lg border border-zinc-200">
                <p className="text-xs text-zinc-500">
                  Son güncelleme: {new Date().toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 sm:p-12">
              <div className="max-w-3xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
