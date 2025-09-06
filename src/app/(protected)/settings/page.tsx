'use client';
import SettingsPageComponent from "@/components/settings/settingspage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTitle from "@/components/PageTitle";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <PageTitle title="Settings" />
      <SettingsPageComponent />
    </ProtectedRoute>
  );
}