import React, { useState, useEffect, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import ExcelJS from 'exceljs';

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  project: string;
  workHours: string;
  timeFrame: string;
  avatar: string;
  avatarBg: string;
  dateOfJoining?: string;
  experience?: string;
  phoneNumber?: string;
  currentProject?: string;
  designationType?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  specialization?: string;
  workingHours?: string;
  perHourRate?: string;
  overtimeRate?: string;
}

interface TimesheetEntry {
  id: string;
  project: {
    id: string;
    name: string;
    location: string;
  };
  employees: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  }[];
  timesheetDate: string;
  onsiteSignIn: string;
  onsiteSignOut: string;
  totalDutyHrs: string;
  overtime: string;
  supervisorName: string;
  type: string;
  description: string;
  normalHrs: string;
  remarks: string;
  location: string;
}

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string | null;
  mode?: 'view' | 'create';
  onEmployeeCreated?: (employee: Employee) => void;
}

interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  designation: string;
  designationType: string;
  phoneNumber: string;
  workingHours: string;
  email: string;
  address: string;
  experience: string;
  dateOfJoining: string;
  specialization: string;
  perHourRate: string;
  overtimeRate: string;
}

const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  mode = 'view',
  onEmployeeCreated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timesheet'>('overview');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timesheetData, setTimesheetData] = useState<TimesheetEntry[]>([]);
  const [createFormData, setCreateFormData] = useState<CreateEmployeeData>({
    firstName: '',
    lastName: '',
    designation: '',
    designationType: '',
    phoneNumber: '',
    workingHours: '',
    email: '',
    address: '',
    experience: '',
    dateOfJoining: '',
    specialization: '',
    perHourRate: '',
    overtimeRate: ''
  });

  const cleanBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const generateAvatarBg = () => "bg-blue-600";

  const createEmployee = async (employeeData: CreateEmployeeData): Promise<Employee | null> => {
    try {
      const response = await fetch(`${cleanBaseUrl}/employees/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      const result = await response.json();
      if (result.success && result.data) {
        const emp = result.data;
        const fullName = `${emp.firstName} ${emp.lastName}`;
        const enrichedEmployee: Employee = {
          ...emp,
          name: fullName,
          avatar: (emp.firstName[0] + emp.lastName[0]).toUpperCase(),
          avatarBg: generateAvatarBg(),
          project: emp.specialization || emp.designation,
          workHours: "160h",
          timeFrame: "This month",
          designation: emp.designation || "",
          designationType: emp.designationType || "",
          phoneNumber: emp.phoneNumber || "+0000000000",
          email: emp.email || "",
          address: emp.address || "Some Address",
          experience: emp.experience || "0 years",
          dateOfJoining: emp.dateOfJoining || new Date().toISOString().split('T')[0],
          specialization: emp.specialization || emp.designation || "",
          currentProject: emp.specialization || emp.designation,
          perHourRate: emp.perHourRate ? `₹${emp.perHourRate}` : 'N/A',
          overtimeRate: emp.overtimeRate ? `₹${emp.overtimeRate}` : 'N/A',
        };
        toast.success("Employee created successfully!");
        return enrichedEmployee;
      } else {
        toast.error(result.message || "Failed to create employee");
        return null;
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Error creating employee");
      return null;
    }
  };

  const fetchEmployeeById = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${cleanBaseUrl}/employees/${id}`);
      const result = await response.json();
      if (result.success && result.data) {
        const emp = result.data;
        const fullName = `${emp.firstName} ${emp.lastName}`;

        // Ensure designationType is a string
        const designationType = typeof emp.designationType === 'object'
          ? JSON.stringify(emp.designationType)
          : emp.designationType || '';

        const enrichedEmployee: Employee = {
          ...emp,
          name: fullName,
          avatar: (emp.firstName[0] + emp.lastName[0]).toUpperCase(),
          avatarBg: generateAvatarBg(),
          project: emp.specialization || emp.designation,
          workHours: "160h",
          timeFrame: "This month",
          designation: emp.designation || "",
          designationType: designationType,
          phoneNumber: emp.phoneNumber || "+0000000000",
          email: emp.email || "",
          address: emp.address || "Some Address",
          experience: emp.experience || "0 years",
          dateOfJoining: emp.dateOfJoining || new Date().toISOString().split('T')[0],
          specialization: emp.specialization || emp.designation || "",
          currentProject: emp.specialization || emp.designation,
          perHourRate: emp.perHourRate ? `₹${emp.perHourRate}` : 'N/A',
          overtimeRate: emp.overtimeRate ? `₹${emp.overtimeRate}` : 'N/A',
        };

        setEmployee(enrichedEmployee);
      } else {
        toast.error("Failed to fetch employee details");
        onClose();
      }
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
      toast.error("Error fetching employee details");
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [cleanBaseUrl, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newEmployee = await createEmployee(createFormData);
      if (newEmployee) {
        setEmployee(newEmployee);
        setActiveTab('overview');
        if (onEmployeeCreated) {
          onEmployeeCreated(newEmployee);
        }
        setCreateFormData({
          firstName: '',
          lastName: '',
          designation: '',
          designationType: '',
          phoneNumber: '',
          workingHours: '',
          email: '',
          address: '',
          experience: '',
          dateOfJoining: '',
          specialization: '',
          perHourRate: '',
          overtimeRate: ''
        });
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Timesheet');
    worksheet.columns = [
      { header: 'Employee', key: 'fullName', width: 25 },
      { header: 'Project', key: 'name', width: 25 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Date', key: 'timesheetDate', width: 20 },
      { header: 'Check In', key: 'onsiteSignIn', width: 15 },
      { header: 'Check Out', key: 'onsiteSignOut', width: 15 },
      { header: 'Total Hours', key: 'totalDutyHrs', width: 10 },
      { header: 'Overtime', key: 'overtime', width: 10 },
      { header: 'Supervisor', key: 'supervisorName', width: 20 },
      { header: 'Remarks', key: 'description', width: 50 },
    ];

    timesheetData.forEach((entry) => {
      worksheet.addRow({
        fullName: entry.employees[0].fullName,
        name: entry.project.name,
        location: entry.location,
        timesheetDate: entry.timesheetDate,
        onsiteSignIn: entry.onsiteSignIn,
        onsiteSignOut: entry.onsiteSignOut,
        totalDutyHrs: entry.totalDutyHrs,
        overtime: entry.overtime,
        supervisorName: entry.supervisorName,
        description: entry.remarks || employee?.designationType || 'Regular Employee',
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TimesheetHistory.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isOpen && mode === 'view' && employeeId) {
      fetchEmployeeById(employeeId);
      const fetchTimesheetData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/timesheet/employeehistory/${employeeId}`);
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setTimesheetData(result.data);
          } else {
            setTimesheetData([]);
          }
        } catch (error) {
          console.error("Failed to fetch timesheet data:", error);
          setTimesheetData([]);
        }
      };
      fetchTimesheetData();
    }
    if (isOpen && mode === 'create') {
      setActiveTab('overview');
    }
    if (!isOpen) {
      setEmployee(null);
      setActiveTab('overview');
      setTimesheetData([]);
    }
  }, [isOpen, employeeId, fetchEmployeeById, mode]);

  if (!isOpen) return null;

  const TabButton: React.FC<{
    tab: 'overview' | 'timesheet';
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-8 py-3 text-sm font-medium flex-1 text-center transition-all duration-200 rounded-lg
        ${isActive
          ? 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white shadow'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
    >
      {label}
    </button>
  );

  const CreateEmployeeForm = () => (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg mx-auto max-w-2xl my-8 p-8 backdrop-blur-sm">
        <form onSubmit={handleCreateSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={createFormData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={createFormData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={createFormData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={createFormData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={createFormData.designation}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Designation Type *
              </label>
              <select
                name="designationType"
                value={createFormData.designationType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Type</option>
                <option value="Regular Employee">Regular Employee</option>
                <option value="Rental Employee">Rental Employee</option>
                <option value="Regular Driver">Regular Driver</option>
                <option value="Coaster Driver">Coaster Driver</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Working Hours *
              </label>
              <input
                type="number"
                name="workingHours"
                value={createFormData.workingHours}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience *
              </label>
              <input
                type="text"
                name="experience"
                value={createFormData.experience}
                onChange={handleInputChange}
                required
                placeholder="e.g., 4 years"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Joining *
              </label>
              <input
                type="date"
                name="dateOfJoining"
                value={createFormData.dateOfJoining}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization *
              </label>
              <input
                type="text"
                name="specialization"
                value={createFormData.specialization}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Normal Hour Rate (₹) *
              </label>
              <input
                type="number"
                name="perHourRate"
                value={createFormData.perHourRate}
                onChange={handleInputChange}
                required
                step="any"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                OT Hour Rate (₹) *
              </label>
              <input
                type="number"
                name="overtimeRate"
                value={createFormData.overtimeRate}
                onChange={handleInputChange}
                required
                step="any"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={createFormData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const OverviewTab = () => {
    if (!employee) return null;

    return (
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg mx-auto max-w-2xl my-8 p-8">
          <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className={`w-20 h-20 ${employee.avatarBg} rounded-full flex items-center justify-center`}>
              <span className="text-white font-semibold text-xl">{employee.avatar}</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{employee.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Join Date</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.dateOfJoining || '2023-11-15'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.phoneNumber || '98765 43210'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Normal Hour Rate</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.perHourRate}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.experience || '5 Years'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Designation</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.designation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Designation Type</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.designationType || 'Regular'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.specialization || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">OT Hour Rate</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.overtimeRate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TimesheetTab = () => {
    const handleExportClick = () => {
      if (timesheetData.length === 0) {
        toast.error("No timesheet data available", {
          style: {
            background: 'white',
            color: 'black',
          },
        });
        return;
      }
      exportToExcel();
    };

    return (
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg mx-auto max-w-2xl my-8 p-8">
          <div className="flex justify-end mb-4 mr-4">
            <button
              onClick={handleExportClick}
              className="px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Export to Excel
            </button>
          </div>
          {timesheetData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">No timesheet data available</p>
          ) : (
            <div className="space-y-3">
              {timesheetData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{entry.timesheetDate}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{entry.project.name}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.totalDutyHrs}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{`Regular: ${entry.normalHrs}h, OT: ${entry.overtime}h`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 md:mx-auto max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-8 py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === 'create'
              ? 'Create New Employee'
              : employee
                ? `${employee.name} - Employee Profile`
                : 'Employee Profile'
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="w-full px-8 py-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
            {mode === 'create' ? (
              <>
                <TabButton
                  tab="overview"
                  label="Create Employee"
                  isActive={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                />
                {employee && (
                  <TabButton
                    tab="timesheet"
                    label="View Created"
                    isActive={activeTab === 'timesheet'}
                    onClick={() => setActiveTab('timesheet')}
                  />
                )}
              </>
            ) : (
              <>
                <TabButton
                  tab="overview"
                  label="Overview"
                  isActive={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                />
                <TabButton
                  tab="timesheet"
                  label="Timesheet History"
                  isActive={activeTab === 'timesheet'}
                  onClick={() => setActiveTab('timesheet')}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">
                  {mode === 'create' ? 'Creating employee...' : 'Loading employee details...'}
                </p>
              </div>
            </div>
          ) : mode === 'create' ? (
            activeTab === 'overview' ? <CreateEmployeeForm /> : employee ? <OverviewTab /> : <CreateEmployeeForm />
          ) : employee ? (
            activeTab === 'overview' ? <OverviewTab /> : <TimesheetTab />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Employee details not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;
