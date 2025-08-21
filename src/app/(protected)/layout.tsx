'use client';
import { useState, useEffect } from 'react';
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import { getSession } from "next-auth/react";
import { PageTitleProvider, usePageTitle } from "@/contexts/PageTitleContext";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

interface UserData {
  name: string;
  role: string;
  initial: string;
}

function ProtectedLayoutContent({ children }: ProtectedLayoutProps) {
  const [userData, setUserData] = useState<UserData>({
    name: 'Loading...',
    role: 'Loading...',
    initial: 'L'
  });
  const { title } = usePageTitle();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await getSession();

        if (session?.user) {
          const name = session.user.name || 'User';
          setUserData({
            name: name,
            role: '', // You can set this based on your needs
            initial: name.charAt(0).toUpperCase()
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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      {/* Fixed Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-30">
          <Navbar
            title={title}
            userName={userData.name}
            userRole={userData.role}
            userInitial={userData.initial}
          />
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <PageTitleProvider>
      <ProtectedLayoutContent>
        {children}
      </ProtectedLayoutContent>
    </PageTitleProvider>
  );
}
