'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  DollarSign,
  Folder,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Types
export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  employees: number;
  startDate: string;
  endDate?: string;
  budget?: string;
  description?: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  workHours: number;
  otHours: number;
  lastUpdated: string;
}

export interface ProjectManagementProps {
  projects: Project[];
  onCreateProject?: () => void;
  onViewDetails?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
  className?: string;
}

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-white',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-white',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-white',
};

// Project Card Component
const ProjectCard: React.FC<{
  project: Project;
  onViewDetails?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}> = ({ project, onViewDetails, onEditProject, onDeleteProject }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-l-4 border-blue-500 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{project.code}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{project.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{project.employees} employees</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{project.startDate}</span>
          </div>
        </div>
        {project.budget && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="text-sm">${project.budget}</span>
          </div>
        )}
        {project.description && (
          <div className="text-gray-600 dark:text-gray-400">
            <p className="text-sm line-clamp-2">{project.description}</p>
          </div>
        )}
      </div>

      <div className="flex space-x-2 justify-end mt-auto">
        <button
          onClick={() => onViewDetails?.(project)}
          className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        <button
          onClick={() => onEditProject?.(project)}
          className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Edit className="w-4 h-4 mr-1" />
        </button>
        <button
          onClick={() => onDeleteProject?.(project)}
          className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-red-400 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-1" />
        </button>
      </div>
    </div>
  );
};

// Filter Dropdown
const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 min-w-[160px]"
      >
        <span className="text-sm text-gray-700 dark:text-gray-200">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Pagination
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>

      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-2 text-sm rounded-md ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

// Main Component
const ProjectManagement: React.FC<ProjectManagementProps> = ({
  projects,
  onCreateProject,
  onViewDetails,
  onEditProject,
  onDeleteProject,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const uniqueProjects = useMemo(() => ['All Projects', ...new Set(projects.map((p) => p.name))], [projects]);
  const uniqueLocations = useMemo(() => ['All Locations', ...new Set(projects.map((p) => p.location))], [projects]);
  const statusOptions = ['Status', 'active', 'completed', 'pending', 'cancelled'];

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProject = selectedProject === 'All Projects' || project.name === selectedProject;
      const matchLocation = selectedLocation === 'All Locations' || project.location === selectedLocation;
      const matchStatus = selectedStatus === 'Status' || project.status === selectedStatus;

      return matchSearch && matchProject && matchLocation && matchStatus;
    });

    // Reset to page 1 when filters change
    setCurrentPage(1);
    return filtered;
  }, [projects, searchTerm, selectedProject, selectedLocation, selectedStatus]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`bg-gray-50 dark:bg-gray-900 flex-1 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Project Management</h1>
          </div>
          <button
            onClick={onCreateProject}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </button>
        </div>
      </div>

      <div className="m-2 px-4 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 shadow-md">
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Projects"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <FilterDropdown label="Project" value={selectedProject} options={uniqueProjects} onChange={setSelectedProject} />
            <FilterDropdown label="Location" value={selectedLocation} options={uniqueLocations} onChange={setSelectedLocation} />
            <FilterDropdown label="Status" value={selectedStatus} options={statusOptions} onChange={setSelectedStatus} />
          </div>
        </div>

        {/* Content Container with Fixed Height */}
        <div className="min-h-[600px] flex flex-col">
          {filteredProjects.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-300">No projects found matching your criteria.</p>
            </div>
          ) : (
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={onViewDetails}
                    onEditProject={onEditProject}
                    onDeleteProject={onDeleteProject}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fixed Pagination at Bottom */}
          <div className="mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;