// EmployeeHeader.tsx - Responsive Header Component
import React from "react";
import { PlusIcon, UsersIcon } from "@heroicons/react/24/outline";

interface EmployeeHeaderProps {
  onAdd: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ onAdd }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-3">
    <div className="flex items-center space-x-3">
      <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Employee Management</h1>
    </div>
    <button
      onClick={onAdd}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium w-full sm:w-auto"
    >
      <PlusIcon className="w-4 h-4" />
      <span>Add Employee</span>
    </button>
  </div>
);

export default EmployeeHeader;
