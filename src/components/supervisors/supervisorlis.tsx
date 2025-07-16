import { Users } from 'lucide-react';
import SupervisorCard from './supervisorcard';

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
  supervisors: Supervisor[];
  onAction: (action: string, supervisor: Supervisor) => void;
}

export default function SupervisorList({ supervisors, onAction }: Props) {
  if (supervisors.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No supervisors found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Supervisors ({supervisors.length})
        </h3>
      </div>

      <div className="space-y-4">
        {supervisors.map((supervisor) => (
          <SupervisorCard key={supervisor.id} supervisor={supervisor} onAction={onAction} />
        ))}
      </div>
    </>
  );
}
