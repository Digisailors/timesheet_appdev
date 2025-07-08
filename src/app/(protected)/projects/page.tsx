import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import ProjectsPage from "@/components/project_management/project";

export default function SupervisorPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Project" userName="Admin User" userRole="Site Manager" userInitial="A" />
        <ProjectsPage />
      </div>
    </div>
   
  );
}