import { GastronomyCookieBanner } from '@/components/food/GastronomyCookieBanner';
import { getDictionary } from '@/lib/dictionary';
import { isLocalFoodPreviewSync } from '@/lib/food/localPreview';

export default async function GastronomyLayout(props: {
  children: React.ReactNode;
  params?: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params?.lang === 'en' ? 'en' : 'tr';
  const preview = isLocalFoodPreviewSync();
  const cookieBannerDict = preview ? null : (await getDictionary(lang)).cookie_banner;

  return (
    <>
      <div className="min-h-[100dvh]">{props.children}</div>
      {!preview && cookieBannerDict && (
        <GastronomyCookieBanner dict={{ cookie_banner: cookieBannerDict }} />
      )}
    </>
  );
}
