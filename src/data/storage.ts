import { Project } from '../types';

const PROJECTS_KEY = 'novel-projects';

export function getProjects(): Project[] {
    const projects = localStorage.getItem(PROJECTS_KEY);
    return projects ? JSON.parse(projects) : [];
}

export function getProject(id: string): Project | null {
    const projects = getProjects();
    return projects.find((project) => project.id === id) || null;
}

export function saveProject(project: Project) {
    const projects = getProjects();
    const updatedProjects = projects.map((p) => (p.id === project.id ? project : p));
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
}

export function addProject(project: Project) {
    const projects = getProjects();
    localStorage.setItem(PROJECTS_KEY, JSON.stringify([...projects, project]));
}