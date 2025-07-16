'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SupervisorData {
  fullName: string;
  specialization: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  dateOfJoining: string;
  experience: string;
  assignedProject: string;
  password: string;
}

interface SupervisorDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: 'add' | 'edit';
  initialData?: SupervisorData;
  onSubmit?: (data: SupervisorData, mode: 'add' | 'edit') => void;
}

const defaultFormData: SupervisorData = {
  fullName: '',
  specialization: '',
  phoneNumber: '',
  emailAddress: '',
  address: '',
  dateOfJoining: '',
  experience: '',
  assignedProject: '',
  password: ''
};

export default function SupervisorDialog({
  isOpen = false,
  onClose,
  mode = 'add',
  initialData,
  onSubmit
}: SupervisorDialogProps) {
  const [formData, setFormData] = useState<SupervisorData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<SupervisorData>>({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [mode, initialData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof SupervisorData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SupervisorData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Joining date is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.assignedProject.trim()) newErrors.assignedProject = 'Project is required';
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit?.(formData, mode);
    onClose?.();
  };

  const handleCancel = () => {
    setFormData(mode === 'edit' && initialData ? initialData : defaultFormData);
    setErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60">
      <div className="bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {mode === 'add' ? 'Add New Supervisor' : 'Edit Supervisor'}
          </h2>
          <button onClick={handleCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Full Name" name="fullName" value={formData.fullName} error={errors.fullName} onChange={handleInputChange} />
              <FormInput label="Specialization" name="specialization" value={formData.specialization} error={errors.specialization} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Phone" name="phoneNumber" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleInputChange} />
              <FormInput label="Email" name="emailAddress" type="email" value={formData.emailAddress} error={errors.emailAddress} onChange={handleInputChange} />
            </div>

            <FormInput label="Password" name="password" type="password" value={formData.password} error={errors.password} onChange={handleInputChange} />

            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Joining Date" name="dateOfJoining" type="date" value={formData.dateOfJoining} error={errors.dateOfJoining} onChange={handleInputChange} />
              <FormInput label="Experience" name="experience" value={formData.experience} error={errors.experience} onChange={handleInputChange} />
            </div>

            <div>
              <label className="text-sm font-medium">Assigned Project</label>
              <select
                name="assignedProject"
                value={formData.assignedProject}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="">Select project</option>
                <option value="Highway Bridge">Highway Bridge</option>
                <option value="Downtown Plaza">Downtown Plaza</option>
                <option value="Factory Building">Factory Building</option>
                <option value="Office Complex">Office Complex</option>
              </select>
              {errors.assignedProject && (
                <p className="text-red-500 text-sm">{errors.assignedProject}</p>
              )}
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

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  error,
  onChange
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
