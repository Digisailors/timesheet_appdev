// src/components/dashboard/types.ts
export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

export interface ProjectData {
  name: string;
  code: string;
  location: string;
  employees: number;
  workHours: number;
  otHours: number;
  lastUpdated: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'checkin' | 'checkout' | 'timesheet' | 'edit' | 'project';
}

export interface WeeklyStats {
  totalEntries: number;
  workHours: number;
  otHours: number;
  activeEmployees: number;
}

export interface DashboardStats {
  totalTimesheets: number;
  totalEmployees: number;
  activeLocations: number;
  daysWithTimesheets: number;
  checkedInToday: number;
  pendingCheckouts: number;
  totalOvertimeHours: number;
  missingEntries: number;
}

export interface DashboardProps {
  className?: string;
  stats?: DashboardStats;
  projects?: ProjectData[];
  timesheetActivity?: number[];
  recentActivity?: ActivityItem[];
  weeklyStats?: WeeklyStats;
}