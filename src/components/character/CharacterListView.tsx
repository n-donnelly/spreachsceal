import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Character } from '../../types/character';
import { NewCharacterDialog } from './NewCharacterDialog';
import { useProjectContext } from '../project/ProjectContext';

export const CharacterListView: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject, updateProject } = useProjectContext();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showNewCharacterDialog, setShowNewCharacterDialog] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setCharacters(currentProject.characters || []);
    } else {
      setCharacters([]);
    }
  }, [currentProject]);

  if (!currentProject) {
    return <div className="no-currentProject-selected">No currentProject selected</div>;
  }

  const handleCharacterSelect = (characterId: number) => {
    navigate(`/projects/${currentProject.id}/characters/${characterId}`);
  };

  const handleNewCharacterCreated = (newCharacter: Character) => {
    const updatedProject = {
      ...currentProject,
      characters: [...(currentProject.characters || []), newCharacter]
    };
    updateProject(updatedProject);
    setCharacters((prev) => [...prev, newCharacter]);
    setShowNewCharacterDialog(false);
  };

  const handleDeleteCharacter = (event: React.MouseEvent, characterId: number) => {
    event.stopPropagation();

    if (window.confirm("Are you sure you want to delete this character? This action cannot be undone.")) {
      const updatedProject = {
        ...currentProject,
        characters: currentProject.characters.filter((char) => char.id !== characterId)
      };
      updateProject(updatedProject);
      setCharacters((prev) => prev.filter((char) => char.id !== characterId));
    }    
  };

  return (
    <div className="characters-container">
      <div className="section-header">
        <h1 className="section-title">Characters</h1>
        <button 
          onClick={() => setShowNewCharacterDialog(true)}
          className="default-button"
        >
          Add Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="empty-characters-message">
          No characters yet. Click "Add Character" to create your first character.
        </div>
      ) : (
        <div className="characters-grid">
          {characters
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((character) => (
              <div 
                key={character.id}
                onClick={() => handleCharacterSelect(character.id)}
                className="character-card"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCharacterSelect(character.id);
                  }
                }}
              >
                <div className="character-card-header">
                  <h3 className="character-card-name">{character.name}</h3>
                  <p className="character-card-description">
                    {character.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="character-actions">
                  <button onClick={(e) => handleDeleteCharacter(e, character.id)} className="button delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {showNewCharacterDialog && (
        <NewCharacterDialog
          project={currentProject}
          onClose={() => setShowNewCharacterDialog(false)}
          onCreated={handleNewCharacterCreated}
        />
      )}
    </div>
  );
};
