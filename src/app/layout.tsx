'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import React, { ReactNode } from 'react';
<<<<<<< HEAD
import { Toaster } from 'react-hot-toast';
=======
import { Toaster } from 'react-hot-toast'; // <-- Add this
import { Toaster } from 'sonner';
// import { GeistSans, GeistMono } from 'geist/font'; // Import the font variables

// Optionally, use a Google Font or another available font package here if needed.
>>>>>>> 9161bf462c3c0fbc2817474ffa66f77f3090a0fe

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
<<<<<<< HEAD

          {/* ✅ Toast messages with dark green background */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'darkgreen',
=======
          {/* 🔔 Toast messages shown at top-right */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
>>>>>>> 9161bf462c3c0fbc2817474ffa66f77f3090a0fe
                color: '#fff',
              },
            }}
          />
        </ThemeProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
