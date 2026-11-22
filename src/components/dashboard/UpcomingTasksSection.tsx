import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Circle, RotateCcw } from 'lucide-react';
import type { SampleTask } from '../../types/domain';
import { cn } from '../../lib/utils';
import { formatShortDate } from '../../utils/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface UpcomingTasksSectionProps {
  tasks: SampleTask[];
  onToggleTask: (taskId: string) => void;
  isModified?: boolean;
  onResetTasks?: () => void;
}

const PRIORITY_STYLE: Record<SampleTask['priority'], { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'text-red-600 dark:text-red-400' },
  high: { label: 'High', className: 'text-amber-600 dark:text-amber-400' },
  medium: { label: 'Medium', className: 'text-[var(--ph-text-secondary)]' },
  low: { label: 'Low', className: 'text-[var(--ph-text-muted)]' },
};

export const UpcomingTasksSection: React.FC<UpcomingTasksSectionProps> = ({
  tasks,
  onToggleTask,
  isModified = false,
  onResetTasks,
}) => {
  const [view, setView] = useState<'all' | 'pending'>('all');

  const visibleTasks = (view === 'pending' ? tasks.filter((t) => t.status !== 'done') : tasks).slice(
    0,
    5
  );

  return (
    <Card>
      <CardHeader className="flex-col gap-3 sm:flex-row sm:items-start">
        <div>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription className="mt-0.5">
            Interactive sample queue · Toggle items to test local state
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-primary)] p-0.5">
            <button
              type="button"
              onClick={() => setView('all')}
              className={cn(
                'rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                view === 'all'
                  ? 'bg-[var(--ph-bg-elevated)] text-[var(--ph-text-primary)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setView('pending')}
              className={cn(
                'rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                view === 'pending'
                  ? 'bg-[var(--ph-bg-elevated)] text-[var(--ph-text-primary)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              )}
            >
              Pending
            </button>
          </div>

          {isModified && onResetTasks && (
            <button
              type="button"
              onClick={onResetTasks}
              title="Reset sample task state"
              className="inline-flex items-center gap-1 rounded-md border border-[var(--ph-border)] px-2 py-1 text-[11px] text-[var(--ph-text-secondary)] hover:border-[var(--ph-border-hover)] hover:text-[var(--ph-text-primary)] cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}

          <Link
            to="/tasks"
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ph-accent)] hover:underline whitespace-nowrap shrink-0 ml-1"
          >
            <span>All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-[var(--ph-border)]">
        {visibleTasks.length === 0 ? (
          <p className="py-6 text-center text-xs text-[var(--ph-text-muted)]">
            All sample preview tasks are marked complete.
          </p>
        ) : (
          visibleTasks.map((task) => {
            const isDone = task.status === 'done';
            const priority = PRIORITY_STYLE[task.priority];

            return (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 py-3 first:pt-1 last:pb-0"
              >
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-label={
                    isDone ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`
                  }
                  className="flex items-start gap-3 text-left min-w-0 flex-1 group cursor-pointer"
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                      isDone
                        ? 'border-[var(--ph-accent)] bg-[var(--ph-accent)] text-[var(--ph-accent-foreground)]'
                        : 'border-[var(--ph-border-hover)] text-transparent group-hover:border-[var(--ph-accent)]'
                    )}
                  >
                    {isDone ? (
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    ) : (
                      <Circle className="h-2.5 w-2.5" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium transition-colors truncate',
                        isDone
                          ? 'text-[var(--ph-text-muted)] line-through'
                          : 'text-[var(--ph-text-primary)] group-hover:text-[var(--ph-accent)]'
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--ph-text-muted)]">
                      <span>{task.projectName}</span>
                      <span aria-hidden="true">·</span>
                      <span className={priority.className}>{priority.label}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] tabular-nums">
                        {task.subtasksDone}/{task.subtasksTotal} subtasks
                      </span>
                    </div>
                  </div>
                </button>

                <span className="font-mono text-xs text-[var(--ph-text-muted)] shrink-0 tabular-nums">
                  {formatShortDate(task.dueDate)}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
