'use client';

import { useState, useEffect } from 'react';
import { Cookie, Settings, ShieldCheck, ChevronLeft, Check, X } from 'lucide-react';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  performance: boolean;
};

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
  performance: false,
};

export function CookieBanner({ dict }: { dict: any }) {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<'banner' | 'settings'>('banner');
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent-granular');
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
      } catch (e) {
        setIsVisible(true);
      }
    }
  }, []);

  const updateGtagConsent = (prefs: CookiePreferences) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        functionality_storage: prefs.functional ? 'granted' : 'denied',
        personalization_storage: prefs.marketing ? 'granted' : 'denied',
        security_storage: 'granted', // Necessary is always granted
      });
    }
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent-granular', JSON.stringify(prefs));
    updateGtagConsent(prefs);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      performance: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    setPreferences(DEFAULT_PREFERENCES);
    saveConsent(DEFAULT_PREFERENCES);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 flex justify-center items-end pointer-events-none">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-6 md:p-8 pointer-events-auto transform transition-all duration-500 animate-in slide-in-from-bottom-10">

        {view === 'banner' ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                <Cookie className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{dict.cookie_banner.title}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p
                  className="text-[15px] text-gray-600 leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: dict.cookie_banner.description }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setView('settings')}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl transition-all active:scale-95"
              >
                <Settings className="w-4 h-4" />
                {dict.cookie_banner.configure}
              </button>
              <button
                onClick={handleRejectAll}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-gray-700 bg-gray-100/50 hover:bg-gray-100 border border-gray-200 rounded-2xl transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
                {dict.cookie_banner.reject}
              </button>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto flex-[1.5] inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-2xl transition-all shadow-lg shadow-red-200 active:scale-95"
              >
                <Check className="w-5 h-5" />
                {dict.cookie_banner.accept_all}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-h-[70vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <button
                onClick={() => setView('banner')}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors group"
              >
                <ChevronLeft className="w-6 h-6 text-gray-500 group-hover:text-red-600" />
              </button>
              <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">{dict.cookie_banner.preferences_title}</h3>
              <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              <CookieCategorySection
                title={dict.cookie_banner.necessary.title}
                description={dict.cookie_banner.necessary.description}
                status={dict.cookie_banner.necessary.status}
                statusColor="bg-emerald-100 text-emerald-700"
                checked={preferences.necessary}
                disabled={true}
                onChange={() => { }}
              />
              <CookieCategorySection
                title={dict.cookie_banner.analytics.title}
                description={dict.cookie_banner.analytics.description}
                status={dict.cookie_banner.analytics.status}
                statusColor="bg-blue-100 text-blue-700"
                checked={preferences.analytics}
                onChange={() => togglePreference('analytics')}
              />
              <CookieCategorySection
                title={dict.cookie_banner.marketing.title}
                description={dict.cookie_banner.marketing.description}
                status={dict.cookie_banner.marketing.status}
                statusColor="bg-blue-100 text-blue-700"
                checked={preferences.marketing}
                onChange={() => togglePreference('marketing')}
              />
              <CookieCategorySection
                title={dict.cookie_banner.functional.title}
                description={dict.cookie_banner.functional.description}
                status={dict.cookie_banner.functional.status}
                statusColor="bg-blue-100 text-blue-700"
                checked={preferences.functional}
                onChange={() => togglePreference('functional')}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleRejectAll}
                className="w-full sm:w-auto flex-1 px-6 py-3.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
              >
                {dict.cookie_banner.reject_all}
              </button>
              <button
                onClick={handleSavePreferences}
                className="w-full sm:w-auto flex-[1.5] px-8 py-3.5 text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-2xl transition-all shadow-lg shadow-red-200"
              >
                {dict.cookie_banner.save_preferences}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CookieCategorySection({
  title,
  description,
  status,
  statusColor,
  checked,
  onChange,
  disabled = false
}: {
  title: string;
  description: string;
  status: string;
  statusColor: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition-all hover:shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h4 className="font-extrabold text-gray-900">{title}</h4>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
            {status}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          <div className={`w-11 h-6 rounded-full transition-colors ${disabled ? 'bg-emerald-500' : 'bg-gray-200 peer-checked:bg-red-500'} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${checked ? 'after:translate-x-full' : ''}`}></div>
        </label>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
