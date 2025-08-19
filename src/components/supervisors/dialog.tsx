'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface SupervisorData {
  fullName: string;
  emailAddress: string;
  specialization?: string;
  phoneNumber?: string;
  address?: string;
  dateOfJoining?: string;
  experience?: string;
  password?: string;
  perHourRate?: string;
  overtimeRate?: string;
  assignedProject?: string;
  assignedProjectId?: string;
}
interface SupervisorDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: 'add' | 'edit';
  initialData?: SupervisorData;
  onSubmit?: (data: SupervisorData, mode: 'add' | 'edit') => void;
  projects?: { id: string; name: string }[]; // list of projects
  selectedProjectId?: string | null; // selected project id
  setSelectedProjectId?: (id: string | null) => void;
}

const defaultFormData: SupervisorData = {
  fullName: '',
  emailAddress: '',
  specialization: '',
  phoneNumber: '',
  address: '',
  dateOfJoining: '',
  experience: '',
  password: '',
  perHourRate: '',
  overtimeRate: ''
};

export default function SupervisorDialog({
  isOpen = false,
  onClose,
  mode = 'add',
  initialData,
  onSubmit,
  projects = [],
  
  setSelectedProjectId,
}: SupervisorDialogProps) {
  const [formData, setFormData] = useState<SupervisorData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<SupervisorData>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Get today's date in YYYY-MM-DD format
  // const getTodayDate = () => {
  //   const today = new Date();
  //   return today.toISOString().split('T')[0];
  // };

  // Prevent background scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
      setSelectedProjectId?.(null);
    } else {
      setFormData(defaultFormData);
      setSelectedProjectId?.(null);
    }
    setErrors({});
  }, [mode, initialData, isOpen, projects, setSelectedProjectId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof SupervisorData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check if the value contains only letters and spaces
    const nameRegex = /^[a-zA-Z\s]*$/;
    
    if (nameRegex.test(value)) {
      setFormData(prev => ({ ...prev, fullName: value }));
    }

    // Clear error on change
    if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phoneNumber: numericValue }));

    // Clear error on change
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    // Clear error on change
    if (errors[name as keyof SupervisorData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SupervisorData> = {};

    // Validation for required fields
    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Name is required';
    } else {
      // Check if name contains only letters and spaces
      const nameRegex = /^[a-zA-Z\s]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /\d/;
      
      if (!nameRegex.test(formData.fullName.trim())) {
        if (emailRegex.test(formData.fullName.trim())) {
          newErrors.fullName = 'Name cannot be an email address';
        } else if (phoneRegex.test(formData.fullName.trim())) {
          newErrors.fullName = 'Name cannot contain numbers';
        } else {
          newErrors.fullName = 'Name can only contain letters and spaces';
        }
      }
    }
    
    if (!formData.emailAddress?.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Invalid email format';
    }
    if (formData.specialization !== undefined && !formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    if (formData.phoneNumber !== undefined && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber !== undefined && formData.phoneNumber.trim() && formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }
    if (formData.address !== undefined && !formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (formData.dateOfJoining !== undefined && !formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Joining date is required';
    }
    if (formData.experience !== undefined && !formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }
    if (formData.perHourRate !== undefined && !formData.perHourRate.trim()) {
      newErrors.perHourRate = 'Per hour rate is required';
    } else if (formData.perHourRate !== undefined && formData.perHourRate.trim() && isNaN(Number(formData.perHourRate))) {
      newErrors.perHourRate = 'Please enter a valid rate';
    }
    if (formData.overtimeRate !== undefined && !formData.overtimeRate.trim()) {
      newErrors.overtimeRate = 'Overtime rate is required';
    } else if (formData.overtimeRate !== undefined && formData.overtimeRate.trim() && isNaN(Number(formData.overtimeRate))) {
      newErrors.overtimeRate = 'Please enter a valid overtime rate';
    }
    if (mode === 'add') {
      if (!formData.password?.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Min 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dataToSend: SupervisorData = {
      fullName: formData.fullName,
      emailAddress: formData.emailAddress,
      specialization: formData.specialization,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      dateOfJoining: formData.dateOfJoining,
      experience: formData.experience,
      password: formData.password,
      perHourRate: formData.perHourRate,
      overtimeRate: formData.overtimeRate,
    };

    onSubmit?.(dataToSend, mode);
    onClose?.();
  };

  const handleCancel = () => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
      setSelectedProjectId?.(null);
    } else {
      setFormData(defaultFormData);
      setSelectedProjectId?.(null);
    }
    setErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">{mode === 'add' ? 'Add New Supervisor' : 'Edit Supervisor'}</h2>
          <button onClick={handleCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFullNameChange}
                  placeholder="Enter full name"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
              <FormInput
                label="Email Address"
                name="emailAddress"
                type="email"
                value={formData.emailAddress}
                error={errors.emailAddress}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>

            {/* Specialization & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Specialization"
                name="specialization"
                value={formData.specialization || ''}
                error={errors.specialization}
                onChange={handleInputChange}
                placeholder="Enter specialization"
              />
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Per Hour Rate & Overtime Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Per Hour Rate</label>
                <input
                  type="text"
                  name="perHourRate"
                  value={formData.perHourRate || ''}
                  onChange={handleRateChange}
                  placeholder="Enter per hour rate"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {errors.perHourRate && <p className="text-red-500 text-sm">{errors.perHourRate}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Overtime Rate</label>
                <input
                  type="text"
                  name="overtimeRate"
                  value={formData.overtimeRate || ''}
                  onChange={handleRateChange}
                  placeholder="Enter overtime rate"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {errors.overtimeRate && <p className="text-red-500 text-sm">{errors.overtimeRate}</p>}
              </div>
            </div>

            {/* Password (only in add mode) */}
            {mode === 'add' && (
              <div>
                <label className="text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password || ''}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            )}

            {/* Address */}
            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea
                name="address"
                rows={3}
                value={formData.address ?? ''}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            {/* Date of Joining & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={formData.dateOfJoining || ''}
              error={errors.dateOfJoining}
              onChange={handleInputChange}
              placeholder=""
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
            />
              <FormInput
                label="Experience"
                name="experience"
                value={formData.experience || ''}
                error={errors.experience}
                onChange={handleInputChange}
                placeholder="Enter experience (e.g., 5 years)"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {mode === 'add' ? 'Add Supervisor' : 'Update Supervisor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  error,
  onChange,
  placeholder,
  required = false,
  onClick,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onClick={onClick}
      className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
