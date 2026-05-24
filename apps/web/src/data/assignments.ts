export type AssignmentStatus = 'draft' | 'published' | 'grading';

export type Assignment = {
  id: string;
  title: string;
  course: string;
  status: AssignmentStatus;
  updatedAt: string;
  dueDate: string;
  questions: number;
  participants: number;
  progress: number;
  tag: string;
};

export const mockAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    title: 'Foundations of Critical Thinking',
    course: 'Academic Writing',
    status: 'published',
    updatedAt: 'Updated 2 hours ago',
    dueDate: 'Due 28 May',
    questions: 18,
    participants: 42,
    progress: 100,
    tag: 'Essay review',
  },
  {
    id: 'assignment-2',
    title: 'Environmental Systems Case Study',
    course: 'Geography',
    status: 'grading',
    updatedAt: 'Updated yesterday',
    dueDate: 'Due 30 May',
    questions: 12,
    participants: 36,
    progress: 84,
    tag: 'Case analysis',
  },
  {
    id: 'assignment-3',
    title: 'Newtonian Motion Diagnostic',
    course: 'Physics',
    status: 'draft',
    updatedAt: 'Updated 3 days ago',
    dueDate: 'Draft',
    questions: 24,
    participants: 0,
    progress: 32,
    tag: 'Question bank',
  },
  {
    id: 'assignment-4',
    title: 'Macroeconomics Knowledge Check',
    course: 'Economics',
    status: 'published',
    updatedAt: 'Updated last week',
    dueDate: 'Due 2 Jun',
    questions: 16,
    participants: 58,
    progress: 100,
    tag: 'Timed assessment',
  },
];
