"use client";
import React, { useState } from "react";
import { X, Undo2 } from "lucide-react";
import { getSession } from "next-auth/react";

interface VacationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onReturn: () => void;
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
    startDate: string;
    endDate: string;
    returnstatus: string;
  };
}

const ViewVacationDialog: React.FC<VacationDetailsProps> = ({ isOpen, onClose, onReturn, data }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleReturn = async () => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vacations/return/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to trigger return');
      }

      const result = await response.json();
      console.log('Return successful:', result);
      onReturn();
      onClose();
    } catch (error) {
      console.error('Error triggering return:', error);
    }
  };

  const handleConfirmReturn = () => {
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    handleReturn();
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

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
            </div>
          </div>
          <div className="flex gap-2">
          <button
            onClick={data.returnstatus === "Not Return" ? handleConfirmReturn : undefined}
            disabled={data.returnstatus === "Returned"}
            className={`p-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-full transition-colors flex items-center ${
              data.returnstatus === "Returned" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={data.returnstatus === "Returned" ? "Returned" : "Return"}
          >
            <Undo2
              size={20}
              className="text-white"
            />
            <span className="ml-1 text-xs text-white">
              {data.returnstatus === "Returned" ? "Returned" : "Return"}
            </span>
          </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Close"
            >
              <X size={20} className="text-gray-400 dark:text-gray-300" />
            </button>
          </div>
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
              <p>{data.startDate} to {data.endDate}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500">Duration</p>
              <p>{data.duration} days</p>
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
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Are you sure this Employee/Supervisor is returned? This can&#39;t be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleConfirmNo}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmYes}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewVacationDialog;
