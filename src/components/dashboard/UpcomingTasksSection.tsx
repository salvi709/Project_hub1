import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Check, CheckSquare, Plus } from 'lucide-react';
import { formatShortDate, isOverdueISO, isTodayISO, offsetISODate } from '../../lib/date';
import { PRIORITY_META } from '../../lib/statusMeta';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Input } from '../ui/Input';
import { useToast } from '../ui/ToastProvider';

interface UpcomingTasksSectionProps {
  onNewTask: () => void;
}

const PRIORITY_CARD_TINTS = ['#E2F0FF', '#EEE8FF', '#FFE8DC'];

export const UpcomingTasksSection: React.FC<UpcomingTasksSectionProps> = ({ onNewTask }) => {
  const { tasks, getProjectById, moveTaskStatus, createTask } = useWorkspace();
  const { toast } = useToast();
  const [quickTitle, setQuickTitle] = useState('');

  const openTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== 'completed')
        .sort((a, b) => {
          const priorityDiff =
            PRIORITY_META[b.priority].rank - PRIORITY_META[a.priority].rank;
          if (priorityDiff !== 0) return priorityDiff;
          return a.dueDate.localeCompare(b.dueDate);
        }),
    [tasks]
  );

  const todaysPriorities = useMemo(() => {
    const dueOrUrgent = openTasks.filter(
      (t) => isTodayISO(t.dueDate) || isOverdueISO(t.dueDate) || t.priority === 'urgent'
    );
    return (dueOrUrgent.length > 0 ? dueOrUrgent : openTasks).slice(0, 3);
  }, [openTasks]);

  const upcomingList = useMemo(() => {
    const topIds = new Set(todaysPriorities.map((t) => t.id));
    return openTasks.filter((t) => !topIds.has(t.id)).slice(0, 4);
  }, [openTasks, todaysPriorities]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quickTitle.trim();
    if (!clean) return;
    createTask({
      title: clean,
      projectId: null,
      status: 'todo',
      priority: 'medium',
      dueDate: offsetISODate(0),
      subtasks: [],
    });
    setQuickTitle('');
    toast({ title: 'Task added for today', description: clean, variant: 'success' });
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>Today&apos;s Priorities &amp; Quick Tasks</CardTitle>
            <CardDescription>Focus items, deadlines, and fast task capture</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/tasks">
              Board
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Quick Inline Capture */}
          <form onSubmit={handleQuickAdd} className="flex items-center gap-2">
            <Input
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Quick add a task for today..."
              className="h-9 bg-[#FAF8FF]"
            />
            <Button type="submit" size="sm" variant="subtle" disabled={!quickTitle.trim()}>
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </form>

          {openTasks.length === 0 ? (
            <EmptyState
              icon={<CheckSquare className="h-5 w-5" />}
              title="All tasks completed"
              description="Add a task above or open the detailed task dialog."
              action={
                <Button variant="outline" size="sm" onClick={onNewTask}>
                  Open task modal
                </Button>
              }
            />
          ) : (
            <>
              {/* Highlighted Today Priority Cards */}
              <div className="space-y-2.5">
                {todaysPriorities.map((task, idx) => {
                  const project = getProjectById(task.projectId);
                  const priorityMeta = PRIORITY_META[task.priority];
                  const doneSubs = task.subtasks.filter((s) => s.completed).length;
                  const cardBg = PRIORITY_CARD_TINTS[idx % PRIORITY_CARD_TINTS.length];
                  const overdue = isOverdueISO(task.dueDate);
                  const dueToday = isTodayISO(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-3 rounded-xl p-3.5 transition-transform duration-150 hover:-translate-y-0.5"
                      style={{ backgroundColor: cardBg }}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <button
                          type="button"
                          onClick={() => moveTaskStatus(task.id, 'completed')}
                          aria-label={`Complete ${task.title}`}
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#29243A]/20 bg-white text-transparent transition-colors hover:border-[var(--ph-accent)] hover:text-[var(--ph-accent)] cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <div className="min-w-0">
                          <p className="truncate font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                            {task.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--ph-text-secondary)]">
                            <span>{project?.name ?? 'Personal'}</span>
                            {task.subtasks.length > 0 && (
                              <span className="font-mono text-[10px]">
                                · {doneSubs}/{task.subtasks.length} steps
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <Badge variant={priorityMeta.variant}>{priorityMeta.label}</Badge>
                        <span
                          className={`font-mono text-[11px] font-medium ${
                            overdue
                              ? 'text-[#B53D3D]'
                              : dueToday
                              ? 'text-[var(--ph-accent-hover)]'
                              : 'text-[var(--ph-text-secondary)]'
                          }`}
                        >
                          {dueToday ? 'Today' : formatShortDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upcoming Deadlines List */}
              {upcomingList.length > 0 && (
                <div className="pt-1">
                  <p className="mb-2 text-[11px] font-semibold text-[var(--ph-text-secondary)]">
                    Upcoming Deadlines
                  </p>
                  <div className="divide-y divide-[var(--ph-border)] rounded-xl border border-[var(--ph-border)] bg-white px-3">
                    {upcomingList.map((task) => {
                      const project = getProjectById(task.projectId);
                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-2 py-2.5 text-xs"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => moveTaskStatus(task.id, 'completed')}
                              aria-label={`Complete ${task.title}`}
                              className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--ph-border-hover)] text-transparent hover:border-[var(--ph-accent)] hover:text-[var(--ph-accent)] cursor-pointer"
                            >
                              <Check className="h-2.5 w-2.5" />
                            </button>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-[var(--ph-text-primary)]">
                                {task.title}
                              </p>
                              <p className="truncate text-[11px] text-[var(--ph-text-muted)]">
                                {project?.name ?? 'Personal'}
                              </p>
                            </div>
                          </div>

                          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-[var(--ph-text-secondary)]">
                            <Calendar className="h-3 w-3 text-[var(--ph-text-muted)]" />
                            {formatShortDate(task.dueDate)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
};
