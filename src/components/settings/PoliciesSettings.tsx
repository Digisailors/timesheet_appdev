import React from 'react';
import { Shield } from 'lucide-react';

const PoliciesSettings: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Shield className="mr-2 h-5 w-5" />
        Company Policies
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Working Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Working Days per Week
          </label>
          <input
            type="number"
            defaultValue={6}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-2"
          />
        </div>

        {/* Max OT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Max Overtime Hours per Day
          </label>
          <input
            type="number"
            defaultValue={4}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-2"
          />
        </div>

        {/* Grace Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Late Arrival Grace Period (minutes)
          </label>
          <input
            type="number"
            defaultValue={15}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-2"
          />
        </div>

        {/* Break Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Break Duration (minutes)
          </label>
          <input
            type="number"
            defaultValue={60}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-2"
          />
        </div>

        {/* Rest Between Shifts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Minimum Rest Between Shifts (hours)
          </label>
          <input
            type="number"
            defaultValue={8}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-2"
          />
        </div>

        {/* Timesheet Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Timesheet Submission Deadline
          </label>
          <select
            defaultValue="End of Week"
            className="w-full h-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-2"
          >
            <option>End of Day</option>
            <option>End of Week</option>
            <option>End of Month</option>
          </select>
        </div>
      </div>

      {/* Overtime Toggle */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Overtime Approval Required
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Require supervisor approval for overtime hours
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Policy Boxes */}
      <div className="mt-10 space-y-6">
        {[
          {
            title: "Travel Time Policy",
            content:
              "Travel time is compensated at standard rate for all designated personnel.",
          },
          {
            title: "Attendance Policy",
            content:
              "Employees must mark attendance within 15 minutes of shift start time.",
          },
          {
            title: "Overtime Policy",
            content:
              "Overtime must be pre-approved by site supervisor and is paid at 1.5x standard rate.",
          },
          {
            title: "Leave Policy",
            content:
              "Leave requests must be submitted 48 hours in advance for approval.",
          },
        ].map((policy, index) => (
          <div key={index}>
            <div className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {policy.title}
            </div>
            <div className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-4 text-sm text-gray-800 dark:text-gray-200 dark:bg-gray-800 bg-white min-h-[80px]">
              {policy.content}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Company Policies
        </button>
      </div>
    </div>
  );
};

export default PoliciesSettings;
