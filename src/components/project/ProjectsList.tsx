import React, { useEffect, useState } from "react";
import { Project } from "../../types";
import { useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../../data/storage";
import { CreateProjectDialog } from "./CreateProjectDialog";
import './../../styles/ProjectsList.css';
import ReadOnlyEditor from "../editor/readonlyeditor";

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
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        const loadedProjects = getProjects();
        setProjects(loadedProjects);
    };

    const handleSelectProject = (id: string) => {
        navigate(`/projects/${id}`);
    };

    const handleDeleteProject = (id: string) => {
        deleteProject(id);
        loadProjects();
    };

    const handleProjectCreated = () => {
        // Reload projects from storage to get the newly created project
        loadProjects();
        setIsDialogOpen(false);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

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
                    onClose={handleCloseDialog}
                    onCreated={handleProjectCreated}
                />
            )}
       </div>
    );
};
