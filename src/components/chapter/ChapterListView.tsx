import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chapter } from '../../types/chapter';
import { NewChapterDialog } from './NewChapterDialog';
import './Chapter.css';
import { useProject } from '../project/ProjectContext';

export const ChapterListView: React.FC = () => {
  const navigate = useNavigate();
  const { project, updateProject, loading, error } = useProject();
  const [showNewChapterDialog, setShowNewChapterDialog] = useState(false);

  if (loading) {
    return <div className="chapters-loading">Loading project...</div>;
  }

  if (error) {
    return <div className="chapters-error">Error: {error}</div>;
  }

  if (!project) {
    return <div className="no-project-selected">Project not found</div>;
  }

  const handleChapterClick = (chapterId: number) => {
    navigate(`/projects/${project.id}/chapters/${chapterId}`);
  };

  const handleCreateChapter = (newChapter: Chapter) => {
    const updatedProject = {
      ...project,
      chapters: [...project.chapters, newChapter]
    };
    
    updateProject(updatedProject);
    setShowNewChapterDialog(false);
    
    // Optionally navigate to the new chapter
    // navigate(`/projects/${project.id}/chapters/${newChapter.id}`);
  };

  const handleDeleteChapter = (event: React.MouseEvent, chapterId: number) => {
    event.stopPropagation();

    const updatedChapters = project.chapters.filter(ch => ch.id !== chapterId);
    const updatedProject = {
      ...project,
      chapters: updatedChapters
    };
    updateProject(updatedProject);
  };

  return (
    <div className="chapters-container">
      <div className="section-header">
        <h1 className="section-title">Chapters</h1>
        <button 
          onClick={() => setShowNewChapterDialog(true)}
          className="add-chapter-button"
        >
          Add Chapter
        </button>
      </div>

      {project.chapters.length === 0 ? (
        <div className="empty-chapters-message">
          No chapters yet. Click "Add Chapter" to create your first chapter.
        </div>
      ) : (
        <div className="chapters-grid">
          {project.chapters
            .sort((a, b) => a.index - b.index)
            .map((chapter) => (
              <div 
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                className="chapter-card"
              >
                <div className="chapter-header">
                  <h3 className="chapter-title">
                    Chapter {chapter.index}: {chapter.title}
                  </h3>
                  
                </div>
                <div className="chapter-description">
                  <div className="scenes-count">
                    {chapter.scenes.length} {chapter.scenes.length === 1 ? 'scene' : 'scenes'}
                  </div>
                  <div className="characters-count">
                    {chapter.characters.length} {chapter.characters.length === 1 ? 'character' : 'characters'}
                  </div>
                </div>
                <div className="chapter-actions">
                  <button onClick={($event) => handleDeleteChapter($event, chapter.id)} className="button delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {showNewChapterDialog && (
        <NewChapterDialog
          projectId={project.id}
          onClose={() => setShowNewChapterDialog(false)}
          onCreated={handleCreateChapter}
        />
      )}
    </div>
  );
};

export { ChapterListView as ChaptersList }; // Keep the old export name for backward compatibility
