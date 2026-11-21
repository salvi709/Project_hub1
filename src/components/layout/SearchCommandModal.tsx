import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckSquare, CornerDownLeft, FileText, FolderKanban, Search } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../types/navigation';
import { SAMPLE_PROJECTS } from '../../features/projects/sampleProjects';
import { SAMPLE_NOTES, SAMPLE_TASKS } from '../../features/tasks/sampleTasks';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogTitle } from '../ui/Dialog';
import { NavIcon } from './NavIcon';

interface SearchCommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  key: string;
  group: 'Navigation' | 'Projects · Sample Preview' | 'Tasks · Sample Preview' | 'Notes · Sample Preview';
  label: string;
  meta?: string;
  path: string;
  icon: React.ReactNode;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
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
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const normalized = query.trim().toLowerCase();

  const items = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = NAVIGATION_ITEMS.filter(
      (item) =>
        !normalized ||
        item.label.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized)
    ).map((item) => ({
      key: `nav-${item.id}`,
      group: 'Navigation',
      label: item.label,
      path: item.path,
      icon: <NavIcon name={item.iconName} className="h-4 w-4 text-[var(--ph-accent)]" />,
    }));

    const projectItems: CommandItem[] = SAMPLE_PROJECTS.filter(
      (project) =>
        !normalized ||
        project.name.toLowerCase().includes(normalized) ||
        project.category.toLowerCase().includes(normalized)
    )
      .slice(0, 3)
      .map((project) => ({
        key: `proj-${project.id}`,
        group: 'Projects · Sample Preview',
        label: project.name,
        meta: project.category,
        path: '/projects',
        icon: <FolderKanban className="h-4 w-4 shrink-0 text-[var(--ph-text-secondary)]" />,
      }));

    const taskItems: CommandItem[] = SAMPLE_TASKS.filter(
      (task) =>
        !normalized ||
        task.title.toLowerCase().includes(normalized) ||
        task.projectName.toLowerCase().includes(normalized)
    )
      .slice(0, 3)
      .map((task) => ({
        key: `task-${task.id}`,
        group: 'Tasks · Sample Preview',
        label: task.title,
        meta: task.projectName,
        path: '/tasks',
        icon: <CheckSquare className="h-4 w-4 shrink-0 text-[var(--ph-text-secondary)]" />,
      }));

    const noteItems: CommandItem[] = SAMPLE_NOTES.filter(
      (note) =>
        !normalized ||
        note.title.toLowerCase().includes(normalized) ||
        note.projectContext.toLowerCase().includes(normalized)
    )
      .slice(0, 2)
      .map((note) => ({
        key: `note-${note.id}`,
        group: 'Notes · Sample Preview',
        label: note.title,
        meta: note.projectContext,
        path: '/notes',
        icon: <FileText className="h-4 w-4 shrink-0 text-[var(--ph-text-secondary)]" />,
      }));

    return [...navItems, ...projectItems, ...taskItems, ...noteItems];
  }, [normalized]);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalized]);

  const goTo = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = items[activeIndex];
      if (selected) goTo(selected.path);
    }
  };

  const groups: CommandItem['group'][] = [
    'Navigation',
    'Projects · Sample Preview',
    'Tasks · Sample Preview',
    'Notes · Sample Preview',
  ];

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
            onKeyDown={handleInputKeyDown}
            placeholder="Search pages, sample projects, tasks, or notes..."
            className="w-full bg-transparent text-sm text-[var(--ph-text-primary)] placeholder:text-[var(--ph-text-muted)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded border border-[var(--ph-border)] bg-[var(--ph-bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ph-text-muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {items.length === 0 && (
            <div className="py-10 text-center text-sm text-[var(--ph-text-secondary)]">
              No workspace items matching &ldquo;{query}&rdquo;.
            </div>
          )}

          {groups.map((groupName) => {
            const groupItems = items.filter((item) => item.group === groupName);
            if (groupItems.length === 0) return null;

            return (
              <div key={groupName}>
                <div className="px-2.5 py-1 text-xs font-medium text-[var(--ph-text-muted)]">
                  {groupName}
                </div>
                <div className="space-y-0.5">
                  {groupItems.map((item) => {
                    const globalIdx = items.findIndex((x) => x.key === item.key);
                    const isSelected = globalIdx === activeIndex;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                        onClick={() => goTo(item.path)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-[var(--ph-text-primary)] transition-colors cursor-pointer',
                          isSelected ? 'bg-[var(--ph-bg-elevated)]' : 'hover:bg-[var(--ph-bg-elevated)]'
                        )}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </span>
                        {item.meta ? (
                          <span className="text-xs text-[var(--ph-text-muted)] shrink-0 ml-3">
                            {item.meta}
                          </span>
                        ) : (
                          <ArrowRight
                            className={cn(
                              'h-3.5 w-3.5 shrink-0 transition-colors',
                              isSelected ? 'text-[var(--ph-accent)]' : 'text-[var(--ph-text-muted)]'
                            )}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--ph-border)] bg-[var(--ph-bg-primary)]/60 px-4 py-2 text-[11px] text-[var(--ph-text-muted)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-[var(--ph-border)] bg-[var(--ph-bg-elevated)] px-1 font-mono text-[10px]">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              Open
            </span>
          </div>
          <span>ProjectHub Command Palette</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
