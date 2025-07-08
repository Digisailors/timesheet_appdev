import React from 'react';
import StatCard from './StatCard';
import ProjectHoursChart from './ProjectHoursChart';

const ProjectSummary = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md mx-4 my-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Hours" value="1113" bgColor="bg-blue-100" />
        <StatCard title="Regular Hours" value="914" bgColor="bg-green-100" />
        <StatCard title="Overtime Hours" value="199" bgColor="bg-yellow-100" />
        <StatCard title="Reg/OT Ratio" value="82% / 18%" bgColor="bg-purple-100" />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
        <ProjectHoursChart />
      </div>
    </div>
  );
};

export default ProjectSummary;
