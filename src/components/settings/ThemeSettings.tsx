import React, { useState } from 'react';
import { Palette } from 'lucide-react'; // ✅ Lucide icon

const ThemeSettings: React.FC = () => {
  const [color, setColor] = useState("#1849D6");

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <div className="bg-white text-black p-6 w-full">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Palette className="w-6 h-6 mr-3 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-900">Theme & Appearance</h1>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        {/* Primary Color Picker */}
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-900">Primary Color</label>
          <div className="flex items-center space-x-3 relative">
            {/* Hidden color input */}
            <input
              id="hiddenColorPicker"
              type="color"
              value={color}
              onChange={handleColorChange}
              className="absolute opacity-0 w-0 h-0"
              tabIndex={-1}
            />

            {/* Visible color box */}
            <div
              className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => {
                const input = document.getElementById("hiddenColorPicker");
                if (input) input.click();
              }}
            />

            {/* Hex input */}
            <input
              type="text"
              value={color}
              onChange={handleColorChange}
              className="flex-1 h-10 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-900">Font Size</label>
          <div className="relative">
            <select
              className="w-full h-10 px-3 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white appearance-none"
              defaultValue="Medium"
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Language Full Width */}
      <div className="mt-6 w-full">
        <label className="block mb-3 text-sm font-medium text-gray-900">Language</label>
        <div className="relative w-full">
          <select
            className="w-full h-10 px-3 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white appearance-none"
            defaultValue="English"
          >
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="mt-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Dark Mode</h3>
            <p className="text-sm text-gray-600">Enable dark theme for the application</p>
          </div>
          <input
            type="radio"
            id="darkMode"
            name="themeOptions"
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Compact View</h3>
            <p className="text-sm text-gray-600">Reduce spacing for more content on screen</p>
          </div>
          <input
            type="radio"
            id="compactView"
            name="themeOptions"
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Save Theme Settings
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
