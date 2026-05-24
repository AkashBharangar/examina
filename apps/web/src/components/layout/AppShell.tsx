'use client';

import { useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FloatingActionButton } from './FloatingActionButton';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileNavSheet } from './MobileNavSheet';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/store/app';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, setMobileNavOpen } = useAppStore();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  const shellStyle = {
    '--sidebar-width': sidebarOpen ? '18rem' : '5.75rem',
  } as CSSProperties;

  return (
    <div className="min-h-screen bg-background text-foreground" style={shellStyle}>
      <Sidebar />
      <div className="min-h-screen md:pl-[var(--sidebar-width)]">
        <Header />
        <main className="px-4 py-4 pb-28 sm:px-6 lg:px-8 lg:py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNavSheet />
      <MobileBottomNav />
      <FloatingActionButton />
    </div>
  );
}
