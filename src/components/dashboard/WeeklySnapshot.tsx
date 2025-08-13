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
    <div>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weekly Snapshot
        </h2>
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Current Week Performance
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Entries</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {weeklyStats.totalEntries}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Work Hours</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {weeklyStats.workHours}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">OT Hours</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {weeklyStats.otHours}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Employees</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {weeklyStats.activeEmployees}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySnapshot;
