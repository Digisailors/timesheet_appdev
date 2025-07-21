'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import React, { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <body className="antialiased">
        {mounted ? (
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'darkgreen',
                  color: '#fff',
                },
              }}
            />
          </ThemeProvider>
        ) : null}
      </body>
    </html>
  );
}
