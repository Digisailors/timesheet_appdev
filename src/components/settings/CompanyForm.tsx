import React, { useState, useEffect } from 'react';
import { FileText, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

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
}) => {
  const [formData, setFormData] = useState<CompanyData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companyExists, setCompanyExists] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/company/all`);
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
    return formData.taxID.trim() !== '';
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert('Tax ID is required and cannot be empty.');
      return;
    }
    setIsLoading(true);
    try {
      const url = companyExists
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/update/${formData.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/create`;
      const method = companyExists ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
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

  return (
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
            placeholder="Enter phone number"
            pattern="[0-9]*"
            inputMode="numeric"
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
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 mr-2"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
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
  );
};

export default CompanyForm;
