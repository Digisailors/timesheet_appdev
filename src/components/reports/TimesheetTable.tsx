import React from 'react';

const TimesheetTable = () => {
  return (
    <div className="mx-auto mt-6 px-6 py-4 max-w-5xl bg-white shadow-md border border-gray-300 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Timesheet</h2>
      
      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Project</th>
            <th className="p-3 border">Regular Hours</th>
            <th className="p-3 border">Overtime</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          <tr>
            <td className="p-3 border">01 Jan</td>
            <td className="p-3 border">Project A</td>
            <td className="p-3 border">8</td>
            <td className="p-3 border">2</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="p-3 border">02 Jan</td>
            <td className="p-3 border">Project A</td>
            <td className="p-3 border">7</td>
            <td className="p-3 border">1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetTable;
