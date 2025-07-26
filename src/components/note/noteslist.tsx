
import React, { useEffect, useState } from 'react';
import { NoteFile } from '../../types';
import NoteCard from './notecard';
import './notes.css';
import { useNavigate } from 'react-router-dom';
import { useProject, useProjectContext } from '../project/ProjectContext';

const NotesList: React.FC = () => {
    const navigate = useNavigate();
    const { project, updateProject } = useProject();
    const { getNextId } = useProjectContext();
    const [notes, setNotes] = useState<NoteFile[]>( []);
    const [showNewNoteForm, setShowNewNoteForm] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    useEffect(() => {
        if (project) {
            setNotes(project.notes || []);
        } else {
            setNotes([]);
        }
    }, [project]);

    if (!project) {
        return <div className="no-project-selected">No project selected</div>;
    }
    const onNoteDelete = (noteId: number) => {
        const updatedProject = {
            ...project,
            notes: project.notes.filter((note) => note.id !== noteId)
        };
        updateProject(updatedProject);
        setNotes(updatedProject.notes);
    };

    const onNoteEdit = (updatedNote: NoteFile) => {
        const updatedProject = {
            ...project,
            notes: project.notes.map(note => 
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
            ...project,
            notes: [...project.notes, newNote]
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
