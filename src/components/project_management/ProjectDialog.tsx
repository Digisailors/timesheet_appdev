import React, { useState, useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

export interface ProjectFormData {
  name: string;
  code: string;
  locations: string[];
  typesOfWork: string[];
  projectCodes: string[]; // Add individual project codes
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  clientName: string;
  PoContractNumber: string;
}

export interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ProjectFormData) => Promise<void>;
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
    locations: [''],
    typesOfWork: [''],
    projectCodes: [''],
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'pending',
    clientName: '',
    PoContractNumber: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectSets, setProjectSets] = useState([{ location: '', typeOfWork: '', projectCode: '' }]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        locations: initialData.locations && initialData.locations.length > 0 ? initialData.locations : [''],
        typesOfWork: initialData.typesOfWork && initialData.typesOfWork.length > 0 ? initialData.typesOfWork : [''],
        projectCodes: initialData.projectCodes && initialData.projectCodes.length > 0 ? initialData.projectCodes : [''],
        description: initialData.description || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        budget: initialData.budget || '',
        status: initialData.status || 'pending',
        clientName: initialData.clientName || '',
        PoContractNumber: initialData.PoContractNumber || '',
      });
      
             // Initialize project sets based on initial data
       if (initialData.locations && initialData.typesOfWork) {
         const maxLength = Math.max(initialData.locations.length, initialData.typesOfWork.length);
         const newProjectSets = [];
         for (let i = 0; i < maxLength; i++) {
           newProjectSets.push({
             location: initialData.locations[i] || '',
             typeOfWork: initialData.typesOfWork[i] || '',
             projectCode: initialData.projectCodes?.[i] || initialData.code || ''
           });
         }
         setProjectSets(newProjectSets.length > 0 ? newProjectSets : [{ location: '', typeOfWork: '', projectCode: '' }]);
       } else {
         setProjectSets([{ location: '', typeOfWork: '', projectCode: '' }]);
       }
      
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    
    // Validate project sets
    const hasEmptyLocation = projectSets.some(set => !set.location.trim());
    const hasEmptyTypeOfWork = projectSets.some(set => !set.typeOfWork.trim());
    const hasEmptyProjectCode = projectSets.some(set => !set.projectCode.trim());
    
    if (hasEmptyLocation) {
      newErrors.locations = 'All location fields are required';
    }
    if (hasEmptyTypeOfWork) {
      newErrors.typesOfWork = 'All type of work fields are required';
    }
    if (hasEmptyProjectCode) {
      newErrors.code = 'All project code fields are required';
    }
    
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

  const handleSubmit = async () => {
    if (isViewMode) return;
    
    // Update formData with project sets data before validation
    const updatedFormData = {
      ...formData,
      locations: projectSets.map(set => set.location),
      typesOfWork: projectSets.map(set => set.typeOfWork),
      projectCodes: projectSets.map(set => set.projectCode), // Use individual project codes
      code: projectSets[0]?.projectCode || '' // Using first project code as main code
    };
    setFormData(updatedFormData);
    
    if (!validateForm()) return;
    setIsSubmitting(true);
    await onSubmit(updatedFormData);
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: '',
      code: '',
      locations: [''],
      typesOfWork: [''],
      projectCodes: [''],
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      status: 'pending',
      clientName: '',
      PoContractNumber: '',
    });
    setProjectSets([{ location: '', typeOfWork: '', projectCode: '' }]);
    setErrors({});
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddProjectSet = () => {
    setProjectSets(prev => [...prev, { location: '', typeOfWork: '', projectCode: '' }]);
  };

  const handleRemoveProjectSet = (index: number) => {
    if (projectSets.length > 1) {
      const newProjectSets = projectSets.filter((_, i) => i !== index);
      setProjectSets(newProjectSets);
    }
  };

  const handleProjectSetChange = (index: number, field: 'location' | 'typeOfWork' | 'projectCode', value: string) => {
    const newProjectSets = [...projectSets];
    newProjectSets[index][field] = value;
    setProjectSets(newProjectSets);
    
    // Clear related errors when user starts typing
    if (field === 'location' && errors.locations) {
      setErrors(prev => ({ ...prev, locations: undefined }));
    }
    if (field === 'typeOfWork' && errors.typesOfWork) {
      setErrors(prev => ({ ...prev, typesOfWork: undefined }));
    }
    if (field === 'projectCode' && errors.code) {
      setErrors(prev => ({ ...prev, code: undefined }));
    }
  };

  if (!isOpen) return null;

  // const getTomorrowDate = () => {
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   return tomorrow.toISOString().split('T')[0];
  // };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl p-3 sm:p-4 md:p-6 text-gray-900 dark:text-white my-2 sm:my-4 md:my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold truncate pr-2">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl flex-shrink-0"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Client Name and Project Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name*</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Enter client name"
                className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${errors.clientName ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                disabled={isViewMode}
                readOnly={isViewMode}
              />
              {errors.clientName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.clientName}</p>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name*</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                disabled={isViewMode}
                readOnly={isViewMode}
              />
              {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Project Sets Section */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-medium">Project Details</h3>
            </div>

            {projectSets.map((projectSet, index) => (
              <div key={index} className="border rounded-md p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                {/* Mobile: Stack all fields vertically */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location* {index > 0 && `(${index + 1})`}
                    </label>
                    <input
                      type="text"
                      value={projectSet.location}
                      onChange={(e) => handleProjectSetChange(index, 'location', e.target.value)}
                      placeholder="Enter project location"
                      className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${errors.locations ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      disabled={isViewMode}
                      readOnly={isViewMode}
                    />
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type of Work* {index > 0 && `(${index + 1})`}
                    </label>
                    <input
                      type="text"
                      value={projectSet.typeOfWork}
                      onChange={(e) => handleProjectSetChange(index, 'typeOfWork', e.target.value)}
                      placeholder="Enter type of work"
                      className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${errors.typesOfWork ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      disabled={isViewMode}
                      readOnly={isViewMode}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Code* {index > 0 && `(${index + 1})`}
                      </label>
                      <input
                        type="text"
                        value={projectSet.projectCode}
                        onChange={(e) => handleProjectSetChange(index, 'projectCode', e.target.value)}
                        placeholder="Enter project code"
                        className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${errors.code ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        disabled={isViewMode}
                        readOnly={isViewMode}
                      />
                    </div>
                    {!isViewMode && projectSets.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-md transition-colors duration-200 self-start sm:self-auto"
                        onClick={() => handleRemoveProjectSet(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add and Save buttons - Mobile responsive */}
            {!isViewMode && (
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 sm:gap-0">
                <button
                  type="button"
                  onClick={handleAddProjectSet}
                  className="w-full sm:w-auto px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Add
                </button>
               
              </div>
            )}

            {/* Error messages for project sets */}
            {errors.locations && <p className="text-red-500 text-xs sm:text-sm">{errors.locations}</p>}
            {errors.typesOfWork && <p className="text-red-500 text-xs sm:text-sm">{errors.typesOfWork}</p>}
            {errors.code && <p className="text-red-500 text-xs sm:text-sm">{errors.code}</p>}
          </div>

          {/* Po/Contract Number */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Po/Contract Number</label>
            <input
              type="text"
              value={formData.PoContractNumber}
              onChange={(e) => handleInputChange('PoContractNumber', e.target.value)}
              placeholder="Enter contract number"
              className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base border-gray-300 ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              disabled={isViewMode}
              readOnly={isViewMode}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter project description"
              rows={3}
              className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px]`}
              disabled={isViewMode}
              readOnly={isViewMode}
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date*</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
              className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${errors.startDate ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              disabled={isViewMode}
              readOnly={isViewMode}
            />
            {errors.startDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
              className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${errors.endDate ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              disabled={isViewMode}
              readOnly={isViewMode}
            />
            {errors.endDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.endDate}</p>}
          </div>
          </div>

          {/* Budget and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget ($)*</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="Enter budget amount"
                className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${errors.budget ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                disabled={isViewMode}
                readOnly={isViewMode}
              />
              {errors.budget && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.budget}</p>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as ProjectFormData['status'])}
                className={`w-full px-2 sm:px-3 py-2 border rounded-md text-sm sm:text-base ${isViewMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-600 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                disabled={isViewMode}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-3 sm:gap-0 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
            {!isViewMode && (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : submitLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDialog;