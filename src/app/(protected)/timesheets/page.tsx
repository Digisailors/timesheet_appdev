"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import { DataTable } from "@/components/time-sheets/dataTable";
import { Calendar } from "@/components/ui/calendar";
import { columns, mockData } from "@/components/time-sheets/columns";
import { CalendarIcon } from "lucide-react";

const TimeSheetPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleExport = () => {
    alert(`Exporting data for ${format(date || new Date(), "dd-MM-yyyy")}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Time Sheets" userName="Admin User" userInitial="A" />

        <div className="p-2">
          {/* ✅ Header Section: Title + Date Picker + Export Button - No background */}
          <div className="px-1 py-2 mb-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-xl font-bold" style={{ color: '#1E40AF' }}>Daily Timesheet Viewer</h1>

              <div className="flex items-center gap-2">
                {/* Date Picker with Calendar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="flex items-center px-2 py-1 border rounded-md shadow-sm text-sm hover:bg-gray-50 transition"
                    style={{ borderColor: '#020817' }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" style={{ color: '#020817' }} />
                    <span style={{ color: '#020817' }}>
                      {format(date || new Date(), "dd-MM-yyyy")}
                    </span>
                  </button>

                  {/* Calendar Dropdown */}
                  {showCalendar && (
                    <div className="absolute right-0 top-full mt-1 z-50 border rounded-lg shadow-lg p-0 bg-white">
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
                      <style jsx>{`
                        .calendar-day-selected {
                          background-color: #020817 !important;
                          color: white !important;
                        }
                        .calendar-day:hover {
                          background-color: rgba(2, 8, 23, 0.1) !important;
                        }
                        .calendar-nav-button {
                          color: #020817 !important;
                        }
                        .calendar-nav-button:hover {
                          background-color: rgba(2, 8, 23, 0.1) !important;
                        }
                      `}</style>
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="px-2 py-1 text-white rounded-md hover:opacity-90 transition flex items-center gap-1 text-sm"
                  style={{ backgroundColor: '#1E40AF' }}
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

          {/* ✅ Table Section - Separate container */}
          <div className="bg-white p-2 rounded-md shadow">
            <DataTable columns={columns} data={mockData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSheetPage;