import React from "react";
import { PlusIcon, UsersIcon } from "@heroicons/react/24/outline";

interface EmployeeHeaderProps {
  onAdd: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ onAdd }) => (
  <div className="flex items-center justify-between px-6 py-6">
    <div className="flex items-center space-x-3">
      <UsersIcon className="w-6 h-6 text-blue-600" />
      <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
    </div>
    <button
      onClick={onAdd}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 font-medium"
    >
      <PlusIcon className="w-4 h-4" />
      <span>Add Employee</span>
    </button>
  </div>
);

export default EmployeeHeader;