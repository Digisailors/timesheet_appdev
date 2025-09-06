import React, { useState, useEffect } from 'react';
import { FileText, Edit, X, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';

type CompanyData = {
  id?: string;
  companyName: string;
  registrationNumber: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  taxID: string;
};

interface CompanyFormProps {
  initialData?: CompanyData;
  onSave: (data: CompanyData) => Promise<void> | void;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  initialData = {
    companyName: '',
    registrationNumber: '',
    address: '',
    phoneNumber: '',
    email: '',
    website: '',
    taxID: ''
  },
  onSave
}) => {
  const [formData, setFormData] = useState<CompanyData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companyExists, setCompanyExists] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/company/all`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        if (result.data && result.data.length > 0) {
          const company = result.data[0];
          setFormData({
            id: company.id,
            companyName: company.companyName,
            registrationNumber: company.registrationNumber,
            address: company.address,
            phoneNumber: company.phoneNumber,
            email: company.email,
            website: company.website,
            taxID: company.taxID || 'defaulttaxID'
          });
          setCompanyExists(true);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
        showToast('Failed to fetch company details. Please try again.', 'error');
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    if (field === 'phoneNumber') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: numbersOnly
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (formData.taxID.trim() === '') {
      showToast('Tax ID is required and cannot be empty.', 'error');
      return false;
    }

    if (formData.phoneNumber.length !== 10) {
      showToast('Phone number must be exactly 10 digits.', 'error');
      return false;
    }

    if (formData.email.trim() !== '' && !formData.email.includes('@')) {
      showToast('Please enter a valid email address with @ symbol.', 'error');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }

      const url = companyExists
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/update/${formData.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/create`;

      const method = companyExists ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error response:', errorResponse);
        throw new Error(errorResponse.message || 'Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      if (!companyExists) {
        setCompanyExists(true);
      }

      setIsEditing(false);
      toast.success('Details saved successfully', {
        style: {
          background: 'blue',
          color: 'white',
        },
      });

      await onSave(formData);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error);
        toast.error(`Failed to save: ${error.message}`);
      } else {
        console.error('Unknown error:', error);
        toast.error('Failed to save due to an unknown error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    console.log('Edit button clicked');
  };

  const handleDelete = async () => {
    if (!formData.id) return;

    setIsDeleting(true);

    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/delete/${formData.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          }
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Failed to delete company' }));
        throw new Error(err.message || 'Failed to delete company');
      }

      setFormData({
        companyName: '',
        registrationNumber: '',
        address: '',
        phoneNumber: '',
        email: '',
        website: '',
        taxID: ''
      });

      setCompanyExists(false);
      setIsEditing(false);

      toast.success('Company deleted successfully', {
        style: { background: 'blue', color: 'white' },
      });

      setShowDeleteConfirm(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error while deleting';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 mr-3 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Company Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter company name"
              disabled={!isEditing && companyExists}
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              placeholder="Enter registration number"
              disabled={!isEditing && companyExists}
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address"
              rows={3}
              disabled={!isEditing && companyExists}
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Enter phone number (10 digits)"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={10}
              disabled={!isEditing && companyExists}
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@domain.com"
              disabled={!isEditing && companyExists}
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="Enter website"
              disabled={!isEditing && companyExists}
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tax ID
            </label>
            <input
              type="text"
              value={formData.taxID}
              onChange={(e) => handleInputChange('taxID', e.target.value)}
              placeholder="Enter tax ID"
              disabled={!isEditing && companyExists}
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end items-center">
          {companyExists && (
            <>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading || isDeleting}
                className="flex items-center px-3 py-2 mr-2 border border-red-300 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                aria-label="Delete Company"
                title="Delete Company"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 mr-2"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Company Details
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            disabled={isLoading || (!isEditing && companyExists)}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (companyExists ? 'Updating...' : 'Creating...') : companyExists ? 'Save Company Details' : 'Create Company Details'}
          </button>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg border max-w-sm transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-full bg-white border-gray-200`}
          >
            <div className="flex-shrink-0">
              {toast.type === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${toast.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                {toast.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => removeToast(toast.id)}
                className="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Company?</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              This action will permanently delete the company details. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyForm;
