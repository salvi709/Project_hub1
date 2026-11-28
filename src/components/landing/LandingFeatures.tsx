import React from 'react';
import {
  BarChart3,
  Calendar,
  CheckSquare,
  FileText,
  FolderKanban,
  GitBranch,
  Kanban,
  LayoutDashboard,
} from 'lucide-react';
import { SectionReveal } from '../ui/MotionPrimitives';

const FEATURES = [
  {
    title: 'Project Management',
    description:
      'Create projects, organize details, monitor progress and manage deadlines.',
    icon: FolderKanban,
    bg: '#EEE8FF',
    ink: '#6545C4',
  },
  {
    title: 'Task Management',
    description:
      'Break projects into actionable tasks, organize priorities and track completion.',
    icon: CheckSquare,
    bg: '#E2F0FF',
    ink: '#2A67A8',
  },
  {
    title: 'Kanban Boards',
    description:
      'Visualize work through clear task stages and manage workflows.',
    icon: Kanban,
    bg: '#DDF5E9',
    ink: '#277554',
  },
  {
    title: 'GitHub Integration',
    description:
      'Connect repositories and keep development activity organized alongside projects.',
    icon: GitBranch,
    bg: '#FFE8DC',
    ink: '#B35A30',
  },
  {
    title: 'Calendar & Deadlines',
    description:
      'Keep track of important dates, upcoming tasks and project milestones.',
    icon: Calendar,
    bg: '#E2F0FF',
    ink: '#2A67A8',
  },
  {
    title: 'Notes & Resources',
    description:
      'Keep project documentation, ideas, links and useful resources together.',
    icon: FileText,
    bg: '#FFE8DC',
    ink: '#B35A30',
  },
  {
    title: 'Productivity Analytics',
    description:
      'Understand project progress and track productivity using available data.',
    icon: BarChart3,
    bg: '#DDF5E9',
    ink: '#277554',
  },
  {
    title: 'Personal Workspace',
    description:
      'Keep all your projects and work organized in one centralized workspace.',
    icon: LayoutDashboard,
    bg: '#EEE8FF',
    ink: '#6545C4',
  },
];

export const LandingFeatures: React.FC = () => {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-y border-[var(--ph-border)] bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-[var(--ph-accent-text)]">
            Platform capabilities
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)] sm:text-3xl">
            Everything you need to keep your work moving.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ph-text-secondary)] sm:text-base">
            Every core workflow in ProjectHub is built to reduce context switching while keeping
            projects, tasks, code links, and notes organized.
          </p>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <SectionReveal key={feature.title} delay={Math.min(index * 0.03, 0.15)}>
                <div className="group flex h-full flex-col rounded-xl border border-[var(--ph-border)] bg-[var(--ph-bg-primary)]/55 p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--ph-border-hover)] hover:bg-white hover:shadow-[var(--ph-shadow-md)]">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-150 group-hover:scale-105"
                    style={{ backgroundColor: feature.bg, color: feature.ink }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-[15px] font-semibold tracking-tight text-[var(--ph-text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
