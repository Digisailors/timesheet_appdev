import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ViewDialogBox } from "./viewdialogbox";
import { EditDialogBox } from "./EditDialogBox"; // Add this import
import { getColumns } from "./columns";
import { TimeSheet } from "../../types/TimeSheet";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface DataTableProps {
  selectedDate: Date | undefined;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  designation: string;
  designationType: string;
  perHourRate: string;
  overtimeRate: string;
}

interface Supervisor {
  id: string;
  fullName: string;
  specialization: string;
  perHourRate?: string;
  overtimeRate?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  PoContractNumber: string;
  clientName: string;
}

interface TimeSheetData {
  id: string;
  type: string;
  project: Project;
  employees?: Employee[];
  supervisor?: Supervisor;
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
  typeofWork: string;
  location: string;
  regularTimeSalary?: string;
  overTimeSalary?: string;
}

interface CreateTimesheetRequest {
  projectId: string;
  employeeIds: string[];
  timesheetDate: string;
  typeofWork: string;
  location: string;
  projectCode: string;
  onsiteTravelStart: string;
  onsiteTravelEnd: string;
  onsiteSignIn: string;
  onsiteBreakStart: string;
  onsiteBreakEnd: string;
  onsiteSignOut: string;
  offsiteTravelStart: string;
  offsiteTravelEnd: string;
  isHoliday: boolean;
  remarks: string;
  status: string;
  supervisorId: string;
}

export interface DataTableHandle {
  exportExcel: () => void;
  createTimesheet: (timesheetData: CreateTimesheetRequest) => Promise<void>;
}

