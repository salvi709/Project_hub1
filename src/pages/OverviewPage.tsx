import React, { useMemo, useState } from 'react';
import { isOverdueISO, isTodayISO } from '../lib/date';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { RecentActivitySection } from '../components/dashboard/RecentActivitySection';
import { RecentProjectsSection } from '../components/dashboard/RecentProjectsSection';
import { UpcomingTasksSection } from '../components/dashboard/UpcomingTasksSection';
import { WeeklyProductivityChart } from '../components/dashboard/WeeklyProductivityChart';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { ProjectFormDialog } from '../components/projects/ProjectFormDialog';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';

export const OverviewPage: React.FC = () => {
  const { projects, tasks } = useWorkspace();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const metrics = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === 'active').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const pendingTasks = tasks.length - completedTasks;
    const dueTodayCount = tasks.filter(
      (t) => t.status !== 'completed' && (isTodayISO(t.dueDate) || isOverdueISO(t.dueDate))
    ).length;

    return {
      totalProjects: projects.length,
      activeProjects,
      completedTasks,
      pendingTasks,
      dueTodayCount,
    };
  }, [projects, tasks]);

  return (
    <div className="space-y-6">
      <WelcomeSection
        {...metrics}
        onNewProject={() => setProjectDialogOpen(true)}
        onNewTask={() => setTaskDialogOpen(true)}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7">
          <RecentProjectsSection onNewProject={() => setProjectDialogOpen(true)} />
        </div>
        <div className="lg:col-span-5">
          <UpcomingTasksSection onNewTask={() => setTaskDialogOpen(true)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <WeeklyProductivityChart />
        </div>
        <div className="lg:col-span-5">
          <RecentActivitySection />
        </div>
      </div>

      <ProjectFormDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} />
      <TaskFormDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} />
    </div>
  );
};
