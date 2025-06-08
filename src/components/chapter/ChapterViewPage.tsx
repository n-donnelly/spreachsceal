import React, { useState, useEffect } from 'react';
import { Project } from '../../types/project';
import { Chapter } from '../../types/chapter';
import { NewSceneDialog } from './scene/NewSceneDialog';
import { SceneWritingModal } from './scene/SceneWritingModal';
import './Chapter.css';
import RichTextEditor from '../editor/texteditor';
import ReadOnlyEditor from '../editor/readonlyeditor';

interface ChapterViewPageProps {
  project: Project;
  chapterId: string;
  onProjectUpdate: (project: Project) => void;
  onBack: () => void;
}

export const ChapterViewPage: React.FC<ChapterViewPageProps> = ({
  project,
  chapterId,
  onProjectUpdate,
  onBack
}) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(new Set());
  const [showNewSceneDialog, setShowNewSceneDialog] = useState(false);
  const [draggedSceneId, setDraggedSceneId] = useState<string | null>(null);
  const [writingModalSceneId, setWritingModalSceneId] = useState<string | null>(null);

  useEffect(() => {
    const foundChapter = project.chapters.find(ch => ch.id === chapterId);
    if (foundChapter) {
      setChapter(foundChapter);
    }
  }, [project, chapterId]);

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  const toggleSceneExpand = (sceneId: string) => {
    const newExpandedScenes = new Set(expandedScenes);
    if (newExpandedScenes.has(sceneId)) {
      newExpandedScenes.delete(sceneId);
    } else {
      newExpandedScenes.add(sceneId);
    }
    setExpandedScenes(newExpandedScenes);
  };

  const handleSceneContentChange = (sceneId: string, content: string) => {
    if (!chapter) return;

    const updatedScenes = chapter.scenes.map(scene => 
      scene.id === sceneId ? { ...scene, content } : scene
    );

    const updatedChapter = { ...chapter, scenes: updatedScenes };
    updateChapter(updatedChapter);
  };

  const handleSceneOverviewChange = (sceneId: string, overview: string) => {
    if (!chapter) return;

    const updatedScenes = chapter.scenes.map(scene => 
      scene.id === sceneId ? { ...scene, overview } : scene
    );

    const updatedChapter = { ...chapter, scenes: updatedScenes };
    updateChapter(updatedChapter);
  };

  const updateChapter = (updatedChapter: Chapter) => {
    setChapter(updatedChapter);
    
    const updatedProject = {
      ...project,
      chapters: project.chapters.map(ch => 
        ch.id === updatedChapter.id ? updatedChapter : ch
      )
    };    
    onProjectUpdate(updatedProject);
  };

  const handleNewSceneCreated = () => {
    // Refresh chapter data from project
    const refreshedChapter = project.chapters.find(ch => ch.id === chapterId);
    if (refreshedChapter) {
      setChapter(refreshedChapter);
    }
  };

  const handleDeleteScene = (sceneId: string) => {
    if (!chapter) return;
    
    if (!window.confirm('Are you sure you want to delete this scene?')) {
      return;
    }

    const updatedScenes = chapter.scenes.filter(scene => scene.id !== sceneId);
    const updatedChapter = { ...chapter, scenes: updatedScenes };
    updateChapter(updatedChapter);
  };

  const moveSceneUp = (sceneId: string) => {
    if (!chapter) return;
    
    const scenes = [...chapter.scenes].sort((a, b) => a.number - b.number);
    const currentIndex = scenes.findIndex(scene => scene.id === sceneId);
    
    if (currentIndex > 0) {
      // Swap the scene numbers
      const currentScene = scenes[currentIndex];
      const previousScene = scenes[currentIndex - 1];
      
      const updatedScenes = chapter.scenes.map(scene => {
        if (scene.id === currentScene.id) {
          return { ...scene, number: previousScene.number };
        }
        if (scene.id === previousScene.id) {
          return { ...scene, number: currentScene.number };
        }
        return scene;
      });

      const updatedChapter = { ...chapter, scenes: updatedScenes };
      updateChapter(updatedChapter);
    }
  };

  const moveSceneDown = (sceneId: string) => {
    if (!chapter) return;
    
    const scenes = [...chapter.scenes].sort((a, b) => a.number - b.number);
    const currentIndex = scenes.findIndex(scene => scene.id === sceneId);
    
    if (currentIndex < scenes.length - 1) {
      // Swap the scene numbers
      const currentScene = scenes[currentIndex];
      const nextScene = scenes[currentIndex + 1];
      
      const updatedScenes = chapter.scenes.map(scene => {
        if (scene.id === currentScene.id) {
          return { ...scene, number: nextScene.number };
        }
        if (scene.id === nextScene.id) {
          return { ...scene, number: currentScene.number };
        }
        return scene;
      });

      const updatedChapter = { ...chapter, scenes: updatedScenes };
      updateChapter(updatedChapter);
    }
  };

  const handleDragStart = (e: React.DragEvent, sceneId: string) => {
    setDraggedSceneId(sceneId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sceneId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSceneId: string) => {
    e.preventDefault();
    
    if (!draggedSceneId || !chapter || draggedSceneId === targetSceneId) {
      setDraggedSceneId(null);
      return;
    }

    const scenes = [...chapter.scenes].sort((a, b) => a.number - b.number);
    const draggedScene = scenes.find(scene => scene.id === draggedSceneId);
    const targetScene = scenes.find(scene => scene.id === targetSceneId);

    if (!draggedScene || !targetScene) {
      setDraggedSceneId(null);
      return;
    }

    // Swap the scene numbers
    const updatedScenes = chapter.scenes.map(scene => {
      if (scene.id === draggedScene.id) {
        return { ...scene, number: targetScene.number };
      }
      if (scene.id === targetScene.id) {
        return { ...scene, number: draggedScene.number };
      }
      return scene;
    });

    const updatedChapter = { ...chapter, scenes: updatedScenes };
    updateChapter(updatedChapter);
    setDraggedSceneId(null);
  };

  const handleDragEnd = () => {
    setDraggedSceneId(null);
  };

  const handleOpenWritingModal = (sceneId: string) => {
    setWritingModalSceneId(sceneId);
  };

  const handleCloseWritingModal = () => {
    setWritingModalSceneId(null);
  };

  const writingModalScene = writingModalSceneId 
    ? chapter.scenes.find(scene => scene.id === writingModalSceneId)
    : null;

  return (
    <div className="chapter-view-container">
      <div className="chapter-view-header">
        <button onClick={onBack} className="back-button">
          ← Back to Chapters
        </button>
        <h1 className="chapter-view-title">
          Chapter {chapter.index}: {chapter.title}
        </h1>
        <button 
          onClick={() => setShowNewSceneDialog(true)}
          className="add-scene-button"
        >
          Add Scene
        </button>
      </div>

      <div className="chapter-info">
        <div className="chapter-stats">
          <span>{chapter.scenes.length} scenes</span>
          {chapter.locations.length > 0 && (
            <span>{chapter.locations.length} locations</span>
          )}
          {chapter.characters.length > 0 && (
            <span>{chapter.characters.length} characters</span>
          )}
        </div>
      </div>

      {chapter.scenes.length === 0 ? (
        <div className="empty-scenes-message">
          No scenes yet. Click "Add Scene" to create your first scene.
        </div>
      ) : (
        <div className="scenes-container">
          {chapter.scenes
            .sort((a, b) => a.number - b.number)
            .map((scene) => (
              <div 
                key={scene.id} 
                className={`scene-card ${draggedSceneId === scene.id ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, scene.id)}
              >
                <div 
                  className="scene-header"
                  draggable
                  onDragStart={(e) => handleDragStart(e, scene.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => toggleSceneExpand(scene.id)}
                >
                  <div className="scene-drag-handle">
                    <span className="drag-icon">⋮⋮</span>
                  </div>
                  <h3 className="scene-title">
                    Scene {scene.number}
                  </h3>
                  <div className="scene-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenWritingModal(scene.id);
                      }}
                      className="focus-write-button"
                      title="Open in full-screen editor"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSceneUp(scene.id);
                      }}
                      className="move-button"
                      disabled={scene.number === 1}
                    >
                      ↑
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSceneDown(scene.id);
                      }}
                      className="move-button"
                      disabled={scene.number === chapter.scenes.length}
                    >
                      ↓
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteScene(scene.id);
                      }}
                      className="delete-button"
                    >
                      Delete
                    </button>
                    <span className="expand-icon">
                      {expandedScenes.has(scene.id) ? '▼' : '►'}
                    </span>
                  </div>
                </div>
                
                <div className="scene-overview-editor">
                  <h4>Overview:</h4>
                  <textarea
                    value={scene.overview}
                    onChange={(e) => handleSceneOverviewChange(scene.id, e.target.value)}
                    className="overview-textarea"
                    placeholder="Scene overview..."
                  />
                </div>

                {expandedScenes.has(scene.id) && (
                  <div className="scene-content">
                    <div className="scene-editor">
                      
                      <ReadOnlyEditor
                        content={scene.content || '<p>No content yet. Click "Edit Content" to start writing.</p>'}
                        className="scene-content-display"
                      />
                    </div>
                    <button 
                        onClick={() => handleOpenWritingModal(scene.id)}
                        className="focus-write-button footer-button"
                      >
                        Edit Content
                      </button>
                  </div>
                )}

              </div>
            ))}
        </div>
      )}

      {showNewSceneDialog && (
        <NewSceneDialog
          projectId={project.id}
          chapterId={chapter.id}
          nextSceneNumber={chapter.scenes.length + 1}
          onClose={() => setShowNewSceneDialog(false)}
          onCreated={handleNewSceneCreated}
        />
      )}

      {writingModalSceneId && (
        (() => {
          const currentScene = chapter.scenes.find(scene => scene.id === writingModalSceneId);
          return currentScene ? (
            <SceneWritingModal
              sceneNumber={currentScene.number}
              content={currentScene.content}
              overview={currentScene.overview}
              onContentChange={(content) => handleSceneContentChange(currentScene.id, content)}
              onClose={handleCloseWritingModal}
            />
          ) : null;
        })()
      )}

    </div>
  );
};
