// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import ProjectHome from './pages/ProjectHome';
import RevisionView from './pages/RevisionView';
import { ProjectView } from './pages/ProjectView';
import { CharacterPage } from './components/character/CharacterPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectHome />} />
      <Route path="/project/:id" element={<ProjectView />} />
      <Route path="/project/:id/revision/:revisionId" element={<RevisionView />} />
      <Route path="/project/:id/characters/:charId" element={<CharacterPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;