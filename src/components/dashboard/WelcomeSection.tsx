import React from 'react';
import { FolderPlus, Plus } from 'lucide-react';
import { formatTodayBanner, getGreeting } from '../../lib/date';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';

interface WelcomeSectionProps {
  activeProjectCount: number;
  dueTodayCount: number;
  onNewProject: () => void;
  onNewTask: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  activeProjectCount,
  dueTodayCount,
  onNewProject,
  onNewTask,
}) => {
  const { displayName, isPreviewMode } = useAuth();
  const firstName =
    displayName === 'Workspace Preview'
      ? 'there'
      : displayName.split(' ')[0] || 'there';

  return (
    <section className="flex flex-col gap-4 border-b border-[var(--ph-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium text-[var(--ph-text-secondary)]">
          {formatTodayBanner()}
          {isPreviewMode && ' · Local Preview Workspace'}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ph-text-primary)] sm:text-[26px]">
          {getGreeting()}, {firstName}
        </h2>
        <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
          {dueTodayCount > 0
            ? `${dueTodayCount} task${dueTodayCount === 1 ? '' : 's'} due today across ${activeProjectCount} active project${activeProjectCount === 1 ? '' : 's'}.`
            : `No tasks due today · ${activeProjectCount} active project${activeProjectCount === 1 ? '' : 's'} in motion.`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onNewProject}>
          <FolderPlus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </Button>
        <Button variant="primary" size="sm" onClick={onNewTask}>
          <Plus className="h-3.5 w-3.5" />
          <span>Add Task</span>
        </Button>
      </div>
    </section>
  );
};
