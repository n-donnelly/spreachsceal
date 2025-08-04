import { Timestamp } from 'firebase/firestore';
import { Project } from '../types/project';
import { ProjectService } from './ProjectService';

export class LocalProjectService implements ProjectService {
  private readonly PROJECT_PREFIX = 'spreachsceal_project_';
  private readonly PROJECTS_LIST_KEY = 'spreachsceal_projects_list';
  private readonly CLOUD_SYNC_TIME_KEY = 'spreachsceal_cloud_sync_';

  async syncWithCloud(project: Project): Promise<void> {
    // Store the sync time for this project
    localStorage.setItem(
      `${this.CLOUD_SYNC_TIME_KEY}${project.id}`, 
      Date.now().toString()
    );
  }

  async checkForUpdates(projectId: string): Promise<boolean> {
    const lastSyncStr = localStorage.getItem(`${this.CLOUD_SYNC_TIME_KEY}${projectId}`);
    if (!lastSyncStr) return false;

    const project = await this.getProject(projectId);
    const lastSync = parseInt(lastSyncStr);
    const projectUpdateTime = project.updatedAt.toMillis();

    return projectUpdateTime > lastSync;
  }

  async getCloudVersion(projectId: string): Promise<Project | null> {
    // In local storage, we don't have a separate cloud version
    // Return the local version instead
    try {
      return await this.getProject(projectId);
    } catch {
      return null;
    }
  }

  async getProject(projectId: string): Promise<Project> {
    try {
      const stored = localStorage.getItem(`${this.PROJECT_PREFIX}${projectId}`);
      if (!stored) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading project:', error);
      throw new Error('Failed to load project');
    }
  }

  async saveProject(project: Project): Promise<void> {
    try {
      project.updatedAt = new Timestamp(Date.now() / 1000, 0); // Update timestamp
      localStorage.setItem(`${this.PROJECT_PREFIX}${project.id}`, JSON.stringify(project));
      
      // Update projects list
      await this.updateProjectsList(project);
    } catch (error) {
      console.error('Error saving project:', error);
      throw new Error('Failed to save project');
    }
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const projectsListJson = localStorage.getItem(this.PROJECTS_LIST_KEY);
      if (!projectsListJson) {
        return [];
      }

      const projectIds: string[] = JSON.parse(projectsListJson);
      const projects: Project[] = [];

      for (const projectId of projectIds) {
        try {
          const project = await this.getProject(projectId);
          projects.push(project);
        } catch (error) {
          // Project might have been deleted, remove from list
          console.warn(`Project ${projectId} not found, removing from list`);
          await this.removeFromProjectsList(projectId);
        }
      }

      return projects.sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error('Error loading projects list:', error);
      return [];
    }
  }

  async createProject(project: Project): Promise<void> {
    await this.saveProject(project);
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.PROJECT_PREFIX}${projectId}`);
      await this.removeFromProjectsList(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }

  private async updateProjectsList(project: Project): Promise<void> {
    const projectsListJson = localStorage.getItem(this.PROJECTS_LIST_KEY);
    let projectIds: string[] = projectsListJson ? JSON.parse(projectsListJson) : [];
    
    if (!projectIds.includes(project.id)) {
      projectIds.push(project.id);
      localStorage.setItem(this.PROJECTS_LIST_KEY, JSON.stringify(projectIds));
    }
  }

  private async removeFromProjectsList(projectId: string): Promise<void> {
    const projectsListJson = localStorage.getItem(this.PROJECTS_LIST_KEY);
    if (projectsListJson) {
      let projectIds: string[] = JSON.parse(projectsListJson);
      projectIds = projectIds.filter(id => id !== projectId);
      localStorage.setItem(this.PROJECTS_LIST_KEY, JSON.stringify(projectIds));
    }
  }
}
