import { MainLayout } from '@/components/layout/main-layout';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple auth check simulation for now
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
