"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';

interface ViewDialogBoxProps {
  isOpen: boolean;
  onClose: () => void;
  timesheetId: string | null;
}

interface Employee {
  remarks: string;
  supervisorName: string;
  name: string;
  project: string;
  location: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  overtime: string;
  travelTime: string;
  breakTime: string;
  perHourRate: string;
  overtimeRate: string;
  regularTimeSalary: string;
  overTimeSalary: string;
  type: string;
  designation: string;
  designationType: string;
}

export const ViewDialogBox: React.FC<ViewDialogBoxProps> = ({ isOpen, onClose, timesheetId }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && timesheetId) {
      fetchTimesheetDetails();
    }
  }, [isOpen, timesheetId]);

  const fetchTimesheetDetails = async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/${timesheetId}`,
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          }
        }
      );
      const data = response.data.data;
      
      // Helper function to extract time from ISO timestamp
      const extractTimeFromISO = (isoString: string) => {
        const date = new Date(isoString);
        return date.toTimeString().substring(0, 5); // Returns HH:MM format
      };
      
      // Helper function to calculate time difference in hours
      const calculateTimeDifference = (startISO: string, endISO: string) => {
        const startTime = new Date(startISO).getTime();
        const endTime = new Date(endISO).getTime();
        return (endTime - startTime) / (1000 * 60 * 60);
      };
      
      // Calculate travel times
      const travelTimeInHours1 = calculateTimeDifference(data.onsiteTravelStart, data.onsiteTravelEnd);
      const travelTimeInHours2 = calculateTimeDifference(data.offsiteTravelStart, data.offsiteTravelEnd);
      const totalTravelTimeInHours = travelTimeInHours1 + travelTimeInHours2;
      const totalTravelMinutes = (totalTravelTimeInHours % 1) * 60;
      const travelTime = `${Math.floor(totalTravelTimeInHours)}:${Math.floor(totalTravelMinutes).toString().padStart(2, "0")}`;
      
      // Calculate break time
      const breakTimeInHours = calculateTimeDifference(data.onsiteBreakStart, data.onsiteBreakEnd);
      const breakMinutes = (breakTimeInHours % 1) * 60;
      const breakTime = `${Math.floor(breakTimeInHours)}:${Math.floor(breakMinutes).toString().padStart(2, "0")}`;

      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const employeeData: Employee = {
        name: data.employees?.[0]?.fullName || data.supervisor?.fullName || "Unknown",
        project: data.project.name,
        location: data.location,
        date: formatDate(data.timesheetDate),
        checkIn: extractTimeFromISO(data.onsiteSignIn),
        checkOut: extractTimeFromISO(data.onsiteSignOut),
        totalHours: data.totalDutyHrs,
        overtime: data.overtime,
        travelTime: travelTime,
        breakTime: breakTime,
        supervisorName: data.supervisorName,
        remarks: data.remarks,
        perHourRate: data.employees?.[0]?.perHourRate || "0",
        overtimeRate: data.employees?.[0]?.overtimeRate || "0",
        regularTimeSalary: data.regularTimeSalary || "0",
        overTimeSalary: data.overTimeSalary || "0",
        type: data.type,
        designation: data.employees?.[0]?.designation || "Unknown",
        designationType: typeof data.employees?.[0]?.designationType === 'object' ? data.employees?.[0]?.designationType?.name || "Unknown" : data.employees?.[0]?.designationType || "Unknown",
      };
      setEmployee(employeeData);
    } catch (error) {
      console.error("Error fetching timesheet details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md text-gray-900 dark:text-white p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md text-gray-900 dark:text-white p-6">
          <div className="text-center">Error loading data</div>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md text-gray-900 dark:text-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Time-sheet Details</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl">
              &times;
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold flex items-center">
                {employee.name}
                {employee.type === "employee" && (
                  <span className={`ml-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded`}>
                    {employee.designation}
                  </span>
                )}
              </h3>
            </div>
            <span className={`bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full`}>
              {employee.type === "employee" ? employee.designationType : "Supervisor"}
            </span>
          </div>
          {/* Rest of your JSX remains unchanged */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Project</p>
              <p className="font-bold">{employee.project}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="font-bold">{employee.location}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
              <p className="font-bold">{employee.date}</p>
            </div>
            {employee.type === "employee" && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Supervisor</p>
                <p className="font-bold">{employee.supervisorName}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check In</p>
              <p className="font-bold">{employee.checkIn}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check Out</p>
              <p className="font-bold">{employee.checkOut}</p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-bold text-center mb-2">Hours Breakdown</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Hours</p>
                <p className="font-bold text-blue-500 dark:text-blue-300">{employee.totalHours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overtime</p>
                <p className="font-bold text-red-500 dark:text-red-300">{employee.overtime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Travel Time</p>
                <p className="font-bold text-purple-500 dark:text-purple-300">{employee.travelTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Break Time</p>
                <p className="font-bold text-gray-500 dark:text-gray-300">{employee.breakTime}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <p className="text-sm font-bold text-black-500 dark:text-gray-400">Remarks</p>
              <p className="font">{employee.remarks}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-black-500 dark:text-gray-400">Today Salary</p>
              <div className="flex justify-between">
                <p className="font text-sm">For Normal Hrs ({employee.perHourRate} SAR)</p>
                <p className="font text-sm mr-5">For OT Hours ({employee.overtimeRate} SAR)</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold">SAR {employee.regularTimeSalary}</p>
                <p className="font-bold mr-20">SAR {employee.overTimeSalary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
