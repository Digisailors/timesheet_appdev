'use client';

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import SupervisorDialog from './SupervisorDialog';

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

const SupervisorList = () => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [projectOptions, setProjectOptions] = useState<string[]>(['All Projects']);


  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5088';
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  // Fetch supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(`${cleanBaseUrl}/api/supervisors`);
        const data = await response.json();
        setSupervisors(data);
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
        const response = await fetch(`${cleanBaseUrl}/api/projects/all`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        const projectNames = data.map((project: { name: string }) => project.name);
        setProjectOptions(['All Projects', ...projectNames]);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

  const filteredSupervisors = supervisors.filter(supervisor =>
    (supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedProject === 'All Projects' || supervisor.location === selectedProject)
  );


    fetchProjects();
  }, [cleanBaseUrl]);

  // Filter supervisors by selected project
  const filteredSupervisors = selectedProject === 'All Projects'
    ? supervisors
    : supervisors.filter((s) => s.assignedProject === selectedProject);

  return (

    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Supervisor List</h2>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Project:</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"

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
          {projectOptions.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>

      {/* Supervisor Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {['Name', 'Specialization', 'Phone', 'Email', 'Address', 'Date of Joining', 'Experience', 'Project', 'Action'].map(header => (
                <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSupervisors.map((supervisor) => (
              <tr key={supervisor.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{supervisor.fullName}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{supervisor.specialization}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{supervisor.phoneNumber}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{supervisor.emailAddress}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{supervisor.address}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{supervisor.dateOfJoining}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{supervisor.experience}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{supervisor.assignedProject}</td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => {
                      setSelectedSupervisor(supervisor);
                      setIsDialogOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredSupervisors.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center text-gray-600 dark:text-gray-400">
                  No supervisors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog for viewing supervisor details */}
      <SupervisorDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedSupervisor(null);
        }}
        supervisor={selectedSupervisor}
      />
    </div>
  );
};


export default SupervisorList;



