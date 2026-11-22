import React, { useMemo, useState } from 'react';
import { FolderKanban, GitBranch, Info, Plus, Search } from 'lucide-react';
import { SAMPLE_PROJECTS } from '../features/projects/sampleProjects';
import type { ProjectStatus } from '../types/database';
import type { SampleProject } from '../types/domain';
import { cn } from '../lib/utils';
import { formatPercentage, formatShortDate } from '../utils/formatters';
import { ProjectPreviewDialog } from '../components/projects/ProjectPreviewDialog';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../components/ui/Dialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';

type FilterValue = 'all' | ProjectStatus;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'active', label: 'Active' },
  { value: 'planning', label: 'Planning' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

const STATUS_META: Record<ProjectStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'text-emerald-600 dark:text-emerald-400' },
  planning: { label: 'Planning', className: 'text-[var(--ph-text-secondary)]' },
  on_hold: { label: 'On Hold', className: 'text-amber-600 dark:text-amber-400' },
  completed: { label: 'Completed', className: 'text-emerald-700 dark:text-emerald-300' },
  archived: { label: 'Archived', className: 'text-[var(--ph-text-muted)]' },
};

export const ProjectsPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');
  const [phaseNoticeOpen, setPhaseNoticeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SampleProject | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SAMPLE_PROJECTS.filter((project) => {
      const matchesFilter = filter === 'all' || project.status === filter;
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-4 border-b border-[var(--ph-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--ph-text-primary)]">
            Projects Directory
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--ph-text-secondary)]">
            <Info className="h-3.5 w-3.5 text-[var(--ph-accent)] shrink-0" />
            <span>
              Sample preview records · Click any card to inspect linked tasks (Supabase CRUD in Phase 2)
            </span>
          </p>
        </div>

        <Button size="sm" onClick={() => setPhaseNoticeOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] p-1">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                filter === item.value
                  ? 'bg-[var(--ph-bg-elevated)] text-[var(--ph-text-primary)]'
                  : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter sample projects..."
            className="pl-8 text-xs"
          />
        </div>
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-5 w-5" />}
          title="No matching sample projects"
          description="Try clearing the search query or switching to a different status filter."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilter('all');
                setSearch('');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => {
            const pct = formatPercentage(project.tasksCompleted, project.tasksTotal);
            const status = STATUS_META[project.status];
            return (
              <Card
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                className="flex flex-col justify-between p-5 cursor-pointer hover:border-[var(--ph-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base font-semibold text-[var(--ph-text-primary)]">
                      {project.name}
                    </h3>
                    <span className={cn('text-xs font-medium shrink-0', status.className)}>
                      {status.label}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-5 space-y-3 border-t border-[var(--ph-border)] pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--ph-text-muted)]">Completion</span>
                    <span className="font-mono font-medium text-[var(--ph-text-primary)] tabular-nums">
                      {project.tasksCompleted}/{project.tasksTotal} · {pct}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-elevated)]">
                    <div
                      className="h-full rounded-full bg-[var(--ph-accent)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ph-text-muted)]">
                    <span>
                      {project.category} · Due {formatShortDate(project.targetDate)}
                    </span>
                    {project.githubRepo && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                        <GitBranch className="h-3 w-3" />
                        {project.githubRepo}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ProjectPreviewDialog
        project={selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      />

      <Dialog open={phaseNoticeOpen} onOpenChange={setPhaseNoticeOpen}>
        <DialogContent>
          <DialogTitle>Project Creation Planned for Phase 2</DialogTitle>
          <DialogDescription>
            In Phase 1, the <code className="font-mono text-xs">projects</code> table and RLS
            policies have been prepared in <code className="font-mono text-xs">supabase/migrations/</code>.
            Live project creation and database persistence will be wired in Phase 2 once Supabase
            credentials are connected.
          </DialogDescription>
          <div className="mt-5 flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setPhaseNoticeOpen(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
