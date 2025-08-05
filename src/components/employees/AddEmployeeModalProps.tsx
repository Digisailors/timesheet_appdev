import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  designationType?: string;
  phoneNumber?: string;
  address?: string;
  experience?: string;
  dateOfJoining?: string;
  specialization?: string;
  project: string;
  workHours: string;
  workingHours?: string; // Added this field
  normalHours?: string; // Added this field
  otHours?: string; // Added this field
  perHourRate?: string; // API field
  overtimeRate?: string; // API field
  timeFrame: string;
  avatar: string;
  avatarBg: string;
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  designation: string;
  designationType: string;
  phoneNumber: string;
  email: string;
  address: string;
  experience: string;
  dateOfJoining: string;
  specialization: string;
  workingHours: string; // Added this field
  normalHours: string; // Added this field
  otHours: string; // Added this field
}

// API payload interface
interface EmployeeAPIPayload {
  firstName: string;
  lastName: string;
  designation: string;
  designationType: string;
  phoneNumber: string;
  email: string;
  address: string;
  experience: string;
  dateOfJoining: string;
  specialization: string;
  workingHours: string;
  perHourRate: string; // API expects this field name
  overtimeRate: string; // API expects this field name
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: EmployeeAPIPayload) => void; // Updated to use API payload type
  editingEmployee?: Employee | null;
  employees?: Employee[]; // Add this prop to pass existing employees
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingEmployee,
  employees = [] // Default to empty array
}) => {
  const [formData, setFormData] = React.useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    designation: "",
    designationType: "",
    phoneNumber: "",
    email: "",
    address: "",
    experience: "",
    dateOfJoining: "",
    specialization: "",
    workingHours: "", // Added this field
    normalHours: "", // Added this field
    otHours: "" // Added this field
  });

  const [errors, setErrors] = React.useState<{[key: string]: string}>({});
  const [touched, setTouched] = React.useState<{[key: string]: boolean}>({});

