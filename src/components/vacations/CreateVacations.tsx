"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown } from "lucide-react";
import { format, addDays } from "date-fns";
import axios from "axios";
import { getSession } from "next-auth/react";

interface CreateVacationFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  designation: string;
  designationType: {
    designationTypeId: string;
    name: string;
  };
  phoneNumber: string;
  email: string;
  address: string;
  experience: string;
  dateOfJoining: string;
  specialization: string;
  createdAt: string;
  updatedAt: string;
  perHourRate: string;
  overtimeRate: string;
  isOnVacation: boolean;
  vacationStatus: string;
}

interface Supervisor {
  id: string;
  fullName: string;
  specialization: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  dateOfJoining: string;
  experience: string;
  createdAt: string;
  updatedAt: string;
  perHourRate: string;
  overtimeRate: string;
  isOnVacation: boolean;
  vacationStatus: string;
}

interface PersonOption {
  value: string;
  label: string;
  isSupervisor: boolean;
  originalData: Employee | Supervisor;
}

interface LeaveTypeOption {
  value: string;
  label: string;
}

type SelectOption = PersonOption | LeaveTypeOption;

interface CustomSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: SelectOption[];
  className?: string;
}

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
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="sm:max-w-[700px] w-full rounded-md p-0 bg-white text-black dark:bg-gray-900 dark:text-white shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

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
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption ? (
    <div className="flex items-center">
      {selectedOption.label}
      {"isSupervisor" in selectedOption && selectedOption.isSupervisor && (
        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          S
        </span>
      )}
    </div>
  ) : (
    placeholder
  );
  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        id={id}
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
              className={`relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm py-1.5 pl-3 pr-2 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                option.value === value ? "font-semibold" : ""
              }`}
            >
              <span>{option.label}</span>
              {"isSupervisor" in option && option.isSupervisor && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  S
                </span>
              )}
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
  onSuccess,
}: CreateVacationFormProps) {
  const [internalOpen, setInternalOpen] = useState(open);
  const tomorrow = addDays(new Date(), 1);
  const dayAfterTomorrow = addDays(new Date(), 2);
  const [startDate, setStartDate] = useState<Date>(tomorrow);
  const [endDate, setEndDate] = useState<Date>(dayAfterTomorrow);
  const [employee, setEmployee] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [peopleOptions, setPeopleOptions] = useState<PersonOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonOption | null>(null);
  const isDialogOpen = onOpenChange ? open : internalOpen;

  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }

        const [employeesRes, supervisorsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/all`, {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/supervisors/all`, {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            }
          })
        ]);

        const employeeOptions = employeesRes.data.data.map((emp: Employee) => ({
          value: emp.id,
          label: `${emp.firstName} ${emp.lastName}`,
          isSupervisor: false,
          originalData: emp
        }));

        const supervisorOptions = supervisorsRes.data.data.map((sup: Supervisor) => ({
          value: sup.id,
          label: sup.fullName,
          isSupervisor: true,
          originalData: sup
        }));

        setPeopleOptions([...employeeOptions, ...supervisorOptions]);
      } catch (error) {
        console.error('Error fetching people data:', error);
        setError('Failed to load employee/supervisor data');
      } finally {
        setLoading(false);
      }
    };

    if (isDialogOpen) {
      fetchPeopleData();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (startDate) {
      const newEndDate = addDays(startDate, 1);
      setEndDate(newEndDate);
    }
  }, [startDate]);

  const closeDialog = () => {
    onOpenChange?.(false);
    setInternalOpen(false);
    setError(null);
    setEmployee("");
    setLeaveType("");
    setReason("");
    setSelectedPerson(null);
  };

  const handleEmployeeSelect = (value: string) => {
    setEmployee(value);
    const person = peopleOptions.find(p => p.value === value);
    setSelectedPerson(person || null);
  };

  const handleSubmit = async () => {
    if (!employee || !leaveType || !startDate || !endDate || !selectedPerson) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }

      const apiUrl = selectedPerson.isSupervisor
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/vacations/create/${selectedPerson.originalData.id}/supervisor`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/vacations/create/${selectedPerson.originalData.id}/employee`;

      const requestBody = {
        leaveType,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        reason
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        }
      });

      console.log('Vacation created successfully:', response.data);
      closeDialog();
      onSuccess?.();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error creating vacation:', err);
        setError(err.response?.data?.message || 'Failed to create vacation. Please try again.');
      } else {
        console.error('Unknown error:', err);
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    closeDialog();
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    if (date && startDate && date > startDate) {
      setEndDate(date);
    }
  };

  const leaveTypeOptions: LeaveTypeOption[] = [
    { value: "Annual Leave", label: "Annual Leave" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Personal Leave", label: "Personal Leave" },
    { value: "Emergency Leave", label: "Emergency Leave" },
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
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="employee-select"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Employee
            </label>
            {loading ? (
              <div className="h-10 w-full rounded-md border border-gray-300 bg-gray-100 animate-pulse dark:border-gray-600 dark:bg-gray-700"></div>
            ) : (
              <CustomSelect
                id="employee-select"
                value={employee}
                onValueChange={handleEmployeeSelect}
                placeholder="Select person"
                options={peopleOptions}
              />
            )}
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
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
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
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm h-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
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
            className="min-h-[100px] mb-5 resize-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-gray-50 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-blue-400"
          />
        </div>
      </div>
      <div className="flex justify-end items-center gap-4 px-6 py-4 border-t border-gray-200 bg-gray-100 dark:bg-gray-900 dark:border-gray-700">
        <button
          type="button"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 py-2 disabled:bg-blue-400"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </CustomModal>
  );
}
