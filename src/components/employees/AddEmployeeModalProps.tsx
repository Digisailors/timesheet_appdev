import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: EmployeeFormData) => void;
  editingEmployee?: Employee | null;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingEmployee
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
    specialization: ""
  });

  React.useEffect(() => {
    if (editingEmployee) {
      const nameParts = editingEmployee.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        firstName,
        lastName,
        designation: editingEmployee.project,
        designationType: editingEmployee.designation,
        phoneNumber: "",
        email: editingEmployee.email,
        address: "",
        experience: "",
        dateOfJoining: "",
        specialization: ""
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
        dateOfJoining: "",
        specialization: ""
      });
    }
  }, [editingEmployee]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!editingEmployee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/50">
      <div className="relative w-full max-w-3xl mx-4 md:mx-auto max-h-[95vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto px-4 sm:px-6 py-4 flex-1">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                { label: "First Name", name: "firstName", type: "text", placeholder: "Enter First name" },
                { label: "Last Name", name: "lastName", type: "text", placeholder: "Enter Last name" },
                { label: "Designation", name: "designation", type: "text", placeholder: "Enter Designation" },
                { label: "Phone Number", name: "phoneNumber", type: "tel", placeholder: "+1234567890" },
                { label: "Email Address", name: "email", type: "email", placeholder: "Enter Email Address" },
                { label: "Date of Joining", name: "dateOfJoining", type: "date" },
                { label: "Experience", name: "experience", type: "text", placeholder: "e.g., 5 years" },
                { label: "Specialization", name: "specialization", type: "text", placeholder: "Enter Skills" }
              ].map(field => (
                <div className="space-y-2" key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              ))}

              {/* Designation Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Designation Type</label>
                <select
                  name="designationType"
                  value={formData.designationType}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Designation Type</option>
                  <option value="Regular">Regular</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Rental">Rental</option>
                  <option value="Coaster Driver">Coaster Driver</option>
                </select>
              </div>

              {/* Address */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address Details"
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px]"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            {isEditing ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
