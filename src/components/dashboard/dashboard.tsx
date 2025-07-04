// components/ui/dashboard.tsx
"use client";

import React from 'react';
import {
  ClipboardDocumentListIcon,
  UsersIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

interface ProjectData {
  name: string;
  code: string;
  location: string;
  employees: number;
  workHours: number;
  otHours: number;
  lastUpdated: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'checkin' | 'checkout' | 'timesheet' | 'edit' | 'project';
}

interface WeeklyStats {
  totalEntries: number;
  workHours: number;
  otHours: number;
  activeEmployees: number;
}

interface DashboardProps {
  className?: string;
  stats?: {
    totalTimesheets: number;
    totalEmployees: number;
    activeLocations: number;
    daysWithTimesheets: number;
    checkedInToday: number;
    pendingCheckouts: number;
    totalOvertimeHours: number;
    missingEntries: number;
  };
  projects?: ProjectData[];
  timesheetActivity?: number[];
  recentActivity?: ActivityItem[];
  weeklyStats?: WeeklyStats;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    red: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`${colorClasses[color]} opacity-80`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ 
  className = '',
  stats = {
    totalTimesheets: 8,
    totalEmployees: 7,
    activeLocations: 2,
    daysWithTimesheets: 5,
    checkedInToday: 5,
    pendingCheckouts: 0,
    totalOvertimeHours: 21.0,
    missingEntries: 0
  },
  projects = [
    {
      name: 'Maintenance',
      code: 'MA003',
      location: 'Headquarters',
      employees: 6,
      workHours: 48.0,
      otHours: 9.0,
      lastUpdated: '5/20/2025'
    },
    {
      name: 'Bridge Renovation',
      code: 'BR005',
      location: 'West Branch',
      employees: 6,
      workHours: 48.0,
      otHours: 5.0,
      lastUpdated: '5/18/2025'
    },
    {
      name: 'Project Beta',
      code: 'PB002',
      location: 'Site B',
      employees: 4,
      workHours: 32.0,
      otHours: 2.0,
      lastUpdated: '5/21/2025'
    }
  ],
  timesheetActivity = [65, 72, 88, 105, 108, 58, 95],
  recentActivity = [
    { id: '1', user: 'John Doe', action: 'checked in', time: 'Today, 8:30 AM', type: 'checkin' },
    { id: '2', user: 'Jane Smith', action: 'checked out', time: 'Today, 5:15 PM', type: 'checkout' },
    { id: '3', user: 'Robert Johnson', action: 'submitted timesheet', time: 'Today, 5:30 PM', type: 'timesheet' },
    { id: '4', user: 'Alice Williams', action: 'edited by supervisor', time: 'Today, 6:09 PM', type: 'edit' },
    { id: '5', user: 'Project Beta', action: 'was added to locations', time: 'Yesterday, 9:00 AM', type: 'project' }
  ],
  weeklyStats = {
    totalEntries: 127,
    workHours: 1024,
    otHours: 86,
    activeEmployees: 42
  }
}) => {
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const maxActivity = Math.max(...timesheetActivity);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return <CheckIcon className="w-4 h-4 text-green-500" />;
      case 'checkout':
        return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'timesheet':
        return <ClipboardDocumentListIcon className="w-4 h-4 text-purple-500" />;
      case 'edit':
        return <EyeIcon className="w-4 h-4 text-orange-500" />;
      case 'project':
        return <MapPinIcon className="w-4 h-4 text-gray-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className={`flex-1 bg-gray-50 min-h-screen ${className}`}>
      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Timesheets Logged"
            value={stats.totalTimesheets}
            subtitle="All time"
            icon={ClipboardDocumentListIcon}
            color="blue"
          />
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            subtitle="Active roster"
            icon={UsersIcon}
            color="blue"
          />
          <StatCard
            title="Active Locations Today"
            value={stats.activeLocations}
            subtitle="Today"
            icon={MapPinIcon}
            color="blue"
          />
          <StatCard
            title="Days with Timesheets"
            value={stats.daysWithTimesheets}
            subtitle="Total logged days"
            icon={CalendarDaysIcon}
            color="blue"
          />
        </div>

        {/* Second Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Checked-in Today"
            value={stats.checkedInToday}
            subtitle="Today"
            icon={CheckIcon}
            color="green"
          />
          <StatCard
            title="Pending Check-Outs"
            value={stats.pendingCheckouts}
            subtitle="Needs attention"
            icon={ClockIcon}
            color="orange"
          />
          <StatCard
            title="Total Overtime Hours"
            value={stats.totalOvertimeHours}
            subtitle="This month"
            icon={ClockIcon}
            color="purple"
          />
          <StatCard
            title="Missing Entries"
            value={stats.missingEntries}
            subtitle="Requires action"
            icon={ExclamationTriangleIcon}
            color="red"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Project Highlights */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Project Highlights
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-500">{project.code} • {project.location}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Details
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Employees</p>
                          <p className="font-medium">{project.employees}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Work Hours</p>
                          <p className="font-medium">{project.workHours}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">OT Hours</p>
                          <p className="font-medium">{project.otHours}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Last updated: {project.lastUpdated}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Snapshot */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Weekly Snapshot</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Current Week Performance</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Entries</p>
                    <p className="text-2xl font-semibold text-gray-900">{weeklyStats.totalEntries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Work Hours</p>
                    <p className="text-2xl font-semibold text-gray-900">{weeklyStats.workHours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">OT Hours</p>
                    <p className="text-2xl font-semibold text-gray-900">{weeklyStats.otHours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Employees</p>
                    <p className="text-2xl font-semibold text-gray-900">{weeklyStats.activeEmployees}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Timesheet Activity Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Timesheet Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="relative h-64">
                  <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
                    <span>120</span>
                    <span>90</span>
                    <span>60</span>
                    <span>30</span>
                    <span>0</span>
                  </div>
                  <div className="ml-10 h-full flex items-end justify-between space-x-2">
                    {timesheetActivity.map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-blue-500 rounded-t-sm flex items-end justify-center pb-1"
                          style={{ height: `${(value / 120) * 100}%`, minHeight: '20px' }}
                        >
                          <span className="text-xs text-white font-medium">{value}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2 text-center">
                          {dayLabels[index].slice(0, 3)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span>
                  Work Hours
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user} {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;