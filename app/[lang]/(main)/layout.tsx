import {isLocalFoodPreview} from '@/lib/food/localPreview';
import { getDictionary } from '@/lib/dictionary';

export default async function PublicLayout(
    props: {
        children: React.ReactNode;
        params?: Promise<{ lang: string }>;
    }
) {
    const params = await props.params;

    const {
        children
    } = props;

    const lang = (params?.lang as 'tr' | 'en') || 'tr';
    if(await isLocalFoodPreview())return <div className="min-h-[100dvh]">{children}</div>;
    const [{PublicLayoutWrapper},{Footer},dict]=await Promise.all([import('@/components/PublicLayoutWrapper'),import('@/components/Footer'),getDictionary(lang)]);

    return (
        <PublicLayoutWrapper
            preview={(await isLocalFoodPreview())}
            lang={lang}
            dict={dict}
            footer={<Footer lang={lang} localPreview={(await isLocalFoodPreview())} />}
        >
            {children}
        </PublicLayoutWrapper>
    );
}
