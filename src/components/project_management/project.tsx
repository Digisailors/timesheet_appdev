'use client';

import { useState } from 'react';
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import ProjectManagement from "@/components/project_management/ProjectManagement";
import ProjectDialog from "@/components/project_management/ProjectDialog";
import { Project } from "@/components/project_management/ProjectManagement";
import { ProjectFormData } from "@/components/project_management/ProjectDialog";

// Sample data - replace with your actual data source
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
    id: 'HBC-2024-002',
    name: 'Highway Bridge Construction',
    code: 'HBC-2024-002',
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
  },
  {
    id: 'HBC-2024-003',
    name: 'Highway Bridge Construction',
    code: 'HBC-2024-003',
    location: 'North District, Highway 1',
    employees: 32,
    startDate: '2024-01-15',
    status: 'active',
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Generate unique project ID
  const generateProjectId = () => {
    return `PRJ-${Date.now()}`;
  };

  // Event handlers
  const handleCreateProject = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (project: Project) => {
    console.log('View details for:', project);
    // Implement your view details logic here
    // You could open a different dialog or navigate to a details page
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the project "${project.name}"?`
    );
    
    if (confirmed) {
      setProjects(prev => prev.filter(p => p.id !== project.id));
    }
  };

  const handleDialogSubmit = (formData: ProjectFormData) => {
    if (editingProject) {
      // Update existing project
      setProjects(prev => 
        prev.map(p => 
          p.id === editingProject.id 
            ? {
                ...p,
                name: formData.name,
                code: formData.code,
                location: formData.location,
                startDate: formData.startDate,
                status: formData.status,
                // Note: employees count would need to be handled separately
                // or you could add it to the form
              }
            : p
        )
      );
    } else {
      // Create new project
      const newProject: Project = {
        id: generateProjectId(),
        name: formData.name,
        code: formData.code,
        location: formData.location,
        employees: 0, // Default value, you might want to add this to the form
        startDate: formData.startDate,
        status: formData.status,
      };
      
      setProjects(prev => [...prev, newProject]);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  return (
    <div>
      
      <div>
        <ProjectManagement
          projects={projects}
          onCreateProject={handleCreateProject}
          onViewDetails={handleViewDetails}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
        
        {/* Project Dialog */}
        <ProjectDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
          initialData={editingProject ? {
            name: editingProject.name,
            code: editingProject.code,
            location: editingProject.location,
            startDate: editingProject.startDate,
            status: editingProject.status,
            description: '', // Add description field to Project type if needed
            endDate: '', // Add endDate field to Project type if needed
            budget: '', // Add budget field to Project type if needed
          } : undefined}
          title={editingProject ? 'Edit Project' : 'Create New Project'}
          submitLabel={editingProject ? 'Update Project' : 'Create Project'}
        />
      </div>
    </div>
  );
}