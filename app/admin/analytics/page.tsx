'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Metrics {
  totalEmployees: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  totalFeedback: number;
  departmentCounts: Record<string, number>;
}

interface ChartDataItem {
  name: string;
  count: number;
}

interface PieDataItem {
  name: string;
  value: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminAnalyticsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<Metrics>({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    totalFeedback: 0,
    departmentCounts: {},
  });

  useEffect(() => {
    setMounted(true);

    async function fetchAnalytics() {
      setLoading(true);

      const [
        { data: profiles },
        { data: tasks },
        { data: feedback }
      ] = await Promise.all([
        supabase.from('profiles').select('department'),
        supabase.from('tasks').select('status'),
        supabase.from('feedback').select('id'),
      ]);

      const deptMap: Record<string, number> = {};
      profiles?.forEach((p) => {
        const dept = p.department || 'Unassigned';
        deptMap[dept] = (deptMap[dept] || 0) + 1;
      });

      const totalT = tasks?.length || 0;
      const completed = tasks?.filter((t) => t.status === 'completed').length || 0;
      const pending = tasks?.filter((t) => t.status === 'pending').length || 0;
      const inProgress = tasks?.filter((t) => t.status === 'in_progress').length || 0;

      setMetrics({
        totalEmployees: profiles?.length || 0,
        totalTasks: totalT,
        completedTasks: completed,
        pendingTasks: pending,
        inProgressTasks: inProgress,
        totalFeedback: feedback?.length || 0,
        departmentCounts: deptMap,
      });

      setLoading(false);
    }

    fetchAnalytics();
  }, []);

  const completionRate = metrics.totalTasks > 0
    ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
    : 0;

  // Datasets formatted explicitly for Recharts
  const departmentChartData: ChartDataItem[] = Object.entries(metrics.departmentCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const taskStatusChartData: PieDataItem[] = [
    { name: 'Completed', value: metrics.completedTasks },
    { name: 'In Progress', value: metrics.inProgressTasks },
    { name: 'Pending', value: metrics.pendingTasks },
  ];

  if (!mounted || loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center py-12 text-gray-500">
        Loading analytics data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">High-level metrics and organizational performance overview</p>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Team</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics.totalEmployees}</div>
          <div className="text-xs text-gray-400 mt-1">Active users</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Task Completion</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{completionRate}%</div>
          <div className="text-xs text-gray-400 mt-1">{metrics.completedTasks} of {metrics.totalTasks} completed</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Tasks</div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {metrics.pendingTasks + metrics.inProgressTasks}
          </div>
          <div className="text-xs text-gray-400 mt-1">{metrics.inProgressTasks} in progress</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Feedback Received</div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{metrics.totalFeedback}</div>
          <div className="text-xs text-gray-400 mt-1">Anonymous submissions</div>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Task Status Breakdown (Pie Chart) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Task Completion Rate</h2>
          <div className="h-64 w-full">
            {metrics.totalTasks === 0 ? (
              <p className="text-sm text-gray-500 text-center pt-20">No tasks created yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ''}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {taskStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Department Distribution (Bar Chart) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Employees by Department</h2>
          <div className="h-64 w-full">
            {departmentChartData.length === 0 ? (
              <p className="text-sm text-gray-500 text-center pt-20">No employee departments found.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}