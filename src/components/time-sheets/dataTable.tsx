"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { ViewDialogBox } from "./viewdialogbox";
import { getColumns } from './columns';
import { ColumnDef } from '@tanstack/react-table';
import { TimeSheet } from '../../types/TimeSheet';

interface DataTableProps {
  selectedDate: Date | undefined;
}

interface TimeCalculations {
  totalDutyHrs: number;
  ot: number;
}

export function DataTable({ selectedDate }: DataTableProps) {
  const [data, setData] = useState<TimeSheet[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TimeSheet | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedEmployee: 'all',
    selectedProject: 'all',
    selectedLocation: 'all',
    selectedStatus: 'all'
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all`);
        const timesheets = response.data.data.flatMap((timesheet: {
          employees: {
            timeCalculations: TimeCalculations;
            fullName: string;
          }[];
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
          timesheetDate: string;
          updatedAt: string;
        }) => {
          return timesheet.employees.map((employee) => {
            const travelStartTime1 = new Date(`1970-01-01T${timesheet.onsiteTravelStart}`).getTime();
            const travelEndTime1 = new Date(`1970-01-01T${timesheet.onsiteTravelEnd}`).getTime();
            const travelTimeInHours1 = (travelEndTime1 - travelStartTime1) / (1000 * 60 * 60);
            const travelStartTime2 = new Date(`1970-01-01T${timesheet.offsiteTravelStart}`).getTime();
            const travelEndTime2 = new Date(`1970-01-01T${timesheet.offsiteTravelEnd}`).getTime();
            const travelTimeInHours2 = (travelEndTime2 - travelStartTime2) / (1000 * 60 * 60);
            const totalTravelTimeInHours = travelTimeInHours1 + travelTimeInHours2;
            const totalTravelMinutes = (totalTravelTimeInHours % 1) * 60;
            const travelTime = `${Math.floor(totalTravelTimeInHours)}:${Math.floor(totalTravelMinutes).toString().padStart(2, '0')}`;
            const breakStartTime = new Date(`1970-01-01T${timesheet.onsiteBreakStart}`).getTime();
            const breakEndTime = new Date(`1970-01-01T${timesheet.onsiteBreakEnd}`).getTime();
            const breakTimeInHours = (breakEndTime - breakStartTime) / (1000 * 60 * 60);
            const breakMinutes = (breakTimeInHours % 1) * 60;
            const breakTime = `${Math.floor(breakTimeInHours)}:${Math.floor(breakMinutes).toString().padStart(2, '0')}`;

            return {
              employee: employee.fullName,
              checkIn: timesheet.onsiteSignIn.substring(0, 5),
              checkOut: timesheet.onsiteSignOut.substring(0, 5),
              hours: employee.timeCalculations.totalDutyHrs,
              otHours: employee.timeCalculations.ot,
              travelTime: travelTime,
              location: timesheet.project.location,
              project: timesheet.project.name,
              status: timesheet.status,
              breakTime: breakTime,
              timesheetDate: timesheet.timesheetDate,
              updatedAt: timesheet.updatedAt,
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

  const handleViewClick = useCallback((employee: TimeSheet) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item: TimeSheet) => {
      const itemDate = new Date(item.updatedAt).toDateString();
      const selectedDateString = selectedDate ? new Date(selectedDate).toDateString() : null;

      return (
        (filters.selectedEmployee === 'all' || item.employee === filters.selectedEmployee) &&
        (filters.selectedProject === 'all' || item.project === filters.selectedProject) &&
        (filters.selectedLocation === 'all' || item.location === filters.selectedLocation) &&
        (filters.selectedStatus === 'all' || item.status === filters.selectedStatus) &&
        (item.employee.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
         item.project.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
        (!selectedDateString || itemDate === selectedDateString)
      );
    });
  }, [filters, data, selectedDate]);

  const getActionColumn = useCallback((): ColumnDef<TimeSheet> => {
    return {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewClick(employee)}
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
        );
      }
    };
  }, [handleViewClick]);

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
            date: formatDate(selectedEmployee.timesheetDate),
            checkIn: selectedEmployee.checkIn,
            checkOut: selectedEmployee.checkOut,
            totalHours: `${selectedEmployee.hours}`,
            overtime: `${selectedEmployee.otHours}`,
            travelTime: selectedEmployee.travelTime,
            breakTime: selectedEmployee.breakTime,
          }}
        />
      )}
    </div>
  );
}
