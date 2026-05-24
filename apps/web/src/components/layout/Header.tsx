 'use client';

import { motion } from 'framer-motion';
import { MenuIcon, PlusIcon } from '@/components/shared/Icons';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { SecondaryButton } from '@/components/shared/SecondaryButton';
import { useAppStore } from '@/store/app';

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({ title = 'Examina', subtitle = 'AI Assessment Creator' }: HeaderProps) {
  const { toggleSidebar, toggleMobileNav } = useAppStore();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="flex h-18 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <SecondaryButton
            className="h-11 w-11 rounded-full px-0 md:hidden"
            onClick={toggleMobileNav}
            aria-label="Open mobile navigation"
          >
            <MenuIcon className="h-4 w-4" />
          </SecondaryButton>
          <SecondaryButton
            className="hidden h-11 w-11 rounded-full px-0 md:inline-flex"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-4 w-4" />
          </SecondaryButton>
          <div>
            <div className="text-sm font-semibold tracking-tight text-foreground">{title}</div>
            <div className="text-caption text-muted-foreground">{subtitle}</div>
          </div>
        </div>

        <motion.div
          className="hidden items-center gap-2 sm:flex"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PrimaryButton className="gap-2">
            <PlusIcon className="h-4 w-4" />
            <span>Create assignment</span>
          </PrimaryButton>
        </motion.div>
      </div>
    </header>
  );
}
