import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckSquare,
  Edit3,
  ExternalLink,
  FileText,
  FolderKanban,
  GitBranch,
  GitCommit,
  Plus,
  Trash2,
} from 'lucide-react';
import { formatFullDate, formatShortDate } from '../lib/date';
import { PRIORITY_META, PROJECT_STATUS_META, TASK_STATUS_META } from '../lib/statusMeta';
import { SAMPLE_REPOS } from '../features/github/sampleRepos';
import { useAuth } from '../features/auth/AuthContext';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { ProjectFormDialog } from '../components/projects/ProjectFormDialog';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useToast } from '../components/ui/ToastProvider';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const {
    getProjectById,
    getProjectProgress,
    tasks,
    notes,
    deleteProject,
    moveTaskStatus,
    deleteTask,
  } = useWorkspace();
  const { toast } = useToast();

  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const project = getProjectById(projectId ?? null);

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === projectId),
    [tasks, projectId]
  );

  const projectNotes = useMemo(
    () => notes.filter((n) => n.projectId === projectId),
    [notes, projectId]
  );

  const resourceLinks = useMemo(
    () =>
      projectNotes.flatMap((n) =>
        n.resourceLinks.map((link) => ({ ...link, noteTitle: n.title }))
      ),
    [projectNotes]
  );

  const linkedRepo = useMemo(
    () =>
      project?.githubRepo
        ? SAMPLE_REPOS.find((r) => r.fullName === project.githubRepo)
        : undefined,
    [project]
  );

  const isGitHubConnected =
    user?.app_metadata?.provider === 'github' || Boolean(profile?.github_username);

  if (!project) {
    return (
      <EmptyState
        icon={<FolderKanban className="h-5 w-5" />}
        title="Project not found"
        description="This project may have been deleted or does not exist in your current workspace."
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/projects">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to My Projects
            </Link>
          </Button>
        }
      />
    );
  }

  const progress = getProjectProgress(project.id);
  const statusMeta = PROJECT_STATUS_META[project.status];
  const priorityMeta = PRIORITY_META[project.priority];

  const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = projectTasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = projectTasks.filter((t) => t.status === 'todo').length;

  const handleDeleteProject = () => {
    deleteProject(project.id);
    toast({ title: 'Project deleted', description: project.name });
    navigate('/projects');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--ph-border)] pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
            <Badge variant={priorityMeta.variant}>{priorityMeta.label} priority</Badge>
            <span className="text-xs text-[var(--ph-text-muted)]">{project.category}</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-[var(--ph-text-primary)]">
            {project.name}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--ph-text-secondary)]">
            {project.description || 'No description added for this project yet.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[var(--ph-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[var(--ph-text-muted)]" />
              Target deadline: {formatFullDate(project.targetDate)}
            </span>
            {project.githubRepo && (
              <span className="inline-flex items-center gap-1.5 font-mono">
                <GitBranch className="h-3.5 w-3.5 text-[var(--ph-text-muted)]" />
                {project.githubRepo}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setEditProjectOpen(true)}>
            <Edit3 className="h-3.5 w-3.5" />
            Edit Project
          </Button>
          <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete project"
            onClick={handleDeleteProject}
            className="text-[var(--ph-text-muted)] hover:text-[var(--ph-error)]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Strip */}
      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--ph-text-secondary)]">
              Project Completion
            </p>
            <p className="mt-0.5 text-sm text-[var(--ph-text-primary)]">
              {completedTasks} completed · {inProgressTasks} in progress · {todoTasks} to do
            </p>
          </div>
          <span className="font-mono text-2xl font-semibold text-[var(--ph-text-primary)] tabular-nums">
            {progress}%
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
          <div
            className="h-full rounded-full bg-[var(--ph-accent)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tasks">
        <TabsList className="flex-wrap">
          <TabsTrigger value="tasks">Tasks ({projectTasks.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes &amp; Resources ({projectNotes.length})</TabsTrigger>
          <TabsTrigger value="github">GitHub Activity</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          {projectTasks.length === 0 ? (
            <EmptyState
              icon={<CheckSquare className="h-5 w-5" />}
              title="No tasks in this project"
              description="Break this project into actionable tasks with deadlines and subtasks."
              action={
                <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Add first task
                </Button>
              }
            />
          ) : (
            <Card>
              <div className="divide-y divide-[var(--ph-border)]">
                {projectTasks.map((task) => {
                  const tStatus = TASK_STATUS_META[task.status];
                  const tPriority = PRIORITY_META[task.priority];
                  const isDone = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            moveTaskStatus(task.id, isDone ? 'todo' : 'completed')
                          }
                          aria-label={`Toggle completion for ${task.title}`}
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
                            isDone
                              ? 'border-[var(--ph-accent)] bg-[var(--ph-accent)] text-[var(--ph-accent-foreground)]'
                              : 'border-[var(--ph-border-hover)] hover:border-[var(--ph-accent)]'
                          }`}
                        >
                          {isDone && <Check className="h-3 w-3" />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              isDone
                                ? 'line-through text-[var(--ph-text-muted)]'
                                : 'text-[var(--ph-text-primary)]'
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="mt-0.5 text-xs text-[var(--ph-text-secondary)]">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={tStatus.variant}>{tStatus.label}</Badge>
                        <Badge variant={tPriority.variant}>{tPriority.label}</Badge>
                        <span className="font-mono text-xs text-[var(--ph-text-secondary)]">
                          {formatShortDate(task.dueDate)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${task.title}`}
                          onClick={() => deleteTask(task.id)}
                          className="h-7 w-7 text-[var(--ph-text-muted)] hover:text-[var(--ph-error)]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              {projectNotes.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-5 w-5" />}
                  title="No project notes yet"
                  description="Create notes linked to this project in Notes & Resources."
                  action={
                    <Button asChild variant="outline" size="sm">
                      <Link to="/notes">Go to Notes &amp; Resources</Link>
                    </Button>
                  }
                />
              ) : (
                projectNotes.map((note) => (
                  <Card key={note.id} className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-[var(--ph-text-primary)]">
                        {note.title}
                      </h4>
                      <span className="text-[11px] text-[var(--ph-text-muted)]">
                        Updated {formatShortDate(note.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                      {note.content}
                    </p>
                  </Card>
                ))
              )}
            </div>

            <div className="lg:col-span-5">
              <Card>
                <CardHeader className="border-b border-[var(--ph-border)] pb-3">
                  <div>
                    <CardTitle>Linked Resources</CardTitle>
                    <CardDescription>URLs &amp; references attached to project notes</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  {resourceLinks.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[var(--ph-text-muted)]">
                      No resource links attached yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {resourceLinks.map((link, i) => (
                        <a
                          key={`${link.url}-${i}`}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-2 rounded-md border border-[var(--ph-border)] px-3 py-2 text-xs hover:border-[var(--ph-border-hover)] hover:bg-[var(--ph-bg-hover)] transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-[var(--ph-text-primary)]">
                              {link.label}
                            </p>
                            <p className="truncate text-[11px] text-[var(--ph-text-muted)]">
                              From {link.noteTitle}
                            </p>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--ph-text-muted)]" />
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="github">
          <Card>
            <CardHeader className="border-b border-[var(--ph-border)] pb-4">
              <div>
                <CardTitle>Repository Integration</CardTitle>
                <CardDescription>
                  {isGitHubConnected
                    ? 'Connected via GitHub OAuth'
                    : 'GitHub OAuth is not connected — showing repository metadata preview only'}
                </CardDescription>
              </div>
              <Badge variant={isGitHubConnected ? 'success' : 'neutral'}>
                {isGitHubConnected ? 'Connected' : 'Not connected'}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              {!project.githubRepo ? (
                <EmptyState
                  icon={<GitBranch className="h-5 w-5" />}
                  title="No repository linked"
                  description="Edit this project or visit the GitHub page to link a repository."
                  action={
                    <Button variant="outline" size="sm" onClick={() => setEditProjectOpen(true)}>
                      Link repository
                    </Button>
                  }
                />
              ) : linkedRepo ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-3.5">
                    <div>
                      <p className="font-mono text-sm font-semibold text-[var(--ph-text-primary)]">
                        {linkedRepo.fullName}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--ph-text-secondary)]">
                        {linkedRepo.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="accent">{linkedRepo.branch}</Badge>
                      <Badge variant="neutral">{linkedRepo.openIssues} issues</Badge>
                      <Badge variant="info">{linkedRepo.openPrs} PRs</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[var(--ph-text-secondary)]">
                      Sample Commit Preview
                    </p>
                    {linkedRepo.recentCommits.map((commit) => (
                      <div
                        key={commit.sha}
                        className="flex items-center justify-between gap-3 rounded-md border border-[var(--ph-border)] px-3 py-2 text-xs"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <GitCommit className="h-3.5 w-3.5 shrink-0 text-[var(--ph-accent-text)]" />
                          <span className="font-mono text-[11px] text-[var(--ph-text-muted)]">
                            {commit.sha}
                          </span>
                          <span className="truncate text-[var(--ph-text-primary)]">
                            {commit.message}
                          </span>
                        </div>
                        <span className="shrink-0 text-[11px] text-[var(--ph-text-muted)]">
                          {commit.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-[var(--ph-border)] p-4 text-xs text-[var(--ph-text-secondary)]">
                  Linked repository <span className="font-mono font-medium">{project.githubRepo}</span>.
                  Connect GitHub OAuth in Settings to fetch live commits and pull requests.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-5">
            <h4 className="text-sm font-semibold text-[var(--ph-text-primary)]">
              Milestone Timeline
            </h4>
            <div className="mt-4 space-y-4 border-l border-[var(--ph-border)] pl-4">
              <div>
                <p className="text-xs font-medium text-[var(--ph-text-primary)]">Project Created</p>
                <p className="text-[11px] text-[var(--ph-text-muted)]">
                  {formatFullDate(project.createdAt)}
                </p>
              </div>
              {projectTasks
                .slice()
                .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                .map((task) => (
                  <div key={task.id} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-[var(--ph-text-primary)]">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-[var(--ph-text-muted)]">
                        {TASK_STATUS_META[task.status].label}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--ph-text-secondary)]">
                      {formatShortDate(task.dueDate)}
                    </span>
                  </div>
                ))}
              <div>
                <p className="text-xs font-semibold text-[var(--ph-accent-text)]">
                  Target Completion Date
                </p>
                <p className="text-[11px] text-[var(--ph-text-secondary)]">
                  {formatFullDate(project.targetDate)}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <ProjectFormDialog
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        project={project}
      />
      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        defaultProjectId={project.id}
      />
    </div>
  );
};
