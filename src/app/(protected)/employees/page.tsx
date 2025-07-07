import EmployeesPage from "@/components/employees/employees";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function Employee() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Employees" userName="Admin User" userInitial="A" />
        <EmployeesPage />
      </div>
    </div>
  );
}