'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';
// import { GeistSans, GeistMono } from 'geist/font'; // Import the font variables

// Optionally, use a Google Font or another available font package here if needed.

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
