import React from 'react';
import { Shield } from 'lucide-react';

const PoliciesSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Shield className="mr-2 h-5 w-5" />
        Company Policies
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Working Days per Week</label>
          <input type="number" defaultValue={6} className="w-full h-10 border border-gray-300 rounded px-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Overtime Hours per Day</label>
          <input type="number" defaultValue={4} className="w-full h-10 border border-gray-300 rounded px-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Late Arrival Grace Period (minutes)</label>
          <input type="number" defaultValue={15} className="w-full h-10 border border-gray-300 rounded px-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (minutes)</label>
          <input type="number" defaultValue={60} className="w-full h-10 border border-gray-300 rounded px-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rest Between Shifts (hours)</label>
          <input type="number" defaultValue={8} className="w-full h-10 border border-gray-300 rounded px-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timesheet Submission Deadline</label>
          <select defaultValue="End of Week" className="w-full h-10 border border-gray-300 rounded px-2 text-black">
            <option>End of Day</option>
            <option>End of Week</option>
            <option>End of Month</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">Overtime Approval Required</div>
            <div className="text-xs text-gray-500">Require supervisor approval for overtime hours</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <div>
          <div className="text-base font-semibold text-gray-900 mb-2">Travel Time Policy</div>
          <div className="w-full border border-gray-300 rounded-md p-4 text-sm text-gray-800 bg-white min-h-[80px]">
            Travel time is compensated at standard rate for all designated personnel.
          </div>
        </div>

        <div>
          <div className="text-base font-semibold text-gray-900 mb-2">Attendance Policy</div>
          <div className="w-full border border-gray-300 rounded-md p-4 text-sm text-gray-800 bg-white min-h-[80px]">
            Employees must mark attendance within 15 minutes of shift start time.
          </div>
        </div>

        <div>
          <div className="text-base font-semibold text-gray-900 mb-2">Overtime Policy</div>
          <div className="w-full border border-gray-300 rounded-md p-4 text-sm text-gray-800 bg-white min-h-[80px]">
            Overtime must be pre-approved by site supervisor and is paid at 1.5x standard rate.
          </div>
        </div>

        <div>
          <div className="text-base font-semibold text-gray-900 mb-2">Leave Policy</div>
          <div className="w-full border border-gray-300 rounded-md p-4 text-sm text-gray-800 bg-white min-h-[80px]">
            Leave requests must be submitted 48 hours in advance for approval.
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Company Policies
        </button>
      </div>
    </div>
  );
};

export default PoliciesSettings;
