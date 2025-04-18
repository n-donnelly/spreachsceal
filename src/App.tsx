// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import ProjectHome from './pages/ProjectHome';
import RevisionView from './pages/RevisionView';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectHome />} />
      <Route path="/project/:id" element={<RevisionView />} />
      <Route path="/project/:id/revision/:revisionId" element={<RevisionView />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;