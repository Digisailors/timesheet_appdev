import React, { useState } from 'react';
import { Settings } from 'lucide-react'; // ✅ Import the correct icon

const SystemSettings: React.FC = () => {
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [dailyReport, setDailyReport] = useState(true);
  const [overtimeAlert, setOvertimeAlert] = useState(true);
  const [lockPeriod, setLockPeriod] = useState(3);
  const [defaultHours, setDefaultHours] = useState(8);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full">
      <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-2">
        <Settings className="w-6 h-6 text-gray-900" /> {/* ✅ Replaced icon */}
        System Configuration
      </h3>

      <div className="space-y-10">
        {/* Notification Settings */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-6">Notification Settings</h4>

          {/* Auto Submit Reminders */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="font-semibold text-base">Auto Submit Reminders</div>
              <p className="text-gray-500 text-sm">Send reminders for missing timesheet entries</p>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={autoSubmit}
                onChange={() => setAutoSubmit(!autoSubmit)}
                className="sr-only"
              />
              <div
                onClick={() => setAutoSubmit(!autoSubmit)}
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors flex items-center ${
                  autoSubmit ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    autoSubmit ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Daily Report Emails */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="font-semibold text-base">Daily Report Emails</div>
              <p className="text-gray-500 text-sm">Send daily summary reports to administrators</p>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={dailyReport}
                onChange={() => setDailyReport(!dailyReport)}
                className="sr-only"
              />
              <div
                onClick={() => setDailyReport(!dailyReport)}
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors flex items-center ${
                  dailyReport ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    dailyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Overtime Alerts */}
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-base">Overtime Alerts</div>
              <p className="text-gray-500 text-sm">Alert when employees log overtime hours</p>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={overtimeAlert}
                onChange={() => setOvertimeAlert(!overtimeAlert)}
                className="sr-only"
              />
              <div
                onClick={() => setOvertimeAlert(!overtimeAlert)}
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors flex items-center ${
                  overtimeAlert ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    overtimeAlert ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-6">General Settings</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Timesheet Lock Period (days)</label>
              <input
                type="number"
                value={lockPeriod}
                onChange={(e) => setLockPeriod(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">Days after which timesheets cannot be edited</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Default Working Hours</label>
              <input
                type="number"
                value={defaultHours}
                onChange={(e) => setDefaultHours(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 text-right">
          <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
