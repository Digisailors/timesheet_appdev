"use client";
import React from 'react';

const ProjectHoursChart: React.FC = () => {
  const monthsData = [
    { month: '01/01', regular: 9, overtime: 2 },
    { month: '02/01', regular: 11, overtime: 3 },
    { month: '03/01', regular: 6, overtime: 3 },
    { month: '04/01', regular: 7, overtime: 2 },
    { month: '05/01', regular: 7, overtime: 2 },
    { month: '06/01', regular: 12, overtime: 4 },
    { month: '07/01', regular: 11, overtime: 5 },
    { month: '08/01', regular: 9, overtime: 2 },
    { month: '09/01', regular: 9, overtime: 2 },
    { month: '10/01', regular: 10, overtime: 5 },
    { month: '11/01', regular: 10, overtime: 4 },
    { month: '12/01', regular: 11, overtime: 6 },
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Project Hours Chart</h3>
        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 inline-block"></span> Regular
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-400 inline-block"></span> Overtime
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
        <div className="flex">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between h-60 w-8 mr-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">12</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">9</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">6</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">3</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">0</span>
          </div>

          {/* Chart area */}
          <div className="flex-1">
            {/* Horizontal grid lines */}
            <div className="relative h-60">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-gray-200 dark:border-gray-700 w-full"></div>
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex justify-between items-end px-2">
                {monthsData.map((data, index) => (
                  <div key={index} className="flex items-end gap-1">
                    <div
                      className="bg-blue-500 w-4"
                      style={{ height: `${(data.regular / 12) * 240}px` }}
                    ></div>
                    <div
                      className="bg-orange-400 w-4"
                      style={{ height: `${(data.overtime / 12) * 240}px` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 px-2">
              {monthsData.map((data, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-300 font-medium w-9 text-center">
                  {data.month}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHoursChart;
