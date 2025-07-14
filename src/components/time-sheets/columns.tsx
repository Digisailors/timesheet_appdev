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
            return 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200';
          case 'Pending':
            return 'bg-orange-200 text-orange-800 dark:bg-orange-700 dark:text-orange-200';
          case 'In Progress':
            return 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
          default:
            return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
      };

      return (
        <span className={`px-2 py-1 text-sm rounded-full font-medium ${getStatusStyle()}`}>
          {status}
        </span>
      );
    },
  },
];
