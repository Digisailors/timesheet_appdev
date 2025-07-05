import { Eye, Edit, Trash2 } from 'lucide-react';

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

interface Props {
  supervisor: Supervisor;
  onAction: (action: string, supervisor: Supervisor) => void;
}

export default function SupervisorCard({ supervisor, onAction }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full ${supervisor.backgroundColor} flex items-center justify-center`}>
            <span className="text-white font-medium text-lg">{supervisor.initials}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg">{supervisor.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{supervisor.email}</p>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {supervisor.department}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {supervisor.location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onAction('view', supervisor)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onAction('edit', supervisor)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onAction('delete', supervisor)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}