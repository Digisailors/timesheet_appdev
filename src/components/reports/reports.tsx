import React, { useState, useEffect } from 'react';
import ProjectSelector from './ProjectSelector';
import ProjectSummary from './ProjectSummary';
import EmployeeReport from './EmployeeReport';

const ReportsPage = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [selectedProject, setSelectedProject] = useState('Select Project');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        if (selectedProject !== 'Select Project' && dateRange.startDate && dateRange.endDate) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all?project=${selectedProject}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
          );
          const data = await response.json();
          setTimesheetData(data.data);
        }
      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };

    fetchTimesheetData();
  }, [selectedProject, dateRange]);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <ProjectSelector
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <ProjectSummary
        timesheetData={timesheetData}
        selectedProject={selectedProject}
        dateRange={dateRange}
      />
      <EmployeeReport />
    </div>
  );
};

export default ReportsPage;
