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
    const preview = await isLocalFoodPreview();
    const [{PublicLayoutWrapper},{Footer},dict]=await Promise.all([import('@/components/PublicLayoutWrapper'),import('@/components/Footer'),getDictionary(lang)]);

    return (
        <PublicLayoutWrapper
            preview={preview}
            lang={lang}
            dict={dict}
            footer={<Footer lang={lang} localPreview={preview} />}
        >
            {children}
        </PublicLayoutWrapper>
    );
}
