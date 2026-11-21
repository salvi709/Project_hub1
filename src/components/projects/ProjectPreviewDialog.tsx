import React from 'react';
import { Calendar, CheckCircle2, Circle, GitBranch } from 'lucide-react';
import type { SampleProject } from '../../types/domain';
import { SAMPLE_TASKS } from '../../features/tasks/sampleTasks';
import { cn } from '../../lib/utils';
import { formatPercentage, formatShortDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';

interface ProjectPreviewDialogProps {
  project: SampleProject | null;
  onOpenChange: (open: boolean) => void;
}

const STATUS_META: Record<SampleProject['status'], { label: string; className: string }> = {
  active: { label: 'Active', className: 'text-emerald-400' },
  planning: { label: 'Planning', className: 'text-[var(--ph-text-secondary)]' },
  on_hold: { label: 'On Hold', className: 'text-amber-400' },
  completed: { label: 'Completed', className: 'text-emerald-300' },
  archived: { label: 'Archived', className: 'text-[var(--ph-text-muted)]' },
};

export const ProjectPreviewDialog: React.FC<ProjectPreviewDialogProps> = ({
  project,
  onOpenChange,
}) => {
  if (!project) return null;

  const pct = formatPercentage(project.tasksCompleted, project.tasksTotal);
  const status = STATUS_META[project.status];
  const relatedTasks = SAMPLE_TASKS.filter((t) => t.projectId === project.id);

  return (
    <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <div className="pr-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ph-text-muted)]">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className={cn('font-medium', status.className)}>{status.label}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{project.priority} priority</span>
            <span aria-hidden="true">·</span>
            <span>Sample Preview</span>
          </div>

          <DialogTitle className="mt-1.5 text-lg">{project.name}</DialogTitle>
          <DialogDescription className="mt-1.5 leading-relaxed">
            {project.summary}
          </DialogDescription>
        </div>

        {/* Key Metadata Row */}
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-primary)] p-3.5 text-xs">
          <div className="flex items-center gap-2 text-[var(--ph-text-secondary)]">
            <Calendar className="h-3.5 w-3.5 text-[var(--ph-text-muted)] shrink-0" />
            <span>Target: {formatShortDate(project.targetDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--ph-text-secondary)] justify-end font-mono text-[11px] truncate">
            <GitBranch className="h-3.5 w-3.5 text-[var(--ph-text-muted)] shrink-0" />
            <span className="truncate">{project.githubRepo ?? 'No repository linked'}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--ph-text-secondary)]">Sample Milestone Progress</span>
            <span className="font-mono font-medium text-[var(--ph-text-primary)] tabular-nums">
              {project.tasksCompleted}/{project.tasksTotal} tasks · {pct}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-elevated)]">
            <div
              className="h-full rounded-full bg-[var(--ph-accent)] transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Linked Sample Tasks */}
        <div className="mt-5 border-t border-[var(--ph-border)] pt-4">
          <h4 className="font-display text-xs font-semibold text-[var(--ph-text-secondary)]">
            Sample Tasks in {project.name}
          </h4>
          {relatedTasks.length === 0 ? (
            <p className="mt-2 text-xs text-[var(--ph-text-muted)]">
              No preview tasks attached to this sample project.
            </p>
          ) : (
            <ul className="mt-2.5 space-y-2">
              {relatedTasks.map((task) => {
                const isDone = task.status === 'done';
                return (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-primary)] px-3 py-2 text-xs"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--ph-accent)]" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 shrink-0 text-[var(--ph-text-muted)]" />
                      )}
                      <span
                        className={cn(
                          'truncate',
                          isDone
                            ? 'text-[var(--ph-text-muted)] line-through'
                            : 'text-[var(--ph-text-primary)]'
                        )}
                      >
                        {task.title}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--ph-text-muted)] shrink-0 tabular-nums">
                      {formatShortDate(task.dueDate)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--ph-border)] pt-4">
          <span className="text-[11px] text-[var(--ph-text-muted)]">
            Read-only Phase 1 sample record
          </span>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
