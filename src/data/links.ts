import type { Locale } from '@/i18n/translations';

export interface LinkItem {
  id: string;
  url: string;
  icon: 'github' | 'linkedin' | 'globe' | 'file' | 'mail' | 'whatsapp';
  isDownload?: boolean;
  openInSelf?: boolean;
}

export const links: LinkItem[] = [
  {
    id: 'github',
    url: 'https://github.com/Thomas-TP',
    icon: 'github',
  },
  {
    id: 'linkedin',
    url: 'https://www.linkedin.com/in/thomas-tp',
    icon: 'linkedin',
  },
  {
    id: 'portfolio',
    url: 'https://thomastp.ch/',
    icon: 'globe',
  },
  {
    id: 'cv',
    // Resolved per-locale by getLinkUrl below.
    url: 'https://cv.thomastp.ch/cv-fr.pdf',
    icon: 'file',
  },
  {
    id: 'email',
    url: 'mailto:thomas@prudhomme.li',
    icon: 'mail',
  },
  {
    id: 'whatsapp',
    // Cloudflare Worker with Turnstile CAPTCHA — see workers/wa-worker.js
    url: 'https://wa-redirect.thomastp.workers.dev',
    icon: 'whatsapp',
    openInSelf: true,
  },
];

export function getLinkUrl(link: LinkItem, locale: Locale): string {
  if (link.id === 'cv') {
    return `https://cv.thomastp.ch/cv-${locale}.pdf`;
  }
  return link.url;
}
