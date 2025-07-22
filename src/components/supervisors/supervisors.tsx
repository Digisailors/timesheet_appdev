'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Users, X } from 'lucide-react';
import SupervisorDialog from './dialog';
import { toast, Toaster } from 'sonner';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  initials: string;
  backgroundColor: string;
  department: string;
  location: string;
  phoneNumber: string;
  dateOfJoining: string;
  password: string;
  assignedProjectId?: string;
  address?: string; // Added address property
}

interface SupervisorData {
  fullName: string;
  emailAddress: string;
  specialization?: string;
  phoneNumber?: string;
  address?: string;
  dateOfJoining?: string;
  experience?: string;
  assignedProject?: string;
  assignedProjectId?: string;
  password?: string;
}

interface Project {
  id: string;
  name: string;
  code: string;
}

// Define proper API response types
interface SupervisorApiResponse {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  specialization?: string;
  address?: string;
  dateOfJoining?: string;
  experience?: string;
  password?: string;
  assignedProject?: {
    id: string;
    name: string;
  } | string;
}

interface ProjectApiResponse {
  id: string;
  name: string;
  code: string;
}

export default function SupervisorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [showDialog, setShowDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [supervisorList, setSupervisorList] = useState<Supervisor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [supervisorToDelete, setSupervisorToDelete] = useState<Supervisor | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5088';

  const fetchSupervisors = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/supervisors/all`);
      if (!response.ok) throw new Error('Failed to fetch supervisors');

      const result = await response.json();
      if (result.success) {
        const loadedSupervisors: Supervisor[] = result.data.map((s: SupervisorApiResponse) => ({
          id: s.id,
          name: s.fullName,
          email: s.emailAddress,
          initials: s.fullName.split(' ').map((part: string) => part.charAt(0)).join('').toUpperCase(),
          backgroundColor: 'bg-blue-500',
          department: s.specialization || '',
          location: typeof s.assignedProject === 'object' && s.assignedProject 
            ? s.assignedProject.name 
            : typeof s.assignedProject === 'string' 
            ? s.assignedProject 
            : '',
          phoneNumber: s.phoneNumber || '',
          dateOfJoining: s.dateOfJoining?.split('T')[0] || '',
          password: s.password || '',
          assignedProjectId: typeof s.assignedProject === 'object' && s.assignedProject 
            ? s.assignedProject.id 
            : typeof s.assignedProject === 'string' 
            ? s.assignedProject 
            : '',
          address: s.address || ''
        }));
        setSupervisorList(loadedSupervisors);
      } else {
        throw new Error(result.message || 'No supervisor data');
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      toast.error("❌ Error loading supervisor list");
    }
  }, [baseUrl]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/projects/all`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const result = await response.json();
      if (result.success) {
        const loadedProjects: Project[] = result.data.map((p: ProjectApiResponse) => ({
          id: p.id,
          name: p.name,
          code: p.code,
        }));
        setProjects(loadedProjects);
      } else {
        throw new Error(result.message || 'No project data');
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      toast.error("❌ Error loading project list");
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchSupervisors();
    fetchProjects();
  }, [fetchSupervisors, fetchProjects]);

  const filteredSupervisors = supervisorList.filter(supervisor => {
    const matchesSearch =
      supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProject =
      selectedProject === 'All Projects' || supervisor.location === selectedProject;

    return matchesSearch && matchesProject;
  });

  const supervisorToFormData = (supervisor: Supervisor): SupervisorData => ({
    fullName: supervisor.name,
    emailAddress: supervisor.email,
    specialization: supervisor.department,
    phoneNumber: supervisor.phoneNumber,
    address: supervisor.address ?? '',
    dateOfJoining: supervisor.dateOfJoining,
    experience: supervisor.experience?? '',
    assignedProject: supervisor.location,
    assignedProjectId: supervisor.assignedProjectId,
    password: supervisor.password
  });

  const handleAction = async (action: string, supervisor: Supervisor) => {
    if (action === 'view') {
      setSelectedSupervisor(supervisor);
      setShowViewDialog(true);
    } else if (action === 'edit') {
      try {
        const response = await fetch(`${baseUrl}/api/supervisors/${supervisor.id}`);
        console.log(`📡 Fetching supervisor details for ${action} from:`, `${baseUrl}/api/supervisors/${supervisor.id}`);

        if (!response.ok) throw new Error('Failed to fetch supervisor details');

        const result = await response.json();
        console.log(`✅ API Response (${action}):`, result);

        if (result.success) {
          const data = result.data;

          const fullSupervisor: Supervisor = {
            id: data.id,
            name: data.fullName,
            email: data.emailAddress,
            initials: data.fullName
              .split(' ')
              .map((part: string) => part.charAt(0))
              .join('')
              .toUpperCase(),
            backgroundColor: 'bg-blue-500',
            department: data.specialization || '',
            location: typeof data.assignedProject === 'object' && data.assignedProject?.name 
              ? data.assignedProject.name 
              : '',
            phoneNumber: data.phoneNumber || '',
            dateOfJoining: data.dateOfJoining?.split('T')[0] || '',
            password: '', // not shown in view/edit
            assignedProjectId: typeof data.assignedProject === 'object' && data.assignedProject?.id 
              ? data.assignedProject.id 
              : '',
            address: data.address || '',
            experience:data.experience || ''
          };

          console.log(`👤 Parsed Supervisor Object (${action}):`, fullSupervisor);

          setSelectedSupervisor(fullSupervisor);
          setDialogMode('edit');
          setShowDialog(true);
          setSelectedProjectId(fullSupervisor.assignedProjectId || null);
        } else {
          toast.error(result.message || `❌ Could not load supervisor details for ${action}`);
        }
      } catch (error) {
        console.error(`🚨 ${action} fetch failed:`, error);
        toast.error(`❌ Error loading supervisor data for ${action}`);
      }
    } else if (action === 'delete') {
      setSupervisorToDelete(supervisor);
      setConfirmDelete(true);
    }
  };

  const handleAddSupervisor = () => {
    setSelectedSupervisor(null);
    setDialogMode('add');
    setShowDialog(true);
    setSelectedProjectId(null);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedSupervisor(null);
    setSelectedProjectId(null);
  };

  const closeViewDialog = () => {
    setShowViewDialog(false);
    setSelectedSupervisor(null);
  };

  const confirmDeleteSupervisor = async () => {
    if (supervisorToDelete) {
      try {
        const response = await fetch(`${baseUrl}/api/supervisors/delete/${supervisorToDelete.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setSupervisorList(prev => prev.filter(s => s.id !== supervisorToDelete.id));
          toast.success('🗑️ Supervisor deleted successfully!');
        } else {
          throw new Error(result.message || 'Failed to delete supervisor');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error("❌ Error deleting supervisor");
      }
    }
    setConfirmDelete(false);
    setSupervisorToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
    setSupervisorToDelete(null);
  };

  const handleFormSubmit = async (formData: SupervisorData, mode: 'add' | 'edit') => {
    const payload = {
      fullName: formData.fullName,
      emailAddress: formData.emailAddress,
      phoneNumber: formData.phoneNumber,
      specialization: formData.specialization,
      address: formData.address,
      dateOfJoining: formData.dateOfJoining,
      experience: formData.experience,
      password: formData.password,
      assignedProjectId: formData.assignedProjectId,
    };

    const url =
      mode === 'add'
        ? `${baseUrl}/api/supervisors/create`
        : `${baseUrl}/api/supervisors/update/${selectedSupervisor?.id}`;
    const method = mode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        if (mode === 'add') {
          const newSupervisor: Supervisor = {
            id: result.data.id,
            name: formData.fullName,
            email: formData.emailAddress,
            initials: formData.fullName.split(' ').map(p => p.charAt(0)).join('').toUpperCase(),
            backgroundColor: 'bg-blue-500',
            department: formData.specialization || '',
            location: formData.assignedProject || '',
            phoneNumber: formData.phoneNumber || '',
            dateOfJoining: formData.dateOfJoining || '',
            password: formData.password || '',
            assignedProjectId: formData.assignedProjectId,
            address: formData.address || ''
          };
          setSupervisorList(prev => [...prev, newSupervisor]);
          toast.success('✅ Supervisor added successfully!');
        } else if (mode === 'edit' && selectedSupervisor) {
          const updatedSupervisor: Supervisor = {
            ...selectedSupervisor,
            name: formData.fullName,
            email: formData.emailAddress,
            department: formData.specialization || '',
            location: formData.assignedProject || '',
            phoneNumber: formData.phoneNumber || '',
            dateOfJoining: formData.dateOfJoining || '',
            password: formData.password || '',
            assignedProjectId: formData.assignedProjectId,
            address: formData.address || ''
          };
          setSupervisorList(prev =>
            prev.map(s => (s.id === selectedSupervisor.id ? updatedSupervisor : s))
          );
          toast.success('✅ Supervisor updated successfully!');
        }
        closeDialog();
        // Refresh the list to get updated data from server
        fetchSupervisors();
      } else {
        toast.error(result.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: 'bg-green-900 text-white', 
          },
        }}
      />
      
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold">Supervisor Management</h2>
          </div>
          <button
            onClick={handleAddSupervisor}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add supervisor</span>
          </button>
        </div>

        {/* Search + Project Filter */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
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
              {projects.map((project) => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Supervisors List */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Supervisors ({filteredSupervisors.length})</h3>
        </div>

        <div className="space-y-4">
          {filteredSupervisors.map((supervisor) => (
            <div
              key={supervisor.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${supervisor.backgroundColor} flex items-center justify-center`}>
                    <span className="text-white font-medium text-lg">{supervisor.initials}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{supervisor.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{supervisor.email}</p>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {supervisor.department}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {supervisor.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAction('view', supervisor)}
                    className="p-2 border border-gray-500 dark:border-gray-400 text-gray-500 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction('edit', supervisor)}
                    className="p-2 border border-gray-500 dark:border-gray-400 text-gray-500 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction('delete', supervisor)}
                    className="p-2 border border-red-500 text-red-500 hover:text-red-600 hover:bg-red-50 dark:border-red-400 dark:hover:bg-red-900 transition-colors rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSupervisors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No supervisors found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Supervisor Add/Edit Dialog */}
      <SupervisorDialog
        isOpen={showDialog}
        onClose={closeDialog}
        mode={dialogMode}
        initialData={
          selectedSupervisor ? supervisorToFormData(selectedSupervisor) : undefined
        }
        onSubmit={(data) => handleFormSubmit(data, dialogMode)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
      />

      {/* View Supervisor Details Dialog */}
      {showViewDialog && selectedSupervisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4">
            {/* Profile Content */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold">Supervisor Profile</h3>
              <button onClick={closeViewDialog} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} className="text-gray-400 dark:text-gray-300" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Profile details */}
              <div className="flex items-center space-x-4 mb-8">
                <div className={`w-14 h-14 rounded-full ${selectedSupervisor.backgroundColor} flex items-center justify-center text-white text-lg font-semibold`}>
                  {selectedSupervisor.initials}
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{selectedSupervisor.name}</h4>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">SUP-{selectedSupervisor.id.slice(-3).padStart(3, '0')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div><p className="text-sm text-gray-500 mb-2">Join Date</p><p>{selectedSupervisor.dateOfJoining}</p></div>
                <div><p className="text-sm text-gray-500 mb-2">Experience</p><p>5 Years</p></div>
                <div><p className="text-sm text-gray-500 mb-2">Phone Number</p><p>{selectedSupervisor.phoneNumber}</p></div>
                <div><p className="text-sm text-gray-500 mb-2">Email ID</p><p className="text-blue-600">{selectedSupervisor.email}</p></div>
                <div><p className="text-sm text-gray-500 mb-2">Current Project</p><p>{selectedSupervisor.location}</p></div>
                <div><p className="text-sm text-gray-500 mb-2">Specialization</p><p>{selectedSupervisor.department}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && supervisorToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete supervisor <strong>{supervisorToDelete.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={confirmDeleteSupervisor} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
