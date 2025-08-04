import { Project } from '../types/project';
import { debounce } from '../utils';
import { FirebaseProjectService } from './FirebaseProjectService';
import { LocalProjectService } from './LocalProjectService';

export class ProjectSyncManager {
    private syncQueue: Set<string> = new Set();
    private isSyncing: boolean = false;

    constructor(
        private localService: LocalProjectService,
        private cloudService: FirebaseProjectService,
        private syncInterval: number = 30000
    ) {
        this.startAutoSync();
    }

    async getLocalProject(projectId: string): Promise<Project> {
        return await this.localService.getProject(projectId);
    }

    async getCloudProject(projectId: string): Promise<Project | null> {
        return await this.cloudService.getProject(projectId);
    }

    async saveLocal(project: Project): Promise<void> {
        await this.localService.saveProject(project);
    }

    async checkForUpdates(projectId: string): Promise<boolean> {
        return await this.cloudService.checkForUpdates(projectId);
    }

    async syncToLocal(project: Project): Promise<void> {
        await this.localService.saveProject(project);
    }

    private startAutoSync = debounce(async () => {
        if (this.isSyncing || this.syncQueue.size === 0) return;

        this.isSyncing = true;
        try {
            for (const projectId of this.syncQueue) {
                const project = await this.localService.getProject(projectId);
                await this.cloudService.syncWithCloud(project);
                this.syncQueue.delete(projectId);
            }
        } finally {
            this.isSyncing = false;
        }
    }, this.syncInterval);

    queueSync(projectId: string): void {
        this.syncQueue.add(projectId);
        this.startAutoSync();
    }

    async forceSyncNow(projectId: string): Promise<void> {
        const project = await this.localService.getProject(projectId);
        await this.cloudService.syncWithCloud(project);
        this.syncQueue.delete(projectId);
    }

    hasPendingChanges(projectId: string): boolean {
        return this.syncQueue.has(projectId);
    }

    async getUserProjects(userId: string): Promise<Project[]> {
        try {
            // First try to get from cloud
            const cloudProjects = await this.cloudService.getUserProjects(userId);
            
            // Save all cloud projects locally
            for (const project of cloudProjects) {
                await this.localService.saveProject(project);
            }
            
            return cloudProjects;
        } catch (error) {
            console.error('Failed to fetch from cloud, falling back to local:', error);
            // Fallback to local storage if cloud fails
            return await this.localService.getUserProjects(userId);
        }
    }

    async removeProject(projectId: string): Promise<void> {
        // Remove from both local and cloud services
        await this.localService.deleteProject(projectId);
        try {
            await this.cloudService.deleteProject(projectId);
        } catch (error) {
            console.error('Failed to delete project from cloud:', error);
        }
    }
}