/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Calendar, ChevronDown, Search } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  hourlyRate?: number;
  overtimeRate?: number;
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

interface SalaryData {
  employeeId: string;
  employeeName: string;
  role: 'employee' | 'supervisor';
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  project: string;
  location: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
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
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    fontWeight: 'bold',
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 3,
    width: '10%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 8,
    textAlign: 'center',
  },
  headerCell: {
    padding: 3,
    width: '10%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summarySection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 10,
    marginBottom: 2,
  },
});

const SalaryReportDocument = ({
  data,
  filters,
  summary
}: {
  data: SalaryData[];
  filters: { project: string; location: string; dateRange: string };
  summary: { totalEmployees: number; totalRegularPay: number; totalOvertimePay: number; grandTotal: number };
}) => (
  <Document>
    <Page style={styles.page} size="A4">
      <Text style={styles.title}>Salary Report</Text>
      <Text style={styles.subtitle}>
        Project: {filters.project} | Location: {filters.location} | Period: {filters.dateRange}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          {[
            'Project', 'Employee', 'Role', 'Regular Hrs', 'OT Hrs', 'Regular Rate', 'OT Rate',
            'Regular Pay', 'OT Pay', 'Total Pay'
          ].map((header) => (
            <Text key={header} style={styles.headerCell}>{header}</Text>
          ))}
        </View>
        {data.map((salary, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{salary.project}</Text>
            <Text style={styles.tableCell}>{salary.employeeName}</Text>
            <Text style={styles.tableCell}>{salary.role}</Text>
            <Text style={styles.tableCell}>{Number(salary.regularHours || 0).toFixed(1)}</Text>
            <Text style={styles.tableCell}>{Number(salary.overtimeHours || 0).toFixed(1)}</Text>
            <Text style={styles.tableCell}>{Number(salary.regularRate || 0).toFixed(2)}</Text>
            <Text style={styles.tableCell}>{Number(salary.overtimeRate || 0).toFixed(2)}</Text>
            <Text style={styles.tableCell}>{Number(salary.regularPay || 0).toFixed(2)}</Text>
            <Text style={styles.tableCell}>{Number(salary.overtimePay || 0).toFixed(2)}</Text>
            <Text style={styles.tableCell}>{Number(salary.totalPay || 0).toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryText}>Total Employees: {summary.totalEmployees}</Text>
        <Text style={styles.summaryText}>Total Regular Pay: {summary.totalRegularPay.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Overtime Pay: {summary.totalOvertimePay.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Grand Total: {summary.grandTotal.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

const SalaryReport: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
  });
  const [showDatePickers, setShowDatePickers] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const DEFAULT_REGULAR_RATE = 25.00;
  const DEFAULT_OVERTIME_RATE = 37.50;
  const DEFAULT_SUPERVISOR_RATE = 35.00;
  const DEFAULT_SUPERVISOR_OT_RATE = 52.50;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowProjectDropdown(false);
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }
        const employeesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/all`,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }
        );
        if (!employeesResponse.ok) {
          throw new Error(`HTTP error! status: ${employeesResponse.status}`);
        }
        const employeesResult = await employeesResponse.json();
        if (employeesResult.success && employeesResult.data) {
          setEmployees(employeesResult.data);
        }
        const timesheetsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all`,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }
        );
        if (!timesheetsResponse.ok) {
          throw new Error(`HTTP error! status: ${timesheetsResponse.status}`);
        }
        const timesheetsResult = await timesheetsResponse.json();
        if (timesheetsResult.success && timesheetsResult.data) {
          setTimesheets(timesheetsResult.data);
          const uniqueProjects = Array.from(
            new Map(
              timesheetsResult.data
                .filter((ts: Timesheet) => ts.project)
                .map((ts: Timesheet) => [ts.project!.id, ts.project!])
            ).values()
          ) as Project[];
          setProjects(uniqueProjects);
          const uniqueLocations = Array.from(
            new Set(timesheetsResult.data.map((ts: Timesheet) => ts.location).filter(Boolean))
          ) as string[];
          setLocations(uniqueLocations);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );

  const filteredTimesheets = timesheets.filter((timesheet) => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return false;
    }
    const timesheetDate = new Date(timesheet.timesheetDate);
    const isSameProject = selectedProject
      ? timesheet.project && timesheet.project.name === selectedProject
      : true;
    const isSameLocation = selectedLocation !== 'All Locations'
      ? timesheet.location === selectedLocation
      : true;
    const isInDateRange = timesheetDate >= new Date(dateRange.startDate) &&
      timesheetDate <= new Date(dateRange.endDate);
    return isSameProject && isSameLocation && isInDateRange;
  });

  const calculateSalaryData = (): SalaryData[] => {
    if (!filteredTimesheets.length) return [];
    const salaryMap = new Map<string, SalaryData>();
    const supervisorMap = new Map<string, SalaryData>();
    filteredTimesheets.forEach((timesheet) => {
      timesheet.employees?.forEach((emp) => {
        const employee = employees.find(e => e.id === emp.id);
        if (!employee) return;
        const key = `${emp.id}-${timesheet.project?.name || 'Unknown'}-${timesheet.location}`;
        const regularHours = parseFloat(timesheet.normalHrs) || 0;
        const overtimeHours = parseFloat(timesheet.overtime) || 0;
        const regularRate = employee.hourlyRate || DEFAULT_REGULAR_RATE;
        const overtimeRate = employee.overtimeRate || DEFAULT_OVERTIME_RATE;
        if (salaryMap.has(key)) {
          const existing = salaryMap.get(key)!;
          existing.regularHours += regularHours;
          existing.overtimeHours += overtimeHours;
          existing.regularPay = existing.regularHours * existing.regularRate;
          existing.overtimePay = existing.overtimeHours * existing.overtimeRate;
          existing.totalPay = existing.regularPay + existing.overtimePay;
        } else {
          const regularPay = regularHours * regularRate;
          const overtimePay = overtimeHours * overtimeRate;
          salaryMap.set(key, {
            employeeId: emp.id,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            role: 'employee',
            regularHours,
            overtimeHours,
            regularRate,
            overtimeRate,
            regularPay,
            overtimePay,
            totalPay: regularPay + overtimePay,
            project: timesheet.project?.name || 'Unknown',
            location: timesheet.location,
          });
        }
      });
      if (timesheet.supervisorName) {
        const supervisorKey = `${timesheet.supervisorName}-${timesheet.project?.name || 'Unknown'}-${timesheet.location}`;
        const regularHours = parseFloat(timesheet.normalHrs) || 0;
        const overtimeHours = parseFloat(timesheet.overtime) || 0;
        const regularRate = DEFAULT_SUPERVISOR_RATE;
        const overtimeRate = DEFAULT_SUPERVISOR_OT_RATE;
        if (supervisorMap.has(supervisorKey)) {
          const existing = supervisorMap.get(supervisorKey)!;
          existing.regularHours += regularHours;
          existing.overtimeHours += overtimeHours;
          existing.regularPay = existing.regularHours * existing.regularRate;
          existing.overtimePay = existing.overtimeHours * existing.overtimeRate;
          existing.totalPay = existing.regularPay + existing.overtimePay;
        } else {
          const regularPay = regularHours * regularRate;
          const overtimePay = overtimeHours * overtimeRate;
          supervisorMap.set(supervisorKey, {
            employeeId: 'supervisor',
            employeeName: timesheet.supervisorName,
            role: 'supervisor',
            regularHours,
            overtimeHours,
            regularRate,
            overtimeRate,
            regularPay,
            overtimePay,
            totalPay: regularPay + overtimePay,
            project: timesheet.project?.name || 'Unknown',
            location: timesheet.location,
          });
        }
      }
    });
    return [...Array.from(salaryMap.values()), ...Array.from(supervisorMap.values())];
  };

  const salaryData = calculateSalaryData();

  const calculateSummary = () => {
    const totalEmployees = salaryData.length;
    const totalRegularPay = salaryData.reduce((sum, item) => sum + Number(item.regularPay || 0), 0);
    const totalOvertimePay = salaryData.reduce((sum, item) => sum + Number(item.overtimePay || 0), 0);
    const grandTotal = totalRegularPay + totalOvertimePay;
    return {
      totalEmployees,
      totalRegularPay,
      totalOvertimePay,
      grandTotal,
    };
  };

  const summary = calculateSummary();

  const formatDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return 'Select a Date Range';
    }
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} - ${end.toLocaleDateString(
      'en-US',
      { month: 'short', day: '2-digit', year: 'numeric' }
    )}`;
  };

  const exportToExcel = () => {
    if (salaryData.length === 0 || !dateRange.startDate || !dateRange.endDate) {
      toast('Please select a date range and ensure there is data to export', {
        style: {
          borderRadius: '10px',
          background: 'blue',
          color: '#fff',
        },
      });
      return;
    }
    const workbook = XLSX.utils.book_new();
    // Main salary data with project info
    const excelData = salaryData.map(item => ({
      'Project': item.project,
      'Employee Name': item.employeeName,
      'Role': item.role,
      'Location': item.location,
      'Regular Hours': Number(item.regularHours || 0).toFixed(2),
      'Overtime Hours': Number(item.overtimeHours || 0).toFixed(2),
      'Regular Rate': Number(item.regularRate || 0).toFixed(2),
      'Overtime Rate': Number(item.overtimeRate || 0).toFixed(2),
      'Regular Pay': Number(item.regularPay || 0).toFixed(2),
      'Overtime Pay': Number(item.overtimePay || 0).toFixed(2),
      'Total Pay': Number(item.totalPay || 0).toFixed(2),
    }));
    // Add summary row to the main sheet
    excelData.push({
      'Project': 'Summary',
      'Employee Name': '',
      'Role': 'employee',
      'Location': '',
      'Regular Hours': '',
      'Overtime Hours': '',
      'Regular Rate': '',
      'Overtime Rate': '',
      'Regular Pay': summary.totalRegularPay.toFixed(2),
      'Overtime Pay': summary.totalOvertimePay.toFixed(2),
      'Total Pay': summary.grandTotal.toFixed(2),
    });
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Report");
    // Summary sheet (optional, you can keep or remove)
    const summaryData = [
      { 'Metric': 'Total Employees', 'Value': summary.totalEmployees },
      { 'Metric': 'Total Regular Pay', 'Value': `${summary.totalRegularPay.toFixed(2)}` },
      { 'Metric': 'Total Overtime Pay', 'Value': `${summary.totalOvertimePay.toFixed(2)}` },
      { 'Metric': 'Grand Total', 'Value': `${summary.grandTotal.toFixed(2)}` },
    ];
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");
    XLSX.writeFile(workbook, "Salary_Report.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Salary Report</h1>
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Project</label>
              <div className="relative dropdown-container" ref={projectDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectDropdown(!showProjectDropdown);
                    setProjectSearchTerm('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left flex items-center justify-between"
                  disabled={loading}
                >
                  <span>{selectedProject || 'All Projects'}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showProjectDropdown && !loading && (
                  <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search projects..."
                          value={projectSearchTerm}
                          onChange={(e) => setProjectSearchTerm(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                        />
                        <Search className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProject('');
                        setShowProjectDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      All Projects
                    </button>
                    {filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project.name);
                          setShowProjectDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        {project.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Location Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Location</label>
              <div className="relative dropdown-container" ref={locationDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowLocationDropdown(!showLocationDropdown);
                    setLocationSearchTerm('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left flex items-center justify-between"
                  disabled={loading}
                >
                  <span>{selectedLocation}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showLocationDropdown && !loading && (
                  <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search locations..."
                          value={locationSearchTerm}
                          onChange={(e) => setLocationSearchTerm(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                        />
                        <Search className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLocation('All Locations');
                        setShowLocationDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      All Locations
                    </button>
                    {filteredLocations.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedLocation(location);
                          setShowLocationDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Date Range Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Date Range</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDatePickers(!showDatePickers)}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <Calendar size={16} />
                  <span>{formatDateRange()}</span>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{summary.totalEmployees}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Regular Pay</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-300">{Number(summary.totalRegularPay).toFixed(0)}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Overtime Pay</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-300">{Number(summary.totalOvertimePay).toFixed(0)}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Pay</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">{Number(summary.grandTotal).toFixed(0)}</p>
          </div>
        </div>
        {/* Main Report */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Salary Details</h2>
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-100 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText size={16} />
                Export Excel
              </button>
              {salaryData.length > 0 ? (
                <PDFDownloadLink
                  document={
                    <SalaryReportDocument
                      data={salaryData}
                      filters={{
                        project: selectedProject || 'All Projects',
                        location: selectedLocation,
                        dateRange: formatDateRange(),
                      }}
                      summary={summary}
                    />
                  }
                  fileName="Salary_Report.pdf"
                >
                  {({ loading: pdfLoading }) => (
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      disabled={pdfLoading}
                    >
                      <Download size={16} />
                      {pdfLoading ? 'Generating PDF...' : 'Export PDF'}
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
          {/* Salary Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  {[
                    'Project', 'Employee', 'Role', 'Location', 'Regular Hrs', 'OT Hrs',
                    'Regular Rate', 'OT Rate', 'Regular Pay', 'OT Pay', 'Total Pay'
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
                {salaryData.length > 0 ? (
                  salaryData.map((salary, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">
                        {salary.project}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-medium">
                        {salary.employeeName}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          salary.role === 'supervisor'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {salary.role === 'supervisor' ? 'Supervisor' : 'Employee'}
                        </span>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">
                        {salary.location}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm text-right">
                        {Number(salary.regularHours || 0).toFixed(1)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm text-right">
                        {Number(salary.overtimeHours || 0).toFixed(1)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm text-right">
                        {Number(salary.regularRate || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm text-right">
                        {Number(salary.overtimeRate || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm text-right font-medium">
                        {Number(salary.regularPay || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm text-right font-medium">
                        {Number(salary.overtimePay || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm text-right font-bold text-green-600 dark:text-green-400">
                        {Number(salary.totalPay || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      {loading ? (
                        'Loading salary data...'
                      ) : !dateRange.startDate || !dateRange.endDate ? (
                        'Please select a date range to view salary data'
                      ) : (
                        'No salary data found for the selected filters'
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Summary Footer */}
          {salaryData.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-w-80">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Employees:</span>
                      <span className="font-medium">{summary.totalEmployees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Regular Pay:</span>
                      <span className="font-medium">{Number(summary.totalRegularPay).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Overtime Pay:</span>
                      <span className="font-medium">{Number(summary.totalOvertimePay).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Grand Total:</span>
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">
                        {Number(summary.grandTotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryReport;
