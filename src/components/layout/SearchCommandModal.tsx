import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckSquare, FileText, FolderKanban, Search } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../types/navigation';
import { SAMPLE_PROJECTS } from '../../features/projects/sampleProjects';
import { SAMPLE_NOTES, SAMPLE_TASKS } from '../../features/tasks/sampleTasks';
import { Dialog, DialogContent, DialogTitle } from '../ui/Dialog';
import { NavIcon } from './NavIcon';

interface SearchCommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const normalized = query.trim().toLowerCase();

  const matchingRoutes = useMemo(
    () =>
      NAVIGATION_ITEMS.filter(
        (item) =>
          !normalized ||
          item.label.toLowerCase().includes(normalized) ||
          item.description.toLowerCase().includes(normalized)
      ),
    [normalized]
  );

  const matchingProjects = useMemo(
    () =>
      SAMPLE_PROJECTS.filter(
        (project) =>
          !normalized ||
          project.name.toLowerCase().includes(normalized) ||
          project.category.toLowerCase().includes(normalized)
      ).slice(0, 3),
    [normalized]
  );

  const matchingTasks = useMemo(
    () =>
      SAMPLE_TASKS.filter(
        (task) =>
          !normalized ||
          task.title.toLowerCase().includes(normalized) ||
          task.projectName.toLowerCase().includes(normalized)
      ).slice(0, 3),
    [normalized]
  );

  const matchingNotes = useMemo(
    () =>
      SAMPLE_NOTES.filter(
        (note) =>
          !normalized ||
          note.title.toLowerCase().includes(normalized) ||
          note.projectContext.toLowerCase().includes(normalized)
      ).slice(0, 2),
    [normalized]
  );

  const goTo = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const hasResults =
    matchingRoutes.length > 0 ||
    matchingProjects.length > 0 ||
    matchingTasks.length > 0 ||
    matchingNotes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-xl">
        <DialogTitle className="sr-only">Search ProjectHub workspace</DialogTitle>
        <div className="flex items-center gap-3 border-b border-[var(--ph-border)] px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-[var(--ph-text-muted)]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, sample projects, tasks, or notes..."
            className="w-full bg-transparent text-sm text-[var(--ph-text-primary)] placeholder:text-[var(--ph-text-muted)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded border border-[var(--ph-border)] bg-[var(--ph-bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ph-text-muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {!hasResults && (
            <div className="py-10 text-center text-sm text-[var(--ph-text-secondary)]">
              No workspace items matching &ldquo;{query}&rdquo;.
            </div>
          )}

          {matchingRoutes.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-xs font-medium text-[var(--ph-text-muted)]">
                Navigation
              </div>
              <div className="space-y-0.5">
                {matchingRoutes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(item.path)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-[var(--ph-text-primary)] transition-colors hover:bg-[var(--ph-bg-elevated)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <NavIcon name={item.iconName} className="h-4 w-4 text-[var(--ph-accent)]" />
                      <span>{item.label}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--ph-text-muted)]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingProjects.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-xs font-medium text-[var(--ph-text-muted)]">
                Projects · Sample Preview
              </div>
              <div className="space-y-0.5">
                {matchingProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => goTo('/projects')}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-[var(--ph-text-primary)] transition-colors hover:bg-[var(--ph-bg-elevated)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <FolderKanban className="h-4 w-4 shrink-0 text-[var(--ph-text-secondary)]" />
                      <span className="truncate">{project.name}</span>
                    </span>
                    <span className="text-xs text-[var(--ph-text-muted)] shrink-0 ml-3">
                      {project.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingTasks.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-xs font-medium text-[var(--ph-text-muted)]">
                Tasks · Sample Preview
              </div>
              <div className="space-y-0.5">
                {matchingTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => goTo('/tasks')}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-[var(--ph-text-primary)] transition-colors hover:bg-[var(--ph-bg-elevated)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <CheckSquare className="h-4 w-4 shrink-0 text-[var(--ph-text-secondary)]" />
                      <span className="truncate">{task.title}</span>
                    </span>
                    <span className="text-xs text-[var(--ph-text-muted)] shrink-0 ml-3">
                      {task.projectName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingNotes.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-xs font-medium text-[var(--ph-text-muted)]">
                Notes · Sample Preview
              </div>
              <div className="space-y-0.5">
                {matchingNotes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => goTo('/notes')}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-[var(--ph-text-primary)] transition-colors hover:bg-[var(--ph-bg-elevated)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-4 w-4 shrink-0 text-[var(--ph-text-secondary)]" />
                      <span className="truncate">{note.title}</span>
                    </span>
                    <span className="text-xs text-[var(--ph-text-muted)] shrink-0 ml-3">
                      {note.projectContext}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
