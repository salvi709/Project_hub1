import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Bell, Check } from 'lucide-react';
import { SAMPLE_NOTIFICATIONS } from '../../features/tasks/sampleTasks';
import type { SampleNotification } from '../../types/domain';
import { cn } from '../../lib/utils';

export const NotificationsPopover: React.FC = () => {
  const [notifications, setNotifications] = useState<SampleNotification[]>(SAMPLE_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item))
    );
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Notifications (${unreadCount} unread)`}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] text-[var(--ph-text-secondary)] transition-colors hover:border-[var(--ph-border-hover)] hover:text-[var(--ph-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ph-accent)] px-1 font-mono text-[10px] font-semibold text-[var(--ph-accent-foreground)] tabular-nums">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-xl border border-[var(--ph-border)] bg-[var(--ph-bg-surface)] p-2 text-[var(--ph-text-primary)] shadow-2xl"
        >
          <div className="flex items-center justify-between px-2.5 py-2 border-b border-[var(--ph-border)]">
            <span className="font-display text-xs font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-medium text-[var(--ph-accent)] hover:underline cursor-pointer"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="mt-1 space-y-1 max-h-72 overflow-y-auto">
            {notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleRead(item.id)}
                className={cn(
                  'w-full rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--ph-bg-elevated)] cursor-pointer',
                  !item.read && 'bg-[var(--ph-accent-soft)]'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[var(--ph-text-primary)] truncate">
                    {item.title}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--ph-text-muted)] shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[var(--ph-text-secondary)] leading-relaxed">
                  {item.detail}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-1 border-t border-[var(--ph-border)] px-2.5 pt-2 pb-1 text-[11px] text-[var(--ph-text-muted)]">
            Sample notifications · Real-time alerts planned for Phase 2
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
