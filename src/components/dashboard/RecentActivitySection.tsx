import React from 'react';
import { CheckSquare, FileText, FolderKanban, GitCommitHorizontal } from 'lucide-react';
import type { SampleActivityItem } from '../../types/domain';
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

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ items }) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription className="mt-0.5">
            Sample workspace events across projects and notes
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-[var(--ph-border)]">
        {items.map((item) => {
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
        })}
      </CardContent>
    </Card>
  );
};
