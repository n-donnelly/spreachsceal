
import React, { useState } from 'react';
import { NoteFile, Project } from '../../types';
import NoteCard from './notecard';
import './notes.css';

interface NotesListProps {
  project: Project | null;
  onProjectUpdate: (project: Project) => void;
}

const NotesList: React.FC<NotesListProps> = ({ project, onProjectUpdate }) => {
    const [showNewNoteForm, setShowNewNoteForm] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    if (!project) {
        return <div>No project selected</div>;
    }

    var notes = project?.notes || [];
    console.log("Notes: " + notes);
    
    const onNoteDelete = (noteId: string) => {
        const updatedProject = { 
            ...project, 
            notes: project.notes.filter((note) => note.id !== noteId) };
        onProjectUpdate(updatedProject);
    };

    const onNoteEdit = (updatedNote: NoteFile) => {
        const updatedProject = {
            ...project,
            notes: project.notes.map(note => 
                note.id === updatedNote.id ? updatedNote : note
            )
        };
        onProjectUpdate(updatedProject);
    };

    const handleAddNote = () => {
        if (!newNoteTitle.trim()) {
            alert('Please enter a title for the note');
            return;
        }

        const newNote: NoteFile = {
            id: crypto.randomUUID(),
            title: newNoteTitle,
            content: newNoteContent
        };

        const updatedProject = {
            ...project,
            notes: [...project.notes, newNote]
        };

        onProjectUpdate(updatedProject);
        notes.push(newNote);
        
        // Reset form
        setNewNoteTitle('');
        setNewNoteContent('');
        setShowNewNoteForm(false);
    };

    return (
        <div className="notes-list-container">
            <div className="notes-header">
                <h2>Notes</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowNewNoteForm(!showNewNoteForm)}
                >
                    {showNewNoteForm ? 'Cancel' : 'Add Note'}
                </button>
            </div>

            {showNewNoteForm && (
                <div className="new-note-form">
                    <input
                        type="text"
                        placeholder="Note Title"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        className="new-note-title"
                    />
                    <textarea
                        placeholder="Note Content"
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        className="new-note-content"
                    />
                    <div className="new-note-actions">
                        <button 
                            className="btn btn-text"
                            onClick={() => {
                                setShowNewNoteForm(false);
                                setNewNoteTitle('');
                                setNewNoteContent('');
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={handleAddNote}
                        >
                            Add Note
                        </button>
                    </div>
                </div>
            )}

            <div className="notes-list">
                {notes.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={onNoteDelete}
                    onEdit={onNoteEdit}
                />
                ))}
            </div>
        </div>
  );
};

export default NotesList;
