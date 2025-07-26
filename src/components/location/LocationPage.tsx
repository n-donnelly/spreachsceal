import React, { useState, useEffect } from 'react';
import { Location } from '../../types/location';
import { NoteFile } from '../../types/notes';
import { saveProject } from '../../data/storage';
import RichTextEditor from '../editor/texteditor';
import './Location.css';
import '../../styles/shared.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject, useProjectContext } from '../project/ProjectContext';

export const LocationPage: React.FC = () => {
    const { locationId } = useParams<{ locationId: string }>();
    const navigate = useNavigate();
    const { project, updateProject } = useProject();
    const { getNextId } = useProjectContext();

    const [location, setLocation] = useState<Location | null>(null);
    const [showAddNote, setShowAddNote] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editedNoteTitle, setEditedNoteTitle] = useState('');
    const [editedNoteContent, setEditedNoteContent] = useState('');

    useEffect(() => {
        const locationIdNum = parseInt(locationId || '0', 10);
        if (isNaN(locationIdNum)) {
            return;
        }
        if (project && locationId) {
            const foundLocation = project.locations.find(loc => loc.id === locationIdNum);
            if (foundLocation) {
                setLocation(foundLocation);
            }
        }
    }, [location]);

    if (!project) {
        return <div className="no-project-selected">No project selected</div>;
    }

    if (!location) {
        return <div>Location not found</div>;
    }

    const handleBack = () => {
        navigate(`/projects/${project.id}/locations`);
    };

    const handleSaveLocation = () => {
        if (!location) {
            return;
        }

        const updatedProject = {
            ...project,
            locations: project.locations.map(loc => 
                loc.id === location.id ? location : loc
            )
        };

        updateProject(updatedProject);
        saveProject(updatedProject);
        setLocation(location);
    };

    const handleNameChange = (name: string) => {
        if (!location) return;
        const updated = { ...location, name };
        setLocation(updated);
        handleSaveLocation();
    };

    const handleDescriptionChange = (description: string) => {
        if (!location) return;
        const updated = { ...location, description };
        setLocation(updated);
        handleSaveLocation();
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
            ...location,
            notes: [...location.notes, newNote]
        };

        setLocation(updated);

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
            ...location,
            notes: location.notes.filter(note => note.id !== noteId)
        };

        setLocation(updated);
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
            ...location,
            notes: location.notes.map(note => 
                note.id === editingNoteId 
                    ? { ...note, title: editedNoteTitle.trim(), content: editedNoteContent }
                    : note
            )
        };

        setLocation(updated);

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

    return (
        <div className="location-page-container">
            <div className="location-page-header">
                <button onClick={handleBack} className="back-button">
                    ← Back to Locations
                </button>
                <h1 className="location-page-title">{location.name}</h1>
            </div>

            <div className="location-content">
                <div className="location-info-section">
                    <h2 className="location-section-title">Location Information</h2>
                    
                    <div className="location-field">
                        <label htmlFor="location-name" className="location-field-label">
                            Name
                        </label>
                        <input
                            id="location-name"
                            type="text"
                            className="location-input"
                            value={location.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Location name"
                        />
                    </div>

                    <div className="location-field">
                        <label htmlFor="location-description" className="location-field-label">
                            Description
                        </label>
                        <textarea
                            id="location-description"
                            className="location-textarea"
                            value={location.description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Location description"
                        />
                    </div>
                </div>
            </div>

            <div className="notes-section">
                <div className="notes-header">
                    <h2 className="location-section-title">Location Notes</h2>
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
                    {location.notes.length > 0 ? (
                        location.notes.map((note) => (
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
                            No notes yet. Click "Add Note" to create your first location note.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
