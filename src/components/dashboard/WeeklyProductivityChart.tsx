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
  const ratio =
    totalScheduled === 0 ? 0 : Math.round((totalCompleted / totalScheduled) * 100);

  return (
    <Card>
      <CardHeader className="border-b border-[var(--ph-border)] pb-4">
        <div>
          <CardTitle>Weekly Productivity</CardTitle>
          <CardDescription>
            {totalCompleted} completed of {totalScheduled} scheduled across this 7-day window
          </CardDescription>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-[var(--ph-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--ph-accent)]" />
              Completed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#B9D9FC]" />
              Scheduled
            </span>
          </div>
          <span className="rounded-lg bg-[var(--ph-lavender-soft)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--ph-lavender-ink)] tabular-nums">
            {ratio}%
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
          <div className="grid grid-cols-7 gap-3 pt-2">
            {days.map((day, index) => {
              const completedHeight = Math.round((day.completed / maxCount) * 116);
              const activeHeight = Math.round((day.active / maxCount) * 116);
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={day.iso}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative flex flex-col items-center gap-2"
                >
                  {isHovered && (
                    <div className="pointer-events-none absolute -top-9 z-10 whitespace-nowrap rounded-lg border border-[var(--ph-border)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-md)]">
                      {day.completed} done · {day.active} open
                    </div>
                  )}

                  <div className="flex h-36 w-full items-end justify-center gap-1.5 rounded-xl bg-[#FAF8FF] px-1.5 pb-2 transition-colors hover:bg-[var(--ph-bg-secondary)]">
                    <div
                      className="w-3.5 rounded-full bg-[var(--ph-accent)] transition-all duration-200"
                      style={{
                        height: `${day.completed > 0 ? Math.max(14, completedHeight) : 6}px`,
                        opacity: day.completed > 0 ? 1 : 0.25,
                      }}
                    />
                    <div
                      className="w-3.5 rounded-full bg-[#B9D9FC] transition-all duration-200"
                      style={{
                        height: `${day.active > 0 ? Math.max(14, activeHeight) : 6}px`,
                        opacity: day.active > 0 ? 1 : 0.35,
                      }}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-medium ${
                      day.label === 'Today'
                        ? 'font-semibold text-[var(--ph-accent-hover)]'
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
