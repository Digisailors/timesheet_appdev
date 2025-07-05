"use client";
import React from 'react';

const ProjectHoursChart = () => {
  return (
    <div className="mt-6 max-w-md mx-auto bg-white shadow-md border border-gray-200 rounded-xl p-6">
      <div className="text-lg font-semibold text-gray-800 mb-4">Project Hours (Monthly)</div>
      
      <div className="flex justify-between items-end h-56 bg-gray-50 rounded-md px-4 py-4 gap-8">
        {['Jan', 'Feb', 'Mar', 'Apr','may','june','july','aug','sep','nov','dec'].map((month, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Bars */}
            <div className="flex items-end gap-1">
              <div
                className="bg-blue-500 w-3 rounded-md transition-all"
                style={{ height: `${90 + index * 10}px` }} // Regular Hours
              ></div>
              <div
                className="bg-orange-400 w-3 rounded-md transition-all"
                style={{ height: `${40 + index * 5}px` }} // Overtime Hours
              ></div>
            </div>
            {/* Label */}
            <div className="text-xs mt-2 text-gray-600 font-medium">{month}</div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 inline-block rounded-sm"></span> Regular Hours
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-400 inline-block rounded-sm"></span> Overtime Hours
        </div>
      </div>
    </div>
  );
};

export default ProjectHoursChart;