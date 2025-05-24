import React, { useState } from 'react';
import { Chapter } from '../../types/chapter';
import { getProject } from '../../data/storage';
import { v4 as uuidv4 } from 'uuid';
import './Chapter.css';

interface Props {
  projectId: string;
  onClose: () => void;
  onCreated: (chapter: Chapter) => void;
}

export const NewChapterDialog: React.FC<Props> = ({ projectId, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [index, setIndex] = useState(1);

  const handleCreate = () => {
    const project = getProject(projectId);
    if (!project) {
      console.error('Project not found');
      alert('Project not found');
      return;
    }

    // If there are existing chapters, set the index to be one more than the highest index
    if (project.chapters.length > 0) {
      const highestIndex = Math.max(...project.chapters.map(ch => ch.index));
      setIndex(highestIndex + 1);
    }

    const newChapter: Chapter = {
      id: uuidv4(),
      title: title.trim() || `Chapter ${index}`,
      index,
      scenes: [],
      locations: [],
      characters: [],
      notes: []
    };

    onCreated(newChapter);
    onClose();
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">New Chapter</h2>
        <input
          className="dialog-input"
          placeholder="Chapter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="dialog-input"
          placeholder="Chapter Number"
          type="number"
          value={index}
          onChange={(e) => setIndex(parseInt(e.target.value) || 1)}
        />
        <div className="dialog-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="create-button"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
