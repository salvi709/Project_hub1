import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LogIn,
  LogOut,
  Moon,
  Settings,
  Sun,
  X,
} from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../types/navigation';
import { cn } from '../../lib/utils';
import { useAuth } from '../../features/auth/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { getInitials } from '../../utils/formatters';
import { BrandLogo } from '../ui/BrandLogo';
import { NavIcon } from './NavIcon';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { displayName, displayEmail, isSupabaseConfigured, isPreviewMode, signOut } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const workspaceItems = NAVIGATION_ITEMS.filter((i) => i.section === 'workspace');
  const resourceItems = NAVIGATION_ITEMS.filter((i) => i.section === 'resources');
  const systemItems = NAVIGATION_ITEMS.filter((i) => i.section === 'system');

  const handleSignOut = async () => {
    await signOut();
    onCloseMobile();
    navigate('/login');
  };

  const renderNavSection = (title: string, items: typeof NAVIGATION_ITEMS) => (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-3 pb-1 text-xs font-medium text-[var(--ph-text-muted)]">{title}</div>
      )}
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === '/'}
          onClick={onCloseMobile}
          title={collapsed ? item.label : undefined}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)]',
              collapsed && 'justify-center px-2',
              isActive
                ? 'bg-[var(--ph-accent-soft)] text-[var(--ph-accent)]'
                : 'text-[var(--ph-text-secondary)] hover:bg-[var(--ph-bg-elevated)] hover:text-[var(--ph-text-primary)]'
            )
          }
        >
          <NavIcon name={item.iconName} className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}
    </div>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[var(--ph-bg-surface)] border-r border-[var(--ph-border)]">
      {/* Brand Header */}
      <div
        className={cn(
          'flex h-14 items-center justify-between border-b border-[var(--ph-border)] px-4 shrink-0',
          collapsed && 'justify-center px-2'
        )}
      >
        <NavLink to="/" onClick={onCloseMobile} className="focus-visible:outline-none">
          <BrandLogo collapsed={collapsed} />
        </NavLink>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-[var(--ph-text-muted)] transition-colors hover:bg-[var(--ph-bg-elevated)] hover:text-[var(--ph-text-primary)] cursor-pointer',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="flex lg:hidden h-8 w-8 items-center justify-center rounded-md text-[var(--ph-text-secondary)] hover:bg-[var(--ph-bg-elevated)] cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="hidden lg:flex justify-center pt-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--ph-border)] text-[var(--ph-text-muted)] transition-colors hover:border-[var(--ph-border-hover)] hover:text-[var(--ph-text-primary)] cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav aria-label="Main Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {renderNavSection('Workspace', workspaceItems)}
        {renderNavSection('Resources', resourceItems)}
        {renderNavSection('System', systemItems)}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-[var(--ph-border)] p-3 shrink-0">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className={cn(
                'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[var(--ph-bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] cursor-pointer',
                collapsed && 'justify-center px-1'
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-elevated)] font-display text-xs font-semibold text-[var(--ph-accent)]">
                {getInitials(displayName, displayEmail)}
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-[var(--ph-text-primary)]">
                      {displayName}
                    </p>
                    <p className="truncate text-[11px] text-[var(--ph-text-muted)]">
                      {displayEmail}
                    </p>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[var(--ph-text-muted)]" />
                </>
              )}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="top"
              align={collapsed ? 'center' : 'start'}
              sideOffset={8}
              className="z-50 w-56 rounded-xl border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] p-1.5 text-[var(--ph-text-primary)] shadow-2xl"
            >
              <div className="px-2.5 py-2 border-b border-[var(--ph-border)]">
                <p className="text-xs font-medium truncate">{displayName}</p>
                <p className="text-[11px] text-[var(--ph-text-muted)] truncate">{displayEmail}</p>
              </div>

              <div className="mt-1 space-y-0.5">
                <DropdownMenu.Item
                  onSelect={() => {
                    onCloseMobile();
                    navigate('/settings');
                  }}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-[var(--ph-text-secondary)] outline-none hover:bg-[var(--ph-bg-elevated)] hover:text-[var(--ph-text-primary)] cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Workspace Settings</span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={toggleTheme}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-[var(--ph-text-secondary)] outline-none hover:bg-[var(--ph-bg-elevated)] hover:text-[var(--ph-text-primary)] cursor-pointer"
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="h-3.5 w-3.5" />
                  ) : (
                    <Moon className="h-3.5 w-3.5" />
                  )}
                  <span>Switch to {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                </DropdownMenu.Item>

                {!isSupabaseConfigured && isPreviewMode ? (
                  <DropdownMenu.Item
                    onSelect={handleSignOut}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-[var(--ph-text-secondary)] outline-none hover:bg-[var(--ph-bg-elevated)] hover:text-[var(--ph-text-primary)] cursor-pointer"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Open Auth Screen</span>
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item
                    onSelect={handleSignOut}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-red-400 outline-none hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </DropdownMenu.Item>
                )}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside
        className={cn(
          'hidden lg:block shrink-0 transition-[width] duration-200 ease-out',
          collapsed ? 'w-[72px]' : 'w-[256px]'
        )}
      >
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-64 max-w-[82vw] h-full">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
};
