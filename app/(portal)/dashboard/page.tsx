'use client';

import { DashboardStats } from '@/components/dashboard/stats/dashboard-stats';
import { ActivityChart } from '@/components/dashboard/charts/activity-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useSession } from '@/lib/auth/session-provider';
import { LoadingScreen } from '@/components/auth/loading-screen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { session, loading } = useSession();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {session.user.email?.split('@')[0]}
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <ActivityChart />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}