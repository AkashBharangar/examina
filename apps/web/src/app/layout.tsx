import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Examina - AI Assessment Creator',
  description: 'Create and manage AI assessments with ease',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
