'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
}

export default function EmployeeTasksPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  const fetchUserTasks = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .order('due_date', { ascending: true });

      if (data) setTasks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const updateStatus = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    fetchUserTasks();
  };

  const filteredTasks = tasks.filter((t) => (filter === 'all' ? true : t.status === filter));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track and update your assigned workloads</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === tab
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading your assignments...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500">
          No tasks found under this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">{task.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
                )}
                {task.due_date && (
                  <p className="text-xs text-gray-400">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                {task.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus(task.id, 'pending')}
                    className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs text-gray-700 dark:text-gray-200 rounded font-medium"
                  >
                    Mark Pending
                  </button>
                )}
                {task.status !== 'in_progress' && (
                  <button
                    onClick={() => updateStatus(task.id, 'in_progress')}
                    className="flex-1 py-1.5 px-2 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 text-xs text-yellow-700 dark:text-yellow-300 rounded font-medium"
                  >
                    In Progress
                  </button>
                )}
                {task.status !== 'completed' && (
                  <button
                    onClick={() => updateStatus(task.id, 'completed')}
                    className="flex-1 py-1.5 px-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 text-xs text-green-700 dark:text-green-300 rounded font-medium"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}