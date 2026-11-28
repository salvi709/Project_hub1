import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import { isOverdueISO, isTodayISO, formatShortDate } from '../lib/date';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { KpiStrip } from '../components/dashboard/KpiStrip';
import { RecentActivitySection } from '../components/dashboard/RecentActivitySection';
import { RecentProjectsSection } from '../components/dashboard/RecentProjectsSection';
import { UpcomingTasksSection } from '../components/dashboard/UpcomingTasksSection';
import { WeeklyProductivityChart } from '../components/dashboard/WeeklyProductivityChart';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { ProjectFormDialog } from '../components/projects/ProjectFormDialog';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export const OverviewPage: React.FC = () => {
  const { projects, tasks } = useWorkspace();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const metrics = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === 'active').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const dueTodayCount = tasks.filter(
      (t) => t.status !== 'completed' && (isTodayISO(t.dueDate) || isOverdueISO(t.dueDate))
    ).length;
    const overallProgress =
      tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

    return {
      activeProjects,
      totalProjects: projects.length,
      dueTodayCount,
      completedTasks,
      totalTasks: tasks.length,
      overallProgress,
    };
  }, [projects, tasks]);

  const upcomingDeadlines = useMemo(
    () =>
      projects
        .filter((p) => p.status !== 'completed' && p.status !== 'archived')
        .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
        .slice(0, 4),
    [projects]
  );

  return (
    <div className="space-y-6">
      <WelcomeSection
        activeProjectCount={metrics.activeProjects}
        dueTodayCount={metrics.dueTodayCount}
        onNewProject={() => setProjectDialogOpen(true)}
        onNewTask={() => setTaskDialogOpen(true)}
      />

      <KpiStrip {...metrics} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <UpcomingTasksSection onNewTask={() => setTaskDialogOpen(true)} />
          <RecentProjectsSection onNewProject={() => setProjectDialogOpen(true)} />
        </div>

        <div className="space-y-6 lg:col-span-5">
          <WeeklyProductivityChart />
          <Card>
            <CardHeader className="border-b border-[var(--ph-border)] pb-3">
              <div>
                <CardTitle>Upcoming Milestones</CardTitle>
                <CardDescription>Nearest project target deadlines</CardDescription>
              </div>
              <CalendarIcon className="h-4 w-4 text-[var(--ph-text-muted)]" />
            </CardHeader>
            <CardContent className="pt-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="py-4 text-center text-xs text-[var(--ph-text-muted)]">
                  No upcoming project deadlines.
                </p>
              ) : (
                <div className="divide-y divide-[var(--ph-border)]">
                  {upcomingDeadlines.map((p) => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.id}`}
                      className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 text-xs hover:text-[var(--ph-accent-text)] transition-colors"
                    >
                      <span className="truncate font-medium text-[var(--ph-text-primary)]">
                        {p.name}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-[var(--ph-text-secondary)]">
                        {formatShortDate(p.targetDate)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <RecentActivitySection />
        </div>
      </div>

      <ProjectFormDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} />
      <TaskFormDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} />
    </div>
  );
};
