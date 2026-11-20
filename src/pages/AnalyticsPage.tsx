import React from 'react';
import { BarChart3, Info } from 'lucide-react';
import { WeeklyProductivityChart } from '../components/dashboard/WeeklyProductivityChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { SAMPLE_WEEKLY_PRODUCTIVITY } from '../features/tasks/sampleTasks';

export const AnalyticsPage: React.FC = () => {
  const totalCompleted = SAMPLE_WEEKLY_PRODUCTIVITY.reduce((sum, d) => sum + d.completed, 0);
  const totalPlanned = SAMPLE_WEEKLY_PRODUCTIVITY.reduce((sum, d) => sum + d.planned, 0);
  const totalHours = SAMPLE_WEEKLY_PRODUCTIVITY.reduce((sum, d) => sum + d.focusHours, 0);
  const completionRate = Math.round((totalCompleted / totalPlanned) * 100);

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--ph-border)] pb-5">
        <h2 className="font-display text-xl font-semibold text-[var(--ph-text-primary)]">
          Analytics
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--ph-text-secondary)]">
          <Info className="h-3.5 w-3.5 text-[var(--ph-accent)] shrink-0" />
          <span>Phase 1 placeholder · Historical analytics backend is deferred to later phases</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--ph-text-secondary)]">Sample Completion Rate</span>
            <BarChart3 className="h-4 w-4 text-[var(--ph-accent)]" />
          </div>
          <div className="mt-3 font-display text-3xl font-semibold text-[var(--ph-text-primary)] tabular-nums">
            {completionRate}%
          </div>
          <p className="mt-1.5 text-xs text-[var(--ph-text-muted)]">
            {totalCompleted} of {totalPlanned} sample weekly tasks
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-[var(--ph-text-secondary)]">Sample Focus Time</span>
          <div className="mt-3 font-display text-3xl font-semibold text-[var(--ph-text-primary)] tabular-nums">
            {totalHours.toFixed(1)} hrs
          </div>
          <p className="mt-1.5 text-xs text-[var(--ph-text-muted)]">
            Cumulative 7-day sample cadence
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-[var(--ph-text-secondary)]">Analytics Backend</span>
          <div className="mt-3 font-display text-xl font-semibold text-amber-400">
            Phase 2+ Scope
          </div>
          <p className="mt-1.5 text-xs text-[var(--ph-text-muted)]">
            Will aggregate real Supabase task &amp; commit events
          </p>
        </Card>
      </div>

      <WeeklyProductivityChart data={SAMPLE_WEEKLY_PRODUCTIVITY} />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Planned Telemetry Architecture</CardTitle>
            <CardDescription className="mt-0.5">
              Future analytical queries without breaking Phase 1 schema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs leading-relaxed text-[var(--ph-text-secondary)]">
            Once Phase 2 persistence is active, analytics will compute task throughput directly from{' '}
            <code className="font-mono text-[11px]">tasks.completed_at</code>, project velocity from{' '}
            <code className="font-mono text-[11px]">projects.progress_percent</code>, and optional
            GitHub repository activity scoped per <code className="font-mono text-[11px]">workspace_id</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
