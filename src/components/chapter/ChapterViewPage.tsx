import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chapter } from '../../types/chapter';
import { NewSceneDialog } from './scene/NewSceneDialog';
import { SceneWritingModal } from './scene/SceneWritingModal';
import './Chapter.css';
import ReadOnlyEditor from '../editor/readonlyeditor';
import { useProject } from '../project/ProjectContext';

export const ChapterViewPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { project, updateProject, loading, error } = useProject();
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [expandedScenes, setExpandedScenes] = useState<Set<number>>(new Set());
  const [showNewSceneDialog, setShowNewSceneDialog] = useState(false);
  const [draggedSceneId, setDraggedSceneId] = useState<number | null>(null);
  const [writingModalSceneId, setWritingModalSceneId] = useState<number | null>(null);

  //convert chapterId to number if needed
  const chapterIdNumber = parseInt(chapterId || '', 10);

  // Find the chapter when project or chapterId changes
  useEffect(() => {
    if (project && chapterId) {
      const foundChapter = project.chapters.find(ch => ch.id === chapterIdNumber);
      if (foundChapter) {
        setChapter(foundChapter);
      } else {
        console.error(`Chapter with ID ${chapterId} not found`);
      }
    }
  }, [project, chapterId]);

  if (loading) {
    return <div className="chapter-loading">Loading project...</div>;
  }

  if (error) {
    return <div className="chapter-error">Error: {error}</div>;
  }

  if (!project) {
    return <div className="chapter-error">Project not found</div>;
  }

  if (!chapter) {
    return (
      <div className="chapter-not-found">
        <h2>Chapter not found</h2>
        <button onClick={() => navigate(`/projects/${project.id}/chapters`)}>
          ← Back to Chapters
        </button>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/projects/${project.id}/chapters`);
  };

  const toggleSceneExpand = (sceneId: number) => {
    const newExpandedScenes = new Set(expandedScenes);
    if (newExpandedScenes.has(sceneId)) {
      newExpandedScenes.delete(sceneId);
    } else {
      newExpandedScenes.add(sceneId);
    }
    setExpandedScenes(newExpandedScenes);
  };

  const updateChapter = (updatedChapter: Chapter) => {
    setChapter(updatedChapter);
    
    const updatedProject = {
      ...project,
      chapters: project.chapters.map(ch => 
        ch.id === updatedChapter.id ? updatedChapter : ch
      )
    };    
    updateProject(updatedProject);
  };

  const handleSceneContentChange = (sceneId: number, content: string) => {
    if (!chapter) return;

    const updatedScenes = chapter.scenes.map(scene => 
      scene.id === sceneId ? { ...scene, content } : scene
    );

    const updatedChapter = { ...chapter, scenes: updatedScenes };
    updateChapter(updatedChapter);
  };

  const handleSceneOverviewChange = (sceneId: number, overview: string) => {
    if (!chapter) return;

    const updatedScenes = chapter.scenes.map(scene => 
      scene.id === sceneId ? { ...scene, overview } : scene
    );

    const updatedChapter = { ...chapter, scenes: updatedScenes };
    updateChapter(updatedChapter);
  };

  const handleNewSceneCreated = () => {
    // Refresh chapter data from project
    if (project && chapterId) {
      const refreshedChapter = project.chapters.find(ch => ch.id === chapterIdNumber);
      if (refreshedChapter) {
        setChapter(refreshedChapter);
      }
    }
  };

  const handleDeleteScene = (sceneId: number) => {
    if (!chapter) return;
    
    if (!window.confirm('Are you sure you want to delete this scene?')) {
      return;
    }

    const updatedScenes = chapter.scenes.filter(scene => scene.id !== sceneId);
    const updatedChapter = { ...chapter, scenes: updatedScenes };
    updateChapter(updatedChapter);
  };

  const moveSceneUp = (sceneId: number) => {
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

  const moveSceneDown = (sceneId: number) => {
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

  const handleDragStart = (e: React.DragEvent, sceneId: number) => {
    setDraggedSceneId(sceneId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sceneId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSceneId: number) => {
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

  const handleOpenWritingModal = (sceneId: number) => {
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
        <button onClick={handleBack} className="back-button">
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
          {chapter.locations && chapter.locations.length > 0 && (
            <span>{chapter.locations.length} locations</span>
          )}
          {chapter.characters && chapter.characters.length > 0 && (
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
