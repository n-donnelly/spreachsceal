import React, { useState, useEffect } from 'react';
import { Character } from '../../types/character';
import { Project } from '../../types/project';
import { CharacterPage } from './CharacterPage';
import { NewCharacterDialog } from './NewCharacterDialog';
import { saveProject } from '../../data/storage';
import './Character.css';

interface CharacterListViewProps {
  project: Project | null;
  onProjectUpdate: (project: Project) => void;
}

export const CharacterListView: React.FC<CharacterListViewProps> = ({ project, onProjectUpdate }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showNewCharacterDialog, setShowNewCharacterDialog] = useState(false);

  useEffect(() => {
    if (project) {
      setCharacters(project.characters || []);
    } else {
      setCharacters([]);
    }
  }, [project]);

  if (!project) {
    return <div className="no-project-selected">No project selected</div>;
  }

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(char => char.id === characterId);
    if (character) {
      setSelectedCharacter(character);
    }
  };

  const handleCharacterDeselect = () => {
    setSelectedCharacter(null);
    // Refresh characters from project
    if (project) {
      setCharacters(project.characters || []);
    }
  };

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    const updatedProject = {
      ...project,
      characters: project.characters.map(char => 
        char.id === updatedCharacter.id ? updatedCharacter : char
      )
    };
    
    onProjectUpdate(updatedProject);
    saveProject(updatedProject);
    setCharacters(updatedProject.characters);
  };

  const handleNewCharacterCreated = () => {
    // Refresh characters from project
    if (project) {
      setCharacters(project.characters || []);
    }
  };

  // If a character is selected, show the character page
  if (selectedCharacter) {
    return (
      <CharacterPage
        character={selectedCharacter}
        project={project}
        onCharacterUpdate={handleCharacterUpdate}
        onDeselect={handleCharacterDeselect}
      />
    );
  }

  // Otherwise, show the characters list
  return (
    <div className="characters-container">
      <div className="characters-header">
        <h1 className="characters-title">Characters</h1>
        <button 
          onClick={() => setShowNewCharacterDialog(true)}
          className="add-character-button"
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
                  
                  {character.aliases.length > 0 && (
                    <div className="character-card-aliases">
                      {character.aliases.slice(0, 3).map((alias, index) => (
                        <span key={index} className="character-card-alias">
                          {alias}
                        </span>
                      ))}
                      {character.aliases.length > 3 && (
                        <span className="character-card-alias">
                          +{character.aliases.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="character-card-description">
                  {character.description || 'No description yet.'}
                </p>
                
                <div className="character-card-stats">
                  <span>{character.aliases.length} aliases</span>
                  <span>{character.notes.length} notes</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {showNewCharacterDialog && (
        <NewCharacterDialog
          projectId={project.id}
          onClose={() => setShowNewCharacterDialog(false)}
          onCreated={handleNewCharacterCreated}
        />
      )}
    </div>
  );
};
