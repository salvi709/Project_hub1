import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FolderKanban, GitBranch } from 'lucide-react';
import { formatShortDate } from '../../lib/date';
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

  const displayedProjects = [...projects]
    .sort((a, b) => (a.status === 'active' && b.status !== 'active' ? -1 : 0))
    .slice(0, 4);

  return (
    <Card>
      <CardHeader className="border-b border-[var(--ph-border)] pb-4">
        <div>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Progress and target deadlines across your current work</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/projects">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="pt-4">
        {displayedProjects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="h-5 w-5" />}
            title="No projects yet"
            description="Create a project to organize tasks, milestones, notes, and repository links."
            action={
              <Button size="sm" onClick={onNewProject}>
                Create project
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-[var(--ph-border)]">
            {displayedProjects.map((project) => {
              const progress = getProjectProgress(project.id);
              const statusMeta = PROJECT_STATUS_META[project.status];
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const doneTasks = projectTasks.filter((t) => t.status === 'completed').length;

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group flex flex-col gap-2.5 py-3.5 first:pt-0 last:pb-0 transition-colors sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-medium text-[var(--ph-text-primary)] group-hover:text-[var(--ph-accent-text)] transition-colors">
                        {project.name}
                      </span>
                      <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                      <span className="text-[11px] text-[var(--ph-text-muted)]">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--ph-text-secondary)]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[var(--ph-text-muted)]" />
                        Due {formatShortDate(project.targetDate)}
                      </span>
                      <span>
                        {doneTasks}/{projectTasks.length} tasks
                      </span>
                      {project.githubRepo && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--ph-text-muted)]">
                          <GitBranch className="h-3 w-3" />
                          {project.githubRepo}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:w-40 shrink-0">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                      <div
                        className="h-full rounded-full bg-[var(--ph-accent)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="w-9 text-right font-mono text-xs text-[var(--ph-text-secondary)] tabular-nums">
                      {progress}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
