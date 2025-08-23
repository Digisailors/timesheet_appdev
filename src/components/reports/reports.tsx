import React, { useState, useEffect } from 'react';
import ProjectSelector from './ProjectSelector';
import ProjectSummary from './ProjectSummary';
import EmployeeReport from './EmployeeReport';
import { getSession } from 'next-auth/react';

const ReportsPage = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [selectedProject, setSelectedProject] = useState('Select Project');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        if (selectedProject !== 'Select Project' && dateRange.startDate && dateRange.endDate) {
          const session = await getSession();
          if (!session?.accessToken) {
            throw new Error("No access token found");
          }

          let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all?project=${selectedProject}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
          
          // Add location filter if a specific location is selected
          if (selectedLocation !== 'All Locations') {
            url += `&location=${encodeURIComponent(selectedLocation)}`;
          }

          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setTimesheetData(data.data);
        }
      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };

    fetchTimesheetData();
  }, [selectedProject, selectedLocation, dateRange]);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <ProjectSelector
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        timesheets={timesheetData}
      />
      <ProjectSummary
        timesheetData={timesheetData}
        selectedProject={selectedProject}
        selectedLocation={selectedLocation}
        dateRange={dateRange}
      />
      <EmployeeReport />
    </div>
  );
};

export default ReportsPage;
