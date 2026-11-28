import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, FolderKanban, GitBranch, Plus } from 'lucide-react';
import { formatShortDate } from '../../lib/date';
import { getProjectVisual } from '../../lib/projectVisuals';
import { PROJECT_STATUS_META } from '../../lib/statusMeta';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

interface RecentProjectsSectionProps {
  onNewProject: () => void;
}

export const RecentProjectsSection: React.FC<RecentProjectsSectionProps> = ({
  onNewProject,
}) => {
  const { projects, tasks, getProjectProgress } = useWorkspace();

  const activeProjects = projects
    .filter((p) => p.status === 'active' || p.status === 'planning')
    .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
    .slice(0, 4);

  const recentlyUpdated = [...projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>Active Projects &amp; Progress</CardTitle>
            <CardDescription>
              Track completion milestones across your active work
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/projects">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="pt-4">
          {projects.length === 0 ? (
            <EmptyState
              icon={<FolderKanban className="h-5 w-5" />}
              title="No projects created yet"
              description="Start a project to organize tasks, milestones, notes, and repositories."
              action={
                <Button size="sm" onClick={onNewProject}>
                  <Plus className="h-3.5 w-3.5" />
                  Create project
                </Button>
              }
            />
          ) : activeProjects.length === 0 ? (
            <EmptyState
              icon={<FolderKanban className="h-5 w-5" />}
              title="No active projects right now"
              description="All current projects are completed or on hold. Start a new one anytime."
              action={
                <Button size="sm" onClick={onNewProject}>
                  <Plus className="h-3.5 w-3.5" />
                  New project
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activeProjects.map((project) => {
                const progress = getProjectProgress(project.id);
                const statusMeta = PROJECT_STATUS_META[project.status];
                const visual = getProjectVisual(project.category, project.id);
                const Icon = visual.Icon;
                const projectTasks = tasks.filter((t) => t.projectId === project.id);
                const doneTasks = projectTasks.filter((t) => t.status === 'completed').length;

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="group flex flex-col justify-between rounded-xl border border-[var(--ph-border)] bg-[var(--ph-bg-card)] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--ph-border-hover)] hover:shadow-[var(--ph-shadow-md)]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: visual.softBg, color: visual.inkColor }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                      </div>

                      <h4 className="mt-3 truncate font-display text-sm font-semibold text-[var(--ph-text-primary)] group-hover:text-[var(--ph-accent-hover)] transition-colors">
                        {project.name}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                        {project.description || project.category}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2.5 pt-3 border-t border-[var(--ph-border)]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--ph-text-secondary)]">
                          {doneTasks}/{projectTasks.length} tasks
                        </span>
                        <span className="font-mono font-semibold text-[var(--ph-text-primary)] tabular-nums">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%`, backgroundColor: visual.barColor }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--ph-text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatShortDate(project.targetDate)}
                        </span>
                        {project.githubRepo && (
                          <span className="inline-flex items-center gap-1 truncate font-mono text-[10px]">
                            <GitBranch className="h-3 w-3 shrink-0" />
                            {project.githubRepo.split('/')[1] ?? project.githubRepo}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </div>

      {/* Recently Updated Footer Strip */}
      {recentlyUpdated.length > 0 && (
        <div className="border-t border-[var(--ph-border)] bg-[#FAF8FF] px-5 py-3.5 rounded-b-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ph-text-secondary)]">
              <Clock className="h-3.5 w-3.5 text-[var(--ph-accent)]" />
              Recently Updated
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentlyUpdated.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ph-border)] bg-white px-2.5 py-1 text-xs text-[var(--ph-text-primary)] transition-colors hover:border-[var(--ph-border-hover)] hover:text-[var(--ph-accent-hover)]"
              >
                <span className="font-medium truncate max-w-[150px]">{p.name}</span>
                <span className="text-[10px] text-[var(--ph-text-muted)]">
                  · {formatShortDate(p.updatedAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
