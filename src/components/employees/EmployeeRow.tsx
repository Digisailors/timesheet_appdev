/* eslint-disable */
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

  // 👇 Add this line
  designationType?: string;

  // Optional (if these exist too)
  phoneNumber?: string;
  address?: string;
  experience?: string;
  dateOfJoining?: string;
  employeeId?: string;
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
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-200 space-y-3 sm:space-y-0 bg-white dark:bg-gray-800">
    <div className="flex items-center space-x-4 flex-1 min-w-0">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${employee.avatarBg} rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-medium text-xs sm:text-sm">{employee.avatar}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base mb-1 truncate">{employee.name}</h4>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{employee.email}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            employee.designation === 'Regular' ? 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900' :
            employee.designation === 'Rental' ? 'bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900' :
            'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900'
          }`}>
            {employee.designation}
          </span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full font-medium">
            {employee.designationType}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 flex-shrink-0">
      <div className="text-left sm:text-right">
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{employee.workHours}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{employee.timeFrame}</p>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onView(employee.id)}
          title="View Employee"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-400 transition-colors duration-200"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(employee.id)}
          title="Edit Employee"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-green-400 transition-colors duration-200"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        {/* <button
          onClick={() => onDelete(employee.id)}
          title="Delete Employee"
          className="p-2 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:border-red-400 dark:hover:border-red-500 transition-colors duration-200"
        >
          <TrashIcon className="w-4 h-4" />
        </button> */}
      </div>
    </div>
  </div>
);

export default EmployeeRow;
