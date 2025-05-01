import { useEffect, useState } from "react";
import { Project } from "../../types";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { addProject, getProject, getProjects } from "../../data/storage";
import './../../styles/ProjectsList.css'; // Assuming you have a CSS file for styling

interface ProjectListProps {
    project: Project;
    onSelect: (id: string) => void;
}

export const ProjectCard = ({ project, onSelect }: ProjectListProps) => {
    return (
        <div className="project-card" onClick={() => onSelect(project.id)}>
            <h3>{project.title}</h3>
            <p className="project-description">
                {project.description?.substring(0, 100) || 'No description'}
            </p>
            <p>Genre: {project.genre}</p>
            <p>Chapters: {project.chapters.length}</p>
        </div>
    );
}

export const CreateProjectModal = ({
    isOpen,
    onClose,
    onCreate
}: {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (project: Project) => void;
}) => {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProject: Project = {
            id: uuidv4(),
            title: title.trim(),
            genre: genre.trim(),
            description: description.trim(),
            outline: { content: "", notes: [] },
            chapters: [],
            revisions: [],
            encyclopedia: { entries: [] },
            notes: [],
            characters: [],
            locations: []
        };
        onCreate(newProject);
        setTitle("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a title for your project"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="genre">Genre</label>
                        <input
                            type="text"
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            placeholder="Enter the genre of your project"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter a brief description of your project"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="button secondary">Cancel</button>
                        <button type="submit" className="button primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ProjectsList = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadedProjects = getProjects();
        setProjects(loadedProjects);
    }, []);

    const handleSelectProject = (id: string) => {
        navigate(`/project/${id}`);
    };

    const handleCreateProject = (newProject: Project) => {
        addProject(newProject);
        setProjects([...projects, newProject]);
        navigate(`/project/${newProject.id}`);
        setIsModalOpen(false);
    };

    return (
       <div className="projects-page">
            <header className="page-header">
                <h1 className="page-title">Your Projects</h1>
                <button className="button primary" onClick={() => setIsModalOpen(true)}>Create New Project</button>
            </header>

            <main className="projects-container">
                {projects.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Projects Found</h2>
                        <p>Create a new project to get started.</p>
                        <button className="button primary" onClick={() => setIsModalOpen(true)}>Create New Project</button>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onSelect={handleSelectProject}
                        />
                        ))}
                    </div>
                )}
            </main>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateProject}
            />
       </div>
    );
};