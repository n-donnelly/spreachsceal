import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../types';

const ProjectHome = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const createProject = () => {
        const newProject: Project = {
            id: uuidv4(),
            title: 'New Project',
            description: 'Project description',
            revisions: [],
            encyclopedia: {},
            notes: [],
            characters: [],
            locations: [],
            genre: 'Fiction'
        };
        setProjects([...projects, newProject]);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Your Projects</h1>
            <button onClick={createProject} className="mt-2">+ New Project</button>
            <ul className="mt-4">
                {projects.map((project) => (
                <li key={project.id}>
                    <a href={`/project/${project.id}`}>{project.title}</a>
                </li>
                ))}
            </ul>
        </div>
    )
};

export default ProjectHome;