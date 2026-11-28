import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
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
import { formatShortDate } from '../lib/date';
import { PRIORITY_META, PROJECT_STATUS_META } from '../lib/statusMeta';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { ProjectFormDialog } from '../components/projects/ProjectFormDialog';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
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
      variant: 'default',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--ph-text-primary)]">
            My Projects
          </h2>
          <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
            {projects.length} project{projects.length === 1 ? '' : 's'} with deadlines, task progress, and linked repositories.
          </p>
        </div>

        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Controls Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-card)] p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, category, or description..."
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

          <div className="inline-flex rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`rounded-sm p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[var(--ph-bg-card)] text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`rounded-sm p-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[var(--ph-bg-card)] text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const progress = getProjectProgress(project.id);
            const statusMeta = PROJECT_STATUS_META[project.status];
            const priorityMeta = PRIORITY_META[project.priority];
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const doneCount = projectTasks.filter((t) => t.status === 'completed').length;

            return (
              <Card key={project.id} className="flex flex-col justify-between p-5 hover:border-[var(--ph-border-hover)]">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                      <Badge variant={priorityMeta.variant}>{priorityMeta.label}</Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Actions for ${project.name}`}
                          className="rounded-md p-1 text-[var(--ph-text-muted)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
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

                  <Link
                    to={`/projects/${project.id}`}
                    className="mt-3 block text-base font-semibold tracking-tight text-[var(--ph-text-primary)] hover:text-[var(--ph-accent-text)] transition-colors"
                  >
                    {project.name}
                  </Link>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                    {project.description || 'No project description provided.'}
                  </p>
                </div>

                <div className="mt-5 space-y-3 pt-4 border-t border-[var(--ph-border)]">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-[var(--ph-text-secondary)]">
                        {doneCount}/{projectTasks.length} tasks completed
                      </span>
                      <span className="font-mono font-medium text-[var(--ph-text-primary)] tabular-nums">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                      <div
                        className="h-full rounded-full bg-[var(--ph-accent)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--ph-text-secondary)]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[var(--ph-text-muted)]" />
                      {formatShortDate(project.targetDate)}
                    </span>
                    {project.githubRepo ? (
                      <span className="inline-flex items-center gap-1 truncate font-mono text-[11px] text-[var(--ph-text-muted)]">
                        <GitBranch className="h-3 w-3 shrink-0" />
                        {project.githubRepo}
                      </span>
                    ) : (
                      <span className="text-[var(--ph-text-muted)]">{project.category}</span>
                    )}
                  </div>
                </div>
              </Card>
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

              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      to={`/projects/${project.id}`}
                      className="font-medium text-[var(--ph-text-primary)] hover:text-[var(--ph-accent-text)] transition-colors"
                    >
                      {project.name}
                    </Link>
                    <p className="text-[11px] text-[var(--ph-text-muted)]">{project.category}</p>
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
                          className="h-full rounded-full bg-[var(--ph-accent)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs tabular-nums text-[var(--ph-text-secondary)]">
                        {progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-[var(--ph-text-secondary)]">
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
