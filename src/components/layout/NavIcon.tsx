import React from 'react';
import {
  BarChart3,
  Calendar,
  CheckSquare,
  FileText,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import type { NavItem } from '../../types/navigation';

interface NavIconProps {
  name: NavItem['iconName'];
  className?: string;
}

export const NavIcon: React.FC<NavIconProps> = ({ name, className = 'h-4 w-4' }) => {
  switch (name) {
    case 'LayoutDashboard':
      return <LayoutDashboard className={className} />;
    case 'FolderKanban':
      return <FolderKanban className={className} />;
    case 'CheckSquare':
      return <CheckSquare className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'GitBranch':
      return <GitBranch className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'Settings':
      return <Settings className={className} />;
  }
};
