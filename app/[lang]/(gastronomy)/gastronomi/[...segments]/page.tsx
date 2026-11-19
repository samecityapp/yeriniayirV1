import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GastronomyPageClient } from '@/components/food/GastronomyPageClient';
import {
  GeoBreadcrumbNav,
  GeoFaqSection,
  GeoRegionSelectionAtlas,
  GeoSubRegionsAndSiblingLinks,
} from '@/components/food/GeoSemanticSections';
import { isLocalFoodPreviewSync } from '@/lib/food/localPreview';
import type { VisitorFoodDiscovery } from '@/lib/food/types';
import {
  buildGeoAlternates,
  buildGeoPageHref,
  buildGeoPublicUrl,
  EN_SITE_ORIGIN,
  getCityNameLocalized,
  getFoodCategoryTitleEn,
  getModaKadikoyPilotStaticParamTuples,
  getSiblingRegionsForLocation,
  resolveGeoHierarchySegments,
  TR_SITE_ORIGIN,
} from '@/lib/gastronomy-v3/geoCatalog';
import {
  buildBreadcrumbJsonLd,
  buildDirectoryCollectionJsonLd,
  buildFaqJsonLd,
  buildRegionOverviewFaqs,
  buildSelectionCollectionJsonLd,
} from '@/lib/gastronomy-v3/geoSchema';
import { V3_LOCATIONS } from '@/lib/gastronomy-v3/registry';

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  const tuples = getModaKadikoyPilotStaticParamTuples();
  const params: Array<{ lang: string; segments: string[] }> = [];
  for (const lang of ['tr', 'en'] as const) {
    for (const tuple of tuples) {
      params.push({ lang, segments: tuple.segments });
    }
  }
  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; segments: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'tr';
  const isEn = lang === 'en';
  const preview = isLocalFoodPreviewSync();
  const resolved = await resolveGeoHierarchySegments(params.segments);

  if (!resolved) {
    return {
      title: isEn ? 'Page Not Found' : 'Sayfa Bulunamadı',
      robots: { index: false, follow: false },
    };
  }

  const subPath = `/${params.segments.join('/')}`;
  const alternates = buildGeoAlternates(subPath, lang);

  if (resolved.kind === 'city') {
    const cityName = getCityNameLocalized(resolved.city.citySlug, resolved.city.cityName, lang);
    return {
      title: isEn
        ? `${cityName} Gastronomy Guide — ${resolved.city.regions.length} Neighborhoods`
        : `${cityName} Gastronomi Rehberi — ${resolved.city.regions.length} Doğrulanmış Bölge`,
      description: isEn
        ? `Curated neighborhood food and specialty coffee guides across ${resolved.city.regions.length} districts and quarters in ${cityName}.`
        : `${cityName} ilindeki ${resolved.city.regions.length} farklı semt ve ilçede doğrulanmış restoran, kafe, fırın ve yerel lezzet seçkileri.`,
      ...(preview ? { robots: { index: false, follow: false } } : { alternates }),
    };
  }

  if (resolved.kind === 'district-hub') {
    const cityName = getCityNameLocalized(resolved.citySlug, resolved.cityName, lang);
    return {
      title: isEn
        ? `${resolved.districtName}, ${cityName} — Food & Coffee Selections`
        : `${resolved.districtName}, ${cityName} Gastronomi Rehberi`,
      description: isEn
        ? `Browse ${resolved.childRegions.length} curated neighborhood guides across ${resolved.districtName}, ${cityName}.`
        : `${resolved.districtName} (${cityName}) içindeki ${resolved.childRegions.length} semtte doğrulanmış yemek ve kahve durakları.`,
      ...(preview ? { robots: { index: false, follow: false } } : { alternates }),
    };
  }

  if (resolved.kind === 'region') {
    const loc = resolved.location;
    return {
      title: isEn
        ? `${loc.displayName} Food Guide (${resolved.payload.venues.length} Places)`
        : `${loc.displayName} Gastronomi Rehberi (${resolved.payload.venues.length} Doğrulanmış Mekân)`,
      description: isEn
        ? `${resolved.payload.venues.length} verified places across ${resolved.activeCategories.length} categories in ${loc.displayName}. ${loc.characterSubtitle || loc.scopeNote || ''}`
        : `${loc.displayName} seçkisinde ${resolved.activeCategories.length} kategoride ${resolved.payload.venues.length} bağımsız mekân. ${loc.characterSubtitle || loc.scopeNote || ''}`,
      ...(preview ? { robots: { index: false, follow: false } } : { alternates }),
    };
  }

  const { location, category, payload } = resolved;
  const catCount = payload.venues.filter((v) => v.categorySlugs.includes(category.slug)).length;
  const catNameEn = getFoodCategoryTitleEn(category);

  return {
    title: isEn
      ? `${catNameEn} in ${location.displayName} (${catCount} Spots)`
      : `${location.locative} ${category.title} Seçkisi (${catCount} Mekân) · ${location.city}`,
    description: isEn
      ? `${catCount} verified independent spots for ${catNameEn.toLowerCase()} in ${location.displayName}, with signature dishes and Google Maps links.`
      : `${location.displayName} sınırları içinde ${category.title} kategorisinde doğrulanmış ${catCount} bağımsız durak, sipariş önerileri ve yol tarifi notları.`,
    ...(preview ? { robots: { index: false, follow: false } } : { alternates }),
  };
}

