 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRightIcon, SparkIcon } from '@/components/shared/Icons';
import { navigationItems } from './navigation';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { SecondaryButton } from '@/components/shared/SecondaryButton';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn('fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-surface md:flex md:flex-col', 'transition-[width] duration-300 ease-out')}
      style={{ width: sidebarOpen ? '18rem' : '5.75rem' }}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <SparkIcon className="h-4 w-4" />
          </div>
          {sidebarOpen ? (
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-tight text-foreground">Examina</div>
              <div className="text-caption text-muted-foreground">AI Assessment Creator</div>
            </div>
          ) : null}
        </div>
        <SecondaryButton
          className="h-10 w-10 shrink-0 rounded-full px-0"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronRightIcon className={cn('h-4 w-4 transition-transform duration-300', sidebarOpen && 'rotate-180')} />
        </SecondaryButton>
      </div>

      <nav className="flex-1 space-y-6 px-3 py-5">
        <div className="px-3 text-caption font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Workspace
        </div>
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 focus-ring',
                  isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={cn('flex h-9 w-9 items-center justify-center rounded-full border transition-colors', isActive ? 'border-transparent bg-white/10' : 'border-border bg-surface-quiet')}>
                  {item.icon}
                </span>
                {sidebarOpen ? (
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.label}</span>
                    <span className={cn('block text-caption', isActive ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
                      {item.description}
                    </span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      {sidebarOpen ? (
        <div className="border-t border-border p-4">
          <motion.div className="rounded-3xl bg-surface-quiet p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-sm font-medium text-foreground">Academic clarity</div>
            <p className="mt-1 text-caption leading-5 text-muted-foreground">
              Keep assessment creation focused, calm, and organized.
            </p>
            <PrimaryButton className="mt-4 w-full">Create assignment</PrimaryButton>
          </motion.div>
        </div>
      ) : null}
    </aside>
  );
}
