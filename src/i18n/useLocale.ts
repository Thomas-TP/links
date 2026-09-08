import { useEffect, useState } from 'react';
import { type Locale, type Translations, translations } from './translations';

/**
 * Maps a BCP-47 navigator.language tag to a supported Locale.
 * 'en', 'de', 'it' → English (better than French for these speakers).
 * everything else (fr, es, pt…) → French.
 */
export function detectLocaleFromNavigatorLanguage(language: string): Locale {
  const lang = language.toLowerCase();
  const useEnglish = lang.startsWith('en') || lang.startsWith('de') || lang.startsWith('it');
  return useEnglish ? 'en' : 'fr';
}

export function useLocale(initialLocale?: Locale): {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
} {
  const [locale, setLocale] = useState<Locale>(initialLocale ?? 'fr');

  useEffect(() => {
    // 1. Check for manual override in localStorage
    const savedLocale = localStorage.getItem('lang-preference') as Locale | null;
    if (savedLocale) {
      setLocale(savedLocale);
      document.documentElement.lang = savedLocale;
      return;
    }

    // 2. Respect the entry route's language (e.g. /en), if any
    if (initialLocale) {
      document.documentElement.lang = initialLocale;
      return;
    }

    // 3. Fall back to automatic detection from the browser
    const detected = detectLocaleFromNavigatorLanguage(navigator.language);
    setLocale(detected);
    document.documentElement.lang = detected;
  }, [initialLocale]);

  return { locale, setLocale, t: translations[locale] };
}
