import React from 'react';
import { FolderPlus, LineChart, UserCheck } from 'lucide-react';
import { SectionReveal } from '../ui/MotionPrimitives';

const STEPS = [
  {
    number: '01',
    title: 'Create Your Workspace',
    description:
      'Set up your personal ProjectHub workspace and connect your account.',
    icon: UserCheck,
    bg: '#EEE8FF',
    ink: '#6545C4',
  },
  {
    number: '02',
    title: 'Organize Your Projects',
    description:
      'Create projects, add tasks, set priorities and organize deadlines.',
    icon: FolderPlus,
    bg: '#E2F0FF',
    ink: '#2A67A8',
  },
  {
    number: '03',
    title: 'Track Your Progress',
    description:
      'Monitor project activity, review tasks and stay on top of your work.',
    icon: LineChart,
    bg: '#DDF5E9',
    ink: '#277554',
  },
];

export const LandingHowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-wide text-[var(--ph-accent-text)]">
            How it works
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)] sm:text-3xl">
            Get organized in three simple steps.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ph-text-secondary)] sm:text-base">
            Start from a clean personal workspace and build steady momentum without complex setup.
          </p>
        </SectionReveal>

        <div className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Subtle Desktop Connecting Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-11 left-[16%] right-[16%] hidden h-px border-t border-dashed border-[var(--ph-border-hover)] md:block"
          />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <SectionReveal key={step.number} delay={idx * 0.06}>
                <div className="relative flex h-full flex-col rounded-2xl border border-[var(--ph-border)] bg-white p-6 shadow-[var(--ph-shadow-sm)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--ph-shadow-md)]">
                  <div className="flex items-center justify-between">
                    <div
                      className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: step.bg, color: step.ink }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-[var(--ph-text-muted)]">
                      Step {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-[var(--ph-text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ph-text-secondary)]">
                    {step.description}
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
