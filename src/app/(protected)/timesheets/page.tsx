'use client';
import TimeSheetPage from "@/components/time-sheets/TimeSheetPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTitle from "@/components/PageTitle";

export default function TimesheetPage() {
  return (
    <ProtectedRoute>
      <PageTitle title="Timesheets" />
      <TimeSheetPage />
    </ProtectedRoute>
  );
}