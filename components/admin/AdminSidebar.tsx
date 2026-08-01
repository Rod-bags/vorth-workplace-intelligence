import Link from 'next/link';

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 space-y-4">
      <h2 className="text-lg font-bold">Admin Portal</h2>
      <nav className="flex flex-col space-y-2 text-sm">
        <Link href="/admin/dashboard" className="hover:text-blue-400">Dashboard Analytics</Link>
        <Link href="/admin/announcements" className="hover:text-blue-400">Announcements</Link>
      </nav>
    </aside>
  );
}