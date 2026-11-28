import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PriorityLevel, ProjectStatus } from '../../types/database';
import type {
  WorkspaceActivityItem,
  WorkspaceNote,
  WorkspaceProject,
  WorkspaceSubtask,
  WorkspaceTask,
  WorkspaceTaskStatus,
} from '../../types/domain';
import { toISODate } from '../../lib/date';
import { SAMPLE_PROJECTS } from '../projects/sampleProjects';
import { SAMPLE_ACTIVITY, SAMPLE_NOTES, SAMPLE_TASKS } from '../tasks/sampleTasks';

const WORKSPACE_STORAGE_KEY = 'projecthub-workspace-v2';

interface WorkspacePersistedState {
  projects: WorkspaceProject[];
  tasks: WorkspaceTask[];
  notes: WorkspaceNote[];
  activity: WorkspaceActivityItem[];
}

export interface ProjectInput {
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  githubRepo?: string;
  targetDate: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  projectId: string | null;
  status: WorkspaceTaskStatus;
  priority: PriorityLevel;
  dueDate: string;
  subtasks?: WorkspaceSubtask[];
}

export interface NoteInput {
  title: string;
  content: string;
  projectId: string | null;
  resourceLinks?: { label: string; url: string }[];
  attachmentNames?: string[];
}

