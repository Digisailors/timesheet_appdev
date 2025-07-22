"use client";

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { ViewDialogBox } from "./viewdialogbox";
import { getColumns } from './columns';

export function DataTable() {
  interface TimeSheetData {
    employee: string;
    checkIn: string;
    checkOut: string;
    hours: number;
    otHours: number;
    travelTime: string;
    location: string;
    project: string;
    status: string;
    breakTime: string;
  }

  const [data, setData] = useState<TimeSheetData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TimeSheetData | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedEmployee: 'all',
    selectedProject: 'all',
    selectedLocation: 'all',
    selectedStatus: 'all'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5088/api/timesheet/all');
        const timesheets = response.data.data.flatMap((timesheet: {
          employees: { fullName: string }[];
          onsiteSignIn: string;
          onsiteSignOut: string;
          onsiteTravelStart: string;
          onsiteTravelEnd: string;
          offsiteTravelStart: string;
          offsiteTravelEnd: string;
          onsiteBreakStart: string;
          onsiteBreakEnd: string;
          project: { location: string; name: string };
          status: string;
        }) => {
          return timesheet.employees.map((employee) => {
            const checkInTime = new Date(`1970-01-01T${timesheet.onsiteSignIn}`).getTime();
            const checkOutTime = new Date(`1970-01-01T${timesheet.onsiteSignOut}`).getTime();
            const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

            const travelStartTime1 = new Date(`1970-01-01T${timesheet.onsiteTravelStart}`).getTime();
            const travelEndTime1 = new Date(`1970-01-01T${timesheet.onsiteTravelEnd}`).getTime();
            const travelTimeInHours1 = (travelEndTime1 - travelStartTime1) / (1000 * 60 * 60);

            const travelStartTime2 = new Date(`1970-01-01T${timesheet.offsiteTravelStart}`).getTime();
            const travelEndTime2 = new Date(`1970-01-01T${timesheet.offsiteTravelEnd}`).getTime();
            const travelTimeInHours2 = (travelEndTime2 - travelStartTime2) / (1000 * 60 * 60);

            const totalTravelTimeInHours = travelTimeInHours1 + travelTimeInHours2;
            const totalTravelMinutes = (totalTravelTimeInHours % 1) * 60;
            const travelTime = `${Math.floor(totalTravelTimeInHours)}:${Math.floor(totalTravelMinutes).toString().padStart(2, '0')}`;

            // Calculate break time
            const breakStartTime = new Date(`1970-01-01T${timesheet.onsiteBreakStart}`).getTime();
            const breakEndTime = new Date(`1970-01-01T${timesheet.onsiteBreakEnd}`).getTime();
            const breakTimeInHours = (breakEndTime - breakStartTime) / (1000 * 60 * 60);
            const breakMinutes = (breakTimeInHours % 1) * 60;
            const breakTime = `${Math.floor(breakTimeInHours)}:${Math.floor(breakMinutes).toString().padStart(2, '0')}`;

            return {
              employee: employee.fullName,
              checkIn: timesheet.onsiteSignIn.substring(0, 5),
              checkOut: timesheet.onsiteSignOut.substring(0, 5),
              hours: Math.floor(hoursWorked),
              otHours: 0,
              travelTime: travelTime,
              location: timesheet.project.location,
              project: timesheet.project.name,
              status: timesheet.status,
              breakTime: breakTime,
            };
          });
        });

        setData(timesheets);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(() => getColumns(), []);

  const handleViewClick = (employee: TimeSheetData) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const filteredData = useMemo(() =>
    data.filter((item: TimeSheetData) => {
      return (
        (filters.selectedEmployee === 'all' || item.employee === filters.selectedEmployee) &&
        (filters.selectedProject === 'all' || item.project === filters.selectedProject) &&
        (filters.selectedLocation === 'all' || item.location === filters.selectedLocation) &&
        (filters.selectedStatus === 'all' || item.status === filters.selectedStatus) &&
        (item.employee.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
         item.project.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }), [filters, data]);

  const getActionColumn = React.useCallback(() => {
    return {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
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
          {Array.from(new Set(data.map((item) => item.employee))).map(employee => (
            <option key={employee} value={employee}>{employee}</option>
          ))}
        </select>
        <select
          className="w-[180px] border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
          value={filters.selectedProject}
          onChange={(e) => setFilters({ ...filters, selectedProject: e.target.value })}
        >
          <option value="all">All Projects</option>
          {Array.from(new Set(data.map((item) => item.project))).map(project => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
        <select
          className="w-[180px] border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
          value={filters.selectedLocation}
          onChange={(e) => setFilters({ ...filters, selectedLocation: e.target.value })}
        >
          <option value="all">All Locations</option>
          {Array.from(new Set(data.map((item) => item.location))).map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <select
          className="w-[180px] border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
          value={filters.selectedStatus}
          onChange={(e) => setFilters({ ...filters, selectedStatus: e.target.value })}
        >
          <option value="all">All Statuses</option>
          {Array.from(new Set(data.map((item) => item.status))).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedEmployee && (
        <ViewDialogBox
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          employee={{
            name: selectedEmployee.employee,
            project: selectedEmployee.project,
            location: selectedEmployee.location,
            date: "29-05-2025",
            checkIn: selectedEmployee.checkIn,
            checkOut: selectedEmployee.checkOut,
            totalHours: `${selectedEmployee.hours}:00`,
            overtime: `${selectedEmployee.otHours}:00`,
            travelTime: selectedEmployee.travelTime,
            breakTime: selectedEmployee.breakTime,
          }}
        />
      )}
    </div>
  );
}
