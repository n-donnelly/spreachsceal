import { useCallback, useEffect, useState } from 'react';
import { NoteFile, Outline } from '../../types';
import RichTextEditor from '../editor/texteditor';
import NoteCard from '../note/notecard';
import { debounce } from '../../utils';

interface OutlinePageProps {
    project: any;
    onProjectUpdate: (project: any) => void;
}

export const OutlinePage: React.FC<OutlinePageProps> = ({ project, onProjectUpdate }) => {
    const [outline, setOutline] = useState<Outline | null>(null);
    const [showAddNote, setShowAddNote] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

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
                onProjectUpdate(updatedProject);
                console.log('Outline updated:', updatedProject);
            }
        }, 1000), // Adjust the debounce delay as needed
        [project, onProjectUpdate]
    )

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
                id: crypto.randomUUID(),
                title: newNoteTitle,
                content: newNoteContent
            };

            const updatedOutline = {
                ...outline,
                notes: [...outline.notes, newNote]
            };

            // Update project with new outline
            const updatedProject = {
                ...project,
                outline: updatedOutline
            };
            onProjectUpdate(updatedProject);
            
            // Reset form
            setNewNoteTitle('');
            setNewNoteContent('');
            setShowAddNote(false);
        }
    };

    const handleDeleteNote = (noteId: string) => {
        if (outline && project) {
            const updatedOutline = {
                ...outline,
                notes: outline.notes.filter(note => note.id !== noteId)
            };

            // Update project with new outline
            const updatedProject = {
                ...project,
                outline: updatedOutline
            };
            onProjectUpdate(updatedProject);
            setOutline(updatedOutline);
        }
    };

    const handleEditNote = (updatedNote: NoteFile) => {
        if (outline && project) {
            const updatedOutline = {
                ...outline,
                notes: outline.notes.map(note => 
                    note.id === updatedNote.id ? updatedNote : note
                )
            };

            // Update project with new outline
            const updatedProject = {
                ...project,
                outline: updatedOutline
            };
            onProjectUpdate(updatedProject);
            setOutline(updatedOutline);
        }
    };

    if (!outline) {
        return <div className="p-6">Outline not found</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Outline</h2>                
            </div>

            {/* Main outline content editor */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-3">Story Outline</h3>
                <RichTextEditor 
                    content={outline.content} 
                    onChange={handleContentChange}
                    placeholder="Start writing your outline here..."
                    className="min-h-[300px]"
                />
            </div>

            <div className="flex space-x-2">
                <button 
                    onClick={() => setShowAddNote(!showAddNote)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {showAddNote ? 'Cancel' : 'Add Note'}
                </button>
            </div>

            {/* Add note form */}
            {showAddNote && (
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-3">Add Note</h3>
                    <input
                        className="w-full p-2 border rounded mb-3"
                        placeholder="Note Title"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                    />
                    <RichTextEditor 
                        content={newNoteContent} 
                        onChange={setNewNoteContent}
                        placeholder="Note content..."
                        className="min-h-[150px] mb-3"
                    />
                    <div className="flex justify-end">
                        <button 
                            onClick={handleAddNote}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Save Note
                        </button>
                    </div>
                </div>
            )}

            {/* Notes section */}
            {outline.notes.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Notes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {outline.notes.map(note => (
                            <NoteCard 
                                key={note.id} 
                                note={note} 
                                onDelete={handleDeleteNote}
                                onEdit={handleEditNote}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
