import React, { useMemo, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { offsetISODate } from '../../lib/date';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

export const WeeklyProductivityChart: React.FC = () => {
  const { tasks } = useWorkspace();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const days = useMemo(() => {
    const buckets: { label: string; iso: string; completed: number; active: number }[] = [];
    for (let offset = -3; offset <= 3; offset++) {
      const iso = offsetISODate(offset);
      const [y, m, d] = iso.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const label =
        offset === 0
          ? 'Today'
          : date.toLocaleDateString('en-US', { weekday: 'short' });

      const matching = tasks.filter((t) => t.dueDate === iso);
      const completed = matching.filter((t) => t.status === 'completed').length;
      const active = matching.filter((t) => t.status !== 'completed').length;
      buckets.push({ label, iso, completed, active });
    }
    return buckets;
  }, [tasks]);

  const maxCount = Math.max(1, ...days.map((d) => d.completed + d.active));
  const totalScheduled = days.reduce((acc, d) => acc + d.completed + d.active, 0);
  const totalCompleted = days.reduce((acc, d) => acc + d.completed, 0);

  return (
    <Card>
      <CardHeader className="border-b border-[var(--ph-border)] pb-4">
        <div>
          <CardTitle>Weekly Task Cadence</CardTitle>
          <CardDescription>
            {totalCompleted} completed of {totalScheduled} scheduled across this 7-day window
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[var(--ph-text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[var(--ph-accent)]" />
            Completed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-[var(--ph-border-hover)] bg-[var(--ph-bg-secondary)]" />
            Open
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        {tasks.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="h-5 w-5" />}
            title="No task cadence yet"
            description="Create tasks with due dates to visualize your weekly completion rhythm."
          />
        ) : (
          <div className="grid grid-cols-7 gap-2 pt-2">
            {days.map((day, index) => {
              const completedHeight = Math.round((day.completed / maxCount) * 110);
              const activeHeight = Math.round((day.active / maxCount) * 110);
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={day.iso}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative flex flex-col items-center gap-2"
                >
                  {isHovered && (
                    <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-card)] px-2 py-1 text-[10px] font-medium text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-md)]">
                      {day.completed} done · {day.active} open
                    </div>
                  )}

                  <div className="flex h-32 w-full items-end justify-center gap-1 rounded-md px-1 pb-1 transition-colors hover:bg-[var(--ph-bg-hover)]">
                    <div
                      className="w-3 rounded-t-sm bg-[var(--ph-accent)] transition-all duration-200"
                      style={{
                        height: `${day.completed > 0 ? Math.max(8, completedHeight) : 3}px`,
                        opacity: day.completed > 0 ? 1 : 0.25,
                      }}
                    />
                    <div
                      className="w-3 rounded-t-sm border border-[var(--ph-border-hover)] bg-[var(--ph-bg-secondary)] transition-all duration-200"
                      style={{
                        height: `${day.active > 0 ? Math.max(8, activeHeight) : 3}px`,
                        opacity: day.active > 0 ? 1 : 0.35,
                      }}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-medium ${
                      day.label === 'Today'
                        ? 'text-[var(--ph-accent-text)]'
                        : 'text-[var(--ph-text-secondary)]'
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
