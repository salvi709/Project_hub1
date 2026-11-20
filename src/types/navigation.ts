export type NavSection = 'workspace' | 'resources' | 'system';

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
    path: '/',
    iconName: 'LayoutDashboard',
    section: 'workspace',
    description: 'Workspace summary, upcoming deadlines, and recent activity',
  },
  {
    id: 'projects',
    label: 'My Projects',
    path: '/projects',
    iconName: 'FolderKanban',
    section: 'workspace',
    description: 'Active initiatives, milestones, and linked repositories',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    iconName: 'CheckSquare',
    section: 'workspace',
    description: 'Prioritized task queue and subtask progress',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    iconName: 'Calendar',
    section: 'workspace',
    description: 'Deadlines, sprint milestones, and weekly schedule',
  },
  {
    id: 'github',
    label: 'GitHub',
    path: '/github',
    iconName: 'GitBranch',
    section: 'resources',
    description: 'Connected repositories and pull request readiness',
  },
  {
    id: 'notes',
    label: 'Notes & Resources',
    path: '/notes',
    iconName: 'FileText',
    section: 'resources',
    description: 'Architecture specs, decision logs, and reference links',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    iconName: 'BarChart3',
    section: 'resources',
    description: 'Task throughput, focus cadence, and delivery trends',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    iconName: 'Settings',
    section: 'system',
    description: 'Appearance, authentication status, and PWA installation',
  },
];
