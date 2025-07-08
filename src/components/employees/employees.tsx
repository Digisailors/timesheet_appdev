// Updated EmployeesPage.tsx - With Local Storage Persistence
"use client";

import React, { useState, useEffect } from "react";
import EmployeeHeader from "./EmployeeHeader";
import SearchBarRow from "./SearchBarRow";
import EmployeeRow, { Employee } from "./EmployeeRow";
import EmployeeProfileModal from "./EmployeeProfileModal";
import AddEmployeeModal from "./AddEmployeeModalProps";

// Define the interface for employee form data
interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  designationType: string;
  designation: string;
}

// Initial employees data
const initialEmployees: Employee[] = [
  {
    id: '1', name: 'John Smith', email: 'john.smith@company.com',
    designation: 'Regular', project: 'Driver',
    workHours: '168h', timeFrame: 'This month',
    avatar: 'JS', avatarBg: 'bg-blue-500'
  },
  {
    id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@company.com',
    designation: 'Rental', project: 'Plumber',
    workHours: '142h', timeFrame: 'This month',
    avatar: 'SW', avatarBg: 'bg-blue-600'
  },
  {
    id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com',
    designation: 'Rental', project: 'Factory Building',
    workHours: '156h', timeFrame: 'This month',
    avatar: 'MJ', avatarBg: 'bg-blue-700'
  },
  {
    id: '4', name: 'Lisa Chen', email: 'lisa.chen@company.com',
    designation: 'Coaster Driver', project: 'Office Complex',
    workHours: '134h', timeFrame: 'This month',
    avatar: 'LC', avatarBg: 'bg-blue-800'
  },
  {
    id: '5', name: 'David Brown', email: 'david.brown@company.com',
    designation: 'Regular', project: 'Highway Bridge',
    workHours: '178h', timeFrame: 'This month',
    avatar: 'DB', avatarBg: 'bg-blue-900'
  }
];

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("All Designations");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Load employees from localStorage on component mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      try {
        const parsedEmployees = JSON.parse(savedEmployees);
        setEmployees(parsedEmployees);
      } catch (error) {
        console.error('Error parsing employees from localStorage:', error);
        setEmployees(initialEmployees);
      }
    } else {
      // If no saved data, use initial employees
      setEmployees(initialEmployees);
    }
  }, []);

  // Save employees to localStorage whenever employees state changes
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('employees', JSON.stringify(employees));
    }
  }, [employees]);

  // Helper function to generate avatar initials
  const generateAvatar = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Helper function to generate random avatar background
  const generateAvatarBg = () => {
    const colors = [
      'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900',
      'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900',
      'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900',
      'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900',
      'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900',
      'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700', 'bg-indigo-800', 'bg-indigo-900'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesignation =
      selectedDesignation === "All Designations" || employee.designation === selectedDesignation;
    const matchesProject =
      selectedProject === "All Projects" || employee.project === selectedProject;

    return matchesSearch && matchesDesignation && matchesProject;
  });

  const handleView = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsProfileModalOpen(true);
    }
  };
  
  const handleEdit = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setEditingEmployee(employee);
      setIsAddModalOpen(true);
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };
  
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsAddModalOpen(true);
  };
  
  const handleAddEmployeeSubmit = (employeeData: EmployeeFormData) => {
    if (editingEmployee) {
      // Update existing employee
      const updatedEmployee: Employee = {
        id: editingEmployee.id,
        name: `${employeeData.firstName} ${employeeData.lastName}`,
        email: employeeData.email,
        designation: employeeData.designationType,
        project: employeeData.designation,
        workHours: editingEmployee.workHours, // Keep existing work hours
        timeFrame: editingEmployee.timeFrame, // Keep existing time frame
        avatar: generateAvatar(employeeData.firstName, employeeData.lastName),
        avatarBg: editingEmployee.avatarBg // Keep existing avatar background
      };
      
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id ? updatedEmployee : emp
      ));
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: Date.now().toString(), // Simple ID generation
        name: `${employeeData.firstName} ${employeeData.lastName}`,
        email: employeeData.email,
        designation: employeeData.designationType,
        project: employeeData.designation,
        workHours: '0h', // Default work hours for new employee
        timeFrame: 'This month',
        avatar: generateAvatar(employeeData.firstName, employeeData.lastName),
        avatarBg: generateAvatarBg()
      };
      
      setEmployees(prev => [...prev, newEmployee]);
    }
    setEditingEmployee(null);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-gray-50">
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
          />
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md">
          <div className="px-4 sm:px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Employees ({filteredEmployees.length})
            </h3>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
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

      {/* Add/Edit Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddEmployeeSubmit}
        editingEmployee={editingEmployee}
      />

      {/* Employee Profile Modal */}
      <EmployeeProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeesPage;