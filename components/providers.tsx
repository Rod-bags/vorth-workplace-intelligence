'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children, ...props }: any) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
      <Toaster position="top-right" richColors closeButton />
    </NextThemesProvider>
  );
}