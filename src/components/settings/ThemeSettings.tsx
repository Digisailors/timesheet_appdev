import React from 'react';

const ThemeSettings: React.FC = () => {
  return (
    <div className="bg-white text-black rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme & Appearance</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Primary Color */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Primary Color</label>
          <input
            type="color"
            defaultValue="#1849D6"
            className="h-10 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Font Size</label>
          <select
            className="h-10 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            defaultValue="Medium"
          >
            <option className="text-black bg-white">Small</option>
            <option className="text-black bg-white">Medium</option>
            <option className="text-black bg-white">Large</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Language</label>
          <select
            className="h-10 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            defaultValue="English"
          >
            <option className="text-black bg-white">English</option>
            <option className="text-black bg-white">Tamil</option>
            <option className="text-black bg-white">Hindi</option>
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <label className="flex items-center space-x-3 text-gray-700">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 bg-white"
          />
          <span>Enable dark theme for the application</span>
        </label>

        <label className="flex items-center space-x-3 text-gray-700">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 bg-white"
          />
          <span>Reduce spacing for more content on screen</span>
        </label>
      </div>

      <div className="mt-6">
        <button className="relative z-10 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Theme Settings
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
