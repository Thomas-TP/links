'use client';

import { useState, useEffect } from 'react';
import { translations, type Locale, type Translations } from './translations';

export function useLocale(): { locale: Locale; setLocale: (l: Locale) => void; t: Translations } {
  const [locale, setLocale] = useState<Locale>('fr');

  useEffect(() => {
    // 1. Check for manual override in localStorage
    const savedLocale = localStorage.getItem('lang-preference') as Locale | null;
    if (savedLocale) {
      setLocale(savedLocale);
      document.documentElement.lang = savedLocale;
      return;
    }

    // 2. Fall back to automatic detection
    // 'en', 'de', 'it' → English (better than French for these speakers)
    // everything else (fr, es, pt…) → French
    const lang = navigator.language.toLowerCase();
    const useEnglish = lang.startsWith('en') || lang.startsWith('de') || lang.startsWith('it');
    if (useEnglish) {
      setLocale('en');
    }
    // Update html lang attribute
    document.documentElement.lang = useEnglish ? 'en' : 'fr';
  }, []);

  return { locale, setLocale, t: translations[locale] };
}
