// SettingsTabs.tsx
import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface SettingsTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab: propActiveTab = 'Company', onTabChange }) => {
  const [activeTab, setActiveTab] = useState<string>(propActiveTab);
  const tabs: string[] = ['Company', 'Theme', 'Policies', 'Rules', 'Designations', 'System'];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Settings className="w-5 h-5 mr-2 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Settings & Master Data</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`py-3 px-1 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsTabs;