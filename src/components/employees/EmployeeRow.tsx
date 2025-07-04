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
  <div
    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
  >
    <div className="flex items-center space-x-4 flex-1">
      <div className={`w-12 h-12 ${employee.avatarBg} rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-medium text-sm">{employee.avatar}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-gray-900 text-sm mb-1">{employee.name}</h4>
        <p className="text-sm text-gray-500 mb-2">{employee.email}</p>
        <div className="flex items-center space-x-2">
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
    <div className="flex items-center space-x-6 flex-shrink-0">
      <div className="text-right">
        <p className="font-semibold text-gray-900 text-sm">{employee.workHours}</p>
        <p className="text-xs text-gray-500">{employee.timeFrame}</p>
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onView(employee.id)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 border border-gray-300 hover:border-blue-300"
          title="View Employee"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(employee.id)}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 border border-gray-300 hover:border-green-300"
          title="Edit Employee"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 border border-red-300 hover:border-red-400"
          title="Delete Employee"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default EmployeeRow;