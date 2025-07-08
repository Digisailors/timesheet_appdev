import React from 'react';
import TimesheetTable from './TimesheetTable'; // ✅ Make sure this path is correct

const EmployeeReport = () => {
  return (
    <div className="mx-6 my-6 bg-white rounded-xl shadow-md p-6 space-y-6">
      {/* Header Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          {/* Employee Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Select Employee
            </label>
            <select className="border-2 border-gray-400 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="alice" className="text-gray-900 font-medium">Alice Williams</option>
              <option value="john" className="text-gray-900 font-medium">John Doe</option>
              <option value="sarah" className="text-gray-900 font-medium">Sarah Johnson</option>
              <option value="mike" className="text-gray-900 font-medium">Mike Chen</option>
            </select>
          </div>

          {/* Month Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Select Month
            </label>
            <select className="border-2 border-gray-400 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="january" className="text-gray-900 font-medium">January 2025</option>
              <option value="february" className="text-gray-900 font-medium">February 2025</option>
              <option value="march" className="text-gray-900 font-medium">March 2025</option>
              <option value="april" className="text-gray-900 font-medium">April 2025</option>
              <option value="may" className="text-gray-900 font-medium">May 2025</option>
              <option value="june" className="text-gray-900 font-medium">June 2025</option>
              <option value="july" className="text-gray-900 font-medium">July 2025</option>
              <option value="august" className="text-gray-900 font-medium">August 2025</option>
              <option value="september" className="text-gray-900 font-medium">September 2025</option>
              <option value="october" className="text-gray-900 font-medium">October 2025</option>
              <option value="november" className="text-gray-900 font-medium">November 2025</option>
              <option value="december" className="text-gray-900 font-medium">December 2025</option>
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-sm font-semibold text-black bg-white hover:bg-gray-200 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
  📊 Export Excel
</button>

          <button className="px-5 py-2.5 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Timesheet Table */}
      <TimesheetTable />
    </div>
  );
};

export default EmployeeReport;