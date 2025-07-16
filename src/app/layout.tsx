'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast'; // <-- Add this

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          {/* 🔔 Toast messages shown at top-right */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
