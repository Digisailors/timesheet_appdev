'use client';
import Supervisor from "@/components/supervisors/supervisors"; // Replace with your actual supervisor component
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTitle from "@/components/PageTitle";

export default function SupervisorPage() {
  return (
    <ProtectedRoute>
      <PageTitle title="Supervisor Management" />
      <Supervisor />
    </ProtectedRoute>
  );
}