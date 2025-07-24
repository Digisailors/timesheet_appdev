// TimeSheetPage.tsx
import React, { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "@/components/time-sheets/dataTable";

const TimeSheetPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleExport = () => {
    alert(`Exporting data for ${format(date || new Date(), "dd-MM-yyyy")}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-2">
        <div className="px-1 py-2 mb-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-xl font-bold text-blue-800 dark:text-blue-400">
              Daily Timesheet Viewer
            </h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center px-2 py-1 border rounded-md shadow-sm text-sm transition dark:border-gray-600 dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-800 dark:text-white" />
                  <span>
                    {format(date || new Date(), "dd-MM-yyyy")}
                  </span>
                </button>
                {showCalendar && (
                  <div className="absolute right-0 top-full mt-1 z-50 border rounded-lg shadow-lg p-0 bg-white dark:bg-gray-800 dark:border-gray-700">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setShowCalendar(false);
                      }}
                      className="p-1"
                      style={{
                        '--calendar-primary': '#020817',
                        '--calendar-primary-foreground': '#ffffff',
                        '--calendar-hover': '#020817',
                        '--calendar-hover-opacity': '0.1'
                      } as React.CSSProperties}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleExport}
                className="px-2 py-1 text-white bg-blue-800 dark:bg-blue-600 rounded-md hover:opacity-90 transition flex items-center gap-1 text-sm"
              >
                <Image
                  src="/assets/timesheet/export.svg"
                  alt="Export"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5"
                />
                Export All
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-2 rounded-md shadow">
          <DataTable selectedDate={date} />
        </div>
      </div>
    </div>
  );
};

export default TimeSheetPage;
