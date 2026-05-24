 'use client';

import { motion } from 'framer-motion';
import type { Assignment } from '@/data/assignments';
import { Badge } from '@/components/shared/Badge';
import { Card } from '@/components/shared/Card';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { SecondaryButton } from '@/components/shared/SecondaryButton';

type AssignmentCardProps = {
  assignment: Assignment;
  index: number;
};

const statusVariants: Record<Assignment['status'], 'neutral' | 'success' | 'warning'> = {
  draft: 'warning',
  published: 'success',
  grading: 'neutral',
};

export function AssignmentCard({ assignment, index }: AssignmentCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
    >
      <Card interactive className="flex h-full flex-col justify-between gap-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant={statusVariants[assignment.status]} className="w-fit capitalize">
                {assignment.status}
              </Badge>
              <div>
                <h3 className="text-card-title font-semibold tracking-tight text-foreground">{assignment.title}</h3>
                <p className="mt-1 text-body text-muted-foreground">{assignment.course}</p>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">
              {assignment.tag}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-surface-quiet p-3">
            <div>
              <div className="text-caption text-muted-foreground">Questions</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{assignment.questions}</div>
            </div>
            <div>
              <div className="text-caption text-muted-foreground">Participants</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{assignment.participants}</div>
            </div>
            <div>
              <div className="text-caption text-muted-foreground">Progress</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{assignment.progress}%</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-caption text-muted-foreground">
            <span>{assignment.updatedAt}</span>
            <span>{assignment.dueDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton className="flex-1 min-w-[120px]">Open</PrimaryButton>
          <SecondaryButton className="flex-1 min-w-[120px]">Preview</SecondaryButton>
        </div>
      </Card>
    </motion.article>
  );
}
