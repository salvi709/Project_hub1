import React, { useMemo, useState } from 'react';
import { FileText, Info, Search } from 'lucide-react';
import { SAMPLE_NOTES } from '../features/tasks/sampleTasks';
import type { SampleNote } from '../types/domain';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../components/ui/Dialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';

export const NotesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [contextFilter, setContextFilter] = useState<string>('all');
  const [selectedNote, setSelectedNote] = useState<SampleNote | null>(null);

  const contexts = useMemo(
    () => ['all', ...Array.from(new Set(SAMPLE_NOTES.map((n) => n.projectContext)))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SAMPLE_NOTES.filter((note) => {
      const matchesContext = contextFilter === 'all' || note.projectContext === contextFilter;
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.projectContext.toLowerCase().includes(q) ||
        note.excerpt.toLowerCase().includes(q);
      return matchesContext && matchesSearch;
    });
  }, [search, contextFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[var(--ph-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--ph-text-primary)]">
            Notes &amp; Resources
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--ph-text-secondary)]">
            <Info className="h-3.5 w-3.5 text-[var(--ph-accent)] shrink-0" />
            <span>Phase 1 architecture notes preview · Rich markdown editor arrives in Phase 2</span>
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sample notes..."
            className="pl-8 text-xs"
          />
        </div>
      </div>

      {/* Project Context Filter */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] p-1 w-fit">
        {contexts.map((ctx) => (
          <button
            key={ctx}
            type="button"
            onClick={() => setContextFilter(ctx)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer',
              contextFilter === ctx
                ? 'bg-[var(--ph-bg-elevated)] text-[var(--ph-text-primary)]'
                : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
            )}
          >
            {ctx === 'all' ? 'All Notes' : ctx}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No matching notes"
          description="Clear the search filter or project context to review the Phase 1 sample notes."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setContextFilter('all');
                setSearch('');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filtered.map((note) => (
            <Card
              key={note.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedNote(note)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedNote(note);
                }
              }}
              className="flex flex-col justify-between cursor-pointer hover:border-[var(--ph-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] transition-colors"
            >
              <CardHeader>
                <div>
                  <CardTitle className="leading-snug">{note.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {note.projectContext} · {note.updatedAt}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                  {note.excerpt}
                </p>
                <div className="mt-4 border-t border-[var(--ph-border)] pt-3 font-mono text-[11px] text-[var(--ph-text-muted)] tabular-nums">
                  {note.wordCount} words · Sample preview
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(selectedNote)} onOpenChange={(open) => !open && setSelectedNote(null)}>
        <DialogContent>
          <DialogTitle>{selectedNote?.title}</DialogTitle>
          <DialogDescription>
            {selectedNote?.projectContext} · Updated {selectedNote?.updatedAt}
          </DialogDescription>
          <p className="mt-4 text-sm leading-relaxed text-[var(--ph-text-secondary)]">
            {selectedNote?.excerpt}
          </p>
          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--ph-border)] pt-4">
            <span className="text-xs text-[var(--ph-text-muted)]">
              Read-only Phase 1 sample document
            </span>
            <Button variant="secondary" size="sm" onClick={() => setSelectedNote(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
