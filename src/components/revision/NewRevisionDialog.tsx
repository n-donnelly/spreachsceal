import React, { useState } from 'react';
import { Revision } from '../../types/revision';
import { getProject, saveProject } from '../../data/storage';
import './Revision.css';

interface Props {
  projectId: string;
  onClose: () => void;
  onCreated: (versionName: string) => void;
}

export const NewRevisionDialog: React.FC<Props> = ({
  projectId,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a revision name');
      return;
    }

    setIsCreating(true);

    try {
      const project = getProject(projectId);
      
      if (!project) {
        console.error('Project not found');
        alert('Project not found');
        return;
      }

      // Check if revision name already exists
      const existingRevision = project.revisions.find(
        revision => revision.versionName.toLowerCase() === name.trim().toLowerCase()
      );

      if (existingRevision) {
        alert('A revision with this name already exists. Please choose a different name.');
        return;
      }

      // Create a deep copy of the current chapters to avoid reference issues
      const chaptersCopy = JSON.parse(JSON.stringify(project.chapters));

      const newRevision: Revision = {
        id: crypto.randomUUID(),
        versionName: name.trim(),
        chapters: chaptersCopy,
        date: new Date().toISOString()
      };

      // Add the new revision to the project
      const updatedProject = {
        ...project,
        revisions: [...project.revisions, newRevision]
      };

      // Save the updated project
      saveProject(updatedProject);

      // Call the success callback
      onCreated(newRevision.versionName);
      onClose();
    } catch (error) {
      console.error('Error creating revision:', error);
      alert('Failed to create revision. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const generateSuggestedName = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `Revision ${dateStr} ${timeStr}`;
  };

  const handleUseSuggested = () => {
    setName(generateSuggestedName());
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">Create New Revision</h2>
        
        <div className="dialog-info">
          <p className="dialog-description">
            This will create a snapshot of your current project state, including all chapters and scenes.
          </p>
        </div>

        <form onSubmit={handleCreate} className="dialog-form">
          <div className="dialog-field">
            <label htmlFor="revision-name" className="dialog-label">
              Revision Name
            </label>
            <input
              id="revision-name"
              className="dialog-input"
              placeholder="e.g., First Draft, Chapter 5 Complete, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCreating}
              autoFocus
              required
            />
          </div>

          <button
            type="button"
            onClick={handleUseSuggested}
            className="suggested-name-button"
            disabled={isCreating}
          >
            Use suggested name: "{generateSuggestedName()}"
          </button>

          <div className="dialog-footer">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`create-button ${isCreating ? 'loading' : ''}`}
              disabled={isCreating || !name.trim()}
            >
              {isCreating ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating...
                </>
              ) : (
                'Create Revision'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
