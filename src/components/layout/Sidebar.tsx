import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, LogOut, Settings, X } from 'lucide-react';
import { NAVIGATION_ITEMS, type NavSection } from '../../types/navigation';
import { useAuth } from '../../features/auth/AuthContext';
import { cn } from '../../lib/utils';
import { BrandLogo } from '../ui/BrandLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { NavIcon } from './NavIcon';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const SECTION_TITLES: Record<NavSection, string> = {
  main: 'MAIN',
  workspace: 'WORKSPACE',
  preferences: 'PREFERENCES',
};

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { displayName, displayEmail, isPreviewMode, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sections: NavSection[] = ['main', 'workspace', 'preferences'];

  const renderSidebarBody = (isMobile = false) => {
    const isCollapsed = collapsed && !isMobile;

    return (
      <div className="flex h-full flex-col border-r border-[var(--ph-border)] bg-[var(--ph-bg-card)]">
        {/* Brand Header */}
        <div
          className={cn(
            'flex h-16 items-center px-4',
            isCollapsed ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <NavLink
            to="/overview"
            onClick={onCloseMobile}
            className="flex items-center focus-visible:outline-none"
          >
            <BrandLogo collapsed={isCollapsed} />
          </NavLink>

          {!isMobile && !isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-[var(--ph-text-secondary)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ph-text-secondary)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Workspace Card */}
        {!isCollapsed && (
          <div className="px-3.5 pb-2">
            <div className="flex items-center justify-between rounded-xl border border-[var(--ph-border)] bg-[#FAF8FF] px-3 py-2">
              <div className="min-w-0">
                <p className="truncate font-display text-xs font-semibold text-[var(--ph-text-primary)]">
                  Personal Workspace
                </p>
                <p className="truncate text-[11px] text-[var(--ph-text-secondary)]">
                  {isPreviewMode ? 'Local Preview Mode' : 'Synced Workspace'}
                </p>
              </div>
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--ph-accent)]" />
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav
          aria-label="Primary navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-6"
        >
          {sections.map((section) => {
            const items = NAVIGATION_ITEMS.filter((i) => i.section === section);
            return (
              <div key={section}>
                {!isCollapsed && (
                  <p className="mb-2 px-2.5 text-[10px] font-semibold tracking-wider text-[var(--ph-text-muted)]">
                    {SECTION_TITLES[section]}
                  </p>
                )}
                <div className="space-y-1">
                  {items.map((item) => {
                    const isProjectsRoute =
                      item.path === '/projects' && location.pathname.startsWith('/projects/');
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        end={item.path === '/overview'}
                        onClick={onCloseMobile}
                        title={isCollapsed ? item.label : undefined}
                        className={({ isActive }) => {
                          const active = isActive || isProjectsRoute;
                          return cn(
                            'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150',
                            isCollapsed && 'justify-center px-2',
                            active
                              ? 'bg-[var(--ph-lavender-soft)] text-[var(--ph-lavender-ink)] font-semibold'
                              : 'text-[var(--ph-text-secondary)] hover:bg-[var(--ph-bg-hover)] hover:text-[var(--ph-text-primary)]'
                          );
                        }}
                      >
                        {({ isActive }) => {
                          const active = isActive || isProjectsRoute;
                          return (
                            <>
                              <span
                                className={cn(
                                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors',
                                  active
                                    ? 'bg-white text-[var(--ph-accent-hover)] shadow-[var(--ph-shadow-sm)]'
                                    : 'text-[var(--ph-text-secondary)] group-hover:text-[var(--ph-text-primary)]'
                                )}
                              >
                                <NavIcon name={item.iconName} className="h-4 w-4" />
                              </span>
                              {!isCollapsed && (
                                <span className="truncate whitespace-nowrap">{item.label}</span>
                              )}
                            </>
                          );
                        }}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Expand Toggle when Collapsed */}
        {!isMobile && isCollapsed && (
          <div className="flex justify-center border-t border-[var(--ph-border)] py-2.5">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ph-text-secondary)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* User Profile Footer */}
        <div className="border-t border-[var(--ph-border)] p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left transition-colors hover:bg-[var(--ph-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] cursor-pointer',
                  isCollapsed && 'justify-center'
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--ph-lavender-soft)] text-xs font-bold text-[var(--ph-lavender-ink)]">
                  {initials || 'PH'}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--ph-text-primary)]">
                      {displayName}
                    </p>
                    <p className="truncate text-[11px] text-[var(--ph-text-muted)]">
                      {displayEmail}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuLabel>
                <div className="truncate text-xs font-semibold text-[var(--ph-text-primary)]">
                  {displayName}
                </div>
                <div className="truncate text-[11px] font-normal text-[var(--ph-text-muted)]">
                  {displayEmail}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  onCloseMobile();
                  navigate('/settings');
                }}
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  onCloseMobile();
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
      </div>
    );
  };

  return (
    <>
      <aside
        className={cn(
          'hidden lg:block shrink-0 transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
          collapsed ? 'w-[72px]' : 'w-[252px]'
        )}
      >
        <div className="sticky top-0 h-screen">{renderSidebarBody(false)}</div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="fixed inset-0 bg-[#29243A]/25 backdrop-blur-[2px]"
              onClick={onCloseMobile}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-64"
            >
              {renderSidebarBody(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
