import React, { useEffect, useState } from 'react';
import type { PriorityLevel, ProjectStatus } from '../../types/database';
import type { WorkspaceProject } from '../../types/domain';
import { offsetISODate } from '../../lib/date';
import { SAMPLE_REPOS } from '../../features/github/sampleRepos';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { useToast } from '../ui/ToastProvider';

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: WorkspaceProject | null;
  onSaved?: (project: WorkspaceProject) => void;
}

export const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  open,
  onOpenChange,
  project,
  onSaved,
}) => {
  const { createProject, updateProject } = useWorkspace();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web App');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [targetDate, setTargetDate] = useState(offsetISODate(14));
  const [githubRepo, setGithubRepo] = useState('');

  useEffect(() => {
    if (!open) return;
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setCategory(project.category);
      setStatus(project.status);
      setPriority(project.priority);
      setTargetDate(project.targetDate);
      setGithubRepo(project.githubRepo ?? '');
    } else {
      setName('');
      setDescription('');
      setCategory('Web App');
      setStatus('active');
      setPriority('medium');
      setTargetDate(offsetISODate(14));
      setGithubRepo('');
    }
  }, [open, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (project) {
      updateProject(project.id, {
        name,
        description,
        category,
        status,
        priority,
        targetDate,
        githubRepo,
      });
      toast({
        title: 'Project updated',
        description: `${name.trim()} changes saved.`,
        variant: 'success',
      });
      onOpenChange(false);
    } else {
      const created = createProject({
        name,
        description,
        category,
        status,
        priority,
        targetDate,
        githubRepo,
      });
      toast({
        title: 'Project created',
        description: `${created.name} added to your workspace.`,
        variant: 'success',
      });
      onSaved?.(created);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogDescription>
          {project
            ? 'Update project details, timeline, and linked repository.'
            : 'Create a project to organize tasks, deadlines, notes, and repositories.'}
        </DialogDescription>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="project-name" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
              Project name
            </label>
            <Input
              id="project-name"
              required
              placeholder="e.g., Customer Onboarding Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="project-desc" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
              Description
            </label>
            <Textarea
              id="project-desc"
              placeholder="Concise summary of goals and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="project-category" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
                Category
              </label>
              <Input
                id="project-category"
                placeholder="Web App, Backend, Design..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="project-target" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
                Target deadline
              </label>
              <Input
                id="project-target"
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="project-status" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
                Status
              </label>
              <Select
                id="project-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="project-priority" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
                Priority
              </label>
              <Select
                id="project-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="project-repo" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
              Linked GitHub repository (optional)
            </label>
            <Input
              id="project-repo"
              list="sample-github-repos"
              placeholder="owner/repository"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
            />
            <datalist id="sample-github-repos">
              {SAMPLE_REPOS.map((r) => (
                <option key={r.id} value={r.fullName} />
              ))}
            </datalist>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {project ? 'Save changes' : 'Create project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
