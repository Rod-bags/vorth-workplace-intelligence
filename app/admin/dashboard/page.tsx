'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface DepartmentData {
  department: string;
  count: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface TaskTrendData {
  date: string;
  created: number;
  completed: number;
}

interface FeedbackTrendData {
  date: string;
  [category: string]: number | string;
}

const COLORS = ['#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  // Chart datasets
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [taskTrendData, setTaskTrendData] = useState<TaskTrendData[]>([]);
  const [feedbackTrendData, setFeedbackTrendData] = useState<FeedbackTrendData[]>([]);
  const [feedbackCategories, setFeedbackCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDashboardMetrics() {
      setLoading(true);

      const [
        { data: profiles },
        { data: tasks },
        { data: feedback }
      ] = await Promise.all([
        supabase.from('profiles').select('department'),
        supabase.from('tasks').select('status, created_at, due_date'),
        supabase.from('feedback').select('category, created_at'),
      ]);

      // 1. Employees per Department (BarChart)
      const deptMap: Record<string, number> = {};
      profiles?.forEach((p) => {
        const dept = p.department || 'Unassigned';
        deptMap[dept] = (deptMap[dept] || 0) + 1;
      });
      setDepartmentData(
        Object.entries(deptMap).map(([department, count]) => ({ department, count }))
      );

      // 2. Task Completion Status Rates (PieChart/Donut)
      const statusCounts = { pending: 0, in_progress: 0, completed: 0 };
      tasks?.forEach((t) => {
        if (t.status in statusCounts) {
          statusCounts[t.status as keyof typeof statusCounts]++;
        }
      });
      setStatusData([
        { name: 'Completed', value: statusCounts.completed },
        { name: 'In Progress', value: statusCounts.in_progress },
        { name: 'Pending', value: statusCounts.pending },
      ]);

      // 3. Tasks Completed vs Created Over Time (LineChart)
      const taskTimeline: Record<string, { created: number; completed: number }> = {};
      tasks?.forEach((t) => {
        const date = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!taskTimeline[date]) taskTimeline[date] = { created: 0, completed: 0 };
        taskTimeline[date].created++;
        if (t.status === 'completed') taskTimeline[date].completed++;
      });
      setTaskTrendData(
        Object.entries(taskTimeline).map(([date, counts]) => ({
          date,
          created: counts.created,
          completed: counts.completed,
        }))
      );

      // 4. Feedback Submissions Over Time Categorized by Type (Stacked BarChart)
      const categoriesSet = new Set<string>();
      const feedbackTimeline: Record<string, Record<string, number>> = {};

      feedback?.forEach((f) => {
        const date = new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const cat = f.category || 'General';
        categoriesSet.add(cat);

        if (!feedbackTimeline[date]) feedbackTimeline[date] = {};
        feedbackTimeline[date][cat] = (feedbackTimeline[date][cat] || 0) + 1;
      });

      const categoriesList = Array.from(categoriesSet);
      setFeedbackCategories(categoriesList);

      const formattedFeedback = Object.entries(feedbackTimeline).map(([date, cats]) => {
        const entry: FeedbackTrendData = { date };
        categoriesList.forEach((cat) => {
          entry[cat] = cats[cat] || 0;
        });
        return entry;
      });
      setFeedbackTrendData(formattedFeedback);

      setLoading(false);
    }

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Visualizing workforce tasks, employee allocation, and feedback trends</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading metrics & rendering visualizations...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. LineChart: Tasks Completed vs Created */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Task Creation vs Completion</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="created" stroke="#3B82F6" strokeWidth={2} name="Tasks Created" />
                  <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Tasks Completed" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Donut / PieChart: Task Status Rates */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Task Completion Status</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. BarChart: Employees per Department */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Employees by Department</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="department" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. BarChart: Feedback Submissions Over Time by Category */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Feedback Trends by Category</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feedbackTrendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  {feedbackCategories.map((category, index) => (
                    <Bar
                      key={category}
                      dataKey={category}
                      stackId="a"
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}