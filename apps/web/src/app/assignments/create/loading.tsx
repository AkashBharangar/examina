import { Card } from '@/components/shared/Card';

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-10">
      <div className="h-24 w-full rounded-3xl bg-muted animate-pulse" />
      <Card className="space-y-6 p-6 sm:p-7">
        <div className="space-y-3">
          <div className="h-4 w-40 rounded-full bg-muted animate-pulse" />
          <div className="h-8 w-72 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-24 rounded-3xl bg-muted animate-pulse" />
          <div className="h-24 rounded-3xl bg-muted animate-pulse" />
        </div>
        <div className="h-44 rounded-3xl bg-muted animate-pulse" />
        <div className="h-24 rounded-3xl bg-muted animate-pulse" />
      </Card>
    </div>
  );
}
