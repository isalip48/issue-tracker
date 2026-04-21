// client/src/App.tsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AmbientBlobs } from "@/components/shared/AmbientBlobs";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { Dashboard } from "@/pages/Dashboard";
import { IssueListPage } from "@/pages/IssueListPage";
import { CreateIssuePage } from "@/pages/CreateIssuePage";
import { EditIssuePage } from "@/pages/EditIssuePage";
import { IssueDetailPage } from "@/pages/IssueDetailPage";
import { useUIStore } from "@/store/uiStore";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  const { isDarkMode } = useUIStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      {/* Global ambient backdrop — dot-grid + glow blobs over the entire app */}
      <AmbientBlobs />

      <BrowserRouter>
        <Toaster
          position="bottom-right"
          richColors
          expand={false}
          duration={3000}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/issues" element={<IssueListPage key="all" />} />
              <Route
                path="/issues/me"
                element={<IssueListPage key="me" presetAssignee="me" />}
              />
              <Route path="/issues/new" element={<CreateIssuePage />} />
              <Route path="/issues/:id/edit" element={<EditIssuePage />} />
              <Route path="/issues/:id" element={<IssueDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
