'use client';

import { DashboardNav } from '@/components/dashboard/nav';
import { MainHeader } from '@/components/dashboard/main-header';
import { ProjectProvider } from '@/components/providers/project-provider';
import { useAuth } from '@/app/providers/auth-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/auth/loading-screen';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, organization, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }


  return (
    <ProjectProvider>
      <div className="min-h-screen flex dark:bg-gray-900">
        <DashboardNav />
        <div className="flex-1">
          <MainHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProjectProvider>
  );
}