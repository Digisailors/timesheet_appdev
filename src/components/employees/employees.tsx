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

interface RawEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  designation?: string;
  designationType?: string;
  specialization?: string;
  address?: string;
  phoneNumber?: string;
  experience?: string;
  dateOfJoining?: string;
}

interface Project {
  id: string;
  name: string;
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableDesignations, setAvailableDesignations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("All Designations Types");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedJobTitle, setSelectedJobTitle] = useState("All Job Titles");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const cleanBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [, setAvatarBgs] = useState<{ [key: string]: string }>({});

  const generateAvatarBg = (employeeId: string) => {
    const blueBg = "bg-blue-600";
    setAvatarBgs(prev => ({ ...prev, [employeeId]: blueBg }));
    return blueBg;
  };

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
    } catch {
      toast.error("Error fetching employee details");
      return null;
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${cleanBaseUrl}/projects/all`);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
      } else {
        setProjects([]);
      }
    } catch {
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
        const enrichedEmployees = result.data.map((emp: RawEmployee): Employee => {
          const fullName = `${emp.firstName} ${emp.lastName}`;
          return {
            ...emp,
            name: fullName,
            avatar: (emp.firstName[0] + emp.lastName[0]).toUpperCase(),
            avatarBg: generateAvatarBg(emp.id),
            project: emp.specialization || emp.designation || "",
            workHours: "",
            timeFrame: "",
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

        // Extract unique designations from API response
       const validDesignations = result.data
  .map((emp: RawEmployee) => emp.designation)
  .filter((designation: string | undefined): designation is string => 
    designation !== undefined && designation !== null && designation !== ""
  );
const uniqueDesignations: string[] = Array.from(new Set(validDesignations));
setAvailableDesignations(uniqueDesignations);
      } else {
        toast.error("Failed to fetch employees");
      }
    } catch {
      toast.error("Error fetching employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDesignation, selectedProject, selectedJobTitle]); // ✅ include job title in filters

  const filteredEmployees = employees.filter((employee) => {
    const matchesDesignation =
      selectedDesignation === "All Designations Types" || employee.designationType === selectedDesignation;

    const matchesSearch =
      searchTerm.trim() === "" ||
      employee.name.toLowerCase().includes(searchTerm.trim().toLowerCase());

    const matchesJobTitle =
      selectedJobTitle === "All Job Titles" || employee.designation === selectedJobTitle; // ✅ filter by designation field

    return matchesDesignation && matchesSearch && matchesJobTitle;
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const paginatedEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleView = (id: string) => {
    setSelectedEmployeeId(id);
    setIsProfileModalOpen(true);
  };

  const handleEdit = async (id: string) => {
    setIsLoading(true);
    try {
      const employee = await fetchEmployeeById(id);
      if (employee) {
        setEditingEmployee(employee);
        setIsAddModalOpen(true);
      }
    } catch {
      toast.error("Failed to load employee details for editing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const performDelete = async (id: string) => {
    setIsDeleting(true);
    
    // Create a minimum delay promise for better UX
    const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const deletePromise = fetch(`${cleanBaseUrl}/employees/delete/${id}`, {
        method: "DELETE",
      });
      
      // Wait for both the API call and minimum delay
      const [response] = await Promise.all([deletePromise, minDelay]);
      const result = await response.json();
      
      if (result.success) {
        toast.success("Employee deleted successfully!");
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      } else {
        toast.error("Delete failed: " + result.message);
      }
    } catch {
      toast.error("Error deleting employee.");
    } finally {
      setIsDeleting(false);
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
        ? `${cleanBaseUrl}/employees/update/${editingEmployee.id}`
        : `${cleanBaseUrl}/employees/create`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commonData),
      });

      const result = response.headers.get("content-type")?.includes("application/json")
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
          const updatedList = [enrichedEmp, ...filtered];
          
          // Update available designations
          const uniqueDesignations = [...new Set(updatedList.map(emp => emp.designation).filter(Boolean))];
          setAvailableDesignations(uniqueDesignations);
          
          return updatedList;
        });

        setIsAddModalOpen(false);
        setEditingEmployee(null);
      } else {
        toast.error("❌ Failed: " + (result?.message || "Unknown error"));
      }
    } catch {
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
    <div className="w-full h-full min-h-screen  mx-auto px-2 py-2">
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
            selectedJobTitle={selectedJobTitle}
            setSelectedJobTitle={setSelectedJobTitle}
            projects={projects}
            availableDesignations={availableDesignations}
            isLoadingProjects={isLoading}
            showSearchInput={true}
            showDesignationFilter={true}
            showProjectFilter={false}
          />
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Employees ({filteredEmployees.length})
            </h3>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading employees...</div>
            ) : paginatedEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No employees found matching your criteria.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedEmployees.map((employee) => (
                    <EmployeeRow
                      key={employee.id}
                      employee={employee}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <div className="flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border transition ${
                        currentPage === 1
                          ? "text-gray-400 border-gray-300 cursor-not-allowed"
                          : "text-black border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      &#8249;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-blue-500 text-white border-blue-500"
                            : "text-black border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border transition ${
                        currentPage === totalPages
                          ? "text-gray-400 border-gray-300 cursor-not-allowed"
                          : "text-black border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      &#8250;
                    </button>
                  </div>
                </div>
              </>
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
                disabled={isDeleting}
                className={`px-4 py-2 rounded transition flex items-center justify-center min-w-[100px] ${
                  isDeleting
                    ? "bg-red-400 text-white cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={isDeleting}
                className={`px-4 py-2 rounded transition ${
                  isDeleting
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
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