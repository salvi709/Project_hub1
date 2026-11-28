import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Calendar,
  Edit3,
  FolderKanban,
  GitBranch,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type { PriorityLevel, ProjectStatus } from '../types/database';
import type { WorkspaceProject } from '../types/domain';
import { formatShortDate, isOverdueISO } from '../lib/date';
import { getProjectVisual } from '../lib/projectVisuals';
import { PRIORITY_META, PROJECT_STATUS_META } from '../lib/statusMeta';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { ProjectFormDialog } from '../components/projects/ProjectFormDialog';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/DropdownMenu';
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

export const ProjectsPage: React.FC = () => {
  const { projects, tasks, getProjectProgress, deleteProject } = useWorkspace();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [sortBy, setSortBy] = useState<'targetDate' | 'name' | 'progress'>('targetDate');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<WorkspaceProject | null>(null);

  const summary = useMemo(() => {
    const active = projects.filter((p) => p.status === 'active').length;
    const completed = projects.filter((p) => p.status === 'completed').length;
    const overdue = projects.filter(
      (p) => p.status !== 'completed' && p.status !== 'archived' && isOverdueISO(p.targetDate)
    ).length;
    return { total: projects.length, active, completed, overdue };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects
      .filter((p) => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
        if (
          q &&
          !p.name.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'progress') {
          return getProjectProgress(b.id) - getProjectProgress(a.id);
        }
        return a.targetDate.localeCompare(b.targetDate);
      });
  }, [projects, search, statusFilter, priorityFilter, sortBy, getProjectProgress]);

  const handleCreate = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEdit = (project: WorkspaceProject) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDelete = (project: WorkspaceProject) => {
    deleteProject(project.id);
    toast({
      title: 'Project deleted',
      description: `${project.name} was removed from your workspace.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Pastel Hero Header */}
      <section className="rounded-2xl border border-[var(--ph-border)] bg-[linear-gradient(120deg,#EEE8FF_0%,#FFFFFF_55%,#E2F0FF_100%)] p-5 shadow-[var(--ph-shadow-sm)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)]">
              My Projects
            </h2>
            <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
              Manage deliverables, progress milestones, and linked GitHub repositories.
            </p>
          </div>
          <Button size="md" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>

        {/* Compact Summary Row */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-[var(--ph-border)] bg-white/85 px-4 py-2.5">
            <p className="text-[11px] font-medium text-[var(--ph-text-secondary)]">Total Projects</p>
            <p className="mt-0.5 font-display text-lg font-bold text-[var(--ph-text-primary)] tabular-nums">
              {summary.total}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--ph-border)] bg-white/85 px-4 py-2.5">
            <p className="text-[11px] font-medium text-[var(--ph-text-secondary)]">Active</p>
            <p className="mt-0.5 font-display text-lg font-bold text-[var(--ph-lavender-ink)] tabular-nums">
              {summary.active}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--ph-border)] bg-white/85 px-4 py-2.5">
            <p className="text-[11px] font-medium text-[var(--ph-text-secondary)]">Completed</p>
            <p className="mt-0.5 font-display text-lg font-bold text-[var(--ph-mint-ink)] tabular-nums">
              {summary.completed}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--ph-border)] bg-white/85 px-4 py-2.5">
            <p className="text-[11px] font-medium text-[var(--ph-text-secondary)]">Overdue</p>
            <p className="mt-0.5 font-display text-lg font-bold text-[var(--ph-peach-ink)] tabular-nums">
              {summary.overdue}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--ph-border)] bg-white p-3 shadow-[var(--ph-shadow-sm)] lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, category, or description..."
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-36">
            <Select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | ProjectStatus)}
            >
              <option value="all">All statuses</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
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

          <div className="w-36">
            <Select
              aria-label="Sort projects"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'targetDate' | 'name' | 'progress')}
            >
              <option value="targetDate">Sort: Deadline</option>
              <option value="progress">Sort: Progress</option>
              <option value="name">Sort: Name</option>
            </Select>
          </div>

          <div className="inline-flex rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid / List */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-5 w-5" />}
          title={projects.length === 0 ? 'No projects created yet' : 'No matching projects'}
          description={
            projects.length === 0
              ? 'Create your first project to track tasks, deadlines, notes, and repository links.'
              : 'Adjust your search query or filters to view your projects.'
          }
          action={
            projects.length === 0 ? (
              <Button size="sm" onClick={handleCreate}>
                <Plus className="h-3.5 w-3.5" />
                Create project
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
              >
                Reset filters
              </Button>
            )
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const progress = getProjectProgress(project.id);
            const statusMeta = PROJECT_STATUS_META[project.status];
            const priorityMeta = PRIORITY_META[project.priority];
            const visual = getProjectVisual(project.category, project.id);
            const Icon = visual.Icon;
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const doneCount = projectTasks.filter((t) => t.status === 'completed').length;

            return (
              <article
                key={project.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--ph-border)] bg-white shadow-[var(--ph-shadow-sm)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--ph-border-hover)] hover:shadow-[var(--ph-shadow-md)]"
              >
                {/* Top Pastel Accent Bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: visual.softBg }}>
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${progress}%`, backgroundColor: visual.barColor }}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: visual.softBg, color: visual.inkColor }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-[var(--ph-text-secondary)]">
                            {project.category} · {priorityMeta.label} priority
                          </p>
                          <Link
                            to={`/projects/${project.id}`}
                            className="mt-0.5 inline-flex items-center gap-1 font-display text-base font-semibold tracking-tight text-[var(--ph-text-primary)] group-hover:text-[var(--ph-accent-hover)] transition-colors"
                          >
                            <span className="truncate">{project.name}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            aria-label={`Actions for ${project.name}`}
                            className="rounded-lg p-1.5 text-[var(--ph-text-muted)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleEdit(project)}>
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Edit project</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => handleDelete(project)}
                            className="text-[var(--ph-error)]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete project</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                      {project.description || 'No project description provided.'}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 pt-4 border-t border-[var(--ph-border)]">
                    <div className="flex items-center justify-between">
                      <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                      <span className="font-mono text-xs font-semibold text-[var(--ph-text-primary)] tabular-nums">
                        {progress}% complete
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, backgroundColor: visual.barColor }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--ph-text-secondary)]">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-[var(--ph-text-muted)]" />
                        Due {formatShortDate(project.targetDate)}
                        <span className="text-[var(--ph-text-muted)]">
                          · {doneCount}/{projectTasks.length} tasks
                        </span>
                      </span>

                      {project.githubRepo && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--ph-bg-secondary)] px-2 py-0.5 font-mono text-[10px] text-[var(--ph-text-primary)]">
                          <GitBranch className="h-3 w-3 text-[var(--ph-accent)]" />
                          {project.githubRepo.split('/')[1] ?? project.githubRepo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Target Date</TableHead>
              <TableHead>Repository</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => {
              const progress = getProjectProgress(project.id);
              const statusMeta = PROJECT_STATUS_META[project.status];
              const priorityMeta = PRIORITY_META[project.priority];
              const visual = getProjectVisual(project.category, project.id);
              const Icon = visual.Icon;

              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: visual.softBg, color: visual.inkColor }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <Link
                          to={`/projects/${project.id}`}
                          className="font-semibold text-[var(--ph-text-primary)] hover:text-[var(--ph-accent-hover)] transition-colors"
                        >
                          {project.name}
                        </Link>
                        <p className="text-[11px] text-[var(--ph-text-muted)]">{project.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityMeta.variant}>{priorityMeta.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5 w-32">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${progress}%`, backgroundColor: visual.barColor }}
                        />
                      </div>
                      <span className="font-mono text-xs tabular-nums text-[var(--ph-text-secondary)]">
                        {progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[var(--ph-text-secondary)]">
                    {formatShortDate(project.targetDate)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[var(--ph-text-muted)]">
                    {project.githubRepo || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${project.name}`}
                        onClick={() => handleEdit(project)}
                        className="h-8 w-8"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${project.name}`}
                        onClick={() => handleDelete(project)}
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

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
      />
    </div>
  );
};
