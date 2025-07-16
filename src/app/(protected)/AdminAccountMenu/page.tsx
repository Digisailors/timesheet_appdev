import React from 'react';
import AdminProfileDropdown from '../../../components/AdminProfile/AdminProfileDropdown';
import ThemeToggle from '../../../components/AdminProfile/ThemeToggle';

const AdminAccountMenu = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 shadow-sm rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Admin Profile Demo</h2>
          <div className="flex justify-between items-center">
            <ThemeToggle />
            <AdminProfileDropdown
              trigger={
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountMenu;
