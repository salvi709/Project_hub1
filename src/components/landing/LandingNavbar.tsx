import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { PH_EASE } from '../ui/MotionPrimitives';

interface LandingNavbarProps {
  getStartedPath: string;
  isAuthenticated: boolean;
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  getStartedPath,
  isAuthenticated,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 14);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    const target = document.getElementById(href.slice(1));
    if (target) {
      e.preventDefault();
      setMobileOpen(false);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-200',
        scrolled
          ? 'border-b border-[var(--ph-border)] bg-white/90 shadow-[var(--ph-shadow-sm)] backdrop-blur-md'
          : 'border-b border-transparent bg-[var(--ph-bg-primary)]/80 backdrop-blur-sm'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileOpen(false);
          }}
          className="shrink-0 focus-visible:outline-none"
        >
          <BrandLogo />
        </a>

        {/* Zone 2: Section Navigation */}
        <nav aria-label="Landing navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleSectionClick(e, item.href)}
              className="relative py-1 text-sm font-medium text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)] whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[var(--ph-accent)] after:transition-all after:duration-200 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Auth Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            to={isAuthenticated ? '/overview' : '/login'}
            className="px-3 py-2 text-sm font-medium text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-text-primary)] whitespace-nowrap shrink-0"
          >
            Sign In
          </Link>
          <Button asChild size="md">
            <Link to={getStartedPath}>
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--ph-border)] bg-white text-[var(--ph-text-primary)] transition-colors hover:bg-[var(--ph-bg-hover)] md:hidden cursor-pointer"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: PH_EASE }}
            className="border-b border-[var(--ph-border)] bg-white px-4 pb-5 pt-2 shadow-[var(--ph-shadow-md)] md:hidden"
          >
            <nav className="flex flex-col space-y-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleSectionClick(e, item.href)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--ph-text-secondary)] transition-colors hover:bg-[var(--ph-bg-hover)] hover:text-[var(--ph-text-primary)]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2.5 border-t border-[var(--ph-border)] pt-4">
              <Button asChild variant="outline" size="md" className="w-full">
                <Link
                  to={isAuthenticated ? '/overview' : '/login'}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="primary" size="md" className="w-full">
                <Link to={getStartedPath} onClick={() => setMobileOpen(false)}>
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
