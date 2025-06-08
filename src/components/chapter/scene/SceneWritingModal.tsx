import React, { useState, useEffect } from 'react';
import RichTextEditor from '../../editor/texteditor';
import './SceneWritingModal.css';

interface SceneWritingModalProps {
  sceneNumber: number;
  content: string;
  overview: string;
  onContentChange: (content: string) => void;
  onClose: () => void;
}

export const SceneWritingModal: React.FC<SceneWritingModalProps> = ({
  sceneNumber,
  content,
  overview,
  onContentChange,
  onClose
}) => {
  const [localContent, setLocalContent] = useState(content);
  const [localOverview, setLocalOverview] = useState(overview);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalContent(content);
    setLocalOverview(overview);
    setHasUnsavedChanges(false);
  }, [content, overview]);

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onContentChange(localContent);
    setHasUnsavedChanges(false);
  };

  const handleSaveAndClose = () => {
    handleSave();
    onClose();
  }

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Do you want to save before closing?')) {
        handleSave();
      }
    }
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasUnsavedChanges, localContent, localOverview]);

  return (
    <div className="scene-writing-overlay">
      <div className="scene-writing-modal">
        <div className="scene-writing-header">
          <div className="scene-writing-title">
            <h2>Scene {sceneNumber}</h2>
            {hasUnsavedChanges && <span className="unsaved-indicator">•</span>}
          </div>
          <div className="scene-writing-actions">
            <button 
              onClick={handleSave}
              className="save-button"
              disabled={!hasUnsavedChanges}
            >
              Save (Ctrl+S)
            </button>
            <button 
              onClick={handleClose}
              className="close-button"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="scene-writing-content">
          <div className="scene-editor-section">
            <div className="scene-editor-container">
              <RichTextEditor
                content={localContent}
                onChange={handleContentChange}
                placeholder="Write your scene here..."
                className="fullscreen-editor"
              />
            </div>
          </div>
        </div>

        <div className="scene-writing-footer">
          <div className="writing-stats">
            <span>Words: {localContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</span>
            <span>Characters: {localContent.replace(/<[^>]*>/g, '').length}</span>
          </div>
          <div className="footer-actions">
            <button onClick={handleClose} className="cancel-button">
              Close
            </button>
            <button 
              onClick={handleSaveAndClose}
              className="save-button primary"
              disabled={!hasUnsavedChanges}
            >
              Save and Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
