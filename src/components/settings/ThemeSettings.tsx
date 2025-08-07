'use client';

import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeSettings: React.FC = () => {
  const [color, setColor] = useState("#1849D6");
  const [fontSize, setFontSize] = useState("Medium");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load saved font size from localStorage
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }

    // Load saved primary color from localStorage
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      setColor(savedColor);
      applyPrimaryColor(savedColor);
    } else {
      // Apply default color on first load
      applyPrimaryColor(color);
    }
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    applyPrimaryColor(newColor);
    localStorage.setItem('primaryColor', newColor);
  };

  const applyPrimaryColor = (color: string) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', color);
    
    // Create lighter and darker variations for hover states
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb = hexToRgb(color);
    if (rgb) {
      // Create a darker version for hover (reduce each RGB value by 20)
      const darkerR = Math.max(0, rgb.r - 20);
      const darkerG = Math.max(0, rgb.g - 20);
      const darkerB = Math.max(0, rgb.b - 20);
      const darkerColor = `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
      
      root.style.setProperty('--primary-color-hover', darkerColor);
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontSize = e.target.value;
    setFontSize(newFontSize);
    applyFontSize(newFontSize);
    localStorage.setItem('fontSize', newFontSize);
  };

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    
    let baseSize = '16px';
    switch (size) {
      case 'Small':
        baseSize = '14px';
        break;
      case 'Medium':
        baseSize = '16px';
        break;
      case 'Large':
        baseSize = '18px';
        break;
      default:
        baseSize = '16px';
    }
    
    // Set both the root font-size and the CSS variable
    root.style.fontSize = baseSize;
    root.style.setProperty('--app-font-size', baseSize);
  };

  const applySidebarTheme = () => {
    const sidebar = document.querySelector('[data-sidebar="sidebar"]') || 
                   document.querySelector('.sidebar') || 
                   document.querySelector('[class*="sidebar"]');
    
    if (sidebar) {
      // Keep sidebar in light/blue theme regardless of dark mode
      sidebar.classList.remove('dark');
      // Ensure sidebar maintains its original styling
      (sidebar as HTMLElement).style.backgroundColor = 'var(--primary-color, #1849D6)';
      (sidebar as HTMLElement).style.color = 'white';
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Palette className="w-6 h-6 mr-3 text-gray-700 dark:text-white" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Theme & Appearance</h1>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        {/* Primary Color Picker */}
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-gray-200">Primary Color</label>
          <div className="flex items-center space-x-3 relative">
            <input
              id="hiddenColorPicker"
              type="color"
              value={color}
              onChange={handleColorChange}
              className="absolute opacity-0 w-0 h-0"
              tabIndex={-1}
            />
            <div
              className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => {
                const input = document.getElementById("hiddenColorPicker");
                if (input) input.click();
              }}
            />
            <input
              type="text"
              value={color}
              onChange={handleColorChange}
              className="flex-1 h-10 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-gray-200">Font Size</label>
          <div className="relative">
            <select
              className="w-full h-10 px-3 pr-10 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fontSize}
              onChange={handleFontSizeChange}
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Language Full Width */}
      <div className="mt-6 w-full">
        <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-gray-200">Language</label>
        <div className="relative w-full">
          <select
            className="w-full h-10 px-3 pr-10 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="English"
          >
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="mt-8 space-y-6">
        {/* Dark Mode */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Dark Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enable dark theme for the application</p>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
                applySidebarTheme();
              }}
              className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {theme === 'dark' ? 'On' : 'Off'}
            </span>
          </label>
        </div>

        {/* Compact View (future expansion placeholder) */}
       
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button 
          className="px-6 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          style={{ 
            backgroundColor: 'var(--primary-color, #1849D6)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-color-hover, #1632B0)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-color, #1849D6)';
          }}
        >
          Save Theme Settings
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;