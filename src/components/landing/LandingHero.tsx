import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FolderKanban,
  GitBranch,
  Layers,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { PH_EASE } from '../ui/MotionPrimitives';

interface LandingHeroProps {
  getStartedPath: string;
}

const PREVIEW_METRICS = [
  { label: 'Projects', value: '4', icon: Layers, bg: '#EEE8FF', ink: '#6545C4' },
  { label: 'Active', value: '2', icon: FolderKanban, bg: '#E2F0FF', ink: '#2A67A8' },
  { label: 'Completed', value: '12', icon: CheckCircle2, bg: '#DDF5E9', ink: '#277554' },
  { label: 'Upcoming', value: '5', icon: Clock, bg: '#FFE8DC', ink: '#B35A30' },
];

const PREVIEW_PROJECTS = [
  {
    name: 'ProjectHub Core',
    category: 'Product · High priority',
    progress: 74,
    tasksLabel: '6/8 tasks',
    repo: 'project_hub',
    softBg: '#EEE8FF',
    ink: '#6545C4',
    bar: '#9272E8',
  },
  {
    name: 'Edge API Gateway',
    category: 'Backend · Urgent',
    progress: 52,
    tasksLabel: '4/7 tasks',
    repo: 'edge-gateway',
    softBg: '#E2F0FF',
    ink: '#2A67A8',
    bar: '#4D8CE8',
  },
];

const PREVIEW_TODAY_TASKS = [
  {
    title: 'Finalize milestone timeline',
    project: 'ProjectHub Core',
    priority: 'High',
    bg: '#E2F0FF',
    done: false,
  },
  {
    title: 'Review API gateway rate limits',
    project: 'Edge API Gateway',
    priority: 'Urgent',
    bg: '#EEE8FF',
    done: false,
  },
  {
    title: 'Ship release checklist notes',
    project: 'Design System',
    priority: 'Medium',
    bg: '#DDF5E9',
    done: true,
  },
];

