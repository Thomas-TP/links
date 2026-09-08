import { describe, expect, it } from 'vitest';
import { detectLocaleFromNavigatorLanguage } from './useLocale';

describe('detectLocaleFromNavigatorLanguage', () => {
  it.each([
    ['en-US', 'en'],
    ['en-GB', 'en'],
    ['en', 'en'],
    ['de-DE', 'en'],
    ['de', 'en'],
    ['it-IT', 'en'],
    ['it', 'en'],
  ] as const)('maps %s to %s', (input, expected) => {
    expect(detectLocaleFromNavigatorLanguage(input)).toBe(expected);
  });

  it.each([
    ['fr-FR', 'fr'],
    ['fr-CH', 'fr'],
    ['fr', 'fr'],
    ['es-ES', 'fr'],
    ['pt-BR', 'fr'],
    ['zh-CN', 'fr'],
    ['', 'fr'],
  ] as const)('maps %s to %s', (input, expected) => {
    expect(detectLocaleFromNavigatorLanguage(input)).toBe(expected);
  });

  it('is case-insensitive', () => {
    expect(detectLocaleFromNavigatorLanguage('EN-US')).toBe('en');
    expect(detectLocaleFromNavigatorLanguage('FR-fr')).toBe('fr');
  });
});
