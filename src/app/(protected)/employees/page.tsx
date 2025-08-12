'use client';
import { useState, useEffect } from 'react';
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import Employee from "@/components/employees/employees"; // Replace with your actual employee component
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EmployeePage() {
  const [userData, setUserData] = useState({
    name: 'Loading...',
    role: 'Loading...',
    initial: 'L'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/session');
        const data = await response.json();
        
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
              title="Employee Management"
              userName={userData.name}
              userRole={userData.role}
              userInitial={userData.initial}
            />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Employee />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}