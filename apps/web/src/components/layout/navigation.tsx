import type { ReactNode } from 'react';
import { AssignmentIcon, GridIcon } from '@/components/shared/Icons';

export type NavigationItem = {
  label: string;
  href: string;
  icon: ReactNode;
  description: string;
};

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <GridIcon className="h-4 w-4" />,
    description: 'Home overview',
  },
  {
    label: 'Assignments',
    href: '/assignments',
    icon: <AssignmentIcon className="h-4 w-4" />,
    description: 'Manage assessments',
  },
];
