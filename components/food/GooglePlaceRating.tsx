import type { VisitorGoogleRating } from '@/lib/pilot/googlePlaces/visitorRating';
import { copyVisitorGoogleRatings, visitorGoogleRatingLabel } from '@/lib/pilot/googlePlaces/visitorRating';

/**
 * Shared by the main card and detail view.
 * Displays only the verified Google score badge with official Google Maps attribution.
 * Zero review counts, zero marketing prose.
 */
export function GooglePlaceRating({ ratings }: { ratings: readonly VisitorGoogleRating[] }) {
  const rating = copyVisitorGoogleRatings(ratings)[0];
  if (!rating) return null;

  return (
    <div className="flex items-center gap-2 mt-1 flex-wrap">
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-900 border border-amber-200/80 shadow-xs">
        <span className="text-amber-500">★</span>
        <span>{visitorGoogleRatingLabel(rating.value)}</span>
      </span>
      <a
        href={rating.attribution.mapsUri}
        target="_blank"
        rel="noopener noreferrer"
        translate="no"
        className="inline-flex items-center min-h-[24px] py-1 text-xs font-medium text-slate-500 hover:text-slate-800 underline decoration-slate-300 transition-colors"
      >
        Google Maps
      </a>
      {rating.attribution.providers.map((p, i) => (
        <a key={i} href={p.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px] py-1 text-xs text-slate-500 hover:underline">
          {p.provider}
        </a>
      ))}
    </div>
  );
}
