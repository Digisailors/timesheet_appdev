// src/components/settings/SettingsPage.tsx
"use client";

import React, { useState } from 'react';
import Sidebar from "../ui/sidebar";
import Navbar from "../ui/navbar";
import CompanyForm from "./CompanyForm";
import SettingsTabs from "./SettingsTabs";

const SettingsPage: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('settings');
  const [activeTab, setActiveTab] = useState<string>('Company');

  const handleMenuClick = (itemId: string) => {
    setActiveMenuItem(itemId);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSaveCompany = (companyData: {
    companyName: string;
    registrationNumber: string;
    address: string;
    phoneNumber: string;
    email: string;
    website: string;
    taxId: string;
  }) => {
    console.log('Saving company data:', companyData);
    // Save logic here
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        onItemClick={handleMenuClick}
      />

      <div className="flex-1 flex flex-col">
        <Navbar 
          title="Settings"
          userName="Admin User"
          userInitial="A"
        />

        <div className="flex-1 p-6">
          <SettingsTabs 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {activeTab === 'Company' ? (
            <CompanyForm onSave={handleSaveCompany} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {activeTab} Settings
              </h3>
              <p className="text-gray-500">
                {activeTab} configuration will be implemented here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
