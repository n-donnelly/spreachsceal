import { useEffect, useState } from 'react';
import { Encyclopedia, EncyclopediaEntry } from '../../types';
import './EncyclopediaPage.css';
import RichTextEditor from '../editor/texteditor';
import { useProjectContext } from '../project/ProjectContext';

export const EncyclopediaPage: React.FC = () => {
    const { currentProject, updateProject } = useProjectContext();
    const { getNextId } = useProjectContext();

    const [encyclopedia, setEncyclopedia] = useState<Encyclopedia | null>(null);
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [newEntryKey, setNewEntryKey] = useState('');
    const [newEntryContent, setNewEntryContent] = useState('');
    const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
    const [editedKey, setEditedKey] = useState('');
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        if (currentProject && currentProject.encyclopedia) {
            setEncyclopedia(currentProject.encyclopedia);
        } else {
            setEncyclopedia({
                entries: []
            });
        }
    }, [currentProject]);

    const handleEncyclopediaUpdate = (updatedEncyclopedia: Encyclopedia) => {
        if (currentProject) {
            const updatedProject = {
                ...currentProject,
                encyclopedia: updatedEncyclopedia
            };
            updateProject(updatedProject);
            setEncyclopedia(updatedEncyclopedia);
        }
    }

    const handleAddEntry = () => {
        if (!newEntryKey.trim()) {
            alert('Please enter a key for the entry');
            return;
        }

        const newEntry: EncyclopediaEntry = {
            id: getNextId('encyclopediaEntry'), // Assuming getNextId is available in context
            key: newEntryKey.trim(),
            content: newEntryContent,
            notes: []
        };

        const updatedEncyclopedia = {
            ...encyclopedia!,
            entries: [...encyclopedia!.entries, newEntry]
        };

        setEncyclopedia(updatedEncyclopedia);
        handleEncyclopediaUpdate(updatedEncyclopedia);
        setNewEntryKey('');
        setNewEntryContent('');
        setShowAddEntry(false);
    };

    const startEditing = (entry: EncyclopediaEntry) => {
        setEditingEntryId(entry.id);
        setEditedKey(entry.key);
        setEditedContent(entry.content);
    };

    const cancelEditing = () => {
        setEditingEntryId(null);
        setEditedKey('');
        setEditedContent('');
    };

    const saveEditedEntry = () => {
        if (!editedKey.trim()) {
            alert('Entry key cannot be empty');
            return;
        }

        const updatedEntries = encyclopedia!.entries.map(entry => 
            entry.id === editingEntryId 
                ? { ...entry, key: editedKey.trim(), content: editedContent } 
                : entry
        );

        const updatedEncyclopedia = {
            ...encyclopedia!,
            entries: updatedEntries
        };

        setEncyclopedia(updatedEncyclopedia);
        handleEncyclopediaUpdate(updatedEncyclopedia);
        setEditingEntryId(null);
    };

    const deleteEntry = (entryId: number) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            const updatedEntries = encyclopedia!.entries.filter(entry => entry.id !== entryId);
            const updatedEncyclopedia = {
                ...encyclopedia!,
                entries: updatedEntries
            };
            
            setEncyclopedia(updatedEncyclopedia);
            handleEncyclopediaUpdate(updatedEncyclopedia);
        }
    };

    if (!encyclopedia) {
        return <div className="encyclopedia-not-found">Encyclopedia not found</div>;
    }

    return (
        <div className="encyclopedia-container">
            <div className="section-header">
                <h1 className="section-title">Encyclopedia</h1>
                <button 
                    className="default-button"
                    onClick={() => setShowAddEntry(!showAddEntry)}
                >
                    {showAddEntry ? 'Cancel' : 'Add Entry'}
                </button>
            </div>

            {showAddEntry && (
                <div className="add-entry-form">
                    <h2 className="form-title">New Encyclopedia Entry</h2>
                    <div className="form-group">
                        <label className="form-label">Entry Key</label>
                        <input
                            type="text"
                            value={newEntryKey}
                            onChange={(e) => setNewEntryKey(e.target.value)}
                            className="form-input"
                            placeholder="e.g., Character Name, Location, Concept"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Content</label>
                        <RichTextEditor
                            content={newEntryContent}
                            onChange={setNewEntryContent}
                            placeholder="Enter encyclopedia entry content..."
                            className="entry-editor"
                        />
                    </div>
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => setShowAddEntry(false)}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            onClick={handleAddEntry}
                            className="submit-button"
                        >
                            Add Entry
                        </button>
                    </div>
                </div>
            )}

            {encyclopedia.entries.length === 0 ? (
                <div className="empty-state">
                    <p>No encyclopedia entries yet. Add your first entry to get started.</p>
                </div>
            ) : (
                <div className="entries-grid">
                    {encyclopedia.entries.map(entry => (
                        <div key={entry.id} className="entry-card">
                            {editingEntryId === entry.id ? (
                                <div className="entry-edit-form">
                                    <input
                                        type="text"
                                        value={editedKey}
                                        onChange={(e) => setEditedKey(e.target.value)}
                                        className="edit-key-input"
                                    />
                                    <RichTextEditor
                                        content={editedContent}
                                        onChange={setEditedContent}
                                        className="edit-content-editor"
                                    />
                                    <div className="edit-actions">
                                        <button 
                                            onClick={cancelEditing}
                                            className="cancel-edit-button"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={saveEditedEntry}
                                            className="save-edit-button"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="entry-header">
                                        <h3 className="entry-key">{entry.key}</h3>
                                        <div className="entry-actions">
                                            <button 
                                                onClick={() => startEditing(entry)}
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => deleteEntry(entry.id)}
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div 
                                        className="entry-content"
                                        dangerouslySetInnerHTML={{ __html: entry.content }}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
