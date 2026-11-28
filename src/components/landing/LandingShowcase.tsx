import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  Check,
  CheckSquare,
  FileText,
  FolderKanban,
  GitBranch,
  History,
  Kanban,
} from 'lucide-react';
import { PH_EASE, SectionReveal } from '../ui/MotionPrimitives';

type ShowcaseTab = 'overview' | 'kanban' | 'detail';

const SHOWCASE_TABS: { id: ShowcaseTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Project Overview', icon: <FolderKanban className="h-3.5 w-3.5" /> },
  { id: 'kanban', label: 'Kanban Workflow', icon: <Kanban className="h-3.5 w-3.5" /> },
  { id: 'detail', label: 'Milestones & Activity', icon: <History className="h-3.5 w-3.5" /> },
];

const KANBAN_PREVIEW = [
  {
    title: 'To Do',
    headerBg: '#EEE8FF',
    headerInk: '#6545C4',
    surfaceBg: '#F8F6FF',
    items: [
      { title: 'Document RLS policies', meta: 'ProjectHub Core · Medium' },
      { title: 'Outline note schema', meta: 'Docs Workspace · Low' },
    ],
  },
  {
    title: 'In Progress',
    headerBg: '#E2F0FF',
    headerInk: '#2A67A8',
    surfaceBg: '#F4F9FF',
    items: [
      { title: 'Build weekly cadence chart', meta: 'ProjectHub Core · High' },
      { title: 'Verify GitHub branch sync', meta: 'Edge Gateway · Urgent' },
    ],
  },
  {
    title: 'Completed',
    headerBg: '#DDF5E9',
    headerInk: '#277554',
    surfaceBg: '#F3FBF7',
    items: [
      { title: 'Ship Project Detail view', meta: 'ProjectHub Core · High' },
      { title: 'Lock spacing & tokens', meta: 'Design System · Low' },
    ],
  },
];

