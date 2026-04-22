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
import { ProjectsPage } from "./pages/ProjectsPage";
import { useUIStore } from "@/store/uiStore";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

function App() {
  const { isDarkMode } = useUIStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <AmbientBlobs />

      <BrowserRouter>
        <Toaster
          position="bottom-right"
          richColors
          expand={false}
          duration={3000}
          toastOptions={{
            style: {
              borderRadius: "14px",
              border: "1px solid hsl(var(--border) / 0.5)",
              background: "hsl(var(--card) / 0.8)",
              backdropFilter: "blur(12px)",
              fontSize: "13px",
              fontWeight: 500,
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

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
              <Route path="/projects" element={<ProjectsPage />} />
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
