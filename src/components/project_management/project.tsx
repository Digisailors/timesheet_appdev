"use client";
import { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import ProjectDialog from "@/components/project_management/ProjectDialog";
import SupervisorDialog from "@/components/supervisors/dialog";
import ProjectManagement from "@/components/project_management/ProjectManagement";
import type { Project } from "@/components/project_management/ProjectManagement";
import type { ProjectFormData } from "@/components/project_management/ProjectDialog";

interface SupervisorData {
  emailAddress: string;
  fullName: string;
}

// interface RawProject {
//   id: string;
//   name: string;
//   locations: string[] | null;
//   description: string;
//   startDate: string;
//   endDate: string;
//   budget: string;
//   status: "active" | "completed" | "pending" | "cancelled";
//   clientName: string | null;
//   PoContractNumber: string | null;
//   typesOfWork: string[] | null;
//   createdAt: string;
//   updatedAt: string;
// }

interface ProjectDetail {
  projectcode: string;
  locations: string;
  typesOfWork: string;
}

interface ApiProject {
  id: string;
  name: string;
  projectDetails: ProjectDetail[];
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
  status: "active" | "completed" | "pending" | "cancelled";
  clientName: string | null;
  PoContractNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<Project | null>(null);
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);
  const [fetchedProjectData, setFetchedProjectData] = useState<ProjectFormData | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5088";
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

 const fetchProjects = useCallback(async () => {
  const sampleProjects: Project[] = [
    {
      id: "HBC-2024-001",
      name: "Highway Bridge Construction",
      code: "HBC-2024-001",
      location: "North District, Highway 1",
      employees: 32,
      startDate: "2024-01-15",
      status: "active",
      workHours: 160,
      otHours: 20,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "RCP-2023-005",
      name: "Residential Complex Phase 1",
      code: "RCP-2023-005",
      location: "Suburban Area, Green Valley",
      employees: 32,
      startDate: "2024-01-15",
      status: "completed",
      workHours: 160,
      otHours: 20,
      lastUpdated: new Date().toISOString(),
    },
  ];

  try {
    const response = await fetch(`${cleanBaseUrl}/projects/all`);
    if (!response.ok) throw new Error("Failed to fetch projects");
    const result = await response.json();
    if (result.success) {
      const loadedProjects: Project[] = result.data.map((p: ApiProject) => {
        // Get the first project detail for display purposes
        const firstDetail = p.projectDetails && p.projectDetails.length > 0 ? p.projectDetails[0] : null;
        
        return {
          id: p.id,
          name: p.name,
          code: firstDetail?.projectcode || p.id, // Use first project code or fallback to ID
          // Convert project details to display format
          location: firstDetail?.locations || 'No location specified',
          startDate: p.startDate,
          endDate: p.endDate,
          budget: p.budget,
          description: p.description,
          status: p.status,
          workHours: 160, // Default values since API doesn't provide these
          otHours: 20,
          lastUpdated: p.updatedAt || new Date().toISOString(),
          employees: 0, // Default value since API doesn't provide this
        };
      });
      setProjects(loadedProjects);
    } else {
      throw new Error(result.message || "No project data");
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    toast.error("❌ Error loading project list");
    setProjects(sampleProjects);
  }
}, [cleanBaseUrl]);
  const fetchProjectById = async (projectId: string): Promise<ProjectFormData | null> => {
    try {
      setIsLoadingProject(true);
      const response = await fetch(`${cleanBaseUrl}/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project details");
      
      const result = await response.json();
      if (result.success && result.data) {
        const projectData: ApiProject = result.data;
                 // Convert projectDetails to the format expected by the form
         const locations = projectData.projectDetails?.map(detail => detail.locations) || [''];
         const typesOfWork = projectData.projectDetails?.map(detail => detail.typesOfWork) || [''];
         const projectCodes = projectData.projectDetails?.map(detail => detail.projectcode) || [''];
         const firstProjectCode = projectData.projectDetails?.[0]?.projectcode || projectData.id;
         
         return {
           name: projectData.name,
           code: firstProjectCode,
           locations: locations,
           typesOfWork: typesOfWork,
           projectCodes: projectCodes,
           description: projectData.description || '',
           startDate: projectData.startDate,
           endDate: projectData.endDate || '',
           budget: projectData.budget || '',
           status: projectData.status,
           clientName: projectData.clientName || '',
           PoContractNumber: projectData.PoContractNumber || '',
         };
      } else {
        throw new Error(result.message || "Failed to fetch project details");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("❌ Error loading project details");
      return null;
    } finally {
      setIsLoadingProject(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = () => {
    setEditingProject(null);
    setViewingProject(null);
    setFetchedProjectData(null);
    setIsDialogOpen(true);
  };

  const handleViewDetails = async (project: Project) => {
    setViewingProject(project);
    setEditingProject(null);
    const projectData = await fetchProjectById(project.id);
    if (projectData) {
      setFetchedProjectData(projectData);
      setIsDialogOpen(true);
    }
  };

  const handleEditProject = async (project: Project) => {
    setEditingProject(project);
    setViewingProject(null);
    const projectData = await fetchProjectById(project.id);
    if (projectData) {
      setFetchedProjectData(projectData);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteProject = (project: Project) => {
    setConfirmDeleteProject(project);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setViewingProject(null);
    setFetchedProjectData(null);
  };

  const handleDialogSubmit = async (formData: ProjectFormData) => {
    if (viewingProject) {
      console.log("Attempted to submit in view mode - ignoring");
      return;
    }

    try {
             // Transform formData to match the new API structure
       const projectDetails = formData.locations.map((location, index) => ({
         projectcode: formData.projectCodes?.[index] || formData.code || `PROJ-${Date.now()}-${index + 1}`,
         locations: location,
         typesOfWork: formData.typesOfWork[index] || ''
       }));

      const apiFormData = {
        name: formData.name,
        projectDetails: projectDetails,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        status: formData.status,
        clientName: formData.clientName,
        PoContractNumber: formData.PoContractNumber,
      };
      
      if (editingProject) {
        const response = await fetch(`${cleanBaseUrl}/projects/update/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiFormData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to update project" }));
          throw new Error(errorData.message || "Failed to update project");
        }

        const result = await response.json();
        if (result.success) {
          // Update the project in the list with the new data
          const updatedProject: Project = {
            id: editingProject.id,
            name: result.data.name,
            code: result.data.projectDetails?.[0]?.projectcode || editingProject.id,
            location: result.data.projectDetails?.[0]?.locations || "No location specified",
            description: result.data.description || "",
            startDate: result.data.startDate,
            endDate: result.data.endDate || "",
            budget: result.data.budget?.toString() || "",
            status: result.data.status,
            workHours: 160,
            otHours: 20,
            lastUpdated: result.data.updatedAt || new Date().toISOString(),
            employees: 0,
          };
          
          setProjects((prev) =>
            prev.map((proj) =>
              proj.id === editingProject.id ? updatedProject : proj
            )
          );
          toast.success("✅ Project updated successfully");
        } else {
          throw new Error(result.message || "Failed to update project");
        }
      } else {
        const response = await fetch(`${cleanBaseUrl}/projects/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiFormData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to create project" }));
          throw new Error(errorData.message || "Failed to create project");
        }

        const result = await response.json();
        if (result.success && result.data) {
          const newProject: Project = {
            id: result.data.id,
            name: result.data.name,
            code: result.data.projectDetails?.[0]?.projectcode || result.data.id,
            location: result.data.projectDetails?.[0]?.locations || "No location specified",
            description: result.data.description || "",
            startDate: result.data.startDate,
            endDate: result.data.endDate || "",
            budget: result.data.budget?.toString() || "",
            status: result.data.status,
            workHours: 160,
            otHours: 20,
            lastUpdated: result.data.createdAt || new Date().toISOString(),
            employees: 0,
          };
          setProjects((prev) => [...prev, newProject]);
          toast.success("Project created successfully");
        } else {
          throw new Error(result.message || "Failed to create project");
        }
      }
      handleDialogClose();
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`❌ Failed to ${editingProject ? "update" : "create"} project: ${errorMessage}`);
    }
  };

  const handleCloseSupervisorDialog = () => {
    setIsSupervisorDialogOpen(false);
  };

  const handleSupervisorSubmit = async (data: SupervisorData, mode: "add" | "edit") => {
    try {
      const response = await fetch(
        `${cleanBaseUrl}/supervisors/${mode === "add" ? "create" : `update/${data.emailAddress}`}`,
        {
          method: mode === "add" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to save supervisor");
      toast.success(`✅ Supervisor ${mode === "add" ? "created" : "updated"} successfully`);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to save supervisor");
    }
  };

  const getDialogProps = () => {
    if (isLoadingProject) {
      return {
                 initialData: {
           name: "Loading...",
           code: "",
           locations: [],
           projectCodes: [],
           description: "",
           startDate: "",
           status: "pending" as ProjectFormData['status'],
           endDate: "",
           budget: "",
           clientName: "",
           PoContractNumber: "",
           typesOfWork: [],
         },
        title: "Loading Project Details...",
        submitLabel: undefined,
        isViewMode: true,
      };
    }

    if (viewingProject && fetchedProjectData) {
      return {
        initialData: fetchedProjectData,
        title: `View Project Details - ${fetchedProjectData.name}`,
        submitLabel: undefined,
        isViewMode: true,
      };
    } else if (editingProject && fetchedProjectData) {
      return {
        initialData: fetchedProjectData,
        title: "Edit Project",
        submitLabel: "Update Project",
        isViewMode: false,
      };
    }
    return {
             initialData: {
         name: "",
         code: "",
         locations: [],
         projectCodes: [],
         description: "",
         startDate: "",
         status: "pending" as ProjectFormData['status'],
         endDate: "",
         budget: "",
         clientName: "",
         PoContractNumber: "",
         typesOfWork: [],
       },
      title: "Create New Project",
      submitLabel: "Create Project",
      isViewMode: false,
    };
  };

  const dialogProps = getDialogProps();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-green-700 text-white",
          },
        }}
      />
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
        <SupervisorDialog
          isOpen={isSupervisorDialogOpen}
          onClose={handleCloseSupervisorDialog}
          mode="add"
          onSubmit={handleSupervisorSubmit}
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        />
      {confirmDeleteProject && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Confirm Deletion</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to delete <strong>&quot;{confirmDeleteProject.name}&quot;</strong>?
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
            const projectToDelete = confirmDeleteProject; // Store reference before clearing state
            try {
              console.log("Attempting to delete project:", projectToDelete.id);
              console.log("Delete URL:", `${cleanBaseUrl}/projects/delete/${projectToDelete.id}`);
              
              const response = await fetch(`${cleanBaseUrl}/projects/delete/${projectToDelete.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              
              console.log("Delete response status:", response.status);
              
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Failed to delete project" }));
                console.error("Delete error response:", errorData);
                throw new Error(errorData.message || `HTTP ${response.status}: Failed to delete project`);
              }
              
              const result = await response.json().catch(() => ({ success: true }));
              console.log("Delete response:", result);
              
              // Remove from local state using the stored reference
              setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
              toast.success("✅ Project deleted successfully");
            } catch (err) {
              console.error("Delete operation failed:", err);
              const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
              toast.error(`❌ Failed to delete project: ${errorMessage}`);
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