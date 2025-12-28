import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/ui/CookieBanner';

export default function PublicLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params?: { lang: string };
}) {
    const lang = params?.lang as 'tr' | 'en' || 'tr';

    return (
        <>
            <Header />
            <main className="min-h-[100dvh]">{children}</main>
            <Footer lang={lang} />
            <CookieBanner />
        </>
    );
}
