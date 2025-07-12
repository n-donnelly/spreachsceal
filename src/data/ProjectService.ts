import { Project } from '../types/project';

export interface ProjectService {
  getProject(projectId: string): Promise<Project>;
  saveProject(project: Project): Promise<void>;
  getUserProjects(): Promise<Project[]>;
  deleteProject(projectId: string): Promise<void>;
  createProject(project: Project): Promise<void>;
}
