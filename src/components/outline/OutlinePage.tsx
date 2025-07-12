import React, { useState, useEffect, useCallback } from 'react';
import { Outline } from '../../types/outline';
import { NoteFile } from '../../types/notes';
import { saveProject } from '../../data/storage';
import RichTextEditor from '../editor/texteditor';
import './Outline.css';
import { debounce } from '../../utils';
import { useProject } from '../project/ProjectContext';

export const OutlinePage: React.FC = () => {
    const { project, updateProject } = useProject();
    const [outline, setOutline] = useState<Outline | null>(null);
    const [showAddNote, setShowAddNote] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editedNoteTitle, setEditedNoteTitle] = useState('');
    const [editedNoteContent, setEditedNoteContent] = useState('');

    useEffect(() => {
        if (project && project.outline) {
            setOutline(project.outline);
        } else {
            setOutline({
                content: '',
                notes: []
            });
        }
    }, [project]);

    const debouncedUpdateOutline = useCallback(
        debounce((updatedOutline: Outline) => {
            if (project) {
                const updatedProject = {
                    ...project,
                    outline: updatedOutline
                };
                updateProject(updatedProject);
                saveProject(updatedProject);
                console.log('Outline updated:', updatedProject);
            }
        }, 1000),
        [project, updateProject]
    );

    if (!project) {
        return <div className="no-project-selected">No project selected</div>;
    }

    const handleContentChange = (content: string) => {
        if (outline && project) {
            const updatedOutline = {
                ...outline,
                content
            };
            setOutline(updatedOutline);
            debouncedUpdateOutline(updatedOutline);
        }
    };

    const handleAddNote = () => {
        if (!newNoteTitle.trim()) {
            alert('Please enter a title for the note');
            return;
        }

        if (outline && project) {
            const newNote: NoteFile = {
                id: project.nextIds.note++,
                title: newNoteTitle.trim(),
                content: newNoteContent
            };

            const updatedOutline = {
                ...outline,
                notes: [...outline.notes, newNote]
            };

            const updatedProject = {
                ...project,
                outline: updatedOutline
            };

            setOutline(updatedOutline);
            updateProject(updatedProject);

            // Reset form
            setNewNoteTitle('');
            setNewNoteContent('');
            setShowAddNote(false);
        }
    };

    const handleDeleteNote = (noteId: number) => {
        if (!outline || !project) return;

        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        const updatedOutline = {
            ...outline,
            notes: outline.notes.filter(note => note.id !== noteId)
        };

        const updatedProject = {
            ...project,
            outline: updatedOutline
        };

        setOutline(updatedOutline);
        updateProject(updatedProject);
    };

    const handleEditNote = (note: NoteFile) => {
        setEditingNoteId(note.id);
        setEditedNoteTitle(note.title);
        setEditedNoteContent(note.content);
    };

    const handleSaveEditedNote = () => {
        if (!outline || !project || !editingNoteId) return;

        if (!editedNoteTitle.trim()) {
            alert('Please enter a title for the note');
            return;
        }

        const updatedOutline = {
            ...outline,
            notes: outline.notes.map(note => 
                note.id === editingNoteId 
                    ? { ...note, title: editedNoteTitle.trim(), content: editedNoteContent }
                    : note
            )
        };

        const updatedProject = {
            ...project,
            outline: updatedOutline
        };

        setOutline(updatedOutline);
        updateProject(updatedProject);

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
        <div className="outline-page-container">
            <div className="section-header">
                <h1 className="section-title">Project Outline</h1>
            </div>

            <div className="outline-content">
                <RichTextEditor
                    content={outline?.content || ''}
                    onChange={handleContentChange}
                    placeholder="Start writing your outline here..."
                    className="outline-editor"
                />

                <div className="outline-notes-section">
                    <div className="outline-notes-header">
                        <h2 className="outline-section-title">Outline Notes</h2>
                        <button 
                            className="add-outline-note-button"
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
                                <textarea
                                    id="note-content"
                                    className="add-note-textarea"
                                    placeholder="Note content"
                                    value={newNoteContent}
                                    onChange={(e) => setNewNoteContent(e.target.value)}
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

                    <div className="outline-notes-list">
                        {outline && outline.notes.length > 0 ? (
                            outline.notes.map((note) => (
                                <div key={note.id} className="outline-note-card">
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
                                                <textarea
                                                    className="add-note-textarea"
                                                    value={editedNoteContent}
                                                    onChange={(e) => setEditedNoteContent(e.target.value)}
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
                                                <h3 className="outline-note-title">{note.title}</h3>
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
                                                className="outline-note-content"
                                                dangerouslySetInnerHTML={{ __html: note.content || '<p>No content</p>' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-outline-notes">
                                No notes yet. Click "Add Note" to create your first outline note.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
