import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CheckSquare } from 'lucide-react';
import { formatShortDate, isOverdueISO, isTodayISO } from '../../lib/date';
import { PRIORITY_META } from '../../lib/statusMeta';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

interface UpcomingTasksSectionProps {
  onNewTask: () => void;
}

export const UpcomingTasksSection: React.FC<UpcomingTasksSectionProps> = ({ onNewTask }) => {
  const { tasks, getProjectById, moveTaskStatus } = useWorkspace();
  const [filter, setFilter] = useState<'today' | 'upcoming'>('today');

  const openTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== 'completed')
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    if (filter === 'today') {
      return openTasks.filter((t) => isTodayISO(t.dueDate) || isOverdueISO(t.dueDate));
    }
    return openTasks.slice(0, 6);
  }, [filter, openTasks]);

  return (
    <Card>
      <CardHeader className="flex-col gap-3 border-b border-[var(--ph-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Tasks & Deadlines</CardTitle>
          <CardDescription>Check off items due today or inspect upcoming milestones</CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-0.5">
            <button
              type="button"
              onClick={() => setFilter('today')}
              className={`rounded-sm px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filter === 'today'
                  ? 'bg-[var(--ph-bg-card)] text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              Due Today
            </button>
            <button
              type="button"
              onClick={() => setFilter('upcoming')}
              className={`rounded-sm px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filter === 'upcoming'
                  ? 'bg-[var(--ph-bg-card)] text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              Upcoming
            </button>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/tasks">
              All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {visibleTasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className="h-5 w-5" />}
            title={filter === 'today' ? 'Nothing due today' : 'No open tasks'}
            description={
              filter === 'today'
                ? 'You are caught up for today. Switch to Upcoming or add a new task.'
                : 'Add a task to start tracking priorities and due dates.'
            }
            action={
              <Button variant="outline" size="sm" onClick={onNewTask}>
                Add task
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-[var(--ph-border)]">
            {visibleTasks.map((task) => {
              const project = getProjectById(task.projectId);
              const priorityMeta = PRIORITY_META[task.priority];
              const overdue = isOverdueISO(task.dueDate);
              const dueToday = isTodayISO(task.dueDate);

              return (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <button
                      type="button"
                      onClick={() => moveTaskStatus(task.id, 'completed')}
                      aria-label={`Mark ${task.title} completed`}
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--ph-border-hover)] text-transparent transition-colors hover:border-[var(--ph-accent)] hover:bg-[var(--ph-accent-soft)] hover:text-[var(--ph-accent-text)] cursor-pointer"
                    >
                      <Check className="h-3 w-3" />
                    </button>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--ph-text-primary)]">
                        {task.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--ph-text-secondary)]">
                        {project ? (
                          <Link
                            to={`/projects/${project.id}`}
                            className="hover:text-[var(--ph-accent-text)] transition-colors"
                          >
                            {project.name}
                          </Link>
                        ) : (
                          <span>Personal</span>
                        )}
                        {task.subtasks.length > 0 && (
                          <span className="text-[var(--ph-text-muted)]">
                            · {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={priorityMeta.variant}>{priorityMeta.label}</Badge>
                    <span
                      className={`text-xs font-medium tabular-nums ${
                        overdue
                          ? 'text-[var(--ph-error)]'
                          : dueToday
                          ? 'text-[var(--ph-accent-text)]'
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
        )}
      </CardContent>
    </Card>
  );
};
