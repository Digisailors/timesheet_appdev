/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Calendar, Search } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'supervisor';
  fullName?: string;
}

interface Project {
  id: string;
  name: string;
}

interface Timesheet {
  id: string;
  type: 'employee' | 'supervisor';
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
  employees?: Array<{ id: string; fullName: string }>;
  supervisor?: { id: string; fullName: string };
  project?: Project;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface MyDocumentProps {
  data: Timesheet[];
  selectedEmployees: string[];
  employees: Person[];
}

const styles = StyleSheet.create({
  page: {
    padding: 5,
    fontFamily: 'Courier',
    fontSize: 6,
    flexDirection: 'column',
  },
  title: {
    fontSize: 8,
    marginBottom: 3,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  employeeName: {
    fontSize: 7,
    marginBottom: 3,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginBottom: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'flex-start',
    minHeight: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold',
    paddingVertical: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-start',
    minHeight: 12,
  },
  tableCell: {
    padding: 1,
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 6,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    wordWrap: 'break-word',
    textAlign: 'left',
  },
  headerCell: {
    padding: 1,
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 6,
    fontWeight: 'bold',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    wordWrap: 'break-word',
    textAlign: 'left',
  },
});

const MyDocument: React.FC<MyDocumentProps> = ({ data, selectedEmployees, employees }) => (
  <Document>
    <Page style={styles.page} size="A4" orientation="landscape">
      <Text style={styles.title}>Employee Timesheet Report</Text>
      <Text style={styles.employeeName}>
        {selectedEmployees.map((id: string) => {
          const person = employees.find((emp: Person) => emp.id === id);
          return person ? `${person.fullName || `${person.firstName} ${person.lastName}`}${person.role === 'supervisor' ? ' (S)' : ''}` : 'Unknown';
        }).join(', ')}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { width: '5%' }]}>Date</Text>
          <Text style={[styles.headerCell, { width: '10%' }]}>Name</Text>
          <Text style={[styles.headerCell, { width: '8%' }]}>Location</Text>
          <Text style={[styles.headerCell, { width: '5%' }]}>Project Code</Text>
          <Text style={[styles.headerCell, { width: '8%' }]}>Work Type</Text>
          <Text style={[styles.headerCell, { width: '7%' }]}>Onsite Travel Start</Text>
          <Text style={[styles.headerCell, { width: '5%' }]}>Check-In</Text>
          <Text style={[styles.headerCell, { width: '5%' }]}>Check-Out</Text>
          <Text style={[styles.headerCell, { width: '7%' }]}>Onsite Travel End</Text>
          <Text style={[styles.headerCell, { width: '7%' }]}>Offsite Travel Start</Text>
          <Text style={[styles.headerCell, { width: '7%' }]}>Offsite Travel End</Text>
          <Text style={[styles.headerCell, { width: '5%' }]}>Regular Hours</Text>
          <Text style={[styles.headerCell, { width: '5%' }]}>OT Hours</Text>
          <Text style={[styles.headerCell, { width: '5%' }]}>Travel Time</Text>
          <Text style={[styles.headerCell, { width: '7%' }]}>Supervisor</Text>
          <Text style={[styles.headerCell, { width: '9%' }]}>Remarks</Text>
        </View>
        {data.map((timesheet: Timesheet, index: number) => {
          const timesheetEmployeeIds = timesheet.employees?.map((emp: { id: string }) => emp.id) || [];
          const associatedEmployees = selectedEmployees.filter((empId: string) => timesheetEmployeeIds.includes(empId));
          const isSupervisorSelected = timesheet.supervisor && selectedEmployees.includes(timesheet.supervisor.id);
          if (associatedEmployees.length > 0 || isSupervisorSelected) {
            if (associatedEmployees.length > 1) {
              return associatedEmployees.map((empId: string, empIndex: number) => {
                const person = employees.find((emp: Person) => emp.id === empId);
                const personName = person ? `${person.fullName || `${person.firstName} ${person.lastName}`}` : 'Unknown';
                const supervisorName = isSupervisorSelected ? '' : timesheet.supervisorName;
                return (
                  <View key={`${index}-${empIndex}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.timesheetDate}</Text>
                    <Text style={[styles.tableCell, { width: '10%' }]}>{personName}</Text>
                    <Text style={[styles.tableCell, { width: '8%' }]}>{timesheet.location}</Text>
                    <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.projectcode}</Text>
                    <Text style={[styles.tableCell, { width: '8%' }]}>{timesheet.typeofWork}</Text>
                    <Text style={[styles.tableCell, { width: '7%' }]}>{timesheet.onsiteTravelStart}</Text>
                    <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.onsiteSignIn}</Text>
                    <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.onsiteSignOut}</Text>
                    <Text style={[styles.tableCell, { width: '7%' }]}>{timesheet.onsiteTravelEnd}</Text>
                    <Text style={[styles.tableCell, { width: '7%' }]}>{timesheet.offsiteTravelStart}</Text>
                    <Text style={[styles.tableCell, { width: '7%' }]}>{timesheet.offsiteTravelEnd}</Text>
                    <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.normalHrs}</Text>
                    <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.overtime}</Text>
                    <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.totalTravelHrs}</Text>
                    <Text style={[styles.tableCell, { width: '7%' }]}>{supervisorName}</Text>
                    <Text style={[styles.tableCell, { width: '9%' }]}>{timesheet.remarks}</Text>
                  </View>
                );
              });
            } else {
              const empId = associatedEmployees[0] || (timesheet.supervisor ? timesheet.supervisor.id : selectedEmployees[0]);
              const person = employees.find((emp: Person) => emp.id === empId);
              const personName = person ? `${person.fullName || `${person.firstName} ${person.lastName}`}` : 'Unknown';
              const supervisorName = isSupervisorSelected ? '' : timesheet.supervisorName;
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.timesheetDate}</Text>
                  <Text style={[styles.tableCell, { width: '10%' }]}>{personName}</Text>
                  <Text style={[styles.tableCell, { width: '8%' }]}>{timesheet.location}</Text>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.projectcode}</Text>
                  <Text style={[styles.tableCell, { width: '8%' }]}>{timesheet.typeofWork}</Text>
                  <Text style={[styles.tableCell, { width: '7%' }]}>{timesheet.onsiteTravelStart}</Text>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.onsiteSignIn}</Text>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.onsiteSignOut}</Text>
                  <Text style={[styles.tableCell, { width: '7%' }]}>{timesheet.onsiteTravelEnd}</Text>
                  <Text style={[styles.tableCell, { width: '7%' }]}>{timesheet.offsiteTravelStart}</Text>
                  <Text style={[styles.tableCell, { width: '7%' }]}>{timesheet.offsiteTravelEnd}</Text>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.normalHrs}</Text>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.overtime}</Text>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{timesheet.totalTravelHrs}</Text>
                  <Text style={[styles.tableCell, { width: '7%' }]}>{supervisorName}</Text>
                  <Text style={[styles.tableCell, { width: '9%' }]}>{timesheet.remarks}</Text>
                </View>
              );
            }
          }
          return null;
        }).flat().filter(Boolean)}
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
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [employees, setEmployees] = useState<Person[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const employeeDropdownRef = useRef<HTMLDivElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.employee-dropdown') && !target.closest('.project-dropdown')) {
        setShowEmployeeDropdown(false);
        setShowProjectDropdown(false);
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
        // Fetch employees
        const employeesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/all`,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }
        );
        const employeesResult = await employeesResponse.json();
        const fetchedEmployees = employeesResult.data.map((emp: any) => ({
          id: emp.id,
          firstName: emp.firstName || emp.fullName.split(' ')[0],
          lastName: emp.lastName || emp.fullName.split(' ')[1] || '',
          role: 'employee',
          fullName: emp.fullName,
        }));
        // Fetch timesheets to extract supervisors
        const timesheetsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all`,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }
        );
        const timesheetsResult = await timesheetsResponse.json();
        const uniqueSupervisors = Array.from(
          new Map(
            timesheetsResult.data
              .filter((ts: any) => ts.supervisor)
              .map((ts: any) => [
                ts.supervisor.id,
                {
                  id: ts.supervisor.id,
                  firstName: ts.supervisor.fullName.split(' ')[0],
                  lastName: ts.supervisor.fullName.split(' ')[1] || '',
                  role: 'supervisor',
                  fullName: ts.supervisor.fullName,
                }
              ])
          ).values()
        );
        // Merge employees and supervisors
        const people = [...fetchedEmployees, ...uniqueSupervisors];
        setEmployees(people);
        // Set timesheets and projects
        setTimesheets(timesheetsResult.data);
        const uniqueProjects = Array.from(
          new Map(
            timesheetsResult.data
              .filter((ts: any) => ts.project)
              .map((ts: any) => [ts.project!.id, ts.project!] as [string, Project])
          ).values()
        ) as Project[];
        setProjects(uniqueProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEmployees = employees.filter((person) =>
    person.fullName?.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    `${person.firstName} ${person.lastName}`.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  const filteredTimesheets = timesheets.filter((timesheet) => {
    const timesheetDate = new Date(timesheet.timesheetDate);
    const isSamePerson =
      selectedEmployees.length === 0
        ? true
        : timesheet.employees?.some((emp: any) => selectedEmployees.includes(emp.id)) ||
          (timesheet.supervisor && selectedEmployees.includes(timesheet.supervisor.id));
    const isSameProject = selectedProject
      ? timesheet.project && timesheet.project.id === selectedProject
      : true;
    const isInDateRange =
      dateRange.startDate && dateRange.endDate
        ? timesheetDate >= new Date(dateRange.startDate) &&
          timesheetDate <= new Date(dateRange.endDate)
        : false;
    return isSamePerson && isSameProject && isInDateRange;
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
      const isSupervisorSelected = timesheet.supervisor && selectedEmployees.includes(timesheet.supervisor.id);
      if (associatedEmployees.length > 0 || isSupervisorSelected) {
        if (associatedEmployees.length > 1) {
          return associatedEmployees.map(empId => {
            const person = employees.find(emp => emp.id === empId);
            const personName = person ? `${person.fullName || `${person.firstName} ${person.lastName}`}` : 'Unknown';
            const supervisorName = isSupervisorSelected ? '' : timesheet.supervisorName;
            return {
              Date: timesheet.timesheetDate,
              Name: personName,
              Location: timesheet.location,
              'Project Code': timesheet.projectcode,
              'Work Type': timesheet.typeofWork,
              'Onsite Travel Start': timesheet.onsiteTravelStart,
              'Check-In': timesheet.onsiteSignIn,
              'Check-Out': timesheet.onsiteSignOut,
              'Onsite Travel End': timesheet.onsiteTravelEnd,
              'Offsite Travel Start': timesheet.offsiteTravelStart,
              'Offsite Travel End': timesheet.offsiteTravelEnd,
              'Regular Hours': timesheet.normalHrs,
              'OT Hours': timesheet.overtime,
              'Travel Time': timesheet.totalTravelHrs,
              Supervisor: supervisorName,
              Remarks: timesheet.remarks,
            };
          });
        } else {
          const empId = associatedEmployees[0] || (timesheet.supervisor ? timesheet.supervisor.id : selectedEmployees[0]);
          const person = employees.find(emp => emp.id === empId);
          const personName = person ? `${person.fullName || `${person.firstName} ${person.lastName}`}` : 'Unknown';
          const supervisorName = isSupervisorSelected ? '' : timesheet.supervisorName;
          return {
            Date: timesheet.timesheetDate,
            Name: personName,
            Location: timesheet.location,
            'Project Code': timesheet.projectcode,
            'Work Type': timesheet.typeofWork,
            'Onsite Travel Start': timesheet.onsiteTravelStart,
            'Check-In': timesheet.onsiteSignIn,
            'Check-Out': timesheet.onsiteSignOut,
            'Onsite Travel End': timesheet.onsiteTravelEnd,
            'Offsite Travel Start': timesheet.offsiteTravelStart,
            'Offsite Travel End': timesheet.offsiteTravelEnd,
            'Regular Hours': timesheet.normalHrs,
            'OT Hours': timesheet.overtime,
            'Travel Time': timesheet.totalTravelHrs,
            Supervisor: supervisorName,
            Remarks: timesheet.remarks,
          };
        }
      }
      return [];
    }).flat().filter(Boolean);
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Employees/Supervisors</label>
              <div className="relative employee-dropdown" ref={employeeDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmployeeDropdown(!showEmployeeDropdown);
                    setEmployeeSearchTerm('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left"
                  disabled={loading}
                >
                  {selectedEmployees.length === 0 ? (
                    <span className="text-gray-500">Select employees/supervisors...</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedEmployees.map((personId) => {
                        const person = employees.find(emp => emp.id === personId);
                        return (
                          <span
                            key={personId}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {person ? `${person.fullName || `${person.firstName} ${person.lastName}`}${person.role === 'supervisor' ? ' (S)' : ''}` : 'Unknown'}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEmployees(prev => prev.filter(id => id !== personId));
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Employees/Supervisors</span>
                        <button
                          type="button"
                          onClick={() => setSelectedEmployees([])}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={employeeSearchTerm}
                            onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                          />
                          <Search className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      {filteredEmployees.map((person) => (
                        <label
                          key={person.id}
                          className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(person.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmployees(prev => [...prev, person.id]);
                                } else {
                                  setSelectedEmployees(prev => prev.filter(id => id !== person.id));
                                }
                              }}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {person.fullName || `${person.firstName} ${person.lastName}`}
                            </span>
                          </div>
                          {person.role === 'supervisor' && (
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-blue-600 rounded-full">
                              S
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Project</label>
              <div className="relative project-dropdown" ref={projectDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectDropdown(!showProjectDropdown);
                    setProjectSearchTerm('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left"
                  disabled={loading}
                >
                  {selectedProject ? (
                    projects.find(p => p.id === selectedProject)?.name
                  ) : (
                    <span className="text-gray-500">Select a project...</span>
                  )}
                </button>
                {showProjectDropdown && !loading && (
                  <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2">
                      <div className="mb-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={projectSearchTerm}
                            onChange={(e) => setProjectSearchTerm(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                          />
                          <Search className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      {filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project.id);
                            setShowProjectDropdown(false);
                          }}
                          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          {project.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                ? 'Select Employees/Supervisors'
                : selectedEmployees.map(id => {
                    const person = employees.find(emp => emp.id === id);
                    return person ? `${person.fullName || `${person.firstName} ${person.lastName}`}${person.role === 'supervisor' ? ' (S)' : ''}` : 'Unknown';
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
                    'Date', 'Name', 'Location', 'Project Code', 'Work Type', 'Onsite Travel Start', 'Check-In', 'Check-Out',
                    'Onsite Travel End', 'Offsite Travel Start', 'Offsite Travel End', 'Regular Hours', 'OT Hours',
                    'Travel Time', 'Supervisor', 'Remarks'
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
                    <td colSpan={16} className="text-center py-4">Please select an employee/supervisor to view data</td>
                  </tr>
                ) : (
                  filteredTimesheets.length > 0 ? (
                    filteredTimesheets.map((timesheet) => {
                      const timesheetEmployeeIds = timesheet.employees?.map(emp => emp.id) || [];
                      const associatedEmployees = selectedEmployees.filter(empId => timesheetEmployeeIds.includes(empId));
                      const isSupervisorSelected = timesheet.supervisor && selectedEmployees.includes(timesheet.supervisor.id);
                      if (associatedEmployees.length > 0 || isSupervisorSelected) {
                        if (associatedEmployees.length > 1) {
                          return associatedEmployees.map((empId, empIndex) => {
                            const person = employees.find(emp => emp.id === empId);
                            const personName = person ? `${person.fullName || `${person.firstName} ${person.lastName}`}` : 'Unknown';
                            const supervisorName = isSupervisorSelected ? '' : timesheet.supervisorName;
                            return (
                              <tr key={`${timesheet.id}-${empIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.timesheetDate}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{personName}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.location}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.projectcode}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.typeofWork}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteTravelStart}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignIn}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignOut}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteTravelEnd}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.offsiteTravelStart}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.offsiteTravelEnd}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.normalHrs}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.overtime}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.totalTravelHrs}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{supervisorName}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.remarks}</td>
                              </tr>
                            );
                          });
                        } else {
                          const empId = associatedEmployees[0] || (timesheet.supervisor ? timesheet.supervisor.id : selectedEmployees[0]);
                          const person = employees.find(emp => emp.id === empId);
                          const personName = person ? `${person.fullName || `${person.firstName} ${person.lastName}`}` : 'Unknown';
                          const supervisorName = isSupervisorSelected ? '' : timesheet.supervisorName;
                          return (
                            <tr key={timesheet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.timesheetDate}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{personName}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.location}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.projectcode}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.typeofWork}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteTravelStart}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignIn}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteSignOut}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.onsiteTravelEnd}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.offsiteTravelStart}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.offsiteTravelEnd}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.normalHrs}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.overtime}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.totalTravelHrs}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{supervisorName}</td>
                              <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">{timesheet.remarks}</td>
                            </tr>
                          );
                        }
                      }
                      return null;
                    }).flat().filter(Boolean)
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
