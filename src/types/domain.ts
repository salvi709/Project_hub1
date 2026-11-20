import type { PriorityLevel, ProjectStatus, TaskStatus } from './database';

export interface SampleProject {
  id: string;
  name: string;
  summary: string;
  category: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  githubRepo?: string;
  targetDate: string;
  tasksCompleted: number;
  tasksTotal: number;
  updatedAt: string;
  isSamplePreview: true;
}

export interface SampleTask {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate: string;
  subtasksDone: number;
  subtasksTotal: number;
  isSamplePreview: true;
}

export interface SampleActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  context: string;
  timestamp: string;
  category: 'project' | 'task' | 'milestone' | 'note';
  isSamplePreview: true;
}

export interface SampleProductivityDay {
  day: string;
  dateLabel: string;
  completed: number;
  planned: number;
  focusHours: number;
}

export interface SampleNotification {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  read: boolean;
  isSamplePreview: true;
}

export interface SampleNote {
  id: string;
  title: string;
  projectContext: string;
  excerpt: string;
  updatedAt: string;
  wordCount: number;
  isSamplePreview: true;
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
  isSamplePreview: true;
}
