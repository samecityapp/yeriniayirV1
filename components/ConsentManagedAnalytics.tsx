'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  clearThirdPartyAnalyticsCookies,
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  normalizeCookiePreferences,
  readSavedCookieConsent,
  type CookiePreferences,
} from '@/lib/cookieConsent';

interface ConsentManagedAnalyticsProps {
  gaId: string;
  clarityId?: string;
  disabled?: boolean;
}

type GtagFn = (...args: unknown[]) => void;

type AnalyticsWindow = Window &
  Record<string, unknown> & {
    dataLayer?: unknown[];
    gtag?: GtagFn;
    clarity?: (...args: unknown[]) => void;
  };

function ensureGtagStub(w: AnalyticsWindow): GtagFn {
  if (!Array.isArray(w.dataLayer)) {
    w.dataLayer = [];
  }
  if (typeof w.gtag !== 'function') {
    const dataLayer = w.dataLayer;
    w.gtag = function gtagStub() {
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    };
  }
  return w.gtag;
}

export function ConsentManagedAnalytics({
  gaId,
  clarityId = 'ufxa278rg4',
  disabled = false,
}: ConsentManagedAnalyticsProps) {
  const analyticsDisabled =
    disabled || process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === '1';
  const gaConfiguredRef = useRef(false);

  const syncConsentState = useCallback(
    (prefs: CookiePreferences | null) => {
      if (analyticsDisabled || typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      const w = window as unknown as AnalyticsWindow;
      const gtag = ensureGtagStub(w);
      const grantedAnalytics = prefs?.analytics === true;
      const grantedMarketing = prefs?.marketing === true;
      const grantedFunctional = prefs?.functional === true;

      if (!w.__yaGtagConsentDefaultSet) {
        gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          functionality_storage: 'denied',
          personalization_storage: 'denied',
          security_storage: 'granted',
        });
        w.__yaGtagConsentDefaultSet = true;
      }

      w[`ga-disable-${gaId}`] = !grantedAnalytics;

      if (!grantedAnalytics) {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: grantedMarketing ? 'granted' : 'denied',
          ad_user_data: grantedMarketing ? 'granted' : 'denied',
          ad_personalization: grantedMarketing ? 'granted' : 'denied',
          functionality_storage: grantedFunctional ? 'granted' : 'denied',
          personalization_storage: grantedMarketing ? 'granted' : 'denied',
          security_storage: 'granted',
        });
        if (typeof w.clarity === 'function') {
          try {
            w.clarity('consent', false);
            w.clarity('stop');
          } catch {
            // Ignore stub errors
          }
        }
        document.getElementById('ga4-gtag-loader')?.remove();
        document.getElementById('ms-clarity-loader')?.remove();
        clearThirdPartyAnalyticsCookies();
        return;
      }

      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: grantedMarketing ? 'granted' : 'denied',
        ad_user_data: grantedMarketing ? 'granted' : 'denied',
        ad_personalization: grantedMarketing ? 'granted' : 'denied',
        functionality_storage: grantedFunctional ? 'granted' : 'denied',
        personalization_storage: grantedMarketing ? 'granted' : 'denied',
        security_storage: 'granted',
      });

      if (!gaConfiguredRef.current) {
        gtag('js', new Date());
        gtag('config', gaId, { anonymize_ip: true });
        gaConfiguredRef.current = true;
      }

      if (!document.getElementById('ga4-gtag-loader')) {
        const gaScript = document.createElement('script');
        gaScript.id = 'ga4-gtag-loader';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        gaScript.onerror = () => {
          // Swallow network/blocker failures without emitting unhandled errors
        };
        document.head.appendChild(gaScript);
      }

      if (clarityId && !document.getElementById('ms-clarity-loader')) {
        if (typeof w.clarity !== 'function') {
          const clarityQueue: ((...args: unknown[]) => void) & { q?: unknown[][] } = function () {
            // eslint-disable-next-line prefer-rest-params
            (clarityQueue.q = clarityQueue.q || []).push(Array.from(arguments));
          };
          w.clarity = clarityQueue;
        }
        try {
          w.clarity('consent');
        } catch {
          // Ignore queue errors
        }
        const clarityScript = document.createElement('script');
        clarityScript.id = 'ms-clarity-loader';
        clarityScript.async = true;
        clarityScript.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`;
        clarityScript.onerror = () => {
          // Swallow network/blocker failures cleanly
        };
        document.head.appendChild(clarityScript);
      } else if (typeof w.clarity === 'function') {
        try {
          w.clarity('consent');
        } catch {
          // Ignore stub errors
        }
      }
    },
    [analyticsDisabled, clarityId, gaId]
  );

  useEffect(() => {
    if (analyticsDisabled) return;
    syncConsentState(readSavedCookieConsent());

    const onConsentUpdate = (evt: Event) => {
      const detail = (evt as CustomEvent<CookiePreferences>).detail;
      const next = normalizeCookiePreferences(detail) ?? readSavedCookieConsent();
      syncConsentState(next);
    };

    const onStorage = (evt: StorageEvent) => {
      if (evt.key !== COOKIE_CONSENT_STORAGE_KEY) return;
      syncConsentState(readSavedCookieConsent());
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsentUpdate);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, onConsentUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, [analyticsDisabled, syncConsentState]);

  return null;
}
