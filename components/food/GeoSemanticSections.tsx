import Link from 'next/link';
import type { FoodLocation, VisitorFoodVenue } from '@/lib/food/types';
import {
  buildGeoPageHref,
  getCityNameLocalized,
  getFoodCategoryTitleEn,
  getGeoCities,
  type GeoActiveCategoryMeta,
} from '@/lib/gastronomy-v3/geoCatalog';
import { isEligibleGeoPilotVenue } from '@/lib/gastronomy-v3/geoPilot';
import { resolveSafeVenueMapsUrl } from '@/lib/food/maps';

export interface GeoBreadcrumbItem {
  label: string;
  href?: string;
}

export function GeoBreadcrumbNav({ items }: { items: GeoBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[#6E5A53] font-medium mb-4">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5">
            {idx > 0 && <span aria-hidden="true" className="text-[#C7B6AD]">/</span>}
            {item.href && idx < items.length - 1 ? (
              <Link
                href={item.href}
                prefetch={false}
                className="hover:text-[#B82516] underline decoration-[#E6D9D0]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-[#181210]" aria-current={idx === items.length - 1 ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function GeoRootCrawlDirectory({ lang }: { lang: 'tr' | 'en' }) {
  const cities = getGeoCities();
  const isEn = lang === 'en';

  return (
    <section
      aria-labelledby="geo-crawl-directory-heading"
      className="bg-[#FCFAF8] border-t border-[#EFE5DF] py-7 px-4"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="geo-crawl-directory-heading" className="text-sm font-black text-[#181210] tracking-tight">
            {isEn
              ? 'Verified City & Neighborhood Food Guides'
              : 'Doğrulanmış Şehir ve Semt Gastronomi Rehberleri'}
          </h2>
          <Link
            href={buildGeoPageHref('/', lang, 'internal')}
            prefetch={false}
            className="text-xs font-bold text-[#B82516] hover:underline"
          >
            {isEn ? 'Open Full Index (92 Neighborhoods)' : 'Tüm Seçki Dizini (92 Semt)'}
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-[#EFE5DF] p-4 space-y-3">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#68554E]">
            {isEn ? 'Featured Pilot Guides: Moda & Kadikoy' : 'Öne Çıkan Seçkiler: Moda & Kadıköy'}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <Link
              href={buildGeoPageHref('/istanbul/kadikoy/moda', lang, 'internal')}
              prefetch={false}
              className="px-3 py-1.5 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#181210] border border-[#E6D9D0]"
            >
              {isEn ? 'Moda, Kadikoy' : 'Moda, Kadıköy'}
            </Link>
            <Link
              href={buildGeoPageHref('/istanbul/kadikoy', lang, 'internal')}
              prefetch={false}
              className="px-3 py-1.5 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#181210] border border-[#E6D9D0]"
            >
              {isEn ? 'Kadikoy Center' : 'Kadıköy Merkez & Çarşı'}
            </Link>
            <Link
              href={buildGeoPageHref('/istanbul/kadikoy/moda/kahve', lang, 'internal')}
              prefetch={false}
              className="px-3 py-1.5 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#181210] border border-[#E6D9D0]"
            >
              {isEn ? 'Moda Coffee Stops' : 'Moda Kahvecileri'}
            </Link>
            <Link
              href={buildGeoPageHref('/istanbul/kadikoy/moda/pizza', lang, 'internal')}
              prefetch={false}
              className="px-3 py-1.5 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#181210] border border-[#E6D9D0]"
            >
              {isEn ? 'Moda Artisan Pizza' : 'Moda Pizzacıları'}
            </Link>
            <Link
              href={buildGeoPageHref('/istanbul/kadikoy/denemelisin', lang, 'internal')}
              prefetch={false}
              className="px-3 py-1.5 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#181210] border border-[#E6D9D0]"
            >
              {isEn ? 'Kadikoy Culinary Institutions' : 'Kadıköy Mutlaka Denemelisin'}
            </Link>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#68554E]">
            {isEn ? 'Browse by City (21 Cities)' : 'Şehirlere Göre Keşfet (21 İl)'}
          </div>
          <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
            {cities.map((city) => (
              <li key={city.citySlug}>
                <Link
                  href={buildGeoPageHref(`/${city.citySlug}`, lang, 'internal')}
                  prefetch={false}
                  className="text-[#4E403B] hover:text-[#B82516] underline decoration-[#E6D9D0]"
                >
                  {getCityNameLocalized(city.citySlug, city.cityName, lang)} ({city.regions.length})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function GeoRegionSelectionAtlas({
  location,
  activeCategories,
  venues,
  nearbyVenues,
  activeCategorySlug,
  lang,
}: {
  location: FoodLocation;
  activeCategories: GeoActiveCategoryMeta[];
  venues: VisitorFoodVenue[];
  nearbyVenues: VisitorFoodVenue[];
  activeCategorySlug?: string;
  lang: 'tr' | 'en';
}) {
  const isEn = lang === 'en';
  const regionBase = `/${location.path.join('/')}`;
  const categoriesToRender = activeCategorySlug
    ? activeCategories.filter((c) => c.slug === activeCategorySlug)
    : activeCategories;

  const filteredNearby = activeCategorySlug
    ? nearbyVenues.filter((v) => v.categorySlugs.includes(activeCategorySlug))
    : nearbyVenues;

  return (
    <section
      aria-labelledby="geo-full-selection-heading"
      className="bg-[#FCFAF8] border-t border-[#EFE5DF] py-8 px-4"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 id="geo-full-selection-heading" className="text-xl font-black text-[#181210] tracking-tight">
            {activeCategorySlug
              ? isEn
                ? `Complete Notes for ${location.name} (${categoriesToRender[0] ? getFoodCategoryTitleEn(categoriesToRender[0]) : activeCategorySlug})`
                : `${location.locative} ${categoriesToRender[0]?.title || ''} Seçkisi — Tam Mekân Rehberi`
              : isEn
              ? `All ${venues.length} Verified Stops in ${location.displayName}`
              : `${location.displayName} — Tüm Doğrulanmış Mekânlar (${venues.length} Durak)`}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4B45] leading-relaxed">
            {isEn
              ? `Every listed establishment in ${location.displayName} is screened for strict neighborhood boundaries, zero corporate chains, operational activity, and verified signature dishes.`
              : `${location.displayName} rehberindeki tüm mekanlar sıkı mahalle sınırı, sıfır zincir ilkesi, operasyonel doğrulama ve kanıtlı ürün standartlarıyla yayınlanır.`}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <Link
              href={buildGeoPageHref(regionBase, lang, 'internal')}
              prefetch={false}
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                !activeCategorySlug
                  ? 'bg-[#181210] text-white border-[#181210]'
                  : 'bg-white text-[#181210] border-[#E6D9D0] hover:border-[#C42B1C]'
              }`}
            >
              {isEn ? 'All Categories' : 'Tüm Kategoriler'} ({venues.length})
            </Link>
            {activeCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={buildGeoPageHref(`${regionBase}/${cat.slug}`, lang, 'internal')}
                prefetch={false}
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  activeCategorySlug === cat.slug
                    ? 'bg-[#C42B1C] text-white border-[#C42B1C]'
                    : 'bg-white text-[#181210] border-[#E6D9D0] hover:border-[#C42B1C]'
                }`}
              >
                {isEn ? getFoodCategoryTitleEn(cat) : cat.label} ({cat.venueCount})
              </Link>
            ))}
          </div>
        </div>

        {categoriesToRender.map((cat) => {
          const catVenues = venues.filter((v) => v.categorySlugs.includes(cat.slug));
          if (catVenues.length === 0) return null;

          return (
            <div key={cat.slug} id={`cat-${cat.slug}`} className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#EFE5DF] pb-2">
                <h3 className="text-lg font-black text-[#181210]">
                  <Link
                    href={buildGeoPageHref(`${regionBase}/${cat.slug}`, lang, 'internal')}
                    prefetch={false}
                    className="hover:text-[#C42B1C]"
                  >
                    {isEn ? getFoodCategoryTitleEn(cat) : `${location.locative} ${cat.title}`}
                  </Link>
                </h3>
                <span className="text-xs font-bold text-[#6E5A53]">
                  {catVenues.length} {isEn ? 'places' : 'mekân'}
                </span>
              </div>

              <div className="space-y-4">
                {catVenues.map((venue) => {
                  const hasPilotPage = isEligibleGeoPilotVenue(venue.id);
                  const mapsUrl = resolveSafeVenueMapsUrl(venue, lang);
                  const ratingVal = venue.ratings?.[0]?.value;

                  return (
                    <article
                      key={`${cat.slug}-${venue.id}`}
                      data-geo-venue-id={venue.id}
                      className="rounded-2xl bg-white border border-[#EFE5DF] p-4 sm:p-5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E5A53]">
                            {venue.neighborhood}
                          </div>
                          <h4 className="text-base font-black text-[#181210] leading-snug">
                            {hasPilotPage ? (
                              <Link
                                href={buildGeoPageHref(`/mekan/${venue.id}`, lang, 'internal')}
                                prefetch={false}
                                className="hover:text-[#C42B1C] underline decoration-[#E6D9D0]"
                              >
                                {venue.name}
                              </Link>
                            ) : (
                              venue.name
                            )}
                          </h4>
                        </div>
                        {typeof ratingVal === 'number' && (
                          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#FAF6F2] text-[#181210] border border-[#E6D9D0]">
                            ★ {ratingVal.toFixed(1)} Google
                          </span>
                        )}
                      </div>

                      {venue.tagline && (
                        <p className="text-xs sm:text-[13px] text-[#3F332E] leading-relaxed">
                          {venue.tagline}
                        </p>
                      )}

                      <dl className="grid grid-cols-1 gap-1.5 text-xs text-[#4A3B36] pt-1">
                        {venue.orderSuggestion?.title && (
                          <div>
                            <dt className="inline font-extrabold text-[#9E1F13]">
                              {isEn ? 'What to Order: ' : 'Ne Sipariş Etmeli?: '}
                            </dt>
                            <dd className="inline font-semibold text-[#181210]">
                              {venue.orderSuggestion.title}
                            </dd>
                          </div>
                        )}
                        {venue.menuFrom && venue.menuFrom.length > 0 && (
                          <div>
                            <dt className="inline font-bold text-[#68554E]">
                              {isEn ? 'On the Menu: ' : 'Menüden: '}
                            </dt>
                            <dd className="inline">{venue.menuFrom.join(' · ')}</dd>
                          </div>
                        )}
                        {venue.alsoTry?.items && venue.alsoTry.items.length > 0 && (
                          <div>
                            <dt className="inline font-bold text-[#68554E]">
                              {isEn ? 'Also Try: ' : 'Ayrıca Dene: '}
                            </dt>
                            <dd className="inline">
                              {venue.alsoTry.items
                                .map((it) => (it.description ? `${it.name} (${it.description})` : it.name))
                                .join(' · ')}
                            </dd>
                          </div>
                        )}
                        {venue.address && (
                          <div>
                            <dt className="inline font-bold text-[#68554E]">
                              {isEn ? 'Address: ' : 'Adres: '}
                            </dt>
                            <dd className="inline">{venue.address}</dd>
                          </div>
                        )}
                      </dl>

                      {venue.knowBeforeYouGo?.tips && venue.knowBeforeYouGo.tips.length > 0 && (
                        <ul className="space-y-1 text-xs text-[#5C4B45] border-t border-dashed border-[#EFE5DF] pt-2">
                          {venue.knowBeforeYouGo.tips.map((tip, i) => (
                            <li key={i}>• {tip}</li>
                          ))}
                        </ul>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B82516] hover:underline"
                        >
                          {isEn ? 'Open in Google Maps' : 'Google Haritalar Yol Tarifi'}
                        </a>
                        {hasPilotPage && (
                          <Link
                            href={buildGeoPageHref(`/mekan/${venue.id}`, lang, 'internal')}
                            prefetch={false}
                            className="text-[#181210] hover:text-[#C42B1C] underline decoration-[#E6D9D0]"
                          >
                            {isEn ? 'Detailed Venue Guide' : 'Detaylı Mekan Rehberi'}
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredNearby.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#EFE5DF]">
            <h3 className="text-base font-black text-[#181210]">
              {isEn
                ? `Adjacent Border Suggestions Within 400m of ${location.name}`
                : `${location.name} Sınırına En Fazla 400 Metre Yakındaki Komşu Öneriler`}
            </h3>
            <div className="space-y-2.5">
              {filteredNearby.map((nv) => (
                <div
                  key={`geo-nearby-${nv.id}`}
                  className="rounded-xl bg-white border border-[#EFE5DF] p-3.5 text-xs space-y-1"
                >
                  <div className="font-black text-[#181210]">
                    {nv.name}{' '}
                    <span className="font-semibold text-[#6E5A53]">
                      ({nv.categoryName}
                      {typeof nv.distanceMeters === 'number' ? ` · ${nv.distanceMeters} m` : ''})
                    </span>
                  </div>
                  {nv.tagline && <p className="text-[#4A3B36]">{nv.tagline}</p>}
                  <div className="text-[#68554E]">
                    {nv.address || nv.neighborhood} ·{' '}
                    <a
                      href={resolveSafeVenueMapsUrl(nv, lang)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B82516] font-bold hover:underline"
                    >
                      Google Maps
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function GeoSubRegionsAndSiblingLinks({
  childRegions,
  siblingRegions,
  citySlug,
  cityName,
  lang,
}: {
  childRegions: FoodLocation[];
  siblingRegions: FoodLocation[];
  citySlug: string;
  cityName: string;
  lang: 'tr' | 'en';
}) {
  const isEn = lang === 'en';
  if (childRegions.length === 0 && siblingRegions.length === 0) return null;

  return (
    <section className="bg-white border-t border-[#EFE5DF] py-7 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {childRegions.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#181210]">
              {isEn ? 'Neighborhoods in This District' : 'Bu İlçedeki Semt Seçkileri'}
            </h2>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {childRegions.map((child) => (
                <Link
                  key={child.id}
                  href={buildGeoPageHref(`/${child.path.join('/')}`, lang, 'internal')}
                  prefetch={false}
                  className="px-3 py-1.5 rounded-full bg-[#FAF6F2] hover:bg-[#FFF5F3] text-[#181210] border border-[#E6D9D0]"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {siblingRegions.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#68554E]">
              {isEn ? `More Guides in ${cityName}` : `${cityName} İçindeki Diğer Seçkiler`}
            </h2>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <Link
                href={buildGeoPageHref(`/${citySlug}`, lang, 'internal')}
                prefetch={false}
                className="px-3 py-1.5 rounded-full bg-[#181210] text-white"
              >
                {cityName}
              </Link>
              {siblingRegions.map((sib) => (
                <Link
                  key={sib.id}
                  href={buildGeoPageHref(`/${sib.path.join('/')}`, lang, 'internal')}
                  prefetch={false}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FFF5F3] text-[#4E403B] border border-[#EFE5DF]"
                >
                  {sib.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function GeoFaqSection({
  title,
  faqs,
}: {
  title: string;
  faqs: Array<{ question: string; answer: string }>;
}) {
  if (!faqs.length) return null;

  return (
    <section aria-labelledby="geo-faq-heading" className="bg-[#FCFAF8] border-t border-[#EFE5DF] py-7 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 id="geo-faq-heading" className="text-lg font-black text-[#181210] tracking-tight">
          {title}
        </h2>
        <dl className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-white border border-[#EFE5DF] p-4 space-y-1.5">
              <dt className="text-sm font-extrabold text-[#181210]">{faq.question}</dt>
              <dd className="text-xs sm:text-[13px] text-[#4A3B36] leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
