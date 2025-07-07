import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import Dashboard from "@/components/dashboard/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Dashboard" userName="Admin User" userInitial="A" />
        <Dashboard />
      </div>
    </div>
  );
}