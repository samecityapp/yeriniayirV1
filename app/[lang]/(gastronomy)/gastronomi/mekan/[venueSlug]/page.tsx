import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ExternalLink, Utensils, Sparkles, Info, ArrowLeft } from 'lucide-react';
import { VenueImage } from '@/components/food/VenueImage';
import { GooglePlaceRating } from '@/components/food/GooglePlaceRating';
import { GeoBreadcrumbNav, GeoFaqSection } from '@/components/food/GeoSemanticSections';
import { isLocalFoodPreviewSync } from '@/lib/food/localPreview';
import {
  buildGeoAlternates,
  buildGeoPageHref,
  buildGeoPublicUrl,
  buildGeoSocialMetadata,
  EN_SITE_ORIGIN,
  getCityNameLocalized,
  TR_SITE_ORIGIN,
} from '@/lib/gastronomy-v3/geoCatalog';
import { PILOT_VENUE_IDS, resolveGeoPilotVenue } from '@/lib/gastronomy-v3/geoPilot';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildPilotVenueJsonLd,
} from '@/lib/gastronomy-v3/geoSchema';

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  const params: Array<{ lang: string; venueSlug: string }> = [];
  for (const lang of ['tr', 'en'] as const) {
    for (const venueSlug of PILOT_VENUE_IDS) {
      params.push({ lang, venueSlug });
    }
  }
  return params;
}

function splitBeforeYouGoTips(tips: readonly string[]): Array<{ label: string; value: string; warning: boolean }> {
  return tips.map((raw) => {
    const idx = raw.indexOf(':');
    if (idx > 0 && idx < 38) {
      const label = raw.slice(0, idx).trim();
      const value = raw.slice(idx + 1).trim();
      return {
        label: label.startsWith('Bütçe seviyesi') ? 'Bütçe' : label,
        value,
        warning: label === 'Dezavantaj',
      };
    }
    return { label: 'Not', value: raw.trim(), warning: false };
  });
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; venueSlug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'tr';
  const isEn = lang === 'en';
  const preview = isLocalFoodPreviewSync();
  const resolved = await resolveGeoPilotVenue(params.venueSlug);

  if (!resolved) {
    return {
      title: isEn ? 'Venue Not Found' : 'Mekân Bulunamadı',
      robots: { index: false, follow: false },
    };
  }

  const { snapshotVenue, location, editorial } = resolved;
  const subPath = `/mekan/${snapshotVenue.id}`;
  const placeLabelEn = location.slug === 'kadikoy' ? 'Kadikoy' : `${location.name}, Kadikoy`;
  const title = isEn
    ? `${snapshotVenue.name} (${placeLabelEn}) — What to Order & Guide`
    : `${snapshotVenue.name} (${snapshotVenue.neighborhood}) — Ne Sipariş Etmeli & Rehber`;
  const description = isEn
    ? `${editorial.culinaryIdentity.en} Signature dishes: ${snapshotVenue.whatToOrder.join(', ')}. Address: ${snapshotVenue.address}.`
    : `${snapshotVenue.description} Önerilen ürünler: ${snapshotVenue.whatToOrder.join(', ')}. Adres: ${snapshotVenue.address}.`;
  const alternates = buildGeoAlternates(subPath, lang);

  return {
    title,
    description,
    ...(preview
      ? { robots: { index: false, follow: false } }
      : {
          alternates,
          ...buildGeoSocialMetadata({
            title,
            description,
            url: alternates.canonical,
            lang,
            type: 'article',
          }),
        }),
  };
}

