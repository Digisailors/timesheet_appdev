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
  assignedProject?: string; // project name for display
  assignedProjectId?: string; // project id for backend
  password?: string;
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
  assignedProject: '',
  assignedProjectId: '',
  password: ''
};

export default function SupervisorDialog({
  isOpen = false,
  onClose,
  mode = 'add',
  initialData,
  onSubmit,
  projects = [],
  selectedProjectId,
  setSelectedProjectId,
}: SupervisorDialogProps) {
  const [formData, setFormData] = useState<SupervisorData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<SupervisorData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [localProjects, setLocalProjects] = useState<{ id: string; name: string }[]>(projects);

  useEffect(() => {
    if (projects.length > 0) setLocalProjects(projects);
    else {
      // fetch projects if needed
      const fetchProjects = async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5088';
          const response = await fetch(`${baseUrl}/projects/all`);
          if (!response.ok) throw new Error('Failed to fetch projects');
          const data = await response.json();
          const projectList = Array.isArray(data)
            ? data.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))
            : Array.isArray(data.data)
            ? data.data.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))
            : [];
          setLocalProjects(projectList);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };
      fetchProjects();
    }

    if (mode === 'edit' && initialData) {
      setFormData(initialData);
      setSelectedProjectId?.(initialData.assignedProjectId || null);
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

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, assignedProject: localProjects.find(p => p.id === value)?.name || '', assignedProjectId: value }));
    setSelectedProjectId?.(value);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SupervisorData> = {};

    // Validation for required fields
    if (!formData.fullName?.trim()) newErrors.fullName = 'Name is required';
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
    if (!formData.assignedProject?.trim()) {
      newErrors.assignedProject = 'Project is required';
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
      assignedProject: formData.assignedProject,
      assignedProjectId: formData.assignedProjectId,
      password: formData.password,
    };

    onSubmit?.(dataToSend, mode);
    onClose?.();
  };

  const handleCancel = () => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
      setSelectedProjectId?.(initialData.assignedProjectId || null);
    } else {
      setFormData(defaultFormData);
      setSelectedProjectId?.(null);
    }
    setErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60">
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
              <FormInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                error={errors.fullName}
                onChange={handleInputChange}
                required
              />
              <FormInput
                label="Email Address"
                name="emailAddress"
                type="email"
                value={formData.emailAddress}
                error={errors.emailAddress}
                onChange={handleInputChange}
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
              />
              <FormInput
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                error={errors.phoneNumber}
                onChange={handleInputChange}
              />
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
              />
              <FormInput
                label="Experience"
                name="experience"
                value={formData.experience || ''}
                error={errors.experience}
                onChange={handleInputChange}
              />
            </div>

            {/* Assigned Project */}
            <div>
              <label className="text-sm font-medium">Assigned Project</label>
              <select
                value={selectedProjectId || ''}
                onChange={handleProjectChange}
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              >
                <option value="">Select project</option>
                {localProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.assignedProject && (
                <p className="text-red-500 text-sm">{errors.assignedProject}</p>
              )}
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
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
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
      className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);