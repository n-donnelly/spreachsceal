// src/App.tsx
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ProjectProvider } from './components/project/ProjectContext';
import { ProjectsList } from './components/project/ProjectsList';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectsList />} />
      <Route 
        path="/project/:projectId" 
        element={
          <ProjectProvider>
            <Dashboard />
          </ProjectProvider>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};