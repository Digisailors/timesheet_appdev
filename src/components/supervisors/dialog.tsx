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
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === 'add' ? 'Add New Supervisor' : 'Edit Supervisor'}
          </h2>
          <button onClick={handleCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {errors.specialization && (
                  <p className="text-red-500 text-sm">{errors.specialization}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {errors.emailAddress && (
                  <p className="text-red-500 text-sm">{errors.emailAddress}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Joining Date</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {errors.dateOfJoining && (
                  <p className="text-red-500 text-sm">{errors.dateOfJoining}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Assigned Project</label>
              <select
                name="assignedProject"
                value={formData.assignedProject}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg"
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
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
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
