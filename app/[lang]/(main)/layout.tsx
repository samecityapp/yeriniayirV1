import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { getDictionary } from '@/lib/dictionary';

export default async function PublicLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params?: { lang: string };
}) {
    const lang = params?.lang as 'tr' | 'en' || 'tr';
    const dict = await getDictionary(lang);

    return (
        <>
            <Header lang={lang} />
            <main className="min-h-[100dvh]">{children}</main>
            <Footer lang={lang} />
            <CookieBanner dict={dict} />
        </>
    );
}
