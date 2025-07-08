import { ColumnDef } from '@tanstack/react-table';
import { TimeSheet } from '../../types/TimeSheet';

export const getColumns = (): ColumnDef<TimeSheet>[] => [
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
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const getStatusStyle = () => {
        switch (status) {
          case 'Complete':
            return 'bg-green-200 text-green-800';
          case 'Pending':
            return 'bg-orange-200 text-orange-800';
          case 'In Progress':
            return 'bg-blue-200 text-blue-800';
          default:
            return 'bg-gray-200 text-gray-800';
        }
      };

      return (
        <span className={`px-2 py-1 rounded-full ${getStatusStyle()}`}>
          {status}
        </span>
      );
    },
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
    project: 'Project Alpha',
    status: 'Complete',
  },
  {
    employee: 'Jane Smith',
    checkIn: '08:00',
    checkOut: '17:30',
    hours: 9,
    otHours: 1,
    travelTime: '00:30',
    location: 'Site B',
    project: 'Project Beta',
    status: 'In Progress',
  },
  {
    employee: 'Bob Johnson',
    checkIn: '09:00',
    checkOut: '18:00',
    hours: 9,
    otHours: 0,
    travelTime: '00:45',
    location: 'Site C',
    project: 'Project Gamma',
    status: 'Pending',
  },
  // Add more mock data as needed
];
