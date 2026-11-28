import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { SectionReveal } from '../ui/MotionPrimitives';

interface LandingFinalCtaProps {
  getStartedPath: string;
  isAuthenticated: boolean;
}

export const LandingFinalCta: React.FC<LandingFinalCtaProps> = ({
  getStartedPath,
  isAuthenticated,
}) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="overflow-hidden rounded-3xl border border-[var(--ph-border)] bg-[linear-gradient(130deg,#EEE8FF_0%,#FFFFFF_52%,#FFE8DC_100%)] px-6 py-12 text-center shadow-[var(--ph-shadow-md)] sm:px-12 sm:py-16">
            <h2 className="mx-auto max-w-2xl font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)] sm:text-4xl">
              Ready to bring your projects together?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--ph-text-secondary)] sm:text-base">
              Start organizing your projects, managing your tasks and tracking your progress with
              ProjectHub.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <Button asChild size="lg" className="h-11 px-7 text-sm">
                <Link to={getStartedPath}>
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Link
                to={isAuthenticated ? '/overview' : '/login'}
                className="text-xs font-medium text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-accent-hover)]"
              >
                Already have an account?{' '}
                <span className="underline underline-offset-4">Sign In</span>
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
