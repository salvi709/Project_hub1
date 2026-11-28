import React, { useMemo, useState } from 'react';
import { CheckSquare, FileText, FolderKanban, History } from 'lucide-react';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

export const RecentActivitySection: React.FC = () => {
  const { activity } = useWorkspace();
  const [filter, setFilter] = useState<'all' | 'project' | 'task' | 'note'>('all');

  const items = useMemo(() => {
    const base =
      filter === 'all' ? activity : activity.filter((item) => item.category === filter);
    return base.slice(0, 5);
  }, [activity, filter]);

  const getVisual = (category: 'project' | 'task' | 'note') => {
    switch (category) {
      case 'project':
        return {
          icon: <FolderKanban className="h-3.5 w-3.5" />,
          bg: '#EEE8FF',
          ink: '#6545C4',
        };
      case 'task':
        return {
          icon: <CheckSquare className="h-3.5 w-3.5" />,
          bg: '#DDF5E9',
          ink: '#277554',
        };
      case 'note':
        return {
          icon: <FileText className="h-3.5 w-3.5" />,
          bg: '#FFE8DC',
          ink: '#B35A30',
        };
    }
  };

  return (
    <Card>
      <CardHeader className="flex-col gap-3 border-b border-[var(--ph-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Updates across your projects, tasks, and notes</CardDescription>
        </div>

        <div className="inline-flex rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-0.5">
          {(['all', 'task', 'project', 'note'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-white text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {items.length === 0 ? (
          <EmptyState
            icon={<History className="h-5 w-5" />}
            title="No activity recorded"
            description="Creating or updating projects, tasks, and notes will appear here."
          />
        ) : (
          <div className="space-y-3.5">
            {items.map((item) => {
              const v = getVisual(item.category);
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: v.bg, color: v.ink }}
                  >
                    {v.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                      <span className="font-semibold text-[var(--ph-text-primary)]">
                        {item.actor}
                      </span>{' '}
                      {item.action}{' '}
                      <span className="font-semibold text-[var(--ph-text-primary)]">
                        {item.target}
                      </span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--ph-text-muted)]">
                      {item.context} · {item.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
