import Link from 'next/link';
import { FileText, Shield, Cookie, Lock, SlidersHorizontal } from 'lucide-react';

const legalPages = [
  {
    slug: 'kullanim-kosullari',
    label: 'Kullanım Koşulları',
    labelEn: 'Terms of Use',
    icon: FileText,
  },
  {
    slug: 'gizlilik-politikasi',
    label: 'Gizlilik Politikası',
    labelEn: 'Privacy Policy',
    icon: Shield,
  },
  {
    slug: 'cerez-politikasi',
    label: 'Çerez Politikası',
    labelEn: 'Cookie Policy',
    icon: Cookie,
  },
  {
    slug: 'kvkk-aydinlatma-metni',
    label: 'KVKK Aydınlatma Metni',
    labelEn: 'KVKK Disclosure',
    icon: Lock,
  },
];

export default async function LegalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ lang: string }>;
}) {
  const resolvedParams = params ? await params : undefined;
  const isEn = resolvedParams?.lang === 'en';
  const localePrefix = isEn ? '/en' : '/tr';

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-8">
              <h2 className="text-sm font-semibold text-zinc-900 mb-4 px-3">
                {isEn ? 'Legal Documents' : 'Yasal Belgeler'}
              </h2>
              <nav className="space-y-1">
                {legalPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={page.slug}
                      href={`${localePrefix}/${page.slug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {isEn ? page.labelEn : page.label}
                    </Link>
                  );
                })}
                <a
                  href="#cerez-ayarlari"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {isEn ? 'Cookie Preferences' : 'Çerez Tercihleri'}
                </a>
              </nav>

              <div className="mt-8 p-4 bg-white rounded-lg border border-zinc-200 space-y-1">
                <p className="text-xs text-zinc-500">
                  {isEn ? 'Last updated: November 19, 2026' : 'Son güncelleme: 19 Kasım 2026'}
                </p>
                <p className="text-xs text-zinc-400">
                  {isEn ? 'Scope: Gastronomy Discovery' : 'Kapsam: Yalnızca Gastronomi Yayını'}
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