export default async function GeoPilotVenuePage(props: {
  params: Promise<{ lang: string; venueSlug: string }>;
}) {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'tr';
  const isEn = lang === 'en';
  const resolved = await resolveGeoPilotVenue(params.venueSlug);

  if (!resolved) {
    notFound();
  }

  const {
    location,
    visitorVenue,
    snapshotVenue,
    primaryCategorySlug,
    primaryCategoryLabel,
    editorial,
    walkableStops,
  } = resolved;

  const regionBasePath = `/${location.path.join('/')}`;
  const citySlug = location.path[0];
  const cityName = getCityNameLocalized(citySlug, location.city || citySlug, lang);
  const subPath = `/mekan/${snapshotVenue.id}`;
  const pageUrl = buildGeoPublicUrl(subPath, lang);
  const homeUrl = isEn ? EN_SITE_ORIGIN : TR_SITE_ORIGIN;

  const structuredTips = splitBeforeYouGoTips(snapshotVenue.beforeYouGo);
  const faqs = editorial.faqs.map((f) => ({
    question: f.question[lang],
    answer: f.answer[lang],
  }));

  const breadcrumbItems = [
    { label: isEn ? 'Home' : 'Ana Sayfa', href: `/${lang}`, url: homeUrl },
    {
      label: isEn ? 'Gastronomy Guide' : 'Gastronomi Rehberi',
      href: buildGeoPageHref('/', lang, 'internal'),
      url: buildGeoPublicUrl('/', lang),
    },
    {
      label: location.name,
      href: buildGeoPageHref(regionBasePath, lang, 'internal'),
      url: buildGeoPublicUrl(regionBasePath, lang),
    },
    {
      label: primaryCategoryLabel,
      href: buildGeoPageHref(`${regionBasePath}/${primaryCategorySlug}`, lang, 'internal'),
      url: buildGeoPublicUrl(`${regionBasePath}/${primaryCategorySlug}`, lang),
    },
    { label: snapshotVenue.name, url: pageUrl },
  ];

  const venueJsonLd = buildPilotVenueJsonLd(resolved, lang);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    breadcrumbItems.map((b) => ({ name: b.label, url: b.url }))
  );
  const faqJsonLd = buildFaqJsonLd(faqs);

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-[#181210] flex flex-col font-sans antialiased">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE5DF]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <Link href={`/${lang}`} prefetch={false} className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-lg font-black tracking-tight text-[#181210]">
              YERİNİ<span className="text-[#C42B1C] ml-0.5">AYIR</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF1EE] text-[#A61E11] border border-[#F2D5CE]">
              {location.name}
            </span>
          </Link>
          <Link
            href={buildGeoPageHref(regionBasePath, lang, 'internal')}
            prefetch={false}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#181210] border border-[#E6D9D0]"
          >
            <ArrowLeft size={13} className="text-[#C42B1C]" />
            <span>{isEn ? `${location.name} Guide` : `${location.name} Seçkisi`}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6">
        <GeoBreadcrumbNav items={breadcrumbItems.map(({ label, href }) => ({ label, href }))} />

        {/* Ana Mekan Kartı */}
        <article className="bg-white rounded-3xl border border-[#EFE5DF] shadow-[0_10px_30px_-10px_rgba(24,18,16,0.12)] overflow-hidden">
          <div className="relative w-full aspect-[16/9] bg-[#f5f2ec] overflow-hidden">
            <VenueImage
              visual={{
                url: visitorVenue.imageUrl,
                kind: visitorVenue.imageIsRepresentative ? 'illustration' : 'rights-cleared-photo',
                category: visitorVenue.imageCategory,
                venueId: visitorVenue.id,
                attribution: visitorVenue.imageAttribution,
              }}
              priority
              labelPlacement="bottom-left"
            />
            <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#181210] text-xs font-extrabold border border-[#EFE5DF]">
              {primaryCategoryLabel}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="h-[3.5px] w-full"
            style={{ background: 'linear-gradient(90deg, #C42B1C 0%, #EA580C 55%, #F59E0B 100%)' }}
          />

          <div className="p-5 sm:p-6 space-y-5">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E5A53]">
                {snapshotVenue.neighborhood} · {cityName}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#181210] leading-tight">
                {snapshotVenue.name}
              </h1>
              <GooglePlaceRating ratings={visitorVenue.ratings} />
              <p className="text-sm text-[#3F332E] leading-relaxed pt-1">
                {snapshotVenue.description}
              </p>
            </div>

            <div className="rounded-2xl bg-[#FAF6F2] border border-[#EFE5DF] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2 text-xs text-[#3F332E]">
                <MapPin size={15} className="text-[#C42B1C] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#181210]">{isEn ? 'Street Address' : 'Açık Adres'}</div>
                  <div>{snapshotVenue.address}</div>
                </div>
              </div>
              <a
                href={snapshotVenue.mapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#C42B1C] hover:bg-[#A61E11] text-white text-xs font-bold whitespace-nowrap flex-shrink-0"
              >
                <span>{isEn ? 'Directions (Google Maps)' : 'Yol Tarifi Al'}</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Mutfak Kimliği ve Bağlam */}
            <div className="space-y-2">
              <h2 className="text-base font-black text-[#181210]">
                {isEn ? 'Kitchen Identity & Neighborhood Context' : 'Mutfak Kimliği ve Semt Bağlamı'}
              </h2>
              <p className="text-xs sm:text-sm text-[#4A3B36] leading-relaxed">
                {editorial.culinaryIdentity[lang]}
              </p>
            </div>

            {/* Ne Sipariş Etmeli + Menüden */}
            <div className="pl-4 border-l-[3.5px] border-[#C42B1C] space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#C42B1C] text-white">
                <Utensils size={11} />
                <span>{isEn ? 'What to Order' : 'Ne Sipariş Etmeli?'}</span>
              </div>
              <ul className="list-disc list-inside text-sm font-bold text-[#181210] space-y-1">
                {snapshotVenue.whatToOrder.map((dish, idx) => (
                  <li key={idx}>{dish}</li>
                ))}
              </ul>
              {snapshotVenue.menuFrom && snapshotVenue.menuFrom.length > 0 && (
                <p className="text-xs text-[#5C4B45]">
                  <strong className="text-[#181210]">{isEn ? 'Other Menu Highlights: ' : 'Menüden Diğer Seçenekler: '}</strong>
                  {snapshotVenue.menuFrom.join(' · ')}
                </p>
              )}
              <p className="text-xs sm:text-[13px] text-[#3F332E] leading-relaxed pt-1">
                {editorial.orderingGuide[lang]}
              </p>
            </div>

            {/* Ayrıca Bunları da Dene */}
            {visitorVenue.alsoTry?.items && visitorVenue.alsoTry.items.length > 0 && (
              <div className="pl-4 border-l-[3.5px] border-[#E8C5BA] space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#9E1F13]">
                  <Sparkles size={13} className="text-[#B82516]" />
                  <span>{isEn ? 'Also Try' : 'Ayrıca Bunları da Dene'}</span>
                </div>
                <div className="space-y-2">
                  {visitorVenue.alsoTry.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="text-sm font-extrabold text-[#181210]">{item.name}</div>
                      {item.description && (
                        <p className="text-xs text-[#4A3B36] leading-relaxed mt-0.5">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gitmeden Bil / Pratik Bilgiler */}
            <div className="space-y-3 pt-2 border-t border-[#EFE5DF]">
              <h2 className="text-base font-black text-[#181210] flex items-center gap-1.5">
                <Info size={15} className="text-[#C42B1C]" />
                <span>{isEn ? 'Know Before You Go' : 'Gitmeden Bil'}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {structuredTips.map((tip, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-3 border text-xs space-y-1 ${
                      tip.warning
                        ? 'bg-[#FFF5F3] border-[#F2D5CE] text-[#6B1D14]'
                        : 'bg-[#FCFAF8] border-[#EFE5DF] text-[#3F332E]'
                    }`}
                  >
                    <div className="font-extrabold uppercase tracking-wider text-[10px]">{tip.label}</div>
                    <div className="leading-relaxed">{tip.value}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-[#4A3B36] leading-relaxed">
                <p>
                  <strong className="text-[#181210]">{isEn ? 'Street & Access Note: ' : 'Sokak ve Ulaşım Bağlamı: '}</strong>
                  {editorial.microLocationContext[lang]}
                </p>
                <p>
                  <strong className="text-[#181210]">{isEn ? 'In the Same Selection: ' : 'Aynı Kategoride Nasıl Ayrışır?: '}</strong>
                  {editorial.selectionComparison[lang]}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Yürüme Mesafesindeki Diğer Doğrulanmış Duraklar */}
        {walkableStops.length > 0 && (
          <section className="rounded-3xl bg-white border border-[#EFE5DF] p-5 space-y-3">
            <h2 className="text-base font-black text-[#181210]">
              {isEn
                ? `Other Verified Stops Within 450m in ${location.name}`
                : `${location.locative} Yürüme Mesafesindeki Diğer Doğrulanmış Duraklar (<= 450 m)`}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {walkableStops.map((stop) => (
                <li key={stop.id} className="rounded-xl bg-[#FCFAF8] border border-[#EFE5DF] p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    {stop.isPilotVenue ? (
                      <Link
                        href={buildGeoPageHref(`/mekan/${stop.id}`, lang, 'internal')}
                        prefetch={false}
                        className="font-black text-[#181210] hover:text-[#C42B1C] underline decoration-[#E6D9D0]"
                      >
                        {stop.name}
                      </Link>
                    ) : (
                      <Link
                        href={buildGeoPageHref(`${regionBasePath}/${stop.categorySlug}`, lang, 'internal')}
                        prefetch={false}
                        className="font-black text-[#181210] hover:text-[#C42B1C]"
                      >
                        {stop.name}
                      </Link>
                    )}
                    <span className="text-[11px] font-bold text-[#B82516] flex-shrink-0">
                      {stop.distanceMeters} m
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6E5A53]">
                    {stop.categoryLabel} · {stop.neighborhood}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <GeoFaqSection
        title={isEn ? `Frequently Asked Questions — ${snapshotVenue.name}` : `${snapshotVenue.name} Hakkında Sık Sorulan Sorular`}
        faqs={faqs}
      />

      <footer className="mt-auto border-t border-[#EFE5DF] bg-white py-6 px-4 text-xs text-[#68554E]">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-[#181210]">YERİNİ AYIR · {location.displayName}</span>
          <Link
            href={buildGeoPageHref(`${regionBasePath}/${primaryCategorySlug}`, lang, 'internal')}
            prefetch={false}
            className="text-[#B82516] font-bold hover:underline"
          >
            {isEn ? `Back to ${primaryCategoryLabel}` : `${primaryCategoryLabel} Kategorisine Dön`}
          </Link>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(venueJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
