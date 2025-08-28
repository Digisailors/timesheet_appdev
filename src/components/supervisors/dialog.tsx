/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface SupervisorData {
  id?: string;
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
  eligibleLeaveDays?: string;
  remainingLeaveDays?: string;
  unpaidLeaveDays?: string;
  assignedProject?: string;
  assignedProjectId?: string;
}

interface SupervisorDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: 'add' | 'edit';
  initialData?: SupervisorData;
  onSubmit?: (data: SupervisorData, mode: 'add' | 'edit') => void;
  projects?: { id: string; name: string }[];
  selectedProjectId?: string | null;
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
  overtimeRate: '',
  eligibleLeaveDays: '',
  remainingLeaveDays: '',
  unpaidLeaveDays: '',
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
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
    if (errors[name as keyof SupervisorData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (nameRegex.test(value)) {
      setFormData(prev => ({ ...prev, fullName: value }));
    }
    if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phoneNumber: numericValue }));
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name as keyof SupervisorData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SupervisorData> = {};
    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Name is required';
    } else {
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
    if (formData.emailAddress?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
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
    if (formData.eligibleLeaveDays !== undefined && !formData.eligibleLeaveDays.trim()) {
      newErrors.eligibleLeaveDays = 'Eligible leave days is required';
    } else if (formData.eligibleLeaveDays !== undefined && formData.eligibleLeaveDays.trim() && isNaN(Number(formData.eligibleLeaveDays))) {
      newErrors.eligibleLeaveDays = 'Please enter a valid number';
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
    const dataToSend: any = {
      fullName: formData.fullName,
      emailAddress: formData.emailAddress,
      specialization: formData.specialization,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      dateOfJoining: formData.dateOfJoining,
      experience: formData.experience,
      password: formData.password,
      perHourRate: formData.perHourRate ? Number(formData.perHourRate) : undefined,
      overtimeRate: formData.overtimeRate ? Number(formData.overtimeRate) : undefined,
      eligibleLeaveDays: formData.eligibleLeaveDays ? Number(formData.eligibleLeaveDays) : undefined,
      assignedProjectId: formData.assignedProjectId,
    };
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === undefined || dataToSend[key] === '') {
        delete dataToSend[key];
      }
    });
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
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">{mode === 'add' ? 'Add New Supervisor' : 'Edit Supervisor'}</h2>
          <button onClick={handleCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleInputChange}
                  placeholder="Enter specialization"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization}</p>}
              </div>
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
            <div>
              <label className="text-sm font-medium">
                Eligible Leave Days <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="eligibleLeaveDays"
                value={formData.eligibleLeaveDays || ''}
                onChange={handleInputChange}
                placeholder="Enter eligible leave days"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              {errors.eligibleLeaveDays && <p className="text-red-500 text-sm">{errors.eligibleLeaveDays}</p>}
            </div>
            {mode === 'edit' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Remaining Leave Days</label>
                  <input
                    type="text"
                    name="remainingLeaveDays"
                    value={formData.remainingLeaveDays || ''}
                    readOnly
                    className="w-full mt-1 p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Unpaid Leave Days</label>
                  <input
                    type="text"
                    name="unpaidLeaveDays"
                    value={formData.unpaidLeaveDays || ''}
                    readOnly
                    className="w-full mt-1 p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Date of Joining <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining || ''}
                  onChange={handleInputChange}
                  onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {errors.dateOfJoining && <p className="text-red-500 text-sm">{errors.dateOfJoining}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">
                  Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  placeholder="Enter experience (e.g., 5 years)"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
              </div>
            </div>
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
