import React, { useState, ChangeEvent } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Users2 } from 'lucide-react';

interface Designation {
  name: string;
  status?: string;
}

const DesignationSettings: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([
    { name: 'Regular' },
    { name: 'Driver' },
    { name: 'Rental' },
    { name: 'Coaster Driver' },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDesignationIndex, setCurrentDesignationIndex] = useState<number | null>(null);
  const [newDesignation, setNewDesignation] = useState<Designation>({ name: '', status: 'Active' });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDesignation(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isEditing && currentDesignationIndex !== null) {
      const updatedDesignations = [...designations];
      updatedDesignations[currentDesignationIndex] = newDesignation;
      setDesignations(updatedDesignations);
    } else {
      setDesignations(prev => [...prev, newDesignation]);
    }
    setShowPopup(false);
    setIsEditing(false);
    setCurrentDesignationIndex(null);
    setNewDesignation({ name: '', status: 'Active' });
  };

  const handleEdit = (index: number) => {
    setNewDesignation(designations[index]);
    setCurrentDesignationIndex(index);
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleDelete = (index: number) => {
    setCurrentDesignationIndex(index);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (currentDesignationIndex !== null) {
      const updatedDesignations = designations.filter((_, index) => index !== currentDesignationIndex);
      setDesignations(updatedDesignations);
    }
    setShowDeleteConfirmation(false);
    setCurrentDesignationIndex(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users2 className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-900 dark:text-white" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Employee Designations
          </h3>
        </div>
        <button
          onClick={() => {
            setShowPopup(true);
            setIsEditing(false);
            setNewDesignation({ name: '', status: 'Active' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition"
        >
          <PlusIcon className="h-4 w-4" />
          Add Designation
        </button>
      </div>
      <div className="space-y-0">
        {designations.map((designation, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-4 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4"
          >
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              {designation.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                {designation.status || 'Active'}
              </span>
              <button
                onClick={() => handleEdit(index)}
                className="p-1.5 text-gray-500 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 transition"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-500 dark:hover:bg-gray-800 rounded border border-red-300 dark:border-red-600 transition"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showPopup && (
        <>
          <div className="fixed inset-0" style={{ backdropFilter: 'blur(4px)' }}></div>
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {isEditing ? 'Edit Designation' : 'Add New Designation'}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation Type</label>
                <input
                  type="text"
                  name="name"
                  value={newDesignation.name}
                  onChange={handleInputChange}
                  readOnly={isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100 dark:bg-gray-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={newDesignation.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setIsEditing(false);
                    setCurrentDesignationIndex(null);
                    setNewDesignation({ name: '', status: 'Active' });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {showDeleteConfirmation && (
        <>
          <div className="fixed inset-0" style={{ backdropFilter: 'blur(4px)' }}></div>
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
              <p className="mb-4">Are you sure you want to delete this designation?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setCurrentDesignationIndex(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DesignationSettings;
