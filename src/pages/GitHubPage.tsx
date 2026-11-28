import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Code2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Github,
  Link2,
  Search,
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../features/auth/AuthContext';
import { SAMPLE_REPOS } from '../features/github/sampleRepos';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../components/ui/ToastProvider';

export const GitHubPage: React.FC = () => {
  const { user, profile, isSupabaseConfigured } = useAuth();
  const { projects, updateProject } = useWorkspace();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedRepoId, setSelectedRepoId] = useState<string>(SAMPLE_REPOS[0]?.id ?? '');
  const [linkProjectId, setLinkProjectId] = useState<string>('');
  const [connecting, setConnecting] = useState(false);

  const githubUsername =
    profile?.github_username ||
    (user?.user_metadata?.user_name as string | undefined) ||
    null;

  const isConnected =
    user?.app_metadata?.provider === 'github' || Boolean(githubUsername);

  const filteredRepos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SAMPLE_REPOS;
    return SAMPLE_REPOS.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q)
    );
  }, [search]);

  const activeRepo =
    filteredRepos.find((r) => r.id === selectedRepoId) ?? filteredRepos[0] ?? null;

  const handleConnectGitHub = async () => {
    if (!isSupabaseConfigured) {
      toast({
        title: 'Supabase OAuth required',
        description:
          'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY with GitHub provider enabled.',
        variant: 'warning',
      });
      return;
    }
    setConnecting(true);
    try {
      const res = await authService.signInWithGitHub();
      if (res.error) {
        toast({ title: 'GitHub connection failed', description: res.error, variant: 'error' });
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleLinkRepoToProject = () => {
    if (!activeRepo || !linkProjectId) return;
    updateProject(linkProjectId, { githubRepo: activeRepo.fullName });
    const proj = projects.find((p) => p.id === linkProjectId);
    toast({
      title: 'Repository linked',
      description: `${activeRepo.fullName} linked to ${proj?.name ?? 'project'}.`,
      variant: 'success',
    });
    setLinkProjectId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)]">
            GitHub Integration
          </h2>
          <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
            Account connection status, repository inspector, branches, commits, and project linking.
          </p>
        </div>

        <Badge variant={isConnected ? 'mint' : 'neutral'}>
          {isConnected ? `Connected · @${githubUsername ?? 'github'}` : 'Account not connected'}
        </Badge>
      </div>

      {/* Honest Account Banner */}
      <section className="rounded-2xl border border-[var(--ph-border)] bg-[linear-gradient(125deg,#EEE8FF_0%,#FFFFFF_55%,#E2F0FF_100%)] p-5 shadow-[var(--ph-shadow-sm)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--ph-text-primary)] shadow-[var(--ph-shadow-sm)]">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--ph-text-primary)]">
                {isConnected
                  ? `Signed in as @${githubUsername ?? 'GitHub User'}`
                  : 'GitHub OAuth is not connected'}
              </h3>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--ph-text-secondary)]">
                {isConnected
                  ? 'Your Supabase session includes GitHub identity metadata. Live repository sync uses GitHub OAuth scopes configured on your Supabase project.'
                  : 'No live GitHub OAuth session is active. Repositories listed below are clearly labeled sample previews so you can test linking repositories to projects without fabricated connection claims.'}
              </p>
            </div>
          </div>

          {!isConnected && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnectGitHub}
              disabled={connecting}
              className="shrink-0"
            >
              <Github className="h-3.5 w-3.5" />
              <span>{connecting ? 'Redirecting...' : 'Connect GitHub'}</span>
            </Button>
          )}
        </div>
      </section>

      {/* Split Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Repo Cards List */}
        <Card className="lg:col-span-5">
          <CardHeader className="border-b border-[var(--ph-border)] pb-3">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle>Repository Previews</CardTitle>
                <Badge variant="accent">Sample data</Badge>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-muted)]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search repositories..."
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 space-y-2">
            {filteredRepos.length === 0 ? (
              <p className="py-8 text-center text-xs text-[var(--ph-text-muted)]">
                No repositories match &ldquo;{search}&rdquo;.
              </p>
            ) : (
              filteredRepos.map((repo) => {
                const selected = activeRepo?.id === repo.id;
                return (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => setSelectedRepoId(repo.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-[var(--ph-accent)] bg-[var(--ph-lavender-soft)]/50 shadow-[var(--ph-shadow-sm)]'
                        : 'border-[var(--ph-border)] bg-white hover:border-[var(--ph-border-hover)] hover:bg-[#FAF8FF]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-xs font-bold text-[var(--ph-text-primary)]">
                        {repo.fullName}
                      </span>
                      <Badge variant="sky">
                        <Code2 className="h-3 w-3" />
                        {repo.language}
                      </Badge>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs text-[var(--ph-text-secondary)]">
                      {repo.description}
                    </p>
                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[var(--ph-text-muted)]">
                      <span className="inline-flex items-center gap-1">
                        <GitBranch className="h-3 w-3 text-[var(--ph-accent)]" />
                        {repo.branch}
                      </span>
                      <span>{repo.openIssues} issues</span>
                      <span>{repo.openPrs} PRs</span>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Inspector & Linker */}
        <div className="space-y-6 lg:col-span-7">
          {activeRepo ? (
            <Card>
              <CardHeader className="border-b border-[var(--ph-border)] pb-4">
                <div>
                  <CardTitle className="font-mono text-base">{activeRepo.fullName}</CardTitle>
                  <CardDescription className="mt-1">{activeRepo.description}</CardDescription>
                </div>
                <Badge variant="accent">{activeRepo.branch}</Badge>
              </CardHeader>

              <CardContent className="space-y-5 pt-5">
                {/* Pastel Stats Strip */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-[var(--ph-peach-soft)] p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ph-peach-ink)]">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Open Issues
                    </div>
                    <p className="mt-1 font-display text-xl font-bold text-[var(--ph-text-primary)] tabular-nums">
                      {activeRepo.openIssues}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--ph-sky-soft)] p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ph-sky-ink)]">
                      <GitPullRequest className="h-3.5 w-3.5" />
                      Pull Requests
                    </div>
                    <p className="mt-1 font-display text-xl font-bold text-[var(--ph-text-primary)] tabular-nums">
                      {activeRepo.openPrs}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--ph-mint-soft)] p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ph-mint-ink)]">
                      <GitBranch className="h-3.5 w-3.5" />
                      Last Push
                    </div>
                    <p className="mt-1 font-display text-base font-bold text-[var(--ph-text-primary)]">
                      {activeRepo.lastPush}
                    </p>
                  </div>
                </div>

                {/* Project Linker */}
                <div className="rounded-xl border border-[var(--ph-border)] bg-[#FAF8FF] p-4">
                  <p className="font-display text-xs font-semibold text-[var(--ph-text-primary)]">
                    Link repository to a ProjectHub project
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--ph-text-secondary)]">
                    Linked projects surface branch and commit metadata on their Project Detail page.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <div className="flex-1">
                      <Select
                        aria-label="Select project to link"
                        value={linkProjectId}
                        onChange={(e) => setLinkProjectId(e.target.value)}
                      >
                        <option value="">Choose a project...</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}{' '}
                            {p.githubRepo === activeRepo.fullName ? '(Already linked)' : ''}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={!linkProjectId}
                      onClick={handleLinkRepoToProject}
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      Link repository
                    </Button>
                  </div>

                  {projects.some((p) => p.githubRepo === activeRepo.fullName) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[var(--ph-text-secondary)]">
                      <span>Linked projects:</span>
                      {projects
                        .filter((p) => p.githubRepo === activeRepo.fullName)
                        .map((p) => (
                          <Link
                            key={p.id}
                            to={`/projects/${p.id}`}
                            className="rounded-md bg-[var(--ph-lavender-soft)] px-2 py-0.5 font-medium text-[var(--ph-lavender-ink)] hover:underline"
                          >
                            {p.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>

                {/* Recent Commits */}
                <div>
                  <h4 className="mb-2.5 font-display text-xs font-semibold text-[var(--ph-text-primary)]">
                    Recent Commits (Sample Preview)
                  </h4>
                  <div className="space-y-2">
                    {activeRepo.recentCommits.map((commit) => (
                      <div
                        key={commit.sha}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--ph-border)] bg-white px-3.5 py-2.5 text-xs"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <GitCommit className="h-3.5 w-3.5 shrink-0 text-[var(--ph-accent)]" />
                          <span className="rounded bg-[var(--ph-bg-secondary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ph-text-primary)]">
                            {commit.sha}
                          </span>
                          <span className="truncate text-[var(--ph-text-primary)]">
                            {commit.message}
                          </span>
                        </div>
                        <span className="shrink-0 text-[11px] text-[var(--ph-text-muted)]">
                          {commit.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-xs text-[var(--ph-text-muted)]">
              Select a repository to inspect details.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
