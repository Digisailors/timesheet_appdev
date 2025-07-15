"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Toast from './Toast';
import ProfileModal from './ProfileModal';

interface AdminProfileDropdownProps {
  trigger: ReactNode;
}

const AdminProfileDropdown: React.FC<AdminProfileDropdownProps> = ({ trigger }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutToast(true);
    setIsDropdownOpen(false);
  };

 const handleThemeChange = (newTheme: 'light' | 'dark') => {
  setTheme(newTheme); // This will change the theme for the entire application
};

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {trigger}
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 backdrop-blur-md">
          {/* Profile */}
          <div
            onClick={() => {
              setShowProfile(true);
              setIsDropdownOpen(false);
            }}
            className="flex items-center p-3 mx-1.5 mt-1.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <User className="w-4.5 h-4.5 mr-3 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile</span>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-3 mx-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200">
            <div className="flex items-center">
              {theme === 'dark' ? (
                <Moon className="w-4.5 h-4.5 mr-3 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-4.5 h-4.5 mr-3 text-gray-700 dark:text-gray-300" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-500'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-500'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 mx-1.5 mb-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <LogOut className="w-4.5 h-4.5 mr-3" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {/* Logout Toast */}
      {showLogoutToast && (
        <Toast
          message="Are you sure you want to logout?"
          onClose={() => setShowLogoutToast(false)}
          onConfirm={() => {
            setShowLogoutToast(false);
            console.log('User logged out');
          }}
        />
      )}
    </div>
  );
};

export default AdminProfileDropdown;