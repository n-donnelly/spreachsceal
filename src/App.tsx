// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import ProjectHome from './pages/ProjectHome';
import { ProjectView } from './pages/ProjectView';
import { CharacterPage } from './components/character/CharacterPage';
import { LocationPage } from './components/location/LocationPage';
import RevisionView from './components/revision/RevisionView';
import { ChapterPage } from './components/chapter/ChapterPage';
import { OutlinePage } from './components/outline/OutlinePage';
import { EncyclopediaPage } from './components/encylcopedia/EncyclopediaPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectHome />} />
      <Route path="/project/:id" element={<ProjectView />} />
      <Route path="/project/:id/revision/:revisionId" element={<RevisionView />} />
      <Route path="/project/:id/character/:charId" element={<CharacterPage />} />
      <Route path="/project/:id/location/:locationId" element={<LocationPage />} />
      <Route path="/project/:id/chapter/:chapterId" element={<ChapterPage />} />
      <Route path="/project/:id/outline" element={<OutlinePage />} />
      <Route path="/project/:id/encyclopedia" element={<EncyclopediaPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;