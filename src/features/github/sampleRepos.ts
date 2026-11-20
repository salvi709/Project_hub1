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
    isSamplePreview: true,
  },
  {
    id: 'repo-2',
    fullName: 'salvi709/edge-gateway',
    description: 'High-throughput API gateway middleware and rate limiter.',
    language: 'Go',
    branch: 'feat/token-bucket',
    openIssues: 2,
    openPrs: 2,
    lastPush: 'Yesterday',
    isSamplePreview: true,
  },
  {
    id: 'repo-3',
    fullName: 'salvi709/obsidian-tokens',
    description: 'Semantic dark-mode design tokens and CSS custom properties.',
    language: 'CSS',
    branch: 'main',
    openIssues: 0,
    openPrs: 0,
    lastPush: 'Nov 12',
    isSamplePreview: true,
  },
];
