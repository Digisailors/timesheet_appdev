import React, { useState } from 'react';

const SystemSettings: React.FC = () => {
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [dailyReport, setDailyReport] = useState(true);
  const [overtimeAlert, setOvertimeAlert] = useState(true);
  const [lockPeriod, setLockPeriod] = useState(3);
  const [defaultHours, setDefaultHours] = useState(8);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        ⚙️ System Configuration
      </h3>

      <div className="space-y-6">
        {/* Notification Settings */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-2">Notification Settings</h4>

          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium">Auto Submit Reminders</div>
              <p className="text-gray-500 text-sm">Send reminders for missing timesheet entries</p>
            </div>
            <input type="checkbox" checked={autoSubmit} onChange={() => setAutoSubmit(!autoSubmit)} className="toggle-checkbox" />
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium">Daily Report Emails</div>
              <p className="text-gray-500 text-sm">Send daily summary reports to administrators</p>
            </div>
            <input type="checkbox" checked={dailyReport} onChange={() => setDailyReport(!dailyReport)} className="toggle-checkbox" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Overtime Alerts</div>
              <p className="text-gray-500 text-sm">Alert when employees log overtime hours</p>
            </div>
            <input type="checkbox" checked={overtimeAlert} onChange={() => setOvertimeAlert(!overtimeAlert)} className="toggle-checkbox" />
          </div>
        </div>

      {/* General Settings */}
<div className="grid grid-cols-2 gap-4 mt-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Timesheet Lock Period (days)</label>
    <input
      type="number"
      value={lockPeriod}
      onChange={(e) => setLockPeriod(Number(e.target.value))}
      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p className="text-sm text-gray-500 mt-1">Days after which timesheets cannot be edited</p>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Default Working Hours</label>
    <input
      type="number"
      value={defaultHours}
      onChange={(e) => setDefaultHours(Number(e.target.value))}
      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>

        {/* Save Button */}
        <div className="pt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
