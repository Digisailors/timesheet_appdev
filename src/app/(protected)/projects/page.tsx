'use client';
import ProjectsPage from "@/components/project_management/project";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTitle from "@/components/PageTitle";

export default function ProjectPage() {
  return (
    <ProtectedRoute>
      <PageTitle title="Project" />
      <ProjectsPage />
    </ProtectedRoute>
  );
}