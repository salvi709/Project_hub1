import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, FolderKanban, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

interface KpiStripProps {
  activeProjects: number;
  totalProjects: number;
  dueTodayCount: number;
  completedTasks: number;
  totalTasks: number;
  overallProgress: number;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  activeProjects,
  totalProjects,
  dueTodayCount,
  completedTasks,
  totalTasks,
  overallProgress,
}) => {
  return (
    <section aria-label="Workspace summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link to="/projects" className="block focus-visible:outline-none">
        <Card className="p-4 hover:border-[var(--ph-border-hover)]">
          <div className="flex items-center justify-between text-xs text-[var(--ph-text-secondary)]">
            <span>Active Projects</span>
            <FolderKanban className="h-4 w-4 text-[var(--ph-accent-text)]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[var(--ph-text-primary)] tabular-nums">
              {activeProjects}
            </span>
            <span className="text-xs text-[var(--ph-text-muted)]">of {totalProjects} total</span>
          </div>
        </Card>
      </Link>

      <Link to="/tasks" className="block focus-visible:outline-none">
        <Card className="p-4 hover:border-[var(--ph-border-hover)]">
          <div className="flex items-center justify-between text-xs text-[var(--ph-text-secondary)]">
            <span>Due Today</span>
            <Clock className="h-4 w-4 text-[var(--ph-warning)]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[var(--ph-text-primary)] tabular-nums">
              {dueTodayCount}
            </span>
            <span className="text-xs text-[var(--ph-text-muted)]">
              {dueTodayCount === 1 ? 'task scheduled' : 'tasks scheduled'}
            </span>
          </div>
        </Card>
      </Link>

      <Link to="/tasks" className="block focus-visible:outline-none">
        <Card className="p-4 hover:border-[var(--ph-border-hover)]">
          <div className="flex items-center justify-between text-xs text-[var(--ph-text-secondary)]">
            <span>Completed Tasks</span>
            <CheckCircle2 className="h-4 w-4 text-[var(--ph-success)]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[var(--ph-text-primary)] tabular-nums">
              {completedTasks}
            </span>
            <span className="text-xs text-[var(--ph-text-muted)]">of {totalTasks} tasks</span>
          </div>
        </Card>
      </Link>

      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-[var(--ph-text-secondary)]">
          <span>Overall Progress</span>
          <TrendingUp className="h-4 w-4 text-[var(--ph-accent-text)]" />
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-2xl font-semibold tracking-tight text-[var(--ph-text-primary)] tabular-nums">
            {overallProgress}%
          </span>
          <span className="text-xs text-[var(--ph-text-muted)]">completion</span>
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
          <div
            className="h-full rounded-full bg-[var(--ph-accent)] transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </Card>
    </section>
  );
};
