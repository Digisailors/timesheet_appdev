"use client";

import React from "react";
import { X } from "lucide-react";

interface VacationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    id: string;
    appliedDate: string;
    vacationFrom: string;
    vacationTo: string;
    duration: string;
    eligibleDays: string;
    remainingDays: string;
    leaveType: string;
    status: string;
    project: string;
    specialization: string;
    reason: string;
  };
}

const ViewVacationDialog: React.FC<VacationDetailsProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-6">

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-700 w-10 h-10 flex items-center justify-center text-white font-bold">
              {data.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
              <p className="text-sm text-gray-400">{data.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400 dark:text-gray-300" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-6 text-sm text-gray-900 dark:text-gray-100">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <p className="text-gray-400 dark:text-gray-500">Applied Date</p>
              <p>{data.appliedDate}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500">Vacation Date</p>
              <p>{data.vacationFrom} to {data.vacationTo}</p>
            </div>

            <div>
              <p className="text-gray-400 dark:text-gray-500">Duration</p>
              <p>{data.duration}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500">Remaining Days</p>
              <p>{data.remainingDays}</p>
            </div>

            <div>
              <p className="text-gray-400 dark:text-gray-500">Eligible Days</p>
              <p>{data.eligibleDays}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500">Leave Type</p>
              <p>{data.leaveType}</p>
            </div>

            <div>
              <p className="text-gray-400 dark:text-gray-500">Status</p>
              <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-xs font-semibold">
                {data.status}
              </span>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500">Current Projects</p>
              <p>{data.project}</p>
            </div>

            <div>
              <p className="text-gray-400 dark:text-gray-500">Specialization</p>
              <p>{data.specialization}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-400 dark:text-gray-500 mb-2">Reason for Leave</p>
            <div className="border border-gray-300 dark:border-gray-700 p-3 rounded bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200">
              {data.reason || "Please provide details about your leave request..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVacationDialog;
