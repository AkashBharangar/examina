import type { Metadata } from 'next';
import { AssignmentCreateForm } from '@/components/assignment/AssignmentCreateForm';

export const metadata: Metadata = {
  title: 'Create Assignment - Examina',
};

export default function CreateAssignmentPage() {
  return <AssignmentCreateForm />;
}
