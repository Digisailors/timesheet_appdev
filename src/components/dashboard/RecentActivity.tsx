"use client";

import React from 'react';
import {
  ClipboardDocumentListIcon,
  MapPinIcon,
  CheckIcon,
  ClockIcon,
  EyeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: string; // 'checkin', 'checkout', 'timesheet', 'edit', 'project'
}

interface RecentActivityProps {
  recentActivity: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentActivity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return <CheckIcon className="w-4 h-4 text-green-500" />;
      case 'checkout':
        return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'timesheet':
        return <ClipboardDocumentListIcon className="w-4 h-4 text-purple-500" />;
      case 'edit':
        return <EyeIcon className="w-4 h-4 text-orange-500" />;
      case 'project':
        return <MapPinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
          Recent Activity
        </h2>
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mt-3 p-6">
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer group"
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.user} {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
