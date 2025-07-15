'use client';

import { useState } from 'react';


import { toast } from 'sonner';


import ProjectManagement from "@/components/project_management/ProjectManagement";
import ProjectDialog from "@/components/project_management/ProjectDialog";
import { Project } from "@/components/project_management/ProjectManagement";
import { ProjectFormData } from "@/components/project_management/ProjectDialog";


// Sample data
const sampleProjects: Project[] = [
  {
    id: 'HBC-2024-001',
    name: 'Highway Bridge Construction',
    code: 'HBC-2024-001',
    location: 'North District, Highway 1',
    employees: 32,
    startDate: '2024-01-15',
    status: 'active',
  },
  {
    id: 'RCP-2023-005',
    name: 'Residential Complex Phase 1',
    code: 'RCP-2023-005',
    location: 'Suburban Area, Green Valley',
    employees: 32,
    startDate: '2024-01-15',
    status: 'completed',
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);


  // ID generator
  const generateProjectId = () => `PRJ-${Date.now()}`;

  // Actions

  const generateProjectId = () => `PRJ-${Date.now()}`;


  const handleCreateProject = () => {
    setEditingProject(null);
    setViewingProject(null);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (project: Project) => {
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
    const confirmDelete = window.confirm(`Are you sure you want to delete "${project.name}"?`);
    if (confirmDelete) {
      setProjects(prev => prev.filter(p => p.id !== project.id));

  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${project.name}"?`);
    if (confirmed) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/delete/${project.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete project');

        setProjects(prev => prev.filter(p => p.id !== project.id));
        toast.success("Project deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete project.");
      }

    }
  };

  const handleDialogSubmit = async (formData: ProjectFormData) => {
    if (editingProject) {

      // Update
      setProjects(prev =>
        prev.map(p =>
          p.id === editingProject.id
            ? {
                ...p,
                name: formData.name,
                code: formData.code,
                location: formData.location,
                startDate: formData.startDate,
                status: formData.status
              }
            : p
        )
      );
    } else {
      // Create

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/update/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update project');

        const updatedProject = await response.json();

        setProjects(prev =>
          prev.map(p =>
            p.id === editingProject.id
              ? { ...p, ...formData, id: editingProject.id, employees: p.employees }
              : p
          )
        );
        toast.success("Project updated successfully");
        handleDialogClose();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update project.");
      }
    } else {

      const newProject: Project = {
        id: generateProjectId(),
        name: formData.name,
        code: formData.code,
        location: formData.location,

        employees: 0, // Default
        startDate: formData.startDate,
        status: formData.status
      };

        employees: 0,
        startDate: formData.startDate,
        status: formData.status,
        budget: formData.budget,
        endDate: formData.endDate,
        description: formData.description,
      };


      setProjects(prev => [...prev, newProject]);
      toast.success("Project created successfully");
      handleDialogClose();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setViewingProject(null);
  };


  // Dialog setup

  const getDialogProps = () => {
    const commonFields = (project: Project) => ({
      name: project.name,
      code: project.code,
      location: project.location,
      startDate: project.startDate,
      status: project.status,
      description: '',
      endDate: '',
      budget: ''
    });

    if (viewingProject) {
      return {

        initialData: commonFields(viewingProject),
        title: `View Project - ${viewingProject.name}`,

        initialData: {
          name: viewingProject.name,
          code: viewingProject.code,
          location: viewingProject.location,
          startDate: viewingProject.startDate,
          status: viewingProject.status,
          description: viewingProject.description || '',
          endDate: viewingProject.endDate || '',
          budget: viewingProject.budget || '',
        },
        title: `View Project Details - ${viewingProject.name}`,

        submitLabel: '',
        isViewMode: true,
        isUpdateMode: false,
        projectId: undefined,
      };
    } else if (editingProject) {
      return {

        initialData: commonFields(editingProject),

        initialData: {
          name: editingProject.name,
          code: editingProject.code,
          location: editingProject.location,
          startDate: editingProject.startDate,
          status: editingProject.status,
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
      <div className="max-w-7xl mx-auto">
        <ProjectManagement
          projects={projects}
          onCreateProject={handleCreateProject}
          onViewDetails={handleViewDetails}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />

        <ProjectDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
          initialData={dialogProps.initialData}
          title={dialogProps.title}
          submitLabel={dialogProps.submitLabel}
          isViewMode={dialogProps.isViewMode}
        />
      </div>
    </div>
  );
}

    <div>
      <ProjectManagement
        projects={projects}
        onCreateProject={handleCreateProject}
        onViewDetails={handleViewDetails}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />

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
    </div>
  );
};

export default ProjectsPage;

