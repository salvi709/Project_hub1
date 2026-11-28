import React, { useMemo } from 'react';
import { BarChart3, Clock } from 'lucide-react';
import { offsetISODate } from '../lib/date';
import { PROJECT_STATUS_META, TASK_STATUS_META } from '../lib/statusMeta';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';

export const AnalyticsPage: React.FC = () => {
  const { projects, tasks, getProjectProgress } = useWorkspace();

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter((p) => p.status === 'completed').length;
    const projectCompletionPct =
      totalProjects === 0 ? 0 : Math.round((completedProjects / totalProjects) * 100);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const taskCompletionPct =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const avgProjectProgress =
      totalProjects === 0
        ? 0
        : Math.round(
            projects.reduce((acc, p) => acc + getProjectProgress(p.id), 0) / totalProjects
          );

    const projectStatusBreakdown = (
      ['active', 'planning', 'on_hold', 'completed', 'archived'] as const
    ).map((status) => ({
      status,
      label: PROJECT_STATUS_META[status].label,
      variant: PROJECT_STATUS_META[status].variant,
      count: projects.filter((p) => p.status === status).length,
    }));

    const taskStatusBreakdown = (['todo', 'in_progress', 'completed', 'on_hold'] as const).map(
      (status) => ({
        status,
        label: TASK_STATUS_META[status].label,
        variant: TASK_STATUS_META[status].variant,
        count: tasks.filter((t) => t.status === status).length,
      })
    );

    const weeklySchedule = Array.from({ length: 7 }, (_, i) => {
      const offset = i - 3;
      const iso = offsetISODate(offset);
      const [y, m, d] = iso.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const label =
        offset === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
      const matching = tasks.filter((t) => t.dueDate === iso);
      return {
        iso,
        label,
        completed: matching.filter((t) => t.status === 'completed').length,
        open: matching.filter((t) => t.status !== 'completed').length,
      };
    });

    return {
      totalProjects,
      completedProjects,
      projectCompletionPct,
      totalTasks,
      completedTasks,
      taskCompletionPct,
      avgProjectProgress,
      projectStatusBreakdown,
      taskStatusBreakdown,
      weeklySchedule,
    };
  }, [projects, tasks, getProjectProgress]);

  const maxWeekly = Math.max(
    1,
    ...stats.weeklySchedule.map((d) => d.completed + d.open)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--ph-text-primary)]">
          Analytics
        </h2>
        <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
          Live workspace metrics calculated directly from your projects and tasks.
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs text-[var(--ph-text-secondary)]">Project Completion</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-[var(--ph-text-primary)] tabular-nums">
              {stats.projectCompletionPct}%
            </span>
            <span className="text-xs text-[var(--ph-text-muted)]">
              {stats.completedProjects} of {stats.totalProjects} completed
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
            <div
              className="h-full rounded-full bg-[var(--ph-accent)]"
              style={{ width: `${stats.projectCompletionPct}%` }}
            />
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-[var(--ph-text-secondary)]">Task Completion</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-[var(--ph-text-primary)] tabular-nums">
              {stats.taskCompletionPct}%
            </span>
            <span className="text-xs text-[var(--ph-text-muted)]">
              {stats.completedTasks} of {stats.totalTasks} tasks done
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
            <div
              className="h-full rounded-full bg-[var(--ph-success)]"
              style={{ width: `${stats.taskCompletionPct}%` }}
            />
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-[var(--ph-text-secondary)]">Average Project Progress</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-[var(--ph-text-primary)] tabular-nums">
              {stats.avgProjectProgress}%
            </span>
            <span className="text-xs text-[var(--ph-text-muted)]">across active &amp; planned</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
            <div
              className="h-full rounded-full bg-[var(--ph-accent-hover)]"
              style={{ width: `${stats.avgProjectProgress}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader className="border-b border-[var(--ph-border)] pb-4">
            <div>
              <CardTitle>Weekly Productivity Window</CardTitle>
              <CardDescription>Completed vs. open tasks by due date</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-[var(--ph-text-muted)]" />
          </CardHeader>
          <CardContent className="pt-5">
            {tasks.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="h-5 w-5" />}
                title="No task data available"
                description="Add tasks with due dates to populate your weekly productivity distribution."
              />
            ) : (
              <div className="grid grid-cols-7 gap-3 pt-2">
                {stats.weeklySchedule.map((day) => {
                  const doneH = Math.round((day.completed / maxWeekly) * 120);
                  const openH = Math.round((day.open / maxWeekly) * 120);
                  return (
                    <div key={day.iso} className="flex flex-col items-center gap-2">
                      <div className="flex h-36 w-full items-end justify-center gap-1 rounded-md bg-[var(--ph-bg-secondary)]/50 px-1 pb-2">
                        <div
                          title={`${day.completed} completed`}
                          className="w-3 rounded-t-sm bg-[var(--ph-accent)]"
                          style={{
                            height: `${day.completed > 0 ? Math.max(10, doneH) : 4}px`,
                            opacity: day.completed > 0 ? 1 : 0.25,
                          }}
                        />
                        <div
                          title={`${day.open} open`}
                          className="w-3 rounded-t-sm border border-[var(--ph-border-hover)] bg-[var(--ph-bg-card)]"
                          style={{
                            height: `${day.open > 0 ? Math.max(10, openH) : 4}px`,
                            opacity: day.open > 0 ? 1 : 0.35,
                          }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          day.label === 'Today'
                            ? 'text-[var(--ph-accent-text)]'
                            : 'text-[var(--ph-text-secondary)]'
                        }`}
                      >
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project & Task Distribution */}
        <Card className="lg:col-span-5">
          <CardHeader className="border-b border-[var(--ph-border)] pb-4">
            <div>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Current spread across projects and tasks</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[var(--ph-text-primary)]">Projects</p>
              {stats.projectStatusBreakdown.map((item) => {
                const pct =
                  stats.totalProjects === 0
                    ? 0
                    : Math.round((item.count / stats.totalProjects) * 100);
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant={item.variant}>{item.label}</Badge>
                      <span className="font-mono text-[var(--ph-text-secondary)] tabular-nums">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                      <div
                        className="h-full rounded-full bg-[var(--ph-accent)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[var(--ph-border)] pt-4 space-y-2">
              <p className="text-xs font-semibold text-[var(--ph-text-primary)]">Tasks</p>
              <div className="grid grid-cols-2 gap-2">
                {stats.taskStatusBreakdown.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-md border border-[var(--ph-border)] px-3 py-2 text-xs"
                  >
                    <span className="text-[var(--ph-text-secondary)]">{item.label}</span>
                    <span className="font-mono font-semibold text-[var(--ph-text-primary)]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Honest Time Tracking Section */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>Time Tracking</CardTitle>
            <CardDescription>Focused session logs per project</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-[var(--ph-text-muted)]" />
        </CardHeader>
        <CardContent className="pt-4">
          <EmptyState
            icon={<Clock className="h-5 w-5" />}
            title="No time entries logged yet"
            description="Time tracking is ready for future focus-timer integration. No fabricated focus hours are displayed."
          />
        </CardContent>
      </Card>
    </div>
  );
};
