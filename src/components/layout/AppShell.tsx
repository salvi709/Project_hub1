import React, { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { NAVIGATION_ITEMS } from '../../types/navigation';
import { Header } from './Header';
import { OfflineBanner } from './OfflineBanner';
import { SearchCommandModal } from './SearchCommandModal';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const currentNav = useMemo(() => {
    return (
      NAVIGATION_ITEMS.find((item) =>
        item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
      ) ?? NAVIGATION_ITEMS[0]
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[var(--ph-bg-primary)] text-[var(--ph-text-primary)]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          pageTitle={currentNav.label}
          pageSubtitle={currentNav.description}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[1320px]"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <SearchCommandModal open={searchOpen} onOpenChange={setSearchOpen} />
      <OfflineBanner />
    </div>
  );
};
