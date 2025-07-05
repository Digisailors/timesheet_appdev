"use client";

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  Row,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewDialogBox } from "./viewdialogbox";

interface TimeSheet {
  employee: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  otHours: number;
  travelTime: string;
  location: string;
  project: string;
  status: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends TimeSheet, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TimeSheet | null>(null);

  const handleViewClick = (employee: TimeSheet) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const getActionColumn = React.useCallback((): ColumnDef<TData> => {
    return {
      id: 'actions',
      cell: ({ row }: { row: Row<TData> }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewClick(row.original)}
            className="px-3 py-1 rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            className="px-3 py-1 rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

  const tableColumns = React.useMemo(() => [...columns, actionColumn], [columns, actionColumn]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center py-4 space-x-4">
        <input placeholder="Search..." className="max-w-sm border rounded px-3 py-2" />
        <select className="w-[180px] border rounded px-3 py-2">
          <option value="all">All Employees</option>
          <option value="john">John Doe</option>
          <option value="jane">Jane Smith</option>
          <option value="bob">Bob Johnson</option>
        </select>
        <select className="w-[180px] border rounded px-3 py-2">
          <option value="all">All Projects</option>
          <option value="alpha">Project Alpha</option>
          <option value="beta">Project Beta</option>
        </select>
        <select className="w-[180px] border rounded px-3 py-2">
          <option value="all">All Locations</option>
          <option value="siteA">Site A</option>
          <option value="siteB">Site B</option>
        </select>
        <select className="w-[180px] border rounded px-3 py-2">
          <option value="all">All Statuses</option>
          <option value="complete">Complete</option>
        </select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-400">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === 'status'
                          ? 'text-black'
                          : ''
                      }
                      style={
                        cell.column.id === 'status'
                          ? { color: 'black' }
                          : cell.column.id === 'employee'
                          ? { 
                              color: '#020817',
                              fontFamily: 'Segoe UI',
                              fontWeight: 600,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0%'
                            }
                          : { color: '#020817' }
                      }
                    >
                      {cell.column.id === 'status' ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-24 text-center text-black">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
            totalHours: "08:00",
            overtime: "00:00",
            travelTime: "01:00",
            breakTime: "01:00",
          }}
        />
      )}
    </div>
  );
}