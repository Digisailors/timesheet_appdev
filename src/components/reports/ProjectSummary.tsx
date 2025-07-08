import React from 'react';
import StatCard from './StatCard';
import ProjectHoursChart from './ProjectHoursChart';

const ProjectSummary = () => {
  return (
    <div className="bg-white shadow-md rounded-xl mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Construction Phase 1 - Project Summary</h2>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <StatCard title="Total Hours" value="1113" bgColor="bg-blue-50" textColor="text-blue-600" />
            <StatCard title="Regular Hours" value="914" bgColor="bg-green-50" textColor="text-green-600" />
            <StatCard title="Overtime Hours" value="199" bgColor="bg-orange-50" textColor="text-orange-600" />
            <StatCard title="Regular/OT Ratio" value="82% / 18%" bgColor="bg-purple-50" textColor="text-purple-600" />
          </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
        <ProjectHoursChart />
      </div>
    </div>
  );
};

export default ProjectSummary;
