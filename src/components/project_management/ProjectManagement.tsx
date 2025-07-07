// src/components/project_management/ProjectManagement.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Users, Calendar, Eye, Edit, Trash2, Plus, ChevronDown, DollarSign, Folder } from 'lucide-react';

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
}

export interface ProjectManagementProps {
  projects: Project[];
  onCreateProject?: () => void;
  onViewDetails?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
  className?: string;
}

// Status color mapping
const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Project Card Component
const ProjectCard: React.FC<{
  project: Project;
  onViewDetails?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}> = ({ project, onViewDetails, onEditProject, onDeleteProject }) => {
  return (
    <div className="bg-white rounded-lg border-l-4 border-blue-500 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <p className="text-gray-600 text-sm">{project.code}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{project.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{project.employees} employees</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{project.startDate}</span>
          </div>
        </div>

        {project.budget && (
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="text-sm">${project.budget}</span>
          </div>
        )}

        {project.description && (
          <div className="text-gray-600">
            <p className="text-sm line-clamp-2">{project.description}</p>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2 justify-end mt-auto">
        <button
          onClick={() => onViewDetails?.(project)}
          className="flex items-center border border-gray-200 rounded-lg px-3 py-1 text-sm text-black-600 hover:text-blue-600 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
  


        <button
          onClick={() => onEditProject?.(project)}
          className="flex items-center border border-gray-200 rounded-lg px-2 py-1 text-sm text-black-600 hover:text-blue-600 transition-colors"
        >
          <Edit className="w-4 h-4 mr-1" />
        </button>
        
        <button
          onClick={() => onDeleteProject?.(project)}
          className="flex items-center border border-gray-200 rounded-lg px-3 py-1 text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
        </button>
      </div>
    </div>
  );
};

// Filter Dropdown Component
const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
console.log(label, value, options, onChange);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[160px]"
      >
        <span className="text-sm text-gray-700">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Project Management Component
const ProjectManagement: React.FC<ProjectManagementProps> = ({
  projects = [],
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

  // Get unique values for filters
  const uniqueProjects = useMemo(() => {
    const names = [...new Set(projects.map(p => p.name))];
    return ['All Projects', ...names];
  }, [projects]);

  const uniqueLocations = useMemo(() => {
    const locations = [...new Set(projects.map(p => p.location))];
    return ['All Locations', ...locations];
  }, [projects]);

  const statusOptions = ['Status', 'active', 'completed', 'pending', 'cancelled'];

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = selectedProject === 'All Projects' || project.name === selectedProject;
      const matchesLocation = selectedLocation === 'All Locations' || project.location === selectedLocation;
      const matchesStatus = selectedStatus === 'Status' || project.status === selectedStatus;
      
      return matchesSearch && matchesProject && matchesLocation && matchesStatus;
    });
  }, [projects, searchTerm, selectedProject, selectedLocation, selectedStatus]);

  return (
    <div className={`bg-gray-50 flex-1 ${className}`}>
      {/* Header */}
      <div className="">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center">
                <Folder className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Project Management</h1>
            </div>
            
            <button
              onClick={onCreateProject}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </button>
          </div>
        </div>
      </div>

      {/* Combined Content Container - Filters and Projects */}
      <div className="m-2 px-4 py-4 bg-white rounded-lg shadow-sm border border-gray-200 shadow-md">
        {/* Filters Section */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Projects"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <FilterDropdown
              label="Project"
              value={selectedProject}
              options={uniqueProjects}
              onChange={setSelectedProject}
            />
            
            <FilterDropdown
              label="Location"
              value={selectedLocation}
              options={uniqueLocations}
              onChange={setSelectedLocation}
            />
            
            <FilterDropdown
              label="Status"
              value={selectedStatus}
              options={statusOptions}
              onChange={setSelectedStatus}
            />
          </div>
        </div>

        {/* Projects Grid Section */}
        <div className="">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={onViewDetails}
                  onEditProject={onEditProject}
                  onDeleteProject={onDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;