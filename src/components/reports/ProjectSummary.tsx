import React from 'react';
import StatCard from './StatCard';
import ProjectHoursChart from './ProjectHoursChart';

// Define an interface for a timesheet entry
interface TimesheetEntry {
  timesheetDate: string;
  totalDutyHrs: string;
  normalHrs: string;
  overtime: string;
  // Add other properties if they exist
}

interface ProjectSummaryProps {
  timesheetData: TimesheetEntry[]; // Use the defined interface
  selectedProject: string;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ timesheetData, selectedProject }) => {
  const totalHours = timesheetData.reduce((sum, entry) => sum + parseFloat(entry.totalDutyHrs), 0);
  const regularHours = timesheetData.reduce((sum, entry) => sum + parseFloat(entry.normalHrs), 0);
  const overtimeHours = timesheetData.reduce((sum, entry) => sum + parseFloat(entry.overtime), 0);
  const regularOTRatio = `${((regularHours / totalHours) * 100).toFixed(0)}% / ${((overtimeHours / totalHours) * 100).toFixed(0)}%`;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl mb-6 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {selectedProject} - Project Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
        <StatCard title="Total Hours" value={totalHours.toString()} bgColor="bg-blue-50 dark:bg-blue-900" textColor="text-blue-600 dark:text-blue-300" />
        <StatCard title="Regular Hours" value={regularHours.toString()} bgColor="bg-green-50 dark:bg-green-900" textColor="text-green-600 dark:text-green-300" />
        <StatCard title="Overtime Hours" value={overtimeHours.toString()} bgColor="bg-orange-50 dark:bg-orange-900" textColor="text-orange-600 dark:text-orange-300" />
        <StatCard title="Regular/OT Ratio" value={regularOTRatio} bgColor="bg-purple-50 dark:bg-purple-900" textColor="text-purple-600 dark:text-purple-300" />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
        <ProjectHoursChart timesheetData={timesheetData} />
      </div>
    </div>
  );
};

export default ProjectSummary;
