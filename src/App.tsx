import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ToastProvider } from './components/ui/ToastProvider';
import { TooltipProvider } from './components/ui/Tooltip';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { WorkspaceProvider } from './features/workspace/WorkspaceContext';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { AuthPage } from './pages/AuthPage';
import { CalendarPage } from './pages/CalendarPage';
import { GitHubPage } from './pages/GitHubPage';
import { NotesPage } from './pages/NotesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TasksPage } from './pages/TasksPage';

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <ToastProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />

                <Route
                  element={
                    <ProtectedRoute>
                      <AppShell />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<OverviewPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/github" element={<GitHubPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WorkspaceProvider>
        </AuthProvider>
      </ToastProvider>
    </TooltipProvider>
  );
}
