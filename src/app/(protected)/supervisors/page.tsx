
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import Supervisor from "@/components/supervisors/supervisors";


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-30">
          <Navbar title="Supervisors" userName="Admin User" userRole="Site Manager" userInitial="A" />
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <Supervisor />
        </div>
      </div>
    </div>
  );
}
