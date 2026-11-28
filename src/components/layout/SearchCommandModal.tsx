import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckSquare, FileText, FolderKanban, Search } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { NAVIGATION_ITEMS } from '../../types/navigation';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { NavIcon } from './NavIcon';

interface SearchCommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResultItem {
  id: string;
  label: string;
  subtitle: string;
  path: string;
  group: 'Navigation' | 'Projects' | 'Tasks' | 'Notes';
  icon?: React.ReactNode;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { projects, tasks, notes, getProjectById } = useWorkspace();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();

    const navItems: SearchResultItem[] = NAVIGATION_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      label: item.label,
      subtitle: item.description,
      path: item.path,
      group: 'Navigation',
      icon: <NavIcon name={item.iconName} className="h-4 w-4" />,
    }));

    const projectItems: SearchResultItem[] = projects.map((proj) => ({
      id: `proj-${proj.id}`,
      label: proj.name,
      subtitle: `${proj.category} · ${proj.status.replace('_', ' ')}`,
      path: `/projects/${proj.id}`,
      group: 'Projects',
      icon: <FolderKanban className="h-4 w-4" />,
    }));

    const taskItems: SearchResultItem[] = tasks.map((task) => ({
      id: `task-${task.id}`,
      label: task.title,
      subtitle: `${getProjectById(task.projectId)?.name ?? 'Personal'} · ${task.priority}`,
      path: '/tasks',
      group: 'Tasks',
      icon: <CheckSquare className="h-4 w-4" />,
    }));

    const noteItems: SearchResultItem[] = notes.map((note) => ({
      id: `note-${note.id}`,
      label: note.title,
      subtitle: getProjectById(note.projectId)?.name ?? 'General Notes',
      path: '/notes',
      group: 'Notes',
      icon: <FileText className="h-4 w-4" />,
    }));

    const all = [...projectItems, ...taskItems, ...noteItems, ...navItems];
    if (!q) return [...navItems.slice(0, 4), ...projectItems.slice(0, 4)];
    return all
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, projects, tasks, notes, getProjectById]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  const handleSelect = (item: SearchResultItem) => {
    onOpenChange(false);
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#29243A]/25 backdrop-blur-[3px]" />
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          aria-label="Global workspace search"
          className="fixed left-1/2 top-[14%] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--ph-border)] bg-[var(--ph-bg-card)] text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-md)] focus:outline-none"
        >
          <DialogPrimitive.Title className="sr-only">
            Search ProjectHub workspace
          </DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b border-[var(--ph-border)] px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-[var(--ph-text-muted)]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tasks, notes, or jump to a view..."
              className="w-full bg-transparent text-sm text-[var(--ph-text-primary)] placeholder:text-[var(--ph-text-muted)] focus:outline-none"
            />
            <kbd className="hidden sm:inline-block rounded border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ph-text-muted)]">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="py-10 text-center text-xs text-[var(--ph-text-muted)]">
                No matching pages, projects, tasks, or notes for &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--ph-accent-soft)] text-[var(--ph-accent-text)]'
                          : 'hover:bg-[var(--ph-bg-hover)]'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={
                            isSelected
                              ? 'text-[var(--ph-accent-text)]'
                              : 'text-[var(--ph-text-secondary)]'
                          }
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-[var(--ph-text-primary)]">
                            {item.label}
                          </div>
                          <div className="truncate text-[11px] text-[var(--ph-text-secondary)]">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] px-1.5 py-0.5 text-[10px] text-[var(--ph-text-secondary)]">
                          {item.group}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[var(--ph-text-muted)]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] px-4 py-2 text-[11px] text-[var(--ph-text-muted)]">
            <span>Use ↑ ↓ to navigate, Enter to open</span>
            <span className="font-mono">⌘K / Ctrl+K</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
