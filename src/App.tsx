import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CharacterListView } from './components/character/CharacterListView';
import { CharacterPage } from './components/character/CharacterPage';
import { ProjectsList } from './components/project/ProjectsList';
import ProjectView from './components/project/ProjectView';
import { Dashboard } from './pages/Dashboard';
import { ChapterListView } from './components/chapter/ChapterListView';
import { ChapterViewPage } from './components/chapter/ChapterViewPage';
import { LocationListView } from './components/location/LocationListView';
import { LocationPage } from './components/location/LocationPage';
import NotesList from './components/note/noteslist';
import { OutlinePage } from './components/outline/OutlinePage';
import { EncyclopediaPage } from './components/encylcopedia/EncyclopediaPage';
import { RevisionListView } from './components/revision/RevisionListView';
import RevisionView from './components/revision/RevisionView';
import { ToDoListView } from './components/todo/ToDoListView';
import MorningPages from './pages/MorningPages';
import { AppLayout } from './AppLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/morning-pages" element={<MorningPages />} />
          <Route path="/projects" element={<ProjectsList />} />
          
          <Route path="/projects/:projectId" element={<Dashboard />}>
            <Route index element={<ProjectView />} /> {/* Default/overview */}
            <Route path="todo" element={<ToDoListView />} />
            <Route path="chapters" element={<ChapterListView />} />
            <Route path="chapters/:chapterId" element={<ChapterViewPage />} />
            <Route path="characters" element={<CharacterListView />} />
            <Route path="characters/:characterId" element={<CharacterPage />} />
            <Route path="locations" element={<LocationListView />} />
            <Route path="locations/:locationId" element={<LocationPage />} />
            <Route path="notes" element={<NotesList />} />
            <Route path="outline" element={<OutlinePage />} />
            <Route path="encyclopedia" element={<EncyclopediaPage />} />
            <Route path="revisions" element={<RevisionListView />} />
            <Route path="revisions/:revisionId" element={<RevisionView />} />
            {/* Add other routes as you convert them */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;