'use client';

import React from 'react';

interface TimesheetActivityProps {
  timesheetData: { [day: string]: number };
}

const TimesheetActivity: React.FC<TimesheetActivityProps> = ({ timesheetData }) => {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxHours = 10;
  const heightPerHour = 20;

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">Timesheet Activity</h2>

      <div className="relative h-[220px] border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {/* Y-axis labels */}
        <div className="absolute top-0 left-0 h-full w-8 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 z-10">
          {[...Array(maxHours + 1)].map((_, i) => (
            <div key={`y-label-${i}`} className="h-[20px] flex items-center justify-end pr-1">
              {maxHours - i}
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="absolute top-0 left-8 right-0 bottom-8 flex items-end justify-between px-2 z-10">
          {dayLabels.map((day) => {
            const value = timesheetData[day] || 0;
            const barHeight = Math.min(value * heightPerHour, maxHours * heightPerHour);

            return (
              <div key={`bar-${day}`} className="relative w-8 flex flex-col items-center">
                <div
                  className="bg-blue-500 dark:bg-blue-400 w-6 rounded-t-md transition-all duration-500 ease-in-out"
                  style={{ height: `${barHeight}px` }}
                />
                {value > 0 && (
                  <span className="absolute -top-5 text-xs text-white font-semibold">
                    {value}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid lines */}
        <div className="absolute top-0 left-8 right-0 h-full z-0">
          {[...Array(maxHours + 1)].map((_, i) => (
            <div
              key={`grid-line-${i}`}
              className="absolute left-0 right-0 border-t border-gray-300 dark:border-gray-600"
              style={{ top: `${(i / maxHours) * 100}%` }}
            />
          ))}
        </div>

        {/* X-axis labels */}
        <div
          className="absolute bottom-0 left-8 right-0 border-t border-gray-300 dark:border-gray-600 flex justify-between text-xs text-gray-600 dark:text-gray-400 z-20"
          style={{ transform: 'translateY(100%)' }}
        >
          {dayLabels.map((day) => (
            <div key={`label-${day}`} className="w-8 text-center">
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimesheetActivity;
