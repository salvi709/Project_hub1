import React, { useMemo, useState } from 'react';
import { CheckSquare, FileText, FolderKanban, GitCommitHorizontal } from 'lucide-react';
import type { SampleActivityItem } from '../../types/domain';
import { cn } from '../../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface RecentActivitySectionProps {
  items: SampleActivityItem[];
}

const CATEGORY_ICON = {
  project: FolderKanban,
  task: CheckSquare,
  milestone: GitCommitHorizontal,
  note: FileText,
};

type ActivityFilter = 'all' | SampleActivityItem['category'];

const FILTERS: { value: ActivityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'project', label: 'Projects' },
  { value: 'task', label: 'Tasks' },
  { value: 'note', label: 'Notes' },
];

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ items }) => {
  const [filter, setFilter] = useState<ActivityFilter>('all');

  const filtered = useMemo(
    () => items.filter((item) => filter === 'all' || item.category === filter),
    [items, filter]
  );

  return (
    <Card>
      <CardHeader className="flex-col gap-3 sm:flex-row sm:items-start">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription className="mt-0.5">
            Sample workspace events across projects and notes
          </CardDescription>
        </div>

        <div className="inline-flex items-center gap-0.5 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-primary)] p-0.5 shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                filter === f.value
                  ? 'bg-[var(--ph-bg-elevated)] text-[var(--ph-text-primary)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-[var(--ph-border)]">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-[var(--ph-text-muted)]">
            No sample activity recorded in this category.
          </p>
        ) : (
          filtered.map((item) => {
            const Icon = CATEGORY_ICON[item.category];
            return (
              <div key={item.id} className="flex items-start gap-3 py-3 first:pt-1 last:pb-0">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-elevated)] text-[var(--ph-text-secondary)]">
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                    <span className="font-medium text-[var(--ph-text-primary)]">{item.actor}</span>{' '}
                    {item.action}{' '}
                    <span className="font-medium text-[var(--ph-text-primary)]">{item.target}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--ph-text-muted)]">
                    <span>{item.context}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{item.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
