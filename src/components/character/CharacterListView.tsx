import React, { useState, useEffect } from 'react';
import { Character, Project } from '../../types';
import { CharacterPage } from './CharacterPage';

interface CharacterListViewProps {
  project: Project | null;
  onProjectUpdate: (project: Project) => void;
}

const CharacterListView: React.FC<CharacterListViewProps> = ({ project, onProjectUpdate }) => {
  const [showNewCharacterForm, setShowNewCharacterForm] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  // Update characters whenever project changes
  useEffect(() => {
    if (project) {
      setCharacters(project.characters || []);
    } else {
      setCharacters([]);
    }
  }, [project]);

  if (!project) {
    return <div>No project selected</div>;
  }

  const onCharacterSelect = (characterId: string) => {
    const character = characters.find(character => character.id === characterId);
    if (character) {
      setSelectedCharacter(character);
      console.log("Selected Character: " + character.name);
    }
  }

  const onCharacterDeselect = () => {
    setSelectedCharacter(null);
    // Ensure we have the latest characters from the project
    if (project) {
      setCharacters(project.characters || []);
    }
    console.log("Deselected Character");
  }

  const handleAddCharacter = () => {
    if (!newCharacterName.trim()) {
      alert('Please enter a name for the character');
      return;
    }

    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: newCharacterName,
      aliases: [],
      notes: [],
      description: '',
      relationships: new Map<string, string>()
    };

    const updatedCharacters = [...characters, newCharacter];
    const updatedProject = {
      ...project,
      characters: updatedCharacters
    };

    onProjectUpdate(updatedProject);
    setCharacters(updatedCharacters);
    setNewCharacterName('');
    setShowNewCharacterForm(false);
    onCharacterSelect(newCharacter.id);
  };

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    const updatedCharacters = characters.map(character => {
      if (character.id === updatedCharacter.id) {
        return updatedCharacter;
      }
      return character;
    });
    
    const updatedProject = { ...project, characters: updatedCharacters };
    onProjectUpdate(updatedProject);
    setCharacters(updatedCharacters);
  }

  const handleCharacterDelete = (characterId: string) => {
    const updatedCharacters = characters.filter(character => character.id !== characterId);
    const updatedProject = { ...project, characters: updatedCharacters };
    onProjectUpdate(updatedProject);
    setCharacters(updatedCharacters);
  }

  if (selectedCharacter) {
    return (
      <CharacterPage
        character={selectedCharacter}
        project={project}
        onDeselect={onCharacterDeselect} 
        onCharacterUpdate={handleCharacterUpdate} 
      />
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Characters</h2>
        <button 
          onClick={() => setShowNewCharacterForm(!showNewCharacterForm)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          {showNewCharacterForm ? 'Cancel' : 'Add Character'}
        </button>
      </div>
  
      {showNewCharacterForm && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">New Character</h3>
          <input
            className="w-full p-2 border rounded mb-3"
            placeholder="Character Name"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
          />
          <div className="flex justify-end">
            <button 
              onClick={handleAddCharacter}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}
  
      {characters.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          No characters added yet. Click "Add Character" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <div 
              key={character.id} 
              className="p-4 border rounded bg-white shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
              onClick={() => onCharacterSelect(character.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{character.name}</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCharacterDelete(character.id);
                  }}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
              {character.description && (
                <p className="text-gray-700 mt-2 line-clamp-3">{character.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterListView;
