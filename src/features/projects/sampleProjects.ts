import { offsetISODate } from '../../lib/date';
import type { WorkspaceProject } from '../../types/domain';

export const SAMPLE_PROJECTS: WorkspaceProject[] = [
  {
    id: 'proj-sample-1',
    name: 'ProjectHub Core',
    description:
      'Centralized personal workspace with Soft Lavender dual-theme tokens, Supabase persistence readiness, and responsive productivity tools.',
    category: 'Web App',
    status: 'active',
    priority: 'high',
    githubRepo: 'salvi709/project_hub',
    targetDate: offsetISODate(10),
    createdAt: offsetISODate(-14),
    updatedAt: offsetISODate(0),
    isSample: true,
  },
  {
    id: 'proj-sample-2',
    name: 'Edge API Gateway',
    description:
      'Distributed rate-limiting proxy and structured request telemetry pipeline for internal microservices.',
    category: 'Backend',
    status: 'active',
    priority: 'urgent',
    githubRepo: 'salvi709/edge-gateway',
    targetDate: offsetISODate(5),
    createdAt: offsetISODate(-21),
    updatedAt: offsetISODate(-1),
    isSample: true,
  },
  {
    id: 'proj-sample-3',
    name: 'Editorial Design System',
    description:
      'Minimal UI primitive tokens, restrained semantic color scales, and accessible keyboard navigation patterns.',
    category: 'Design System',
    status: 'completed',
    priority: 'medium',
    githubRepo: 'salvi709/lavender-ui',
    targetDate: offsetISODate(-2),
    createdAt: offsetISODate(-30),
    updatedAt: offsetISODate(-2),
    isSample: true,
  },
  {
    id: 'proj-sample-4',
    name: 'Q4 Knowledge Base Sync',
    description:
      'Automated markdown indexing, link validation, and project-scoped resource organization.',
    category: 'Automation',
    status: 'planning',
    priority: 'low',
    targetDate: offsetISODate(22),
    createdAt: offsetISODate(-6),
    updatedAt: offsetISODate(-3),
    isSample: true,
  },
];
