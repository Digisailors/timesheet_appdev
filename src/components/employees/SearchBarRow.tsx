import React from "react";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface Project {
  id: string;
  name: string;
}

interface SearchBarRowProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedDesignation: string;
  setSelectedDesignation: (v: string) => void;
  selectedProject: string;
  setSelectedProject: (v: string) => void;
  projects?: Project[];
  isLoadingProjects?: boolean;
  showSearchInput?: boolean;
  showDesignationFilter?: boolean;
  showProjectFilter?: boolean;
}

const SearchBarRow: React.FC<SearchBarRowProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDesignation,
  setSelectedDesignation,
  selectedProject,
  setSelectedProject,
  projects = [],
  isLoadingProjects = false,
  showSearchInput = true,
  showDesignationFilter = true,
  showProjectFilter = true,
}) => {
  // If none of them are shown, skip rendering
  if (!showSearchInput && !showDesignationFilter && !showProjectFilter) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-4 sm:px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {showSearchInput && (
          <div className="relative flex-1 lg:flex-[2] min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Search Employees"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {showDesignationFilter && (
            <div className="relative">
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[180px] text-sm text-gray-700 dark:text-gray-100 cursor-pointer"
              >
                <option>All Designations Types</option>
                <option>Regular Employee</option>
                <option>Rental Employee</option>
                <option>Regular Driver</option>
                <option>Coaster Driver</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
              </div>
            </div>
          )}

          {showProjectFilter && (
            <div className="relative">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={isLoadingProjects}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[180px] text-sm text-gray-700 dark:text-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="All Projects">
                  {isLoadingProjects ? "Loading..." : "All Projects"}
                </option>
                {projects.length > 0 &&
                  projects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBarRow;
