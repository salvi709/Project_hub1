import React, { useMemo, useState } from 'react';
import { Check, CheckSquare, Circle, Info, Plus, Search } from 'lucide-react';
import { SAMPLE_TASKS } from '../features/tasks/sampleTasks';
import type { TaskStatus } from '../types/database';
import type { SampleTask } from '../types/domain';
import { cn } from '../lib/utils';
import { formatShortDate } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../components/ui/Dialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';

type StatusFilter = 'all' | TaskStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const STATUS_TEXT: Record<TaskStatus, { label: string; className: string }> = {
  backlog: { label: 'Backlog', className: 'text-[var(--ph-text-muted)]' },
  todo: { label: 'To Do', className: 'text-[var(--ph-text-secondary)]' },
  in_progress: { label: 'In Progress', className: 'text-emerald-400' },
  review: { label: 'In Review', className: 'text-amber-400' },
  done: { label: 'Done', className: 'text-emerald-300' },
};

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<SampleTask[]>(SAMPLE_TASKS);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [phaseNoticeOpen, setPhaseNoticeOpen] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task
      )
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.projectName.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[var(--ph-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--ph-text-primary)]">
            Task Queue
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--ph-text-secondary)]">
            <Info className="h-3.5 w-3.5 text-[var(--ph-accent)] shrink-0" />
            <span>Sample preview tasks · Click checkboxes to preview completion state locally</span>
          </p>
        </div>

        <Button size="sm" onClick={() => setPhaseNoticeOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] p-1">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                filter === item.value
                  ? 'bg-[var(--ph-bg-elevated)] text-[var(--ph-text-primary)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sample tasks..."
            className="pl-8 text-xs"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-5 w-5" />}
          title="No sample tasks match this filter"
          description="Adjust your status selection or search query to inspect other preview items."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilter('all');
                setSearch('');
              }}
            >
              Show All Tasks
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-[var(--ph-border)]">
            {filtered.map((task) => {
              const isDone = task.status === 'done';
              const statusMeta = STATUS_TEXT[task.status];

              return (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--ph-bg-elevated)]/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-3 text-left min-w-0 flex-1 cursor-pointer group"
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
                          'text-sm font-medium',
                          isDone
                            ? 'text-[var(--ph-text-muted)] line-through'
                            : 'text-[var(--ph-text-primary)]'
                        )}
                      >
                        {task.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--ph-text-muted)]">
                        {task.projectName} · {task.subtasksDone}/{task.subtasksTotal} subtasks
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-4 pl-7 sm:pl-0 shrink-0 text-xs">
                    <span className={cn('font-medium', statusMeta.className)}>
                      {statusMeta.label}
                    </span>
                    <span className="text-[var(--ph-text-secondary)] capitalize">
                      {task.priority}
                    </span>
                    <span className="font-mono text-[var(--ph-text-muted)] tabular-nums">
                      {formatShortDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Dialog open={phaseNoticeOpen} onOpenChange={setPhaseNoticeOpen}>
        <DialogContent>
          <DialogTitle>Task Persistence Planned for Phase 2</DialogTitle>
          <DialogDescription>
            The <code className="font-mono text-xs">tasks</code> and{' '}
            <code className="font-mono text-xs">subtasks</code> tables are defined in{' '}
            <code className="font-mono text-xs">supabase/migrations/</code>. Full task CRUD and
            server sync are intentionally deferred until Phase 2.
          </DialogDescription>
          <div className="mt-5 flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setPhaseNoticeOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
