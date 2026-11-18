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
      <span className="inline-flex items-center gap-1 rounded-md bg-[#FFFBEB] px-2 py-0.5 text-xs font-bold text-[#78350F] border border-[#FCD34D] shadow-xs">
        <span className="text-[#F59E0B]">★</span>
        <span>{visitorGoogleRatingLabel(rating.value)}</span>
      </span>
      <a
        href={rating.attribution.mapsUri}
        target="_blank"
        rel="noopener noreferrer"
        translate="no"
        className="inline-flex items-center min-h-[24px] py-1 text-xs font-medium text-[#6E5A53] hover:text-[#181210] underline decoration-[#DFD0C8] hover:decoration-[#B82516] transition-colors"
      >
        Google Maps
      </a>
      {rating.attribution.providers.map((p, i) => (
        <a key={i} href={p.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px] py-1 text-xs text-[#6E5A53] hover:text-[#181210] hover:underline">
          {p.provider}
        </a>
      ))}
    </div>
  );
}
