'use client';
import VacationPage from "@/components/vacations/VacationPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTitle from "@/components/PageTitle";

export default function VacationPageComponent() {
  return (
    <ProtectedRoute>
      <PageTitle title="Vacations Management" />
      <VacationPage />
    </ProtectedRoute>
  );
}