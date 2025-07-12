import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './ProjectLayout.css';

export const ProjectNavigation: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return null;
  }

  return (
    <nav className="project-navigation">
      <NavLink 
        to={`/projects/${projectId}/chapters`}
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Chapters
      </NavLink>
      <NavLink 
        to={`/projects/${projectId}/characters`}
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Characters
      </NavLink>
      <NavLink 
        to={`/projects/${projectId}/locations`}
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Locations
      </NavLink>
      <NavLink 
        to={`/projects/${projectId}/notes`}
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Notes
      </NavLink>
      <NavLink 
        to={`/projects/${projectId}/outline`}
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Outline
      </NavLink>
      <NavLink 
        to={`/projects/${projectId}/encyclopedia`}
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Encyclopedia
      </NavLink>
    </nav>
  );
};
