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
import { getColumns, mockData } from './columns';
import { TimeSheet } from '../../types/TimeSheet';

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
      cell: ({ row }: { row: Row<TimeSheet> }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewClick(row.original)}
            className="px-3 py-1 rounded border hover:bg-gray-50"
            style={{
              borderColor: '#020817',
              backgroundColor: 'white',
              color: '#020817',
              fontFamily: 'Segoe UI',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0%',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          >
            View
          </button>
          <button
            className="px-3 py-1 rounded border hover:bg-gray-50"
            style={{
              borderColor: '#020817',
              backgroundColor: 'white',
              color: '#020817',
              fontFamily: 'Segoe UI',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0%',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          >
            Edit
          </button>
        </div>
      ),
      header: 'Actions',
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
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center py-4 space-x-4">
        <input
          placeholder="Search..."
          className="max-w-sm border rounded px-3 py-2"
          value={filters.searchTerm}
          onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
        />
        <select
          className="w-[180px] border rounded px-3 py-2"
          value={filters.selectedEmployee}
          onChange={(e) => setFilters({...filters, selectedEmployee: e.target.value})}
        >
          <option value="all">All Employees</option>
          <option value="John Doe">John Doe</option>
          <option value="Jane Smith">Jane Smith</option>
          <option value="Bob Johnson">Bob Johnson</option>
        </select>
        <select
          className="w-[180px] border rounded px-3 py-2"
          value={filters.selectedProject}
          onChange={(e) => setFilters({...filters, selectedProject: e.target.value})}
        >
          <option value="all">All Projects</option>
          <option value="Project Alpha">Project Alpha</option>
          <option value="Project Beta">Project Beta</option>
          <option value="Project Gamma">Project Gamma</option>
        </select>
        <select
          className="w-[180px] border rounded px-3 py-2"
          value={filters.selectedLocation}
          onChange={(e) => setFilters({...filters, selectedLocation: e.target.value})}
        >
          <option value="all">All Locations</option>
          <option value="Site A">Site A</option>
          <option value="Site B">Site B</option>
          <option value="Site C">Site C</option>
        </select>
        <select
          className="w-[180px] border rounded px-3 py-2"
          value={filters.selectedStatus}
          onChange={(e) => setFilters({...filters, selectedStatus: e.target.value})}
        >
          <option value="all">All Statuses</option>
          <option value="Complete">Complete</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-2 border-b text-gray-400">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b text-black">
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
