"use client";

import React from 'react';

interface ViewDialogBoxProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    name: string;
    id: string;
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-none flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Time-sheet Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.id}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Regular
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Project</p>
              <p className="font-bold">{employee.project}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-bold">{employee.location}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-bold">{employee.date}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Check In</p>
              <p className="font-bold">{employee.checkIn}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check Out</p>
              <p className="font-bold">{employee.checkOut}</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Hours</p>
                <p className={`font-bold ${employee.totalHours === '08:00' ? 'text-blue-500' : ''}`}>{employee.totalHours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Overtime</p>
                <p className={`font-bold ${employee.overtime === '00:00' ? 'text-red-500' : ''}`}>{employee.overtime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Travel Time</p>
                <p className={`font-bold ${employee.travelTime === '01:00' ? 'text-purple-500' : ''}`}>{employee.travelTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Break Time</p>
                <p className="font-bold">{employee.breakTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
