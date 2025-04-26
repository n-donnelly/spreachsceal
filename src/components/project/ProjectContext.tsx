import { createContext, useContext, useEffect, useState } from "react";
import { Project } from "../../types";
import { getProject } from "../../data/storage";
import { useParams } from "react-router-dom";

interface ProjectContextType {
    currentProject: Project | null;
    loading: boolean;
    error: string | null;
    saveProject: (project: Project) => Promise<void>;
    setCurrentProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
    children: React.ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const { projectId } = useParams<{ projectId: string }>();
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (projectId) {
            loadProject(projectId);
        }
    }
    , [projectId]);

    const loadProject = async (projectId: string) => {
        setLoading(true);
        setError(null);
        try {
            const project = getProject(projectId); // Assume this function fetches the project
            setCurrentProject(project);
        } catch (err) {
            setError("Failed to load project");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const saveProject = async (updates: Partial<Project>) => {
        if (!currentProject) return;
        
        setLoading(true);
        setError(null);
        try {
            // Assume this function saves the project
            await saveProject(updates); // This function should be defined to save the project
        } catch (err) {
            setError("Failed to save project");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectContext.Provider 
            value={{ 
                currentProject, 
                loading, 
                error, 
                saveProject, 
                setCurrentProject 
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = (): ProjectContextType => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
}