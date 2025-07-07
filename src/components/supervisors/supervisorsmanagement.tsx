'use client';

import { useState } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import SupervisorList from './supervisorlis';
import SupervisorDialog from './dialog';

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

interface SupervisorFormData {
  fullName: string;
  specialization: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  dateOfJoining: string;
  experience: string;
  assignedProject: string;
}

// Sample data
const supervisors: Supervisor[] = [
  {
    id: '1',
    name: 'Robert Martinez',
    email: 'robert.martinez@company.com',
    initials: 'RM',
    backgroundColor: 'bg-blue-500',
    department: 'Construction Management',
    location: 'Highway Bridge'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    initials: 'MG',
    backgroundColor: 'bg-blue-600',
    department: 'Site Management',
    location: 'Downtown Plaza'
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    initials: 'JW',
    backgroundColor: 'bg-blue-700',
    department: 'Industrial Construction',
    location: 'Factory Building'
  },
  {
    id: '4',
    name: 'Anna Thompson',
    email: 'anna.thompson@company.com',
    initials: 'AT',
    backgroundColor: 'bg-blue-800',
    department: 'Quality Control',
    location: 'Office Complex'
  }
];

export default function SupervisorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);

  const filteredSupervisors = supervisors.filter(supervisor =>
    supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Convert supervisor to form data format
  const supervisorToFormData = (supervisor: Supervisor): SupervisorFormData => {
    return {
      fullName: supervisor.name,
      specialization: supervisor.department,
      phoneNumber: '98765 43210', // Mock data - you'd get this from your actual data
      emailAddress: supervisor.email,
      address: '123 Main Street, City, State 12345', // Mock data
      dateOfJoining: '2023-11-15', // Mock data
      experience: '5 years', // Mock data
      assignedProject: supervisor.location
    };
  };

  const handleAction = (action: string, supervisor: Supervisor) => {
    if (action === 'view') {
      setSelectedSupervisor(supervisor);
      // You can implement view logic here
      console.log('Viewing supervisor:', supervisor);
    } else if (action === 'edit') {
      setSelectedSupervisor(supervisor);
      setDialogMode('edit');
      setShowDialog(true);
    } else if (action === 'delete') {
      console.log('Deleting supervisor:', supervisor);
      // Implement delete logic here
    }
  };

  const handleAddSupervisor = () => {
    setSelectedSupervisor(null);
    setDialogMode('add');
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedSupervisor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Supervisor Management</h2>
        </div>
        <button 
          onClick={handleAddSupervisor}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supervisor</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Supervisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Projects</option>
            <option>Highway Bridge</option>
            <option>Downtown Plaza</option>
            <option>Factory Building</option>
            <option>Office Complex</option>
          </select>
        </div>
      </div>

      <SupervisorList supervisors={filteredSupervisors} onAction={handleAction} />

      {/* Dialog Component */}
      <SupervisorDialog
        isOpen={showDialog}
        onClose={handleCloseDialog}
        mode={dialogMode}
        initialData={selectedSupervisor ? supervisorToFormData(selectedSupervisor) : undefined}
      />
    </div>
  );
}