import { useState } from 'react';
import { EncyclopediaEntry } from '../../types';
import RichTextEditor from '../editor/texteditor';

interface EntryCardProps {
    entry: EncyclopediaEntry;
    onEdit: (entry: EncyclopediaEntry) => void;
    onDelete: (entryId: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedKey, setEditedKey] = useState(entry.key);
    const [editedContent, setEditedContent] = useState(entry.content);

    const handleSave = () => {
        if (!editedKey.trim()) {
            alert('Entry key cannot be empty');
            return;
        }

        onEdit({
            ...entry,
            key: editedKey.trim(),
            content: editedContent
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedKey(entry.key);
        setEditedContent(entry.content);
        setIsEditing(false);
    };

    const confirmDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${entry.key}"?`)) {
            onDelete(entry.id);
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            {isEditing ? (
                <div className="space-y-3">
                    <input
                        type="text"
                        value={editedKey}
                        onChange={(e) => setEditedKey(e.target.value)}
                        className="w-full p-2 border rounded font-semibold"
                    />
                    <RichTextEditor
                        content={editedContent}
                        onChange={setEditedContent}
                        className="min-h-[150px]"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button 
                            onClick={handleCancel}
                            className="px-3 py-1 text-gray-700 border rounded text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{entry.key}</h3>
                        <div className="flex space-x-1">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div 
                        className="prose prose-sm"
                        dangerouslySetInnerHTML={{ __html: entry.content }}
                    />
                </>
            )}
        </div>
    );
};
