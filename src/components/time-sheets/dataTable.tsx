/* eslint-disable */
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
import { EditDialogBox } from "./EditDialogBox";
import { getColumns } from "./columns";
import { TimeSheet as ImportedTimeSheet } from "../../types/TimeSheet";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSession } from "next-auth/react";

interface DataTableProps {
  selectedDate: Date | undefined;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  designation: string;
  designationType: string | object;
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
  projectcode?: string;
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

interface SelectedEmployee {
  name: string;
  travelStart: string;
  travelEnd: string;
  signIn: string;
  breakStart: string;
  breakEnd: string;
  signOut: string;
  offsiteTravelStart: string;
  offsiteTravelEnd: string;
  remarks: string;
}

interface UpdatedEmployee {
  name: string;
  travelStart: string;
  travelEnd: string;
  signIn: string;
  breakStart: string;
  breakEnd: string;
  signOut: string;
  offsiteTravelStart: string;
  offsiteTravelEnd: string;
  remarks: string;
}

interface LocalTimeSheet {
  id: string;
  employee: string;
  isSupervisor: boolean;
  designationType: string | object;
  designation: string | null;
  checkIn: string;
  checkOut: string;
  hours: number;
  otHours: number;
  travelTime: string;
  location: string;
  project: string;
  status: string;
  breakTime: string;
  timesheetDate: string;
  supervisorName: string;
  remarks: string;
  perHourRate: string;
  overtimeRate: string;
  regularTimeSalary: string;
  overTimeSalary: string;
  onsiteTravelStart: string;
  onsiteTravelEnd: string;
  onsiteSignIn: string;
  onsiteBreakStart: string;
  onsiteBreakEnd: string;
  onsiteSignOut: string;
  offsiteTravelStart: string;
  offsiteTravelEnd: string;
  typeofWork: string;
  projectcode: string;
}

export interface DataTableHandle {
  exportExcel: () => void;
  createTimesheet: (timesheetData: CreateTimesheetRequest) => Promise<void>;
}

export const DataTable = forwardRef<DataTableHandle, DataTableProps>(
  ({ selectedDate }, ref) => {
    const [data, setData] = useState<LocalTimeSheet[]>([]);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedTimesheetId, setSelectedTimesheetId] = useState<string | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployee | null>(null);
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

    const transformTimesheetData = (timesheet: TimeSheetData): LocalTimeSheet => {
      const travelStartTime1 = new Date(`1970-01-01T${timesheet.onsiteTravelStart}`).getTime();
      const travelEndTime1 = new Date(`1970-01-01T${timesheet.onsiteTravelEnd}`).getTime();
      const travelTimeInHours1 = (travelEndTime1 - travelStartTime1) / (1000 * 60 * 60);
      const travelStartTime2 = new Date(`1970-01-01T${timesheet.offsiteTravelStart}`).getTime();
      const travelEndTime2 = new Date(`1970-01-01T${timesheet.offsiteTravelEnd}`).getTime();
      const travelTimeInHours2 = (travelEndTime2 - travelStartTime2) / (1000 * 60 * 60);
      const totalTravelTimeInHours = travelTimeInHours1 + travelTimeInHours2;
      const totalTravelMinutes = (totalTravelTimeInHours % 1) * 60;
      const travelTime = `${Math.floor(totalTravelTimeInHours)}:${Math.floor(totalTravelMinutes).toString().padStart(2, "0")}`;
      const breakStartTime = new Date(`1970-01-01T${timesheet.onsiteBreakStart}`).getTime();
      const breakEndTime = new Date(`1970-01-01T${timesheet.onsiteBreakEnd}`).getTime();
      const breakTimeInHours = (breakEndTime - breakStartTime) / (1000 * 60 * 60);
      const breakMinutes = (breakTimeInHours % 1) * 60;
      const breakTime = `${Math.floor(breakTimeInHours)}:${Math.floor(breakMinutes).toString().padStart(2, "0")}`;
      const employeeName = timesheet.employees?.[0]?.fullName || timesheet.supervisor?.fullName || "Unknown";
      const isSupervisor = timesheet.type === "supervisor";
      const rawDesignationType = timesheet.employees?.[0]?.designationType || "[object Object]";
      const designationType = isSupervisor ? "Supervisor" : rawDesignationType;
      const designation = isSupervisor ? null : timesheet.employees?.[0]?.designation || null;

      return {
        id: timesheet.id,
        employee: employeeName,
        isSupervisor: isSupervisor,
        designationType: designationType,
        designation: designation,
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
        onsiteTravelStart: timesheet.onsiteTravelStart,
        onsiteTravelEnd: timesheet.onsiteTravelEnd,
        onsiteSignIn: timesheet.onsiteSignIn,
        onsiteBreakStart: timesheet.onsiteBreakStart,
        onsiteBreakEnd: timesheet.onsiteBreakEnd,
        onsiteSignOut: timesheet.onsiteSignOut,
        offsiteTravelStart: timesheet.offsiteTravelStart,
        offsiteTravelEnd: timesheet.offsiteTravelEnd,
        typeofWork: timesheet.typeofWork, 
        projectcode: timesheet.projectcode || "PRJ001",
      };
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const session = await getSession();
          if (!session?.accessToken) {
            throw new Error("No access token found");
          }
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/all`,
            {
              headers: {
                'Authorization': `Bearer ${session.accessToken}`,
              }
            }
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
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/create`,
          timesheetData,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }
        );
        if (response.data.success && response.data.data) {
          const newTimesheets = response.data.data.map(transformTimesheetData);
          setData(prevData => [...prevData, ...newTimesheets]);
        }
      } catch (error) {
        console.error("Error creating timesheet:", error);
        throw error;
      }
    }, []);

    const columns = useMemo(() => getColumns() as ColumnDef<LocalTimeSheet>[], []);

    const handleViewClick = useCallback((employee: LocalTimeSheet) => {
      setSelectedTimesheetId(employee.id);
      setIsViewDialogOpen(true);
    }, []);

    const handleEditClick = useCallback((employee: LocalTimeSheet) => {
      const employeeData: SelectedEmployee = {
        name: employee.employee,
        travelStart: employee.onsiteTravelStart || '',
        travelEnd: employee.onsiteTravelEnd || '',
        signIn: employee.onsiteSignIn || '',
        breakStart: employee.onsiteBreakStart || '',
        breakEnd: employee.onsiteBreakEnd || '',
        signOut: employee.onsiteSignOut || '',
        offsiteTravelStart: employee.offsiteTravelStart || '',
        offsiteTravelEnd: employee.offsiteTravelEnd || '',
        remarks: employee.remarks || '',
      };
      setSelectedEmployee(employeeData);
      setSelectedTimesheetId(employee.id);
      setIsEditDialogOpen(true);
    }, []);

    const handleEditSave = useCallback(async (updatedEmployee: UpdatedEmployee) => {
      try {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/update/${selectedTimesheetId}`,
          {
            name: updatedEmployee.name,
            onsiteTravelStart: updatedEmployee.travelStart,
            onsiteTravelEnd: updatedEmployee.travelEnd,
            onsiteSignIn: updatedEmployee.signIn,
            onsiteBreakStart: updatedEmployee.breakStart,
            onsiteBreakEnd: updatedEmployee.breakEnd,
            onsiteSignOut: updatedEmployee.signOut,
            offsiteTravelStart: updatedEmployee.offsiteTravelStart,
            offsiteTravelEnd: updatedEmployee.offsiteTravelEnd,
            remarks: updatedEmployee.remarks,
          },
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }
        );
        setData(prevData =>
          prevData.map(item =>
            item.id === selectedTimesheetId
              ? {
                  ...item,
                  employee: updatedEmployee.name,
                  onsiteTravelStart: updatedEmployee.travelStart,
                  onsiteTravelEnd: updatedEmployee.travelEnd,
                  onsiteSignIn: updatedEmployee.signIn,
                  onsiteBreakStart: updatedEmployee.breakStart,
                  onsiteBreakEnd: updatedEmployee.breakEnd,
                  onsiteSignOut: updatedEmployee.signOut,
                  offsiteTravelStart: updatedEmployee.offsiteTravelStart,
                  offsiteTravelEnd: updatedEmployee.offsiteTravelEnd,
                  remarks: updatedEmployee.remarks,
                }
              : item
          )
        );
        setIsEditDialogOpen(false);
        setSelectedEmployee(null);
        setSelectedTimesheetId(null);
      } catch (error) {
        console.error("Error updating timesheet:", error);
        alert("Failed to update timesheet. Please try again.");
      }
    }, [selectedTimesheetId]);

    const filteredData = useMemo(() => {
      return data.filter((item: LocalTimeSheet) => {
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

    const getActionColumn = useCallback<() => ColumnDef<LocalTimeSheet>>(() => {
      return {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: LocalTimeSheet } }) => {
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
    const tableColumns = useMemo<ColumnDef<LocalTimeSheet>[]>(
      () => [...columns, actionColumn],
      [columns, actionColumn]
    );

    const table = useReactTable<LocalTimeSheet>({
      data: filteredData,
      columns: tableColumns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    const exportExcel = useCallback(async () => {
      try {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Timesheet");
        worksheet.columns = [
          { header: "Employee", key: "employee", width: 20 },
          { header: "Designation Type", key: "designationType", width: 20 },
          { header: "Designation", key: "designation", width: 20 },
          { header: "Project", key: "project", width: 20 },
          { header: "Project Code", key: "projectcode", width: 15 },
          { header: "Location", key: "location", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Check In", key: "checkIn", width: 10 },
          { header: "Check Out", key: "checkOut", width: 10 },
          { header: "Total Hours", key: "hours", width: 12 },
          { header: "Overtime", key: "otHours", width: 10 },
          { header: "Travel Time", key: "travelTime", width: 12 },
          { header: "Break Time", key: "breakTime", width: 12 },
          { header: "Onsite Travel Start", key: "onsiteTravelStart", width: 18 },
          { header: "Onsite Travel End", key: "onsiteTravelEnd", width: 18 },
          { header: "Offsite Travel Start", key: "offsiteTravelStart", width: 18 },
          { header: "Offsite Travel End", key: "offsiteTravelEnd", width: 18 },
          { header: "Supervisor", key: "supervisorName", width: 18 },
          { header: "Type of Work", key: "typeofWork", width: 18 },
          { header: "Regular Time Salary", key: "regularTimeSalary", width: 18 },
          { header: "Overtime Salary", key: "overTimeSalary", width: 18 },
          { header: "Remarks", key: "remarks", width: 22 },
        ];

        const exportData = filteredData.map((row: LocalTimeSheet) => ({
          employee: row.employee,
          designationType: typeof row.designationType === 'string' ? row.designationType : JSON.stringify(row.designationType),
          designation: row.designation,
          project: row.project,
          projectcode: row.projectcode,
          location: row.location,
          date: formatDate(row.timesheetDate),
          checkIn: row.checkIn,
          checkOut: row.checkOut,
          hours: row.hours,
          otHours: row.otHours,
          travelTime: row.travelTime,
          breakTime: row.breakTime,
          onsiteTravelStart: row.onsiteTravelStart,
          onsiteTravelEnd: row.onsiteTravelEnd,
          offsiteTravelStart: row.offsiteTravelStart,
          offsiteTravelEnd: row.offsiteTravelEnd,
          supervisorName: row.isSupervisor ? null : row.supervisorName,
          typeofWork: row.typeofWork,
          regularTimeSalary: row.regularTimeSalary,
          overTimeSalary: row.overTimeSalary,
          remarks: row.remarks,
        }));

        worksheet.addRows(exportData);
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const selectedDateString = selectedDate ? formatDate(selectedDate.toISOString()) : formatDate(new Date().toISOString());
        saveAs(blob, `Timesheet_${selectedDateString}.xlsx`);
      } catch (error) {
        console.error("Error exporting Excel:", error);
      }
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
            {Array.from(new Set(data.flatMap(item => typeof item.designationType === 'string' ? item.designationType : JSON.stringify(item.designationType)))).map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        {cell.column.id === 'employee' ? (
                          <>
                            {row.original.employee}
                            {!row.original.isSupervisor && row.original.designationType && (
                              <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded ml-2">
                                {typeof row.original.designationType === 'string' ? row.original.designationType : JSON.stringify(row.original.designationType)}
                              </span>
                            )}
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
              )}
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
