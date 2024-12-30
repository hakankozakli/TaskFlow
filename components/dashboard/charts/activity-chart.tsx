'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useTasksStore } from '@/lib/stores/use-tasks-store';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isValid } from 'date-fns';
import { useMemo } from 'react';

export function ActivityChart() {
  const tasks = useTasksStore((state) => state.tasks);
  
  const data = useMemo(() => {
    // Get data for the current month
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    
    return eachDayOfInterval({ start, end }).map(date => {
      const dayTasks = tasks.filter(task => {
        if (!task.createdAt) return false;
        const taskDate = new Date(task.createdAt);
        return isValid(taskDate) && format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      return {
        date: format(date, 'MMM dd'),
        tasks: dayTasks.length
      };
    });
  }, [tasks]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Bar
              dataKey="tasks"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}