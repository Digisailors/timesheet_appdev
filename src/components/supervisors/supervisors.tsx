'use client';

import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Users, X } from 'lucide-react';
import SupervisorDialog from './dialog';

// Types
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [showDialog, setShowDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);

  const filteredSupervisors = supervisors.filter(supervisor =>
    supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (action: string, supervisor: Supervisor) => {
    if (action === 'view') {
      setSelectedSupervisor(supervisor);
      setShowViewDialog(true);
    } else {
      console.log(`${action} action for ${supervisor.name}`);
      // Implement your other action logic here
    }
  };

  const handleAddSupervisor = () => {
    setShowDialog(true);
  };

  const closeViewDialog = () => {
    setShowViewDialog(false);
    setSelectedSupervisor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Title and Add Button */}
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
            <span>Add Employee</span>
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

        {/* Supervisors Count */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Supervisors ({filteredSupervisors.length})
          </h3>
        </div>

        {/* Supervisors List */}
        <div className="space-y-4">
          {filteredSupervisors.map((supervisor) => (
            <div
              key={supervisor.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full ${supervisor.backgroundColor} flex items-center justify-center`}>
                    <span className="text-white font-medium text-lg">
                      {supervisor.initials}
                    </span>
                  </div>
                  
                  {/* Info */}
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

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAction('view', supervisor)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction('edit', supervisor)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction('delete', supervisor)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSupervisors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No supervisors found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Add Supervisor Dialog Component */}
      <SupervisorDialog 
        isOpen={showDialog} 
        onClose={() => setShowDialog(false)} 
      />

      {/* View Supervisor Dialog */}
      {showViewDialog && selectedSupervisor && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Supervisor Profile</h3>
              <button
                onClick={closeViewDialog}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-8">
                <div className={`w-14 h-14 rounded-full ${selectedSupervisor.backgroundColor} flex items-center justify-center text-white text-lg font-semibold`}>
                  {selectedSupervisor.initials}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedSupervisor.name}</h4>
                  <p className="text-gray-500 text-sm">SUP-{selectedSupervisor.id.padStart(3, '0')}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Join Date</p>
                    <p className="text-gray-900 font-medium">2023-11-15</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Experience</p>
                    <p className="text-gray-900 font-medium">5 Years</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                    <p className="text-gray-900 font-medium">98765 43210</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Email ID</p>
                    <p className="text-blue-600 font-medium">{selectedSupervisor.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Project</p>
                    <p className="text-gray-900 font-medium">{selectedSupervisor.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Specialization</p>
                    <p className="text-gray-900 font-medium">{selectedSupervisor.department}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}