import type { PriorityLevel, ProjectStatus } from '../types/database';
import type { WorkspaceTaskStatus } from '../types/domain';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'error' | 'info';

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; variant: BadgeTone }
> = {
  planning: { label: 'Planning', variant: 'info' },
  active: { label: 'Active', variant: 'accent' },
  on_hold: { label: 'On Hold', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  archived: { label: 'Archived', variant: 'neutral' },
};

export const TASK_STATUS_META: Record<
  WorkspaceTaskStatus,
  { label: string; variant: BadgeTone }
> = {
  todo: { label: 'To Do', variant: 'neutral' },
  in_progress: { label: 'In Progress', variant: 'info' },
  completed: { label: 'Completed', variant: 'success' },
  on_hold: { label: 'On Hold', variant: 'warning' },
};

export const PRIORITY_META: Record<
  PriorityLevel,
  { label: string; variant: BadgeTone; rank: number }
> = {
  low: { label: 'Low', variant: 'neutral', rank: 1 },
  medium: { label: 'Medium', variant: 'info', rank: 2 },
  high: { label: 'High', variant: 'warning', rank: 3 },
  urgent: { label: 'Urgent', variant: 'error', rank: 4 },
};
