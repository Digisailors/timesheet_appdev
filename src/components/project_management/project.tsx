'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

import ProjectManagement from "@/components/project_management/ProjectManagement";
import ProjectDialog from "@/components/project_management/ProjectDialog";
import SupervisorDialog from "@/components/supervisors/dialog";

import { Project } from "@/components/project_management/ProjectManagement";
import { ProjectFormData } from "@/components/project_management/ProjectDialog";
import { SupervisorData } from "@/components/supervisors/dialog";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<Project | null>(null);
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5088';
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  const generateProjectId = () => `PRJ-${Date.now()}`;

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${cleanBaseUrl}/api/projects/all`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const result = await response.json();
      if (result.success) {
        const loadedProjects: Project[] = result.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          location: p.location,
          employees: 0,
          startDate: p.startDate,
          endDate: p.endDate,
          budget: p.budget,
          description: p.description,
          status: p.status,
          workHours: p.workHours || 160,
          otHours: p.otHours || 20,
          lastUpdated: p.lastUpdated || new Date().toISOString(),
        }));
        setProjects(loadedProjects);
      } else {
        throw new Error(result.message || 'No project data');
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      toast.error("❌ Error loading project list");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    setEditingProject(null);
    setViewingProject(null);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (project: Project) => {
    console.log('View details clicked for:', project.name); // Debug log
    setViewingProject(project);
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setViewingProject(null);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setConfirmDeleteProject(project);
  };

  const handleDialogSubmit = async (formData: ProjectFormData) => {
    // Don't submit if in view mode
    if (viewingProject) {
      console.log('Attempted to submit in view mode - ignoring');
      return;
    }

    if (editingProject) {
      try {
        const response = await fetch(`${cleanBaseUrl}/api/projects/update/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update project');

        setProjects((prev) =>
          prev.map((proj) =>
            proj.id === editingProject.id ? { ...proj, ...formData } : proj
          )
        );

        toast.success("✅ Project updated successfully");
      } catch {
        toast.error("❌ Failed to update project");
      }
    } else {
      try {
        const response = await fetch(`${cleanBaseUrl}/api/projects/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to create project');

        const result = await response.json();
        const newProject: Project = {
          id: result.data.id,
          employees: 0,
          ...formData,
          workHours: 160,
          otHours: 20,
          lastUpdated: new Date().toISOString(),
        };

        setProjects((prev) => [...prev, newProject]);

        toast.success("✅ Project created successfully");
      } catch {
        const newProject: Project = {
          id: generateProjectId(),
          employees: 0,
          ...formData,
          workHours: 160,
          otHours: 20,
          lastUpdated: new Date().toISOString(),
        };
        setProjects((prev) => [...prev, newProject]);
        toast.success("✅ Project created locally");
      }
    }

    handleDialogClose();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setViewingProject(null);
  };

  const handleCloseSupervisorDialog = () => {
    setIsSupervisorDialogOpen(false);
  };

  const handleSupervisorSubmit = async (data: SupervisorData, mode: 'add' | 'edit') => {
    try {
      const response = await fetch(`${cleanBaseUrl}/api/supervisors/${mode === 'add' ? 'create' : `update/${data.emailAddress}`}`, {
        method: mode === 'add' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save supervisor');

      toast.success(`✅ Supervisor ${mode === 'add' ? 'created' : 'updated'} successfully`);
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to save supervisor');
    }
  };

  const getDialogProps = () => {
    if (viewingProject) {
      return {
        initialData: {
          ...viewingProject,
          description: viewingProject.description || '',
          endDate: viewingProject.endDate || '',
          budget: viewingProject.budget || '',
        },
        title: `View Project - ${viewingProject.name}`,
        submitLabel: undefined, // Changed from empty string to undefined
        isViewMode: true,
        isUpdateMode: false,
        projectId: viewingProject.id, // Added projectId for view mode
      };
    } else if (editingProject) {
      return {
        initialData: {
          ...editingProject,
          description: editingProject.description || '',
          endDate: editingProject.endDate || '',
          budget: editingProject.budget || '',
        },
        title: 'Edit Project',
        submitLabel: 'Update Project',
        isViewMode: false,
        isUpdateMode: true,
        projectId: editingProject.id,
      };
    }

    return {
      initialData: {
        name: '',
        code: '',
        location: '',
        startDate: '',
        status: 'pending' as const,
        description: '',
        endDate: '',
        budget: '',
      },
      title: 'Create New Project',
      submitLabel: 'Create Project',
      isViewMode: false,
      isUpdateMode: false,
      projectId: undefined,
    };
  };

  const dialogProps = getDialogProps();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      <Toaster position="bottom-right" toastOptions={{ classNames: { toast: 'bg-green-700 text-white' } }} />

      <div className="max-w-7xl mx-auto">
        {/* 📦 Project List UI */}
        <ProjectManagement
          projects={projects}
          onCreateProject={handleCreateProject}
          onViewDetails={handleViewDetails}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />

        {/* 📝 Project Dialog */}
        <ProjectDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
          initialData={dialogProps.initialData}
          title={dialogProps.title}
          submitLabel={dialogProps.submitLabel}
          isViewMode={dialogProps.isViewMode}
          isUpdateMode={dialogProps.isUpdateMode}
          projectId={dialogProps.projectId}
        />

        {/* 👤 Supervisor Dialog */}
        <SupervisorDialog
          isOpen={isSupervisorDialogOpen}
          onClose={handleCloseSupervisorDialog}
          mode="add"
          onSubmit={handleSupervisorSubmit}
          projects={projects.map(p => p.name)} // 🔁 dynamic dropdown
        />

        {/* ❌ Delete Confirmation */}
        {confirmDeleteProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Confirm Deletion
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete <strong>"{confirmDeleteProject.name}"</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDeleteProject(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `${cleanBaseUrl}/api/projects/delete/${confirmDeleteProject.id}`,
                        { method: 'DELETE' }
                      );
                      if (!response.ok) throw new Error("Failed to delete");

                      setProjects((prev) =>
                        prev.filter((p) => p.id !== confirmDeleteProject.id)
                      );
                      toast.success("✅ Project deleted successfully");
                    } catch (err) {
                      console.error(err);
                      toast.error("❌ Failed to delete project");
                    } finally {
                      setConfirmDeleteProject(null);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;