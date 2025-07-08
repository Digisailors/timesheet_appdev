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
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Check In</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Check Out</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Regular Hours</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">OT Hours</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Travel Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {timesheetData.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{entry.date}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{entry.location}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{entry.checkIn}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{entry.checkOut}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{entry.regularHours}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{entry.otHours}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{entry.travelTime}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{entry.remarks}</td>
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
