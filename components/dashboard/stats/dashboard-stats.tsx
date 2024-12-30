'use client';

import { StatCard } from './stat-card';
import { Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useProjectsStore } from '@/lib/stores/use-projects-store';
import { useTasksStore } from '@/lib/stores/use-tasks-store';

export function DashboardStats() {
  const projects = useProjectsStore((state) => state.projects);
  const tasks = useTasksStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'done';
  }).length;

  const activeTeamMembers = projects.reduce((sum, project) => sum + project.members, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Team Members"
        value={activeTeamMembers}
        icon={Users}
        description="Across all projects"
      />
      <StatCard
        title="Tasks Completed"
        value={completedTasks}
        icon={CheckCircle2}
        description={`Out of ${totalTasks} total tasks`}
        trend={{
          value: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
          label: "completion rate"
        }}
      />
      <StatCard
        title="In Progress"
        value={totalTasks - completedTasks}
        icon={Clock}
        description="Active tasks"
      />
      <StatCard
        title="Overdue Tasks"
        value={overdueTasks}
        icon={AlertCircle}
        description="Require attention"
      />
    </div>
  );
}