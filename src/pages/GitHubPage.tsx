import React from 'react';
import { GitBranch, GitPullRequest, Info, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAMPLE_REPOS } from '../features/github/sampleRepos';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export const GitHubPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[var(--ph-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--ph-text-primary)]">
            GitHub Repositories
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--ph-text-secondary)]">
            <Info className="h-3.5 w-3.5 text-[var(--ph-accent)] shrink-0" />
            <span>GitHub API sync is not connected in Phase 1 · Repository schema field is prepared</span>
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link to="/settings">
            <Lock className="h-3.5 w-3.5" />
            <span>Check Auth Config</span>
          </Link>
        </Button>
      </div>

      {/* Integration Status Card */}
      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">
              Phase 2 Integration Readiness
            </h3>
            <p className="max-w-2xl text-xs leading-relaxed text-[var(--ph-text-secondary)]">
              Supabase GitHub OAuth sign-in is prepared in the authentication service, and{' '}
              <code className="font-mono text-[11px]">projects.github_repo_full_name</code> is ready
              in PostgreSQL. Live repository fetching, commit feeds, and PR tracking will be built
              in Phase 2.
            </p>
          </div>
          <span className="font-mono text-xs text-amber-600 dark:text-amber-400 shrink-0">
            Not Connected
          </span>
        </div>
      </Card>

      {/* Sample Repository Preview List */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-semibold text-[var(--ph-text-secondary)]">
          Sample Linked Repositories (Preview Only)
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SAMPLE_REPOS.map((repo) => (
            <Card key={repo.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="min-w-0">
                  <CardTitle className="font-mono text-sm truncate">{repo.fullName}</CardTitle>
                  <CardDescription className="mt-1.5 leading-relaxed">
                    {repo.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--ph-border)] pt-3 text-xs text-[var(--ph-text-muted)]">
                  <span>
                    {repo.language} · <span className="font-mono">{repo.branch}</span>
                  </span>
                  <span className="inline-flex items-center gap-3 font-mono tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      {repo.openIssues} issues
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitPullRequest className="h-3 w-3" />
                      {repo.openPrs} PRs
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
