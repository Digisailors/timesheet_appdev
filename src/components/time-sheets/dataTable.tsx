"use client";
import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  Row,
} from '@tanstack/react-table';
import { ViewDialogBox } from "./viewdialogbox";
import { getColumns } from './columns';
import { TimeSheet } from '../../types/TimeSheet';

const mockData: TimeSheet[] = [
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
  }
];

export function DataTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TimeSheet | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedEmployee: 'all',
    selectedProject: 'all',
    selectedLocation: 'all',
    selectedStatus: 'all'
  });

  const columns = useMemo(() => getColumns(), []);

  const handleViewClick = (employee: TimeSheet) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const filteredData = useMemo(() =>
    mockData.filter((item) => {
      return (
        (filters.selectedEmployee === 'all' || item.employee === filters.selectedEmployee) &&
        (filters.selectedProject === 'all' || item.project === filters.selectedProject) &&
        (filters.selectedLocation === 'all' || item.location === filters.selectedLocation) &&
        (filters.selectedStatus === 'all' || item.status === filters.selectedStatus) &&
        (item.employee.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
         item.project.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }), [filters]);

  const getActionColumn = React.useCallback((): ColumnDef<TimeSheet> => {
    return {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: Row<TimeSheet> }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewClick(row.original)}
            className="px-3 py-1 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            View
          </button>
          <button
            className="px-3 py-1 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Edit
          </button>
        </div>
      )
    };
  }, []);

  const actionColumn = getActionColumn();
  const tableColumns = useMemo(() => [...columns, actionColumn], [columns, actionColumn]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow">
      <div className="flex flex-wrap items-center py-4 gap-4">
        <input
          placeholder="Search..."
          className="max-w-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
        <select
          className="w-[180px] border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
          value={filters.selectedEmployee}
          onChange={(e) => setFilters({ ...filters, selectedEmployee: e.target.value })}
        >
          <option value="all">All Employees</option>
          <option value="John Doe">John Doe</option>
          <option value="Jane Smith">Jane Smith</option>
          <option value="Bob Johnson">Bob Johnson</option>
        </select>
        <select
          className="w-[180px] border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
          value={filters.selectedProject}
          onChange={(e) => setFilters({ ...filters, selectedProject: e.target.value })}
        >
          <option value="all">All Projects</option>
          <option value="Project Alpha">Project Alpha</option>
          <option value="Project Beta">Project Beta</option>
          <option value="Project Gamma">Project Gamma</option>
        </select>
        <select
          className="w-[180px] border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
          value={filters.selectedLocation}
          onChange={(e) => setFilters({ ...filters, selectedLocation: e.target.value })}
        >
          <option value="all">All Locations</option>
          <option value="Site A">Site A</option>
          <option value="Site B">Site B</option>
          <option value="Site C">Site C</option>
        </select>
        <select
          className="w-[180px] border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
          value={filters.selectedStatus}
          onChange={(e) => setFilters({ ...filters, selectedStatus: e.target.value })}
        >
          <option value="all">All Statuses</option>
          <option value="Complete">Complete</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-2 text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedEmployee && (
        <ViewDialogBox
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          employee={{
            name: selectedEmployee.employee,
            id: "EMP-001",
            project: selectedEmployee.project,
            location: selectedEmployee.location,
            date: "29-05-2025",
            checkIn: selectedEmployee.checkIn,
            checkOut: selectedEmployee.checkOut,
            totalHours: `${selectedEmployee.hours}:00`,
            overtime: `${selectedEmployee.otHours}:00`,
            travelTime: selectedEmployee.travelTime,
            breakTime: "01:00",
          }}
        />
      )}
    </div>
  );
}
