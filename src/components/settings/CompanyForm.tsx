// CompanyForm.tsx
import React, { useState } from 'react';
import { FileText } from 'lucide-react'; // ✅ Imported icon

type CompanyData = {
  companyName: string;
  registrationNumber: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  taxId: string;
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
    taxId: ''
  },
  onSave
}) => {
  const [formData, setFormData] = useState<CompanyData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    if (field === 'phoneNumber') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: numbersOnly
      }));
      return;
    }

    if (field === 'email') {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 mr-3 text-gray-700" /> {/* ✅ Replaced icon */}
        <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter company name"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            placeholder="Enter registration number"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter address"
            rows={3}
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="Enter phone number (numbers only)"
            pattern="[0-9]*"
            inputMode="numeric"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email (example@domain.com)"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="text"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="Enter website"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tax ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax ID
          </label>
          <input
            type="text"
            value={formData.taxId}
            onChange={(e) => handleInputChange('taxId', e.target.value)}
            placeholder="Enter tax ID"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Company Details'}
        </button>
      </div>
    </div>
  );
};

export default CompanyForm;
