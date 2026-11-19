export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  performance: boolean;
};

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
  performance: false,
};

export const COOKIE_CONSENT_STORAGE_KEY = 'cookie-consent-granular';
export const COOKIE_CONSENT_EVENT = 'ya:cookie-consent-updated';
export const OPEN_COOKIE_SETTINGS_EVENT = 'ya:open-cookie-settings';
export const COOKIE_SETTINGS_HASH = '#cerez-ayarlari';

const KNOWN_ANALYTICS_COOKIE_PREFIXES = ['_ga', '_gid', '_gat', '_clck', '_clsk'];

export function normalizeCookiePreferences(raw: unknown): CookiePreferences | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  return {
    necessary: true,
    analytics: obj.analytics === true,
    marketing: obj.marketing === true,
    functional: obj.functional === true,
    performance: obj.performance === true,
  };
}

export function readSavedCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return normalizeCookiePreferences(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  const prefs = readSavedCookieConsent();
  return prefs?.analytics === true;
}

export function hasExplicitlyRejectedAnalytics(): boolean {
  const prefs = readSavedCookieConsent();
  return prefs !== null && prefs.analytics === false;
}

export function clearThirdPartyAnalyticsCookies(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  try {
    const names = document.cookie
      .split(';')
      .map((part) => part.split('=')[0]?.trim() || '')
      .filter((name) =>
        KNOWN_ANALYTICS_COOKIE_PREFIXES.some((prefix) => name === prefix || name.startsWith(prefix))
      );
    if (names.length === 0) return;

    const host = window.location.hostname;
    const domainCandidates = ['', host];
    const dotParts = host.split('.');
    if (dotParts.length >= 2) {
      domainCandidates.push(`.${dotParts.slice(-2).join('.')}`);
    }

    for (const name of names) {
      for (const domain of domainCandidates) {
        const domainAttr = domain ? `; domain=${domain}` : '';
        document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttr}; SameSite=Lax`;
      }
    }
  } catch {
    // Ignore cookie clearing errors in restricted sandboxes
  }
}
