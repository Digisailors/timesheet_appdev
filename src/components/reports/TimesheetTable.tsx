import React from 'react';

const TimesheetTable: React.FC = () => {
  const timesheetData: TimesheetEntry[] = [
    {
      date: "5/18/2025",
      location: "Downtown Office",
      checkIn: "07:15",
      checkOut: "15:10",
      regularHours: 8,
      otHours: 0,
      travelTime: "00:30",
      remarks: ""
    }
  ];

  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              {["Date", "Location", "Check In", "Check Out", "Regular Hours", "OT Hours", "Travel Time", "Remarks"].map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timesheetData.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{entry.date}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{entry.location}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{entry.checkIn}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{entry.checkOut}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{entry.regularHours}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{entry.otHours}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{entry.travelTime}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{entry.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface TimesheetEntry {
  date: string;
  location: string;
  checkIn: string;
  checkOut: string;
  regularHours: number;
  otHours: number;
  travelTime: string;
  remarks: string;
}

export default TimesheetTable;
