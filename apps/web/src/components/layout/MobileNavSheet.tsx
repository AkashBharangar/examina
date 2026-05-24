 'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { navigationItems } from './navigation';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { SecondaryButton } from '@/components/shared/SecondaryButton';
import { useAppStore } from '@/store/app';

export function MobileNavSheet() {
  const { mobileNavOpen, setMobileNavOpen } = useAppStore();

  return (
    <AnimatePresence>
      {mobileNavOpen ? (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close mobile navigation"
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-[2rem] border border-border bg-surface p-4 shadow-soft"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface-quiet px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <span>{item.label}</span>
                  <span className="text-caption text-muted-foreground">{item.description}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <SecondaryButton className="flex-1" onClick={() => setMobileNavOpen(false)}>
                Close
              </SecondaryButton>
              <PrimaryButton className="flex-1">Create assignment</PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
