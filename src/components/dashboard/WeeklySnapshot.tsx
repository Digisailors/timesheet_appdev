// src/components/dashboard/WeeklySnapshot.tsx
"use client";

import React from 'react';

interface WeeklyStats {
  totalEntries: number;
  workHours: number;
  otHours: number;
  activeEmployees: number;
}

interface WeeklySnapshotProps {
  weeklyStats: WeeklyStats;
}

const WeeklySnapshot: React.FC<WeeklySnapshotProps> = ({ weeklyStats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Snapshot</h2>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Current Week Performance</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Entries</p>
            <p className="text-2xl font-semibold text-gray-900">{weeklyStats.totalEntries}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Work Hours</p>
            <p className="text-2xl font-semibold text-gray-900">{weeklyStats.workHours}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">OT Hours</p>
            <p className="text-2xl font-semibold text-gray-900">{weeklyStats.otHours}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Employees</p>
            <p className="text-2xl font-semibold text-gray-900">{weeklyStats.activeEmployees}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySnapshot;