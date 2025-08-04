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
import { AuthProvider } from './authentication/AuthContext';
import { PrivateRoute } from './authentication/PrivateRoute';
import { LoginPage } from './authentication/LoginPage';
import { RegisterPage } from './authentication/RegisterPage';
import { ScratchPadView } from './pages/ScratchPadView';
import { ProjectProvider } from './components/project/ProjectContext';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/morning-pages" element={<MorningPages />} />
              
              {/* Protected Routes */}
              <Route
                path="/projects"
                element={
                  <PrivateRoute>
                    <ProjectsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects/:projectId"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              >
                <Route index element={<ProjectView />} />
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
              </Route>
              <Route
                path="/scratchpad"
                element={
                  <PrivateRoute>
                    <ScratchPadView />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;