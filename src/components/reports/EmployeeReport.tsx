import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
}

interface Month {
  value: string;
  label: string;
}

const EmployeeReport: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('EMP004');
  const [selectedMonth, setSelectedMonth] = useState<string>('05');

  const employees: Employee[] = [
    { id: 'EMP004', name: 'Alice Williams (EMP004)' },
    { id: 'EMP001', name: 'John Doe (EMP001)' },
    { id: 'EMP002', name: 'Jane Smith (EMP002)' },
    { id: 'EMP003', name: 'Bob Johnson (EMP003)' },
  ];

  const months: Month[] = [
    { value: '01', label: 'January 2025' },
    { value: '02', label: 'February 2025' },
    { value: '03', label: 'March 2025' },
    { value: '04', label: 'April 2025' },
    { value: '05', label: 'May 2025' },
    { value: '06', label: 'June 2025' },
    { value: '07', label: 'July 2025' },
    { value: '08', label: 'August 2025' },
    { value: '09', label: 'September 2025' },
    { value: '10', label: 'October 2025' },
    { value: '11', label: 'November 2025' },
    { value: '12', label: 'December 2025' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employee-Wise Report for Construction Phase 1</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Employee</label>
              <select 
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Month</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Alice Williams Report</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-100 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <FileText size={16} />
                Export Excel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Regular Hours</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">0</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Overtime Hours</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-300">0</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Days Worked</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">0</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  {['Date', 'Location', 'Check-In', 'Check-Out', 'Regular Hours', 'OT Hours', 'Travel Time', 'Remarks'].map((header) => (
                    <th
                      key={header}
                      className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">5/18/2025</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">Downtown Office</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">07:15</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">15:30</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">8</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">0</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">00:30</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReport;
