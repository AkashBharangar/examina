 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AssignmentIcon, GridIcon, MenuIcon, PlusIcon } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app';

const items = [
  { label: 'Home', href: '/', icon: <GridIcon className="h-4 w-4" /> },
  { label: 'Assignments', href: '/assignments', icon: <AssignmentIcon className="h-4 w-4" /> },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleMobileNav } = useAppStore();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-caption font-medium transition-all duration-200 focus-ring',
                isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={toggleMobileNav}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-surface px-3 py-2 text-caption font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground focus-ring"
          aria-label="Open more navigation options"
        >
          <MenuIcon className="h-4 w-4" />
          <span>More</span>
        </button>
      </div>

      <button
        type="button"
        className="absolute -top-7 left-1/2 inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform duration-200 hover:-translate-y-0.5 focus-ring"
        aria-label="Create assignment"
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    </nav>
  );
}
