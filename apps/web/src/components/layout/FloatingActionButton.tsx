 'use client';

import { PlusIcon } from '@/components/shared/Icons';
import { useAppStore } from '@/store/app';

export function FloatingActionButton() {
  const { toggleMobileNav } = useAppStore();

  return (
    <button
      type="button"
      onClick={toggleMobileNav}
      className="fixed bottom-[5.25rem] right-4 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform duration-200 hover:-translate-y-0.5 focus-ring md:hidden"
      aria-label="Open create assignment options"
    >
      <PlusIcon className="h-5 w-5" />
    </button>
  );
}
