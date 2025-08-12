import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

// Define a type for the autoTable options
interface AutoTableOptions {
  head: Array<Array<string>>;
  body: Array<Array<string>>;
  startY: number;
}

// Extend the jsPDF type to include autoTable with a specific type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface Timesheet {
  id: string;
  timesheetDate: string;
  onsiteSignIn: string;
  onsiteSignOut: string;
  normalHrs: string;
  overtime: string;
  location: string;
  remarks: string;
  totalTravelHrs: string;
  employees?: Array<{ id: string }>;
}

const EmployeeReport: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          const fetchedEmployees = result.data.map((employee: Employee) => ({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
          }));
          setEmployees(fetchedEmployees);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTimesheets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          setTimesheets(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch timesheets');
        console.error('Error fetching timesheets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    fetchTimesheets();
  }, []);

  const filteredTimesheets = timesheets.filter((timesheet) => {
    const timesheetDate = new Date(timesheet.timesheetDate);
    const isSameMonth = selectedMonth
      ? timesheetDate.getMonth() === selectedMonth.getMonth() &&
        timesheetDate.getFullYear() === selectedMonth.getFullYear()
      : true;
    const isSameEmployee = selectedEmployee
      ? timesheet.employees && timesheet.employees.some(emp => emp.id === selectedEmployee)
      : false;
    return isSameMonth && isSameEmployee;
  });

  const calculateTotalHours = (filteredTimesheets: Timesheet[]) => {
    let regularHours = 0;
    let overtimeHours = 0;
    const daysWorked = filteredTimesheets.length;
    filteredTimesheets.forEach((timesheet) => {
      regularHours += parseFloat(timesheet.normalHrs);
      overtimeHours += parseFloat(timesheet.overtime);
    });
    return { regularHours, overtimeHours, daysWorked };
  };

  const { regularHours, overtimeHours, daysWorked } = calculateTotalHours(filteredTimesheets);

  const exportToExcel = () => {
    if (filteredTimesheets.length === 0) {
      toast('No data to export', {
        style: {
          borderRadius: '10px',
          background: 'blue',
          color: '#fff',
        },
      });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(filteredTimesheets.map(timesheet => ({
      Date: timesheet.timesheetDate,
      Location: timesheet.location,
      'Check-In': timesheet.onsiteSignIn,
      'Check-Out': timesheet.onsiteSignOut,
      'Regular Hours': timesheet.normalHrs,
      'OT Hours': timesheet.overtime,
      'Travel Time': timesheet.totalTravelHrs,
      Remarks: timesheet.remarks,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheets");
    XLSX.writeFile(workbook, "Timesheets.xlsx");
  };

  const exportToPDF = () => {
    if (filteredTimesheets.length === 0) {
      toast('No data to export', {
        style: {
          borderRadius: '10px',
          background: 'blue',
          color: '#fff',
        },
      });
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.text('Employee Timesheet Report', 14, 16);

    // Define table data
    const tableData = filteredTimesheets.map(timesheet => [
      timesheet.timesheetDate,
      timesheet.location,
      timesheet.onsiteSignIn,
      timesheet.onsiteSignOut,
      timesheet.normalHrs,
      timesheet.overtime,
      timesheet.totalTravelHrs,
      timesheet.remarks,
    ]);

    // Use autoTable with the defined options type
    const autoTableOptions: AutoTableOptions = {
      head: [['Date', 'Location', 'Check-In', 'Check-Out', 'Regular Hours', 'OT Hours', 'Travel Time', 'Remarks']],
      body: tableData,
      startY: 20,
    };

    doc.autoTable(autoTableOptions);

    // Save the PDF
    doc.save('Timesheets.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employee-Wise Report</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                disabled={loading}
              >
                <option value="">Select Employee</option>
                {loading ? (
                  <option value="">Loading employees...</option>
                ) : error ? (
                  <option value="">Error loading employees</option>
                ) : (
                  employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Month</label>
              <DatePicker
                selected={selectedMonth}
                onChange={(date: Date | null) => setSelectedMonth(date)}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {selectedEmployee ? `${employees.find(emp => emp.id === selectedEmployee)?.firstName || ''} ${employees.find(emp => emp.id === selectedEmployee)?.lastName || ''} Report` : 'Select an Employee'}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-100 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText size={16} />
                Export Excel
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Regular Hours</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{selectedEmployee ? regularHours : 'N/A'}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Overtime Hours</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-300">{selectedEmployee ? overtimeHours : 'N/A'}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Days Worked</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">{selectedEmployee ? daysWorked : 'N/A'}</p>
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
                {selectedEmployee ? (
                  filteredTimesheets.length > 0 ? (
                    filteredTimesheets.map((timesheet) => (
                      <tr key={timesheet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.timesheetDate}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.location}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignIn}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignOut}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.normalHrs}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.overtime}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.totalTravelHrs}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-4">No Data Found</td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">Please select an employee to view data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReport;