export const DataTable = forwardRef<DataTableHandle, DataTableProps>(
  function DataTable({ selectedDate }, ref) {
    const [data, setData] = useState<TimeSheet[]>([]);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Add this state
    const [selectedTimesheetId, setSelectedTimesheetId] = useState<string | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null); // Add this state
    const [filters, setFilters] = useState({
      searchTerm: "",
      selectedDesignationType: "all",
      selectedProject: "all",
      selectedLocation: "all",
      selectedStatus: "all",
    });

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const transformTimesheetData = (timesheet: TimeSheetData) => {
      const travelStartTime1 = new Date(
        `1970-01-01T${timesheet.onsiteTravelStart}`
      ).getTime();
      const travelEndTime1 = new Date(
        `1970-01-01T${timesheet.onsiteTravelEnd}`
      ).getTime();
      const travelTimeInHours1 = (travelEndTime1 - travelStartTime1) / (1000 * 60 * 60);
      const travelStartTime2 = new Date(
        `1970-01-01T${timesheet.offsiteTravelStart}`
      ).getTime();
      const travelEndTime2 = new Date(
        `1970-01-01T${timesheet.offsiteTravelEnd}`
      ).getTime();
      const travelTimeInHours2 = (travelEndTime2 - travelStartTime2) / (1000 * 60 * 60);
      const totalTravelTimeInHours = travelTimeInHours1 + travelTimeInHours2;
      const totalTravelMinutes = (totalTravelTimeInHours % 1) * 60;
      const travelTime = `${Math.floor(totalTravelTimeInHours)}:${Math.floor(
        totalTravelMinutes
      )
        .toString()
        .padStart(2, "0")}`;
      const breakStartTime = new Date(
        `1970-01-01T${timesheet.onsiteBreakStart}`
      ).getTime();
      const breakEndTime = new Date(
        `1970-01-01T${timesheet.onsiteBreakEnd}`
      ).getTime();
      const breakTimeInHours = (breakEndTime - breakStartTime) / (1000 * 60 * 60);
      const breakMinutes = (breakTimeInHours % 1) * 60;
      const breakTime = `${Math.floor(breakTimeInHours)}:${Math.floor(breakMinutes)
        .toString()
        .padStart(2, "0")}`;

      // Determine the employee name and append " (Supervisor)" if the type is "supervisor"
      const employeeName = timesheet.employees?.[0]?.fullName || timesheet.supervisor?.fullName || "Unknown";
      const isSupervisor = timesheet.type === "supervisor";
      const designationType = timesheet.employees?.[0]?.designationType || "Unknown";

      return {
        id: timesheet.id,
        employee: employeeName,
        isSupervisor: isSupervisor,
        designationType: designationType,
        checkIn: timesheet.onsiteSignIn.substring(0, 5),
        checkOut: timesheet.onsiteSignOut.substring(0, 5),
        hours: parseFloat(timesheet.totalDutyHrs),
        otHours: parseFloat(timesheet.overtime),
        travelTime: travelTime,
        location: timesheet.location,
        project: timesheet.project.name,
        status: timesheet.status,
        breakTime: breakTime,
        timesheetDate: timesheet.timesheetDate,
        supervisorName: timesheet.supervisorName,
        remarks: timesheet.remarks,
        perHourRate: timesheet.employees?.[0]?.perHourRate || timesheet.supervisor?.perHourRate || "0",
        overtimeRate: timesheet.employees?.[0]?.overtimeRate || timesheet.supervisor?.overtimeRate || "0",
        regularTimeSalary: timesheet.regularTimeSalary || "0",
        overTimeSalary: timesheet.overTimeSalary || "0",
      };
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all`
          );
          const timesheets = response.data.data.map(transformTimesheetData);
          setData(timesheets);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, []);

    const createTimesheet = useCallback(async (timesheetData: CreateTimesheetRequest) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/create`,
          timesheetData
        );
        
        if (response.data.success && response.data.data) {
          // Transform the new timesheet data and add to existing data
          const newTimesheets = response.data.data.map(transformTimesheetData);
          setData(prevData => [...prevData, ...newTimesheets]);
        }
      } catch (error) {
        console.error("Error creating timesheet:", error);
        throw error;
      }
    }, []);

    const columns = useMemo(() => getColumns(), []);

    const handleViewClick = useCallback((employee: TimeSheet) => {
      setSelectedTimesheetId(employee.id);
      setIsViewDialogOpen(true);
    }, []);

    const handleEditClick = useCallback((employee: TimeSheet) => {
      // Transform TimeSheet data to match EditDialogBox expected format
      const employeeData = {
        name: employee.employee,
        project: employee.project,
        location: employee.location,
        date: formatDate(employee.timesheetDate),
        checkIn: employee.checkIn,
        checkOut: employee.checkOut,
        totalHours: employee.hours.toString(),
        overtime: employee.otHours.toString(),
        travelTime: employee.travelTime,
        breakTime: employee.breakTime,
        supervisorName: employee.supervisorName,
        remarks: employee.remarks,
      };
      setSelectedEmployee(employeeData);
      setSelectedTimesheetId(employee.id);
      setIsEditDialogOpen(true);
    }, []);

    // Add save handler for edit dialog
    const handleEditSave = useCallback(async (updatedEmployee: any) => {
      try {
        // API call to update the timesheet on the server
        await axios.put(`http://localhost:5088/api/timesheet/update/${selectedTimesheetId}`, {
          name: updatedEmployee.name,
          project: updatedEmployee.project,
          location: updatedEmployee.location,
          checkIn: updatedEmployee.checkIn,
          checkOut: updatedEmployee.checkOut,
          totalHours: updatedEmployee.totalHours,
          overtime: updatedEmployee.overtime,
          travelTime: updatedEmployee.travelTime,
          breakTime: updatedEmployee.breakTime,
          supervisorName: updatedEmployee.supervisorName,
          remarks: updatedEmployee.remarks,
          status: updatedEmployee.status,
        });

        // Update the local state after successful API call
        setData(prevData => 
          prevData.map(item => 
            item.id === selectedTimesheetId 
              ? {
                  ...item,
                  employee: updatedEmployee.name,
                  project: updatedEmployee.project,
                  location: updatedEmployee.location,
                  checkIn: updatedEmployee.checkIn,
                  checkOut: updatedEmployee.checkOut,
                  hours: parseFloat(updatedEmployee.totalHours),
                  otHours: parseFloat(updatedEmployee.overtime),
                  travelTime: updatedEmployee.travelTime,
                  breakTime: updatedEmployee.breakTime,
                  supervisorName: updatedEmployee.supervisorName,
                  remarks: updatedEmployee.remarks,
                  status: updatedEmployee.status,
                }
              : item
          )
        );
        
        setIsEditDialogOpen(false);
        setSelectedEmployee(null);
        setSelectedTimesheetId(null);
      } catch (error) {
        console.error("Error updating timesheet:", error);
        // You can add user-friendly error handling here
        alert("Failed to update timesheet. Please try again.");
      }
    }, [selectedTimesheetId]);

    const filteredData = useMemo(() => {
      return data.filter((item: TimeSheet) => {
        const itemDate = new Date(item.timesheetDate).toDateString();
        const selectedDateString = selectedDate ? new Date(selectedDate).toDateString() : null;
        return (
          (filters.selectedDesignationType === "all" || item.designationType === filters.selectedDesignationType) &&
          (filters.selectedProject === "all" || item.project === filters.selectedProject) &&
          (filters.selectedLocation === "all" || item.location === filters.selectedLocation) &&
          (filters.selectedStatus === "all" || item.status === filters.selectedStatus) &&
          (item.employee.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            item.project.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
          (!selectedDateString || itemDate === selectedDateString)
        );
      });
    }, [filters, data, selectedDate]);

    const getActionColumn = useCallback((): ColumnDef<TimeSheet> => {
      return {
        id: "actions",
        header: "Actions",
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
                onClick={() => handleEditClick(employee)}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Edit
              </button>
            </div>
          );
        },
      };
    }, [handleViewClick, handleEditClick]);

    const actionColumn = getActionColumn();
    const tableColumns = useMemo(() => [...columns, actionColumn], [columns, actionColumn]);

    const table = useReactTable({
      data: filteredData,
      columns: tableColumns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    const exportExcel = useCallback(async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Timesheet");
      worksheet.columns = [
        { header: "Employee", key: "employee", width: 20 },
        { header: "Project", key: "project", width: 20 },
        { header: "Location", key: "location", width: 15 },
        { header: "Date", key: "date", width: 15 },
        { header: "Check In", key: "checkIn", width: 10 },
        { header: "Check Out", key: "checkOut", width: 10 },
        { header: "Total Hours", key: "hours", width: 12 },
        { header: "Overtime", key: "otHours", width: 10 },
        { header: "Travel Time", key: "travelTime", width: 12 },
        { header: "Break Time", key: "breakTime", width: 12 },
        { header: "Supervisor", key: "supervisorName", width: 18 },
        { header: "Remarks", key: "remarks", width: 22 },
        { header: "Status", key: "status", width: 10 },
      ];

      const exportData = filteredData.map((row) => ({
        employee: row.employee,
        project: row.project,
        location: row.location,
        date: formatDate(row.timesheetDate),
        checkIn: row.checkIn,
        checkOut: row.checkOut,
        hours: row.hours,
        otHours: row.otHours,
        travelTime: row.travelTime,
        breakTime: row.breakTime,
        supervisorName: row.supervisorName,
        remarks: row.remarks,
        status: row.status,
      }));

      worksheet.addRows(exportData);
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const selectedDateString = selectedDate ? formatDate(selectedDate.toISOString()) : formatDate(new Date().toISOString());
      saveAs(blob, `Timesheet_${selectedDateString}.xlsx`);
    }, [filteredData, selectedDate]);

    useImperativeHandle(ref, () => ({
      exportExcel,
      createTimesheet,
    }));

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
            className="w-[180px] text-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
            value={filters.selectedDesignationType}
            onChange={(e) => setFilters({ ...filters, selectedDesignationType: e.target.value })}
          >
            <option value="all">All Designation Types</option>
            <option value="Regular Employee">Regular Employee</option>
            <option value="Rental Employee">Rental Employee</option>
            <option value="Regular Driver">Regular Driver</option>
            <option value="Coaster Driver">Coaster Driver</option>
          </select>
          <select
            className="w-[180px] text-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
            value={filters.selectedProject}
            onChange={(e) => setFilters({ ...filters, selectedProject: e.target.value })}
          >
            <option value="all">All Projects</option>
            {Array.from(new Set(data.map((item) => item.project))).map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
          <select
            className="w-[180px] text-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
            value={filters.selectedLocation}
            onChange={(e) => setFilters({ ...filters, selectedLocation: e.target.value })}
          >
            <option value="all">All Locations</option>
            {Array.from(new Set(data.map((item) => item.location))).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <select
            className="w-[180px] text-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
            value={filters.selectedStatus}
            onChange={(e) => setFilters({ ...filters, selectedStatus: e.target.value })}
          >
            <option value="all">All Statuses</option>
            {Array.from(new Set(data.map((item) => item.status))).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left p-2 text-gray-600 dark:text-gray-300 border-b dark:border-gray-700"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {
                table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-2 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                          {cell.column.id === 'employee' ? (
                            <>
                              {row.original.employee}
                              {row.original.isSupervisor && (
                                <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded ml-2">
                                  Supervisor
                                </span>
                              )}
                            </>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
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
                )
              }
            </tbody>
          </table>
        </div>
        <ViewDialogBox
          isOpen={isViewDialogOpen}
          onClose={() => {
            setIsViewDialogOpen(false);
            setSelectedTimesheetId(null);
          }}
          timesheetId={selectedTimesheetId}
        />
        {selectedEmployee && (
          <EditDialogBox
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedEmployee(null);
              setSelectedTimesheetId(null);
            }}
            employee={selectedEmployee}
            onSave={handleEditSave}
          />
        )}
      </div>
    );
  }
);