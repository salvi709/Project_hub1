import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, FolderGit2, Layers } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';
import { Card } from '../ui/Card';

interface KpiStripProps {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  totalProjects,
  activeProjects,
  completedTasks,
  pendingTasks,
}) => {
  const totalTasks = completedTasks + pendingTasks;
  const completionPct = formatPercentage(completedTasks, totalTasks);

  const items = [
    {
      label: 'Total Projects',
      value: totalProjects,
      detail: 'Sample workspace portfolio',
      to: '/projects',
      icon: Layers,
      accent: false,
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      detail: `${formatPercentage(activeProjects, totalProjects)}% currently in execution`,
      to: '/projects',
      icon: FolderGit2,
      accent: true,
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      detail: `${completionPct}% of sample queue done`,
      to: '/tasks',
      icon: CheckCircle2,
      accent: true,
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      detail: 'To do, in progress, or review',
      to: '/tasks',
      icon: Clock,
      accent: false,
    },
  ];

  return (
    <section
      aria-label="Workspace Summary Metrics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.label} to={item.to} className="group block focus-visible:outline-none">
            <Card className="p-5 transition-colors duration-150 group-hover:border-[var(--ph-border-hover)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--ph-accent)]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[var(--ph-text-secondary)] group-hover:text-[var(--ph-text-primary)] transition-colors">
                  {item.label}
                </span>
                <Icon
                  className={
                    item.accent
                      ? 'h-4 w-4 text-[var(--ph-accent)]'
                      : 'h-4 w-4 text-[var(--ph-text-muted)]'
                  }
                />
              </div>
              <div className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--ph-text-primary)] tabular-nums">
                {item.value}
              </div>
              <p className="mt-1.5 text-xs text-[var(--ph-text-muted)]">{item.detail}</p>
            </Card>
          </Link>
        );
      })}
    </section>
  );
};
