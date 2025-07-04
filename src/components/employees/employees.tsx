"use client";

import React, { useState } from "react";
import EmployeeHeader from "./EmployeeHeader";
import SearchBarRow from "./SearchBarRow";
import EmployeeRow, { Employee } from "./EmployeeRow";
import AddEmployeeModal from "./AddEmployeeModalProps"; // Import the modal

const employees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    designation: 'Regular',
    project: 'Driver',
    workHours: '168h',
    timeFrame: 'This month',
    avatar: 'JS',
    avatarBg: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    designation: 'Rental',
    project: 'Plumber',
    workHours: '142h',
    timeFrame: 'This month',
    avatar: 'SW',
    avatarBg: 'bg-blue-600'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    designation: 'Rental',
    project: 'Factory Building',
    workHours: '156h',
    timeFrame: 'This month',
    avatar: 'MJ',
    avatarBg: 'bg-blue-700'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    designation: 'Coaster Driver',
    project: 'Office Complex',
    workHours: '134h',
    timeFrame: 'This month',
    avatar: 'LC',
    avatarBg: 'bg-blue-800'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@company.com',
    designation: 'Regular',
    project: 'Highway Bridge',
    workHours: '178h',
    timeFrame: 'This month',
    avatar: 'DB',
    avatarBg: 'bg-blue-900'
  }
];

const EmployeesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("All Designations");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    console.log("View employee:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit employee:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete employee:", id);
  };

  const handleAddEmployee = () => {
    setIsAddModalOpen(true); // Open the modal
  };

  const handleAddEmployeeSubmit = (employeeData: any) => {
    // Handle the new employee data here (e.g., add to list or send to API)
    console.log("New Employee:", employeeData);
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm w-full">
          <EmployeeHeader onAdd={handleAddEmployee} />
          <SearchBarRow
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDesignation={selectedDesignation}
            setSelectedDesignation={setSelectedDesignation}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-5">
              Employees ({filteredEmployees.length})
            </h3>
            <div className="space-y-3">
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
          </div>
        </div>
      </div>
      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEmployeeSubmit}
      />
    </div>
  );
};

export default EmployeesPage;