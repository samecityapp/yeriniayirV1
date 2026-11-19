/**
 * İlk yayında Yerini Ayır yalnızca gastronomi hizmeti sunar; otel yüzeyleri
 * şirket kuruluşu ve ayrı hukuki/teknik yayın onayı tamamlanana kadar pasiftir.
 * Eski otel kodu, veritabanı tabloları ve migration'lar bilerek korunur.
 */
export function isHotelSurfaceEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  return (
    env.ENABLE_HOTEL_SURFACE === '1' ||
    env.NEXT_PUBLIC_ENABLE_HOTEL_SURFACE === '1'
  );
}
