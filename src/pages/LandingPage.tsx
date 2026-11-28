import React from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { LandingBenefits } from '../components/landing/LandingBenefits';
import { LandingFeatures } from '../components/landing/LandingFeatures';
import { LandingFinalCta } from '../components/landing/LandingFinalCta';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingHowItWorks } from '../components/landing/LandingHowItWorks';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingShowcase } from '../components/landing/LandingShowcase';

export const LandingPage: React.FC = () => {
  const { session, isSupabaseConfigured } = useAuth();
  const isLiveAuthenticated = isSupabaseConfigured && Boolean(session);
  const getStartedPath = isLiveAuthenticated ? '/overview' : '/signup';

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--ph-bg-primary)] text-[var(--ph-text-primary)]">
      <LandingNavbar getStartedPath={getStartedPath} isAuthenticated={isLiveAuthenticated} />
      <main>
        <LandingHero getStartedPath={getStartedPath} />
        <LandingShowcase />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingBenefits />
        <LandingFinalCta getStartedPath={getStartedPath} isAuthenticated={isLiveAuthenticated} />
      </main>
      <LandingFooter getStartedPath={getStartedPath} isAuthenticated={isLiveAuthenticated} />
    </div>
  );
};
