"use client";

import React, { useEffect, useState } from 'react';
import {
  ClipboardDocumentListIcon,
  UsersIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import StatCard from './StatCard';
import ProjectHighlights from './ProjectHighlights';
import WeeklySnapshot from './WeeklySnapshot';
import TimesheetActivity from './TimesheetActivity';
import RecentActivity from './RecentActivity';
import { DashboardProps } from './types';

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const [stats, setStats] = useState({
    totalTimesheets: 78, // Hardcoded
    totalEmployees: 0,   // Fetched from API
    activeLocations: 5,
    daysWithTimesheets: 17,
    checkedInToday: 12,
    pendingCheckouts: 3,
    totalOvertimeHours: 42,
    missingEntries: 1
  });

  const projects = [
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
  ];

  const timesheetActivity2 = [55, 60, 70, 90, 100, 40, 80];

  const recentActivity = [
    { id: '1', user: 'John Doe', action: 'checked in', time: 'Today, 8:30 AM', type: 'checkin' },
    { id: '2', user: 'Jane Smith', action: 'checked out', time: 'Today, 5:15 PM', type: 'checkout' },
    { id: '3', user: 'Robert Johnson', action: 'submitted timesheet', time: 'Today, 5:30 PM', type: 'timesheet' },
    { id: '4', user: 'Alice Williams', action: 'edited by supervisor', time: 'Today, 6:09 PM', type: 'edit' },
    { id: '5', user: 'Project Beta', action: 'was added to locations', time: 'Yesterday, 9:00 AM', type: 'project' }
  ];

  const weeklyStats = {
    totalEntries: 127,
    workHours: 1024,
    otHours: 86,
    activeEmployees: 42
  };

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5088";
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${cleanBaseUrl}/api/employees/all`);
        const data = await response.json();

        setStats(prevStats => ({
          ...prevStats,
          totalEmployees: Array.isArray(data.data) ? data.data.length : 0
        }));
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className={`flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        </div>

        {/* First Stat Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

        {/* Second Stat Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Checked-in Today"
            value={stats.checkedInToday}
            subtitle="Today"
            icon={CheckCircleIcon}
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
          <div className="space-y-6">
            <ProjectHighlights projects={projects} />
            <WeeklySnapshot weeklyStats={weeklyStats} />
          </div>
          <div className="space-y-6">
            <TimesheetActivity timesheetActivity={timesheetActivity2} />
            <RecentActivity recentActivity={recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
