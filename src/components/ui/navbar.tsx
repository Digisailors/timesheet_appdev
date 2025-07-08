"use client";

import React from 'react';

interface NavbarProps {
  className?: string;
  title?: string;
  userName?: string;
  userRole?: string;
  userInitial?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  className = '',
  title = 'Dashboard',
  userName = 'Admin User',
  userRole = 'Site Manager',
  userInitial = 'A'
}) => {
  return (
    <div className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">{userRole}</div>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{userInitial}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
