"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown } from "lucide-react";
import { format } from "date-fns"; // Still needed for date formatting

interface CreateVacationFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Custom Modal Component (replaces shadcn Dialog)
const CustomModal = ({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop - simple black overlay, no blur */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="sm:max-w-[700px] w-full rounded-md p-0 bg-white text-black dark:bg-gray-900 dark:text-white shadow-lg"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing modal
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

// Custom Select Component (replaces shadcn Select)
interface CustomSelectProps {
  id?: string; // Added id prop
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
}

const CustomSelect = ({
  id,
  value,
  onValueChange,
  placeholder,
  options,
  className,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        id={id} // Pass id to the button
        type="button"
        onClick={handleToggle}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-blue-500"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                option.value === value ? "font-semibold" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function CreateVacationForm({
  open = true,
  onOpenChange,
}: CreateVacationFormProps) {
  const [internalOpen, setInternalOpen] = useState(open);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [employee, setEmployee] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [eligibleDays, setEligibleDays] = useState("40 days"); // New state for eligible days

  const isDialogOpen = onOpenChange ? open : internalOpen;

  const closeDialog = () => {
    onOpenChange?.(false);
    setInternalOpen(false);
  };

  const handleSubmit = () => {
    console.log({
      employee,
      leaveType,
      startDate,
      endDate,
      eligibleDays, // Include in console log
      reason,
    });
    closeDialog();
  };

  const handleCancel = () => {
    closeDialog();
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    setStartDate(date);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    setEndDate(date);
  };

  const handleEligibleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEligibleDays(e.target.value);
  };

  const employeeOptions = [
    { value: "john-doe", label: "John Doe" },
    { value: "jane-smith", label: "Jane Smith" },
    { value: "mike-johnson", label: "Mike Johnson" },
  ];

  const leaveTypeOptions = [
    { value: "annual", label: "Annual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "personal", label: "Personal Leave" },
    { value: "maternity", label: "Maternity Leave" },
  ];

  return (
    <CustomModal isOpen={isDialogOpen} onClose={closeDialog}>
      <div className="px-6 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Vacation
          </h2>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300 h-6 w-6"
            onClick={closeDialog}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="px-6 pt-6 pb-0 space-y-6">
        {/* Employee and Leave Type */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="employee-select"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Employee
            </label>
            <CustomSelect
              id="employee-select"
              value={employee}
              onValueChange={setEmployee}
              placeholder="Select person"
              options={employeeOptions}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="leave-type-select"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Leave Type
            </label>
            <CustomSelect
              id="leave-type-select"
              value={leaveType}
              onValueChange={setLeaveType}
              placeholder="Select leave type"
              options={leaveTypeOptions}
            />
          </div>
        </div>
        {/* Start Date and End Date */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="start-date"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm h-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="end-date"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
              onChange={handleEndDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm h-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        {/* Eligible Days and Remaining Days */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="eligible-days"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Eligible Days
            </label>
            <input
              id="eligible-days"
              value={eligibleDays} // Bind to state
              onChange={handleEligibleDaysChange} // Add onChange handler
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm h-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="remaining-days"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Remaining Days
            </label>
            <input
              id="remaining-days"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm h-10 bg-white cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        {/* Reason for Leave */}
        <div className="space-y-2">
          <label
            htmlFor="reason-for-leave"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Reason for Leave
          </label>
          <textarea
            id="reason-for-leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide details about your leave request..."
            className="min-h-[100px] mb-5 resize-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-gray-50 placeholder:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-blue-400"
          />
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-end items-center gap-4 px-6 py-4 border-t border-gray-200 bg-gray-100 dark:bg-gray-900 dark:border-gray-700">
        <button
          type="button"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 py-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </CustomModal>
  );
}
