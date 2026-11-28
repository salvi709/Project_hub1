import type { SampleRepoPreview } from '../../types/domain';

export const SAMPLE_REPOS: SampleRepoPreview[] = [
  {
    id: 'repo-1',
    fullName: 'salvi709/project_hub',
    description: 'Centralized personal project management and productivity workspace.',
    language: 'TypeScript',
    branch: 'main',
    openIssues: 4,
    openPrs: 1,
    lastPush: '2 hours ago',
    recentCommits: [
      { sha: '9e2d41a', message: 'feat(ui): introduce Soft Lavender design tokens', timestamp: '2h ago' },
      { sha: '4c8b102', message: 'fix(pwa): guard dev SW registration under DISABLE_HMR', timestamp: 'Yesterday' },
      { sha: '1a7f90e', message: 'chore(db): add RLS policies for projects and tasks', timestamp: '3d ago' },
    ],
  },
  {
    id: 'repo-2',
    fullName: 'salvi709/edge-gateway',
    description: 'High-throughput API gateway middleware and token-bucket rate limiter.',
    language: 'Go',
    branch: 'feat/token-bucket',
    openIssues: 2,
    openPrs: 2,
    lastPush: 'Yesterday',
    recentCommits: [
      { sha: 'f72a8b1', message: 'perf: reduce redis pipeline allocations on burst limit', timestamp: '1d ago' },
      { sha: '830c19d', message: 'test: add concurrent sliding window benchmark', timestamp: '4d ago' },
    ],
  },
  {
    id: 'repo-3',
    fullName: 'salvi709/lavender-ui',
    description: 'Minimal accessible component primitives and CSS custom property system.',
    language: 'CSS',
    branch: 'main',
    openIssues: 1,
    openPrs: 0,
    lastPush: '5 days ago',
    recentCommits: [
      { sha: '3d91e52', message: 'docs: document dual-theme contrast pairs', timestamp: '5d ago' },
      { sha: 'b12f08a', message: 'refactor: standardize rounded-md controls', timestamp: '1w ago' },
    ],
  },
];
