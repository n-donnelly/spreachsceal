import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProjectProvider } from '../project/ProjectContext';
import { ProjectNavigation } from './ProjectNavigation';

export const ProjectLayout: React.FC = () => {
  return (
    <ProjectProvider>
      <div className="project-layout">
        {/* Project Header */}
        <header className="project-header">
          <h1>Spréachscéal</h1>
        </header>

        {/* Navigation Bar */}
        <ProjectNavigation />

        {/* Main Content Area - this is where your components will render */}
        <main className="project-content">
          <Outlet />
        </main>
      </div>
    </ProjectProvider>
  );
};
