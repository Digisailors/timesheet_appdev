// components/ThemeToggle.tsx
'use client';
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-4">
      <button
        onClick={() => setTheme('light')}
        className={`px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 ${
          theme === 'light' ? 'bg-blue-600 text-white' : ''
        }`}
      >
        <Sun className="inline w-4 h-4 mr-1" /> Light
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 ${
          theme === 'dark' ? 'bg-blue-600 text-white' : ''
        }`}
      >
        <Moon className="inline w-4 h-4 mr-1" /> Dark
      </button>
    </div>
  );
};

export default ThemeToggle;
