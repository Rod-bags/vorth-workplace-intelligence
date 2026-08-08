import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function EmployeeDashboardPage() {
  const supabase = await createClient();

  // 1. Verify user session on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Kick unauthenticated users back to login
  if (!user) {
    redirect('/login');
  }

  // 2. Fetch tasks directly on the server
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', user.id);

  const assignedTasks = tasks || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Employee Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome, {user.email}! Here is your workspace portal.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Assigned Tasks
        </h2>

        {assignedTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No active tasks assigned to you.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {assignedTasks.map((task: any) => (
              <li key={task.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}