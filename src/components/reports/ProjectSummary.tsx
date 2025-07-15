import React from 'react';
import StatCard from './StatCard';
import ProjectHoursChart from './ProjectHoursChart';

const ProjectSummary = () => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl mb-6 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Construction Phase 1 - Project Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
        <StatCard
          title="Total Hours"
          value="1113"
          bgColor="bg-blue-50 dark:bg-blue-900"
          textColor="text-blue-600 dark:text-blue-300"
        />
        <StatCard
          title="Regular Hours"
          value="914"
          bgColor="bg-green-50 dark:bg-green-900"
          textColor="text-green-600 dark:text-green-300"
        />
        <StatCard
          title="Overtime Hours"
          value="199"
          bgColor="bg-orange-50 dark:bg-orange-900"
          textColor="text-orange-600 dark:text-orange-300"
        />
        <StatCard
          title="Regular/OT Ratio"
          value="82% / 18%"
          bgColor="bg-purple-50 dark:bg-purple-900"
          textColor="text-purple-600 dark:text-purple-300"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
        <ProjectHoursChart />
      </div>
    </div>
  );
};

export default ProjectSummary;
