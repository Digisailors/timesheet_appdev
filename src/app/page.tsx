import Sidebar from "@/components/ui/sidebar";
import Dashboard from "@/components/ui/dashboard"; // <-- Add this line


export default function Page() {
  return (
   <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <Dashboard />
    </div>
  );
}