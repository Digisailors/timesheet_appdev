import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface Project {
  id: string;
  name: string;
}

interface ProjectSelectorProps {
  selectedProject?: string;
  onProjectChange?: (project: string) => void;
  dateRange: DateRange;
  onDateRangeChange?: (dateRange: DateRange) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProject: propSelectedProject,
  onProjectChange,
  dateRange,
  onDateRangeChange,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(propSelectedProject || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDatePickers, setShowDatePickers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          const fetchedProjects = result.data.map((project: { id: string; name: string }) => ({
            id: project.id,
            name: project.name,
          }));

          setProjects(fetchedProjects);

          if (!propSelectedProject && fetchedProjects.length > 0) {
            setSelectedProject(fetchedProjects[0].name);
            onProjectChange?.(fetchedProjects[0].name);
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        console.error('Error fetching projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [propSelectedProject, onProjectChange]);

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setIsDropdownOpen(false);
    onProjectChange?.(value);
  };

  const handleStartDateChange = (value: string) => {
    const newDateRange = { ...dateRange, startDate: value };
    onDateRangeChange?.(newDateRange);
  };

  const handleEndDateChange = (value: string) => {
    const newDateRange = { ...dateRange, endDate: value };
    onDateRangeChange?.(newDateRange);
  };

  const formatDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return 'Select a Date Range';
    }

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    return `${start.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} - ${end.toLocaleDateString(
      'en-US',
      { month: 'short', day: '2-digit', year: 'numeric' }
    )}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={loading}
                className="w-full px-4 py-2.5 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-gray-900 dark:text-gray-100 truncate">
                  {loading ? 'Loading projects...' : error ? 'Error loading projects' : selectedProject || 'Select a project'}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-300 transition-transform ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && !loading && !error && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectChange(project.name)}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 first:rounded-t-md last:rounded-b-md transition-colors"
                    >
                      <span className="truncate text-gray-900 dark:text-gray-100">{project.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePickers(!showDatePickers)}
                className="w-full flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-pointer" />
                <span className="text-gray-900 dark:text-gray-100 ml-2">{formatDateRange()}</span>
              </button>
              {showDatePickers && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setShowDatePickers(false)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelector;
