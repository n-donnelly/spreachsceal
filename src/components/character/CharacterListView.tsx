
import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../../types';

interface CharacterListViewProps {
  characters: Character[];
}

const CharacterListView: React.FC<CharacterListViewProps> = ({ characters }) => {
  return (
    <div className="character-list">
      <h2>Characters</h2>
      <div className="character-grid">
        {characters.map((character) => (
          <Link 
            to={`/character/edit/${character.id}`} 
            key={character.id}
            className="character-card"
          >
            <div className="character-name">{character.name}</div>
            <div className="character-details">
              <span>Level {character.name}</span>
              <span>{character.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CharacterListView;
