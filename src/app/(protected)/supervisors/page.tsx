import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import Supervisor from "@/components/supervisors/supervisors";

export default function SupervisorPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="supervisors" userName="Admin User" userRole="Site Manager" userInitial="A" />
        <Supervisor />
      </div>
    </div>
  );
}