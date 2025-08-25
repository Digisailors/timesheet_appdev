import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign } from 'lucide-react';
import ProjectSelector from './ProjectSelector';
import ProjectSummary from './ProjectSummary';
import EmployeeReport from './EmployeeReport';
import SalaryReport from './SalaryReport';
import { getSession } from 'next-auth/react';

type ReportTab = 'project' | 'employee' | 'salary';

const ReportsPage = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [selectedProject, setSelectedProject] = useState('Select Project');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [activeTab, setActiveTab] = useState<ReportTab>('project');

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

  const tabs = [
    { id: 'project' as const, label: 'Project Reports', icon: FileText },
    { id: 'employee' as const, label: 'Employee Reports', icon: Users },
    { id: 'salary' as const, label: 'Salary Reports', icon: DollarSign },
  ];

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          {/* <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reports Dashboard</h1> */}
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'project' && (
          <>
            <ProjectSelector
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              timesheets={timesheetData}
            />
            <div className="p-6">
              <ProjectSummary
                timesheetData={timesheetData}
                selectedProject={selectedProject}
                selectedLocation={selectedLocation}
                dateRange={dateRange}
              />
            </div>
          </>
        )}

        {activeTab === 'employee' && (
          <div className="p-6">
            <EmployeeReport />
          </div>
        )}

        {activeTab === 'salary' && (
          <SalaryReport />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;