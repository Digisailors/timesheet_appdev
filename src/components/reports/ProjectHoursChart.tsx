import React, { useState } from 'react';

interface ProjectHoursChartProps {
  timesheetData: Array<{
    timesheetDate: string;
    normalHrs: string;
    overtime: string;
  }>;
}

interface MonthData {
  month: string;
  regular: number;
  overtime: number;
}

const ProjectHoursChart: React.FC<ProjectHoursChartProps> = ({ timesheetData }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; content: string }>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  const monthsData: MonthData[] = timesheetData.reduce((acc: MonthData[], entry) => {
    const month = new Date(entry.timesheetDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' });
    const existingMonth = acc.find((item: MonthData) => item.month === month);

    if (existingMonth) {
      existingMonth.regular += parseFloat(entry.normalHrs);
      existingMonth.overtime += parseFloat(entry.overtime);
    } else {
      acc.push({
        month,
        regular: parseFloat(entry.normalHrs),
        overtime: parseFloat(entry.overtime),
      });
    }

    return acc;
  }, []);

  const maxRegular = Math.max(...monthsData.map((data) => data.regular));
  const maxOvertime = Math.max(...monthsData.map((data) => data.overtime));
  const maxValue = Math.max(maxRegular, maxOvertime);

  const showTooltip = (event: React.MouseEvent, content: string) => {
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      content,
    });
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

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
          <div className="flex flex-col justify-between h-60 w-8 mr-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">12</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">9</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">6</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">3</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">0</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="relative h-60">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i: number) => (
                  <div key={i} className="border-t border-gray-200 dark:border-gray-700 w-full"></div>
                ))}
              </div>
              <div className="absolute inset-0 flex justify-between items-end px-2">
                {monthsData.map((data: MonthData, index: number) => (
                  <div key={index} className="flex items-end gap-1">
                    <div
                      className="bg-blue-500 w-4 hover:opacity-80 transition-opacity"
                      style={{ height: `${(data.regular / maxValue) * 240}px` }}
                      onMouseEnter={(e) => showTooltip(e, `Regular: ${data.regular}`)}
                      onMouseLeave={hideTooltip}
                    ></div>
                    <div
                      className="bg-orange-400 w-4 hover:opacity-80 transition-opacity"
                      style={{ height: `${(data.overtime / maxValue) * 240}px` }}
                      onMouseEnter={(e) => showTooltip(e, `Overtime: ${data.overtime}`)}
                      onMouseLeave={hideTooltip}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-2 px-2">
              {monthsData.map((data: MonthData, index: number) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-300 font-medium w-9 text-center">
                  {data.month}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {tooltip.visible && (
        <div
          className="fixed bg-gray-800 text-white text-xs rounded p-2 pointer-events-none"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default ProjectHoursChart;
