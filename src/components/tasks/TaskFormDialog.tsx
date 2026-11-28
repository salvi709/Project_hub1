import React, { useEffect, useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import type { PriorityLevel } from '../../types/database';
import type { WorkspaceSubtask, WorkspaceTask, WorkspaceTaskStatus } from '../../types/domain';
import { offsetISODate } from '../../lib/date';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { useToast } from '../ui/ToastProvider';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: WorkspaceTask | null;
  defaultProjectId?: string | null;
  defaultStatus?: WorkspaceTaskStatus;
  defaultDueDate?: string;
}

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onOpenChange,
  task,
  defaultProjectId = null,
  defaultStatus = 'todo',
  defaultDueDate,
}) => {
  const { projects, createTask, updateTask } = useWorkspace();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [status, setStatus] = useState<WorkspaceTaskStatus>('todo');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState(offsetISODate(2));
  const [subtasks, setSubtasks] = useState<WorkspaceSubtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (!open) return;
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setProjectId(task.projectId ?? '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setSubtasks(task.subtasks);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultProjectId ?? '');
      setStatus(defaultStatus);
      setPriority('medium');
      setDueDate(defaultDueDate ?? offsetISODate(2));
      setSubtasks([]);
    }
    setNewSubtaskTitle('');
  }, [open, task, defaultProjectId, defaultStatus, defaultDueDate]);

  const handleAddSubtask = () => {
    const clean = newSubtaskTitle.trim();
    if (!clean) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: clean,
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      projectId: projectId || null,
      status,
      priority,
      dueDate,
      subtasks,
    };

    if (task) {
      updateTask(task.id, payload);
      toast({ title: 'Task updated', description: title.trim(), variant: 'success' });
    } else {
      createTask(payload);
      toast({ title: 'Task created', description: title.trim(), variant: 'success' });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        <DialogDescription>
          {task
            ? 'Update task details, due date, priority, and checklist subtasks.'
            : 'Add a task with priority, due date, and optional subtasks.'}
        </DialogDescription>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="task-title" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
              Task title
            </label>
            <Input
              id="task-title"
              required
              placeholder="e.g., Review authentication middleware"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="task-desc" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
              Notes (optional)
            </label>
            <Textarea
              id="task-desc"
              placeholder="Context, acceptance criteria, or links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[72px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="task-project" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
                Project
              </label>
              <Select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">Personal / Unassigned</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="task-due" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
                Due date
              </label>
              <Input
                id="task-due"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="task-status" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
                Status
              </label>
              <Select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkspaceTaskStatus)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="task-priority" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
                Priority
              </label>
              <Select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-2 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--ph-text-primary)]">
                Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
              </span>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-card)] px-2.5 py-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(sub.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left cursor-pointer"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          sub.completed
                            ? 'border-[var(--ph-accent)] bg-[var(--ph-accent)] text-[var(--ph-accent-foreground)]'
                            : 'border-[var(--ph-border-hover)] bg-transparent'
                        }`}
                      >
                        {sub.completed && <Check className="h-3 w-3" />}
                      </span>
                      <span
                        className={`truncate text-xs ${
                          sub.completed
                            ? 'line-through text-[var(--ph-text-muted)]'
                            : 'text-[var(--ph-text-primary)]'
                        }`}
                      >
                        {sub.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      aria-label="Remove subtask"
                      className="rounded p-1 text-[var(--ph-text-muted)] hover:text-[var(--ph-error)] cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="h-8 text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddSubtask}>
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {task ? 'Save changes' : 'Create task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
