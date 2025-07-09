import React from 'react';

const PoliciesSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Policies</h3>

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

      <div className="mt-6">
        <label className="flex items-center space-x-3 text-gray-700">
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 border-gray-300" defaultChecked />
          <span>Overtime Approval Required</span>
        </label>
      </div>

      <div className="mt-6 space-y-4">
        {[
          { label: "Travel Time Policy", placeholder: "Travel time is compensated..." },
          { label: "Attendance Policy", placeholder: "Employees must mark attendance..." },
          { label: "Overtime Policy", placeholder: "Overtime must be pre-approved..." },
          { label: "Leave Policy", placeholder: "Leave requests must be submitted..." },
        ].map((item) => (
          <div key={item.label}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              rows={2}
              placeholder={item.placeholder}
            ></textarea>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Company Policies
        </button>
      </div>
    </div>
  );
};

export default PoliciesSettings;
