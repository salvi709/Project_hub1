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
      [
        { status: 'active', bar: '#9272E8' },
        { status: 'planning', bar: '#4D8CE8' },
        { status: 'on_hold', bar: '#E5A34D' },
        { status: 'completed', bar: '#46A77C' },
        { status: 'archived', bar: '#9A95AC' },
      ] as const
    ).map((item) => ({
      status: item.status,
      bar: item.bar,
      label: PROJECT_STATUS_META[item.status].label,
      variant: PROJECT_STATUS_META[item.status].variant,
      count: projects.filter((p) => p.status === item.status).length,
    }));

    const taskStatusBreakdown = (
      [
        { status: 'todo', bg: '#EEE8FF', ink: '#6545C4' },
        { status: 'in_progress', bg: '#E2F0FF', ink: '#2A67A8' },
        { status: 'completed', bg: '#DDF5E9', ink: '#277554' },
        { status: 'on_hold', bg: '#FFE8DC', ink: '#B35A30' },
      ] as const
    ).map((item) => ({
      ...item,
      label: TASK_STATUS_META[item.status].label,
      count: tasks.filter((t) => t.status === item.status).length,
    }));

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

  // SVG Ring Math
  const r1 = 50;
  const c1 = 2 * Math.PI * r1;
  const r2 = 35;
  const c2 = 2 * Math.PI * r2;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)]">
          Analytics
        </h2>
        <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
          Completion rings, weekly task cadence, and project status distribution derived from live workspace data.
        </p>
      </div>

      {/* Top Row: Completion Ring + Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-bold text-[var(--ph-text-primary)]">
                Completion Overview
              </h3>
              <p className="mt-0.5 text-xs text-[var(--ph-text-secondary)]">
                Overall project and task completion
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9272E8]" />
                  <span className="text-[var(--ph-text-secondary)]">Task Completion</span>
                  <span className="ml-auto font-mono font-bold text-[var(--ph-text-primary)] tabular-nums">
                    {stats.taskCompletionPct}%
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#46A77C]" />
                  <span className="text-[var(--ph-text-secondary)]">Avg Project Progress</span>
                  <span className="ml-auto font-mono font-bold text-[var(--ph-text-primary)] tabular-nums">
                    {stats.avgProjectProgress}%
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4D8CE8]" />
                  <span className="text-[var(--ph-text-secondary)]">Projects Done</span>
                  <span className="ml-auto font-mono font-bold text-[var(--ph-text-primary)] tabular-nums">
                    {stats.completedProjects}/{stats.totalProjects}
                  </span>
                </div>
              </div>
            </div>

            {/* Concentric SVG Ring */}
            <svg width="132" height="132" viewBox="0 0 132 132" className="shrink-0">
              <circle
                cx="66"
                cy="66"
                r={r1}
                fill="none"
                stroke="#F1EDFC"
                strokeWidth="10"
              />
              <circle
                cx="66"
                cy="66"
                r={r1}
                fill="none"
                stroke="#9272E8"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={c1}
                strokeDashoffset={c1 * (1 - stats.taskCompletionPct / 100)}
                transform="rotate(-90 66 66)"
              />
              <circle
                cx="66"
                cy="66"
                r={r2}
                fill="none"
                stroke="#DDF5E9"
                strokeWidth="10"
              />
              <circle
                cx="66"
                cy="66"
                r={r2}
                fill="none"
                stroke="#46A77C"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={c2}
                strokeDashoffset={c2 * (1 - stats.avgProjectProgress / 100)}
                transform="rotate(-90 66 66)"
              />
              <text
                x="66"
                y="70"
                textAnchor="middle"
                className="fill-[#29243A] font-display text-base font-bold"
              >
                {stats.taskCompletionPct}%
              </text>
            </svg>
          </div>
        </Card>

        {/* Weekly Productivity Capsule Chart */}
        <Card className="lg:col-span-7">
          <CardHeader className="border-b border-[var(--ph-border)] pb-4">
            <div>
              <CardTitle>Weekly Productivity Window</CardTitle>
              <CardDescription>Completed vs. open tasks by scheduled due date</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-[var(--ph-accent)]" />
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
                      <div className="flex h-36 w-full items-end justify-center gap-1.5 rounded-xl bg-[#FAF8FF] px-1.5 pb-2">
                        <div
                          title={`${day.completed} completed`}
                          className="w-3.5 rounded-full bg-[var(--ph-accent)]"
                          style={{
                            height: `${day.completed > 0 ? Math.max(12, doneH) : 6}px`,
                            opacity: day.completed > 0 ? 1 : 0.25,
                          }}
                        />
                        <div
                          title={`${day.open} open`}
                          className="w-3.5 rounded-full bg-[#B9D9FC]"
                          style={{
                            height: `${day.open > 0 ? Math.max(12, openH) : 6}px`,
                            opacity: day.open > 0 ? 1 : 0.35,
                          }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          day.label === 'Today'
                            ? 'font-semibold text-[var(--ph-accent-hover)]'
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
      </div>

      {/* Distribution + Honest Time Tracking */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <CardHeader className="border-b border-[var(--ph-border)] pb-4">
            <div>
              <CardTitle>Project &amp; Task Distribution</CardTitle>
              <CardDescription>Current spread across workflow stages</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            <div className="space-y-3">
              {stats.projectStatusBreakdown.map((item) => {
                const pct =
                  stats.totalProjects === 0
                    ? 0
                    : Math.round((item.count / stats.totalProjects) * 100);
                return (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant={item.variant}>{item.label}</Badge>
                      <span className="font-mono text-[var(--ph-text-secondary)] tabular-nums">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: item.bar }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[var(--ph-border)] pt-4">
              <p className="mb-2.5 text-xs font-semibold text-[var(--ph-text-primary)]">
                Tasks by Stage
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {stats.taskStatusBreakdown.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs"
                    style={{ backgroundColor: item.bg }}
                  >
                    <span className="font-medium" style={{ color: item.ink }}>
                      {item.label}
                    </span>
                    <span className="font-mono font-bold text-[var(--ph-text-primary)] tabular-nums">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader className="border-b border-[var(--ph-border)] pb-4">
            <div>
              <CardTitle>Time Tracking</CardTitle>
              <CardDescription>Focused session logs per project</CardDescription>
            </div>
            <Clock className="h-4 w-4 text-[var(--ph-accent)]" />
          </CardHeader>
          <CardContent className="pt-5">
            <EmptyState
              icon={<Clock className="h-5 w-5" />}
              title="No time entries logged yet"
              description="Time tracking is prepared for future focus-session logging. No fabricated hours are displayed here."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
