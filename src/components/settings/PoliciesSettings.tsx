"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Shield, Edit, Trash2, AlertCircle } from "lucide-react";
import toast from 'react-hot-toast';

// DTO Interfaces
export interface CreateCompanyPolicyDto {
  workingDaysPerWeek: number;
  maxOvertimeHoursPerDay: number;
  lateArrivalGracePeriodMinutes: number;
  breakDurationMinutes: number;
  minimumRestBetweenShiftsHours: number;
  timesheetSubmissionDeadline: string;
  overtimeApprovalRequired: boolean;
  travelTimePolicy: string;
  attendancePolicy: string;
  overtimePolicy: string;
  leavePolicy: string;
}

export interface UpdateCompanyPolicyDto {
  workingDaysPerWeek?: number;
  maxOvertimeHoursPerDay?: number;
  lateArrivalGracePeriodMinutes?: number;
  breakDurationMinutes?: number;
  minimumRestBetweenShiftsHours?: number;
  timesheetSubmissionDeadline?: string;
  overtimeApprovalRequired?: boolean;
  travelTimePolicy?: string;
  attendancePolicy?: string;
  overtimePolicy?: string;
  leavePolicy?: string;
}

export interface CompanyPolicyResponseDto {
  id: string;
  workingDaysPerWeek: number;
  maxOvertimeHoursPerDay: number;
  lateArrivalGracePeriodMinutes: number;
  breakDurationMinutes: number;
  minimumRestBetweenShiftsHours: number;
  timesheetSubmissionDeadline: string;
  overtimeApprovalRequired: boolean;
  travelTimePolicy: string;
  attendancePolicy: string;
  overtimePolicy: string;
  leavePolicy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form state interface
interface PolicyFormState {
  workingDaysPerWeek: string;
  maxOvertimeHoursPerDay: string;
  lateArrivalGracePeriodMinutes: string;
  breakDurationMinutes: string;
  minimumRestBetweenShiftsHours: string;
  timesheetSubmissionDeadline: string;
  overtimeApprovalRequired: boolean;
  travelTimePolicy: string;
  attendancePolicy: string;
  overtimePolicy: string;
  leavePolicy: string;
}

const PoliciesSettings: React.FC = () => {
  const [policy, setPolicy] = useState<PolicyFormState>({
    workingDaysPerWeek: "",
    maxOvertimeHoursPerDay: "",
    lateArrivalGracePeriodMinutes: "",
    breakDurationMinutes: "",
    minimumRestBetweenShiftsHours: "",
    timesheetSubmissionDeadline: "End of Week",
    overtimeApprovalRequired: false,
    travelTimePolicy: "",
    attendancePolicy: "",
    overtimePolicy: "",
    leavePolicy: "",
  });

  const [policyId, setPolicyId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [policyExists, setPolicyExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5088/api";

  useEffect(() => {
    const fetchCompanyPolicy = async () => {
      setIsDataLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/companypolicy/all`);
        if (!response.ok) {
          console.error("Failed to fetch policy:", response.status, response.statusText);
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        let policyData = null;
        if (result && result.success && result.data && result.data.length > 0) {
          policyData = result.data[0];
        } else if (result && result.length > 0) {
          policyData = result[0];
        }
        if (policyData) {
          setPolicy({
            workingDaysPerWeek: policyData.workingDaysPerWeek.toString(),
            maxOvertimeHoursPerDay: policyData.maxOvertimeHoursPerDay.toString(),
            lateArrivalGracePeriodMinutes: policyData.lateArrivalGracePeriodMinutes.toString(),
            breakDurationMinutes: policyData.breakDurationMinutes.toString(),
            minimumRestBetweenShiftsHours: policyData.minimumRestBetweenShiftsHours.toString(),
            timesheetSubmissionDeadline: policyData.timesheetSubmissionDeadline,
            overtimeApprovalRequired: policyData.overtimeApprovalRequired,
            travelTimePolicy: policyData.travelTimePolicy,
            attendancePolicy: policyData.attendancePolicy,
            overtimePolicy: policyData.overtimePolicy,
            leavePolicy: policyData.leavePolicy,
          });
          setPolicyId(policyData.id);
          setPolicyExists(true);
        } else {
          setPolicyExists(false);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching company policy:", error);
        setPolicyExists(false);
        setIsEditing(true);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchCompanyPolicy();
  }, [API_BASE_URL]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const type = (e.target as HTMLInputElement).type;
    const checked = (e.target as HTMLInputElement).checked;

    const numericFields = [
      "workingDaysPerWeek",
      "maxOvertimeHoursPerDay",
      "lateArrivalGracePeriodMinutes",
      "breakDurationMinutes",
      "minimumRestBetweenShiftsHours",
    ];

    if (numericFields.includes(name)) {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      setPolicy((prev) => ({
        ...prev,
        [name]: numbersOnly,
      }));
      return;
    }

    setPolicy((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const requiredTextAreas = [
      "travelTimePolicy",
      "attendancePolicy",
      "overtimePolicy",
      "leavePolicy",
    ];

    for (const field of requiredTextAreas) {
      if (!policy[field as keyof PolicyFormState]?.toString().trim()) {
        return false;
      }
    }

    const numericFields = [
      "workingDaysPerWeek",
      "maxOvertimeHoursPerDay",
      "lateArrivalGracePeriodMinutes",
      "breakDurationMinutes",
      "minimumRestBetweenShiftsHours",
    ];

    for (const field of numericFields) {
      const value = policy[field as keyof PolicyFormState];
      if (value === "" || isNaN(Number(value))) {
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: CreateCompanyPolicyDto = {
        workingDaysPerWeek: Number(policy.workingDaysPerWeek),
        maxOvertimeHoursPerDay: Number(policy.maxOvertimeHoursPerDay),
        lateArrivalGracePeriodMinutes: Number(policy.lateArrivalGracePeriodMinutes),
        breakDurationMinutes: Number(policy.breakDurationMinutes),
        minimumRestBetweenShiftsHours: Number(policy.minimumRestBetweenShiftsHours),
        timesheetSubmissionDeadline: policy.timesheetSubmissionDeadline,
        overtimeApprovalRequired: policy.overtimeApprovalRequired,
        travelTimePolicy: policy.travelTimePolicy,
        attendancePolicy: policy.attendancePolicy,
        overtimePolicy: policy.overtimePolicy,
        leavePolicy: policy.leavePolicy,
      };

      const url = policyExists
        ? `${API_BASE_URL}/companypolicy/update/${policyId}`
        : `${API_BASE_URL}/companypolicy/create`;

      const method = policyExists ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        throw new Error(errorResponse.message || "Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);

      if (!policyExists) {
        setPolicyExists(true);
        const newPolicyId = result.data?.id || result.id;
        setPolicyId(newPolicyId);
        console.log("New policy created with ID:", newPolicyId);
      }

      setIsEditing(false);
      toast.success("Policy saved successfully!",{
        style:{
          background:'blue',
          color:'white'
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error);
        toast.error(`Failed to save: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        toast.error("Failed to save due to an unknown error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    console.log("Edit button clicked");
  };

  const handleDelete = async () => {
    if (!policyId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/companypolicy/delete/${policyId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: "Failed to delete policy" }));
        throw new Error(err.message || "Failed to delete policy");
      }
      // Reset state after successful deletion
      setPolicy({
        workingDaysPerWeek: "",
        maxOvertimeHoursPerDay: "",
        lateArrivalGracePeriodMinutes: "",
        breakDurationMinutes: "",
        minimumRestBetweenShiftsHours: "",
        timesheetSubmissionDeadline: "End of Week",
        overtimeApprovalRequired: false,
        travelTimePolicy: "",
        attendancePolicy: "",
        overtimePolicy: "",
        leavePolicy: "",
      });
      setPolicyId(null);
      setPolicyExists(false);
      setIsEditing(true);
      toast.success("Policy deleted successfully", {
        style: { background: "blue", color: "white" },
      });
      setShowDeleteConfirm(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error while deleting";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isDataLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full max-w-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            Loading company policies...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white w-full dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 mr-3 text-gray-700 dark:text-gray-300" />
        <div className="w-full flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Company Policies
          </h3>
          {policyExists && !isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading || isDeleting}
                className="flex items-center px-3 py-2 border border-red-300 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                aria-label="Delete Policy"
                title="Delete Policy"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Working Days per Week
          </label>
          <input
            type="text"
            name="workingDaysPerWeek"
            value={policy.workingDaysPerWeek}
            onChange={handleInputChange}
            placeholder="Enter working days"
            disabled={!isEditing}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Overtime Hours per Day
          </label>
          <input
            type="text"
            name="maxOvertimeHoursPerDay"
            value={policy.maxOvertimeHoursPerDay}
            onChange={handleInputChange}
            placeholder="Enter max overtime hours"
            disabled={!isEditing}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Late Arrival Grace Period (minutes)
          </label>
          <input
            type="text"
            name="lateArrivalGracePeriodMinutes"
            value={policy.lateArrivalGracePeriodMinutes}
            onChange={handleInputChange}
            placeholder="Enter grace period"
            disabled={!isEditing}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Break Duration (minutes)
          </label>
          <input
            type="text"
            name="breakDurationMinutes"
            value={policy.breakDurationMinutes}
            onChange={handleInputChange}
            placeholder="Enter break duration"
            disabled={!isEditing}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Rest Between Shifts (hours)
          </label>
          <input
            type="text"
            name="minimumRestBetweenShiftsHours"
            value={policy.minimumRestBetweenShiftsHours}
            onChange={handleInputChange}
            placeholder="Enter minimum rest hours"
            disabled={!isEditing}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timesheet Submission Deadline
          </label>
          <select
            name="timesheetSubmissionDeadline"
            value={policy.timesheetSubmissionDeadline}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="End of Day">End of Day</option>
            <option value="End of Week">End of Week</option>
            <option value="End of Month">End of Month</option>
          </select>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overtime Approval Required
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Require supervisor approval for overtime hours
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="overtimeApprovalRequired"
              checked={policy.overtimeApprovalRequired}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
          </label>
        </div>
      </div>
      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Travel Time Policy
          </label>
          <textarea
            name="travelTimePolicy"
            value={policy.travelTimePolicy}
            onChange={handleInputChange}
            placeholder="Enter travel time policy"
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attendance Policy
          </label>
          <textarea
            name="attendancePolicy"
            value={policy.attendancePolicy}
            onChange={handleInputChange}
            placeholder="Enter attendance policy"
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Overtime Policy
          </label>
          <textarea
            name="overtimePolicy"
            value={policy.overtimePolicy}
            onChange={handleInputChange}
            placeholder="Enter overtime policy"
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Leave Policy
          </label>
          <textarea
            name="leavePolicy"
            value={policy.leavePolicy}
            onChange={handleInputChange}
            placeholder="Enter leave policy"
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end items-center gap-2">
        {policyExists && isEditing && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
        {isEditing && (
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? policyExists ? "Updating..." : "Creating..." : policyExists ? "Update Policy" : "Create Policy"}
          </button>
        )}
      </div>
    </div>

    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Policy?</h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            This action will permanently delete the company policy. This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting && <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default PoliciesSettings;
