import type { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, secondaryAction, className }: EmptyStateProps) {
  return (
    <Card className={cn('flex min-h-[360px] items-center justify-center text-center', className)}>
      <div className="mx-auto max-w-md space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-quiet text-foreground shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <path d="M7.5 6.75h9M7.5 10.75h9M7.5 14.75h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6.25 3.75h11.5A1.75 1.75 0 0 1 19.5 5.5v13A1.75 1.75 0 0 1 17.75 20.25H6.25A1.75 1.75 0 0 1 4.5 18.5v-13A1.75 1.75 0 0 1 6.25 3.75Z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-section-title font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="text-body text-muted-foreground">{description}</p>
        </div>
        {(action || secondaryAction) ? (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {action}
            {secondaryAction}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
