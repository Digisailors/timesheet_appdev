import React from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const DesignationSettings: React.FC = () => {
  const designations = [
    { name: 'Driver' },
    { name: 'Helper' },
    { name: 'Technician' },
    { name: 'Electrician' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Designations</h3>
          <p className="text-gray-500 text-sm">Manage employee designation names</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          <PlusIcon className="h-4 w-4" />
          Add Designation
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {designations.map((designation, index) => (
          <li key={index} className="flex items-center justify-between py-3">
            <span className="text-gray-800">{designation.name}</span>
            <div className="flex items-center gap-3">
              <button className="p-1 text-gray-500 hover:text-blue-600">
                <PencilIcon className="h-5 w-5" />
              </button>
              <button className="p-1 text-gray-500 hover:text-red-600">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesignationSettings;
