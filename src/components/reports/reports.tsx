"use client";

import React from "react";

 // currently unused

import ProjectSelector from "./ProjectSelector";
import ProjectSummary from "./ProjectSummary";
import EmployeeReport from "./EmployeeReport";

const ReportsPage = () => {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <ProjectSelector
        selectedProject="Project A"
        onProjectChange={() => {}}
        dateRange="01 Jan - 31 Jan"
        onDateRangeChange={() => {}}
      />
      <ProjectSummary />
      <EmployeeReport />
    </div>
  );
};

export default ReportsPage;