export const LandingShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('overview');

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wide text-[var(--ph-accent-text)]">
                Inside the workspace
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)] sm:text-3xl">
                Designed to keep projects, tasks, and deadlines clear at a glance.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ph-text-secondary)] sm:text-base">
                Switch between views below to preview how ProjectHub brings active projects, task
                progress, upcoming deadlines, and recent activity together using sample preview
                data.
              </p>
            </div>

            {/* Interactive View Switcher */}
            <div
              role="tablist"
              aria-label="Workspace preview tabs"
              className="inline-flex w-full overflow-x-auto rounded-xl border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-1 sm:w-auto"
            >
              {SHOWCASE_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer ${
                      active
                        ? 'bg-white text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]'
                        : 'text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </SectionReveal>

        {/* Showcase Frame */}
        <SectionReveal delay={0.05} className="mt-8">
          <div className="rounded-2xl border border-[var(--ph-border)] bg-white p-4 shadow-[var(--ph-shadow-md)] sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ph-border)] pb-3 text-xs">
              <span className="font-medium text-[var(--ph-text-primary)]">
                Interactive Workspace Demonstration
              </span>
              <span className="text-[var(--ph-text-muted)]">
                Illustrative sample data · Separate from your account
              </span>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: PH_EASE }}
                  className="grid grid-cols-1 gap-5 lg:grid-cols-12"
                >
                  {/* Active Projects & Task Progress */}
                  <div className="space-y-4 lg:col-span-7">
                    <div className="rounded-xl border border-[var(--ph-border)] bg-[#FAF8FF] p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                          Active Projects &amp; Task Progress
                        </h3>
                        <span className="text-xs text-[var(--ph-text-muted)]">3 active</span>
                      </div>

                      <div className="mt-3 space-y-3">
                        {[
                          {
                            name: 'ProjectHub Web App',
                            meta: 'Product · Linked to salvi709/project_hub',
                            pct: 78,
                            bar: '#9272E8',
                          },
                          {
                            name: 'Edge API Gateway',
                            meta: 'Infrastructure · Due in 5 days',
                            pct: 54,
                            bar: '#4D8CE8',
                          },
                          {
                            name: 'Editorial Design System',
                            meta: 'Design · Completed milestone',
                            pct: 100,
                            bar: '#46A77C',
                          },
                        ].map((item) => (
                          <div
                            key={item.name}
                            className="rounded-xl border border-[var(--ph-border)] bg-white p-3.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                                  {item.name}
                                </p>
                                <p className="mt-0.5 text-[11px] text-[var(--ph-text-secondary)]">
                                  {item.meta}
                                </p>
                              </div>
                              <span className="font-mono text-xs font-semibold text-[var(--ph-text-primary)] tabular-nums">
                                {item.pct}%
                              </span>
                            </div>
                            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${item.pct}%`, backgroundColor: item.bar }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Deadlines & Recent Activity */}
                  <div className="space-y-4 lg:col-span-5">
                    <div className="rounded-xl border border-[var(--ph-border)] bg-white p-4">
                      <h3 className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                        Upcoming Deadlines
                      </h3>
                      <div className="mt-3 divide-y divide-[var(--ph-border)]">
                        {[
                          { title: 'Token contrast & spacing audit', due: 'Today', urgent: true },
                          { title: 'Redis rate-limiter benchmark', due: 'Tomorrow', urgent: false },
                          { title: 'Supabase RLS policy review', due: 'In 3 days', urgent: false },
                        ].map((d) => (
                          <div
                            key={d.title}
                            className="flex items-center justify-between gap-3 py-2.5 text-xs"
                          >
                            <span className="truncate font-medium text-[var(--ph-text-primary)]">
                              {d.title}
                            </span>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 font-mono text-[11px] ${
                                d.urgent
                                  ? 'font-semibold text-[var(--ph-accent-hover)]'
                                  : 'text-[var(--ph-text-secondary)]'
                              }`}
                            >
                              <Calendar className="h-3 w-3" />
                              {d.due}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--ph-border)] bg-white p-4">
                      <h3 className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                        Recent Activity
                      </h3>
                      <div className="mt-3 space-y-2.5">
                        {[
                          {
                            text: 'Completed Project Detail workspace route',
                            time: 'Yesterday · ProjectHub Core',
                            bg: '#DDF5E9',
                            ink: '#277554',
                            icon: <CheckSquare className="h-3.5 w-3.5" />,
                          },
                          {
                            text: 'Updated Gateway Rate-Limit Architecture note',
                            time: '2 days ago · Edge API Gateway',
                            bg: '#FFE8DC',
                            ink: '#B35A30',
                            icon: <FileText className="h-3.5 w-3.5" />,
                          },
                        ].map((act) => (
                          <div key={act.text} className="flex items-start gap-2.5">
                            <div
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                              style={{ backgroundColor: act.bg, color: act.ink }}
                            >
                              {act.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-[var(--ph-text-primary)]">
                                {act.text}
                              </p>
                              <p className="text-[11px] text-[var(--ph-text-muted)]">{act.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'kanban' && (
                <motion.div
                  key="kanban"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: PH_EASE }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  {KANBAN_PREVIEW.map((col) => (
                    <div
                      key={col.title}
                      className="rounded-xl border border-[var(--ph-border)] p-3"
                      style={{ backgroundColor: col.surfaceBg }}
                    >
                      <div
                        className="mb-3 flex items-center justify-between rounded-lg px-3 py-2"
                        style={{ backgroundColor: col.headerBg, color: col.headerInk }}
                      >
                        <span className="font-display text-xs font-bold">{col.title}</span>
                        <span className="font-mono text-[11px] font-semibold tabular-nums">
                          {col.items.length}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {col.items.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-lg border border-[var(--ph-border)] bg-white p-3 shadow-[var(--ph-shadow-sm)]"
                          >
                            <p className="font-display text-xs font-semibold text-[var(--ph-text-primary)]">
                              {item.title}
                            </p>
                            <p className="mt-1 text-[11px] text-[var(--ph-text-secondary)]">
                              {item.meta}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'detail' && (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: PH_EASE }}
                  className="grid grid-cols-1 gap-5 md:grid-cols-12"
                >
                  <div className="rounded-xl border border-[var(--ph-border)] bg-[linear-gradient(125deg,#EEE8FF_0%,#FFFFFF_65%)] p-5 md:col-span-7">
                    <p className="text-[11px] font-medium text-[var(--ph-text-secondary)]">
                      Product Engineering · High priority
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-[var(--ph-text-primary)]">
                      ProjectHub Core Workspace
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                      Centralized project view unifying tasks, subtasks, notes, resource links, and
                      repository milestones.
                    </p>
                    <div className="mt-4 space-y-2">
                      {[
                        { label: 'Workspace navigation & shell', done: true },
                        { label: 'Kanban stage transitions', done: true },
                        { label: 'Calendar deadline synchronization', done: false },
                      ].map((step) => (
                        <div
                          key={step.label}
                          className="flex items-center gap-2.5 rounded-lg border border-[var(--ph-border)] bg-white px-3 py-2 text-xs"
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              step.done
                                ? 'border-[var(--ph-accent)] bg-[var(--ph-accent)] text-white'
                                : 'border-[var(--ph-border-hover)]'
                            }`}
                          >
                            {step.done && <Check className="h-2.5 w-2.5" />}
                          </span>
                          <span
                            className={
                              step.done
                                ? 'line-through text-[var(--ph-text-muted)]'
                                : 'font-medium text-[var(--ph-text-primary)]'
                            }
                          >
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-5">
                    <div className="rounded-xl border border-[var(--ph-border)] bg-[#F5FAFF] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#2A67A8]">
                        <GitBranch className="h-4 w-4" />
                        <span>Linked Repository</span>
                      </div>
                      <p className="mt-1.5 font-mono text-xs font-medium text-[var(--ph-text-primary)]">
                        salvi709/project_hub
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--ph-text-secondary)]">
                        Connect GitHub via Supabase OAuth to sync repository metadata alongside
                        deliverables.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[var(--ph-border)] bg-[#FAF8FF] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ph-lavender-ink)]">
                        <FileText className="h-4 w-4" />
                        <span>Project Notes &amp; Links</span>
                      </div>
                      <p className="mt-1.5 text-xs text-[var(--ph-text-secondary)]">
                        Keep architecture notes, checklists, and reference URLs attached directly to
                        each project.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
