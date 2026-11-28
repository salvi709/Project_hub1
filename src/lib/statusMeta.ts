import type { PriorityLevel, ProjectStatus } from '../types/database';
import type { WorkspaceTaskStatus } from '../types/domain';

export type BadgeTone =
  | 'neutral'
  | 'accent'
  | 'peach'
  | 'mint'
  | 'sky'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; variant: BadgeTone }
> = {
  planning: { label: 'Planning', variant: 'sky' },
  active: { label: 'Active', variant: 'accent' },
  on_hold: { label: 'On Hold', variant: 'peach' },
  completed: { label: 'Completed', variant: 'mint' },
  archived: { label: 'Archived', variant: 'neutral' },
};

export const TASK_STATUS_META: Record<
  WorkspaceTaskStatus,
  { label: string; variant: BadgeTone }
> = {
  todo: { label: 'To Do', variant: 'accent' },
  in_progress: { label: 'In Progress', variant: 'sky' },
  completed: { label: 'Completed', variant: 'mint' },
  on_hold: { label: 'On Hold', variant: 'peach' },
};

export const PRIORITY_META: Record<
  PriorityLevel,
  { label: string; variant: BadgeTone; rank: number }
> = {
  low: { label: 'Low', variant: 'neutral', rank: 1 },
  medium: { label: 'Medium', variant: 'sky', rank: 2 },
  high: { label: 'High', variant: 'peach', rank: 3 },
  urgent: { label: 'Urgent', variant: 'error', rank: 4 },
};
