import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AppShell } from './components/layout/AppShell';
import { PageLoadingSkeleton } from './components/ui/MotionPrimitives';
import { ToastProvider } from './components/ui/ToastProvider';
import { TooltipProvider } from './components/ui/Tooltip';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { WorkspaceProvider } from './features/workspace/WorkspaceContext';
import { LandingPage } from './pages/LandingPage';

const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);
const AuthCallbackPage = lazy(() =>
  import('./pages/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage }))
);
const OverviewPage = lazy(() =>
  import('./pages/OverviewPage').then((m) => ({ default: m.OverviewPage }))
);
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage }))
);
const TasksPage = lazy(() =>
  import('./pages/TasksPage').then((m) => ({ default: m.TasksPage }))
);
const CalendarPage = lazy(() =>
  import('./pages/CalendarPage').then((m) => ({ default: m.CalendarPage }))
);
const GitHubPage = lazy(() =>
  import('./pages/GitHubPage').then((m) => ({ default: m.GitHubPage }))
);
const NotesPage = lazy(() =>
  import('./pages/NotesPage').then((m) => ({ default: m.NotesPage }))
);
const AnalyticsPage = lazy(() =>
  import('./pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const AuthFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--ph-bg-primary)]">
    <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--ph-border)] border-t-[var(--ph-accent)]" />
  </div>
);

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        <ToastProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public SaaS Landing & Auth Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/login"
                    element={
                      <Suspense fallback={<AuthFallback />}>
                        <AuthPage initialMode="signin" />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <Suspense fallback={<AuthFallback />}>
                        <AuthPage initialMode="signup" />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/auth/callback"
                    element={
                      <Suspense fallback={<AuthFallback />}>
                        <AuthCallbackPage />
                      </Suspense>
                    }
                  />

                  {/* Protected Workspace Routes */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <AppShell />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      path="/overview"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <OverviewPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/projects"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <ProjectsPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/projects/:projectId"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <ProjectDetailPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/tasks"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <TasksPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/calendar"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <CalendarPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/github"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <GitHubPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/notes"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <NotesPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <AnalyticsPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <SettingsPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <Suspense fallback={<PageLoadingSkeleton />}>
                          <NotFoundPage />
                        </Suspense>
                      }
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </WorkspaceProvider>
          </AuthProvider>
        </ToastProvider>
      </TooltipProvider>
    </MotionConfig>
  );
}
