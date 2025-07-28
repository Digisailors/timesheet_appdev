// VacationPage.tsx
import React, { useState } from 'react';

const VacationPage = () => {
  const [activeTab, setActiveTab] = useState('approved');

  // Sample data for employees on vacation
  const employeesOnVacation = [
    {
      name: 'John Smith',
      leaveType: 'Annual Leave',
      duration: '8 days',
      location: 'Highway Bridge',
      status: 'Paid Vacation',
      startDate: '2024-06-15',
      endDate: '2024-06-22',
    },
    {
      name: 'Sarah Wilson',
      leaveType: 'Sick Leave',
      duration: '3 days',
      location: 'Downtown Plaza',
      status: 'Paid Vacation',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
    },
    {
      name: 'Robert Martinez',
      leaveType: 'Annual Leave',
      duration: '15 days',
      location: 'Highway Bridge',
      status: 'Paid Vacation',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
    },
    {
      name: 'Mike Johnson',
      leaveType: 'Personal Leave',
      duration: '3 days',
      location: 'Factory Building',
      status: 'Unpaid Vacation',
      startDate: '2024-06-25',
      endDate: '2024-06-27',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-5">Vacation Mode</h1>
      {/* Tabs */}
      <div className="flex flex-wrap-4 space-x-4 mb-4">
        <div className="px-48 py-8 rounded-sm border flex items-center relative">
          <span className="w-full text-left text-black-400 absolute left-10">Approved</span>
        </div>
        <div className="px-48 py-8 rounded-sm border flex items-center relative">
          <span className="w-full text-left text-black-400 absolute left-10">Pending</span>
        </div>
        <div className="px-48 py-8 rounded-sm border flex items-center relative">
          <span className="w-full text-left text-black-400 absolute left-10">Rejected</span>
        </div>
        <div className="px-48 py-8 rounded-sm border flex items-center relative">
          <span className="w-full text-left text-black-400 absolute left-10">On Leave</span>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search requests..."
          className="px-4 py-2 border rounded"
        />
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">
          Employees on Vacation ({employeesOnVacation.length})
        </h2>
        {employeesOnVacation.map((employee, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 border-b"
          >
            <div>
              <h3 className="font-bold">{employee.name}</h3>
              <p>
                {employee.leaveType} • {employee.duration}
              </p>
              <p>{employee.location}</p>
            </div>
            <div className="text-right">
              <p>
                {employee.startDate} to {employee.endDate}
              </p>
              <button
                className={`px-4 py-2 rounded ${
                  employee.status === 'Paid Vacation'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                } text-white`}
              >
                {employee.status}
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded ml-2">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationPage;
