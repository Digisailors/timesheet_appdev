"use client";
import React, { useEffect, useState } from 'react';
import {
  ClipboardDocumentListIcon,
  UsersIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import StatCard from './StatCard';
import ProjectHighlights from './ProjectHighlights';
import WeeklySnapshot from './WeeklySnapshot';
import TimesheetActivity from './TimesheetActivity';
import { getSession } from 'next-auth/react'; // Import getSession
import { DashboardProps } from './types';

interface Timesheet {
  id: string;
  type: string;
  project: {
    id: string;
    name: string;
    description: string;
    PoContractNumber: string;
    clientName: string;
  };
  employees?: Array<{
    id: string;
    fullName: string;
    designation: string;
    designationType: string;
    overtimeRate: string;
    perHourRate: string;
  }>;
  supervisor?: {
    id: string;
    fullName: string;
    specialization: string;
    perHourRate: string;
    overtimeRate: string;
  };
  timesheetDate: string;
  onsiteTravelStart: string;
  onsiteTravelEnd: string;
  onsiteSignIn: string;
  onsiteBreakStart: string;
  onsiteBreakEnd: string;
  onsiteSignOut: string;
  offsiteTravelStart: string;
  offsiteTravelEnd: string;
  remarks: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isHoliday: boolean;
  normalHrs: string;
  totalBreakHrs: string;
  totalDutyHrs: string;
  totalTravelHrs: string;
  overtime: string;
  supervisorName: string;
  regularTimeSalary: string;
  overTimeSalary: string;
  typeofWork: string;
  location: string;
  projectcode: string;
}

type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const [stats, setStats] = useState({
    totalTimesheets: 0,
    totalEmployees: 0,
    activeLocations: 0,
    daysWithTimesheets: 0,
    totalOvertimeHours: 0,
    missingEntries: 0,
  });
  const [weeklyStats, setWeeklyStats] = useState({
    totalEntries: 0,
    workHours: 0,
    otHours: 0,
    activeEmployees: 0,
  });
  const [timesheetData, setTimesheetData] = useState<Record<DayOfWeek, number>>({
    'Sun': 0,
    'Mon': 0,
    'Tue': 0,
    'Wed': 0,
    'Thu': 0,
    'Fri': 0,
    'Sat': 0,
  });
  const projects = [
    {
      name: 'Maintenance',
      code: 'MA003',
      location: 'Headquarters',
      employees: 6,
      workHours: 48.0,
      otHours: 9.0,
      lastUpdated: '5/20/2025',
    },
    {
      name: 'Bridge Renovation',
      code: 'BR005',
      location: 'West Branch',
      employees: 6,
      workHours: 48.0,
      otHours: 5.0,
      lastUpdated: '5/18/2025',
    },
    {
      name: 'Project Beta',
      code: 'PB002',
      location: 'Site B',
      employees: 4,
      workHours: 32.0,
      otHours: 2.0,
      lastUpdated: '5/21/2025',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session?.accessToken) {
        console.error("No access token found");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const cleanBaseUrl = baseUrl?.replace(/\/$/, "");

      const fetchWithAuth = async (url: string) => {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        return response;
      };

      try {
        // Fetch employees
        const employeesResponse = await fetchWithAuth(`${cleanBaseUrl}/employees/all`);
        const employeesData = await employeesResponse.json();
        setStats((prevStats) => ({
          ...prevStats,
          totalEmployees: Array.isArray(employeesData.data) ? employeesData.data.length : 0,
        }));

        // Fetch timesheets
        const timesheetsResponse = await fetchWithAuth(`${cleanBaseUrl}/timesheet/all`);
        const timesheetsResult = await timesheetsResponse.json();
        if (timesheetsResult.success && Array.isArray(timesheetsResult.data)) {
          const timesheets = timesheetsResult.data as Timesheet[];
          const today = getTodayDate();
          const todayTimesheets = timesheets.filter(
            (ts: Timesheet) => ts.timesheetDate === today
          );
          const uniqueLocations = new Set<string>();
          todayTimesheets.forEach((ts: Timesheet) => {
            if (ts.location) {
              uniqueLocations.add(ts.location);
            }
          });
          setStats((prev) => ({
            ...prev,
            activeLocations: uniqueLocations.size,
          }));
          const totalOvertimeHoursAllTime = timesheets.reduce(
            (sum: number, ts: Timesheet) => sum + parseFloat(ts.overtime || '0'),
            0
          );
          const { start, end } = getCurrentWeekRange();
          const currentWeekTimesheets = timesheets.filter((ts: Timesheet) => {
            const tsDate = new Date(ts.timesheetDate);
            return tsDate >= start && tsDate <= end;
          });
          const totalEntries = currentWeekTimesheets.length;
          const totalWorkHours = currentWeekTimesheets.reduce(
            (sum: number, ts: Timesheet) => sum + parseFloat(ts.totalDutyHrs || '0'),
            0
          );
          const totalOvertimeHoursWeekly = currentWeekTimesheets.reduce(
            (sum: number, ts: Timesheet) => sum + parseFloat(ts.overtime || '0'),
            0
          );
          const uniqueEmployeeIds = new Set<string>();
          currentWeekTimesheets.forEach((ts: Timesheet) => {
            if (ts.employees) {
              ts.employees.forEach((emp: { id: string }) => uniqueEmployeeIds.add(emp.id));
            }
            if (ts.supervisor) {
              uniqueEmployeeIds.add(ts.supervisor.id);
            }
          });
          const activeEmployees = uniqueEmployeeIds.size;
          const dayCounts: Record<DayOfWeek, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
          const dayTotals: Record<DayOfWeek, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
          currentWeekTimesheets.forEach((ts: Timesheet) => {
            const day = new Date(ts.timesheetDate).toLocaleDateString('en-US', { weekday: 'short' }) as DayOfWeek;
            let totalHrs = 0;
            if (ts.employees) {
              ts.employees.forEach(() => {
                totalHrs += parseFloat(ts.normalHrs || '0') + parseFloat(ts.overtime || '0');
              });
            }
            if (ts.supervisor) {
              totalHrs += parseFloat(ts.normalHrs || '0') + parseFloat(ts.overtime || '0');
            }
            dayTotals[day] += totalHrs;
            dayCounts[day]++;
          });
          const avgData: Record<DayOfWeek, number> = {
            Sun: dayCounts.Sun ? dayTotals.Sun / dayCounts.Sun : 0,
            Mon: dayCounts.Mon ? dayTotals.Mon / dayCounts.Mon : 0,
            Tue: dayCounts.Tue ? dayTotals.Tue / dayCounts.Tue : 0,
            Wed: dayCounts.Wed ? dayTotals.Wed / dayCounts.Wed : 0,
            Thu: dayCounts.Thu ? dayTotals.Thu / dayCounts.Thu : 0,
            Fri: dayCounts.Fri ? dayTotals.Fri / dayCounts.Fri : 0,
            Sat: dayCounts.Sat ? dayTotals.Sat / dayCounts.Sat : 0,
          };
          setStats((prev) => ({
            ...prev,
            totalTimesheets: timesheets.length,
            totalOvertimeHours: parseFloat(totalOvertimeHoursAllTime.toFixed(2)),
            daysWithTimesheets: new Set(timesheets.map((ts: Timesheet) => ts.timesheetDate)).size,
          }));
          setWeeklyStats({
            totalEntries,
            workHours: parseFloat(totalWorkHours.toFixed(2)),
            otHours: parseFloat(totalOvertimeHoursWeekly.toFixed(2)),
            activeEmployees,
          });
          setTimesheetData(avgData);
        }
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }

      try {
        // Fetch missing entries
        const date= new Date()
        const missingEntriesResponse = await fetchWithAuth(`${cleanBaseUrl}/employees/allemployeebyTodaystatus/${date}`);
        const missingEntriesResult = await missingEntriesResponse.json();
        if (missingEntriesResult.success && Array.isArray(missingEntriesResult.data)) {
          const missingEntries = missingEntriesResult.data.filter(
            (emp: { isAssignedToday: boolean }) => !emp.isAssignedToday
          ).length;
          setStats((prev) => ({
            ...prev,
            missingEntries,
          }));
        }
      } catch (error) {
        console.error("Error fetching missing entries:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        </div>
        {/* First Stat Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
            subtitle="Active Employees"
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
        </div>
        {/* Second Stat Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Days with Timesheets"
            value={stats.daysWithTimesheets}
            subtitle="Total logged days"
            icon={CalendarDaysIcon}
            color="blue"
          />
          <StatCard
            title="Total Overtime Hours"
            value={stats.totalOvertimeHours}
            subtitle="Total OT"
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
            <TimesheetActivity timesheetData={timesheetData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
