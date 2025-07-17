'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Folder
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
}

export interface ProjectManagementProps {
  projects?: Project[];
  onCreateProject?: () => void;
  onViewDetails?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
  className?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Date[];
  total: number;
}

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-white',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-white',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-white',
};

// Project Card
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
          className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-black-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>

        <button
          onClick={() => onEditProject?.(project)}
          className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm text-black-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Edit className="w-4 h-4 mr-1" />
        </button>

        <button
          onClick={() => onDeleteProject?.(project)}
          className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-red-400 hover:text-red-600 transition-colors"
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
}> = ({ label, value, options, onChange }) => {
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

// Main Component
const ProjectManagement: React.FC<ProjectManagementProps> = ({

  projects: propProjects = [],

  onCreateProject,
  onViewDetails,
  onEditProject,
  onDeleteProject,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedStatus, setSelectedStatus] = useState('Status');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const apiResponse: ApiResponse = await response.json();

      if (apiResponse.success) {

        // Transform API data to match our Project interface
        const transformedProjects: Project[] = apiResponse.data.map((project: unknown) => {
          const p = project as Project;
          return {
            id: p.id,
            name: p.name,
            code: p.code,
            location: p.location,
            employees: 0, // Default value since API doesn't provide this
            startDate: p.startDate,
            endDate: p.endDate,
            budget: p.budget,
            description: p.description,
            status: p.status as 'active' | 'completed' | 'pending' | 'cancelled'
          };
        });

        setProjects(transformedProjects);
      } else {
        throw new Error(apiResponse.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const uniqueProjects = useMemo(() => ['All Projects', ...new Set(projects.map(p => p.name))], [projects]);
  const uniqueLocations = useMemo(() => ['All Locations', ...new Set(projects.map(p => p.location))], [projects]);
  const statusOptions = ['Status', 'active', 'completed', 'pending', 'cancelled'];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProject = selectedProject === 'All Projects' || project.name === selectedProject;
      const matchLocation = selectedLocation === 'All Locations' || project.location === selectedLocation;
      const matchStatus = selectedStatus === 'Status' || project.status === selectedStatus;

      return matchSearch && matchProject && matchLocation && matchStatus;
    });
  }, [projects, searchTerm, selectedProject, selectedLocation, selectedStatus]);

  if (loading) {
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
            <button onClick={onCreateProject} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </button>
          </div>
        </div>
        <div className="m-2 px-4 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 shadow-md">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-300">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <button onClick={onCreateProject} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </button>
          </div>
        </div>
        <div className="m-2 px-4 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 shadow-md">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-4">Error: {error}</p>
            <button onClick={fetchProjects} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <button onClick={onCreateProject} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-300">No projects found matching your criteria.</p>
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
  );
};

export default ProjectManagement;
