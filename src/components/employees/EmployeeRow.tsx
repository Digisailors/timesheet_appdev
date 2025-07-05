// EmployeeRow.tsx - Responsive Employee Row Component
import React from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  project: string;
  workHours: string;
  timeFrame: string;
  avatar: string;
  avatarBg: string;
}

interface EmployeeRowProps {
  employee: Employee;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({
  employee,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200 space-y-3 sm:space-y-0">
    <div className="flex items-center space-x-4 flex-1 min-w-0">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${employee.avatarBg} rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-medium text-xs sm:text-sm">{employee.avatar}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-1 truncate">{employee.name}</h4>
        <p className="text-xs sm:text-sm text-gray-500 mb-2 truncate">{employee.email}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            employee.designation === 'Regular' ? 'bg-blue-100 text-blue-800' :
            employee.designation === 'Rental' ? 'bg-orange-100 text-orange-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {employee.designation}
          </span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full font-medium">
            {employee.project}
          </span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 flex-shrink-0">
      <div className="text-left sm:text-right">
        <p className="font-semibold text-gray-900 text-sm">{employee.workHours}</p>
        <p className="text-xs text-gray-500">{employee.timeFrame}</p>
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onView(employee.id)}
          title="View Employee"
          className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(employee.id)}
          title="Edit Employee"
          className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 hover:border-green-300 transition-colors duration-200"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          title="Delete Employee"
          className="p-2 border border-red-300 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default EmployeeRow;
