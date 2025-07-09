import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const rules = [
  {
    title: 'Regular',
    standardHours: '8h',
    overtimeAfter: '8h',
    overtimeRate: '1.5x',
    breakTime: '1h',
    travelRate: '1x',
  },
  {
    title: 'Driver',
    standardHours: '8h',
    overtimeAfter: '8h',
    overtimeRate: '1.5x',
    breakTime: '1h',
    travelRate: '1.2x',
  },
  {
    title: 'Rental',
    standardHours: '8h',
    overtimeAfter: '10h',
    overtimeRate: '2x',
    breakTime: '0.5h',
    travelRate: '1.5x',
  },
  {
    title: 'Coaster Driver',
    standardHours: '8h',
    overtimeAfter: '8h',
    overtimeRate: '1.5x',
    breakTime: '1h',
    travelRate: '1.3x',
  },
];

const RulesSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Designation-wise Timing Rules</h3>
          <p className="text-gray-500 text-sm">Configure working hours, overtime rates, and travel policies for each designation</p>
        </div>
        <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
          + Add Rule
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={index} className="flex justify-between items-start bg-gray-50 p-4 rounded-lg border">
            <div>
              <h4 className="font-semibold text-gray-800">{rule.title}</h4>
              <p className="text-sm text-gray-600">Standard: {rule.standardHours} | OT after: {rule.overtimeAfter}</p>
            </div>
            <div className="text-sm text-gray-700 space-x-4">
              <span>Overtime Rate: {rule.overtimeRate}</span>
              <span>Break Time: {rule.breakTime}</span>
              <span>Travel Rate: {rule.travelRate}</span>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 rounded hover:bg-gray-100">
                <PencilIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-1 rounded hover:bg-red-100">
                <TrashIcon className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulesSettings;