export default async function GastronomyHierarchyPage(props: {
  params: Promise<{ lang: string; segments: string[] }>;
}) {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'tr';
  const isEn = lang === 'en';
  const resolved = await resolveGeoHierarchySegments(params.segments);

  if (!resolved) {
    notFound();
  }

  const subPath = `/${params.segments.join('/')}`;
  const pageUrl = buildGeoPublicUrl(subPath, lang);
  const homeUrl = isEn ? EN_SITE_ORIGIN : TR_SITE_ORIGIN;
  const indexUrl = buildGeoPublicUrl('/', lang);

  // ---------------------------------------------------------------------------
  // 1. CITY HUB (/gastronomi/istanbul)
  // ---------------------------------------------------------------------------
  if (resolved.kind === 'city') {
    const city = resolved.city;
    const cityName = getCityNameLocalized(city.citySlug, city.cityName, lang);

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: isEn ? 'Home' : 'Ana Sayfa', url: homeUrl },
      { name: isEn ? 'Gastronomy Guide' : 'Gastronomi Rehberi', url: indexUrl },
      { name: cityName, url: pageUrl },
    ]);

    const collectionJsonLd = buildDirectoryCollectionJsonLd({
      pageUrl,
      name: isEn ? `${cityName} Gastronomy Guide` : `${cityName} Gastronomi Rehberi`,
      description: isEn
        ? `Verified dining and specialty coffee neighborhood selections in ${cityName}.`
        : `${cityName} ilinde doğrulanmış semt bazlı gastronomi rehberi.`,
      lang,
      items: city.regions.map((r) => ({
        name: r.displayName,
        url: buildGeoPublicUrl(`/${r.path.join('/')}`, lang),
        description: r.characterSubtitle || r.scopeNote,
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
                {cityName}
              </span>
            </Link>
            <Link
              href={buildGeoPageHref('/', lang, 'internal')}
              prefetch={false}
              className="text-xs font-bold text-[#6E5A53] hover:text-[#181210]"
            >
              {isEn ? 'All 21 Cities' : 'Tüm 21 İl'}
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          <div>
            <GeoBreadcrumbNav
              items={[
                { label: isEn ? 'Home' : 'Ana Sayfa', href: `/${lang}` },
                { label: isEn ? 'Gastronomy Guide' : 'Gastronomi Rehberi', href: buildGeoPageHref('/', lang, 'internal') },
                { label: cityName },
              ]}
            />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#181210]">
              {isEn ? `${cityName} Gastronomy Guide` : `${cityName} Gastronomi Rehberi`}
            </h1>
            <p className="text-sm text-[#4E403B] mt-2 leading-relaxed">
              {isEn
                ? `${cityName} features ${city.regions.length} verified neighborhood selections across ${city.districts.length} districts and zones.`
                : `${cityName} genelinde ${city.districts.length} ilçe/bölge grubunda toplam ${city.regions.length} doğrulanmış semt seçkisi yayınlanmaktadır.`}
            </p>
          </div>

          <div className="space-y-4">
            {city.districts.map((dist) => {
              const hasOwnRegion = city.regions.some(
                (r) => r.path.length === 2 && r.path[1] === dist.districtSlug
              );
              const multiChildDistrict = dist.regions.some((r) => r.path.length === 3);

              return (
                <section
                  key={dist.districtSlug}
                  className="rounded-2xl bg-white border border-[#EFE5DF] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#EFE5DF] pb-2">
                    <h2 className="text-lg font-black text-[#181210]">
                      {hasOwnRegion || multiChildDistrict ? (
                        <Link
                          href={buildGeoPageHref(`/${city.citySlug}/${dist.districtSlug}`, lang, 'internal')}
                          prefetch={false}
                          className="hover:text-[#C42B1C]"
                        >
                          {dist.districtName}
                        </Link>
                      ) : (
                        dist.districtName
                      )}
                    </h2>
                    <span className="text-xs font-bold text-[#6E5A53]">
                      {dist.regions.length} {isEn ? 'selections' : 'seçki'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dist.regions.map((loc) => (
                      <Link
                        key={loc.id}
                        href={buildGeoPageHref(`/${loc.path.join('/')}`, lang, 'internal')}
                        prefetch={false}
                        className="rounded-xl bg-[#FCFAF8] hover:bg-[#FFF5F3] border border-[#EFE5DF] p-3.5 space-y-1 transition-colors"
                      >
                        <div className="text-sm font-black text-[#181210]">{loc.name}</div>
                        <div className="text-xs text-[#5C4B45] line-clamp-2">
                          {loc.characterSubtitle || loc.scopeNote}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </main>

        <footer className="mt-auto border-t border-[#EFE5DF] bg-white py-6 px-4 text-xs text-[#68554E]">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-bold text-[#181210]">YERİNİ AYIR · {cityName}</span>
            <span>{city.regions.length} {isEn ? 'Published Selections' : 'Yayınlı Seçki'}</span>
          </div>
        </footer>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. DISTRICT HUB (/gastronomi/mugla/bodrum)
  // ---------------------------------------------------------------------------
  if (resolved.kind === 'district-hub') {
    const cityName = getCityNameLocalized(resolved.citySlug, resolved.cityName, lang);
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: isEn ? 'Home' : 'Ana Sayfa', url: homeUrl },
      { name: isEn ? 'Gastronomy Guide' : 'Gastronomi Rehberi', url: indexUrl },
      { name: cityName, url: buildGeoPublicUrl(`/${resolved.citySlug}`, lang) },
      { name: resolved.districtName, url: pageUrl },
    ]);

    const collectionJsonLd = buildDirectoryCollectionJsonLd({
      pageUrl,
      name: `${resolved.districtName}, ${cityName}`,
      description: isEn
        ? `Neighborhood food and specialty coffee selections across ${resolved.districtName}.`
        : `${resolved.districtName} (${cityName}) ilçesindeki tüm semt seçkileri.`,
      lang,
      items: resolved.childRegions.map((r) => ({
        name: r.displayName,
        url: buildGeoPublicUrl(`/${r.path.join('/')}`, lang),
        description: r.characterSubtitle || r.scopeNote,
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
                {resolved.districtName}
              </span>
            </Link>
            <Link
              href={buildGeoPageHref(`/${resolved.citySlug}`, lang, 'internal')}
              prefetch={false}
              className="text-xs font-bold text-[#6E5A53] hover:text-[#181210]"
            >
              {cityName}
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          <div>
            <GeoBreadcrumbNav
              items={[
                { label: isEn ? 'Home' : 'Ana Sayfa', href: `/${lang}` },
                { label: isEn ? 'Gastronomy Guide' : 'Gastronomi Rehberi', href: buildGeoPageHref('/', lang, 'internal') },
                { label: cityName, href: buildGeoPageHref(`/${resolved.citySlug}`, lang, 'internal') },
                { label: resolved.districtName },
              ]}
            />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#181210]">
              {resolved.districtName}, {cityName}
            </h1>
            <p className="text-sm text-[#4E403B] mt-2 leading-relaxed">
              {isEn
                ? `${resolved.childRegions.length} independent neighborhood selections curated under ${resolved.districtName}.`
                : `${resolved.districtName} (${cityName}) sınırlarında yayınlanan ${resolved.childRegions.length} doğrulanmış semt rehberi.`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resolved.childRegions.map((loc) => (
              <Link
                key={loc.id}
                href={buildGeoPageHref(`/${loc.path.join('/')}`, lang, 'internal')}
                prefetch={false}
                className="rounded-2xl bg-white hover:bg-[#FFF5F3] border border-[#EFE5DF] p-5 space-y-2 transition-colors"
              >
                <div className="text-lg font-black text-[#181210]">{loc.name}</div>
                <p className="text-xs text-[#5C4B45] leading-relaxed">
                  {loc.characterSubtitle || loc.scopeNote}
                </p>
                <div className="text-xs font-bold text-[#B82516]">
                  {isEn ? 'Open Neighborhood Guide' : 'Semt Seçkisini İncele'} →
                </div>
              </Link>
            ))}
          </div>
        </main>

        <footer className="mt-auto border-t border-[#EFE5DF] bg-white py-6 px-4 text-xs text-[#68554E]">
          <div className="max-w-3xl mx-auto flex justify-between">
            <span className="font-bold text-[#181210]">YERİNİ AYIR · {resolved.districtName}</span>
            <span>{resolved.childRegions.length} {isEn ? 'Selections' : 'Seçki'}</span>
          </div>
        </footer>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. REGION OR CATEGORY PAGE (/gastronomi/istanbul/kadikoy/moda[/kahve])
  // ---------------------------------------------------------------------------
  const { location, snapshot, payload, activeCategories, childRegions } = resolved;
  const activeCat = resolved.kind === 'category' ? resolved.category : undefined;
  const citySlug = location.path[0];
  const cityName = getCityNameLocalized(citySlug, location.city || citySlug, lang);
  const regionBasePath = `/${location.path.join('/')}`;
  const siblingRegions = getSiblingRegionsForLocation(location);

  const discovery: VisitorFoodDiscovery = {
    locations: V3_LOCATIONS,
    categories: payload.categories,
    venues: payload.venues,
    nearbyVenues: payload.nearbyVenues,
  };

  const snapVenuesById = new Map(snapshot.venues.map((v) => [v.id, v]));
  const matchingVenues = activeCat
    ? payload.venues.filter((v) => v.categorySlugs.includes(activeCat.slug))
    : payload.venues;

  const breadcrumbItems = [
    { label: isEn ? 'Home' : 'Ana Sayfa', href: `/${lang}`, url: homeUrl },
    {
      label: isEn ? 'Gastronomy Guide' : 'Gastronomi Rehberi',
      href: buildGeoPageHref('/', lang, 'internal'),
      url: indexUrl,
    },
    {
      label: cityName,
      href: buildGeoPageHref(`/${citySlug}`, lang, 'internal'),
      url: buildGeoPublicUrl(`/${citySlug}`, lang),
    },
    ...(location.path.length === 3
      ? [
          {
            label: location.district || location.path[1],
            href: buildGeoPageHref(`/${location.path[0]}/${location.path[1]}`, lang, 'internal'),
            url: buildGeoPublicUrl(`/${location.path[0]}/${location.path[1]}`, lang),
          },
        ]
      : []),
    {
      label: location.name,
      ...(activeCat ? { href: buildGeoPageHref(regionBasePath, lang, 'internal') } : {}),
      url: buildGeoPublicUrl(regionBasePath, lang),
    },
    ...(activeCat
      ? [
          {
            label: isEn ? getFoodCategoryTitleEn(activeCat) : activeCat.title,
            url: pageUrl,
          },
        ]
      : []),
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    breadcrumbItems.map((b) => ({ name: b.label, url: b.url }))
  );

  const collectionJsonLd = buildSelectionCollectionJsonLd({
    pageUrl,
    name: activeCat
      ? isEn
        ? `${getFoodCategoryTitleEn(activeCat)} in ${location.displayName}`
        : `${location.locative} ${activeCat.title} Seçkisi`
      : location.displayName,
    description: location.characterSubtitle || location.scopeNote || location.displayName,
    lang,
    location,
    dateModified: snapshot.verifiedAt,
    venues: matchingVenues,
    snapshotVenuesById: snapVenuesById,
    activeCategorySlug: activeCat?.slug,
  });

  const faqs = buildRegionOverviewFaqs({
    location,
    activeCategories,
    venues: matchingVenues,
    lang,
  });
  const faqJsonLd = buildFaqJsonLd(faqs);

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-[#181210] flex flex-col font-sans antialiased">
      {/* Mevcut interaktif Gastronomi V5 arayüzü (görsel tasarım %100 korunur) */}
      <GastronomyPageClient
        discovery={discovery}
        initialLocationSlug={location.slug}
        initialCategorySlug={activeCat?.slug}
        categoryHrefBase={buildGeoPageHref(regionBasePath, lang, 'internal')}
        lang={lang}
        embedded={true}
      />

      {/* Breadcrumb + JS kapalı tam metin mekân rehberi + Hiyerarşik linkler + SSS */}
      <div className="bg-white border-t border-[#EFE5DF] px-4 pt-5 pb-1">
        <div className="max-w-2xl mx-auto">
          <GeoBreadcrumbNav items={breadcrumbItems.map(({ label, href }) => ({ label, href }))} />
        </div>
      </div>

      <GeoRegionSelectionAtlas
        location={location}
        activeCategories={activeCategories}
        venues={payload.venues}
        nearbyVenues={payload.nearbyVenues || []}
        activeCategorySlug={activeCat?.slug}
        lang={lang}
      />

      <GeoSubRegionsAndSiblingLinks
        childRegions={childRegions}
        siblingRegions={siblingRegions}
        citySlug={citySlug}
        cityName={cityName}
        lang={lang}
      />

      <GeoFaqSection
        title={isEn ? `Frequently Asked Questions — ${location.name}` : `${location.name} Rehberi Hakkında Sık Sorulan Sorular`}
        faqs={faqs}
      />

      <footer className="mt-auto border-t border-[#EFE5DF] bg-white py-6 px-4 text-xs text-[#68554E]">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-[#181210]">YERİNİ AYIR · Gastronomi Keşif Platformu</span>
          <span>{location.displayName}</span>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
