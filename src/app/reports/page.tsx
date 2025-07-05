"use client";

import ReportsPage from "@/components/reports/reports"; // ✅ Check path, spelling & case
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function Reports() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Reports" userName="Admin User" userInitial="A" />
        <ReportsPage /> {/* ✅ This must match the import name exactly */}
      </div>
    </div>
  );
}
