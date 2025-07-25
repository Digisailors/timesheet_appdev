import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

export interface ProjectFormData {
  name: string;
  code: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
}

export interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  title?: string;
  submitLabel?: string;
  isViewMode?: boolean;
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  title = 'Create New Project',
  submitLabel = 'Create Project',
  isViewMode = false,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    code: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        location: initialData.location || '',
        description: initialData.description || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        budget: initialData.budget || '',
        status: initialData.status || 'active',
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.code.trim()) newErrors.code = 'Project code is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(Number(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;
    if (!validateForm()) return;
    setIsSubmitting(true);
    onSubmit(formData);
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: '',
      code: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      status: 'active',
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl p-6 text-gray-900 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name*</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                disabled={isViewMode}
                readOnly={isViewMode}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="e.g., HBC-2024-001"
                className={`w-full px-3 py-2 border rounded-md ${errors.code ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                disabled={isViewMode}
                readOnly={isViewMode}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location*</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter project location"
              className={`w-full px-3 py-2 border rounded-md ${errors.location ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
              disabled={isViewMode}
              readOnly={isViewMode}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter project description"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
              disabled={isViewMode}
              readOnly={isViewMode}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date*</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.startDate ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                  disabled={isViewMode}
                  readOnly={isViewMode}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.endDate ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                  disabled={isViewMode}
                  readOnly={isViewMode}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget ($)*</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="Enter budget amount"
                className={`w-full px-3 py-2 border rounded-md ${errors.budget ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                disabled={isViewMode}
                readOnly={isViewMode}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as ProjectFormData['status'])}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                disabled={isViewMode}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            {!isViewMode && submitLabel && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectDialog;
