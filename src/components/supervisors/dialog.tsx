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
  assignedProject: ''
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

  // Update form data when initialData changes or mode changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [mode, initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof SupervisorData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SupervisorData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Date of joining is required';
    }
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }
    if (!formData.assignedProject.trim()) {
      newErrors.assignedProject = 'Assigned project is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    console.log(`${mode === 'add' ? 'Adding' : 'Updating'} supervisor:`, formData);
    
    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(formData, mode);
    }
    
    // Close dialog
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset form data and errors
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
    
    // Close dialog
    if (onClose) {
      onClose();
    }
  };

  // Get dialog title and button text based on mode
  const dialogTitle = mode === 'add' ? 'Add New Supervisor' : 'Edit Supervisor';
  const submitButtonText = mode === 'add' ? 'Add Supervisor' : 'Update Supervisor';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">{dialogTitle}</h2>
          <button 
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dialog Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Construction Management"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.specialization ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
          </div>

          {/* Phone Number and Email Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1234567890"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder="Enter Email Address"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address Details"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Date of Joining and Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Joining <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dateOfJoining ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateOfJoining && <p className="text-red-500 text-sm mt-1">{errors.dateOfJoining}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 5 years"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
            </div>
          </div>

          {/* Assigned Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Project <span className="text-red-500">*</span>
            </label>
            <select
              name="assignedProject"
              value={formData.assignedProject}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.assignedProject ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Project</option>
              <option value="Highway Bridge">Highway Bridge</option>
              <option value="Downtown Plaza">Downtown Plaza</option>
              <option value="Factory Building">Factory Building</option>
              <option value="Office Complex">Office Complex</option>
            </select>
            {errors.assignedProject && <p className="text-red-500 text-sm mt-1">{errors.assignedProject}</p>}
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}