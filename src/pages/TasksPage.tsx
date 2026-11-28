import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Edit3,
  Kanban,
  List,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type { PriorityLevel } from '../types/database';
import type { WorkspaceTask, WorkspaceTaskStatus } from '../types/domain';
import { formatShortDate, isOverdueISO, isTodayISO } from '../lib/date';
import { getProjectVisual } from '../lib/projectVisuals';
import { PRIORITY_META, TASK_STATUS_META } from '../lib/statusMeta';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import { useToast } from '../components/ui/ToastProvider';

const COLUMNS: {
  status: WorkspaceTaskStatus;
  title: string;
  surfaceBg: string;
  headerBg: string;
  headerInk: string;
  dotColor: string;
}[] = [
  {
    status: 'todo',
    title: 'To Do',
    surfaceBg: '#F8F6FF',
    headerBg: '#EEE8FF',
    headerInk: '#6545C4',
    dotColor: '#9272E8',
  },
  {
    status: 'in_progress',
    title: 'In Progress',
    surfaceBg: '#F4F9FF',
    headerBg: '#E2F0FF',
    headerInk: '#2A67A8',
    dotColor: '#4D8CE8',
  },
  {
    status: 'completed',
    title: 'Completed',
    surfaceBg: '#F3FBF7',
    headerBg: '#DDF5E9',
    headerInk: '#277554',
    dotColor: '#46A77C',
  },
  {
    status: 'on_hold',
    title: 'On Hold',
    surfaceBg: '#FFF8F4',
    headerBg: '#FFE8DC',
    headerInk: '#B35A30',
    dotColor: '#E5A34D',
  },
];

