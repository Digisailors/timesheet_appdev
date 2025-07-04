import React from "react";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface SearchBarRowProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedDesignation: string;
  setSelectedDesignation: (v: string) => void;
  selectedProject: string;
  setSelectedProject: (v: string) => void;
}

const SearchBarRow: React.FC<SearchBarRowProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDesignation,
  setSelectedDesignation,
  selectedProject,
  setSelectedProject,
}) => (
  <div className="px-6 py-4">
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-4 w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Employees"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500 bg-white"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-3">
          {/* Designation Filter */}
          <div className="relative">
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[180px] text-sm text-gray-700 cursor-pointer"
            >
              <option>All Designations</option>
              <option>Regular</option>
              <option>Rental</option>
              <option>Coaster Driver</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Project Filter */}
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[180px] text-sm text-gray-700 cursor-pointer"
            >
              <option>All Projects</option>
              <option>Driver</option>
              <option>Plumber</option>
              <option>Factory Building</option>
              <option>Office Complex</option>
              <option>Highway Bridge</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SearchBarRow;