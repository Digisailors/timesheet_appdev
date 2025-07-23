"use client"
import { useCallback, useEffect, useState } from "react"
import { toast, Toaster } from "sonner"
import ProjectDialog from "@/components/project_management/ProjectDialog"
import SupervisorDialog from "@/components/supervisors/dialog"
import ProjectManagement from "@/components/project_management/ProjectManagement"
import type { Project } from "@/components/project_management/ProjectManagement"
import type { ProjectFormData } from "@/components/project_management/ProjectDialog"

interface SupervisorData {
  emailAddress: string
  fullName: string
}

interface RawProject {
  id: string
  name: string
  code: string
  location: string
  employees?: number
  startDate: string
  endDate?: string
  budget?: string
  description?: string
  status: string
  workHours?: number
  otHours?: number
  lastUpdated?: string
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<Project | null>(null)
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5088"
  const cleanBaseUrl = baseUrl.replace(/\/$/, "")

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
    ]

    try {
      const response = await fetch(`${cleanBaseUrl}/projects/all`)
      if (!response.ok) throw new Error("Failed to fetch projects")
      const result = await response.json()
      if (result.success) {
        const loadedProjects: Project[] = result.data.map((p: RawProject) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          location: p.location,
          employees: p.employees || 0,
          startDate: p.startDate,
          endDate: p.endDate,
          budget: p.budget,
          description: p.description,
          status: p.status,
          workHours: p.workHours || 160,
          otHours: p.otHours || 20,
          lastUpdated: p.lastUpdated || new Date().toISOString(),
        }))
        setProjects(loadedProjects)
      } else {
        throw new Error(result.message || "No project data")
      }
    } catch (error) {
      console.error("Fetch failed:", error)
      toast.error("❌ Error loading project list")
      setProjects(sampleProjects)
    }
  }, [cleanBaseUrl])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleCreateProject = () => {
    setEditingProject(null)
    setViewingProject(null)
    setIsDialogOpen(true)
  }

  const handleViewDetails = (project: Project) => {
    setViewingProject(project)
    setEditingProject(null)
    setIsDialogOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setViewingProject(null)
    setIsDialogOpen(true)
  }

  const handleDeleteProject = (project: Project) => {
    setConfirmDeleteProject(project)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
    setViewingProject(null)
  }

  const handleDialogSubmit = async (formData: ProjectFormData) => {
    if (viewingProject) {
      console.log("Attempted to submit in view mode - ignoring")
      return
    }
    try {
      if (editingProject) {
        const response = await fetch(`${cleanBaseUrl}/projects/update/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to update project" }))
          throw new Error(errorData.message || "Failed to update project")
        }
        const result = await response.json()
        if (result.success) {
          setProjects((prev) =>
            prev.map((proj) =>
              proj.id === editingProject.id
                ? { ...proj, ...formData, lastUpdated: result.data?.updatedAt || new Date().toISOString() }
                : proj,
            ),
          )
          toast.success("✅ Project updated successfully")
        } else {
          throw new Error(result.message || "Failed to update project")
        }
      } else {
        const response = await fetch(`${cleanBaseUrl}/projects/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to create project" }))
          throw new Error(errorData.message || "Failed to create project")
        }
        const result = await response.json()
        if (result.success && result.data) {
          const newProject: Project = {
            id: result.data.id,
            name: result.data.name,
            code: result.data.code,
            location: result.data.location,
            description: result.data.description || "",
            startDate: result.data.startDate,
            endDate: result.data.endDate || "",
            budget: result.data.budget?.toString() || "",
            status: result.data.status,
            employees: 0,
            workHours: 160,
            otHours: 20,
            lastUpdated: result.data.createdAt || new Date().toISOString(),
          }
          setProjects((prev) => [...prev, newProject])
          toast.success("✅ Project created successfully")
        } else {
          throw new Error(result.message || "Failed to create project")
        }
      }
      handleDialogClose()
    } catch (error) {
      console.error("API Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error(`❌ Failed to ${editingProject ? "update" : "create"} project: ${errorMessage}`)
    }
  }

  const handleCloseSupervisorDialog = () => {
    setIsSupervisorDialogOpen(false)
  }

  const handleSupervisorSubmit = async (data: SupervisorData, mode: "add" | "edit") => {
    try {
      const response = await fetch(
        `${cleanBaseUrl}/supervisors/${mode === "add" ? "create" : `update/${data.emailAddress}`}`,
        {
          method: mode === "add" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      )
      if (!response.ok) throw new Error("Failed to save supervisor")
      toast.success(`✅ Supervisor ${mode === "add" ? "created" : "updated"} successfully`)
    } catch (error) {
      console.error(error)
      toast.error("❌ Failed to save supervisor")
    }
  }

  const getDialogProps = () => {
    if (viewingProject) {
      return {
        initialData: {
          ...viewingProject,
          description: viewingProject.description || "",
          endDate: viewingProject.endDate || "",
          budget: viewingProject.budget || "",
        },
        title: `View Project Details - ${viewingProject.name}`,
        submitLabel: undefined,
        isViewMode: true,
      }
    } else if (editingProject) {
      return {
        initialData: {
          ...editingProject,
          description: editingProject.description || "",
          endDate: editingProject.endDate || "",
          budget: editingProject.budget || "",
        },
        title: "Edit Project",
        submitLabel: "Update Project",
        isViewMode: false,
      }
    }
    return {
      initialData: {
        name: "",
        code: "",
        location: "",
        startDate: "",
        status: "pending" as const,
        description: "",
        endDate: "",
        budget: "",
      },
      title: "Create New Project",
      submitLabel: "Create Project",
      isViewMode: false,
    }
  }

  const dialogProps = getDialogProps()

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
                    try {
                      const response = await fetch(`${cleanBaseUrl}/projects/delete/${confirmDeleteProject.id}`, {
                        method: "DELETE",
                      })
                      if (!response.ok) throw new Error("Failed to delete")
                      setProjects((prev) => prev.filter((p) => p.id !== confirmDeleteProject.id))
                      toast.success("✅ Project deleted successfully")
                    } catch (err) {
                      console.error(err)
                      toast.error("❌ Failed to delete project")
                    } finally {
                      setConfirmDeleteProject(null)
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
  )
}

export default ProjectsPage