export const TasksPage: React.FC = () => {
  const { projects, tasks, getProjectById, moveTaskStatus, toggleSubtask, deleteTask } =
    useWorkspace();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<WorkspaceTaskStatus | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<WorkspaceTask | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<WorkspaceTaskStatus>('todo');

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (projectFilter === 'personal' && task.projectId !== null) return false;
      if (projectFilter !== 'all' && projectFilter !== 'personal' && task.projectId !== projectFilter) {
        return false;
      }
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (
        q &&
        !task.title.toLowerCase().includes(q) &&
        !(task.description ?? '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [tasks, search, projectFilter, priorityFilter]);

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const openCreateModal = (status: WorkspaceTaskStatus = 'todo') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const openEditModal = (task: WorkspaceTask) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (task: WorkspaceTask) => {
    deleteTask(task.id);
    toast({ title: 'Task deleted', description: task.title });
  };

  const handleDrop = (targetStatus: WorkspaceTaskStatus) => {
    if (draggedTaskId) {
      moveTaskStatus(draggedTaskId, targetStatus);
    }
    setDraggedTaskId(null);
    setDragOverCol(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)]">
            Tasks Board
          </h2>
          <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
            Organize priorities, drag tasks across workflow stages, and check off subtasks.
          </p>
        </div>

        <Button size="md" onClick={() => openCreateModal('todo')}>
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--ph-border)] bg-white p-3 shadow-[var(--ph-shadow-sm)] lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or notes..."
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-44">
            <Select
              aria-label="Filter by project"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="all">All projects</option>
              <option value="personal">Personal / Unassigned</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-36">
            <Select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | PriorityLevel)}
            >
              <option value="all">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>

          <div className="inline-flex rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Board
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Board / List */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-5 w-5" />}
          title="No tasks yet"
          description="Create your first task with priorities, due dates, and subtasks."
          action={
            <Button size="sm" onClick={() => openCreateModal('todo')}>
              <Plus className="h-3.5 w-3.5" />
              Create task
            </Button>
          }
        />
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.status);
            const isOver = dragOverCol === col.status;

            return (
              <div
                key={col.status}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(col.status);
                }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(col.status)}
                className={`flex min-h-[420px] flex-col rounded-2xl border p-3 transition-all duration-150 ${
                  isOver
                    ? 'border-[var(--ph-accent)] ring-2 ring-[var(--ph-lavender-soft)]'
                    : 'border-[var(--ph-border)]'
                }`}
                style={{ backgroundColor: col.surfaceBg }}
              >
                {/* Pastel Column Header */}
                <div
                  className="mb-3 flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ backgroundColor: col.headerBg }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: col.dotColor }}
                    />
                    <h3
                      className="font-display text-xs font-bold"
                      style={{ color: col.headerInk }}
                    >
                      {col.title}
                    </h3>
                    <span className="rounded-md bg-white/85 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--ph-text-primary)] tabular-nums">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreateModal(col.status)}
                    aria-label={`Add task to ${col.title}`}
                    className="rounded-lg bg-white/80 p-1 text-[var(--ph-text-primary)] hover:bg-white transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  {columnTasks.map((task) => {
                    const project = getProjectById(task.projectId);
                    const visual = project
                      ? getProjectVisual(project.category, project.id)
                      : null;
                    const priorityMeta = PRIORITY_META[task.priority];
                    const doneSubtasks = task.subtasks.filter((s) => s.completed).length;
                    const isExpanded = Boolean(expandedTasks[task.id]);
                    const overdue = task.status !== 'completed' && isOverdueISO(task.dueDate);
                    const dueToday = isTodayISO(task.dueDate);

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverCol(null);
                        }}
                        className="cursor-grab active:cursor-grabbing rounded-xl border border-[var(--ph-border)] bg-white p-3.5 shadow-[var(--ph-shadow-sm)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--ph-border-hover)] hover:shadow-[var(--ph-shadow-md)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant={priorityMeta.variant}>{priorityMeta.label}</Badge>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(task)}
                              aria-label={`Edit ${task.title}`}
                              className="rounded-md p-1 text-[var(--ph-text-muted)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(task)}
                              aria-label={`Delete ${task.title}`}
                              className="rounded-md p-1 text-[var(--ph-text-muted)] hover:bg-[var(--ph-error-soft)] hover:text-[#B53D3D] cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <p
                          className={`mt-2.5 font-display text-sm font-semibold leading-snug ${
                            task.status === 'completed'
                              ? 'line-through text-[var(--ph-text-muted)]'
                              : 'text-[var(--ph-text-primary)]'
                          }`}
                        >
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-[var(--ph-text-secondary)]">
                            {task.description}
                          </p>
                        )}

                        {task.subtasks.length > 0 && (
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={() => toggleExpanded(task.id)}
                              className="flex w-full items-center justify-between text-[11px] font-medium text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
                            >
                              <span className="inline-flex items-center gap-1">
                                {isExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                                Subtasks
                              </span>
                              <span className="font-mono text-[10px]">
                                {doneSubtasks}/{task.subtasks.length}
                              </span>
                            </button>

                            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                              <div
                                className="h-full rounded-full bg-[var(--ph-accent)] transition-all"
                                style={{
                                  width: `${Math.round(
                                    (doneSubtasks / task.subtasks.length) * 100
                                  )}%`,
                                }}
                              />
                            </div>

                            {isExpanded && (
                              <div className="mt-2.5 space-y-1.5 border-t border-[var(--ph-border)] pt-2">
                                {task.subtasks.map((sub) => (
                                  <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => toggleSubtask(task.id, sub.id)}
                                    className="flex w-full items-center gap-2 text-left text-[11px] cursor-pointer"
                                  >
                                    <span
                                      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                                        sub.completed
                                          ? 'border-[var(--ph-accent)] bg-[var(--ph-accent)] text-white'
                                          : 'border-[var(--ph-border-hover)]'
                                      }`}
                                    >
                                      {sub.completed && <Check className="h-2.5 w-2.5" />}
                                    </span>
                                    <span
                                      className={
                                        sub.completed
                                          ? 'line-through text-[var(--ph-text-muted)]'
                                          : 'text-[var(--ph-text-secondary)]'
                                      }
                                    >
                                      {sub.title}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--ph-border)] pt-2.5 text-[11px]">
                          {project ? (
                            <Link
                              to={`/projects/${project.id}`}
                              className="inline-flex min-w-0 items-center gap-1.5 text-[var(--ph-text-secondary)] hover:text-[var(--ph-accent-hover)] transition-colors"
                            >
                              <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: visual?.barColor ?? '#9272E8' }}
                              />
                              <span className="truncate font-medium">{project.name}</span>
                            </Link>
                          ) : (
                            <span className="text-[var(--ph-text-muted)]">Personal</span>
                          )}

                          <span
                            className={`inline-flex shrink-0 items-center gap-1 font-mono ${
                              overdue
                                ? 'font-semibold text-[#B53D3D]'
                                : dueToday
                                ? 'font-semibold text-[var(--ph-accent-hover)]'
                                : 'text-[var(--ph-text-muted)]'
                            }`}
                          >
                            <Calendar className="h-3 w-3" />
                            {dueToday ? 'Today' : formatShortDate(task.dueDate)}
                          </span>
                        </div>

                        {/* Quick Stage Switcher for touch/mobile */}
                        <div className="mt-2.5 lg:hidden">
                          <Select
                            aria-label={`Move ${task.title}`}
                            value={task.status}
                            onChange={(e) =>
                              moveTaskStatus(task.id, e.target.value as WorkspaceTaskStatus)
                            }
                            className="h-7 text-[11px]"
                          >
                            <option value="todo">Move to To Do</option>
                            <option value="in_progress">Move to In Progress</option>
                            <option value="completed">Move to Completed</option>
                            <option value="on_hold">Move to On Hold</option>
                          </Select>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => openCreateModal(col.status)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--ph-border-hover)] bg-white/60 py-2.5 text-xs font-medium text-[var(--ph-text-secondary)] hover:bg-white hover:text-[var(--ph-text-primary)] transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">Done</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => {
              const project = getProjectById(task.projectId);
              const statusMeta = TASK_STATUS_META[task.status];
              const priorityMeta = PRIORITY_META[task.priority];
              const isDone = task.status === 'completed';

              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => moveTaskStatus(task.id, isDone ? 'todo' : 'completed')}
                      aria-label={`Toggle ${task.title}`}
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors cursor-pointer ${
                        isDone
                          ? 'border-[var(--ph-accent)] bg-[var(--ph-accent)] text-white'
                          : 'border-[var(--ph-border-hover)] hover:border-[var(--ph-accent)]'
                      }`}
                    >
                      {isDone && <Check className="h-3 w-3" />}
                    </button>
                  </TableCell>
                  <TableCell>
                    <p
                      className={`font-medium ${
                        isDone
                          ? 'line-through text-[var(--ph-text-muted)]'
                          : 'text-[var(--ph-text-primary)]'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.subtasks.length > 0 && (
                      <p className="text-[11px] text-[var(--ph-text-muted)]">
                        {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}{' '}
                        subtasks
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-[var(--ph-text-secondary)]">
                    {project ? (
                      <Link
                        to={`/projects/${project.id}`}
                        className="hover:text-[var(--ph-accent-hover)] transition-colors"
                      >
                        {project.name}
                      </Link>
                    ) : (
                      'Personal'
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      aria-label={`Change status for ${task.title}`}
                      value={task.status}
                      onChange={(e) =>
                        moveTaskStatus(task.id, e.target.value as WorkspaceTaskStatus)
                      }
                      className="h-7 w-32 text-xs"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </Select>
                    <span className="sr-only">{statusMeta.label}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityMeta.variant}>{priorityMeta.label}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[var(--ph-text-secondary)]">
                    {formatShortDate(task.dueDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${task.title}`}
                        onClick={() => openEditModal(task)}
                        className="h-8 w-8"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${task.title}`}
                        onClick={() => handleDelete(task)}
                        className="h-8 w-8 hover:text-[var(--ph-error)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
};
