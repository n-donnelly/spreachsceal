import React, { useState, useEffect } from 'react';
import { Location } from '../../types/location';
import { Project } from '../../types/project';
import { NoteFile } from '../../types/notes';
import { saveProject } from '../../data/storage';
import RichTextEditor from '../editor/texteditor';
import './Location.css';
import '../../styles/shared.css';

interface LocationPageProps {
    location: Location;
    project: Project;
    onLocationUpdate: (location: Location) => void;
    onDeselect: () => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({
    location,
    project,
    onLocationUpdate,
    onDeselect
}) => {
    const [editedLocation, setEditedLocation] = useState<Location>(location);
    const [showAddNote, setShowAddNote] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editedNoteTitle, setEditedNoteTitle] = useState('');
    const [editedNoteContent, setEditedNoteContent] = useState('');

    useEffect(() => {
        setEditedLocation(location);
    }, [location]);

    const handleSaveLocation = () => {
        onLocationUpdate(editedLocation);
        saveProject({
            ...project,
            locations: project.locations.map(loc => 
                loc.id === editedLocation.id ? editedLocation : loc
            )
        });
    };

    const handleNameChange = (name: string) => {
        const updated = { ...editedLocation, name };
        setEditedLocation(updated);
        onLocationUpdate(updated);
    };

    const handleDescriptionChange = (description: string) => {
        const updated = { ...editedLocation, description };
        setEditedLocation(updated);
        onLocationUpdate(updated);
    };

    const handleAddNote = () => {
        if (!newNoteTitle.trim()) {
            alert('Please enter a title for the note');
            return;
        }

        const newNote: NoteFile = {
            id: crypto.randomUUID(),
            title: newNoteTitle.trim(),
            content: newNoteContent
        };

        const updated = {
            ...editedLocation,
            notes: [...editedLocation.notes, newNote]
        };

        setEditedLocation(updated);
        onLocationUpdate(updated);

        // Reset form
        setNewNoteTitle('');
        setNewNoteContent('');
        setShowAddNote(false);
    };

    const handleDeleteNote = (noteId: string) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        const updated = {
            ...editedLocation,
            notes: editedLocation.notes.filter(note => note.id !== noteId)
        };

        setEditedLocation(updated);
        onLocationUpdate(updated);
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
            ...editedLocation,
            notes: editedLocation.notes.map(note => 
                note.id === editingNoteId 
                    ? { ...note, title: editedNoteTitle.trim(), content: editedNoteContent }
                    : note
            )
        };

        setEditedLocation(updated);
        onLocationUpdate(updated);

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
                <button onClick={onDeselect} className="back-button">
                    ← Back to Locations
                </button>
                <h1 className="location-page-title">{editedLocation.name}</h1>
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
                            value={editedLocation.name}
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
                            value={editedLocation.description}
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
                    {editedLocation.notes.length > 0 ? (
                        editedLocation.notes.map((note) => (
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
