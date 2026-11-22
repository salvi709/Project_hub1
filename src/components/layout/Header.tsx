import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { NotificationsPopover } from './NotificationsPopover';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  pageTitle: string;
  pageSubtitle?: string;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  pageSubtitle,
  onOpenMobileMenu,
  onOpenSearch,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-[var(--ph-border)] bg-[var(--ph-bg-primary)]/95 px-4 sm:px-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="flex lg:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
            <Link
              to="/"
              className="hidden sm:inline-block text-xs font-medium text-[var(--ph-text-muted)] hover:text-[var(--ph-text-primary)] transition-colors whitespace-nowrap shrink-0"
            >
              ProjectHub
            </Link>
            <span aria-hidden="true" className="hidden sm:inline-block text-xs text-[var(--ph-text-muted)]">
              /
            </span>
            <h1 className="font-display text-sm sm:text-base font-semibold tracking-tight text-[var(--ph-text-primary)] truncate">
              {pageTitle}
            </h1>
          </nav>

          {pageSubtitle && (
            <span className="hidden xl:inline-block border-l border-[var(--ph-border)] pl-2.5 text-xs text-[var(--ph-text-muted)] truncate">
              {pageSubtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-9 items-center gap-2.5 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] px-3 text-xs text-[var(--ph-text-secondary)] transition-colors hover:border-[var(--ph-border-hover)] hover:text-[var(--ph-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] cursor-pointer sm:w-56 justify-between"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-[var(--ph-text-muted)]" />
            <span className="hidden sm:inline">Search workspace...</span>
          </span>
          <kbd className="hidden sm:inline-block rounded border border-[var(--ph-border)] bg-[var(--ph-bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ph-text-muted)]">
            ⌘K
          </kbd>
        </button>

        <PWAInstallButton compact />

        <NotificationsPopover />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] text-[var(--ph-text-secondary)] transition-colors hover:border-[var(--ph-border-hover)] hover:text-[var(--ph-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] cursor-pointer"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
};
