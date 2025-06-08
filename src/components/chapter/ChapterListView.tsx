import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Chapter } from '../../types/chapter';
import { saveProject } from '../../data/storage';
import { NewChapterDialog } from './NewChapterDialog';
import { ChapterViewPage } from './ChapterViewPage';
import './Chapter.css';

interface ChaptersListProps {
  project: Project | null;
  onProjectUpdate: (project: Project) => void;
}

export const ChaptersList: React.FC<ChaptersListProps> = ({ 
  project, 
  onProjectUpdate
}) => {
  const [showNewChapterDialog, setShowNewChapterDialog] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  if (!project) {
    return <div>No project selected</div>;
  }

  const handleChapterClick = (chapterId: string) => {
    setSelectedChapterId(chapterId);
  };

  const handleCreateChapter = (newChapter: Chapter) => {
    const updatedProject = {
      ...project,
      chapters: [...project.chapters, newChapter]
    };
    
    onProjectUpdate(updatedProject);
    saveProject(updatedProject);
  };

  // If a chapter is selected, show the chapter view page
  if (selectedChapterId) {
    return (
      <ChapterViewPage
        project={project}
        chapterId={selectedChapterId}
        onProjectUpdate={onProjectUpdate}
        onBack={() => setSelectedChapterId(null)}
      />
    );
  }

  // Otherwise, show the chapters list
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
                  <span className="scenes-count">
                    {chapter.scenes.length} {chapter.scenes.length === 1 ? 'scene' : 'scenes'}
                  </span>
                </div>
                {chapter.scenes.length > 0 && (
                  <div className="scenes-list">
                    Scenes: {chapter.scenes.map(scene => scene.number).join(', ')}
                  </div>
                )}
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
