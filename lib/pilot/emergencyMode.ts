export type EmergencyLevel = 'off' | 'shed' | 'lockdown';

const CORE_LEGAL_PATH_RE =
  /^\/(?:tr|en|el)\/(?:cerez-politikasi|gizlilik-politikasi|kullanim-kosullari|kullanim-sartlari|kvkk-aydinlatma-metni|hakkimizda)$/;
const REGION_API_PATH_RE = /^\/api\/gastronomy\/regions\/[^/]+$/;
const STATIC_ASSET_PATH_RE =
  /^\/(?:_next\/static\/|images\/gastronomy\/|fonts\/|favicon\.ico$|icon\.png$|apple-icon\.png$|icon-192\.png$|icon-512\.png$|logo\.png$|logo-green\.png$|logo\.svg$|yeriniayir-logo\.png$|manifest\.webmanifest$|robots\.txt$|sitemap\.xml$)/;
const ADMIN_PATH_SEGMENT_RE =
  /(?:^|\/)(?:jilinrime|gastronomi-yonetimi|moda-kadikoy-pilot)(?:$|\/|\.)/i;

export function getEmergencyMode(env: NodeJS.ProcessEnv = process.env): EmergencyLevel {
  const raw = (env.TRAFFIC_EMERGENCY_MODE || '').trim().toLowerCase();
  if (raw === '2' || raw === 'lockdown' || raw === 'under_attack' || raw === 'attack') {
    return 'lockdown';
  }
  if (raw === '1' || raw === 'true' || raw === 'shed' || raw === 'cost') {
    return 'shed';
  }
  return 'off';
}

export function isCoreGastronomyVisitorPath(canonicalPathname: string): boolean {
  if (
    canonicalPathname === '/' ||
    canonicalPathname === '/tr' ||
    canonicalPathname === '/en' ||
    canonicalPathname === '/el'
  ) {
    return true;
  }
  if (REGION_API_PATH_RE.test(canonicalPathname)) {
    return true;
  }
  if (CORE_LEGAL_PATH_RE.test(canonicalPathname)) {
    return true;
  }
  return false;
}

export type EmergencyShedDecision =
  | { shed: false }
  | {
      shed: true;
      mode: 'shed' | 'lockdown';
      status: 202 | 503;
      reason: string;
      asJson: boolean;
    };

export function evaluateEmergencyShedding(
  canonicalPathname: string,
  method: string,
  env: NodeJS.ProcessEnv = process.env
): EmergencyShedDecision {
  const mode = getEmergencyMode(env);
  if (mode === 'off') {
    return { shed: false };
  }

  const upperMethod = (method || 'GET').toUpperCase();
  const isReadMethod = upperMethod === 'GET' || upperMethod === 'HEAD';

  if (isCoreGastronomyVisitorPath(canonicalPathname) && isReadMethod) {
    return { shed: false };
  }

  if (STATIC_ASSET_PATH_RE.test(canonicalPathname) && isReadMethod) {
    return { shed: false };
  }

  if (canonicalPathname === '/api/track-event') {
    return {
      shed: true,
      mode,
      status: 202,
      reason: 'emergency-analytics-shed',
      asJson: true,
    };
  }

  if (canonicalPathname.startsWith('/_next/image')) {
    return {
      shed: true,
      mode,
      status: 503,
      reason: 'emergency-image-opt-shed',
      asJson: false,
    };
  }

  if (canonicalPathname === '/api/go' || canonicalPathname === '/api/gastronomy-public') {
    return {
      shed: true,
      mode,
      status: 503,
      reason: 'emergency-dynamic-api-shed',
      asJson: true,
    };
  }

  if (canonicalPathname.startsWith('/api/gastronomy-admin/')) {
    if (
      mode === 'lockdown' &&
      (canonicalPathname === '/api/gastronomy-admin/publish' ||
        canonicalPathname === '/api/gastronomy-admin/research' ||
        (!isReadMethod &&
          canonicalPathname !== '/api/gastronomy-admin/login' &&
          canonicalPathname !== '/api/gastronomy-admin/logout'))
    ) {
      return {
        shed: true,
        mode,
        status: 503,
        reason: 'emergency-lockdown-admin-mutation',
        asJson: true,
      };
    }
    return { shed: false };
  }

  if (canonicalPathname.startsWith('/api/') || ADMIN_PATH_SEGMENT_RE.test(canonicalPathname)) {
    return { shed: false };
  }

  return {
    shed: true,
    mode,
    status: 503,
    reason: 'emergency-legacy-route-shed',
    asJson: false,
  };
}
