import { useProjectsStore } from './use-projects-store';
import { useTasksStore } from './use-tasks-store';
import { demoProjects } from '../data/demo-projects';
import { demoTasks } from '../data/demo-tasks';

export function initializeDemoData() {
  const projectsStore = useProjectsStore.getState();
  const tasksStore = useTasksStore.getState();

  // Only initialize if stores are empty
  if (projectsStore.projects.length === 0) {
    demoProjects.forEach(project => {
      projectsStore.addProject(project);
    });
  }

  if (tasksStore.tasks.length === 0) {
    demoTasks.forEach(task => {
      tasksStore.addTask(task);
    });
  }
}