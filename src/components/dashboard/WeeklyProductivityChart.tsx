import React, { useState } from 'react';
import type { SampleProductivityDay } from '../../types/domain';
import { cn } from '../../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface WeeklyProductivityChartProps {
  data: SampleProductivityDay[];
}

export const WeeklyProductivityChart: React.FC<WeeklyProductivityChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [metric, setMetric] = useState<'tasks' | 'hours'>('tasks');

  const maxTasks = Math.max(...data.map((d) => Math.max(d.completed, d.planned)), 1);
  const maxHours = Math.max(...data.map((d) => d.focusHours), 1);

  const totalCompleted = data.reduce((acc, d) => acc + d.completed, 0);
  const totalPlanned = data.reduce((acc, d) => acc + d.planned, 0);
  const totalHours = data.reduce((acc, d) => acc + d.focusHours, 0);

  const activeDay = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <Card>
      <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center">
        <div>
          <CardTitle>Weekly Productivity</CardTitle>
          <CardDescription className="mt-0.5">
            Sample placeholder chart · Hover bars to inspect daily cadence
          </CardDescription>
        </div>

        <div className="inline-flex items-center gap-1 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-primary)] p-1 shrink-0">
          <button
            type="button"
            onClick={() => setMetric('tasks')}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
              metric === 'tasks'
                ? 'bg-[var(--ph-bg-elevated)] text-[var(--ph-text-primary)]'
                : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
            )}
          >
            Tasks Done
          </button>
          <button
            type="button"
            onClick={() => setMetric('hours')}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
              metric === 'hours'
                ? 'bg-[var(--ph-bg-elevated)] text-[var(--ph-text-primary)]'
                : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
            )}
          >
            Focus Hours
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Summary strip */}
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--ph-border)] pb-4">
          <div className="flex items-baseline gap-6">
            <div>
              <div className="text-xs text-[var(--ph-text-muted)]">
                {metric === 'tasks' ? 'Completed this week' : 'Focused this week'}
              </div>
              <div className="mt-0.5 font-display text-2xl font-semibold text-[var(--ph-text-primary)] tabular-nums">
                {metric === 'tasks' ? `${totalCompleted} / ${totalPlanned}` : `${totalHours.toFixed(1)} hrs`}
              </div>
            </div>

            {activeDay && (
              <div className="border-l border-[var(--ph-border)] pl-5">
                <div className="text-xs text-[var(--ph-text-muted)]">
                  {activeDay.day}, {activeDay.dateLabel}
                </div>
                <div className="mt-0.5 font-mono text-sm font-medium text-[var(--ph-accent)] tabular-nums">
                  {metric === 'tasks'
                    ? `${activeDay.completed} completed of ${activeDay.planned} planned`
                    : `${activeDay.focusHours.toFixed(1)} focus hrs`}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--ph-text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--ph-accent)]" />
              {metric === 'tasks' ? 'Completed' : 'Focus Hours'}
            </span>
            {metric === 'tasks' && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[var(--ph-bg-elevated)] border border-[var(--ph-border-hover)]" />
                Planned
              </span>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-2" role="img" aria-label="Weekly productivity sample bar chart">
          {data.map((day, idx) => {
            const completedHeight =
              metric === 'tasks'
                ? Math.round((day.completed / maxTasks) * 140)
                : Math.round((day.focusHours / maxHours) * 140);
            const plannedHeight = Math.round((day.planned / maxTasks) * 140);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={day.day}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="flex h-[152px] w-full items-end justify-center gap-1 rounded-lg px-1 pt-2 transition-colors group-hover:bg-[var(--ph-bg-elevated)]/40">
                  {metric === 'tasks' && (
                    <div
                      className="w-2.5 sm:w-3 rounded-t-sm border border-[var(--ph-border-hover)] bg-[var(--ph-bg-elevated)] transition-all duration-200"
                      style={{ height: `${Math.max(plannedHeight, 6)}px` }}
                    />
                  )}
                  <div
                    className={cn(
                      'w-3 sm:w-4 rounded-t-sm transition-all duration-200',
                      isHovered ? 'bg-emerald-400' : 'bg-[var(--ph-accent)]'
                    )}
                    style={{ height: `${Math.max(completedHeight, 6)}px` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-[var(--ph-text-secondary)]">
                    {day.day}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--ph-text-muted)] tabular-nums">
                    {metric === 'tasks' ? day.completed : `${day.focusHours}h`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
