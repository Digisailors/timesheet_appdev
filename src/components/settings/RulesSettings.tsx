import React from 'react';
import { Edit, Trash2, Calculator } from 'lucide-react';

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

const RulesSettings = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6 text-gray-700 dark:text-white" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Designation-wise Timing Rules
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Configure working hours, overtime rates, and travel policies for each designation
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-2">
          + Add Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 items-start"
          >
            {/* Left: Title + Standard Time */}
            <div className="col-span-2">
              <h4 className="font-semibold text-gray-800 dark:text-white">{rule.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Standard: {rule.standardHours} | OT after: {rule.overtimeAfter}
              </p>
            </div>

            {/* Right: Edit/Delete Icons */}
            <div className="flex justify-end items-start space-x-2">
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <Edit className="h-4 w-4 text-gray-700 dark:text-white" />
              </button>
              <button className="p-2 border border-red-200 dark:border-red-500 rounded hover:bg-red-100 dark:hover:bg-red-600/20">
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>

            {/* Bottom Center: Rates */}
            <div className="col-span-3 flex justify-center mt-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="mr-4">
                Overtime Rate: <span className="font-semibold">{rule.overtimeRate}</span>
              </span>
              <span className="mr-4">
                Break Time: <span className="font-semibold">{rule.breakTime}</span>
              </span>
              <span>
                Travel Rate: <span className="font-semibold">{rule.travelRate}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulesSettings;
