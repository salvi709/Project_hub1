import React, { useState } from 'react';
import { KpiStrip } from '../components/dashboard/KpiStrip';
import { RecentActivitySection } from '../components/dashboard/RecentActivitySection';
import { RecentProjectsSection } from '../components/dashboard/RecentProjectsSection';
import { UpcomingTasksSection } from '../components/dashboard/UpcomingTasksSection';
import { WeeklyProductivityChart } from '../components/dashboard/WeeklyProductivityChart';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { SAMPLE_PROJECTS } from '../features/projects/sampleProjects';
import {
  SAMPLE_ACTIVITY,
  SAMPLE_TASKS,
  SAMPLE_WEEKLY_PRODUCTIVITY,
} from '../features/tasks/sampleTasks';
import type { SampleTask } from '../types/domain';

export const OverviewPage: React.FC = () => {
  const [tasks, setTasks] = useState<SampleTask[]>(SAMPLE_TASKS);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task
      )
    );
  };

  const totalProjects = SAMPLE_PROJECTS.length;
  const activeProjects = SAMPLE_PROJECTS.filter((p) => p.status === 'active').length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'done').length;

  return (
    <div className="space-y-6">
      <WelcomeSection />

      <KpiStrip
        totalProjects={totalProjects}
        activeProjects={activeProjects}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <RecentProjectsSection projects={SAMPLE_PROJECTS} />
          <WeeklyProductivityChart data={SAMPLE_WEEKLY_PRODUCTIVITY} />
        </div>

        <div className="space-y-6 xl:col-span-5">
          <UpcomingTasksSection tasks={tasks} onToggleTask={toggleTask} />
          <RecentActivitySection items={SAMPLE_ACTIVITY} />
        </div>
      </div>
    </div>
  );
};
