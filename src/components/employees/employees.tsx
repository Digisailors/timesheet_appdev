"use client";

import React, { useState, useEffect } from "react";
import EmployeeHeader from "./EmployeeHeader";
import SearchBarRow from "./SearchBarRow";
import EmployeeRow, { Employee } from "./EmployeeRow";
import EmployeeProfileModal from "./EmployeeProfileModal";
import AddEmployeeModal from "./AddEmployeeModalProps";
import { toast } from "react-hot-toast";

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  designationType: string;
  designation: string;
  specialization?: string;
  address?: string;
  phoneNumber?: string;
  experience?: string;
  dateOfJoining?: string;
}

interface Project {
  id: string;
  name: string;
  // Add other project fields as needed
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("All Designations");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5088";
  const cleanBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [avatarBgs, setAvatarBgs] = useState<{ [key: string]: string }>({});

  const generateAvatarBg = (employeeId: string) => {
    const blueBg = "bg-blue-600"; // fixed blue
    setAvatarBgs(prev => ({ ...prev, [employeeId]: blueBg }));
    return blueBg;
  };

  // New function to fetch employee by ID
  const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
    try {
      const response = await fetch(`${cleanBaseUrl}/employees/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        const emp = result.data;
        const fullName = `${emp.firstName} ${emp.lastName}`;
        const enrichedEmployee: Employee = {
          ...emp,
          name: fullName,
          avatar: (emp.firstName[0] + emp.lastName[0]).toUpperCase(),
          avatarBg: generateAvatarBg(emp.id),
          project: emp.specialization || emp.designation,
          workHours: "160h",
          timeFrame: "This month",
          designation: emp.designation || "",
          designationType: emp.designationType || "",
          phoneNumber: emp.phoneNumber || "+0000000000",
          email: emp.email || "",
          address: emp.address || "Some Address",
          experience: emp.experience || "0 years",
          dateOfJoining: emp.dateOfJoining || new Date().toISOString().split('T')[0],
          specialization: emp.specialization || emp.designation || "",
        };
        return enrichedEmployee;
      } else {
        toast.error("Failed to fetch employee details");
        return null;
      }
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
      toast.error("Error fetching employee details");
      return null;
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${cleanBaseUrl}/projects/all`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
      } else {
        console.warn("Projects API returned unexpected format:", result);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
      setProjects([]);
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${cleanBaseUrl}/employees/all`);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const enrichedEmployees = result.data.map((emp: any): Employee => {
          const fullName = `${emp.firstName} ${emp.lastName}`;
          return {
            ...emp,
            name: fullName,
            avatar: (emp.firstName[0] + emp.lastName[0]).toUpperCase(),
            avatarBg: generateAvatarBg(emp.id),
            project: emp.specialization || emp.designation,
            workHours: "160h",
            timeFrame: "This month",
            designation: emp.designation || "",
            designationType: emp.designationType || "",
            phoneNumber: emp.phoneNumber || "+0000000000",
            email: emp.email || "",
            address: emp.address || "Some Address",
            experience: emp.experience || "0 years",
            dateOfJoining: emp.dateOfJoining || new Date().toISOString().split('T')[0],
            specialization: emp.specialization || emp.designation || "",
          };
        });

        setEmployees(enrichedEmployees);
      } else {
        toast.error("Failed to fetch employees");
      }
    } catch (error) {
      toast.error("Error fetching employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDesignation =
      selectedDesignation === "All Designations" || employee.designation === selectedDesignation;

    const matchesProject =
      selectedProject === "All Projects" || employee.project === selectedProject;

    return matchesSearch && matchesDesignation && matchesProject;
  });

  // Updated handleView function to use employeeId
  const handleView = (id: string) => {
    setSelectedEmployeeId(id);
    setIsProfileModalOpen(true);
  };

  // Updated handleEdit function to fetch by ID
  const handleEdit = async (id: string) => {
    setIsLoading(true);
    try {
      const employee = await fetchEmployeeById(id);
      if (employee) {
        setEditingEmployee(employee);
        setIsAddModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to load employee details for editing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id); // Open confirmation modal
  };

  const performDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${cleanBaseUrl}/employees/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Employee deleted successfully!");
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      } else {
        toast.error("Delete failed: " + result.message);
      }
    } catch (error) {
      toast.error("Error deleting employee.");
    } finally {
      setIsLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsAddModalOpen(true);
  };

  const handleAddEmployeeSubmit = async (employeeData: EmployeeFormData) => {
    setIsLoading(true);
    try {
      const commonData = {
        ...employeeData,
        specialization: employeeData.specialization || employeeData.designation,
        address: employeeData.address || "Some Address",
        phoneNumber: employeeData.phoneNumber || "+0000000000",
        experience: employeeData.experience || "0 years",
        dateOfJoining: employeeData.dateOfJoining || new Date().toISOString().split("T")[0],
      };

      const isEdit = !!editingEmployee;
      const endpoint = isEdit
        ? `${cleanBaseUrl}/employees/${editingEmployee.id}`
        : `${cleanBaseUrl}/employees/create`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commonData),
      });

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (response.ok && result?.success && result.data) {
        toast.success(`Employee ${isEdit ? "updated" : "added"} successfully!`);

        const newEmp = result.data;

        const enrichedEmp: Employee = {
          ...newEmp,
          name: `${newEmp.firstName} ${newEmp.lastName}`,
          avatar: (newEmp.firstName[0] + newEmp.lastName[0]).toUpperCase(),
          avatarBg: generateAvatarBg(newEmp.id),
          project: newEmp.specialization || newEmp.designation,
          workHours: "160h",
          timeFrame: "This month",
          designation: newEmp.designation || "",
          designationType: newEmp.designationType || "",
          phoneNumber: newEmp.phoneNumber || "+0000000000",
          email: newEmp.email || "",
          address: newEmp.address || "Some Address",
          experience: newEmp.experience || "0 years",
          dateOfJoining: newEmp.dateOfJoining || new Date().toISOString().split("T")[0],
          specialization: newEmp.specialization || newEmp.designation || "",
        };

        setEmployees((prev) => {
          const filtered = prev.filter((emp) => emp.id !== enrichedEmp.id);
          return isEdit ? [...filtered, enrichedEmp] : [enrichedEmp, ...prev];
        });

        setIsAddModalOpen(false);
        setEditingEmployee(null);
      } else {
        toast.error("❌ Failed: " + (result?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Something went wrong while submitting.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="w-full h-full min-h-screen max-w-7xl mx-auto px-2 py-2">
      <div className="px-4 sm:px-6 py-4">
        <EmployeeHeader onAdd={handleAddEmployee} />

        <div className="mt-3">
          <SearchBarRow
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDesignation={selectedDesignation}
            setSelectedDesignation={setSelectedDesignation}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            projects={projects} // Pass projects to SearchBarRow
          />
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Employees ({filteredEmployees.length})
            </h3>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Loading employees...
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No employees found matching your criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddEmployeeSubmit}
        editingEmployee={editingEmployee}
      />

      <EmployeeProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedEmployeeId(null);
        }}
        employeeId={selectedEmployeeId}
      />

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 dark:bg-black/50"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6 rounded-xl shadow-2xl border dark:border-gray-700 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-base font-semibold mb-4">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => confirmDeleteId && performDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;