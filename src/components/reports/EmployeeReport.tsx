/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface Project {
  id: string;
  name: string;
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
  onsiteTravelStart: string;
  onsiteTravelEnd: string;
  offsiteTravelStart: string;
  offsiteTravelEnd: string;
  supervisorName: string;
  typeofWork: string;
  projectcode: string;
  employees?: Array<{ id: string }>;
  project?: Project;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  employeeName: {
    fontSize: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold',
    paddingVertical: 3,
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 2,
    width: '6.25%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 8,
  },
  headerCell: {
    padding: 2,
    width: '6.25%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

const MyDocument = ({ data, selectedEmployees, employees }: {
  data: Timesheet[];
  selectedEmployees: string[];
  employees: Employee[];
}) => (
  <Document>
    <Page style={styles.page} size="A4">
      <Text style={styles.title}>Employee Timesheet Report</Text>
      <Text style={styles.employeeName}>
        Employees: {selectedEmployees.map(id => {
          const employee = employees.find(emp => emp.id === id);
          return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
        }).join(', ')}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          {[
            'Employee', 'Date', 'Location', 'Check-In', 'Check-Out', 'Regular Hours', 'OT Hours', 'Travel Time', 'Remarks',
            'Onsite Travel Start', 'Onsite Travel End', 'Offsite Travel Start', 'Offsite Travel End',
            'Supervisor', 'Work Type', 'Project Code'
          ].map((header) => (
            <Text key={header} style={[styles.headerCell, { width: '6.25%' }]}>{header}</Text>
          ))}
        </View>
        {data.map((timesheet, index) => {
          const timesheetEmployeeIds = timesheet.employees?.map(emp => emp.id) || [];
          const associatedEmployees = selectedEmployees.filter(empId => timesheetEmployeeIds.includes(empId));

          if (associatedEmployees.length > 1) {
            return associatedEmployees.map((empId, empIndex) => {
              const employee = employees.find(emp => emp.id === empId);
              const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';

              return (
                <View key={`${index}-${empIndex}`} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{employeeName}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.timesheetDate}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.location}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.onsiteSignIn}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.onsiteSignOut}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.normalHrs}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.overtime}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.totalTravelHrs}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.remarks}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.onsiteTravelStart}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.onsiteTravelEnd}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.offsiteTravelStart}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.offsiteTravelEnd}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.supervisorName}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.typeofWork}</Text>
                  <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.projectcode}</Text>
                </View>
              );
            });
          } else {
            const empId = associatedEmployees[0] || selectedEmployees[0];
            const employee = employees.find(emp => emp.id === empId);
            const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';

            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{employeeName}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.timesheetDate}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.location}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.onsiteSignIn}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.onsiteSignOut}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.normalHrs}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.overtime}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.totalTravelHrs}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.remarks}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.onsiteTravelStart}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.onsiteTravelEnd}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.offsiteTravelStart}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.offsiteTravelEnd}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.supervisorName}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.typeofWork}</Text>
                <Text style={[styles.tableCell, { width: '6.25%' }]}>{timesheet.projectcode}</Text>
              </View>
            );
          }
        }).flat()}
      </View>
    </Page>
  </Document>
);

