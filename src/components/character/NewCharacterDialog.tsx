import React, { useState } from 'react';
import { getProject, saveProject } from '../../data/storage';
import { Character } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    projectId: string;
    onClose: () => void;
    onCreated: () => void;
}

export const NewCharacterDialog: React.FC<Props> = ({ projectId, onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');
    const [relationships, setRelationships] = useState<Map<string, string>>(new Map());

    const handleCreate = ()=> {
        const project = getProject(projectId);
        if (!project) {
            console.error('Project not found');
            alert('Project not found');
            return;
        }

        const newCharacter: Character = {
            id: uuidv4(),
            name,
            notes,
            description,
            relationships,
        };

        project.characters.push(newCharacter);
        saveProject(project);
        onCreated();
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">New Character</h2>
                <input
                className="w-full p-2 border rounded mb-3"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <textarea
                className="w-full p-2 border rounded mb-4"
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
                <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create
                </button>
                </div>
            </div>
        </div>
    );
};