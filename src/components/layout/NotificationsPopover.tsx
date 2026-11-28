import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { SAMPLE_NOTIFICATIONS } from '../../features/tasks/sampleTasks';
import { cn } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';

export const NotificationsPopover: React.FC = () => {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-card)] text-[var(--ph-text-secondary)] transition-colors hover:border-[var(--ph-border-hover)] hover:bg-[var(--ph-bg-hover)] hover:text-[var(--ph-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--ph-accent)] ring-2 ring-[var(--ph-bg-card)]"
            />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-2">
        <div className="flex items-center justify-between border-b border-[var(--ph-border)] px-2.5 py-2">
          <span className="text-xs font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1 text-[11px] font-medium text-[var(--ph-accent-text)] hover:underline cursor-pointer"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        <div className="mt-1 max-h-72 space-y-1 overflow-y-auto">
          {notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleRead(item.id)}
              className={cn(
                'w-full rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[var(--ph-bg-hover)] cursor-pointer',
                !item.read && 'bg-[var(--ph-accent-soft)]/50'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[var(--ph-text-primary)]">
                  {item.title}
                </span>
                <span className="shrink-0 text-[10px] text-[var(--ph-text-muted)]">
                  {item.timestamp}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--ph-text-secondary)]">
                {item.detail}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-1 border-t border-[var(--ph-border)] px-2.5 pt-2 pb-1 text-[10px] text-[var(--ph-text-muted)]">
          Local workspace reminders
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
