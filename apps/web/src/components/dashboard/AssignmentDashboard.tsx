'use client';

import { useDeferredValue, useState } from 'react';
import Link from 'next/link';
import type { Assignment } from '@/data/assignments';
import { AssignmentCard } from './AssignmentCard';
import { AssignmentFilters } from './AssignmentFilters';
import { AssignmentSkeleton } from './AssignmentSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { SecondaryButton } from '@/components/shared/SecondaryButton';
import { SectionHeader } from '@/components/shared/SectionHeader';

type AssignmentDashboardProps = {
  assignments: Assignment[];
  emptyMode?: boolean;
};

export function AssignmentDashboard({ assignments, emptyMode = false }: AssignmentDashboardProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      deferredSearch.length === 0 ||
      [assignment.title, assignment.course, assignment.tag, assignment.status]
        .join(' ')
        .toLowerCase()
        .includes(deferredSearch);

    const matchesStatus = status === 'all' || assignment.status === status;

    return matchesSearch && matchesStatus;
  });

  const totalAssignments = assignments.length;
  const draftCount = assignments.filter((assignment) => assignment.status === 'draft').length;
  const activeCount = assignments.filter((assignment) => assignment.status === 'published').length;

  if (emptyMode || totalAssignments === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Assignments"
          title="Assignments dashboard"
          description="Create and manage assessments in a calm, academic workspace built around clean hierarchy."
        />

        <EmptyState
          title="No assignments yet"
          description="Start with a new assignment, or open a template to seed your first assessment."
          action={
            <Link href="/assignments/create" className="pill-button bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
              Create assignment
            </Link>
          }
          secondaryAction={<SecondaryButton>Browse templates</SecondaryButton>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <SectionHeader
        eyebrow="Assignments"
        title="Assignments dashboard"
        description="Minimal academic dashboard for building, reviewing, and publishing assessments."
        actions={
          <div className="hidden items-center gap-2 lg:flex">
            <SecondaryButton>Export</SecondaryButton>
            <Link href="/assignments/create" className="pill-button bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
              Create assignment
            </Link>
          </div>
        }
      />

      <CardMetrics total={totalAssignments} drafts={draftCount} active={activeCount} />

      <AssignmentFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No matching assignments"
          description="Try a different search term or status filter to reveal the assignment list again."
          action={<SecondaryButton onClick={() => setSearch('')}>Clear search</SecondaryButton>}
        />
      ) : (
        <div className="card-grid">
          {filteredAssignments.map((assignment, index) => (
            <AssignmentCard key={assignment.id} assignment={assignment} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardMetrics({ total, drafts, active }: { total: number; drafts: number; active: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard label="Total assignments" value={total} note="Across all courses" />
      <MetricCard label="Published" value={active} note="Ready for learners" />
      <MetricCard label="Drafts" value={drafts} note="Still being shaped" />
    </div>
  );
}

function MetricCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-card">
      <div className="text-caption font-medium uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-caption text-muted-foreground">{note}</div>
    </div>
  );
}

export function AssignmentDashboardLoadingState() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-36 rounded-full bg-muted animate-pulse" />
        <div className="h-8 w-80 rounded-full bg-muted animate-pulse" />
        <div className="h-5 w-[32rem] max-w-full rounded-full bg-muted animate-pulse" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-28 rounded-3xl bg-muted animate-pulse" />
        <div className="h-28 rounded-3xl bg-muted animate-pulse" />
        <div className="h-28 rounded-3xl bg-muted animate-pulse" />
      </div>
      <div className="h-24 rounded-3xl bg-muted animate-pulse" />
      <div className="card-grid">
        <AssignmentSkeleton />
        <AssignmentSkeleton />
      </div>
    </div>
  );
}
