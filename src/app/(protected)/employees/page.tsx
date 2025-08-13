'use client';
import Employee from "@/components/employees/employees"; // Replace with your actual employee component
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTitle from "@/components/PageTitle";

export default function EmployeePage() {
  return (
    <ProtectedRoute>
      <PageTitle title="Employee Management" />
      <Employee />
    </ProtectedRoute>
  );
}