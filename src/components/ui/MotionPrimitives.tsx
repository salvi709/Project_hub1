import React from 'react';
import { motion } from 'motion/react';
import { Skeleton } from './Skeleton';

export const PH_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  className,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.22, delay, ease: PH_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Loading view" role="status">
      <div className="rounded-2xl border border-[var(--ph-border)] bg-white p-6">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-3 h-7 w-64" />
        <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-[var(--ph-border)] bg-white p-5 lg:col-span-7">
          <Skeleton className="h-5 w-44" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--ph-border)] bg-white p-5 lg:col-span-5">
          <Skeleton className="h-5 w-40" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
