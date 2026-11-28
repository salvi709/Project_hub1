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
        width="26"
        height="26"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="64" height="64" rx="14" fill="#15131C" />
        <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" stroke="#373142" strokeWidth="2" />
        <rect x="15" y="15" width="14" height="34" rx="3" fill="#F1EDF8" />
        <rect x="33" y="15" width="16" height="15" rx="3" fill="#A78BFA" />
        <rect x="34.5" y="34.5" width="13" height="13" rx="2.5" stroke="#A78BFA" strokeWidth="3" />
      </svg>
      {!collapsed && (
        <span className="text-[15px] font-semibold tracking-tight text-[var(--ph-text-primary)] whitespace-nowrap shrink-0">
          ProjectHub
        </span>
      )}
    </div>
  );
};
