export type ThemePreference = 'dark' | 'light' | 'system';

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  github_username: string | null;
  role_title: string | null;
  theme_preference: ThemePreference;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  is_personal: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  owner_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: PriorityLevel;
  github_repo_full_name: string | null;
  target_date: string | null;
  progress_percent: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  project_id: string | null;
  creator_id: string;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: PriorityLevel;
  due_date: string | null;
  completed_at: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  workspace_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}
