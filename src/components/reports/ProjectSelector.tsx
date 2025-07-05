"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface ProjectSelectorProps {
  projects?: string[];
  selectedProject: string;
  onProjectChange: (project: string) => void;
  dateRange: string;
  onDateRangeChange: (dateRange: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects = ["Project A", "Project B", "Project C"],
  selectedProject,
  onProjectChange,
  dateRange,
  onDateRangeChange,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      const formatted = `${start.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })} - ${end.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })}`;
      onDateRangeChange(formatted);
    } else {
      onDateRangeChange("");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl mx-6 mt-6 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Projects</h2>
    <div className="flex flex-wrap gap-70 items-end">
  {/* Project Dropdown */}
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-3">
      Select Project
    </label>
    <select
      value={selectedProject}
      onChange={(e) => onProjectChange(e.target.value)}
      className="border-2 border-gray-400 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 min-w-[13rem] shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
    >
      {projects.map((proj) => (
        <option key={proj} value={proj} title={proj} className="text-gray-900 font-medium">
          {proj}
        </option>
      ))}
    </select>
  </div>

  {/* Date Range Picker with Icon */}
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      Date Range
    </label>
    <div className="relative">
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        isClearable
        placeholderText="Select date range"
        value={dateRange}
        className="border-2 border-gray-400 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 w-52 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-600"
      />
      <CalendarDaysIcon className="w-5 h-5 text-gray-700 absolute top-3 right-3 pointer-events-none" />
    </div>
  </div>
</div>

    </div>
  );
};

export default ProjectSelector;