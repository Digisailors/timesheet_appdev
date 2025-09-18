import React from "react";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import SearchableDropdown from "../ui/SearchableDropdown";

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
  availableDesignations?: string[];
  availableJobTitles?: string[];
  isLoadingProjects?: boolean;
  showSearchInput?: boolean;
  showDesignationFilter?: boolean;
  showProjectFilter?: boolean;
  selectedJobTitle: string;
  setSelectedJobTitle: (v: string) => void;
}

const SearchBarRow: React.FC<SearchBarRowProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDesignation,
  setSelectedDesignation,
  selectedProject,
  setSelectedProject,
  projects = [],
  availableDesignations = [],
  availableJobTitles = [],
  isLoadingProjects = false,
  showSearchInput = true,
  showDesignationFilter = true,
  showProjectFilter = true,
  selectedJobTitle,
  setSelectedJobTitle,
}) => {
  if (!showSearchInput && !showDesignationFilter && !showProjectFilter) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-4 sm:px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        {showSearchInput && (
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Search by name or employee ID (e.g., EMP 1)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        {/* Job Titles Filter */}
        <div className="relative min-w-[150px] flex-1">
          <SearchableDropdown
            options={["All Designations", ...availableJobTitles]}
            value={selectedJobTitle}
            onChange={setSelectedJobTitle}
            placeholder="All Designations"
            className="w-full"
          />
        </div>

        {/* Designation Types Filter */}
        {showDesignationFilter && (
          <div className="relative min-w-[150px] flex-1">
            <SearchableDropdown
              options={["All Designations Types", ...availableDesignations]}
              value={selectedDesignation}
              onChange={setSelectedDesignation}
              placeholder="All Designations Types"
              className="w-full"
            />
          </div>
        )}

        {/* Projects Filter */}
        {showProjectFilter && (
          <div className="relative min-w-[150px] flex-1">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              disabled={isLoadingProjects}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm text-gray-700 dark:text-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default SearchBarRow;