React.useEffect(() => {
  if (editingEmployee) {
    const nameParts = editingEmployee.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Fix for working hours - ensure it has the 'hr' suffix for the select dropdown
    let workingHoursValue = editingEmployee.workingHours || "";
    if (workingHoursValue && !workingHoursValue.includes('hr')) {
      workingHoursValue = workingHoursValue + 'hr';
    }

    setFormData({
      firstName,
      lastName,
      designation: editingEmployee.designation || "",
      designationType: editingEmployee.designationType || "",
      phoneNumber: editingEmployee.phoneNumber || "+0000000000",
      email: editingEmployee.email || "",
      address: editingEmployee.address || "Some Address",
      experience: editingEmployee.experience || "0 years",
      dateOfJoining: editingEmployee.dateOfJoining || new Date().toISOString().split('T')[0],
      specialization: editingEmployee.specialization || editingEmployee.project || "",
      workingHours: workingHoursValue, // Fixed this field
      normalHours: editingEmployee.perHourRate || editingEmployee.normalHours || "", // Map from API field
      otHours: editingEmployee.overtimeRate || editingEmployee.otHours || "" // Map from API field
    });
  } else {
    setFormData({
      firstName: "",
      lastName: "",
      designation: "",
      designationType: "",
      phoneNumber: "",
      email: "",
      address: "",
      experience: "",
      dateOfJoining: new Date().toISOString().split('T')[0],
      specialization: "",
      workingHours: "", // Added this field
      normalHours: "", // Added this field
      otHours: "" // Added this field
    });
  }
  // Reset errors when modal opens/closes or editing employee changes
  setErrors({});
  setTouched({});
}, [editingEmployee, isOpen]);

  const checkEmailExists = (email: string): boolean => {
    if (!email.trim()) return false;
    
    // If editing, exclude the current employee's email from the check
    const emailsToCheck = editingEmployee 
      ? employees.filter(emp => emp.id !== editingEmployee.id)
      : employees;
    
    return emailsToCheck.some(emp => emp.email.toLowerCase() === email.toLowerCase());
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? 'Please fill this field' : '';
      case 'lastName':
        return !value.trim() ? 'Please fill this field' : '';
      case 'email':
        if (!value.trim()) return 'Please fill this field';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        if (checkEmailExists(value)) return 'This email already exists';
        return '';
      case 'designation':
        return !value.trim() ? 'Please fill this field' : '';
      case 'designationType':
        return !value.trim() ? 'Please fill this field' : '';
      case 'phoneNumber':
        if (!value.trim()) return 'Please fill this field';
        const phoneDigits = value.replace(/\D/g, ''); // Remove all non-digit characters
        if (phoneDigits.length !== 10) return 'Please enter exactly 10 numbers';
        return '';
      case 'address':
        return !value.trim() ? 'Please fill this field' : '';
      case 'experience':
        return !value.trim() ? 'Please fill this field' : '';
      case 'dateOfJoining':
        return !value.trim() ? 'Please fill this field' : '';
      case 'specialization':
        return !value.trim() ? 'Please fill this field' : '';
      case 'workingHours':
        return !value.trim() ? 'Please fill this field' : '';
      case 'normalHours':
        if (!value.trim()) return 'Please fill this field';
        const normalHoursNum = parseFloat(value);
        if (isNaN(normalHoursNum) || normalHoursNum < 0) return 'Please enter a valid number';
        return '';
      case 'otHours':
        if (!value.trim()) return 'Please fill this field';
        const otHoursNum = parseFloat(value);
        if (isNaN(otHoursNum) || otHoursNum < 0) return 'Please enter a valid number';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    
    // Special handling for phone number to allow only digits
    if (name === 'phoneNumber') {
      // Remove all non-digit characters and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }

      // Validate field in real time if it was touched
      if (touched[name]) {
        const error = validateField(name, digitsOnly);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    } 
    // Special handling for normalHours and otHours to allow only numbers with decimals
    else if (name === 'normalHours' || name === 'otHours') {
      // Allow only numbers with decimal points
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Prevent multiple decimal points
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
      
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }

      // Validate field in real time if it was touched
      if (touched[name]) {
        const error = validateField(name, formattedValue);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
    // Special handling for designation type to auto-select working hours
    else if (name === 'designationType') {
      let autoWorkingHours = '';
      
      // Auto-select working hours based on designation type
      if (value === 'Rental Employee' || value === 'Coaster Driver') {
        autoWorkingHours = '10hr';
      } else if (value === 'Regular Employee' || value === 'Regular Driver') {
        autoWorkingHours = '8hr';
      }
      
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        workingHours: autoWorkingHours
      }));

      // Clear errors for both fields when designation type changes
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      if (errors['workingHours'] && autoWorkingHours) {
        setErrors(prev => ({ ...prev, workingHours: '' }));
      }

      // Validate designation type field in real time if it was touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    } 
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }

      // Validate field in real time if it was touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate ALL fields - now all are required
    const newErrors: {[key: string]: string} = {};
    const allFields = ['firstName', 'lastName', 'email', 'designation', 'designationType', 'phoneNumber', 'address', 'experience', 'dateOfJoining', 'specialization', 'workingHours', 'normalHours', 'otHours'];
    
    allFields.forEach(field => {
      const error = validateField(field, formData[field as keyof EmployeeFormData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Mark all fields as touched
    const newTouched: {[key: string]: boolean} = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(prev => ({ ...prev, ...newTouched }));

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Map form data to API payload format
    const apiPayload: EmployeeAPIPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      designation: formData.designation,
      designationType: formData.designationType,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      experience: formData.experience,
      dateOfJoining: formData.dateOfJoining,
      specialization: formData.specialization,
      workingHours: formData.workingHours.replace('hr', ''), // Remove 'hr' suffix for API
      perHourRate: formData.normalHours, // Map normalHours to perHourRate
      overtimeRate: formData.otHours // Map otHours to overtimeRate
    };

    // If no errors, submit the form with mapped data
    onSubmit(apiPayload);
    onClose();
  };

  const getFieldClassName = (fieldName: string, baseClassName: string) => {
    const hasError = errors[fieldName] && touched[fieldName];
    if (hasError) {
      return baseClassName.replace(
        'border-gray-300 dark:border-gray-600',
        'border-red-300 dark:border-red-500'
      ).replace(
        'focus:ring-blue-500 focus:border-blue-500',
        'focus:ring-red-500 focus:border-red-500'
      );
    }
    return baseClassName;
  };

  if (!isOpen) return null;
  const isEditing = !!editingEmployee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 md:mx-auto max-h-[95vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-4 sm:px-6 py-4 flex-1">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter First name"
                  className={getFieldClassName('firstName', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Last name"
                  className={getFieldClassName('lastName', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Email Address"
                  className={getFieldClassName('email', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="1234567890"
                  maxLength={10}
                  className={getFieldClassName('phoneNumber', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Designation (e.g., Software Engineer)"
                  className={getFieldClassName('designation', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.designation && touched.designation && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.designation}</p>
                )}
              </div>

              {/* Designation Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Designation Type *
                </label>
                <select
                  name="designationType"
                  value={formData.designationType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClassName('designationType', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                >
                  <option value="">Select Designation Type</option>
                  <option value="Regular Employee">Regular Employee</option>
                  <option value="Rental Employee">Rental Employee</option>
                  <option value="Regular Driver">Regular Driver</option>
                  <option value="Coaster Driver">Coaster Driver</option>
                </select>
                {errors.designationType && touched.designationType && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.designationType}</p>
                )}
              </div>

              {/* Date of Joining */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Joining *
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClassName('dateOfJoining', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.dateOfJoining && touched.dateOfJoining && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.dateOfJoining}</p>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., 5 years"
                  className={getFieldClassName('experience', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.experience && touched.experience && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.experience}</p>
                )}
              </div>

              {/* Specialization/Skills */}
              

              {/* Working Hours */}
              {/* <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Working Hours *
                </label>
                <select
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClassName('workingHours', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                >
                  <option value="">Select Working Hours</option>
                  <option value="8hr">8hr</option>
                  <option value="10hr">10hr</option>
                </select>
                {errors.workingHours && touched.workingHours && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.workingHours}</p>
                )}
              </div> */}

              {/* Per Hour Rate (Normal Hours) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Per Hour Rate *
                </label>
                <input
                  type="text"
                  name="normalHours"
                  value={formData.normalHours}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter amount (e.g., 700)"
                  className={getFieldClassName('normalHours', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.normalHours && touched.normalHours && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.normalHours}</p>
                )}
              </div>

              {/* Overtime Rate (OT Hours) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overtime Rate *
                </label>
                <input
                  type="text"
                  name="otHours"
                  value={formData.otHours}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter amount (e.g., 104)"
                  className={getFieldClassName('otHours', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.otHours && touched.otHours && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.otHours}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specialization/Skills *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Skills/Specialization (e.g., React, Node.js, Python)"
                  className={getFieldClassName('specialization', "w-175 px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}
                  required
                />
                {errors.specialization && touched.specialization && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.specialization}</p>
                )}
              </div>

              {/* Address */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter full address"
                  rows={3}
                  className={getFieldClassName('address', "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px]")}
                  required
                />
                {errors.address && touched.address && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;