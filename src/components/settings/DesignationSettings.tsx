import React from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Users2 } from 'lucide-react'; // Lucide icon import

const DesignationSettings: React.FC = () => {
  const designations = [
    { name: 'Regular' },
    { name: 'Driver' },
    { name: 'Rental' },
    { name: 'Coaster Driver' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users2 className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-900" />
          <h3 className="text-lg font-semibold text-neutral-900">Employee Designations</h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
          <PlusIcon className="h-4 w-4" />
          Add Designation
        </button>
      </div>

      <div className="space-y-0">
        {designations.map((designation, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-4 px-4 bg-gray-50 border border-gray-200 rounded-lg mb-4"
          >
            <span className="text-gray-800 font-medium">{designation.name}</span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                Active
              </span>
              <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded border border-gray-300">
                <PencilIcon className="h-4 w-4" />
              </button>
              <button className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded border border-red-300">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignationSettings;
