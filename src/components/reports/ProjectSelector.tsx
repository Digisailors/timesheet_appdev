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

  // Mock data - replace with your actual data
  const projects: Project[] = [
    { id: '1', name: 'Construction Phase 1 (CP001)' },
    { id: '2', name: 'Construction Phase 2 (CP002)' },
    { id: '3', name: 'Construction Phase 3 (CP003)' },
  ];

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setIsDropdownOpen(false);
    if (onProjectChange) {
      onProjectChange(value);
    }
  };

  const handleStartDateChange = (value: string) => {
    setDateRange(prev => ({
      ...prev,
      startDate: value
    }));
    if (onDateRangeChange) {
      const newRange = `${new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - ${new Date(dateRange.endDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`;
      onDateRangeChange(newRange);
    }
  };

  const handleEndDateChange = (value: string) => {
    setDateRange(prev => ({
      ...prev,
      endDate: value
    }));
    if (onDateRangeChange) {
      const newRange = `${new Date(dateRange.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - ${new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`;
      onDateRangeChange(newRange);
    }
  };

  const handleGenerateReport = () => {
    if (selectedProject && dateRange.startDate && dateRange.endDate) {
      console.log('Generating report for:', {
        project: selectedProject,
        dateRange: dateRange
      });
      // Add your report generation logic here
    }
  };

  const formatDateRange = () => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const handleCalendarClick = () => {
    setShowDatePickers(!showDatePickers);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 m-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Project</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
            >
              <span className="text-gray-900">{selectedProject}</span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectChange(project.name)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="relative">
            <div className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm">
              <button
                onClick={handleCalendarClick}
                className="flex items-center hover:bg-gray-50 rounded p-1 transition-colors"
              >
                <Calendar className="h-5 w-5 text-gray-400 mr-3 cursor-pointer" />
              </button>
              <span className="text-gray-900">{formatDateRange()}</span>
            </div>
            
            {/* Date inputs - shown when calendar is clicked */}
            {showDatePickers && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowDatePickers(false)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Optional: Add generate report button if needed */}
      <div className="mt-6 hidden">
        <button 
          onClick={handleGenerateReport}
          disabled={!selectedProject || !dateRange.startDate || !dateRange.endDate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Report
        </button>
      </div>

      {/* Optional: Report preview (hidden by default) */}
      {selectedProject && dateRange.startDate && dateRange.endDate && (
        <div className="mt-6 hidden">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Report Preview</h3>
          <p className="text-gray-600">Project: {selectedProject}</p>
          <p className="text-gray-600">Date Range: {formatDateRange()}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;