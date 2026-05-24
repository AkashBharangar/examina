import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="space-y-1.5">
        {eyebrow ? (
          <div className="text-caption font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-page-title font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="max-w-2xl text-body text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