interface WorkspaceContextValue {
  projects: WorkspaceProject[];
  tasks: WorkspaceTask[];
  notes: WorkspaceNote[];
  activity: WorkspaceActivityItem[];
  hasSampleData: boolean;
  getProjectById: (id: string | null) => WorkspaceProject | undefined;
  getProjectProgress: (projectId: string) => number;
  createProject: (input: ProjectInput) => WorkspaceProject;
  updateProject: (id: string, updates: Partial<ProjectInput>) => void;
  deleteProject: (id: string) => void;
  createTask: (input: TaskInput) => WorkspaceTask;
  updateTask: (id: string, updates: Partial<TaskInput>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: WorkspaceTaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  createNote: (input: NoteInput) => WorkspaceNote;
  updateNote: (id: string, updates: Partial<NoteInput>) => void;
  deleteNote: (id: string) => void;
  clearWorkspaceData: () => void;
  restoreSampleData: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

function getDefaultState(): WorkspacePersistedState {
  return {
    projects: SAMPLE_PROJECTS,
    tasks: SAMPLE_TASKS,
    notes: SAMPLE_NOTES,
    activity: SAMPLE_ACTIVITY,
  };
}

function loadInitialState(): WorkspacePersistedState {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<WorkspacePersistedState>;
    if (
      Array.isArray(parsed.projects) &&
      Array.isArray(parsed.tasks) &&
      Array.isArray(parsed.notes) &&
      Array.isArray(parsed.activity)
    ) {
      return {
        projects: parsed.projects,
        tasks: parsed.tasks,
        notes: parsed.notes,
        activity: parsed.activity,
      };
    }
  } catch {
    // Fall back to sample starter state if storage is unreadable
  }
  return getDefaultState();
}

function nowStamp(): string {
  const now = new Date();
  return `Today · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WorkspacePersistedState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const appendActivity = (
    prev: WorkspaceActivityItem[],
    action: string,
    target: string,
    context: string,
    category: WorkspaceActivityItem['category']
  ): WorkspaceActivityItem[] => {
    const item: WorkspaceActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actor: 'You',
      action,
      target,
      context,
      timestamp: nowStamp(),
      category,
      isSample: false,
    };
    return [item, ...prev].slice(0, 30);
  };

  const projectsById = useMemo(() => {
    const map = new Map<string, WorkspaceProject>();
    for (const project of state.projects) {
      map.set(project.id, project);
    }
    return map;
  }, [state.projects]);

  const projectProgressMap = useMemo(() => {
    const taskStats = new Map<string, { total: number; completed: number; inProgress: number }>();
    for (const task of state.tasks) {
      if (!task.projectId) continue;
      const entry = taskStats.get(task.projectId) ?? { total: 0, completed: 0, inProgress: 0 };
      entry.total += 1;
      if (task.status === 'completed') entry.completed += 1;
      else if (task.status === 'in_progress') entry.inProgress += 1;
      taskStats.set(task.projectId, entry);
    }

    const progressMap = new Map<string, number>();
    for (const project of state.projects) {
      if (project.status === 'completed') {
        progressMap.set(project.id, 100);
        continue;
      }
      const stats = taskStats.get(project.id);
      if (!stats || stats.total === 0) {
        progressMap.set(project.id, project.status === 'active' ? 15 : 0);
        continue;
      }
      progressMap.set(
        project.id,
        Math.round(((stats.completed + stats.inProgress * 0.4) / stats.total) * 100)
      );
    }
    return progressMap;
  }, [state.projects, state.tasks]);

  const getProjectById = useCallback(
    (id: string | null) => {
      if (!id) return undefined;
      return projectsById.get(id);
    },
    [projectsById]
  );

  const getProjectProgress = useCallback(
    (projectId: string) => projectProgressMap.get(projectId) ?? 0,
    [projectProgressMap]
  );

  const createProject = useCallback((input: ProjectInput): WorkspaceProject => {
    const today = toISODate(new Date());
    const newProject: WorkspaceProject = {
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category.trim() || 'General',
      status: input.status,
      priority: input.priority,
      githubRepo: input.githubRepo?.trim() || undefined,
      targetDate: input.targetDate,
      createdAt: today,
      updatedAt: today,
      isSample: false,
    };
    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      activity: appendActivity(
        prev.activity,
        'created project',
        newProject.name,
        newProject.category,
        'project'
      ),
    }));
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ProjectInput>) => {
    const today = toISODate(new Date());
    setState((prev) => {
      const existing = prev.projects.find((p) => p.id === id);
      if (!existing) return prev;
      const nextName = updates.name !== undefined ? updates.name.trim() : existing.name;
      const projects = prev.projects.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              name: nextName,
              description:
                updates.description !== undefined ? updates.description.trim() : p.description,
              category: updates.category !== undefined ? updates.category.trim() : p.category,
              githubRepo:
                updates.githubRepo !== undefined
                  ? updates.githubRepo.trim() || undefined
                  : p.githubRepo,
              updatedAt: today,
              isSample: false,
            }
          : p
      );
      return {
        ...prev,
        projects,
        activity: appendActivity(prev.activity, 'updated project', nextName, 'Projects', 'project'),
      };
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState((prev) => {
      const target = prev.projects.find((p) => p.id === id);
      if (!target) return prev;
      return {
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
        tasks: prev.tasks.map((t) => (t.projectId === id ? { ...t, projectId: null } : t)),
        notes: prev.notes.map((n) => (n.projectId === id ? { ...n, projectId: null } : n)),
        activity: appendActivity(prev.activity, 'deleted project', target.name, 'Projects', 'project'),
      };
    });
  }, []);

  const createTask = useCallback((input: TaskInput): WorkspaceTask => {
    const today = toISODate(new Date());
    const newTask: WorkspaceTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      projectId: input.projectId,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      subtasks: input.subtasks ?? [],
      createdAt: today,
      updatedAt: today,
      isSample: false,
    };
    setState((prev) => {
      const projectName =
        prev.projects.find((p) => p.id === newTask.projectId)?.name ?? 'Personal';
      return {
        ...prev,
        tasks: [newTask, ...prev.tasks],
        activity: appendActivity(prev.activity, 'created task', newTask.title, projectName, 'task'),
      };
    });
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<TaskInput>) => {
    const today = toISODate(new Date());
    setState((prev) => {
      const existing = prev.tasks.find((t) => t.id === id);
      if (!existing) return prev;
      const nextTitle = updates.title !== undefined ? updates.title.trim() : existing.title;
      const nextProjectId =
        updates.projectId !== undefined ? updates.projectId : existing.projectId;
      const projectName = prev.projects.find((p) => p.id === nextProjectId)?.name ?? 'Personal';
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                ...updates,
                title: nextTitle,
                description:
                  updates.description !== undefined
                    ? updates.description.trim() || undefined
                    : t.description,
                updatedAt: today,
                isSample: false,
              }
            : t
        ),
        activity: appendActivity(prev.activity, 'updated task', nextTitle, projectName, 'task'),
      };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => {
      const target = prev.tasks.find((t) => t.id === id);
      if (!target) return prev;
      const projectName =
        prev.projects.find((p) => p.id === target.projectId)?.name ?? 'Personal';
      return {
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id),
        activity: appendActivity(prev.activity, 'deleted task', target.title, projectName, 'task'),
      };
    });
  }, []);

  const moveTaskStatus = useCallback((id: string, status: WorkspaceTaskStatus) => {
    const today = toISODate(new Date());
    setState((prev) => {
      const target = prev.tasks.find((t) => t.id === id);
      if (!target || target.status === status) return prev;
      const projectName =
        prev.projects.find((p) => p.id === target.projectId)?.name ?? 'Personal';
      const actionVerb = status === 'completed' ? 'completed task' : `moved task to ${status.replace('_', ' ')}`;
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, status, updatedAt: today, isSample: false } : t
        ),
        activity: appendActivity(prev.activity, actionVerb, target.title, projectName, 'task'),
      };
    });
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    const today = toISODate(new Date());
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              updatedAt: today,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
            }
          : t
      ),
    }));
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    const clean = title.trim();
    if (!clean) return;
    const today = toISODate(new Date());
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              updatedAt: today,
              subtasks: [
                ...t.subtasks,
                {
                  id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  title: clean,
                  completed: false,
                },
              ],
            }
          : t
      ),
    }));
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    const today = toISODate(new Date());
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              updatedAt: today,
              subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
            }
          : t
      ),
    }));
  }, []);

  const createNote = useCallback((input: NoteInput): WorkspaceNote => {
    const today = toISODate(new Date());
    const newNote: WorkspaceNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: input.title.trim(),
      content: input.content.trim(),
      projectId: input.projectId,
      resourceLinks: input.resourceLinks ?? [],
      attachmentNames: input.attachmentNames ?? [],
      updatedAt: today,
      isSample: false,
    };
    setState((prev) => {
      const projectName =
        prev.projects.find((p) => p.id === newNote.projectId)?.name ?? 'General Notes';
      return {
        ...prev,
        notes: [newNote, ...prev.notes],
        activity: appendActivity(prev.activity, 'created note', newNote.title, projectName, 'note'),
      };
    });
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<NoteInput>) => {
    const today = toISODate(new Date());
    setState((prev) => {
      const existing = prev.notes.find((n) => n.id === id);
      if (!existing) return prev;
      const nextTitle = updates.title !== undefined ? updates.title.trim() : existing.title;
      const nextProjectId =
        updates.projectId !== undefined ? updates.projectId : existing.projectId;
      const projectName = prev.projects.find((p) => p.id === nextProjectId)?.name ?? 'General Notes';
      return {
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === id
            ? {
                ...n,
                ...updates,
                title: nextTitle,
                content: updates.content !== undefined ? updates.content.trim() : n.content,
                updatedAt: today,
                isSample: false,
              }
            : n
        ),
        activity: appendActivity(prev.activity, 'updated note', nextTitle, projectName, 'note'),
      };
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setState((prev) => {
      const target = prev.notes.find((n) => n.id === id);
      if (!target) return prev;
      return {
        ...prev,
        notes: prev.notes.filter((n) => n.id !== id),
        activity: appendActivity(prev.activity, 'deleted note', target.title, 'Notes', 'note'),
      };
    });
  }, []);

  const clearWorkspaceData = useCallback(() => {
    setState({ projects: [], tasks: [], notes: [], activity: [] });
  }, []);

  const restoreSampleData = useCallback(() => {
    setState(getDefaultState());
  }, []);

  const hasSampleData = useMemo(
    () =>
      state.projects.some((p) => p.isSample) ||
      state.tasks.some((t) => t.isSample) ||
      state.notes.some((n) => n.isSample),
    [state]
  );

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      projects: state.projects,
      tasks: state.tasks,
      notes: state.notes,
      activity: state.activity,
      hasSampleData,
      getProjectById,
      getProjectProgress,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
      moveTaskStatus,
      toggleSubtask,
      addSubtask,
      deleteSubtask,
      createNote,
      updateNote,
      deleteNote,
      clearWorkspaceData,
      restoreSampleData,
    }),
    [
      state.projects,
      state.tasks,
      state.notes,
      state.activity,
      hasSampleData,
      getProjectById,
      getProjectProgress,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
      moveTaskStatus,
      toggleSubtask,
      addSubtask,
      deleteSubtask,
      createNote,
      updateNote,
      deleteNote,
      clearWorkspaceData,
      restoreSampleData,
    ]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return ctx;
}
