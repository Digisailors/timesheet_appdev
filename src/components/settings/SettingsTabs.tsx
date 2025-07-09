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
      <div className="flex bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 rounded-md ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
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