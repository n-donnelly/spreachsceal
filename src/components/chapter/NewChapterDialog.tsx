import React, { useState } from 'react';
import { Chapter } from '../../types/chapter';
import { useProjectContext } from '../project/ProjectContext';
import './chapter.css';

interface Props {
  onClose: () => void;
  onCreated: (chapter: Chapter) => void;
}

export const NewChapterDialog: React.FC<Props> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [index, setIndex] = useState(1);
  const { currentProject, getNextId } = useProjectContext(); // Use the context to get the next ID function

  const handleCreate = () => {
    if (!currentProject) {
      console.error('Project not found');
      alert('Project not found');
      return;
    }

    // If there are existing chapters, set the index to be one more than the highest index
    if (currentProject.chapters.length > 0) {
      const highestIndex = Math.max(...currentProject.chapters.map(ch => ch.index));
      setIndex(highestIndex + 1);
    }

    const newChapter: Chapter = {
      id: getNextId('chapter'),
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
