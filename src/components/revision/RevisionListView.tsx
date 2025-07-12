import React, { useState } from 'react';
import { Revision } from '../../types/revision';
import './Revision.css';
import { NewRevisionDialog } from './NewRevisionDialog';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../project/ProjectContext';

export const RevisionListView: React.FC = () => {
  const navigate = useNavigate();
  const { project, updateProject } = useProject();
  const [ revisions, setRevisions ] = useState<Revision[]>([]);
  const [showNewRevisionDialog, setShowNewRevisionDialog] = useState(false);

  if (!project) {
    return <div className="no-project-message">No project selected</div>;
  }

  const handleRevisionClick = (revisionId: number) => {
    navigate(`/projects/${project.id}/revisions/${revisionId}`);
  };

  const handleCreateRevision = (versionName: string) => {
    // The NewRevisionDialog handles the creation and saving
    // We just need to refresh the project data
    setShowNewRevisionDialog(false);
  };

  const handleDeleteRevision = (revisionId: number) => {
    if (!project) return;
    
    if (!window.confirm('Are you sure you want to delete this revision? This action cannot be undone.')) {
      return;
    }

    const updatedRevisions = project.revisions.filter(revision => revision.id !== revisionId);
    const updatedProject = {
      ...project,
      revisions: updatedRevisions
    };
    
    updateProject(updatedProject);
    setRevisions(updatedRevisions);
  };

  const handleRestoreRevision = (revisionId: number) => {
    if (!project) return;
    
    if (!window.confirm('Are you sure you want to restore this revision? This will replace your current chapters with the chapters from this revision.')) {
      return;
    }

    const revision = project.revisions.find(r => r.id === revisionId);
    if (!revision) return;

    const updatedProject = {
      ...project,
      chapters: revision.chapters
    };

    updateProject(updatedProject);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getChapterCount = (revision: Revision) => {
    return revision.chapters.length;
  };

  const getSceneCount = (revision: Revision) => {
    return revision.chapters.reduce((total, chapter) => total + chapter.scenes.length, 0);
  };

  return (
    <div className="revisions-container">
      <div className="section-header">
        <h1 className="section-title">Revisions</h1>
        <button 
          onClick={() => setShowNewRevisionDialog(true)}
          className="add-revision-button"
        >
          Create Revision
        </button>
      </div>

      <div className="revisions-info">
        <p className="revisions-description">
          Revisions allow you to save snapshots of your project at different points in time. 
          You can restore any revision to revert your chapters back to that state.
        </p>
      </div>

      {revisions.length === 0 ? (
        <div className="empty-revisions-message">
          No revisions yet. Click "Create Revision" to save a snapshot of your current project state.
        </div>
      ) : (
        <div className="revisions-list">
          {revisions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((revision) => (
              <div 
                key={revision.id}
                className="revision-card"
              >
                <div className="revision-header">
                  <h3 className="revision-name">{revision.versionName}</h3>
                  <div className="revision-actions">
                    <button 
                      onClick={() => handleRestoreRevision(revision.id)}
                      className="restore-button"
                    >
                      Restore
                    </button>
                    <button 
                      onClick={() => handleDeleteRevision(revision.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="revision-details">
                  <div className="revision-date">
                    Created: {formatDate(revision.date)}
                  </div>
                  <div className="revision-stats">
                    <span className="stat-item">
                      {getChapterCount(revision)} chapters
                    </span>
                    <span className="stat-item">
                      {getSceneCount(revision)} scenes
                    </span>
                  </div>
                </div>

                <div className="revision-chapters">
                  <h4 className="chapters-title">Chapters in this revision:</h4>
                  <div className="chapters-list">
                    {revision.chapters.length === 0 ? (
                      <span className="no-chapters">No chapters</span>
                    ) : (
                      revision.chapters
                        .sort((a, b) => a.index - b.index)
                        .map((chapter) => (
                          <div key={chapter.id} className="chapter-item">
                            <span className="chapter-name">
                              Chapter {chapter.index}: {chapter.title}
                            </span>
                            <span className="chapter-scenes">
                              ({chapter.scenes.length} scenes)
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {showNewRevisionDialog && (
        <NewRevisionDialog
          projectId={project.id}
          onClose={() => setShowNewRevisionDialog(false)}
          onCreated={handleCreateRevision}
        />
      )}
    </div>
  );
};
