// components/ui/admin-layout.tsx
"use client";

import React from 'react';
import Sidebar from './sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex min-h-screen bg-gray-100 ${className}`}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;