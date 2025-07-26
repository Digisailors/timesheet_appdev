"use client";
import React, { useState, useEffect } from 'react';

interface EditDialogBoxProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
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
    supervisorName: string;
  };
  onSave: (updatedEmployee: {
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
    supervisorName: string;
  }) => void;
}

export const EditDialogBox: React.FC<EditDialogBoxProps> = ({ isOpen, onClose, employee, onSave }) => {
  const [editedEmployee, setEditedEmployee] = useState(employee);

  useEffect(() => {
    setEditedEmployee(employee);
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedEmployee);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md text-gray-900 dark:text-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Timesheet Details</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl">
              &times;
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {editedEmployee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold">{editedEmployee.name}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Project</label>
              <input
                type="text"
                name="project"
                value={editedEmployee.project}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Location</label>
              <input
                type="text"
                name="location"
                value={editedEmployee.location}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">Date</label>
            <input
              type="text"
              name="date"
              value={editedEmployee.date}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
            </div>
            <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">Supervisor Name</label>
              <input
                type="text"
                name="supervisorName"
                value={editedEmployee.supervisorName}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Check In</label>
              <input
                type="text"
                name="checkIn"
                value={editedEmployee.checkIn}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Check Out</label>
              <input
                type="text"
                name="checkOut"
                value={editedEmployee.checkOut}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-bold text-center mb-2">Hours Breakdown</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Total Hours</label>
                <input
                  type="text"
                  name="totalHours"
                  value={editedEmployee.totalHours}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Overtime</label>
                <input
                  type="text"
                  name="overtime"
                  value={editedEmployee.overtime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Travel Time</label>
                <input
                  type="text"
                  name="travelTime"
                  value={editedEmployee.travelTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Break Time</label>
                <input
                  type="text"
                  name="breakTime"
                  value={editedEmployee.breakTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};