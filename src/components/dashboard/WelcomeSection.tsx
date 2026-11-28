import React from 'react';
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  FolderPlus,
  Layers,
  Plus,
} from 'lucide-react';
import { formatTodayBanner, getGreeting } from '../../lib/date';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';

interface WelcomeSectionProps {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  dueTodayCount: number;
  onNewProject: () => void;
  onNewTask: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  totalProjects,
  activeProjects,
  completedTasks,
  pendingTasks,
  dueTodayCount,
  onNewProject,
  onNewTask,
}) => {
  const { displayName, isPreviewMode } = useAuth();
  const firstName =
    displayName === 'Workspace Preview'
      ? 'there'
      : displayName.split(' ')[0] || 'there';

  const completionPct =
    completedTasks + pendingTasks === 0
      ? 0
      : Math.round((completedTasks / (completedTasks + pendingTasks)) * 100);

  const overviewItems = [
    {
      label: 'Total Projects',
      value: totalProjects,
      sub: 'In workspace',
      icon: Layers,
      bg: '#EEE8FF',
      ink: '#6545C4',
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      sub: 'Currently running',
      icon: FolderKanban,
      bg: '#E2F0FF',
      ink: '#2A67A8',
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      sub: `${completionPct}% done`,
      icon: CheckCircle2,
      bg: '#DDF5E9',
      ink: '#277554',
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      sub: dueTodayCount > 0 ? `${dueTodayCount} due today` : 'All caught up',
      icon: Clock,
      bg: '#FFE8DC',
      ink: '#B35A30',
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--ph-border)] bg-[linear-gradient(125deg,#EEE8FF_0%,#FFFFFF_52%,#FFE8DC_100%)] p-5 shadow-[var(--ph-shadow-sm)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--ph-text-secondary)]">
            {formatTodayBanner()}
            {isPreviewMode && ' · Local Preview Workspace'}
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)] sm:text-[28px]">
            {getGreeting()}, {firstName}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--ph-text-secondary)]">
            {dueTodayCount > 0
              ? `You have ${dueTodayCount} priority task${dueTodayCount === 1 ? '' : 's'} scheduled today across ${activeProjects} active project${activeProjects === 1 ? '' : 's'}.`
              : `Your schedule is clear for today · ${activeProjects} active project${activeProjects === 1 ? '' : 's'} progressing smoothly.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={onNewProject}
            className="bg-white/90 hover:bg-white"
          >
            <FolderPlus className="h-4 w-4 text-[var(--ph-accent)]" />
            <span>Quick Create Project</span>
          </Button>
          <Button variant="primary" size="md" onClick={onNewTask}>
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Compact Balanced Overview Strip */}
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-[var(--ph-border)] bg-white/85 p-3 backdrop-blur-sm sm:grid-cols-4 sm:divide-x sm:divide-[var(--ph-border)] sm:gap-0 sm:p-0">
        {overviewItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 sm:rounded-none sm:px-4 sm:py-3.5"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: item.bg, color: item.ink }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[var(--ph-text-secondary)] truncate">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-lg font-bold text-[var(--ph-text-primary)] tabular-nums">
                    {item.value}
                  </span>
                  <span className="hidden xl:inline truncate text-[11px] text-[var(--ph-text-muted)]">
                    {item.sub}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
