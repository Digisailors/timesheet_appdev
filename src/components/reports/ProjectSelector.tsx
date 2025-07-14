import React, { useState } from 'react';
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
  dateRange?: string;
  onDateRangeChange?: (dateRange: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProject: propSelectedProject,
  onProjectChange,
  dateRange: propDateRange,
  onDateRangeChange
}) => {
  const [selectedProject, setSelectedProject] = useState<string>(propSelectedProject || 'Construction Phase 1 (CP001)');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2025-01-01',
    endDate: '2025-05-21'
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDatePickers, setShowDatePickers] = useState(false);

  const projects: Project[] = [
    { id: '1', name: 'Construction Phase 1 (CP001)' },
    { id: '2', name: 'Construction Phase 2 (CP002)' },
    { id: '3', name: 'Construction Phase 3 (CP003)' },
  ];

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setIsDropdownOpen(false);
    onProjectChange?.(value);
  };

  const handleStartDateChange = (value: string) => {
    setDateRange(prev => ({ ...prev, startDate: value }));
    if (onDateRangeChange) {
      const newRange = `${new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - ${new Date(dateRange.endDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`;
      onDateRangeChange(newRange);
    }
  };

  const handleEndDateChange = (value: string) => {
    setDateRange(prev => ({ ...prev, endDate: value }));
    if (onDateRangeChange) {
      const newRange = `${new Date(dateRange.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - ${new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`;
      onDateRangeChange(newRange);
    }
  };

  const formatDateRange = () => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Project</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-900 dark:text-gray-100 truncate">{selectedProject}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-300 transition-transform ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
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

          {/* Date Range Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
            <div className="relative">
              <div className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <button
                  onClick={() => setShowDatePickers(!showDatePickers)}
                  className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors -ml-1"
                >
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-pointer" />
                </button>
                <span className="text-gray-900 dark:text-gray-100 ml-2">{formatDateRange()}</span>
              </div>

              {showDatePickers && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
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
