import { describe, expect, it } from 'vitest';
import { getLinkUrl, links } from './links';

describe('getLinkUrl', () => {
  const cvLink = links.find((l) => l.id === 'cv');
  if (!cvLink) throw new Error('cv link missing from links data');

  it('resolves the French CV url for locale "fr"', () => {
    expect(getLinkUrl(cvLink, 'fr')).toBe('https://cv.thomastp.ch/cv-fr.pdf');
  });

  it('resolves the English CV url for locale "en"', () => {
    expect(getLinkUrl(cvLink, 'en')).toBe('https://cv.thomastp.ch/cv-en.pdf');
  });

  it('leaves non-CV links untouched regardless of locale', () => {
    for (const link of links) {
      if (link.id === 'cv') continue;
      expect(getLinkUrl(link, 'fr')).toBe(link.url);
      expect(getLinkUrl(link, 'en')).toBe(link.url);
    }
  });
});
