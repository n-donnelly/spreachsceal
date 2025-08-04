import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Project } from '../../types/project';
import { ProjectSyncManager } from '../../data/ProjectSyncManager';
import { LocalProjectService } from '../../data/LocalProjectService';
import { FirebaseProjectService } from '../../data/FirebaseProjectService';

interface ProjectContextType {
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  updateProject: (project: Project) => void;
  removeProject: (projectId: string) => void;
  getUserProjects: (userId: string) => Promise<Project[]>;
  getNextId: (type: 'character' | 'location' | 'todoItem' | 'encyclopediaEntry' | 'scene' | 'chapter' | 'note' | 'revision') => number;
  hasPendingChanges: boolean;
  forceSyncProject: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const syncManager = useMemo(() => new ProjectSyncManager(
    new LocalProjectService(),
    new FirebaseProjectService()
  ), []);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const getUserProjects = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const projects = await syncManager.getUserProjects(userId);
      return projects; // Return the projects instead of setting currentProject
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  const removeProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      await syncManager.removeProject(projectId);
    } catch (err) {
      setError("Failed to remove project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Get project from local storage first
      const localProject = await syncManager.getLocalProject(projectId);
      setCurrentProject(localProject);

      // Check for updates from cloud
      const hasUpdates = await syncManager.checkForUpdates(projectId);
      if (hasUpdates) {
        const cloudProject = await syncManager.getCloudProject(projectId);
        if (cloudProject) {
          setCurrentProject(cloudProject);
          await syncManager.syncToLocal(cloudProject); // Update local storage
        }
      }
    } catch (err) {
      setError("Failed to load project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updatedProject: Project) => {
    setCurrentProject(updatedProject);
    try {
      // Save locally immediately
      await syncManager.saveLocal(updatedProject);
      // Queue cloud sync
      syncManager.queueSync(updatedProject.id);
    } catch (err) {
      setError("Failed to save project");
      console.error(err);
    }
  };  

  const getNextId = (type: 'character' | 'location' | 'todoItem' | 'encyclopediaEntry' | 'scene' | 'chapter' | 'note' | 'revision') => {
    if (!currentProject) {
      console.warn("No project loaded, cannot get next ID");
      return 1; // Default to 1 if no project is loaded
    }

    const currentId = currentProject.nextIds[type] || 1;
    const updatedIds = {
      ...currentProject.nextIds,
      [type]: currentId + 1
    };
    setCurrentProject((prev) => prev ? { ...prev, nextIds: updatedIds } : null);
    return currentId;  
  };

  const forceSyncProject = async () => {
    if (!currentProject) return;
    try {
      await syncManager.forceSyncNow(currentProject.id);
    } catch (err) {
      setError("Failed to sync project");
      console.error(err);
    }
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        currentProject, 
        loading, 
        error, 
        updateProject,
        removeProject,
        getUserProjects,
        getNextId,
        hasPendingChanges: currentProject ? 
          syncManager.hasPendingChanges(currentProject.id) : false,
        forceSyncProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
