import React from 'react';
import { CheckCircle2, Clock, FolderGit2, Layers } from 'lucide-react';
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
  const items = [
    {
      label: 'Total Projects',
      value: totalProjects,
      detail: 'Sample workspace portfolio',
      icon: Layers,
      accent: false,
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      detail: 'Currently in execution',
      icon: FolderGit2,
      accent: true,
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      detail: 'Marked done in preview',
      icon: CheckCircle2,
      accent: true,
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      detail: 'To do, in progress, or review',
      icon: Clock,
      accent: false,
    },
  ];

  return (
    <section aria-label="Workspace Summary Metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="p-5 hover:border-[var(--ph-border-hover)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[var(--ph-text-secondary)]">
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
        );
      })}
    </section>
  );
};
