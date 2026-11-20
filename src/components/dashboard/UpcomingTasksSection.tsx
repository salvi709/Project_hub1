import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Circle } from 'lucide-react';
import type { SampleTask } from '../../types/domain';
import { cn } from '../../lib/utils';
import { formatShortDate } from '../../utils/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface UpcomingTasksSectionProps {
  tasks: SampleTask[];
  onToggleTask: (taskId: string) => void;
}

const PRIORITY_STYLE: Record<SampleTask['priority'], { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'text-red-400' },
  high: { label: 'High', className: 'text-amber-400' },
  medium: { label: 'Medium', className: 'text-[var(--ph-text-secondary)]' },
  low: { label: 'Low', className: 'text-[var(--ph-text-muted)]' },
};

export const UpcomingTasksSection: React.FC<UpcomingTasksSectionProps> = ({
  tasks,
  onToggleTask,
}) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription className="mt-0.5">
            Interactive sample queue · Toggle items to test local state
          </CardDescription>
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ph-accent)] hover:underline whitespace-nowrap shrink-0"
        >
          <span>All tasks</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="divide-y divide-[var(--ph-border)]">
        {tasks.slice(0, 5).map((task) => {
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
                aria-label={isDone ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
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
                  {isDone ? <Check className="h-3 w-3 stroke-[2.5]" /> : <Circle className="h-2.5 w-2.5" />}
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
        })}
      </CardContent>
    </Card>
  );
};
