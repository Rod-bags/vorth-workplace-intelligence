import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vorth Workplace Intelligence',
  description: 'AI-driven workforce management & feedback platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Fetch current user session on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Retrieve current path from request headers
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  const publicRoutes = ['/login', '/signup', '/forgot-password', '/auth/callback'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users attempting to access protected routes
  if (!user && !isPublicRoute && pathname !== '') {
    redirect('/login');
  }

  // Redirect authenticated users away from auth pages to their dashboard
  if (user && isPublicRoute && !pathname.startsWith('/auth/callback')) {
    redirect('/employee/dashboard');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}