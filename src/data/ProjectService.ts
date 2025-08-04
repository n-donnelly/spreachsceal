import { Project } from '../types/project';

export interface ProjectService {
  getProject(projectId: string): Promise<Project>;
  saveProject(project: Project): Promise<void>;
  getUserProjects(userId: string): Promise<Project[]>;
  deleteProject(projectId: string): Promise<void>;
  createProject(project: Project): Promise<void>;
  syncWithCloud(project: Project): Promise<void>;
  checkForUpdates(projectId: string): Promise<boolean>;
  getCloudVersion(projectId: string): Promise<Project | null>;
}
