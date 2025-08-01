import React, { createContext, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Project } from '../../types/project';
import { getProject, saveProject } from '../../data/storage';

interface ProjectContextType {
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  updateProject: (project: Project) => void;
  getNextId: (type: 'character' | 'location' | 'todoItem' | 'encyclopediaEntry' | 'scene' | 'chapter' | 'note' | 'revision') => number;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const project = getProject(projectId);
      setCurrentProject(project);
    } catch (err) {
      setError("Failed to load project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = (updatedProject: Project) => {
    setCurrentProject(updatedProject);
    try {
      saveProject(updatedProject);
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

  return (
    <ProjectContext.Provider 
      value={{ 
        currentProject, 
        loading, 
        error, 
        updateProject,
        getNextId,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Global cache with timestamp for invalidation
interface CachedProject {
  project: Project;
  timestamp: number;
}

const projectCache = new Map<string, CachedProject>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (projectId: string) => {
    // Check cache first
    const cached = projectCache.get(projectId);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      setProject(cached.project);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const loadedProject = await getProject(projectId);
      if (!loadedProject) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      
      // Update cache
      projectCache.set(projectId, {
        project: loadedProject,
        timestamp: now
      });
      
      setProject(loadedProject);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
      setError(errorMessage);
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updatedProject: Project) => {
    // Optimistic update - update UI immediately
    setProject(updatedProject);
    projectCache.set(updatedProject.id, {
      project: updatedProject,
      timestamp: Date.now()
    });

    try {
      await saveProject(updatedProject);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save project';
      setError(errorMessage);
      console.error('Error saving project:', err);
      
      // Could implement rollback here if needed
      // For now, we'll keep the optimistic update
    }
  };

  const refreshProject = () => {
    if (projectId) {
      // Clear cache and reload
      projectCache.delete(projectId);
      loadProject(projectId);
    }
  };

  return { 
    project, 
    updateProject, 
    refreshProject,
    loading, 
    error,
    projectId 
  };
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
