'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/employees', label: 'Employees' },
    { href: '/admin/tasks', label: 'Tasks' },
    { href: '/admin/feedback', label: 'Feedback' },
    { href: '/admin/analytics', label: 'Analytics' },
  ];

  const employeeLinks = [
    { href: '/employee/dashboard', label: 'Dashboard' },
    { href: '/employee/tasks', label: 'My Tasks' },
    { href: '/employee/feedback', label: 'Submit Feedback' },
  ];

  const navLinks = isAdmin ? adminLinks : employeeLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link
          href={isAdmin ? '/admin/dashboard' : '/employee/dashboard'}
          className="font-bold text-lg text-blue-600 dark:text-blue-400"
        >
          Vorth Intelligence
        </Link>

        <nav className="hidden md:flex gap-4 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}