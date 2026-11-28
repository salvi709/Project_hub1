import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';

interface LandingFooterProps {
  getStartedPath: string;
  isAuthenticated: boolean;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  getStartedPath,
  isAuthenticated,
}) => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="border-t border-[var(--ph-border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <BrandLogo />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-[var(--ph-text-secondary)]">
              Your projects, plans and progress — all in one workspace.
            </p>
          </div>

          {/* Product Column */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-semibold tracking-wider text-[var(--ph-text-muted)]">
              PRODUCT
            </p>
            <ul className="mt-3.5 space-y-2.5 text-xs">
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)]"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)]"
                >
                  My Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className="text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)]"
                >
                  Task Management
                </Link>
              </li>
              <li>
                <Link
                  to="/github"
                  className="text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)]"
                >
                  GitHub Integration
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold tracking-wider text-[var(--ph-text-muted)]">
              RESOURCES
            </p>
            <ul className="mt-3.5 space-y-2.5 text-xs">
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)]"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => scrollToSection(e, 'about')}
                  className="text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)]"
                >
                  About ProjectHub
                </a>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold tracking-wider text-[var(--ph-text-muted)]">
              ACCOUNT
            </p>
            <ul className="mt-3.5 space-y-2.5 text-xs">
              <li>
                <Link
                  to={isAuthenticated ? '/overview' : '/login'}
                  className="text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)]"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to={getStartedPath}
                  className="font-medium text-[var(--ph-accent-text)] transition-colors hover:text-[var(--ph-accent-hover)]"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--ph-border)] pt-6 text-xs text-[var(--ph-text-muted)] sm:flex-row sm:items-center">
          <p>
            &copy; {currentYear} ProjectHub. All rights reserved.
          </p>
          <p>Designed for calm, focused personal project management.</p>
        </div>
      </div>
    </footer>
  );
};
