"use client";

import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import ReportsPage from "@/components/reports/reports";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
          <Navbar
            title="Reports"
            userName="Admin User"
            userRole="Site Manager"
            userInitial="A"
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <ReportsPage />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
