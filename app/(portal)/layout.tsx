'use client';

import { DashboardNav } from '@/components/dashboard/nav';
import { MainHeader } from '@/components/dashboard/main-header';
import { ProjectProvider } from '@/components/providers/project-provider';
import { useSession } from '@/lib/auth/session-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/auth/loading-screen';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/login');
    }
  }, [session, sessionLoading, router]);

  if (sessionLoading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return null;
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