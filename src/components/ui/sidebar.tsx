"use client";
// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
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
import { Plane } from 'lucide-react';
import ReactDOM from 'react-dom';
import { toast } from 'sonner';

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
  { id: 'vacations', label: 'Vacations', href: '/vacations', icon: Plane },
  { id: 'reports', label: 'Reports', href: '/reports', icon: ChartBarIcon },
  { id: 'settings', label: 'Settings', href: '/settings', icon: CogIcon }
];

const Sidebar: React.FC<SidebarProps> = ({ className = '', onItemClick }) => {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/login'
      });
      localStorage.removeItem('user');
      sessionStorage.clear();
      toast.success("Logout Successful", {
        style: {
          background: '#3b82f6',
          color: 'white',
          border: 'none',
        },
      });
      setTimeout(() => {
        setShowLogoutConfirm(false);
        setIsLoggingOut(false);
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Network error. Please try again.");
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Add blur effect to body when logout confirmation is shown
  useEffect(() => {
    if (showLogoutConfirm) {
      const blurOverlay = document.createElement('div');
      blurOverlay.id = 'blur-overlay';
      blurOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        backdrop-filter: blur(8px);
        background: rgba(0, 0, 0, 0.1);
        z-index: 999998;
        pointer-events: none;
      `;
      document.body.appendChild(blurOverlay);
      document.body.style.overflow = 'hidden';
    } else {
      const blurOverlay = document.getElementById('blur-overlay');
      if (blurOverlay) {
        blurOverlay.remove();
      }
      document.body.style.overflow = '';
    }
    return () => {
      const blurOverlay = document.getElementById('blur-overlay');
      if (blurOverlay) {
        blurOverlay.remove();
      }
      document.body.style.overflow = '';
    };
  }, [showLogoutConfirm]);

  return (
    <div className={`bg-blue-800 border-1 dark: border-r-gray-700 dark:bg-gray-900 text-white dark:text-gray-200 h-screen w-64 flex flex-col fixed left-0 top-0 z-40 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-blue-700 dark:border-gray-700 flex-shrink-0">
        <h1 className="text-2xl font-semibold">Timesheet Admin</h1>
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
          onClick={handleLogoutClick}
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-blue-700 hover:bg-opacity-50 dark:hover:bg-gray-800"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
      {/* Logout Confirmation Dialog rendered in a portal */}
      {showLogoutConfirm && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-[999999]">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirm Logout
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to logout? You will be redirected to the login page.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center min-w-[110px]"
                disabled={isLoggingOut}
              >
                {isLoggingOut && (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                )}
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Sidebar;
