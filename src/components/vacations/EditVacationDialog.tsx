"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface VacationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  data: {
    id: string;
    name: string;
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

const EditVacationDialog: React.FC<VacationDetailsProps> = ({
  isOpen,
  onClose,
  onEditSuccess,
  data,
}) => {
  const [formData, setFormData] = useState({
    leaveType: data.leaveType,
    startDate: data.startDate,
    endDate: data.endDate,
    reason: data.reason,
    status: data.status.includes("Paid") ? "Paid Vacation" : "Unpaid Vacation",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: data.status.includes("Paid") ? "Paid Vacation" : "Unpaid Vacation",
    });
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      const newStartDate = new Date(value);
      const newEndDate = new Date(formData.endDate);
      if (newEndDate <= newStartDate) {
        const nextDay = new Date(newStartDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          endDate: nextDay.toISOString().split("T")[0],
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "endDate") {
      const newEndDate = new Date(value);
      const currentStartDate = new Date(formData.startDate);
      if (newEndDate > currentStartDate) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else {
        setError("End date must be after start date");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        status: formData.status === "Paid Vacation" ? "Paid Vacation" : "Unpaid Vacation",
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/vacations/update/${data.id}`,
        payload
      );
      if (response.data.success) {
        toast.success("Vacation updated successfully!", {
          style: {
            background: "blue", // Blue-500
            color: "#fff",
          },
        });
        onEditSuccess();
        onClose();
      } else {
        setError(response.data.message || "Failed to update vacation details");
      }
    } catch (err) {
      setError("An error occurred while updating vacation details");
      console.error("Error updating vacation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-700 w-10 h-10 flex items-center justify-center text-white font-bold">
              {data.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Edit Vacation: {data.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Close"
          >
            <X size={20} className="text-gray-400 dark:text-gray-300" />
          </button>
        </div>
        {/* Dialog Content */}
        <form onSubmit={handleSubmit} className="p-6 text-sm text-gray-900 dark:text-gray-100">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <label className="block text-gray-400 dark:text-gray-500 mb-1">Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              >
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 dark:text-gray-500 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              >
                <option value="Paid Vacation">Paid</option>
                <option value="Unpaid Vacation">Unpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 dark:text-gray-500 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-gray-400 dark:text-gray-500 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                min={formData.startDate}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-gray-400 dark:text-gray-500 mb-1">Reason for Leave</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 min-h-[100px]"
            />
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
              {error}
            </div>
          )}
          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVacationDialog;
