import React, { useState } from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { SAMPLE_TASKS } from '../features/tasks/sampleTasks';
import { cn } from '../lib/utils';
import { formatShortDate } from '../utils/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// November 2026 starts on Sunday (offset 6 in Mon-Sun grid, 30 days)
const NOVEMBER_2026_LEADING_BLANKS = 6;
const NOVEMBER_2026_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

export const CalendarPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const taskDates = new Map<number, typeof SAMPLE_TASKS>();
  SAMPLE_TASKS.forEach((task) => {
    const day = Number(task.dueDate.split('-')[2]);
    if (!Number.isNaN(day)) {
      const existing = taskDates.get(day) ?? [];
      existing.push(task);
      taskDates.set(day, existing);
    }
  });

  const visibleMilestones =
    selectedDay !== null ? taskDates.get(selectedDay) ?? [] : SAMPLE_TASKS;

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--ph-border)] pb-5">
        <h2 className="font-display text-xl font-semibold text-[var(--ph-text-primary)]">
          Schedule &amp; Deadlines
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--ph-text-secondary)]">
          <Info className="h-3.5 w-3.5 text-[var(--ph-accent)] shrink-0" />
          <span>
            Phase 1 calendar layout preview · Select any day to inspect scheduled sample milestones
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader>
            <div>
              <CardTitle>November 2026</CardTitle>
              <CardDescription className="mt-0.5">Monthly deadline overview</CardDescription>
            </div>
            <CalendarIcon className="h-4 w-4 text-[var(--ph-text-muted)]" />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-7 gap-px rounded-lg border border-[var(--ph-border)] bg-[var(--ph-border)] overflow-hidden">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="bg-[var(--ph-bg-elevated)] px-2 py-2 text-center text-xs font-medium text-[var(--ph-text-secondary)]"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: NOVEMBER_2026_LEADING_BLANKS }).map((_, idx) => (
                <div key={`blank-${idx}`} className="min-h-[78px] bg-[var(--ph-bg-primary)]/60 p-2" />
              ))}

              {NOVEMBER_2026_DAYS.map((day) => {
                const dayTasks = taskDates.get(day) ?? [];
                const isToday = day === 20;
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay((prev) => (prev === day ? null : day))}
                    className={cn(
                      'min-h-[78px] bg-[var(--ph-bg-surface)] p-2 flex flex-col justify-between text-left transition-colors hover:bg-[var(--ph-bg-elevated)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ph-accent)] cursor-pointer',
                      isToday && 'bg-[var(--ph-accent-soft)]',
                      isSelected && 'ring-1 ring-inset ring-[var(--ph-accent)] bg-[var(--ph-accent-soft)]'
                    )}
                  >
                    <span
                      className={cn(
                        'font-mono text-xs tabular-nums',
                        isToday || isSelected
                          ? 'font-semibold text-[var(--ph-accent)]'
                          : 'text-[var(--ph-text-secondary)]'
                      )}
                    >
                      {day}
                    </span>
                    <div className="mt-1 space-y-1 w-full">
                      {dayTasks.map((t) => (
                        <div
                          key={t.id}
                          title={t.title}
                          className="truncate rounded bg-[var(--ph-bg-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--ph-text-primary)] border border-[var(--ph-border)]"
                        >
                          {t.title}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>
                {selectedDay !== null ? `Nov ${selectedDay}, 2026` : 'Upcoming Milestones'}
              </CardTitle>
              <CardDescription className="mt-0.5">
                {selectedDay !== null
                  ? 'Scheduled sample items for selected date'
                  : 'Sample scheduled due dates'}
              </CardDescription>
            </div>
            {selectedDay !== null && (
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-xs font-medium text-[var(--ph-accent)] hover:underline cursor-pointer shrink-0"
              >
                Show all
              </button>
            )}
          </CardHeader>
          <CardContent className="divide-y divide-[var(--ph-border)]">
            {visibleMilestones.length === 0 ? (
              <p className="py-6 text-xs text-[var(--ph-text-muted)]">
                No sample milestones scheduled for Nov {selectedDay}.
              </p>
            ) : (
              visibleMilestones.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 py-3 first:pt-1 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[var(--ph-text-primary)] truncate">
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--ph-text-muted)]">
                      {task.projectName}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[var(--ph-accent)] shrink-0 tabular-nums">
                    {formatShortDate(task.dueDate)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
