import React from 'react';
import { X } from 'lucide-react';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  initials: string;
  backgroundColor: string;
  department: string;
  location: string;
  avatar?: string;
}

interface SupervisorViewDialogProps {
  supervisor: Supervisor;
  isOpen: boolean;
  onClose: () => void;
}

const SupervisorViewDialog: React.FC<SupervisorViewDialogProps> = ({ 
  supervisor, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Supervisor Profile</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400 dark:text-gray-300" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold ${supervisor.backgroundColor}`}>
              {supervisor.initials}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{supervisor.name}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{supervisor.id}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Join Date</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">2023-11-15</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Experience</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">5 Years</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Phone Number</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">98765 43210</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Email ID</p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{supervisor.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Specialization</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">{supervisor.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorViewDialog;
