import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Character } from '../../types/character';
import { useProjectContext } from '../project/ProjectContext';
import { NoteFile } from '../../types';
import RichTextEditor from '../editor/texteditor';
import './character.css';

export const CharacterPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const { currentProject, updateProject } = useProjectContext();
  const { getNextId } = useProjectContext(); // Use the context to get the next ID function

  const [character, setCharacter] = useState<Character | null>(null);
  const [newAlias, setNewAlias] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedNoteTitle, setEditedNoteTitle] = useState('');
  const [editedNoteContent, setEditedNoteContent] = useState('');

  // Find the character when currentProject or characterId changes
  useEffect(() => {
        const characterIdNum = parseInt(characterId || '', 10);
        if (isNaN(characterIdNum)) {
            return;
        }
        if (currentProject && characterId) {
            const foundCharacter = currentProject.characters.find(char => char.id === characterIdNum);
            if (foundCharacter) {
                setCharacter(foundCharacter);
            }
        }
    }, [currentProject, characterId]);

    if (!currentProject) {
        return <div className="no-currentProject-selected">No Project selected</div>;
    }

    if (!character) {
        return <div>Character not found</div>;
    }

  const handleBack = () => {
    navigate(`/projects/${currentProject.id}/characters`);
  };

  const handleSaveCharacter = () => {
    if (!character) return;

    const updatedProject = {
      ...currentProject,
      characters: currentProject.characters.map(char => 
        char.id === character.id ? character : char
      )
    };
    
    updateProject(updatedProject);
    setCharacter(character);
  };

  const handleNameChange = (name: string) => {
    if (!character) return;
    const updated = { ...character, name };
    setCharacter(updated);
    handleSaveCharacter();
  };

  const handleDescriptionChange = (description: string) => {
    if (!character) return;
    const updated = { ...character, description };
    setCharacter(updated);
    handleSaveCharacter();
  };

    const handleAddAlias = () => {
        if (!newAlias.trim()) {
            alert('Please enter an alias');
            return;
        }

        if (character.aliases.includes(newAlias.trim())) {
            alert('This alias already exists');
            return;
        }

        const updated = {
            ...character,
            aliases: [...character.aliases, newAlias.trim()]
        };
        setCharacter(updated);
        setNewAlias('');
    };

    const handleRemoveAlias = (aliasToRemove: string) => {
        const updated = {
            ...character,
            aliases: character.aliases.filter(alias => alias !== aliasToRemove)
        };
        setCharacter(updated);
    };

    const handleAddNote = () => {
        if (!newNoteTitle.trim()) {
            alert('Please enter a title for the note');
            return;
        }

        const newNote: NoteFile = {
            id: getNextId('note'),
            title: newNoteTitle.trim(),
            content: newNoteContent
        };

        const updated = {
            ...character,
            notes: [...character.notes, newNote]
        };

        setCharacter(updated);

        // Reset form
        setNewNoteTitle('');
        setNewNoteContent('');
        setShowAddNote(false);
    };

    const handleDeleteNote = (noteId: number) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        const updated = {
            ...character,
            notes: character.notes.filter(note => note.id !== noteId)
        };

        setCharacter(updated);
    };

    const handleEditNote = (note: NoteFile) => {
        setEditingNoteId(note.id);
        setEditedNoteTitle(note.title);
        setEditedNoteContent(note.content);
    };

    const handleSaveEditedNote = () => {
        if (!editedNoteTitle.trim()) {
            alert('Please enter a title for the note');
            return;
        }

        const updated = {
            ...character,
            notes: character.notes.map(note => 
                note.id === editingNoteId 
                    ? { ...note, title: editedNoteTitle.trim(), content: editedNoteContent }
                    : note
            )
        };

        setCharacter(updated);

        // Reset editing state
        setEditingNoteId(null);
        setEditedNoteTitle('');
        setEditedNoteContent('');
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditedNoteTitle('');
        setEditedNoteContent('');
    };

    const handleCancelAddNote = () => {
        setShowAddNote(false);
        setNewNoteTitle('');
        setNewNoteContent('');
    };

    // Get other characters for potential relationships
    const otherCharacters = currentProject.characters.filter(char => char.id !== character.id);

    return (
        <div className="character-page-container">
            <div className="character-header">
                <button onClick={handleBack} className="back-button">
                ← Back to Characters
                </button>
                <h1>{character.name}</h1>
            </div>

            <div className="character-content">
                <div className="character-info-section">
                    <h2 className="character-section-title">Basic Information</h2>
                    
                    <div className="character-field">
                        <label htmlFor="character-name" className="character-field-label">
                            Name
                        </label>
                        <input
                            id="character-name"
                            type="text"
                            className="character-input"
                            value={character.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Character name"
                        />
                    </div>

                    <div className="character-field">
                        <label htmlFor="character-description" className="character-field-label">
                            Description
                        </label>
                        <textarea
                            id="character-description"
                            className="character-textarea"
                            value={character.description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Character description"
                        />
                    </div>

                    <div className="aliases-section">
                        <label className="character-field-label">Aliases</label>
                        
                        {character.aliases.length > 0 && (
                            <div className="aliases-list">
                                {character.aliases.map((alias, index) => (
                                    <span key={index} className="alias-tag">
                                        {alias}
                                        <button
                                            className="alias-remove"
                                            onClick={() => handleRemoveAlias(alias)}
                                            title="Remove alias"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="alias-input-container">
                            <input
                                type="text"
                                className="alias-input"
                                placeholder="Add alias"
                                value={newAlias}
                                onChange={(e) => setNewAlias(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddAlias();
                                    }
                                }}
                            />
                            <button
                                className="add-alias-button"
                                onClick={handleAddAlias}
                                disabled={!newAlias.trim()}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relationships-section">
                    <h2 className="character-section-title">Relationships</h2>
                    
                    {otherCharacters.length > 0 ? (
                        <div className="relationships-list">
                            {otherCharacters.map((otherChar) => {
                                const relationship = character.relationships?.get?.(otherChar.id) || '';
                                return (
                                    <div key={otherChar.id} className="relationship-item">
                                        <div className="relationship-character">{otherChar.name}</div>
                                        <input
                                            type="text"
                                            className="character-input"
                                            placeholder="Describe relationship..."
                                            value={relationship}
                                            onChange={(e) => {
                                                const newRelationships = new Map(character.relationships);
                                                if (e.target.value.trim()) {
                                                    newRelationships.set(otherChar.id, e.target.value);
                                                } else {
                                                    newRelationships.delete(otherChar.id);
                                                }
                                                const updated = {
                                                    ...character,
                                                    relationships: newRelationships
                                                };
                                                setCharacter(updated);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="empty-notes">
                            No other characters to create relationships with yet.
                        </p>
                    )}
                </div>
            </div>

            <div className="notes-section">
                <div className="notes-header">
                    <h2 className="character-section-title">Character Notes</h2>
                    <button 
                        className="add-note-button"
                        onClick={() => setShowAddNote(true)}
                    >
                        Add Note
                    </button>
                </div>

                {showAddNote && (
                    <div className="add-note-form">
                        <h3 className="add-note-form-title">Add New Note</h3>
                        
                        <div className="add-note-field">
                            <label htmlFor="note-title" className="add-note-label">
                                Title *
                            </label>
                            <input
                                id="note-title"
                                type="text"
                                className="add-note-input"
                                placeholder="Note title"
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                            />
                        </div>

                        <div className="add-note-field">
                            <label htmlFor="note-content" className="add-note-label">
                                Content
                            </label>
                            <RichTextEditor
                                content={newNoteContent}
                                onChange={setNewNoteContent}
                                placeholder="Note content..."
                                className="note-editor"
                            />
                        </div>

                        <div className="add-note-actions">
                            <button 
                                className="add-note-cancel-button"
                                onClick={handleCancelAddNote}
                            >
                                Cancel
                            </button>
                            <button 
                                className="add-note-save-button"
                                onClick={handleAddNote}
                                disabled={!newNoteTitle.trim()}
                            >
                                Add Note
                            </button>
                        </div>
                    </div>
                )}

                <div className="notes-list">
                    {character.notes.length > 0 ? (
                        character.notes.map((note) => (
                            <div key={note.id} className="note-item">
                                {editingNoteId === note.id ? (
                                    <div>
                                        <div className="add-note-field">
                                            <label className="add-note-label">Title *</label>
                                            <input
                                                type="text"
                                                className="add-note-input"
                                                value={editedNoteTitle}
                                                onChange={(e) => setEditedNoteTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="add-note-field">
                                            <label className="add-note-label">Content</label>
                                            <RichTextEditor
                                                content={editedNoteContent}
                                                onChange={setEditedNoteContent}
                                                placeholder="Note content..."
                                                className="note-editor"
                                            />
                                        </div>
                                        <div className="add-note-actions">
                                            <button 
                                                className="add-note-cancel-button"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                className="add-note-save-button"
                                                onClick={handleSaveEditedNote}
                                                disabled={!editedNoteTitle.trim()}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="outline-note-header">
                                            <h3 className="note-title">{note.title}</h3>
                                            <div className="outline-note-actions">
                                                <button 
                                                    className="outline-note-edit-button"
                                                    onClick={() => handleEditNote(note)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="outline-note-delete-button"
                                                    onClick={() => handleDeleteNote(note.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div 
                                            className="note-content"
                                            dangerouslySetInnerHTML={{ __html: note.content || '<p>No content</p>' }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-notes">
                            No notes yet. Click "Add Note" to create your first character note.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
