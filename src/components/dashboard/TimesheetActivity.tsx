// src/components/dashboard/TimesheetActivity.tsx
"use client";

import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface TimesheetActivityProps {
    timesheetActivity: number[];
}

const TimesheetActivity: React.FC<TimesheetActivityProps> = ({ timesheetActivity }) => {
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    Timesheet Activity
                </h2>
            </div>
            <div className="p-6">
                <div className="relative h-64">
                    <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
                        <span>120</span>
                        <span>90</span>
                        <span>60</span>
                        <span>30</span>
                        <span>0</span>
                    </div>
                    <div className="ml-10 h-full flex items-end justify-between space-x-2">
                        {timesheetActivity.map((value, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div
                                    className="w-full bg-blue-500 rounded-t-sm flex items-end justify-center pb-1"
                                    style={{ height: `${(value / 120) * 100}%`, minHeight: '20px' }}
                                >
                                    <span className="text-xs text-white font-medium">{value}</span>
                                </div>
                                <div className="text-xs text-gray-600 mt-2 text-center">
                                    {dayLabels[index].slice(0, 3)}
                                </div>
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