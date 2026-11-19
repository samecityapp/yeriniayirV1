import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoBreadcrumbNav } from '@/components/food/GeoSemanticSections';
import { isLocalFoodPreviewSync } from '@/lib/food/localPreview';
import {
  buildGeoAlternates,
  buildGeoPageHref,
  buildGeoPublicUrl,
  buildGeoSocialMetadata,
  getCityNameLocalized,
  getGeoCities,
  TR_SITE_ORIGIN,
  EN_SITE_ORIGIN,
} from '@/lib/gastronomy-v3/geoCatalog';
import { PILOT_VENUE_IDS, resolveGeoPilotVenue } from '@/lib/gastronomy-v3/geoPilot';
import { buildBreadcrumbJsonLd, buildDirectoryCollectionJsonLd } from '@/lib/gastronomy-v3/geoSchema';
import { V3_LOCATIONS } from '@/lib/gastronomy-v3/registry';

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'tr';
  const isEn = lang === 'en';
  const preview = isLocalFoodPreviewSync();
  const title = isEn
    ? 'Turkey Gastronomy Guide — 21 Cities, 92 Neighborhood Selections'
    : 'Türkiye Gastronomi Rehberi — 21 İl, 92 Doğrulanmış Semt Seçkisi';
  const description = isEn
    ? 'Explore verified neighborhood gastronomy selections across 21 cities in Turkey, featuring an in-depth Moda and Kadikoy pilot guide.'
    : 'Türkiye genelinde 21 il ve 92 yayınlı bölgede bağımsız restoran, kafe, fırın ve sokak lezzetleri rehberi; Moda ve Kadıköy pilot seçkileriyle.';
  const alternates = buildGeoAlternates('/', lang);

  return {
    title,
    description,
    ...(preview
      ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }
      : {
          alternates,
          ...buildGeoSocialMetadata({
            title,
            description,
            url: alternates.canonical,
            lang,
          }),
        }),
  };
}

