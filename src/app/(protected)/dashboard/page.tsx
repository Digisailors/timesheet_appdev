'use client';
import Dashboard from "@/components/dashboard/dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTitle from "@/components/PageTitle";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <PageTitle title="Dashboard" />
      <Dashboard />
    </ProtectedRoute>
  );
}