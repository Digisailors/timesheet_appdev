/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar, FileText, Download } from 'lucide-react';
import { getSession } from 'next-auth/react';
import * as XLSX from 'xlsx';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import toast from 'react-hot-toast';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface Project {
  id: string;
  name: string;
  projectDetails?: {
    id: string;
    projectcode: string;
    locations: string;
    typesOfWork: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

interface Location {
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
  totalDutyHrs: string;
  location: string;
  remarks: string;
  totalTravelHrs: string;
  project?: Project;
}

interface ProjectSelectorProps {
  selectedProject?: string;
  onProjectChange?: (project: string) => void;
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
  dateRange: DateRange;
  onDateRangeChange?: (dateRange: DateRange) => void;
  timesheets?: Timesheet[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold',
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 5,
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 10,
  },
  headerCell: {
    padding: 5,
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

const ProjectReportDocument = ({
  projectName,
  location,
  dateRange,
  totalHours,
  regularHours,
  overtimeHours,
  ratio,
}: {
  projectName: string;
  location: string;
  dateRange: string;
  totalHours: string;
  regularHours: string;
  overtimeHours: string;
  ratio: string;
}) => (
  <Document>
    <Page style={styles.page} size="A4">
      <Text style={styles.title}>Project Timesheet Report</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Project Name</Text>
          <Text style={styles.headerCell}>{projectName}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Site (Location)</Text>
          <Text style={styles.tableCell}>{location}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Date Range</Text>
          <Text style={styles.tableCell}>{dateRange}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Total Hours</Text>
          <Text style={styles.tableCell}>{totalHours}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Regular Hours</Text>
          <Text style={styles.tableCell}>{regularHours}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Overtime Hours</Text>
          <Text style={styles.tableCell}>{overtimeHours}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Regular/OT Ratio</Text>
          <Text style={styles.tableCell}>{ratio}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProject: propSelectedProject,
  onProjectChange,
  selectedLocation: propSelectedLocation,
  onLocationChange,
  dateRange,
  onDateRangeChange,
  timesheets = [],
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(propSelectedProject || '');
  const [selectedLocation, setSelectedLocation] = useState<string>(propSelectedLocation || 'All Locations');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [showDatePickers, setShowDatePickers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const projectSearchInputRef = useRef<HTMLInputElement>(null);
  const locationSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error('No access token found');
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          mode: 'cors',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          const fetchedProjects = result.data.map((project: any) => ({
            id: project.id,
            name: project.name,
            projectDetails: project.projectDetails || [],
          }));
          setProjects(fetchedProjects);
          // Don't set locations here - they will be set when a project is selected
          setLocations([]);
          if (!propSelectedProject && fetchedProjects.length > 0) {
            setSelectedProject(fetchedProjects[0].name);
            onProjectChange?.(fetchedProjects[0].name);
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        console.error('Error fetching projects:', err);
        setProjects([]);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [propSelectedProject, onProjectChange]);

  // Update locations when selectedProject changes
  useEffect(() => {
    if (selectedProject && projects.length > 0) {
      const selectedProjectData = projects.find(project => project.name === selectedProject);
      if (selectedProjectData?.projectDetails) {
        const projectLocations = selectedProjectData.projectDetails.map((detail, index) => ({
          id: detail.id || `location-${index}`,
          name: detail.locations,
        }));
        setLocations(projectLocations);
      } else {
        setLocations([]);
      }
    }
  }, [selectedProject, projects]);

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setIsDropdownOpen(false);
    onProjectChange?.(value);
    
    // Reset location selection and update available locations
    setSelectedLocation('All Locations');
    onLocationChange?.('All Locations');
    
    // Extract locations from the selected project
    const selectedProjectData = projects.find(project => project.name === value);
    if (selectedProjectData?.projectDetails) {
      const projectLocations = selectedProjectData.projectDetails.map((detail, index) => ({
        id: detail.id || `location-${index}`,
        name: detail.locations,
      }));
      setLocations(projectLocations);
    } else {
      setLocations([]);
    }
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setIsLocationDropdownOpen(false);
    onLocationChange?.(value);
  };

  const handleStartDateChange = (value: string) => {
    const newDateRange = { ...dateRange, startDate: value };
    onDateRangeChange?.(newDateRange);
  };

  const handleEndDateChange = (value: string) => {
    const newDateRange = { ...dateRange, endDate: value };
    onDateRangeChange?.(newDateRange);
  };

  const formatDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return 'Select a Date Range';
    }
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })}`;
  };

  const filteredTimesheets = timesheets.filter((timesheet) => {
    const timesheetDate = new Date(timesheet.timesheetDate);
    const isSameProject = selectedProject ? timesheet.project?.name === selectedProject : true;
    const isSameLocation = selectedLocation !== 'All Locations' ? timesheet.location === selectedLocation : true;
    const isInDateRange = dateRange.startDate && dateRange.endDate ? timesheetDate >= new Date(dateRange.startDate) && timesheetDate <= new Date(dateRange.endDate) : false;
    return isSameProject && isSameLocation && isInDateRange;
  });

  const calculateTotalHours = () => {
    let regular = 0;
    let overtime = 0;
    let total = 0;
    filteredTimesheets.forEach((timesheet) => {
      regular += parseFloat(timesheet.normalHrs || '0');
      overtime += parseFloat(timesheet.overtime || '0');
      total += parseFloat(timesheet.totalDutyHrs || '0');
    });

    const ratio = total > 0 ? `${((regular / total) * 100).toFixed(0)}% / ${((overtime / total) * 100).toFixed(0)}%` : '0% / 0%';
    return {
      totalHours: total.toFixed(1),
      regularHours: regular.toFixed(1),
      overtimeHours: overtime.toFixed(1),
      ratio,
    };
  };

  const { totalHours, regularHours, overtimeHours, ratio } = calculateTotalHours();

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
    const workbook = XLSX.utils.book_new();
    const summaryData = [
      {
        'Project Name': selectedProject,
        'Site (Location)': selectedLocation,
        'Date Range': formatDateRange(),
        'Total Hours': totalHours,
        'Regular Hours': regularHours,
        'Overtime Hours': overtimeHours,
        'Regular/OT Ratio': ratio,
      },
    ];
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Project Summary');
    const timesheetData = filteredTimesheets.map((timesheet) => ({
      Date: timesheet.timesheetDate,
      Location: timesheet.location,
      'Check-In': timesheet.onsiteSignIn,
      'Check-Out': timesheet.onsiteSignOut,
      'Regular Hours': timesheet.normalHrs,
      'Overtime Hours': timesheet.overtime,
      'Travel Hours': timesheet.totalTravelHrs,
      Remarks: timesheet.remarks,
    }));
    const timesheetWorksheet = XLSX.utils.json_to_sheet(timesheetData);
    XLSX.utils.book_append_sheet(workbook, timesheetWorksheet, 'Timesheet Details');
    interface MonthData {
      month: string;
      regular: number;
      overtime: number;
      total: number;
    }
    const monthsData = filteredTimesheets.reduce((acc: MonthData[], entry) => {
      const month = new Date(entry.timesheetDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' });
      const existingMonth = acc.find((item) => item.month === month);
      const normalHrs = parseFloat(entry.normalHrs || '0');
      const overtimeHrs = parseFloat(entry.overtime || '0');
      const totalHrs = parseFloat(entry.totalDutyHrs || '0');
      if (existingMonth) {
        existingMonth.regular += normalHrs;
        existingMonth.overtime += overtimeHrs;
        existingMonth.total += totalHrs;
      } else {
        acc.push({
          month,
          regular: normalHrs,
          overtime: overtimeHrs,
          total: totalHrs,
        });
      }
      return acc;
    }, [] as MonthData[]);
    monthsData.sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/');
      const [bMonth, bYear] = b.month.split('/');
      return new Date(parseInt(aYear || '0'), parseInt(aMonth || '0') - 1).getTime() - new Date(parseInt(bYear || '0'), parseInt(bMonth || '0') - 1).getTime();
    });
    const chartData = monthsData.map((data) => ({
      Month: data.month,
      'Regular Hours': data.regular.toFixed(2),
      'Overtime Hours': data.overtime.toFixed(2),
      'Total Hours': data.total.toFixed(2),
    }));
    const chartWorksheet = XLSX.utils.json_to_sheet(chartData);
    XLSX.utils.book_append_sheet(workbook, chartWorksheet, 'Monthly Chart Data');
    XLSX.writeFile(workbook, 'Project_Report.xlsx');
  };

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()));
  const filteredLocations = locations.filter((location) => location.name.toLowerCase().includes(locationSearchTerm.toLowerCase()));

  const handleProjectDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setProjectSearchTerm('');
      setTimeout(() => {
        projectSearchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleLocationDropdownToggle = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    if (!isLocationDropdownOpen) {
      setLocationSearchTerm('');
      setTimeout(() => {
        locationSearchInputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
            <div className="relative">
              <button
                onClick={handleProjectDropdownToggle}
                disabled={loading}
                className="w-full px-4 py-2.5 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-gray-900 dark:text-gray-100 truncate">
                  {loading ? 'Loading projects...' : error ? 'Error loading projects' : selectedProject || 'Select a project'}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-300 transition-transform ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && !loading && !error && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                    <input
                      ref={projectSearchInputRef}
                      type="text"
                      value={projectSearchTerm}
                      onChange={(e) => setProjectSearchTerm(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        handleProjectChange(project.name);
                        setProjectSearchTerm('');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 first:rounded-t-md last:rounded-b-md transition-colors"
                    >
                      <span className="truncate text-gray-900 dark:text-gray-100">{project.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <div className="relative">
              <button
                onClick={handleLocationDropdownToggle}
                disabled={loading}
                className="w-full px-4 py-2.5 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-gray-900 dark:text-gray-100 truncate">
                  {loading ? 'Loading locations...' : error ? 'Error loading locations' : selectedLocation}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-300 transition-transform ml-2 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLocationDropdownOpen && !loading && !error && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                    <input
                      ref={locationSearchInputRef}
                      type="text"
                      value={locationSearchTerm}
                      onChange={(e) => setLocationSearchTerm(e.target.value)}
                      placeholder="Search locations..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    onClick={() => {
                      handleLocationChange('All Locations');
                      setLocationSearchTerm('');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 first:rounded-t-md last:rounded-b-md transition-colors"
                  >
                    <span className="truncate text-gray-900 dark:text-gray-100">All Locations</span>
                  </button>
                  {filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => {
                        handleLocationChange(location.name);
                        setLocationSearchTerm('');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 first:rounded-t-md last:rounded-b-md transition-colors"
                    >
                      <span className="truncate text-gray-900 dark:text-gray-100">{location.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePickers(!showDatePickers)}
                className="w-full flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-pointer" />
                <span className="text-gray-900 dark:text-gray-100 ml-2">{formatDateRange()}</span>
              </button>
              {showDatePickers && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setShowDatePickers(false)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
        <div className="flex justify-end gap-3 mt-6">
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
                <ProjectReportDocument
                  projectName={selectedProject}
                  location={selectedLocation}
                  dateRange={formatDateRange()}
                  totalHours={totalHours}
                  regularHours={regularHours}
                  overtimeHours={overtimeHours}
                  ratio={ratio}
                />
              }
              fileName="Project_Report.pdf"
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
              onClick={() =>
                toast('No data to export', {
                  style: {
                    borderRadius: '10px',
                    background: 'blue',
                    color: '#fff',
                  },
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSelector;
