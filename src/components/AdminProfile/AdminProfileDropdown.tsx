"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';
// import Toast from './Toast';
import ProfileModal from './ProfileModal';
import { toast } from 'sonner';
import ReactDOM from 'react-dom';

interface AdminProfileDropdownProps {
  trigger: ReactNode;
}

const AdminProfileDropdown: React.FC<AdminProfileDropdownProps> = ({ trigger }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Add blur effect to body when logout confirmation is shown
  useEffect(() => {
    if (showLogoutConfirm) {
      // Create a blur overlay that covers everything except the modal
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
      // Remove blur overlay
      const blurOverlay = document.getElementById('blur-overlay');
      if (blurOverlay) {
        blurOverlay.remove();
      }
      document.body.style.overflow = '';
    }

    return () => {
      // Cleanup: remove blur overlay
      const blurOverlay = document.getElementById('blur-overlay');
      if (blurOverlay) {
        blurOverlay.remove();
      }
      document.body.style.overflow = '';
    };
  }, [showLogoutConfirm]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsDropdownOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      // Use NextAuth signOut
      await signOut({ 
        redirect: false,
        callbackUrl: '/login'
      });
      
      // Clear any local storage or session data if needed
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Show success toast with blue background
      toast.success("Logout Successful", {
        style: {
          background: '#3b82f6',
          color: 'white',
          border: 'none',
        },
      });
      
      // Keep modal open for 2 seconds to show the loading state and toast
      setTimeout(() => {
        setShowLogoutConfirm(false);
        setIsLoggingOut(false);
        // Redirect to login page
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
            onClick={handleLogoutClick}
            className="flex items-center w-full p-3 mx-1.5 mb-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <LogOut className="w-4.5 h-4.5 mr-3" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {/* Logout Confirmation Dialog rendered in a portal */}
      {showLogoutConfirm && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-[999999]">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <LogOut className="w-6 h-6 text-red-500 mr-3" />
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

export default AdminProfileDropdown;