export const LandingHero: React.FC<LandingHeroProps> = ({ getStartedPath }) => {
  const handleExploreFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('features');
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[var(--ph-border)] bg-[linear-gradient(155deg,#EEE8FF_0%,#F7F5FF_48%,#FFE8DC_100%)] pt-12 pb-16 sm:pt-16 sm:pb-24"
    >
      {/* Subtle geometric background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-8%] h-80 w-80 rounded-full bg-[#E2F0FF]/55 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[-6%] h-72 w-72 rounded-full bg-[#EEE8FF]/70 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Centered Editorial Hero Copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: PH_EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-medium text-[var(--ph-accent-text)]">
            One workspace for everything you&apos;re building.
          </p>

          <h1
            className="mt-3 font-display font-bold tracking-tight text-[var(--ph-text-primary)]"
            style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.65rem)', lineHeight: 1.08 }}
          >
            Your projects. Your plans. One organized workspace.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--ph-text-secondary)] sm:text-[17px]">
            Everything you need to manage projects, organize tasks, track progress and stay on top
            of your work — all in one place.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-6 text-sm w-full sm:w-auto">
              <Link to={getStartedPath}>
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 bg-white/90 px-6 text-sm w-full sm:w-auto hover:bg-white"
            >
              <a href="#features" onClick={handleExploreFeatures}>
                Explore Features
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Faithful Product Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.08, ease: PH_EASE }}
          className="mx-auto mt-12 max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-[var(--ph-border)] bg-white shadow-[0_20px_50px_rgba(41,36,58,0.08),0_4px_16px_rgba(146,114,232,0.08)]">
            {/* Browser Top Chrome */}
            <div className="flex items-center justify-between border-b border-[var(--ph-border)] bg-[#FAF8FF] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E47777]/65" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5A34D]/65" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#46A77C]/65" />
              </div>
              <span className="font-mono text-[11px] text-[var(--ph-text-muted)]">
                ProjectHub · Sample workspace preview
              </span>
              <span className="text-[11px] font-medium text-[var(--ph-accent-text)]">
                Illustrative data
              </span>
            </div>

            {/* Simulated App Frame */}
            <div className="grid grid-cols-1 bg-[var(--ph-bg-primary)] md:grid-cols-12">
              {/* Mini Sidebar */}
              <div className="hidden border-r border-[var(--ph-border)] bg-white p-4 md:col-span-3 md:flex md:flex-col md:justify-between">
                <div className="space-y-4">
                  <div className="rounded-xl border border-[var(--ph-border)] bg-[#FAF8FF] px-3 py-2">
                    <p className="font-display text-xs font-semibold text-[var(--ph-text-primary)]">
                      Personal Workspace
                    </p>
                    <p className="text-[11px] text-[var(--ph-text-muted)]">Sample preview</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    {['Overview', 'My Projects', 'Tasks', 'Calendar', 'GitHub', 'Notes'].map(
                      (item, idx) => (
                        <div
                          key={item}
                          className={`rounded-lg px-2.5 py-2 font-medium ${
                            idx === 0
                              ? 'bg-[var(--ph-lavender-soft)] text-[var(--ph-lavender-ink)] font-semibold'
                              : 'text-[var(--ph-text-secondary)]'
                          }`}
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--ph-border)] bg-[#FAF8FF] p-3 text-[11px] text-[var(--ph-text-secondary)]">
                  Projects, tasks, calendar &amp; GitHub synced in one place.
                </div>
              </div>

              {/* Mini Dashboard Content */}
              <div className="space-y-4 p-4 sm:p-5 md:col-span-9">
                {/* Compact Metrics Strip */}
                <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-[var(--ph-border)] bg-white p-2.5 sm:grid-cols-4">
                  {PREVIEW_METRICS.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label} className="flex items-center gap-2.5 rounded-lg px-2 py-1">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: m.bg, color: m.ink }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-[var(--ph-text-secondary)]">
                            {m.label}
                          </p>
                          <p className="font-display text-sm font-bold text-[var(--ph-text-primary)] tabular-nums">
                            {m.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Two-Column Preview Body */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  {/* Active Projects */}
                  <div className="rounded-xl border border-[var(--ph-border)] bg-white p-4 lg:col-span-7">
                    <div className="flex items-center justify-between border-b border-[var(--ph-border)] pb-2.5">
                      <span className="font-display text-xs font-bold text-[var(--ph-text-primary)]">
                        Active Projects
                      </span>
                      <span className="text-[11px] text-[var(--ph-text-muted)]">Sample view</span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {PREVIEW_PROJECTS.map((proj) => (
                        <div
                          key={proj.name}
                          className="rounded-xl border border-[var(--ph-border)] bg-white p-3"
                        >
                          <p className="text-[10px] font-medium text-[var(--ph-text-secondary)]">
                            {proj.category}
                          </p>
                          <p className="mt-1 font-display text-sm font-semibold text-[var(--ph-text-primary)]">
                            {proj.name}
                          </p>
                          <div className="mt-3 flex items-center justify-between text-[11px]">
                            <span className="text-[var(--ph-text-secondary)]">
                              {proj.tasksLabel}
                            </span>
                            <span className="font-mono font-semibold text-[var(--ph-text-primary)] tabular-nums">
                              {proj.progress}%
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ph-bg-secondary)]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${proj.progress}%`, backgroundColor: proj.bar }}
                            />
                          </div>
                          <div className="mt-2.5 flex items-center justify-between text-[10px] text-[var(--ph-text-muted)]">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              This week
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono">
                              <GitBranch className="h-3 w-3" />
                              {proj.repo}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Today's Priorities */}
                  <div className="rounded-xl border border-[var(--ph-border)] bg-white p-4 lg:col-span-5">
                    <div className="flex items-center justify-between border-b border-[var(--ph-border)] pb-2.5">
                      <span className="font-display text-xs font-bold text-[var(--ph-text-primary)]">
                        Today&apos;s Priorities
                      </span>
                      <span className="text-[11px] font-medium text-[var(--ph-accent-text)]">
                        3 tasks
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {PREVIEW_TODAY_TASKS.map((task) => (
                        <div
                          key={task.title}
                          className="flex items-center justify-between gap-2.5 rounded-lg p-2.5"
                          style={{ backgroundColor: task.bg }}
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                task.done
                                  ? 'border-[var(--ph-accent)] bg-[var(--ph-accent)] text-white'
                                  : 'border-[#29243A]/20 bg-white'
                              }`}
                            >
                              {task.done && <Check className="h-2.5 w-2.5" />}
                            </span>
                            <div className="min-w-0">
                              <p
                                className={`truncate text-xs font-semibold ${
                                  task.done
                                    ? 'line-through text-[var(--ph-text-muted)]'
                                    : 'text-[var(--ph-text-primary)]'
                                }`}
                              >
                                {task.title}
                              </p>
                              <p className="truncate text-[10px] text-[var(--ph-text-secondary)]">
                                {task.project}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] font-medium text-[var(--ph-text-secondary)]">
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
