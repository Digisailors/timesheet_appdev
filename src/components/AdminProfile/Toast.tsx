
import React from 'react';
import {AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 p-6 w-96 max-w-sm mx-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="ml-3 w-full">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Confirm Action
            </h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-600 rounded-md hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;