import React, { useMemo, useState } from 'react';
import { FileText, Info, Search } from 'lucide-react';
import { SAMPLE_NOTES } from '../features/tasks/sampleTasks';
import type { SampleNote } from '../types/domain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../components/ui/Dialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';

export const NotesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<SampleNote | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SAMPLE_NOTES.filter(
      (note) =>
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.projectContext.toLowerCase().includes(q) ||
        note.excerpt.toLowerCase().includes(q)
    );
  }, [search]);

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

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No matching notes"
          description="Clear the search filter to review the Phase 1 sample architecture notes."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filtered.map((note) => (
            <Card
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="cursor-pointer hover:border-[var(--ph-border-hover)] transition-colors"
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
          <p className="mt-3 text-xs text-[var(--ph-text-muted)]">
            This is a read-only Phase 1 sample document. Full note creation, tagging, and Supabase
            storage will be added in a subsequent milestone.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
