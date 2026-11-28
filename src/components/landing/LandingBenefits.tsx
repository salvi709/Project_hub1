import React from 'react';
import {
  CalendarClock,
  Check,
  FileText,
  FolderKanban,
  GitBranch,
  Layers,
} from 'lucide-react';
import { SectionReveal } from '../ui/MotionPrimitives';

const BENEFITS = [
  {
    title: 'Everything in one workspace.',
    detail: 'Keep projects, tasks, notes, calendar dates, and repository links under one roof.',
    bg: '#EEE8FF',
    ink: '#6545C4',
  },
  {
    title: 'Clear project visibility.',
    detail: 'See active priorities, completion ratios, and target dates without digging through tabs.',
    bg: '#E2F0FF',
    ink: '#2A67A8',
  },
  {
    title: 'Better task organization.',
    detail: 'Switch cleanly between Kanban stages and structured task lists with subtasks.',
    bg: '#DDF5E9',
    ink: '#277554',
  },
  {
    title: 'Easier deadline management.',
    detail: 'Review due-today items alongside monthly, weekly, and daily schedule views.',
    bg: '#FFE8DC',
    ink: '#B35A30',
  },
  {
    title: 'GitHub activity alongside projects.',
    detail: 'Link repositories to deliverables so code context stays connected to your roadmap.',
    bg: '#E2F0FF',
    ink: '#2A67A8',
  },
  {
    title: 'A simple and focused workflow.',
    detail: 'Calm Fresh Lavender light surfaces designed for daily clarity instead of visual noise.',
    bg: '#EEE8FF',
    ink: '#6545C4',
  },
];

const WORKSPACE_MODULES = [
  { label: 'Projects & Milestones', icon: FolderKanban, bg: '#EEE8FF', ink: '#6545C4' },
  { label: 'Tasks & Kanban Stages', icon: Layers, bg: '#DDF5E9', ink: '#277554' },
  { label: 'Deadlines & Schedule', icon: CalendarClock, bg: '#E2F0FF', ink: '#2A67A8' },
  { label: 'GitHub & Project Notes', icon: GitBranch, bg: '#FFE8DC', ink: '#B35A30' },
];

export const LandingBenefits: React.FC = () => {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-[var(--ph-border)] bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Composition */}
          <SectionReveal className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wide text-[var(--ph-accent-text)]">
              Why ProjectHub
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)] sm:text-3xl">
              Less scattered work. More meaningful progress.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ph-text-secondary)] sm:text-base">
              Most personal builders juggle separate tools for to-dos, project timelines, code
              repositories, and technical notes. ProjectHub unites them in one calm workspace.
            </p>

            {/* Minimal Architecture Summary Card */}
            <div className="mt-7 rounded-2xl border border-[var(--ph-border)] bg-[linear-gradient(145deg,#FAF8FF_0%,#FFFFFF_60%,#FFF8F4_100%)] p-5 shadow-[var(--ph-shadow-sm)]">
              <div className="flex items-center justify-between border-b border-[var(--ph-border)] pb-3">
                <span className="font-display text-xs font-bold text-[var(--ph-text-primary)]">
                  Connected Workspace Modules
                </span>
                <FileText className="h-4 w-4 text-[var(--ph-accent)]" />
              </div>
              <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {WORKSPACE_MODULES.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.label}
                      className="flex items-center gap-2.5 rounded-xl border border-[var(--ph-border)] bg-white px-3 py-2.5"
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: mod.bg, color: mod.ink }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium text-[var(--ph-text-primary)]">
                        {mod.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionReveal>

          {/* Right Benefits List */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {BENEFITS.map((benefit, idx) => (
              <SectionReveal key={benefit.title} delay={Math.min(idx * 0.04, 0.16)}>
                <div className="flex h-full items-start gap-3.5 rounded-xl border border-[var(--ph-border)] bg-[var(--ph-bg-primary)]/45 p-4 transition-colors hover:border-[var(--ph-border-hover)] hover:bg-white">
                  <div
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: benefit.bg, color: benefit.ink }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                      {benefit.detail}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
