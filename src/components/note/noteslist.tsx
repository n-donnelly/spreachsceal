
import React, { useEffect, useState } from 'react';
import { NoteFile } from '../../types';
import NoteCard from './notecard';
import './notes.css';
import { useProjectContext } from '../project/ProjectContext';

const NotesList: React.FC = () => {
    const { currentProject, updateProject } = useProjectContext();
    const { getNextId } = useProjectContext();
    const [notes, setNotes] = useState<NoteFile[]>( []);
    const [showNewNoteForm, setShowNewNoteForm] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    useEffect(() => {
        if (currentProject) {
            setNotes(currentProject.notes || []);
        } else {
            setNotes([]);
        }
    }, [currentProject]);

    if (!currentProject) {
        return <div className="no-project-selected">No project selected</div>;
    }
    const onNoteDelete = (noteId: number) => {
        const updatedProject = {
            ...currentProject,
            notes: currentProject.notes.filter((note) => note.id !== noteId)
        };
        updateProject(updatedProject);
        setNotes(updatedProject.notes);
    };

    const onNoteEdit = (updatedNote: NoteFile) => {
        const updatedProject = {
            ...currentProject,
            notes: currentProject.notes.map(note => 
                note.id === updatedNote.id ? updatedNote : note
            )
        };
        updateProject(updatedProject);
        setNotes(updatedProject.notes);
    };

    const handleAddNote = () => {
        if (!newNoteTitle.trim()) {
            alert('Please enter a title for the note');
            return;
        }

        const newNote: NoteFile = {
            id: getNextId('note'),
            title: newNoteTitle,
            content: newNoteContent
        };

        const updatedProject = {
            ...currentProject,
            notes: [...currentProject.notes, newNote]
        };

        updateProject(updatedProject);
        setNotes(updatedProject.notes);

        // Reset form
        setNewNoteTitle('');
        setNewNoteContent('');
        setShowNewNoteForm(false);
    };

    return (
        <div className="notes-list-container">
            <div className="section-header">
                <h1 className="section-title">Notes</h1>
                <button 
                    className="default-button"
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
                            className="default-negative-button"
                            onClick={() => {
                                setShowNewNoteForm(false);
                                setNewNoteTitle('');
                                setNewNoteContent('');
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            className="default-button"
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
