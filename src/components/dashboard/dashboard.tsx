// src/components/dashboard/dashboard.tsx
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
  // Move stats to state for dynamic updates
  const [stats, setStats] = useState({
    totalTimesheets: 8,
    totalEmployees: 7,
    activeLocations: 2,
    daysWithTimesheets: 5,
    checkedInToday: 5,
    pendingCheckouts: 0,
    totalOvertimeHours: 21.0,
    missingEntries: 0
  });
 
 //for debugging purposes
  console.log(setStats);

  // Move other data to state if you want them dynamic as well
  const [projects, setProjects] = useState([
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
  ]);
//for debugging purposes

  
 
  console.log(setProjects);

  const [timesheetActivity, setTimesheetActivity] = useState([65, 72, 88, 105, 108, 58, 95]);
  // Add a new state for the cloned chart
  const [timesheetActivity2, setTimesheetActivity2] = useState([55, 60, 70, 90, 100, 40, 80]);
  const [recentActivity, setRecentActivity] = useState([
    { id: '1', user: 'John Doe', action: 'checked in', time: 'Today, 8:30 AM', type: 'checkin' },
    { id: '2', user: 'Jane Smith', action: 'checked out', time: 'Today, 5:15 PM', type: 'checkout' },
    { id: '3', user: 'Robert Johnson', action: 'submitted timesheet', time: 'Today, 5:30 PM', type: 'timesheet' },
    { id: '4', user: 'Alice Williams', action: 'edited by supervisor', time: 'Today, 6:09 PM', type: 'edit' },
    { id: '5', user: 'Project Beta', action: 'was added to locations', time: 'Yesterday, 9:00 AM', type: 'project' }
  ]);
 //for debugging purposes
  console.log(timesheetActivity);
  console.log(setTimesheetActivity);
  console.log(setTimesheetActivity2);
  console.log(setRecentActivity);
  const [weeklyStats, setWeeklyStats] = useState({
    totalEntries: 127,
    workHours: 1024,
    otHours: 86,
    activeEmployees: 42
  });
//for debugging purposes
 console.log(setWeeklyStats);
  // Placeholder for future API integration
  useEffect(() => {
    // Example: fetch('/api/dashboard').then(res => res.json()).then(data => {
    //   setTimesheetActivity(data.timesheetActivity);
    //   setTimesheetActivity2(data.timesheetActivity2);
    // });
  }, []);

  return (
    <div className={`flex-1 bg-gray-50 min-h-screen ${className}`}>
      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
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

        {/* Second Stats Row */}
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
          {/* Left Column */}
          <div className="space-y-6">
            <ProjectHighlights projects={projects} />
            <WeeklySnapshot weeklyStats={weeklyStats} />
          </div>

          {/* Right Column */}
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