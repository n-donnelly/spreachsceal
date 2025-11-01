import React, { useState } from 'react';
import { Character } from '../../types/character';
import './character.css';
import { Project } from '../../types';
import { useProjectContext } from '../project/ProjectContext';

interface Props {
  project: Project;
  onClose: () => void;
  onCreated: (charater: Character) => void;
}

export const NewCharacterDialog: React.FC<Props> = ({ project, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { getNextId } = useProjectContext();

  const otherCharacters = project.characters || [];

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('Please enter a character name');
      return;
    }

    setIsCreating(true);

    try {
      const newCharacter: Character = {
        id: getNextId('character'),
        name: name.trim(),
        aliases: [],
        notes: [],
        description: description.trim(),
        relationships: new Map<number, string>()
      };

      onCreated(newCharacter);
      onClose();
    } catch (error) {
      console.error('Error creating character:', error);
      alert('Failed to create character. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">New Character</h2>
        
        <form className="dialog-form" onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
          <div className="dialog-field">
            <label htmlFor="character-name" className="dialog-label">
              Name *
            </label>
            <input
              id="character-name"
              className="dialog-input"
              placeholder="Character name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCreating}
              autoFocus
              required
            />
          </div>

          <div className="dialog-field">
            <label htmlFor="character-description" className="dialog-label">
              Description
            </label>
            <textarea
              id="character-description"
              className="dialog-textarea"
              placeholder="Character description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
            />
          </div>

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
              className="create-button"
              disabled={isCreating || !name.trim()}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
