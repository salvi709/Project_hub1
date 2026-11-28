export type NavSection = 'main' | 'workspace' | 'preferences';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName:
    | 'LayoutDashboard'
    | 'FolderKanban'
    | 'CheckSquare'
    | 'Calendar'
    | 'GitBranch'
    | 'FileText'
    | 'BarChart3'
    | 'Settings';
  section: NavSection;
  description: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/overview',
    iconName: 'LayoutDashboard',
    section: 'main',
    description: 'Daily focus, active projects, and upcoming deadlines',
  },
  {
    id: 'projects',
    label: 'My Projects',
    path: '/projects',
    iconName: 'FolderKanban',
    section: 'main',
    description: 'Project portfolio, progress, and linked repositories',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    iconName: 'CheckSquare',
    section: 'main',
    description: 'Kanban board, task list, priorities, and subtasks',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    iconName: 'Calendar',
    section: 'main',
    description: 'Monthly, weekly, and daily schedule of deadlines',
  },
  {
    id: 'github',
    label: 'GitHub',
    path: '/github',
    iconName: 'GitBranch',
    section: 'workspace',
    description: 'Account status, repositories, branches, and PR activity',
  },
  {
    id: 'notes',
    label: 'Notes & Resources',
    path: '/notes',
    iconName: 'FileText',
    section: 'workspace',
    description: 'Project notes, specifications, and reference links',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    iconName: 'BarChart3',
    section: 'workspace',
    description: 'Completion breakdown, status distribution, and cadence',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    iconName: 'Settings',
    section: 'preferences',
    description: 'Profile, appearance, account, GitHub, and preferences',
  },
];
