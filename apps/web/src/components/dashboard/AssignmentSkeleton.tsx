import { Card } from '@/components/shared/Card';

export function AssignmentSkeleton() {
  return (
    <Card className="space-y-4" interactive>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-56 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-32 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-surface-quiet p-3">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-8 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-8 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-10 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="h-11 flex-1 rounded-full bg-muted animate-pulse" />
        <div className="h-11 flex-1 rounded-full bg-muted animate-pulse" />
      </div>
    </Card>
  );
}
