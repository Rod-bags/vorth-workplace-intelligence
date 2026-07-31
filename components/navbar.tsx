'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href={isAdmin ? '/admin/dashboard' : '/employee/dashboard'} className="font-bold text-lg text-blue-600 dark:text-blue-400">
          Vorth Intelligence
        </Link>
        <nav className="hidden md:flex gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
          {isAdmin ? (
            <>
              <Link href="/admin/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>
              <Link href="/admin/employees" className="hover:text-blue-600 dark:hover:text-blue-400">Employees</Link>
              <Link href="/admin/tasks" className="hover:text-blue-600 dark:hover:text-blue-400">Tasks</Link>
              <Link href="/admin/feedback" className="hover:text-blue-600 dark:hover:text-blue-400">Feedback</Link>
              <Link href="/admin/analytics" className="hover:text-blue-600 dark:hover:text-blue-400">Analytics</Link>
            </>
          ) : (
            <>
              <Link href="/employee/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>
              <Link href="/employee/tasks" className="hover:text-blue-600 dark:hover:text-blue-400">My Tasks</Link>
              <Link href="/employee/feedback" className="hover:text-blue-600 dark:hover:text-blue-400">Submit Feedback</Link>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}