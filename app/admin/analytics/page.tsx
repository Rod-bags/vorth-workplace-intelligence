'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Metrics {
  totalEmployees: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  totalFeedback: number;
  departmentCounts: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">High-level metrics and organizational performance overview</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading analytics data...</div>
      ) : (
        <>
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

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Progress Bar */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Task Status Breakdown</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Completed ({metrics.completedTasks})</span>
                    <span className="text-gray-500">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${completionRate}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-gray-600 dark:text-gray-300">In Progress ({metrics.inProgressTasks})</span>
                    <span className="text-gray-500">
                      {metrics.totalTasks > 0 ? Math.round((metrics.inProgressTasks / metrics.totalTasks) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{
                        width: `${metrics.totalTasks > 0 ? (metrics.inProgressTasks / metrics.totalTasks) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Pending ({metrics.pendingTasks})</span>
                    <span className="text-gray-500">
                      {metrics.totalTasks > 0 ? Math.round((metrics.pendingTasks / metrics.totalTasks) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gray-400 h-2.5 rounded-full"
                      style={{
                        width: `${metrics.totalTasks > 0 ? (metrics.pendingTasks / metrics.totalTasks) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Employees by Department</h2>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {Object.entries(metrics.departmentCounts).map(([dept, count]) => (
                  <div key={dept} className="py-2.5 flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{dept}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {count} {count === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}