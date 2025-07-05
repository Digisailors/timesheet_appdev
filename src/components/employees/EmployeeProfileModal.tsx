import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  project: string;
  workHours: string;
  timeFrame: string;
  avatar: string;
  avatarBg: string;
  // Additional fields for profile view
  joinDate?: string;
  experience?: string;
  phoneNumber?: string;
  currentProject?: string;
  designationType?: string;
}

interface TimesheetEntry {
  date: string;
  project: string;
  hours: string;
  type: string;
  description: string;
}

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timesheet'>('overview');

  if (!isOpen || !employee) return null;

  // Sample timesheet data - you can replace this with real data
  const timesheetData: TimesheetEntry[] = [
    {
      date: "May 29, 2024",
      project: "Highway Bridge",
      hours: "8.5 hours",
      type: "Regular: 8h, OT: 0.5h",
      description: "Highway Bridge construction work"
    },
    {
      date: "May 27, 2024",
      project: "Highway Bridge",
      hours: "8.5 hours",
      type: "Regular: 8h, OT: 0.5h",
      description: "Highway Bridge maintenance"
    },
    {
      date: "May 26, 2024",
      project: "Highway Bridge",
      hours: "8.5 hours",
      type: "Regular: 8h, OT: 0.5h",
      description: "Highway Bridge inspection"
    },
    {
      date: "May 25, 2024",
      project: "Highway Bridge",
      hours: "8.5 hours",
      type: "Regular: 8h, OT: 0.5h",
      description: "Highway Bridge repair work"
    },
    {
      date: "May 24, 2024",
      project: "Highway Bridge",
      hours: "8.5 hours",
      type: "Regular: 8h, OT: 0.5h",
      description: "Highway Bridge assessment"
    }
  ];

  const TabButton: React.FC<{ 
    tab: 'overview' | 'timesheet'; 
    label: string; 
    isActive: boolean;
    onClick: () => void;
  }> = ({ tab, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-8 py-3 text-sm font-medium transition-all duration-200 flex-1 text-center ${
        isActive
          ? 'text-gray-900 bg-white rounded-lg shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const OverviewTab = () => (
    <div className="bg-gray-50">
      <div className="bg-white rounded-lg mx-auto max-w-2xl my-8 p-8">
        {/* Employee Avatar and Basic Info */}
        <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-100">
          <div className={`w-20 h-20 ${employee.avatarBg} rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-semibold text-xl">{employee.avatar}</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-1">{employee.name}</h3>
            <p className="text-gray-600 text-sm">{employee.email}</p>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
              <p className="text-sm text-gray-900">
                {employee.joinDate || '2023-11-15'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <p className="text-sm text-gray-900">
                {employee.phoneNumber || '98765 43210'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Project</label>
              <p className="text-sm text-gray-900">
                {employee.currentProject || employee.project}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <p className="text-sm text-gray-900">
                {employee.experience || '5 Years'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
              <p className="text-sm text-gray-900">
                {employee.email}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <p className="text-sm text-gray-900">
                {employee.designationType || 'Construction Management'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TimesheetTab = () => (
    <div className="bg-gray-50">
      <div className="bg-white rounded-lg mx-auto max-w-2xl my-8 p-8">
        <div className="space-y-3">
          {timesheetData.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">{entry.date}</p>
                    <p className="text-sm text-gray-600">{entry.project}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-gray-900">{entry.hours}</p>
                    <p className="text-xs text-gray-500">{entry.type}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl mx-4 md:mx-auto max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6  bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {employee.name} - Employee Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Full-width gray background for navigation */}
        <div className="w-full px-8 py-4">
          <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg w-full">
            <TabButton
              tab="overview"
              label="Overview"
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <TabButton
              tab="timesheet"
              label="Timesheet History"
              isActive={activeTab === 'timesheet'}
              onClick={() => setActiveTab('timesheet')}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === 'overview' ? <OverviewTab /> : <TimesheetTab />}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;