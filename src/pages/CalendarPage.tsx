import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Plus,
} from 'lucide-react';
import { formatFullDate, formatShortDate, toISODate } from '../lib/date';
import { getProjectVisual } from '../lib/projectVisuals';
import { PRIORITY_META, PROJECT_STATUS_META, TASK_STATUS_META } from '../lib/statusMeta';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

type CalendarMode = 'month' | 'week' | 'day';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarPage: React.FC = () => {
  const { projects, tasks, getProjectById } = useWorkspace();

  const [mode, setMode] = useState<CalendarMode>('month');
  const [cursorDate, setCursorDate] = useState<Date>(() => new Date());
  const [selectedISO, setSelectedISO] = useState<string>(() => toISODate(new Date()));
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const todayISO = toISODate(new Date());

  const eventsByDate = useMemo(() => {
    const map: Record<
      string,
      {
        tasks: typeof tasks;
        milestones: typeof projects;
      }
    > = {};

    const ensure = (iso: string) => {
      if (!map[iso]) map[iso] = { tasks: [], milestones: [] };
      return map[iso];
    };

    tasks.forEach((t) => {
      if (t.dueDate) ensure(t.dueDate).tasks.push(t);
    });
    projects.forEach((p) => {
      if (p.targetDate) ensure(p.targetDate).milestones.push(p);
    });

    return map;
  }, [tasks, projects]);

  const monthCells = useMemo(() => {
    const year = cursorDate.getFullYear();
    const month = cursorDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);

    const cells: { date: Date; iso: string; inMonth: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      cells.push({
        date: d,
        iso: toISODate(d),
        inMonth: d.getMonth() === month,
      });
    }
    return cells;
  }, [cursorDate]);

  const weekDays = useMemo(() => {
    const start = new Date(cursorDate);
    start.setDate(cursorDate.getDate() - cursorDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { date: d, iso: toISODate(d) };
    });
  }, [cursorDate]);

  const navigatePeriod = (dir: -1 | 1) => {
    const next = new Date(cursorDate);
    if (mode === 'month') {
      next.setMonth(cursorDate.getMonth() + dir);
    } else if (mode === 'week') {
      next.setDate(cursorDate.getDate() + dir * 7);
    } else {
      next.setDate(cursorDate.getDate() + dir);
      setSelectedISO(toISODate(next));
    }
    setCursorDate(next);
  };

  const jumpToday = () => {
    const now = new Date();
    setCursorDate(now);
    setSelectedISO(toISODate(now));
  };

  const periodLabel = useMemo(() => {
    if (mode === 'month') {
      return cursorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (mode === 'week') {
      const first = weekDays[0].date;
      const last = weekDays[6].date;
      return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return formatFullDate(selectedISO);
  }, [mode, cursorDate, weekDays, selectedISO]);

  const selectedDayEvents = eventsByDate[selectedISO] ?? { tasks: [], milestones: [] };

  const upcomingEvents = useMemo(() => {
    const combined: {
      id: string;
      type: 'task' | 'milestone';
      title: string;
      date: string;
      meta: string;
      projectId?: string | null;
    }[] = [];

    tasks
      .filter((t) => t.status !== 'completed' && t.dueDate >= todayISO)
      .forEach((t) => {
        combined.push({
          id: `t-${t.id}`,
          type: 'task',
          title: t.title,
          date: t.dueDate,
          meta: getProjectById(t.projectId)?.name ?? 'Personal',
          projectId: t.projectId,
        });
      });

    projects
      .filter((p) => p.status !== 'completed' && p.targetDate >= todayISO)
      .forEach((p) => {
        combined.push({
          id: `p-${p.id}`,
          type: 'milestone',
          title: `${p.name} target deadline`,
          date: p.targetDate,
          meta: p.category,
          projectId: p.id,
        });
      });

    return combined.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 7);
  }, [tasks, projects, todayISO, getProjectById]);

  const getTaskTint = (priority: string) => {
    if (priority === 'urgent') return { bg: '#FFE8DC', ink: '#B35A30' };
    if (priority === 'high') return { bg: '#EEE8FF', ink: '#6545C4' };
    return { bg: '#E2F0FF', ink: '#2A67A8' };
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)]">
            Calendar
          </h2>
          <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
            Schedule task deadlines and project milestones across month, week, and day views.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-0.5">
            {(['month', 'week', 'day'] as CalendarMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors cursor-pointer ${
                  mode === m
                    ? 'bg-white text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                    : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-[var(--ph-border)] bg-white p-0.5 shadow-[var(--ph-shadow-sm)]">
            <button
              type="button"
              onClick={() => navigatePeriod(-1)}
              aria-label="Previous period"
              className="rounded-md p-1.5 text-[var(--ph-text-secondary)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={jumpToday}
              className="rounded-md px-2.5 py-1 text-xs font-semibold text-[var(--ph-text-primary)] hover:bg-[var(--ph-bg-secondary)] cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => navigatePeriod(1)}
              aria-label="Next period"
              className="rounded-md p-1.5 text-[var(--ph-text-secondary)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button size="md" onClick={() => setTaskDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Main Calendar Surface */}
        <Card className="overflow-hidden xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ph-border)] bg-[#FAF8FF] px-5 py-3.5">
            <h3 className="font-display text-sm font-bold text-[var(--ph-text-primary)]">
              {periodLabel}
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-[var(--ph-text-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--ph-sky-soft)] border border-[#4D8CE8]" />
                Task
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--ph-mint-soft)] border border-[#46A77C]" />
                Milestone
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--ph-peach-soft)] border border-[#E58A5E]" />
                Urgent
              </span>
            </div>
          </div>

          {mode === 'month' && (
            <div>
              <div className="grid grid-cols-7 border-b border-[var(--ph-border)] bg-[var(--ph-bg-secondary)]/60">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2.5 text-center text-[11px] font-semibold text-[var(--ph-text-secondary)]"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 divide-x divide-y divide-[var(--ph-border)]">
                {monthCells.map((cell) => {
                  const dayEvents = eventsByDate[cell.iso];
                  const isToday = cell.iso === todayISO;
                  const isSelected = cell.iso === selectedISO;

                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      onClick={() => setSelectedISO(cell.iso)}
                      className={`min-h-[94px] p-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--ph-lavender-soft)]/70'
                          : 'bg-white hover:bg-[#FAF8FF]'
                      } ${!cell.inMonth && 'opacity-40'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold tabular-nums ${
                            isToday
                              ? 'bg-[var(--ph-accent)] text-white shadow-[var(--ph-shadow-sm)]'
                              : isSelected
                              ? 'text-[var(--ph-lavender-ink)]'
                              : 'text-[var(--ph-text-primary)]'
                          }`}
                        >
                          {cell.date.getDate()}
                        </span>
                      </div>

                      {dayEvents && (
                        <div className="mt-1.5 space-y-1">
                          {dayEvents.milestones.slice(0, 1).map((proj) => (
                            <div
                              key={proj.id}
                              className="truncate rounded-md bg-[var(--ph-mint-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--ph-mint-ink)]"
                            >
                              {proj.name}
                            </div>
                          ))}
                          {dayEvents.tasks.slice(0, 2).map((task) => {
                            const tint = getTaskTint(task.priority);
                            return (
                              <div
                                key={task.id}
                                className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                                style={{ backgroundColor: tint.bg, color: tint.ink }}
                              >
                                {task.title}
                              </div>
                            );
                          })}
                          {dayEvents.tasks.length + dayEvents.milestones.length > 3 && (
                            <div className="text-[10px] font-medium text-[var(--ph-text-muted)]">
                              +{dayEvents.tasks.length + dayEvents.milestones.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === 'week' && (
            <div className="grid grid-cols-1 divide-y divide-[var(--ph-border)] sm:grid-cols-7 sm:divide-x sm:divide-y-0">
              {weekDays.map((day) => {
                const dayEvents = eventsByDate[day.iso];
                const isToday = day.iso === todayISO;
                const isSelected = day.iso === selectedISO;

                return (
                  <div
                    key={day.iso}
                    onClick={() => setSelectedISO(day.iso)}
                    className={`min-h-[280px] p-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[var(--ph-lavender-soft)]/50' : 'hover:bg-[#FAF8FF]'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[var(--ph-border)] pb-2">
                      <span className="text-[11px] font-semibold text-[var(--ph-text-secondary)]">
                        {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold tabular-nums ${
                          isToday
                            ? 'bg-[var(--ph-accent)] text-white'
                            : 'text-[var(--ph-text-primary)]'
                        }`}
                      >
                        {day.date.getDate()}
                      </span>
                    </div>
                    <div className="mt-2.5 space-y-1.5">
                      {dayEvents?.milestones.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-lg bg-[var(--ph-mint-soft)] px-2 py-1.5 text-[11px] font-semibold text-[var(--ph-mint-ink)]"
                        >
                          {p.name}
                        </div>
                      ))}
                      {dayEvents?.tasks.map((t) => {
                        const tint = getTaskTint(t.priority);
                        return (
                          <div
                            key={t.id}
                            className="rounded-lg px-2 py-1.5 text-[11px] font-medium"
                            style={{ backgroundColor: tint.bg, color: tint.ink }}
                          >
                            {t.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {mode === 'day' && (
            <div className="p-5 space-y-4">
              {selectedDayEvents.milestones.length === 0 &&
              selectedDayEvents.tasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--ph-text-muted)]">
                  No tasks or milestones scheduled for {formatFullDate(selectedISO)}.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.milestones.map((p) => {
                    const visual = getProjectVisual(p.category, p.id);
                    const Icon = visual.Icon;
                    return (
                      <Link
                        key={p.id}
                        to={`/projects/${p.id}`}
                        className="flex items-center justify-between rounded-xl border border-[var(--ph-border)] p-3.5 hover:border-[var(--ph-border-hover)]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{ backgroundColor: visual.softBg, color: visual.inkColor }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                              {p.name}
                            </p>
                            <p className="text-xs text-[var(--ph-text-secondary)]">
                              Project target deadline
                            </p>
                          </div>
                        </div>
                        <Badge variant={PROJECT_STATUS_META[p.status].variant}>
                          {PROJECT_STATUS_META[p.status].label}
                        </Badge>
                      </Link>
                    );
                  })}

                  {selectedDayEvents.tasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-xl border border-[var(--ph-border)] p-3.5"
                    >
                      <div>
                        <p className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                          {t.title}
                        </p>
                        <p className="text-xs text-[var(--ph-text-secondary)]">
                          {getProjectById(t.projectId)?.name ?? 'Personal'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={PRIORITY_META[t.priority].variant}>
                          {PRIORITY_META[t.priority].label}
                        </Badge>
                        <Badge variant={TASK_STATUS_META[t.status].variant}>
                          {TASK_STATUS_META[t.status].label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Right Panel: Selected Date + Upcoming Deadlines */}
        <div className="space-y-6 xl:col-span-4">
          <Card>
            <CardHeader className="border-b border-[var(--ph-border)] pb-3">
              <div>
                <CardTitle>{formatFullDate(selectedISO)}</CardTitle>
                <CardDescription>
                  {selectedDayEvents.tasks.length + selectedDayEvents.milestones.length} scheduled
                  item(s)
                </CardDescription>
              </div>
              <Button variant="subtle" size="sm" onClick={() => setTaskDialogOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {selectedDayEvents.tasks.length === 0 &&
              selectedDayEvents.milestones.length === 0 ? (
                <p className="py-5 text-center text-xs text-[var(--ph-text-muted)]">
                  Nothing scheduled on this date.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {selectedDayEvents.milestones.map((p) => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.id}`}
                      className="flex items-center gap-2.5 rounded-xl bg-[var(--ph-mint-soft)] p-3 text-xs hover:opacity-90"
                    >
                      <FolderKanban className="h-4 w-4 shrink-0 text-[var(--ph-mint-ink)]" />
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--ph-mint-ink)]">Milestone</p>
                        <p className="truncate font-medium text-[var(--ph-text-primary)]">{p.name}</p>
                      </div>
                    </Link>
                  ))}
                  {selectedDayEvents.tasks.map((t) => {
                    const tint = getTaskTint(t.priority);
                    return (
                      <div
                        key={t.id}
                        className="rounded-xl p-3 text-xs"
                        style={{ backgroundColor: tint.bg }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[var(--ph-text-primary)]">
                            {t.title}
                          </span>
                          <Badge variant={PRIORITY_META[t.priority].variant}>
                            {PRIORITY_META[t.priority].label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-[11px] text-[var(--ph-text-secondary)]">
                          {getProjectById(t.projectId)?.name ?? 'Personal'} ·{' '}
                          {TASK_STATUS_META[t.status].label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-[var(--ph-border)] pb-3">
              <div>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Next tasks and project milestones</CardDescription>
              </div>
              <CalendarIcon className="h-4 w-4 text-[var(--ph-accent)]" />
            </CardHeader>
            <CardContent className="pt-3">
              {upcomingEvents.length === 0 ? (
                <p className="py-4 text-center text-xs text-[var(--ph-text-muted)]">
                  No upcoming events.
                </p>
              ) : (
                <div className="divide-y divide-[var(--ph-border)]">
                  {upcomingEvents.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 text-xs"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              item.type === 'milestone' ? '#46A77C' : '#9272E8',
                          }}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[var(--ph-text-primary)]">
                            {item.title}
                          </p>
                          <p className="truncate text-[11px] text-[var(--ph-text-muted)]">
                            {item.meta}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] font-medium text-[var(--ph-text-secondary)]">
                        {formatShortDate(item.date)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        defaultDueDate={selectedISO}
      />
    </div>
  );
};
