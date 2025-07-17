'use client';

import { useState } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import { useRouter } from 'next/router';
import SupervisorList from './supervisorlis';

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

// Sample data
const supervisors: Supervisor[] = [
  {
    id: '1',
    name: 'Robert Martinez',
    email: 'robert.martinez@company.com',
    initials: 'JS',
    backgroundColor: 'bg-blue-500',
    department: 'Construction Management',
    location: 'Highway Bridge'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    initials: 'SW',
    backgroundColor: 'bg-blue-600',
    department: 'Site Management',
    location: 'Downtown Plaza'
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    initials: 'MJ',
    backgroundColor: 'bg-blue-700',
    department: 'Industrial Construction',
    location: 'Factory Building'
  },
  {
    id: '4',
    name: 'Anna Thompson',
    email: 'anna.thompson@company.com',
    initials: 'LC',
    backgroundColor: 'bg-blue-800',
    department: 'Quality Control',
    location: 'Office Complex'
  }
];

export default function SupervisorPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');

  const filteredSupervisors = supervisors.filter(supervisor =>
    (supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedProject === 'All Projects' || supervisor.location === selectedProject)
  );

  const handleAction = (action: string, supervisor: Supervisor) => {
    if (action === 'edit') {
      router.push(`/supervisorsmanagement/${supervisor.id}`);
    } else {
      console.log(`${action} action for ${supervisor.name}`);
    }
  };

  const handleAddSupervisor = () => {
    router.push('/supervisorsmanagement/new');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Supervisor Management</h2>
        </div>
        <button
          onClick={handleAddSupervisor}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supervisor</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Supervisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Projects</option>
            <option>Highway Bridge</option>
            <option>Downtown Plaza</option>
            <option>Factory Building</option>
            <option>Office Complex</option>
          </select>
        </div>
      </div>

      {/* List */}
      <SupervisorList supervisors={filteredSupervisors} onAction={handleAction} />
    </div>
  );
}