import { LocalizedString } from './types';

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
        // If double stringified (e.g. "{\"tr\":...}"), recursive check might be needed logicwise, 
        // but here we just pass the object to recursive getLocalizedText call.
        // Wait, if result is object, we can treat it as LocalizedString.
        // If result is string (double stringified inside), tryParseJSON would have returned false unless logic handles it.
        // Let's improve tryParse logic for recursion inline or just recursive call.

        // Actually, JSON.parse("{\"tr\":\"x\"}") -> object.
        // JSON.parse("\"{\"tr\":\"x\"}\"") -> string. 

        if (typeof parsed === 'string') {
          return getLocalizedText(parsed, lang);
        }
        return getLocalizedText(parsed, lang);
      }
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
