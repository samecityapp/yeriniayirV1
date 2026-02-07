import { LocalizedString } from './types';
import { LOCATION_TRANSLATIONS } from '@/lib/constants/regions';

const tryParseJSON = (jsonString: string): any => {
  try {
    const o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) { }
  return false;
};

export function getLocalizedText(
  text: LocalizedString | string | undefined | null,
  lang: string = 'tr'
): string {
  if (!text) return '';

  if (typeof text === 'string') {
    // Check for standard JSON structure
    if (text.trim().startsWith('{')) {
      const parsed = tryParseJSON(text);
      if (parsed) {
        if (typeof parsed === 'string') {
          return getLocalizedText(parsed, lang);
        }
        return getLocalizedText(parsed, lang);
      }
    }

    // Automatic Location Translation for non-TR languages
    if (lang !== 'tr' && LOCATION_TRANSLATIONS[text]) {
      return LOCATION_TRANSLATIONS[text];
    }

    return text;
  }

  // Handle object
  const result = (text as any)[lang] || (text as any).tr || (text as any).en || Object.values(text)[0] || '';

  // If result is a JSON string (double stringified or just nested JSON), parse it recursively
  if (typeof result === 'string' && result.trim().startsWith('{')) {
    return getLocalizedText(result, lang);
  }

  return result;
}

export function getCurrentLanguage(): string {
  if (typeof window === 'undefined') return 'tr';
  return localStorage.getItem('language') || 'tr';
}

export function setCurrentLanguage(lang: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

export function doesArticleSupportLang(article: any, lang: string = 'tr'): boolean {
  // 1. Explicit language tag takes precedence
  if (article.language) {
    return article.language === lang;
  }

  // 2. Logic for objects with localized title (e.g. { tr: "...", en: "..." })
  if (article.title && typeof article.title === 'object') {
    // Strict check: The object MUST have a key for the requested language
    // We do NOT partial match or fallback here for LISTING purposes.
    // If user wants to show mixed content, they can change this policy.
    // But currently: "NEVER mix languages".
    return !!(article.title as any)[lang];
  }

  // 3. Logic for legacy string-only articles
  // Assumption: Legacy content is generally Turkish unless specified otherwise
  if (typeof article.title === 'string') {
    return lang === 'tr';
  }

  // Default deny if structure is unknown
  return false;
}
