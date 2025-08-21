'use client';
import React, { useEffect, useState } from 'react';
import { Eye, Users, Plus, Search } from 'lucide-react';
import SupervisorDialog from './dialog';
import { getSession } from 'next-auth/react';

export interface Supervisor {
  id: string;
  fullName: string;
  specialization: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  dateOfJoining: string;
  experience: string;
  assignedProject: string;
  password: string;
}

interface Project {
  id: string;
  name: string;
}

const SupervisorList = () => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [projectOptions, setProjectOptions] = useState<Project[]>([{ id: 'all', name: 'All Projects' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5088';
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  // Fetch supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${cleanBaseUrl}/api/supervisors/all`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch supervisors');
        const result = await response.json();

        if (result.success && result.data) {
          setSupervisors(result.data);
        } else {
          console.error('Failed to load supervisors:', result.message);
        }
      } catch (error) {
        console.error('Failed to fetch supervisors:', error);
      }
    };
    fetchSupervisors();
  }, [cleanBaseUrl]);

  // Fetch project options
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${cleanBaseUrl}/api/projects/all`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch projects');
        const result = await response.json();

        if (result.success && result.data) {
          setProjectOptions([
            { id: 'all', name: 'All Projects' },
            ...result.data.map((project: { id: string, name: string }) => ({
              id: project.id,
              name: project.name
            }))
          ]);
        } else {
          console.error('Failed to load projects:', result.message);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, [cleanBaseUrl]);

  // Filter supervisors by search term and selected project
  const filteredSupervisors = supervisors.filter(supervisor =>
    (
      supervisor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (
      selectedProject === 'All Projects' ||
      supervisor.assignedProject === selectedProject
    )
  );

  const handleAddSupervisor = () => {
    setIsDialogOpen(true);
    setSelectedSupervisor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="px-6 py-6">
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
        {/* Search and Filter Controls */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between space-x-4">
            {/* Search Input */}
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

            {/* Project Filter */}
            <div className="flex items-center space-x-2">
              <label className="font-medium text-sm">Filter by Project:</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Results Count */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Supervisors ({filteredSupervisors.length})</h3>
        </div>
        {/* Supervisor Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Name', 'Specialization', 'Phone', 'Email', 'Address', 'Date of Joining', 'Experience', 'Project', 'Action'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSupervisors.map((supervisor) => (
                  <tr key={supervisor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {supervisor.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {supervisor.specialization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {supervisor.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {supervisor.emailAddress}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {supervisor.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {supervisor.dateOfJoining}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {supervisor.experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {supervisor.assignedProject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedSupervisor(supervisor);
                          setIsDialogOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredSupervisors.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No supervisors found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedProject !== 'All Projects'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No supervisors have been added yet.'
                }
              </p>
            </div>
          )}
        </div>
        {/* Dialog for viewing/editing supervisor details */}
        <SupervisorDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedSupervisor(null);
          }}
          mode={selectedSupervisor ? 'edit' : 'add'}
          initialData={selectedSupervisor ? {
            fullName: selectedSupervisor.fullName,
            emailAddress: selectedSupervisor.emailAddress,
            specialization: selectedSupervisor.specialization,
            phoneNumber: selectedSupervisor.phoneNumber,
            address: selectedSupervisor.address,
            dateOfJoining: selectedSupervisor.dateOfJoining,
            experience: selectedSupervisor.experience,
            password: selectedSupervisor.password
          } : undefined}
          onSubmit={async (data, mode) => {
            console.log('Form submitted:', data, mode);
            try {
              const session = await getSession();
              if (!session?.accessToken) {
                throw new Error('No access token found');
              }

              const payload = {
                ...data,
                assignedProject: data.assignedProjectId
              };

              const url = mode === 'add'
                ? `${cleanBaseUrl}/api/supervisors/create`
                : `${cleanBaseUrl}/api/supervisors/update/${selectedSupervisor?.id}`;

              const method = mode === 'add' ? 'POST' : 'PUT';

              const response = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify(payload),
              });

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
              }

              const result = await response.json();
              if (result.success) {
                // Refresh the supervisor list after successful operation
                const fetchUpdatedSupervisors = async () => {
                  const res = await fetch(`${cleanBaseUrl}/api/supervisors/all`, {
                    headers: {
                      'Authorization': `Bearer ${session.accessToken}`,
                    },
                  });
                  if (res.ok) {
                    const updatedResult = await res.json();
                    if (updatedResult.success && updatedResult.data) {
                      setSupervisors(updatedResult.data);
                    }
                  }
                };
                await fetchUpdatedSupervisors();

                setIsDialogOpen(false);
                setSelectedSupervisor(null);
              } else {
                console.error('Failed to submit:', result.message);
              }
            } catch (error) {
              console.error('Error during form submission:', error);
            }
          }}
          projects={projectOptions.filter(p => p.id !== 'all')}
        />
      </div>
    </div>
  );
};

export default SupervisorList;
