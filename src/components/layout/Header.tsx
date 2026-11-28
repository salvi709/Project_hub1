import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Globe, LogOut, Menu, Search, Settings } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../types/navigation';
import { useAuth } from '../../features/auth/AuthContext';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { NotificationsPopover } from './NotificationsPopover';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { displayName, isPreviewMode, signOut } = useAuth();
  const { getProjectById } = useWorkspace();

  const projectMatch = location.pathname.match(/^\/projects\/([^/]+)$/);
  const activeProject = projectMatch ? getProjectById(projectMatch[1]) : undefined;
  const activeNav = NAVIGATION_ITEMS.find((item) => item.path === location.pathname);

  const pageTitle = activeProject
    ? activeProject.name
    : projectMatch
    ? 'Project Detail'
    : activeNav?.label ?? 'Overview';

  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[var(--ph-border)] bg-[var(--ph-bg-primary)]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile Menu + Breadcrumb / Title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-card)] text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)] lg:hidden cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 items-center gap-2">
          {projectMatch ? (
            <div className="flex min-w-0 items-center gap-1.5">
              <Link
                to="/projects"
                className="text-xs font-medium text-[var(--ph-text-secondary)] hover:text-[var(--ph-accent-hover)] transition-colors whitespace-nowrap"
              >
                My Projects
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--ph-text-muted)]" />
              <h1 className="truncate font-display text-sm sm:text-base font-semibold tracking-tight text-[var(--ph-text-primary)]">
                {pageTitle}
              </h1>
            </div>
          ) : (
            <h1 className="truncate font-display text-sm sm:text-base font-semibold tracking-tight text-[var(--ph-text-primary)]">
              {pageTitle}
            </h1>
          )}
        </div>
      </div>

      {/* Right: Search, PWA Install, Notifications, User */}
      <div className="flex items-center gap-2.5">
        <PWAInstallButton compact />

        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-9 items-center justify-between gap-2.5 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-card)] px-3 text-xs text-[var(--ph-text-secondary)] shadow-[var(--ph-shadow-sm)] transition-colors hover:border-[var(--ph-border-hover)] hover:text-[var(--ph-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] cursor-pointer sm:w-56"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-[var(--ph-text-muted)]" />
            <span className="hidden sm:inline">Search workspace...</span>
          </span>
          <kbd className="hidden sm:inline-block rounded bg-[var(--ph-bg-secondary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ph-text-secondary)]">
            ⌘K
          </kbd>
        </button>

        <NotificationsPopover />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ph-lavender-soft)] text-xs font-bold text-[var(--ph-lavender-ink)] transition-colors hover:bg-[#E4DBFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] cursor-pointer"
            >
              {initials || 'PH'}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/settings')}>
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/')}>
              <Globe className="h-3.5 w-3.5" />
              <span>Landing page</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async () => {
                await signOut();
                navigate('/login');
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{isPreviewMode ? 'Exit preview' : 'Sign out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
