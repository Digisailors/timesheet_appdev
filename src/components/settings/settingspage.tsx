"use client";

import React, { useState } from "react";
import Sidebar from "../ui/sidebar";
import CompanyForm from "./CompanyForm";
import SettingsTabs from "./SettingsTabs";
import ThemeSettings from "./ThemeSettings";
import PoliciesSettings from "./PoliciesSettings";
import RulesSettings from "./RulesSettings";
import DesignationSettings from "./DesignationSettings";
import SystemSettings from "./Calendar"; // ✅ System tab

const SettingsPage: React.FC = () => {

  

  const [ ] = useState<string>("settings");
  const [activeTab, setActiveTab] = useState<string>("Company");



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
    taxID: string;
  }) => {
    console.log("Saving company data:", companyData);
    // 🔧 Future: integrate backend API call here
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Company":
        return <CompanyForm onSave={handleSaveCompany} />;
      case "Theme":
        return <ThemeSettings />;
      case "Policies":
        return <PoliciesSettings />;
      case "Rules":
        return <RulesSettings />;
      case "Designations":
        return <DesignationSettings />;
      case "Calendar":
        return <SystemSettings />;
      default:
        return (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {activeTab} Settings
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab} configuration will be implemented here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
