import React from 'react';
import { cn } from '../../lib/utils';

interface BrandLogoProps {
  collapsed?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ collapsed = false, className }) => {
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="64" height="64" rx="16" fill="#9272E8" />
        <rect x="15" y="15" width="14" height="34" rx="4" fill="#FFFFFF" />
        <rect x="33" y="15" width="16" height="15" rx="4" fill="#EEE8FF" />
        <rect x="34.5" y="34.5" width="13" height="13" rx="3.5" stroke="#FFFFFF" strokeWidth="3" />
      </svg>
      {!collapsed && (
        <span className="font-display text-[16px] font-bold tracking-tight text-[var(--ph-text-primary)] whitespace-nowrap shrink-0">
          ProjectHub
        </span>
      )}
    </div>
  );
};
