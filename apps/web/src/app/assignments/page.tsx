import { AssignmentDashboard } from '@/components/dashboard/AssignmentDashboard';
import { mockAssignments } from '@/data/assignments';

type PageProps = {
  searchParams?: Promise<{
    state?: string;
  }>;
};

export default async function AssignmentsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const emptyMode = resolvedSearchParams?.state === 'empty';

  return <AssignmentDashboard assignments={emptyMode ? [] : mockAssignments} emptyMode={emptyMode} />;
}
