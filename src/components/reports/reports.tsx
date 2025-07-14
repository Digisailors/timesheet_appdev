"use client";

import React from "react";
import ProjectSelector from "./ProjectSelector";
import ProjectSummary from "./ProjectSummary";
import EmployeeReport from "./EmployeeReport";

const ReportsPage = () => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Navbar removed */}
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
