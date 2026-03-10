import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./global_styles.css";

const base = "";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thomas Prud'homme — Links & Portfolio",
  description:
    "Apprenti CFC Informaticien en Exploitation & Infrastructure, basé dans l'Arc lémanique. Découvre mes projets, compétences et moyens de contact.",
  keywords: [
    "informaticien",
    "CFC",
    "apprenti",
    "infrastructure",
    "Suisse",
    "Thomas Prud'homme",
  ],
  openGraph: {
    title: "Thomas Prud'homme — Apprenti CFC Informaticien",
    description:
      "Apprenti CFC Informaticien en Exploitation & Infrastructure, basé dans l'Arc lémanique. Découvre mes projets, compétences et moyens de contact.",
    type: "website",
    url: "https://links.thomastp.ch",
    images: [
      {
        url: `https://links.thomastp.ch/og-image.png`,
        width: 1200,
        height: 1200,
        alt: "Thomas Prud'homme — Apprenti CFC Informaticien",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thomas Prud'homme — Apprenti CFC Informaticien",
    description: "Apprenti CFC Informaticien en Exploitation & Infrastructure, basé dans l'Arc lémanique. Découvre mes projets, compétences et moyens de contact.",
    images: [`https://links.thomastp.ch/og-image.png`],
  },
  alternates: {
    canonical: "https://links.thomastp.ch",
  },
  icons: [
    {
      rel: "icon",
      url: `${base}/favicon-light.svg`,
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      url: `${base}/favicon.svg`,
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme-preference');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
