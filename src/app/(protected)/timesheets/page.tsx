'use client';
import { useState, useEffect } from 'react';
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import TimeSheetPage from "@/components/time-sheets/TimeSheetPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getSession } from "@/lib/api";

export default function DashboardPage() {
  const [userData, setUserData] = useState({
    name: 'Loading...',
    role: 'Loading...',
    initial: 'L'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getSession();
        
        if (data.user) {
          setUserData({
            name: data.user.name,
            role: '',
            initial: data.user.name.charAt(0).toUpperCase()
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData({
          name: 'User',
          role: '',
          initial: 'U'
        });
      }
    };

    fetchUserData();
  }, []);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-30">
          <Navbar
            title="Supervisors"
            userName={userData.name}
            userRole={userData.role}
            userInitial={userData.initial}
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <TimeSheetPage />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}