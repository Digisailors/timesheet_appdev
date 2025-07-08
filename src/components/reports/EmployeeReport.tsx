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

  // Mock data - replace with your actual data
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

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee-Wise Report for Construction Phase 1</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
              <select 
                value={selectedEmployee}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
              <select 
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Alice Williams Report</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
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
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Regular Hours</p>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Overtime Hours</p>
              <p className="text-3xl font-bold text-orange-600">0</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Days Worked</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Check-In</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Check-Out</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Regular Hours</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">OT Hours</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Travel Time</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">5/18/2025</td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">Downtown Office</td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">07:15</td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">15:30</td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">8</td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">0</td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">00:30</td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900"></td>
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