'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/i18n/useLocale';
import Starfield from '@/components/Starfield';
import PhysicsConstellation from '@/components/PhysicsConstellation';
import MobileLayout from '@/components/MobileLayout';
import FloatingControls from '@/components/FloatingControls';
import { useToast, ToastContainer } from '@/components/Toast';

export default function Home() {
  const { t, locale, setLocale } = useLocale();
  const [mounted, setMounted] = useState(false);
  const { toasts, show: showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-black">
        {/* Mobile skeleton */}
        <div className="md:hidden flex flex-col items-center px-6 py-12 gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-44 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-36 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-28 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="w-32 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-36 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            </div>
          </div>
          <div className="w-full max-w-sm flex flex-col gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
          <div className="w-full max-w-sm h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
        {/* Desktop skeleton */}
        <div className="hidden md:flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-500 dark:border-t-zinc-400 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <AnimatePresence>
      <motion.main
        className="relative min-h-screen bg-zinc-50 dark:bg-black overflow-hidden"
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Starfield />

        <FloatingControls currentLocale={locale} onLocaleChange={setLocale} />

        {/* Desktop: physics constellation */}
        <div className="hidden md:block">
          <PhysicsConstellation t={t} locale={locale} onDownload={(label) => showToast(locale === 'fr' ? `${label} — téléchargement démarré` : `${label} — download started`)} />
        </div>

        {/* Mobile: card layout */}
        <div className="md:hidden">
          <MobileLayout t={t} locale={locale} onDownload={(label) => showToast(locale === 'fr' ? `${label} — téléchargement démarré` : `${label} — download started`)} />
        </div>

        <ToastContainer toasts={toasts} />
      </motion.main>
    </AnimatePresence>
  );
}