export default async function GastronomyIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'tr';
  const isEn = lang === 'en';
  const cities = getGeoCities();
  const pilotVenues = (await Promise.all(PILOT_VENUE_IDS.map((id) => resolveGeoPilotVenue(id)))).filter(
    (v): v is NonNullable<typeof v> => v !== null
  );

  const pageUrl = buildGeoPublicUrl('/', lang);
  const homeUrl = lang === 'en' ? EN_SITE_ORIGIN : TR_SITE_ORIGIN;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: isEn ? 'Home' : 'Ana Sayfa', url: homeUrl },
    { name: isEn ? 'Gastronomy Guide' : 'Gastronomi Rehberi', url: pageUrl },
  ]);

  const collectionJsonLd = buildDirectoryCollectionJsonLd({
    pageUrl,
    name: isEn
      ? 'Yerini Ayır — Turkey Gastronomy Selections'
      : 'Yerini Ayır — Türkiye Gastronomi Seçkileri',
    description: isEn
      ? 'Verified city, district, neighborhood and pilot venue index.'
      : 'Sıfır zincir ve sıkı mahalle sınırı doğrulamalı şehir, ilçe, semt ve mekân rehberi.',
    lang,
    items: cities.map((c) => ({
      name: `${getCityNameLocalized(c.citySlug, c.cityName, lang)} (${c.regions.length})`,
      url: buildGeoPublicUrl(`/${c.citySlug}`, lang),
    })),
  });

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-[#181210] flex flex-col font-sans antialiased">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE5DF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href={`/${lang}`} prefetch={false} className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight text-[#181210]">
              YERİNİ<span className="text-[#C42B1C] ml-0.5">AYIR</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF1EE] text-[#A61E11] border border-[#F2D5CE]">
              Gastronomi
            </span>
          </Link>
          <Link
            href={buildGeoPageHref('/istanbul/kadikoy/moda', lang, 'internal')}
            prefetch={false}
            className="text-xs font-bold px-3.5 py-2 rounded-full bg-[#C42B1C] hover:bg-[#A61E11] text-white transition-colors"
          >
            {isEn ? 'Explore Moda Pilot' : 'Moda Seçkisini Aç'}
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <div>
          <GeoBreadcrumbNav
            items={[
              { label: isEn ? 'Home' : 'Ana Sayfa', href: `/${lang}` },
              { label: isEn ? 'Gastronomy Directory' : 'Gastronomi Rehberi' },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#181210] leading-tight">
            {isEn
              ? 'Verified Local Gastronomy Selections Across Turkey'
              : 'Türkiye Genelinde Doğrulanmış Yerel Gastronomi Rehberi'}
          </h1>
          <p className="text-sm text-[#4E403B] leading-relaxed mt-3">
            {isEn
              ? `Coverage spans ${cities.length} cities and ${V3_LOCATIONS.length} published neighborhood selections. Every entry passes operational checks, zero-chain filtering, geographic boundary rules, and verified dish guidance without fabricated filler listings.`
              : `Rehber ${cities.length} ilde toplam ${V3_LOCATIONS.length} yayınlı semt ve ilçe seçkisi sunar. Tüm listeler operasyonel durum, sıfır zincir/franchise kuralı, sıkı coğrafi semt sınırı ve kanıtlı sipariş önerileriyle hazırlanır; nitelikli aday yoksa kategori doldurulmaz.`}
          </p>
        </div>

        {/* Moda & Kadıköy Pilot Bölümü */}
        <section aria-labelledby="pilot-spotlight-heading" className="rounded-3xl bg-white border border-[#EFE5DF] p-5 sm:p-6 space-y-5">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFF1EE] text-[#A61E11] border border-[#F2D5CE]">
              {isEn ? 'Featured Deep Pilot' : 'Öne Çıkan Derin Pilot Bölge'}
            </span>
            <h2 id="pilot-spotlight-heading" className="text-xl font-black text-[#181210]">
              {isEn ? 'Moda & Kadikoy Verified Guides' : 'Moda & Kadıköy Pilot Gastronomi Seçkisi'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4B45]">
              {isEn
                ? 'Browse complete neighborhood selections, category breakdowns, and 18 curated pilot venue dossiers across Moda and Kadikoy Market.'
                : 'Moda (29 durak) ve Kadıköy Merkez & Çarşı (32 durak) seçkilerini kategorilere göre inceleyin veya öne çıkan 18 pilot mekânın detaylı rehberlerine doğrudan geçin.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href={buildGeoPageHref('/istanbul/kadikoy/moda', lang, 'internal')}
              prefetch={false}
              className="rounded-2xl bg-[#FAF6F2] hover:bg-[#FFF5F3] border border-[#E6D9D0] p-4 space-y-1 transition-colors"
            >
              <div className="text-base font-black text-[#181210]">
                {isEn ? 'Moda, Kadikoy, Istanbul' : 'Moda, Kadıköy, İstanbul'}
              </div>
              <div className="text-xs text-[#5C4B45]">
                {isEn
                  ? '29 verified venues across Pizza, Burgers, Specialty Coffee, Date Spots, Breakfast, and Must-Try'
                  : 'Pizza, Hamburger, Kahve, Date Mekanları, Kahvaltı ve Denemelisin kategorilerinde 29 doğrulanmış mekan'}
              </div>
            </Link>
            <Link
              href={buildGeoPageHref('/istanbul/kadikoy', lang, 'internal')}
              prefetch={false}
              className="rounded-2xl bg-[#FAF6F2] hover:bg-[#FFF5F3] border border-[#E6D9D0] p-4 space-y-1 transition-colors"
            >
              <div className="text-base font-black text-[#181210]">
                {isEn ? 'Kadikoy Center & Historic Market' : 'Kadıköy Çarşı, Bahariye & Osmanağa'}
              </div>
              <div className="text-xs text-[#5C4B45]">
                {isEn
                  ? '32 verified venues plus direct links to all 7 surrounding Kadikoy neighborhood guides'
                  : '32 doğrulanmış mekan ve Kadıköy’ün diğer 7 semt rehberine doğrudan geçiş'}
              </div>
            </Link>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-[#EFE5DF]">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#68554E]">
              {isEn ? '18 Curated Moda & Kadikoy Venue Dossiers' : 'Moda & Kadıköy Seçkilerinden 18 Detaylı Mekân Rehberi'}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {pilotVenues.map((pv) => (
                <li key={pv.venueId} className="rounded-xl bg-[#FCFAF8] border border-[#EFE5DF] px-3 py-2">
                  <Link
                    href={buildGeoPageHref(`/mekan/${pv.venueId}`, lang, 'internal')}
                    prefetch={false}
                    className="font-bold text-[#181210] hover:text-[#C42B1C] block truncate"
                  >
                    {pv.snapshotVenue.name}
                  </Link>
                  <span className="text-[11px] text-[#6E5A53]">
                    {pv.snapshotVenue.neighborhood} · {pv.primaryCategoryLabel}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tüm 21 İl ve 92 Yayınlı Semt */}
        <section aria-labelledby="all-cities-heading" className="space-y-5">
          <h2 id="all-cities-heading" className="text-xl font-black text-[#181210]">
            {isEn ? 'All 21 Cities & 92 Neighborhood Guides' : 'Tüm 21 İl ve 92 Yayınlı Bölge Dizini'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cities.map((city) => (
              <div key={city.citySlug} className="rounded-2xl bg-white border border-[#EFE5DF] p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-[#EFE5DF] pb-2">
                  <h3 className="text-base font-black text-[#181210]">
                    <Link
                      href={buildGeoPageHref(`/${city.citySlug}`, lang, 'internal')}
                      prefetch={false}
                      className="hover:text-[#C42B1C]"
                    >
                      {getCityNameLocalized(city.citySlug, city.cityName, lang)}
                    </Link>
                  </h3>
                  <span className="text-[11px] font-bold text-[#6E5A53]">
                    {city.regions.length} {isEn ? 'areas' : 'bölge'}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-1.5 text-xs">
                  {city.regions.map((loc) => (
                    <li key={loc.id}>
                      <Link
                        href={buildGeoPageHref(`/${loc.path.join('/')}`, lang, 'internal')}
                        prefetch={false}
                        className="inline-block px-2.5 py-1 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#3F332E] hover:text-[#B82516] border border-[#E6D9D0]"
                      >
                        {loc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[#EFE5DF] bg-white py-6 px-4 text-xs text-[#68554E]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-[#181210]">YERİNİ AYIR · Gastronomi Keşif Platformu</span>
          <span>
            {cities.length} {isEn ? 'Cities' : 'İl'} · {V3_LOCATIONS.length}{' '}
            {isEn ? 'Verified Selections' : 'Doğrulanmış Seçki'}
          </span>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
    </div>
  );
}