const EmployeeReport: React.FC = () => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
  });
  const [showDatePickers, setShowDatePickers] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.employee-dropdown')) {
        setShowEmployeeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/all`,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }
        );
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
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all`,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          setTimesheets(result.data);
          const uniqueProjects = Array.from(
            new Map(
              result.data
                .filter((ts: Timesheet) => ts.project)
                .map((ts: Timesheet) => [ts.project!.id, ts.project!])
            ).values()
          ) as Project[];
          setProjects(uniqueProjects);
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
    const isSameEmployee = selectedEmployees.length === 0
      ? true
      : timesheet.employees && timesheet.employees.some(emp => selectedEmployees.includes(emp.id));
    const isSameProject = selectedProject
      ? timesheet.project && timesheet.project.id === selectedProject
      : true;
    const isInDateRange =
      dateRange.startDate && dateRange.endDate
        ? timesheetDate >= new Date(dateRange.startDate) &&
          timesheetDate <= new Date(dateRange.endDate)
        : false;
    return isSameEmployee && isSameProject && isInDateRange;
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

    const excelData = filteredTimesheets.map(timesheet => {
      const timesheetEmployeeIds = timesheet.employees?.map(emp => emp.id) || [];
      const associatedEmployees = selectedEmployees.filter(empId => timesheetEmployeeIds.includes(empId));

      if (associatedEmployees.length > 1) {
        return associatedEmployees.map(empId => {
          const employee = employees.find(emp => emp.id === empId);
          const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';

          return {
            Employee: employeeName,
            Date: timesheet.timesheetDate,
            Location: timesheet.location,
            'Check-In': timesheet.onsiteSignIn,
            'Check-Out': timesheet.onsiteSignOut,
            'Regular Hours': timesheet.normalHrs,
            'OT Hours': timesheet.overtime,
            'Travel Time': timesheet.totalTravelHrs,
            Remarks: timesheet.remarks,
            'Onsite Travel Start': timesheet.onsiteTravelStart,
            'Onsite Travel End': timesheet.onsiteTravelEnd,
            'Offsite Travel Start': timesheet.offsiteTravelStart,
            'Offsite Travel End': timesheet.offsiteTravelEnd,
            Supervisor: timesheet.supervisorName,
            'Work Type': timesheet.typeofWork,
            'Project Code': timesheet.projectcode,
          };
        });
      } else {
        const empId = associatedEmployees[0] || selectedEmployees[0];
        const employee = employees.find(emp => emp.id === empId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';

        return {
          Employee: employeeName,
          Date: timesheet.timesheetDate,
          Location: timesheet.location,
          'Check-In': timesheet.onsiteSignIn,
          'Check-Out': timesheet.onsiteSignOut,
          'Regular Hours': timesheet.normalHrs,
          'OT Hours': timesheet.overtime,
          'Travel Time': timesheet.totalTravelHrs,
          Remarks: timesheet.remarks,
          'Onsite Travel Start': timesheet.onsiteTravelStart,
          'Onsite Travel End': timesheet.onsiteTravelEnd,
          'Offsite Travel Start': timesheet.offsiteTravelStart,
          'Offsite Travel End': timesheet.offsiteTravelEnd,
          Supervisor: timesheet.supervisorName,
          'Work Type': timesheet.typeofWork,
          'Project Code': timesheet.projectcode,
        };
      }
    }).flat();

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheets");
    XLSX.writeFile(workbook, "Timesheets.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employee-Wise Report</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Employees</label>
              <div className="relative employee-dropdown">
                <button
                  type="button"
                  onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left"
                  disabled={loading}
                >
                  {selectedEmployees.length === 0 ? (
                    <span className="text-gray-500">Select employees...</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedEmployees.map((employeeId) => {
                        const employee = employees.find(emp => emp.id === employeeId);
                        return (
                          <span
                            key={employeeId}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown'}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
                              }}
                              className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </button>
                {showEmployeeDropdown && !loading && (
                  <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Employees</span>
                        <button
                          type="button"
                          onClick={() => setSelectedEmployees([])}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Clear All
                        </button>
                      </div>
                      {employees.map((employee) => (
                        <label
                          key={employee.id}
                          className="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmployees(prev => [...prev, employee.id]);
                              } else {
                                setSelectedEmployees(prev => prev.filter(id => id !== employee.id));
                              }
                            }}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {employee.firstName} {employee.lastName}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                disabled={loading}
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Date Range</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDatePickers(!showDatePickers)}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <Calendar size={16} />
                  <span>
                    {dateRange.startDate && dateRange.endDate
                      ? `${new Date(dateRange.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} - ${new Date(dateRange.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`
                      : 'Select a Date Range'}
                  </span>
                </button>
                {showDatePickers && (
                  <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={dateRange.startDate}
                          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                          onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                        <input
                          type="date"
                          value={dateRange.endDate}
                          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                          onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => setShowDatePickers(false)}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {selectedEmployees.length === 0
                ? 'Select Employees'
                : selectedEmployees.map(id => {
                    const employee = employees.find(emp => emp.id === id);
                    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
                  }).join(', ') + ' Report'
              }
            </h2>
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-100 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText size={16} />
                Export Excel
              </button>
              {filteredTimesheets.length > 0 ? (
                <PDFDownloadLink
                  document={
                    <MyDocument
                      data={filteredTimesheets}
                      selectedEmployees={selectedEmployees}
                      employees={employees}
                    />
                  }
                  fileName="Timesheets.pdf"
                >
                  {({ loading }) => (
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      disabled={loading}
                    >
                      <Download size={16} />
                      {loading ? 'Generating PDF...' : 'Export PDF'}
                    </button>
                  )}
                </PDFDownloadLink>
              ) : (
                <button
                  onClick={() => toast('No data to export', {
                    style: {
                      borderRadius: '10px',
                      background: 'blue',
                      color: '#fff',
                    },
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Export PDF
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Regular Hours</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{selectedEmployees.length === 0 ? '0' : regularHours}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Overtime Hours</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-300">{selectedEmployees.length === 0 ? '0' : overtimeHours}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Days Worked</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">{selectedEmployees.length === 0 ? '0' : daysWorked}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  {[
                    'Employee', 'Date', 'Location', 'Check-In', 'Check-Out', 'Regular Hours', 'OT Hours', 'Travel Time', 'Remarks',
                    'Onsite Travel Start', 'Onsite Travel End', 'Offsite Travel Start', 'Offsite Travel End',
                    'Supervisor', 'Work Type', 'Project Code'
                  ].map((header) => (
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
                {selectedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="text-center py-4">Please select an employee to view data</td>
                  </tr>
                ) : (
                  filteredTimesheets.length > 0 ? (
                    filteredTimesheets.map((timesheet) => {
                      const timesheetEmployeeIds = timesheet.employees?.map(emp => emp.id) || [];
                      const associatedEmployees = selectedEmployees.filter(empId => timesheetEmployeeIds.includes(empId));

                      if (associatedEmployees.length > 1) {
                        return associatedEmployees.map((empId, empIndex) => {
                          const employee = employees.find(emp => emp.id === empId);
                          const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';

                          return (
                            <tr key={`${timesheet.id}-${empIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{employeeName}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.timesheetDate}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.location}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignIn}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignOut}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.normalHrs}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.overtime}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.totalTravelHrs}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.remarks}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteTravelStart}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteTravelEnd}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.offsiteTravelStart}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.offsiteTravelEnd}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.supervisorName}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.typeofWork}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.projectcode}</td>
                            </tr>
                          );
                        });
                      } else {
                        const empId = associatedEmployees[0] || selectedEmployees[0];
                        const employee = employees.find(emp => emp.id === empId);
                        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';

                        return (
                          <tr key={timesheet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{employeeName}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.timesheetDate}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.location}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignIn}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignOut}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.normalHrs}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.overtime}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.totalTravelHrs}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.remarks}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteTravelStart}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteTravelEnd}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.offsiteTravelStart}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.offsiteTravelEnd}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.supervisorName}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.typeofWork}</td>
                            <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.projectcode}</td>
                          </tr>
                        );
                      }
                    }).flat()
                  ) : (
                    <tr>
                      <td colSpan={16} className="text-center py-4">No Data Found</td>
                    </tr>
                  )
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
