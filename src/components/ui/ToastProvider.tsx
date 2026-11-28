import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (options: { title: string; description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      window.setTimeout(() => {
        dismiss(id);
      }, 3600);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
      >
        <AnimatePresence initial={false}>
          {toasts.map((item) => {
            const Icon =
              item.variant === 'success'
                ? CheckCircle2
                : item.variant === 'error' || item.variant === 'warning'
                ? AlertCircle
                : Info;

            const iconColor =
              item.variant === 'success'
                ? 'text-[var(--ph-success)]'
                : item.variant === 'warning'
                ? 'text-[var(--ph-warning)]'
                : item.variant === 'error'
                ? 'text-[var(--ph-error)]'
                : 'text-[var(--ph-accent-text)]';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="pointer-events-auto flex items-start gap-3 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-card)] p-3.5 text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-md)]"
              >
                <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconColor)} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{item.title}</p>
                  {item.description && (
                    <p className="mt-0.5 text-xs text-[var(--ph-text-secondary)]">
                      {item.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss notification"
                  className="rounded p-1 text-[var(--ph-text-muted)] hover:bg-[var(--ph-bg-secondary)] hover:text-[var(--ph-text-primary)] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
