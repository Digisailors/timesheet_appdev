"use client";
import React, { ReactNode } from 'react';

interface ViewDialogBoxProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    supervisorName: ReactNode;
    name: string;
    // id: string;
    project: string;
    location: string;
    date: string;
    checkIn: string;
    checkOut: string;
    totalHours: string;
    overtime: string;
    travelTime: string;
    breakTime: string;
  };
}

export const ViewDialogBox: React.FC<ViewDialogBoxProps> = ({ isOpen, onClose, employee }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md text-gray-900 dark:text-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Time-sheet Details</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl">
              &times;
            </button>
          </div>

          {/* Avatar and Name */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold">{employee.name}</h3>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">{employee.id}</p> */}
            </div>
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
              Regular
            </span>
          </div>

          {/* Project / Location */}
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

          {/* Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p className="font-bold">{employee.date}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Supervisor</p>
            <p className="font-bold">{employee.supervisorName}</p>
          </div>
          </div>
          {/* Check-in/out */}
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

          {/* Hours Breakdown */}
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
        </div>
      </div>
    </div>
  );
};
