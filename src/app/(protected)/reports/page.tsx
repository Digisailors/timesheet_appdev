'use client';
import ReportsPage from "@/components/reports/reports";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTitle from "@/components/PageTitle";

export default function ReportsPageComponent() {
  return (
    <ProtectedRoute>
      <PageTitle title="Reports" />
      <ReportsPage />
    </ProtectedRoute>
  );
}