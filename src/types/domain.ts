import type { PriorityLevel, ProjectStatus } from './database';

export type WorkspaceTaskStatus = 'todo' | 'in_progress' | 'completed' | 'on_hold';

export interface WorkspaceSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  githubRepo?: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  description?: string;
  projectId: string | null;
  status: WorkspaceTaskStatus;
  priority: PriorityLevel;
  dueDate: string;
  subtasks: WorkspaceSubtask[];
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}

export interface WorkspaceNote {
  id: string;
  title: string;
  content: string;
  projectId: string | null;
  resourceLinks: { label: string; url: string }[];
  attachmentNames: string[];
  updatedAt: string;
  isSample?: boolean;
}

export interface WorkspaceActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  context: string;
  timestamp: string;
  category: 'project' | 'task' | 'note';
  isSample?: boolean;
}

export interface SampleNotification {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  read: boolean;
}

export interface SampleRepoPreview {
  id: string;
  fullName: string;
  description: string;
  language: string;
  branch: string;
  openIssues: number;
  openPrs: number;
  lastPush: string;
  recentCommits: { sha: string; message: string; timestamp: string }[];
}
