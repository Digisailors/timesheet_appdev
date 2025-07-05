import { ColumnDef } from '@tanstack/react-table';

export type TimeSheet = {
  employee: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  otHours: number;
  travelTime: string;
  location: string;
  project: string;
  status: string;
};

export const columns: ColumnDef<TimeSheet>[] = [
  {
    accessorKey: 'employee',
    header: 'Employee',
  },
  {
    accessorKey: 'checkIn',
    header: 'Check-In',
  },
  {
    accessorKey: 'checkOut',
    header: 'Check-Out',
  },
  {
    accessorKey: 'hours',
    header: 'Hours',
  },
  {
    accessorKey: 'otHours',
    header: 'OT Hours',
  },
  {
    accessorKey: 'travelTime',
    header: 'Travel Time',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'project',
    header: 'Project',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

export const mockData: TimeSheet[] = [
  {
    employee: 'John Doe',
    checkIn: '07:00',
    checkOut: '16:45',
    hours: 8,
    otHours: 1,
    travelTime: '00:00',
    location: 'Site A',
    project: 'Project Alpha (PA001)',
    status: 'Complete',
  },
  {
    employee: 'Jane Smith',
    checkIn: '07:15',
    checkOut: '16:15',
    hours: 8,
    otHours: 1,
    travelTime: '00:00',
    location: 'Site A',
    project: 'Project Alpha (PA001)',
    status: 'Complete',
  },
  {
    employee: 'Bob Johnson',
    checkIn: '07:30',
    checkOut: '15:30',
    hours: 8,
    otHours: 0,
    travelTime: '00:00',
    location: 'Site A',
    project: 'Project Alpha (PA001)',
    status: 'Complete',
  },
  {
    employee: 'Jane Smith',
    checkIn: '09:30',
    checkOut: '17:00',
    hours: 8,
    otHours: 0,
    travelTime: '00:00',
    location: 'Site B',
    project: 'Project Beta (PB002)',
    status: 'Complete',
  },
  {
    employee: 'Bob Johnson',
    checkIn: '08:30',
    checkOut: '16:15',
    hours: 8,
    otHours: 0,
    travelTime: '01:00',
    location: 'Site B',
    project: 'Project Beta (PB002)',
    status: 'Complete',
  },
];
