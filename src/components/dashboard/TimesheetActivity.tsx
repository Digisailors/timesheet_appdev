// src/components/dashboard/TimesheetActivity.tsx
"use client";

import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface TimesheetActivityProps {
    timesheetActivity: number[];
}

const TimesheetActivity: React.FC<TimesheetActivityProps> = ({ timesheetActivity }) => {
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const gridLines = [0, 30, 60, 90, 120];

    return (
        <div >
            <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    Timesheet Activity
                </h2>
            </div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg p-4 mt-4">
                <div className="relative h-64">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0  border-t  bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
                        <span>120</span>
                        <span>90</span>
                        <span>60</span>
                        <span>30</span>
                        <span>0</span>
                    </div>
                    
                    {/* Grid lines - behind everything */}
                    <div className="absolute left-8 right-0 top-0  border-l bottom-0 z-0">
                        {/* Horizontal grid lines */}
                        {gridLines.map((value, index) => (
                            <div
                                key={`h-${value}`}
                                className="absolute left-0 right-0 border-t border-gray-500 border-dashed"
                                style={{ 
                                    bottom: `${(value / 120) * 100}%`,
                                    opacity: 0.3
                                }}
                            />
                        ))}
                        
                        {/* Vertical grid lines */}
                        {dayLabels.map((_, index) => (
                            <div
                                key={`v-${index}`}
                                className="absolute top-0 bottom-0 border-l border-gray-500 border-dashed"
                                style={{ 
                                    left: `${(index / (dayLabels.length - 1)) * 100}%`,
                                    opacity: 0.3
                                }}
                            />
                        ))}
                    </div>
                    
                    {/* Chart bars */}
                    <div className="ml-10 h-full flex items-end justify-between space-x-2 relative z-10">
                        {timesheetActivity.map((value, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div
                                    className="w-full bg-blue-500 rounded-t-sm flex items-end justify-center pb-1"
                                    style={{ height: `${(value / 120) * 100}%`, minHeight: '20px' }}
                                >
                                    <span className="text-xs text-white font-medium">{value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Day labels below the chart */}
                    <div className="absolute bottom-0 left-10 right-0 border-t flex justify-between text-xs text-gray-600 z-20" style={{ transform: 'translateY(100%)' }}>
                        {dayLabels.map((day, index) => (
                            <div key={index} className="flex-1 text-center">
                                {day.slice(0, 3)}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-4 text-xs text-blue-600 flex justify-center items-center">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span>
                    Work Hours
                </div>
            </div>
        </div>
    );
};

export default TimesheetActivity;