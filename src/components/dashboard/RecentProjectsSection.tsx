import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch } from 'lucide-react';
import type { SampleProject } from '../../types/domain';
import { formatPercentage, formatShortDate } from '../../utils/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface RecentProjectsSectionProps {
  projects: SampleProject[];
}

const STATUS_LABEL: Record<SampleProject['status'], { text: string; colorClass: string }> = {
  active: { text: 'Active', colorClass: 'text-emerald-400' },
  planning: { text: 'Planning', colorClass: 'text-[var(--ph-text-secondary)]' },
  on_hold: { text: 'On Hold', colorClass: 'text-amber-400' },
  completed: { text: 'Completed', colorClass: 'text-emerald-300' },
  archived: { text: 'Archived', colorClass: 'text-[var(--ph-text-muted)]' },
};

export const RecentProjectsSection: React.FC<RecentProjectsSectionProps> = ({ projects }) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription className="mt-0.5">
            Sample initiatives and completion cadence
          </CardDescription>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ph-accent)] hover:underline whitespace-nowrap shrink-0"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="divide-y divide-[var(--ph-border)]">
        {projects.slice(0, 4).map((project) => {
          const pct = formatPercentage(project.tasksCompleted, project.tasksTotal);
          const status = STATUS_LABEL[project.status];

          return (
            <div key={project.id} className="py-3.5 first:pt-1 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <Link
                      to="/projects"
                      className="font-display text-sm font-medium text-[var(--ph-text-primary)] hover:text-[var(--ph-accent)] transition-colors truncate"
                    >
                      {project.name}
                    </Link>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--ph-text-muted)]">
                    <span>{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className={status.colorClass}>{status.text}</span>
                    <span aria-hidden="true">·</span>
                    <span>Due {formatShortDate(project.targetDate)}</span>
                    {project.githubRepo && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                          <GitBranch className="h-3 w-3" />
                          {project.githubRepo}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-medium text-[var(--ph-text-primary)] tabular-nums">
                    {pct}%
                  </span>
                  <div className="mt-0.5 font-mono text-[11px] text-[var(--ph-text-muted)] tabular-nums">
                    {project.tasksCompleted}/{project.tasksTotal} tasks
                  </div>
                </div>
              </div>

              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-elevated)]">
                <div
                  className="h-full rounded-full bg-[var(--ph-accent)] transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
