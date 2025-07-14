"use client";
// components/Sidebar.tsx

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  FolderIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  className?: string;
  onItemClick?: (itemId: string) => void;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { id: 'employee-management', label: 'Employee Management', href: '/employees', icon: UsersIcon },
  { id: 'supervisor-management', label: 'Supervisor Management', href: '/supervisors', icon: UserGroupIcon },
  { id: 'project-management', label: 'Project Management', href: '/projects', icon: FolderIcon },
  { id: 'timesheets', label: 'Time-sheets', href: '/timesheets', icon: DocumentTextIcon },
  { id: 'reports', label: 'Reports', href: '/reports', icon: ChartBarIcon },
  { id: 'settings', label: 'Settings', href: '/settings', icon: CogIcon }
];

const Sidebar: React.FC<SidebarProps> = ({ className = '', onItemClick }) => {
  const pathname = usePathname();

  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className={`bg-blue-800 dark:bg-gray-900 text-white dark:text-gray-200 h-screen w-64 flex flex-col fixed left-0 top-0 z-40 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-blue-700 dark:border-gray-700 flex-shrink-0">
        <h1 className="text-xl font-semibold">Timesheet Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.id} className="mx-4">
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 bg-opacity-80 dark:bg-gray-700'
                      : 'hover:bg-blue-700 hover:bg-opacity-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-700 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-blue-700 hover:bg-opacity-50 dark:hover:bg-gray-800"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
