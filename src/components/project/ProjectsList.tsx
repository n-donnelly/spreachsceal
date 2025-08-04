import React, { useEffect, useState } from "react";
import { Project } from "../../types";
import { useNavigate } from "react-router-dom";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useAuth } from "../../authentication/AuthContext";
import './../../styles/ProjectsList.css';
import ReadOnlyEditor from "../editor/readonlyeditor";
import { useProjectContext } from "./ProjectContext";

interface ProjectListProps {
    project: Project;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onSelect, onDelete }: ProjectListProps) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (window.confirm(`Are you sure you want to delete the project "${project.title}"?`)) {
            onDelete(project.id);
        }
    }

    return (
        <div className="project-card" onClick={() => onSelect(project.id)}>
            <div className="project-card-header">
                <h3>{project.title}</h3>
                <button className="button delete" onClick={handleDelete} title="Delete Project" aria-label={`Delete project ${project.title}`}>
                    X
                </button>
            </div>
            <p>Genre: <strong>{project.genre}</strong></p>
            <p>Chapters: {project.chapters.length}</p>
            <div className="project-card-description">
                <ReadOnlyEditor content={project.description?.substring(0, 100) || 'No description'} />
            </div>
        </div>
    );
}

export const ProjectsList = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { loading, error, getUserProjects, removeProject } = useProjectContext();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, [user]);

    const loadProjects = async () => {
        if (!user) return;
        
        try {
            const loadedProjects = await getUserProjects(user.uid);
            setProjects(loadedProjects);
        } catch (err) {
            console.error('Failed to load projects:', err);
        }
    };

    const handleSelectProject = (id: string) => {
        navigate(`/projects/${id}`);
    };

    const handleDeleteProject = async (id: string) => {
        if (!user) return;

        await removeProject(id);
        await loadProjects();
    };

    const handleProjectCreated = () => {
        loadProjects();
        setIsDialogOpen(false);
    };

    if (loading) {
        return (
            <div className="projects-page">
                <div className="loading-state">Loading projects...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-page">
                <div className="error-state">
                    <p>{error}</p>
                    <button className="button primary" onClick={() => loadProjects()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-page">
            <header className="page-header">
                <h1 className="page-title">Your Projects</h1>
                <button className="button primary" onClick={() => setIsDialogOpen(true)}>
                    Create New Project
                </button>
            </header>

            <main className="projects-container">
                {projects.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Projects Found</h2>
                        <p>Create a new project to get started.</p>
                        <button className="button primary" onClick={() => setIsDialogOpen(true)}>
                            Create New Project
                        </button>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onSelect={handleSelectProject}
                                onDelete={handleDeleteProject}
                            />
                        ))}
                    </div>
                )}
            </main>

            {isDialogOpen && (
                <CreateProjectDialog
                    onClose={() => setIsDialogOpen(false)}
                    onCreated={handleProjectCreated}
                />
            )}
        </div>
    );
};
